import LoadingIndicator from '../loading-indicator';

const FullPageLoader = () => {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm"
      data-testid="full-page-loader"
    >
      <LoadingIndicator size={64} />
    </div>
  );
};

export default FullPageLoader;
