import React, { useState } from 'react';
import { 
  X, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Download, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Thesis } from '../../types/index.ts';

interface VerifySKModalProps {
  thesis: Thesis | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmVerification: (thesisId: string, skNumber: string, skDate: string, notes?: string) => void;
  onRejectVerification: (thesisId: string, reason: string) => void;
}

export const VerifySKModal: React.FC<VerifySKModalProps> = ({
  thesis,
  isOpen,
  onClose,
  onConfirmVerification,
  onRejectVerification
}) => {
  if (!isOpen || !thesis) return null;

  const [skNumber, setSkNumber] = useState(
    thesis.skNumber || `SK-TA/FT-UMM/INF/2026/${thesis.nim.slice(-3)}`
  );
  const [skDate, setSkDate] = useState(
    thesis.skDate || thesis.skUploadDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // --- FUNGSI UNDUH SK ASLI (NATIVE DOWNLOAD) ---
  const handleDownloadFile = () => {
    // skFileUrl adalah tempat kita menyimpan Base64 di App.tsx
    const fileData = thesis.skFileUrl; 
    const fileName = thesis.skFileName || `SK_TugasAkhir_${thesis.nim}.pdf`;

    if (fileData) {
      // Unduh file PDF asli menggunakan Base64 yang tersimpan
      const a = document.createElement('a');
      a.href = fileData;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Jika SK di-upload sebelum fitur Base64 ditambahkan
      alert(`[ERROR] File PDF fisik dari SK "${fileName}" belum tersimpan di memori. Ini terjadi karena ini adalah data dummy awal, atau mahasiswa mengunggah SK sebelum sistem di-update. \n\nSilakan tolak verifikasi ini agar mahasiswa mengunggah ulang file PDF SK-nya.`);
    }
  };

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmVerification(thesis.id, skNumber.trim(), skDate, notes.trim());
    onClose();
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    onRejectVerification(thesis.id, rejectReason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/40 text-indigo-200 border border-indigo-400/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Verifikasi SK Tugas Akhir
              </h3>
              <p className="text-xs text-indigo-200">
                Pemeriksaan Legalitas SK Pembimbing Skripsi Mahasiswa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Student Details Card */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mahasiswa</span>
              <span className="font-bold text-slate-900 text-sm">{thesis.studentName}</span>
              <span className="text-slate-500 font-mono ml-2">({thesis.nim})</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Saat Ini</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                thesis.skStatus === 'Sudah SK' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {thesis.skStatus}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Judul Skripsi</span>
            <p className="text-slate-800 font-medium line-clamp-2 mt-0.5">
              "{thesis.title}"
            </p>
          </div>

          {/* Uploaded file preview */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <div>
                <span className="font-bold text-slate-800 block text-xs truncate max-w-[240px]">
                  {thesis.skFileName || `Berkas_SK_${thesis.nim}.pdf`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {thesis.skUploadDate ? `Diunggah: ${thesis.skUploadDate}` : 'Dokumen PDF SK Mahasiswa'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadFile}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>

        {/* Verification Form */}
        {!isRejectMode ? (
          <form onSubmit={handleApprove} className="p-5 space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Nomor Surat Keputusan (SK)
              </label>
              <input
                type="text"
                required
                value={skNumber}
                onChange={(e) => setSkNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                <span>Tanggal Terbit SK</span>
              </label>
              <input
                type="date"
                required
                value={skDate}
                onChange={(e) => setSkDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Catatan Verifikasi Dosen (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="SK resmi sah dari Dekan Fakultas Teknik UMM..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRejectMode(true)}
                className="text-rose-600 hover:text-rose-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Tolak Berkas SK</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verifikasi & Setujui SK</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReject} className="p-5 space-y-4 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
              <span className="font-bold block">Penolakan Verifikasi SK:</span>
              <span>Berikan alasan penolakan agar mahasiswa dapat mengunggah ulang dokumen yang valid.</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Alasan Penolakan
              </label>
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Dokumen tidak terbaca, nomor SK salah, atau belum ada stempel dekanat..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRejectMode(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition text-xs cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={!rejectReason.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Konfirmasi Penolakan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};