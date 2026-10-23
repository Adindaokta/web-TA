import React, { useState } from 'react';
import { 
  X, 
  FileCheck2, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Info,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Thesis } from '../../types/index.ts';

interface UploadSKModalProps {
  isOpen: boolean;
  onClose: () => void;
  thesis: Thesis;
  onSubmitSK: (data: {
    skNumber: string;
    skDate: string;
    fileName: string;
    fileSize: string;
    notes?: string;
  }) => void;
}

export const UploadSKModal: React.FC<UploadSKModalProps> = ({
  isOpen,
  onClose,
  thesis,
  onSubmitSK
}) => {
  if (!isOpen) return null;

  const [skNumber, setSkNumber] = useState(
    thesis.skNumber || `SK-TA/FT-UMM/INF/2026/${thesis.nim.slice(-3)}`
  );
  const [skDate, setSkDate] = useState(
    thesis.skDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>({
    name: `SK_TugasAkhir_${thesis.nim}_${thesis.studentName.replace(/\s+/g, '_')}.pdf`,
    size: '1.2 MB'
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({
        name: file.name,
        size: `${sizeMB} MB`
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skNumber.trim() || !selectedFile) return;

    onSubmitSK({
      skNumber: skNumber.trim(),
      skDate,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      notes: notes.trim()
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
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
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Unggah SK Tugas Akhir
              </h3>
              <p className="text-xs text-indigo-200">
                Verifikasi Surat Keputusan Pembimbing Skripsi (Fakultas Teknik UMM)
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

        {/* Informational Callout: Non-Blocker */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
          <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Ketentuan SK Tugas Akhir (Bukan Blocker):</span>
            <p className="mt-0.5 text-emerald-800 leading-relaxed">
              SK belum terbit <strong>tidak menghambat</strong> bimbingan. Mahasiswa yang usulan judulnya telah disetujui (Approved) dapat langsung bimbingan, mengisi presensi, dan mengunggah draf bab naskah. Unggah berkas SK di sini setelah resmi diterbitkan oleh prodi/fakultas.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Berkas SK Berhasil Diunggah!
            </h4>
            <p className="text-xs text-slate-500">
              Pengajuan verifikasi SK telah dikirimkan ke Dosen Pembimbing (Bapak Ir. Syaifuddin S.Kom., M.Kom.).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Student Info preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mahasiswa</span>
                <span className="font-bold text-slate-800">{thesis.studentName} ({thesis.nim})</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Judul</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {thesis.titleStatus}
                </span>
              </div>
            </div>

            {/* Nomor SK */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Nomor Surat Keputusan (SK)</span>
                <span className="text-[11px] text-slate-400 font-normal">Sesuai SK Dekan FT UMM</span>
              </label>
              <input
                type="text"
                required
                value={skNumber}
                onChange={(e) => setSkNumber(e.target.value)}
                placeholder="Contoh: 124/SK-TA/FT-UMM/INF/2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Tanggal Terbit SK */}
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

            {/* File Upload Dropzone */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Unggah File Berkas SK (PDF)
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-4 bg-slate-50 text-center relative cursor-pointer transition">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                  <UploadCloud className="h-6 w-6 text-indigo-600" />
                  <span className="font-semibold text-slate-700 text-xs">
                    Klik atau seret berkas PDF SK ke sini
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Format: PDF (Maksimal 10 MB)
                  </span>
                </div>
              </div>

              {selectedFile && (
                <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-slate-800 truncate max-w-[280px]">{selectedFile.name}</span>
                    <span className="text-[11px] text-slate-500">({selectedFile.size})</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    Siap Kirim
                  </span>
                </div>
              )}
            </div>

            {/* Catatan / Keterangan Tambahan */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: SK telah dilegalisir oleh Tata Usaha Fakultas Teknik..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!selectedFile || !skNumber.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim Verifikasi SK</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
