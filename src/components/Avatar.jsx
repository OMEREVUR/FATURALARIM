import { getInitials } from '../utils/format';

// Baş harflerden oluşan renkli avatar.
export default function Avatar({ firstName, lastName, size = 44 }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}
