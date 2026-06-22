import { useState } from 'react';
import Modal from './Modal';

const emptyAddress = () => ({
  id: Math.random().toString(36).slice(2),
  title: '',
  address: '',
});

// Müşteri ekleme/düzenleme formu. Adresler dinamik olarak eklenip çıkarılabilir.
export default function CustomerForm({ customer, onSubmit, onClose }) {
  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [notes, setNotes] = useState(customer?.notes || '');
  const [addresses, setAddresses] = useState(
    customer?.addresses?.length ? customer.addresses.map((a) => ({ ...a })) : []);
  const [error, setError] = useState('');

  const updateAddress = (id, field, val) =>
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: val } : a)));
  const addAddress = () => setAddresses((prev) => [...prev, emptyAddress()]);
  const removeAddress = (id) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('İsim alanı zorunludur.');
      return;
    }
    const cleanAddresses = addresses
      .filter((a) => a.title.trim() || a.address.trim())
      .map((a) => ({ id: a.id, title: a.title.trim(), address: a.address.trim() }));
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      addresses: cleanAddresses,
    });
  };

  return (
    <Modal
      title={customer ? 'Müşteriyi Düzenle' : 'Yeni Müşteri'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Vazgeç</button>
          <button type="submit" form="customer-form" className="btn btn-primary">Kaydet</button>
        </>
      }
    >
      <form id="customer-form" onSubmit={handleSubmit} className="form">
        {error && <div className="form-error">{error}</div>}

        <label className="field">
          <span className="field-label">İsim *</span>
          <input
            className="input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Örn: Ahmet"
          />
        </label>

        <label className="field">
          <span className="field-label">Soyisim</span>
          <input
            className="input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Örn: Yılmaz"
          />
        </label>

        <label className="field">
          <span className="field-label">Telefon</span>
          <input
            className="input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Örn: 0532 123 45 67"
          />
        </label>

        <div className="field">
          <div className="field-label-row">
            <span className="field-label">Adresler</span>
            <button type="button" className="btn-link" onClick={addAddress}>+ Adres Ekle</button>
          </div>
          {addresses.length === 0 && (
            <p className="muted-sm">Henüz adres eklenmedi.</p>
          )}
          {addresses.map((a) => (
            <div key={a.id} className="address-row">
              <input
                className="input"
                value={a.title}
                onChange={(e) => updateAddress(a.id, 'title', e.target.value)}
                placeholder="Adres başlığı (Ev, İş yeri...)"
              />
              <textarea
                className="input"
                rows={2}
                value={a.address}
                onChange={(e) => updateAddress(a.id, 'address', e.target.value)}
                placeholder="Açık adres"
              />
              <button
                type="button"
                className="btn-link danger"
                onClick={() => removeAddress(a.id)}
              >
                Adresi kaldır
              </button>
            </div>
          ))}
        </div>

        <label className="field">
          <span className="field-label">Özel Notlar</span>
          <textarea
            className="input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Müşteriyle ilgili notlar..."
          />
        </label>
      </form>
    </Modal>
  );
}
