import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/format';

// İş geçmişi satırı. Ana alana tıklayınca düzenler, rozetle durum değişir.
export default function JobItem({ job, onToggle, onEdit, onDelete }) {
  return (
    <div className="job-item">
      <div
        className="job-item-main"
        role={onEdit ? 'button' : undefined}
        onClick={() => onEdit && onEdit(job)}
      >
        <div className="job-item-top">
          <span className="job-type">{job.type}</span>
          <span className="job-fee">{formatCurrency(job.fee)}</span>
        </div>
        <div className="job-item-date">{formatDate(job.date)}</div>
        {job.description && <div className="job-desc">{job.description}</div>}
      </div>
      <div className="job-item-actions">
        <button
          className="status-toggle"
          onClick={() => onToggle(job.id)}
          title="Durumu değiştir"
        >
          <StatusBadge status={job.status} />
        </button>
        {onDelete && (
          <button
            className="icon-btn danger"
            onClick={() => onDelete(job)}
            aria-label="İşi sil"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}
