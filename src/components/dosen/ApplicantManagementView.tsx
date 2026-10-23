import React, { useState } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Edit3,
  Calendar,
  Send
} from 'lucide-react';
import { NewApplicant, TitleChangeRequest } from '../../types/index.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface ApplicantManagementViewProps {
  applicants: NewApplicant[];
  titleChangeRequests: TitleChangeRequest[];
  onApproveApplicant: (applicantId: string) => void;
  onRejectApplicant: (applicantId: string, reason: string) => void;
  onApproveTitleChange: (requestId: string) => void;
  onRejectTitleChange: (requestId: string, notes: string) => void;
}

export const ApplicantManagementView: React.FC<ApplicantManagementViewProps> = ({
  applicants,
  titleChangeRequests,
  onApproveApplicant,
  onRejectApplicant,
  onApproveTitleChange,
  onRejectTitleChange
}) => {
  const [activeTab, setActiveTab] = useState<'applicants' | 'titles'>('applicants');
  const [selectedRejectApplicantId, setSelectedRejectApplicantId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectTitleId, setSelectedRejectTitleId] = useState<string | null>(null);
  const [rejectTitleNotes, setRejectTitleNotes] = useState('');

  const pendingApplicantsCount = applicants.filter(a => a.status === 'Pending').length;
  const pendingTitlesCount = titleChangeRequests.filter(t => t.status === 'Pending').length;

  const handleConfirmRejectApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRejectApplicantId) return;
    onRejectApplicant(selectedRejectApplicantId, rejectReason || 'Topik belum sesuai dengan roadmap riset Informatika UMM.');
    setSelectedRejectApplicantId(null);
    setRejectReason('');
  };

  const handleConfirmRejectTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRejectTitleId) return;
    onRejectTitleChange(selectedRejectTitleId, rejectTitleNotes || 'Judul lama masih relevan, pertahankan fokus eksperimen.');
    setSelectedRejectTitleId(null);
    setRejectTitleNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Manajemen Pendaftar Baru & Pengajuan Judul
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifikasi pengajuan bimbingan dari Landing Page (Jalur B) dan persetujuan perubahan judul skripsi mahasiswa
              </p>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition ${
              activeTab === 'applicants'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pendaftar Baru (Jalur B)</span>
            {pendingApplicantsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {pendingApplicantsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('titles')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition ${
              activeTab === 'titles'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pengajuan Ganti Judul</span>
            {pendingTitlesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {pendingTitlesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: Pendaftar Baru (Jalur B) */}
      {activeTab === 'applicants' && (
        <div className="space-y-4">
          {applicants.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Belum ada pengajuan bimbingan baru dari Landing Page.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={applicant.name} size="md" shape="circle" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">
                            {applicant.name}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                            {applicant.nim}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {applicant.email} &bull; WA: {applicant.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        applicant.status === 'Diterima' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        applicant.status === 'Ditolak' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {applicant.status === 'Pending' ? 'Menunggu Konfirmasi Dosen' : applicant.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {applicant.submittedAt}
                      </span>
                    </div>
                  </div>

                  {/* Proposed Title & Cluster */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500">Rumpun Riset:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                        {applicant.cluster}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">Usulan Judul:</span>
                      <p className="font-semibold text-indigo-900 text-sm mt-0.5">
                        "{applicant.proposedTitle}"
                      </p>
                    </div>
                    {applicant.proposalSummary && (
                      <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                        {applicant.proposalSummary}
                      </p>
                    )}
                  </div>

                  {/* Generated Password Pill if Diterima */}
                  {applicant.status === 'Diterima' && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Key className="h-4 w-4 text-emerald-600" />
                        <span>Akun telah aktif! Username: <strong>{applicant.nim}</strong> | Password Default: <strong>bimbingan123</strong></span>
                      </div>
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                        Mahasiswa Aktif
                      </span>
                    </div>
                  )}

                  {/* Rejection Notice if Ditolak */}
                  {applicant.status === 'Ditolak' && applicant.rejectionReason && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <strong>Alasan Penolakan:</strong> "{applicant.rejectionReason}"
                    </div>
                  )}

                  {/* Action Buttons for Pending */}
                  {applicant.status === 'Pending' && (
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedRejectApplicantId(applicant.id)}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-semibold text-xs transition"
                      >
                        Tolak Pengajuan
                      </button>

                      <button
                        onClick={() => onApproveApplicant(applicant.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Terima & Generate Akun</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Pengajuan Ganti Judul */}
      {activeTab === 'titles' && (
        <div className="space-y-4">
          {titleChangeRequests.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Belum ada permohonan ganti judul dari mahasiswa.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {titleChangeRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {req.studentName} <span className="font-mono text-slate-400 text-xs">({req.nim})</span>
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Diajukan pada: {req.requestedAt}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      req.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      req.status === 'Ditolak' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {/* Title Diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Judul Lama</span>
                      <p className="text-slate-600 line-through">"{req.currentTitle}"</p>
                    </div>

                    <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-700">Usulan Judul Baru</span>
                      <p className="font-bold text-indigo-950">"{req.proposedTitle}"</p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                    <strong className="block text-slate-900 mb-0.5">Alasan Perubahan Judul:</strong>
                    "{req.reason}"
                  </div>

                  {/* Actions for Pending */}
                  {req.status === 'Pending' && (
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedRejectTitleId(req.id)}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-semibold text-xs transition"
                      >
                        Tolak Perubahan
                      </button>

                      <button
                        onClick={() => onApproveTitleChange(req.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Setujui Perubahan Judul</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Rejection Reason for Applicant */}
      {selectedRejectApplicantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Konfirmasi Penolakan Pengajuan Bimbingan
            </h3>
            <p className="text-xs text-slate-500">
              Berikan alasan penolakan agar mahasiswa dapat memperbaiki usulan topik atau mendaftar ke dosen pembimbing lain.
            </p>
            <textarea
              rows={3}
              required
              placeholder="Contoh: Kuota bimbingan penuh / Topik di luar fokus riset Informatika UMM..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRejectApplicantId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectApplicant}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejection Reason for Title Change */}
      {selectedRejectTitleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Alasan Penolakan Perubahan Judul
            </h3>
            <textarea
              rows={3}
              required
              placeholder="Tuliskan catatan mengapa perubahan judul belum disetujui..."
              value={rejectTitleNotes}
              onChange={(e) => setRejectTitleNotes(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRejectTitleId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectTitle}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
