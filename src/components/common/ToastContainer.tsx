import React from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEcommerce();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg border text-sm transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-stone-900 text-stone-100 border-stone-800'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : 'bg-stone-800 text-stone-100 border-stone-700'
          }`}
          role="alert"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}

          <p className="flex-1 font-medium leading-snug">{toast.message}</p>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-white p-0.5 rounded focus:outline-none"
            aria-label="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
