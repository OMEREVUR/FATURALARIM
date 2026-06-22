// Özet ekranındaki tekil istatistik kartı.
export default function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card">
      <div className={`stat-value ${accent || ''}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
