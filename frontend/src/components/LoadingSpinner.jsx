export default function LoadingSpinner({ className = '', ariaLabel = 'Yükleniyor' }) {
  return (
    <div
      className={`w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label={ariaLabel}
    />
  );
}
