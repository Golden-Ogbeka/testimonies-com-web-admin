import { AxiosError } from 'axios';
import { toast, type TypeOptions } from 'react-toastify';

type Message = string;

export const sendFeedback = (message: Message, type: TypeOptions = 'info') => {
  toast(message, {
    type,
    toastId: 'global-toast',
  });
};

export const sendSuccessFeedback = (message: Message) => {
  toast.success(message, { toastId: 'global-toast' });
};

export const sendCatchFeedback = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | {
          message?: string;
          code?: string;
          error?: string;
          detail?: string;
        }
      | undefined;

    const message =
      responseData?.detail ??
      responseData?.message ??
      responseData?.error ??
      'Request unsuccessful';

    toast.error(message, { toastId: 'global-toast' });
  } else if (error instanceof Error) {
    toast.error(error.message, { toastId: 'global-toast' });
  } else {
    toast.error('An unknown error occurred', { toastId: 'global-toast' });
  }
};
