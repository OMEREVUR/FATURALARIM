// Dönem (ay/yıl) yardımcıları — Özet ekranı için.

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

// Referans tarihi ay veya yıl olarak ileri/geri kaydırır.
export function shiftPeriod(refDate, periodType, delta) {
  const d = new Date(refDate);
  if (periodType === 'month') d.setMonth(d.getMonth() + delta);
  else d.setFullYear(d.getFullYear() + delta);
  return d;
}

// Dönem etiketi: "Haziran 2026" veya "2026".
export function periodLabel(refDate, periodType) {
  const d = new Date(refDate);
  if (periodType === 'month') return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return `${d.getFullYear()}`;
}

// Verilen tarih (YYYY-MM-DD) seçili dönemin içinde mi?
export function isInPeriod(isoDate, refDate, periodType) {
  if (!isoDate) return false;
  const d = new Date(isoDate + 'T00:00:00');
  if (isNaN(d.getTime())) return false;
  const ref = new Date(refDate);
  if (d.getFullYear() !== ref.getFullYear()) return false;
  if (periodType === 'month') return d.getMonth() === ref.getMonth();
  return true;
}
