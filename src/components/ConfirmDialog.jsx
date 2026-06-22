import Modal from './Modal';

// Silme gibi geri alınamaz işlemler için onay penceresi.
export default function ConfirmDialog({
  title,
  message,
  confirmText = 'Sil',
  cancelText = 'Vazgeç',
  onConfirm,
  onCancel,
  danger = true,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onCancel}>{cancelText}</button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="confirm-message">{message}</p>
    </Modal>
  );
}
