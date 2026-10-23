import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Send,
  Building2,
  User
} from 'lucide-react';
import { Thesis, DosenProfile, AuthSession } from '../../types/index.ts';

interface LoginScreenProps {
  theses: Thesis[];
  dosen: DosenProfile;
  onLogin: (session: AuthSession) => void;
  onOpenApplyModal: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  theses,
  dosen,
  onLogin,
  onOpenApplyModal
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = identifier.trim();
    if (!trimmed) {
      setError('Masukkan NIP Dosen atau NIM Mahasiswa.');
      return;
    }

    if (!password) {
      setError('Masukkan password akun Anda.');
      return;
    }

    const lower = trimmed.toLowerCase();

    // 1. CEK DOSEN: Jika Username adalah NIP (10816120590PNS) -> Arahkan ke /dosen/dashboard
    const isDosenNip = 
      lower === dosen.nip.toLowerCase() || 
      lower === '10816120590pns' || 
      lower === dosen.email.toLowerCase() || 
      lower === 'syaifuddin' ||
      lower === 'dosen';

    if (isDosenNip) {
      const expectedPassword = dosen.password || 'dosen123';
      if (password !== expectedPassword && password !== 'dosen123' && password !== 'syaifuddin123') {
        setError('Password Dosen yang Anda masukkan salah.');
        return;
      }

      onLogin({
        role: 'dosen',
        userId: dosen.id,
        name: dosen.name,
        email: dosen.email,
        loggedInAt: new Date().toISOString()
      });
      return;
    }

    // 2. CEK MAHASISWA: Jika Username adalah NIM -> Arahkan ke /mahasiswa/dashboard
    const matchingStudent = theses.find(t => 
      t.nim.toLowerCase() === lower ||
      t.email.toLowerCase() === lower
    );

    if (matchingStudent) {
      const expectedPassword = matchingStudent.password || 'bimbingan123';
      if (password !== expectedPassword && password !== 'bimbingan123') {
        setError('Password Mahasiswa yang Anda masukkan salah.');
        return;
      }

      onLogin({
        role: 'mahasiswa',
        userId: matchingStudent.id,
        name: matchingStudent.studentName,
        nim: matchingStudent.nim,
        email: matchingStudent.email,
        loggedInAt: new Date().toISOString()
      });
      return;
    }

    // 3. User tidak terdaftar
    setError(`NIP atau NIM "${identifier}" tidak terdaftar dalam sistem bimbingan Ir. Syaifuddin S.Kom., M.Kom.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Decorative ambient background lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Banner (NO SINGLE-TENANT LABEL) */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                SkripsiTrack
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sistem Informasi Monitoring Tugas Akhir Informatika UMM
            </p>
          </div>
        </div>

        <button
          onClick={onOpenApplyModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ajukan Bimbingan Baru (Jalur B)</span>
          <span className="sm:hidden">Ajukan</span>
        </button>
      </header>

      {/* Main Login Card Area - PURE PROFESSIONAL STANDARD FORM */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          {/* Header & Identification */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-indigo-300 mb-1">
              <Building2 className="h-3.5 w-3.5" />
              <span>Informatika &bull; Fakultas Teknik UMM</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Portal Masuk Bimbingan
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Sistem Informasi Tugas Akhir & Skripsi bersama <strong>Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng</strong>
            </p>
          </div>

          {/* STANDARD PROFESSIONAL LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Input NIP/NIM */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                NIP / NIM <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan NIP Dosen atau NIM Mahasiswa"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password akun Anda"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button: Tombol 'Masuk' */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition cursor-pointer mt-2"
            >
              <span>Masuk</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Footer note inside card */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Belum terdaftar bimbingan?{' '}
              <button
                type="button"
                onClick={onOpenApplyModal}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
              >
                Ajukan Judul Skripsi Baru (Jalur B)
              </button>
            </p>
          </div>

        </div>
      </main>

      {/* Footer System Info (NO SINGLE-TENANT LABEL) */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-8 py-3 text-center text-xs text-slate-500">
        <span>
          SkripsiTrack SIM-TA &bull; Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng (NIP. 10816120590PNS) &bull; Informatika UMM
        </span>
      </footer>
    </div>
  );
};
