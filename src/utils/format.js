// Biçimlendirme yardımcıları — tümü Türkçe yerel ayarına göre.

const currencyFmt = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return currencyFmt.format(n);
}

const dateFmt = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export function formatDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  if (isNaN(d.getTime())) return isoDate;
  return dateFmt.format(d);
}

export function getInitials(firstName = '', lastName = '') {
  const a = (firstName.trim()[0] || '').toUpperCase();
  const b = (lastName.trim()[0] || '').toUpperCase();
  return a + b || '?';
}

// Telefon numarasını WhatsApp (wa.me) için uluslararası biçime çevirir.
// Türkiye varsayımı: 0 ile başlıyorsa veya 10 haneyse başına 90 eklenir.
export function whatsappLink(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) digits = '90' + digits.slice(1);
  else if (digits.length === 10) digits = '90' + digits;
  return `https://wa.me/${digits}`;
}

export function telLink(phone) {
  const cleaned = String(phone || '').replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}
