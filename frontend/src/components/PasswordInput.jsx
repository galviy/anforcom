import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * <input type="password"> dengan tombol hide/unhide. Terima props yang sama
 * kayak <input> biasa (name, value, onChange, required, minLength, dst) plus
 * `className` buat styling input-nya sendiri — dipakai sebagai pengganti
 * langsung dari <input type="password" .../> di seluruh form auth.
 */
export default function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`${className} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F5DC]/40 transition-colors hover:text-[#EAB308]"
        aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}