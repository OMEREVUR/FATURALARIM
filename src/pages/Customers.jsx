import { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import CustomerCard from '../components/CustomerCard';
import CustomerForm from '../components/CustomerForm';

export default function Customers() {
  const { customers, customerBalance, addCustomer } = useApp();
  const [query, setQuery] = useState('');
  const [onlyDebtors, setOnlyDebtors] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matches =
        !q || name.includes(q) || (c.phone || '').toLowerCase().includes(q);
      const hasDebt = customerBalance(c.id) > 0;
      return matches && (!onlyDebtors || hasDebt);
    });
  }, [customers, query, onlyDebtors, customerBalance]);

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Müşteriler</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Yeni Müşteri
        </button>
      </header>

      <div className="search-bar">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İsim veya telefon ara..."
        />
      </div>

      <div className="filter-row">
        <button
          className={`chip ${onlyDebtors ? 'active' : ''}`}
          onClick={() => setOnlyDebtors((v) => !v)}
        >
          Sadece Borçlular
        </button>
      </div>

      {list.length === 0 ? (
        <div className="empty-state">
          <p>
            {customers.length === 0
              ? 'Henüz müşteri eklemediniz.'
              : 'Eşleşen müşteri bulunamadı.'}
          </p>
          {customers.length === 0 && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              İlk müşteriyi ekle
            </button>
          )}
        </div>
      ) : (
        <div className="list">
          {list.map((c) => (
            <CustomerCard
              key={c.id}
              customer={c}
              hasDebt={customerBalance(c.id) > 0}
            />
          ))}
        </div>
      )}

      {showForm && (
        <CustomerForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            addCustomer(data);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
