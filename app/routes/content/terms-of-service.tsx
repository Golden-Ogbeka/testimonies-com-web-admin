import { useEffect, useState } from "react";
import { AdminContentApi } from "../../api/adminContent";
import PageHeader from "../../common/page-header";
import { sendCatchFeedback, sendSuccessFeedback } from "../../functions/feedback";
import type { SystemContentItem } from "../../types";

export function meta() {
  return [
    { title: "Terms of service | Testimonies Admin" },
    { name: "description", content: "Manage the terms of service content." },
  ];
}

export default function TermsOfServicePage() {
  const [content, setContent] = useState<SystemContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [version, setVersion] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminContentApi.getTermsOfService();
        setContent(data.data);
        setTitle(data.data.title);
        setBody(data.data.content);
        setVersion(data.data.version || "");
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await AdminContentApi.updateTermsOfService({
        title,
        content: body,
        version: version || undefined,
      });
      setContent(data.data);
      sendSuccessFeedback("Terms of service updated successfully");
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Terms of service"
        description="Update the terms of service displayed to users."
        actions={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        }
      />

      <div className="card">
        <div className="space-y-4">
          <div className="inputContainer">
            <label htmlFor="tos-title">Title</label>
            <input
              id="tos-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="tos-version">Version (optional)</label>
            <input
              id="tos-version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., 1.0.0"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="tos-content">Content</label>
            <textarea
              id="tos-content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              className="font-mono text-xs"
            />
          </div>
          {content && (
            <div className="text-xs text-gray-500">
              Last updated: {new Date(content.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
