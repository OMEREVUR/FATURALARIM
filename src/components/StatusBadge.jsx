// İş durumu rozeti: Ödendi / Bekliyor.
export default function StatusBadge({ status }) {
  const paid = status === 'paid';
  return (
    <span className={`badge ${paid ? 'badge-success' : 'badge-pending'}`}>
      {paid ? 'Ödendi' : 'Bekliyor'}
    </span>
  );
}
