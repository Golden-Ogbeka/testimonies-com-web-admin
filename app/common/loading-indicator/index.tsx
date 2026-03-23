interface LoadingIndicatorProps {
  text?: string;
  size?: number;
}

const LoadingIndicator = ({ text, size = 32 }: LoadingIndicatorProps) => {
  const dimension = `${size}px`;

  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      data-testid="loading-container"
    >
      <div
        className="rounded-full border border-primary/20 border-t-primary animate-spin"
        style={{ width: dimension, height: dimension, animationDuration: '1s' }}
        data-testid="loader"
      />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingIndicator;
