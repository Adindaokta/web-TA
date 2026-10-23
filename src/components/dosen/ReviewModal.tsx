import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send, 
  History, 
  ChevronRight, 
  FileCheck,
  User,
  Sparkles
} from 'lucide-react';
import { Thesis, LogStatus, ChapterStage } from '../../types/index.ts';
import { CHAPTER_ORDER, calculateRiskLevel } from '../../utils/rules.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface ReviewModalProps {
  thesis: Thesis | null;
  onClose: () => void;
  onSubmitReview: (thesisId: string, feedback: string, decision: LogStatus, advanceChapter?: ChapterStage) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  thesis,
  onClose,
  onSubmitReview
}) => {
  if (!thesis) return null;

  const latestLog = thesis.logs[0];
  const [decision, setDecision] = useState<LogStatus>('Disetujui (ACC)');
  const [feedbackText, setFeedbackText] = useState(latestLog?.dosenFeedback || '');
  const [autoAdvance, setAutoAdvance] = useState(false);

  // Determine next chapter if applicable
  const currentChapterIndex = CHAPTER_ORDER.indexOf(thesis.currentChapter);
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < CHAPTER_ORDER.length - 1
    ? CHAPTER_ORDER[currentChapterIndex + 1]
    : undefined;

  // Simulate downloading the draft file
  const handleDownloadDraft = (fileName: string) => {
    const sampleContent = `======================================================
DOKUMEN DRAFT TUGAS AKHIR / SKRIPSI
======================================================
Judul: ${thesis.title}
Mahasiswa: ${thesis.studentName} (NIM: ${thesis.nim})
Tahap: ${thesis.currentChapter}
Rumpun Riset: ${thesis.cluster}
Dosen Pembimbing: Ir. Syaifuddin, S.Kom., M.Kom. (NIP. 10816120590PNS) - Informatika UMM
Status SK: ${thesis.skStatus}
Durasi Bimbingan: ${thesis.durationMonths} Bulan

Ringkasan Catatan Pengajuan:
"${latestLog?.studentNotes || 'Pengajuan draft rutin untuk review kemajuan penulisan skripsi.'}"
======================================================
[Simulasi file ${fileName} berhasil diunduh dari sistem SIM-TA]
`;
    const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '.txt') : fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const nextStage = decision === 'Disetujui (ACC)' && autoAdvance ? nextChapter : undefined;
    onSubmitReview(thesis.id, feedbackText, decision, nextStage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <UserAvatar name={thesis.studentName} size="lg" shape="rounded" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  {thesis.studentName}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {thesis.nim}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  thesis.graduationTrack === 'Jurnal'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                }`}>
                  Jalur: {thesis.graduationTrack || 'Skripsi'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  thesis.riskLevel === 'Kritis' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  thesis.riskLevel === 'Waspada' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  Risiko: {thesis.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                {thesis.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Tutup Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Quick Dossier Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {thesis.graduationTrack === 'Jurnal' ? 'Status Jurnal' : 'Tahap Saat Ini'}
              </span>
              <span className="font-extrabold text-indigo-700">
                {thesis.graduationTrack === 'Jurnal' ? (thesis.journalStage || 'Draft') : thesis.currentChapter}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Durasi Bimbingan</span>
              <span className="font-bold text-slate-800">{thesis.durationMonths} Bulan</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Status SK</span>
              <span className="font-semibold text-slate-800">{thesis.skStatus}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Jalur Kelulusan</span>
              <span className="font-bold text-violet-700">{thesis.graduationTrack || 'Skripsi'}</span>
            </div>
          </div>

          {/* Latest Uploaded Document Section */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-600" />
                Dokumen Draft / Revisi Terbaru
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {latestLog ? latestLog.submissionDate : thesis.lastUpdate}
              </span>
            </div>

            {latestLog ? (
              <div className="bg-white p-3.5 rounded-xl border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 break-all">
                      {latestLog.fileName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Ukuran: {latestLog.fileSize} &bull; Versi #{latestLog.version}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadDraft(latestLog.fileName)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh Dokumen</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Belum ada berkas naskah yang diunggah.
              </p>
            )}

            {latestLog?.studentNotes && (
              <div className="text-xs text-slate-600 bg-white/80 p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-800 block text-[11px] mb-1">Catatan dari Mahasiswa:</strong>
                "{latestLog.studentNotes}"
              </div>
            )}
          </div>

          {/* Dosen Review & Approval Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Keputusan & Catatan Evaluasi Dosen
            </h4>

            {/* Decision Radio Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  value: 'Disetujui (ACC)',
                  label: 'ACC / Disetujui',
                  icon: CheckCircle2,
                  color: 'border-emerald-500 bg-emerald-50 text-emerald-800'
                },
                {
                  value: 'Perlu Revisi',
                  label: 'Perlu Revisi',
                  icon: AlertCircle,
                  color: 'border-amber-500 bg-amber-50 text-amber-800'
                },
                {
                  value: 'Menunggu Review',
                  label: 'Simpan Catatan',
                  icon: Clock,
                  color: 'border-blue-500 bg-blue-50 text-blue-800'
                }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = decision === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDecision(item.value as LogStatus)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition text-left ${
                      isSelected
                        ? item.color + ' ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Advance Stage Checkbox if ACC */}
            {decision === 'Disetujui (ACC)' && nextChapter && (
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-emerald-900">
                  Secara otomatis naikkan tahap mahasiswa ke <strong>{nextChapter}</strong> setelah disimpan.
                </span>
              </label>
            )}

            {/* Feedback Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ulasan / Catatan Perbaikan Resmi (Muncul pada Log Mahasiswa):
              </label>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tuliskan catatan revisi spesifik, referensi tambahan, atau instruksi langkah berikutnya..."
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
              />
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Simpan Feedback & Status</span>
              </button>
            </div>
          </form>

          {/* Past History Timeline Drawer */}
          {thesis.logs.length > 1 && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h5 className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-slate-400" />
                Riwayat Catatan Bimbingan Terdahulu ({thesis.logs.length - 1})
              </h5>

              <div className="space-y-2">
                {thesis.logs.slice(1).map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700">{log.chapter} (v{log.version})</span>
                      <span>{log.submissionDate}</span>
                    </div>
                    {log.dosenFeedback && (
                      <p className="text-slate-600 italic">
                        "{log.dosenFeedback}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
