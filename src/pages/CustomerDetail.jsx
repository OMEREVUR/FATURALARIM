import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import Avatar from '../components/Avatar';
import JobItem from '../components/JobItem';
import CustomerForm from '../components/CustomerForm';
import JobForm from '../components/JobForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, telLink, whatsappLink, mapsLink } from '../utils/format';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getCustomer, updateCustomer, deleteCustomer,
    jobsByCustomer, customerBalance,
    jobTypes, addJob, updateJob, deleteJob, toggleJobStatus,
  } = useApp();

  const customer = getCustomer(id);
  const [editing, setEditing] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [confirm, setConfirm] = useState(null); // {type:'customer'} | {type:'job', job}

  if (!customer) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Müşteri bulunamadı.</p>
          <Link to="/customers" className="btn btn-primary">Müşterilere dön</Link>
        </div>
      </div>
    );
  }

  const balance = customerBalance(customer.id);
  const jobs = jobsByCustomer(customer.id);

  return (
    <div className="page">
      <header className="detail-top">
        <button className="back-btn" onClick={() => navigate('/customers')}>
          ‹ Müşteriler
        </button>
      </header>

      <section className="profile-card">
        <Avatar firstName={customer.firstName} lastName={customer.lastName} size={64} />
        <h1 className="profile-name">
          {customer.firstName} {customer.lastName}
        </h1>
        {customer.phone && <div className="profile-phone">{customer.phone}</div>}
        {balance > 0 && (
          <div className="balance-badge">Bekleyen: {formatCurrency(balance)}</div>
        )}

        <div className="profile-actions">
          {customer.phone && (
            <a className="btn btn-soft" href={telLink(customer.phone)}>📞 Ara</a>
          )}
          {customer.phone && (
            <a
              className="btn btn-soft"
              href={whatsappLink(customer.phone)}
              target="_blank"
              rel="noreferrer"
            >
              💬 WhatsApp
            </a>
          )}
          <button className="btn btn-soft" onClick={() => setEditing(true)}>
            ✏️ Düzenle
          </button>
          <button
            className="btn btn-soft danger"
            onClick={() => setConfirm({ type: 'customer' })}
          >
            🗑 Sil
          </button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Adresler</h2>
        {customer.addresses?.length ? (
          <div className="list">
            {customer.addresses.map((a) => (
              <div key={a.id} className="info-card">
                <div className="info-card-title">{a.title || 'Adres'}</div>
                <div className="info-card-body">
                  {a.address}
                  {a.address && (
                    <a
                      className="maps-link"
                      href={mapsLink(a.address)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📍 Haritada Aç
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted-sm">Kayıtlı adres yok.</p>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Notlar</h2>
        {customer.notes ? (
          <div className="info-card">
            <div className="info-card-body">{customer.notes}</div>
          </div>
        ) : (
          <p className="muted-sm">Not eklenmemiş.</p>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">İş Geçmişi</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingJob(null);
              setShowJobForm(true);
            }}
          >
            + İş Ekle
          </button>
        </div>
        {jobs.length ? (
          <div className="list">
            {jobs.map((j) => (
              <JobItem
                key={j.id}
                job={j}
                onToggle={toggleJobStatus}
                onEdit={(job) => {
                  setEditingJob(job);
                  setShowJobForm(true);
                }}
                onDelete={(job) => setConfirm({ type: 'job', job })}
              />
            ))}
          </div>
        ) : (
          <p className="muted-sm">Bu müşteriye ait iş kaydı yok.</p>
        )}
      </section>

      {editing && (
        <CustomerForm
          customer={customer}
          onClose={() => setEditing(false)}
          onSubmit={(data) => {
            updateCustomer(customer.id, data);
            setEditing(false);
          }}
        />
      )}

      {showJobForm && (
        <JobForm
          job={editingJob}
          jobTypes={jobTypes}
          onClose={() => setShowJobForm(false)}
          onGoSettings={() => {
            setShowJobForm(false);
            navigate('/settings');
          }}
          onSubmit={(data) => {
            if (editingJob) updateJob(editingJob.id, data);
            else addJob({ customerId: customer.id, ...data });
            setShowJobForm(false);
          }}
        />
      )}

      {confirm?.type === 'customer' && (
        <ConfirmDialog
          title="Müşteriyi Sil"
          message={`${customer.firstName} ${customer.lastName} ve tüm iş kayıtları silinecek. Bu işlem geri alınamaz.`}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            deleteCustomer(customer.id);
            navigate('/customers');
          }}
        />
      )}

      {confirm?.type === 'job' && (
        <ConfirmDialog
          title="İşi Sil"
          message="Bu iş kaydı silinecek. Bu işlem geri alınamaz."
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            deleteJob(confirm.job.id);
            setConfirm(null);
          }}
        />
      )}
    </div>
  );
}
