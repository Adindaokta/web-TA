import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  X, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  User,
  Mail,
  Phone,
  BookOpen
} from 'lucide-react';
import { NewApplicant, ResearchCluster } from '../../types/index.ts';

interface ApplyGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicant: Omit<NewApplicant, 'id' | 'status' | 'submittedAt'>) => void;
}

const STANDARD_CLUSTERS = [
  'Honeypot & Akuisisi Data',
  'Dataset & Rekayasa Fitur',
  'Machine Learning & Zero-Day',
  'Deep Reinforcement Learning',
  'Edge, Mitigasi & Kajian',
  'Topik Implementatif Dasar'
] as const;

export const ApplyGuidanceModal: React.FC<ApplyGuidanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [nim, setNim] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clusterMode, setClusterMode] = useState<'standard' | 'custom'>('standard');
  const [selectedCluster, setSelectedCluster] = useState<string>('Honeypot & Akuisisi Data');
  const [customCluster, setCustomCluster] = useState<string>('');
  const [proposedTitle, setProposedTitle] = useState('');
  const [proposalSummary, setProposalSummary] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim || !name || !proposedTitle) return;

    const finalCluster = clusterMode === 'custom'
      ? (customCluster.trim() || 'Topik Implementatif Dasar')
      : selectedCluster;

    onSubmit({
      nim,
      name,
      email: email || `${nim}@student.umm.ac.id`,
      phone: phone || '-',
      cluster: finalCluster,
      proposedTitle,
      proposalSummary: proposalSummary || 'Pengajuan usulan topik skripsi baru.'
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Formulir Pengajuan Bimbingan Skripsi Baru (Jalur B)
              </h3>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Dosen Pembimbing: Ir. Syaifuddin, S.Kom., M.Kom. (NIP. 10816120590PNS) &bull; Informatika UMM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Pengajuan Bimbingan Berhasil Dikirim!
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Data usulan judul Anda telah masuk ke dashboard dosen pembimbing dengan status <strong>Pending</strong>. Jika disetujui, akun dan password bimbingan akan digenerate otomatis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-600" /> NIM Mahasiswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 202310370311..."
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-600" /> Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama sesuai KTM"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-600" /> Email Mahasiswa *
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@student.univ.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-indigo-600" /> Nomor WhatsApp Aktif *
                </label>
                <input
                  type="text"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">
                  Rumpun Riset Informatika UMM *
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setClusterMode('standard')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition ${
                      clusterMode === 'standard'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    6 Pilihan Standar
                  </button>
                  <button
                    type="button"
                    onClick={() => setClusterMode('custom')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition ${
                      clusterMode === 'custom'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Input Manual (Lainnya)
                  </button>
                </div>
              </div>

              {clusterMode === 'standard' ? (
                <div>
                  <select
                    value={selectedCluster}
                    onChange={(e) => {
                      if (e.target.value === 'Lainnya') {
                        setClusterMode('custom');
                      } else {
                        setSelectedCluster(e.target.value);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {STANDARD_CLUSTERS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Lainnya">-- Lainnya (Ketik Manual Topik Riset Sendiri) --</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    placeholder="Ketik nama rumpun/topik riset baru Anda (misal: Bioinformatika Siber, AI Edge Vision)..."
                    value={customCluster}
                    onChange={(e) => setCustomCluster(e.target.value)}
                    className="w-full p-2.5 bg-white border border-indigo-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Topik kustom akan diverifikasi oleh Dosen Pembimbing.</span>
                    <button
                      type="button"
                      onClick={() => setClusterMode('standard')}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      &larr; Kembali ke 6 Opsi Standar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-600" /> Usulan Judul Skripsi / Tugas Akhir *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Tuliskan usulan judul lengkap riset Anda..."
                value={proposedTitle}
                onChange={(e) => setProposedTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-indigo-600" /> Ringkasan Ide, Rumusan Masalah, & Dataset
              </label>
              <textarea
                rows={3}
                placeholder="Jelaskan latar belakang singkat, dataset yang akan digunakan (misal IoT-DH, CICIoT2023), atau metode yang direncanakan..."
                value={proposalSummary}
                onChange={(e) => setProposalSummary(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 font-semibold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/25 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim Formulir Pengajuan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
