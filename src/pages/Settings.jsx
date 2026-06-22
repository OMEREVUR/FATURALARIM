import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useTheme } from '../store/ThemeContext';

const THEMES = [
  { value: 'system', label: 'Sistem' },
  { value: 'light', label: 'Açık' },
  { value: 'dark', label: 'Koyu' },
];

export default function Settings() {
  const { jobTypes, addJobType, deleteJobType } = useApp();
  const { theme, setTheme } = useTheme();
  const [newType, setNewType] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    addJobType(newType);
    setNewType('');
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Ayarlar</h1>
      </header>

      <section className="section">
        <h2 className="section-title">Tema</h2>
        <div className="segmented">
          {THEMES.map((t) => (
            <button
              key={t.value}
              className={theme === t.value ? 'active' : ''}
              onClick={() => setTheme(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">İş Tipleri</h2>
        <form className="inline-form" onSubmit={handleAdd}>
          <input
            className="input"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Örn: Cam Temizliği"
          />
          <button className="btn btn-primary" type="submit">Ekle</button>
        </form>

        {jobTypes.length === 0 ? (
          <div className="info-banner">
            Henüz iş tipi eklemediniz. İş kaydı oluşturabilmek için en az bir iş
            tipi eklemelisiniz.
          </div>
        ) : (
          <div className="list">
            {jobTypes.map((t) => (
              <div key={t} className="type-row">
                <span>{t}</span>
                <button
                  className="icon-btn danger"
                  onClick={() => deleteJobType(t)}
                  aria-label={`${t} tipini sil`}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="hint">
        Tüm veriler yalnızca bu cihazda (tarayıcı belleğinde) saklanır. İnternet
        bağlantısı veya sunucu kullanılmaz.
      </p>
    </div>
  );
}
