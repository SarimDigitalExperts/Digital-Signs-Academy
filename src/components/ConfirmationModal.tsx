import React, { useEffect } from 'react';
import { AlertTriangle, Send, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  unansweredCount: number;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  unansweredCount,
  isSubmitting = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          {!isSubmitting && (
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <h3 id="confirm-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
          Are you sure you want to submit your examination?
        </h3>

        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          After submission, your responses will be recorded officially and you will not be able to change your answers.
        </p>

        {unansweredCount > 0 ? (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Notice:</strong> You have{' '}
              <span className="font-bold underline">{unansweredCount}</span> unanswered question
              {unansweredCount === 1 ? '' : 's'}. You can still submit now or return to complete them.
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
            <span>✓ All questions have recorded responses.</span>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="btnConfirmFinalSubmit"
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Submitting Exam...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Yes, Submit Exam</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
