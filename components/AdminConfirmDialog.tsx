import { motion, useReducedMotion } from "motion/react";

interface AdminConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  shouldReduceMotion?: boolean | null;
}

export default function AdminConfirmDialog({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
  shouldReduceMotion: reducedMotionOverride,
}: AdminConfirmDialogProps) {
  const systemPrefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotionOverride ?? systemPrefersReducedMotion;

  return (
    <motion.div
      className="admin-modal-backdrop"
      initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <motion.section
        aria-describedby="admin-confirm-description"
        aria-labelledby="admin-confirm-title"
        aria-modal="true"
        className="admin-modal admin-confirm-dialog"
        role="alertdialog"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.985 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
      >
        <span className="admin-confirm-dialog__icon" aria-hidden="true">
          !
        </span>
        <h2 id="admin-confirm-title">{title}</h2>
        <p id="admin-confirm-description">{description}</p>
        <div className="admin-modal__actions">
          <button className="button-secondary" onClick={onCancel} type="button">
            Batal
          </button>
          <button
            className="admin-confirm-dialog__confirm"
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
