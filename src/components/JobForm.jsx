import { useState } from 'react';
import Modal from './Modal';

const today = () => new Date().toISOString().slice(0, 10);

// İş ekleme/düzenleme formu.
// İş tipi yoksa form yerine uyarı gösterip Ayarlar'a yönlendirir.
export default function JobForm({ job, jobTypes, onSubmit, onClose, onGoSettings }) {
  const [date, setDate] = useState(job?.date || today());
  const [type, setType] = useState(job?.type || jobTypes[0] || '');
  const [description, setDescription] = useState(job?.description || '');
  const [fee, setFee] = useState(job?.fee != null ? String(job.fee) : '');
  const [status, setStatus] = useState(job?.status || 'pending');
  const [error, setError] = useState('');

  // İş tipi tanımlı değilse: uyarı + yönlendirme.
  if (!jobTypes.length) {
    return (
      <Modal
        title="İş Tipi Gerekli"
        onClose={onClose}
        footer={
          <>
            <button className="btn btn-ghost" onClick={onClose}>Kapat</button>
            <button className="btn btn-primary" onClick={onGoSettings}>Ayarlara Git</button>
          </>
        }
      >
        <p className="confirm-message">
          İş ekleyebilmek için önce <strong>Ayarlar</strong> bölümünden en az bir
          iş tipi (örn: Cam Temizliği) eklemelisiniz.
        </p>
      </Modal>
    );
  }

  // Ücret alanı: yalnızca rakam ve ondalık ayıracı kabul eder.
  const handleFee = (e) => {
    setFee(e.target.value.replace(/[^\d.,]/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type) {
      setError('Lütfen bir iş tipi seçiniz.');
      return;
    }
    const feeNum = Number(String(fee).replace(',', '.'));
    if (fee === '' || isNaN(feeNum) || feeNum < 0) {
      setError('Geçerli bir ücret giriniz.');
      return;
    }
    onSubmit({
      date,
      type,
      description: description.trim(),
      fee: feeNum,
      status,
    });
  };

  return (
    <Modal
      title={job ? 'İşi Düzenle' : 'Yeni İş'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Vazgeç</button>
          <button type="submit" form="job-form" className="btn btn-primary">Kaydet</button>
        </>
      }
    >
      <form id="job-form" onSubmit={handleSubmit} className="form">
        {error && <div className="form-error">{error}</div>}

        <label className="field">
          <span className="field-label">Tarih</span>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">İş Tipi</span>
          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {jobTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Detay Açıklaması</span>
          <textarea
            className="input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Yapılan işin detayları..."
          />
        </label>

        <label className="field">
          <span className="field-label">Ücret (₺)</span>
          <input
            className="input"
            type="text"
            inputMode="decimal"
            value={fee}
            onChange={handleFee}
            placeholder="Örn: 500"
          />
        </label>

        <div className="field">
          <span className="field-label">Durum</span>
          <div className="segmented">
            <button
              type="button"
              className={status === 'paid' ? 'active' : ''}
              onClick={() => setStatus('paid')}
            >
              Ödendi
            </button>
            <button
              type="button"
              className={status === 'pending' ? 'active' : ''}
              onClick={() => setStatus('pending')}
            >
              Bekliyor
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
