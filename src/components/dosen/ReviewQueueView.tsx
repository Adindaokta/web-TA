import React from 'react';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Thesis } from '../../types';

interface ReviewQueueViewProps {
  theses: Thesis[];
  onOpenReviewModal: (thesis: Thesis) => void;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({ theses, onOpenReviewModal }) => {
  // Saring hanya mahasiswa yang memiliki log dengan status 'PENDING'
  const pendingReviews = theses.filter(t => 
    t.logs && t.logs[0]?.status === 'Menunggu Review' // Hanya cek log urutan pertama (terbaru)
  );

  if (pendingReviews.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Semua Bersih!</h3>
        <p className="text-slate-500 mt-1">Tidak ada draft bab mahasiswa yang menunggu untuk direview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Antrean Review Dokumen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingReviews.map(thesis => {
          const pendingLog = thesis.logs[0];
          
          return (
            <div key={thesis.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800">{thesis.studentName}</h3>
                  <p className="text-xs text-slate-500 font-mono">NIM: {thesis.nim}</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Menunggu Review
                </span>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                <p><span className="font-semibold">Tahap:</span> {pendingLog?.chapter}</p>
                <p className="mt-1 text-slate-600 line-clamp-2"><span className="font-semibold">Catatan Mhs:</span> "{pendingLog?.studentNotes}"</p>
              </div>

              <button 
                onClick={() => onOpenReviewModal(thesis)}
                className="mt-auto w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Buka & Review Dokumen
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};