import type { DisasterCase } from "@/types";

interface AdminCaseBrowserProps {
  cases: DisasterCase[];
  selectedCase?: DisasterCase;
  selectedId: string;
  onChoose: (item: DisasterCase) => void;
  onRefresh: () => void;
  onCreate: () => void;
}

export default function AdminCaseBrowser({
  cases,
  selectedCase,
  selectedId,
  onChoose,
  onRefresh,
  onCreate,
}: AdminCaseBrowserProps) {
  return (
    <>
      <div className="admin-mobile-case-select">
        <div className="admin-mobile-case-select__top">
          <div>
            <span className="admin-sidebar__label">Kasus aktif</span>
            <strong>{selectedCase?.title ?? "Kasus baru"}</strong>
            <span>{selectedCase?.affectedArea ?? "Lengkapi informasi kasus"}</span>
          </div>
          <button className="button-secondary" onClick={onRefresh} type="button">
            Sinkronisasi
          </button>
        </div>
        <div className="admin-mobile-case-select__actions">
          <label className="admin-field">
            <span className="admin-sidebar__label">Pilih kasus</span>
            <select
              aria-label="Pilih kasus demo"
              onChange={(event) => {
                const item = cases.find((candidate) => candidate.id === event.target.value);
                if (item) onChoose(item);
              }}
              value={selectedId}
            >
              <option value="">Pilih kasus demo</option>
              {cases.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </label>
          <button className="button-primary" onClick={onCreate} type="button">
            Buat Kasus Baru
          </button>
        </div>
      </div>

      <section className="admin-card admin-case-list" id="case-list">
        <div className="admin-case-list__heading">
          <h2>Daftar Kasus Kebencanaan</h2>
          <button className="text-link" onClick={onRefresh} type="button">
            Sinkronisasi
          </button>
        </div>
        {cases.map((item) => (
          <button
            className={`admin-case-option ${item.id === selectedId ? "is-selected" : ""}`}
            key={item.id}
            onClick={() => onChoose(item)}
            type="button"
          >
            <strong>{item.title}</strong>
            <span>{item.affectedArea}</span>
            <span>{item.status === "PUBLISHED" ? "Published" : "Draft"}</span>
          </button>
        ))}
        <button className="button-secondary" onClick={onCreate} type="button">
          Buat Kasus Baru
        </button>
        <div className="admin-integrity" id="integrity">
          <h2>Prosedur Integritas Data Admin</h2>
          <ol>
            <li>Catat informasi berdasarkan dokumen resmi.</li>
            <li>Pisahkan alokasi, penyaluran, realisasi, dan rencana.</li>
            <li>Periksa sumber sebelum mengubah status publikasi.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
