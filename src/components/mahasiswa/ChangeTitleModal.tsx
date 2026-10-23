import React, { useState } from 'react';
import { Edit3, X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Thesis } from '../../types/index.ts';

interface ChangeTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  thesis: Thesis;
  onSubmitTitleChange: (proposedTitle: string, reason: string) => void;
}

export const ChangeTitleModal: React.FC<ChangeTitleModalProps> = ({
  isOpen,
  onClose,
  thesis,
  onSubmitTitleChange
}) => {
  const [proposedTitle, setProposedTitle] = useState('');
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedTitle.trim() || !reason.trim()) return;

    onSubmitTitleChange(proposedTitle.trim(), reason.trim());
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Pengajuan Perubahan Judul Skripsi
              </h3>
              <p className="text-xs text-slate-500">
                Membutuhkan persetujuan resmi dari Ir. Syaifuddin S.Kom., M.Kom. (Informatika UMM)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">
              Permohonan Berhasil Dikirim!
            </h4>
            <p className="text-xs text-slate-500">
              Pengajuan judul baru telah diteruskan ke dashboard dosen pembimbing untuk ditinjau.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Current Title */}
            <div>
              <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                Judul Skripsi Saat Ini (Aktif)
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 italic leading-relaxed">
                "{thesis.title}"
              </div>
            </div>

            {/* Proposed Title */}
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                Usulan Judul Baru *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Tuliskan usulan judul baru secara lengkap..."
                value={proposedTitle}
                onChange={(e) => setProposedTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                Alasan / Latar Belakang Perubahan Judul *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Contoh: Arahan revisi mayor dosen saat bimbingan Bab 3 / Perubahan fokus dataset / Perubahan metode eksperimen..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim Pengajuan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
