import { Link } from 'react-router-dom';
import Avatar from './Avatar';

// Müşteri listesi öğesi. Borcu varsa kırmızı uyarı noktası gösterir.
export default function CustomerCard({ customer, hasDebt }) {
  return (
    <Link to={`/customers/${customer.id}`} className="customer-card">
      <Avatar firstName={customer.firstName} lastName={customer.lastName} />
      <div className="customer-card-info">
        <div className="customer-card-name">
          {customer.firstName} {customer.lastName}
          {hasDebt && <span className="debt-dot" title="Bekleyen ödeme var" />}
        </div>
        <div className="customer-card-phone">
          {customer.phone || 'Telefon yok'}
        </div>
      </div>
      <span className="chevron" aria-hidden="true">›</span>
    </Link>
  );
}
