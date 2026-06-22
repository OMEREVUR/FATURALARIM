import { useState, useEffect, useRef } from 'react';

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

// Ay seçici: seçili yılı gösteren ay grid'i.
function MonthPicker({ refDate, onChange, onClose }) {
  const [year, setYear] = useState(refDate.getFullYear());
  const selectedMonth = refDate.getMonth();
  const selectedYear = refDate.getFullYear();

  const pick = (monthIdx) => {
    const d = new Date(refDate);
    d.setFullYear(year);
    d.setMonth(monthIdx);
    onChange(d);
    onClose();
  };

  return (
    <div className="pp-panel">
      <div className="pp-year-nav">
        <button className="pp-nav-btn" onClick={() => setYear((y) => y - 1)}>‹</button>
        <span className="pp-year-label">{year}</span>
        <button className="pp-nav-btn" onClick={() => setYear((y) => y + 1)}>›</button>
      </div>
      <div className="pp-month-grid">
        {MONTHS.map((name, i) => {
          const isSelected = i === selectedMonth && year === selectedYear;
          const isToday = i === new Date().getMonth() && year === new Date().getFullYear();
          return (
            <button
              key={name}
              className={`pp-month-btn ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''}`}
              onClick={() => pick(i)}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Yıl seçici: 12'li grid, ileri/geri kaydırılabilir.
function YearPicker({ refDate, onChange, onClose }) {
  const currentYear = refDate.getFullYear();
  const now = new Date().getFullYear();
  const [startYear, setStartYear] = useState(Math.floor(currentYear / 12) * 12);

  const pick = (y) => {
    const d = new Date(refDate);
    d.setFullYear(y);
    onChange(d);
    onClose();
  };

  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  return (
    <div className="pp-panel">
      <div className="pp-year-nav">
        <button className="pp-nav-btn" onClick={() => setStartYear((s) => s - 12)}>‹</button>
        <span className="pp-year-label">{startYear} – {startYear + 11}</span>
        <button className="pp-nav-btn" onClick={() => setStartYear((s) => s + 12)}>›</button>
      </div>
      <div className="pp-year-grid">
        {years.map((y) => (
          <button
            key={y}
            className={`pp-year-item ${y === currentYear ? 'selected' : ''} ${y === now && y !== currentYear ? 'today' : ''}`}
            onClick={() => pick(y)}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}

// Dış bileşen: açılır picker kutusu, dışına tıklayınca kapanır.
export default function PeriodPicker({ refDate, periodType, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  return (
    <div className="pp-wrapper" ref={ref}>
      <button
        className="period-label period-label-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Dönem seç"
      >
        {periodType === 'month'
          ? `${['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'][refDate.getMonth()]} ${refDate.getFullYear()}`
          : refDate.getFullYear()}
        <span className="pp-caret">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="pp-dropdown">
          {periodType === 'month' ? (
            <MonthPicker refDate={refDate} onChange={onChange} onClose={() => setOpen(false)} />
          ) : (
            <YearPicker refDate={refDate} onChange={onChange} onClose={() => setOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
}
