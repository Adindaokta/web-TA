import React, { useState } from 'react';
import { KeyRound, X, CheckCircle2, ShieldAlert, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSavePassword: (newPassword: string) => void;
  nim: string; // NIP (dosen) or NIM (mahasiswa)
  studentName?: string;
  role?: 'dosen' | 'mahasiswa';
  isForced?: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSavePassword,
  nim,
  studentName,
  role = 'mahasiswa',
  isForced = false
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const defaultPasswordStr = role === 'dosen' ? 'dosen123' : 'bimbingan123';
  const idLabel = role === 'dosen' ? 'NIP' : 'NIM';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }

    if (newPassword.toLowerCase() === defaultPasswordStr) {
      setError(`Password baru tidak boleh sama dengan password default (${defaultPasswordStr})!`);
      return;
    }

    onSavePassword(newPassword);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose?.();
    }, 1500);
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 ${
        isForced 
          ? 'z-[9999] bg-slate-950/90 backdrop-blur-md' 
          : 'z-50 bg-slate-950/75 backdrop-blur-xs'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isForced ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-200' : 'bg-amber-50 text-amber-600'}`}>
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {isForced ? 'Wajib Ubah Password Baru' : 'Ganti Password Akun'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {idLabel}: <span className="font-bold text-slate-700">{nim}</span> {studentName ? `(${studentName})` : ''}
              </p>
            </div>
          </div>

          {/* Close button only rendered if NOT forced */}
          {!isForced && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              aria-label="Tutup dialog"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">
              Password Berhasil Diperbarui!
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Akun Anda kini terlindungi dengan password baru. Membuka akses dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Forced Warning Notice */}
            {isForced ? (
              <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-950 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold block text-rose-900 text-[11px] uppercase tracking-wider">
                    Layar Terblokir &bull; Keamanan Akun Diperlukan
                  </span>
                  <p className="text-rose-800 leading-relaxed text-[11px]">
                    Akun {role === 'dosen' ? 'Dosen Pembimbing' : 'Mahasiswa'} Anda masih menggunakan password default <code>{defaultPasswordStr}</code>. Anda <strong>WAJIB</strong> membuat password baru sebelum dapat membuka menu dashboard bimbingan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Ganti Password Akun:</span>
                  <span>
                    Pastikan password baru Anda aman dan mudah diingat untuk akses bimbingan tugas akhir.
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* If not forced, optional old password */}
            {!isForced && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Password Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={`Minimal 6 karakter (bukan '${defaultPasswordStr}')`}
                  className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Minimal 6 karakter, kombinasikan huruf dan angka.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Konfirmasi Password Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru yang sama"
                  className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              {!isForced && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-white rounded-xl font-bold shadow-md transition cursor-pointer ${
                  isForced 
                    ? 'bg-gradient-to-r from-rose-600 via-indigo-600 to-indigo-700 hover:from-rose-500 hover:to-indigo-600 shadow-indigo-600/30' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                <KeyRound className="h-4 w-4" />
                <span>{isForced ? 'Simpan Password & Buka Dashboard' : 'Simpan Password Baru'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
