import { ButtonHTMLAttributes, ReactNode } from 'react';

interface LoaderButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

export function LoaderButton({
  children,
  className = '',
  disabled = false,
  isLoading = false,
  loadingText = 'Chargement...',
  type = 'button',
  ...props
}: LoaderButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
