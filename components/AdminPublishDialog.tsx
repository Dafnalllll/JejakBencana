interface AdminPublishDialogProps {
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AdminPublishDialog({
  saving,
  onCancel,
  onConfirm,
}: AdminPublishDialogProps) {
  return (
    <div
      className="admin-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onCancel();
      }}
    >
      <section
        aria-labelledby="publish-title"
        aria-modal="true"
        className="admin-modal"
        role="dialog"
      >
        <h2 id="publish-title">Validasi Publikasi Kasus</h2>
        <p>
          Publikasikan data contoh ini ke penyimpanan lokal demo? Pastikan
          informasi bersumber dari dokumen resmi. Data tidak dikirim ke
          backend atau layanan publik.
        </p>
        <div className="admin-modal__actions">
          <button className="button-secondary" disabled={saving} onClick={onCancel} type="button">
            Batal
          </button>
          <button className="button-primary" disabled={saving} onClick={onConfirm} type="button">
            {saving ? "Menerbitkan…" : "Ya, Terbitkan Data"}
          </button>
        </div>
      </section>
    </div>
  );
}
