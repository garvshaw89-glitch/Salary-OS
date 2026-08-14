import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-sans">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-2.5 rounded border p-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 bg-slate-900/95 ${
            toast.type === 'success'
              ? 'border-l-4 border-l-emerald-500 border-slate-800'
              : toast.type === 'error'
              ? 'border-l-4 border-l-rose-500 border-slate-800'
              : 'border-l-4 border-l-indigo-500 border-slate-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs">
            <p className="font-bold text-slate-100">{toast.title}</p>
            {toast.message && <p className="text-slate-400 mt-0.5 text-[11px] leading-tight">{toast.message}</p>}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-500 hover:text-slate-300 p-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
