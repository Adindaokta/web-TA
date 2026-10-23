import React from 'react';
import { 
  History, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  MessageSquare,
  Award,
  Calendar
} from 'lucide-react';
import { Thesis, LogEntry } from '../../types/index.ts';

interface LogBimbinganViewProps {
  thesis: Thesis;
  onNavigateTab: (tab: string) => void;
}

export const LogBimbinganView: React.FC<LogBimbinganViewProps> = ({
  thesis,
  onNavigateTab
}) => {
  // --- FUNGSI UNDUHAN FILE UTUH (SISI MAHASISWA) ---
  const handleDownloadFile = (fileName: string, log: LogEntry) => {
    if (log.fileData) {
      // Eksekusi unduhan murni jika file data fisik (Base64) tersedia
      const a = document.createElement('a');
      a.href = log.fileData;
      a.download = fileName; // Ekstensi otomatis sesuai aslinya
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Fallback untuk data simulasi bawaan (dummy)
      alert(`[ERROR] File fisik dari dokumen "${fileName}" tidak ditemukan dalam sistem lokal karena ini adalah data bawaan simulasi. \n\nSilakan unggah dokumen yang baru melalui form Update Progres.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Riwayat & Timeline Log Bimbingan Skripsi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Seluruh riwayat pengunggahan draft, catatan konsultasi, dan persetujuan (approval) resmi dari Dosen Pembimbing.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('update')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Progres Baru</span>
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200/80 space-y-8 ml-3 sm:ml-4">
        {thesis.logs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Belum ada riwayat bimbingan yang tercatat. Silakan unggah draft pertama Anda melalui menu Update Progres.
          </div>
        ) : (
          thesis.logs.map((log, index) => {
            const isApproved = log.status === 'Disetujui (ACC)';
            const isRevision = log.status === 'Perlu Revisi';
            const isPending = log.status === 'Menunggu Review';

            return (
              <div key={log.id} className="relative group">
                {/* Timeline Node Pin */}
                <span
                  className={`absolute -left-[35px] sm:-left-[43px] top-4 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm ${
                    isApproved ? 'bg-emerald-500 text-white' :
                    isRevision ? 'bg-amber-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}
                >
                  {isApproved && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {isRevision && <AlertCircle className="h-3.5 w-3.5" />}
                  {isPending && <Clock className="h-3.5 w-3.5" />}
                </span>

                {/* Timeline Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 hover:shadow-md transition space-y-4">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900">
                        {log.chapter}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                        Versi #{log.version}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isRevision ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>{log.submissionDate}</span>
                    </div>
                  </div>

                  {/* Document Attachment Pill */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-800 block truncate">
                          {log.fileName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Ukuran Dokumen: {log.fileSize}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadFile(log.fileName, log)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-indigo-600 font-semibold border border-slate-200 shadow-2xs transition self-start sm:self-auto shrink-0 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh File</span>
                    </button>
                  </div>

                  {/* Student Submission Notes */}
                  {log.studentNotes && (
                    <div className="text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <strong className="block text-slate-900 text-[11px] mb-0.5">
                        Catatan Pengajuan Mahasiswa:
                      </strong>
                      <p className="leading-relaxed text-slate-600">
                        "{log.studentNotes}"
                      </p>
                    </div>
                  )}

                  {/* Supervisor Official Feedback Box */}
                  {log.dosenFeedback ? (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/90 to-sky-50/70 border border-indigo-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-indigo-600" />
                          Catatan / Komentar Dosen Pembimbing
                        </span>
                        {log.reviewedAt && (
                          <span className="text-[10px] text-indigo-700/70 font-mono font-normal">
                            Direview: {log.reviewedAt}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        "{log.dosenFeedback}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-800 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>
                        Dokumen ini sedang dalam antrean review oleh Dosen Pembimbing. Anda akan mendapatkan notifikasi status setelah direview.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};