import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Video, 
  Search, 
  Filter, 
  User, 
  MessageSquare,
  Award,
  Send,
  Calendar
} from 'lucide-react';
import { AttendanceRecord, Thesis } from '../../types/index.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface AttendanceManagementViewProps {
  theses: Thesis[];
  onVerifyAttendance: (attendanceId: string, notes?: string) => void;
  onRejectAttendance: (attendanceId: string, notes?: string) => void;
}

export const AttendanceManagementView: React.FC<AttendanceManagementViewProps> = ({
  theses,
  onVerifyAttendance,
  onRejectAttendance
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'reject'>('verify');
  const [actionNotes, setActionNotes] = useState<string>('');

  // Collect all attendances across all theses
  const allAttendances: AttendanceRecord[] = [];
  theses.forEach(t => {
    if (t.attendances && t.attendances.length > 0) {
      allAttendances.push(...t.attendances);
    }
  });

  // Sort descending by date
  allAttendances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredAttendances = allAttendances.filter(att => {
    const matchStatus = filterStatus === 'Semua' || att.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || att.studentName.toLowerCase().includes(q) || att.nim.includes(q) || att.topicPlan.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const pendingCount = allAttendances.filter(a => a.status === 'Menunggu Verifikasi').length;
  const verifiedCount = allAttendances.filter(a => a.status === 'Hadir (Diverifikasi)').length;

  const handleOpenAction = (id: string, type: 'verify' | 'reject') => {
    setSelectedActionId(id);
    setActionType(type);
    setActionNotes(type === 'verify' ? 'Bimbingan terlaksana dengan baik di Informatika UMM.' : 'Tidak hadir pada jadwal konsultasi bimbingan.');
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActionId) return;

    if (actionType === 'verify') {
      onVerifyAttendance(selectedActionId, actionNotes);
    } else {
      onRejectAttendance(selectedActionId, actionNotes);
    }

    setSelectedActionId(null);
    setActionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">
                Presensi & Rekam Jejak Kehadiran Bimbingan
              </h2>
              {pendingCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  {pendingCount} Menunggu Verifikasi
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verifikasi kehadiran sesi bimbingan tatap muka di Informatika UMM atau online Google Meet
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
          <div className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
            {verifiedCount} Hadir
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold">
            {pendingCount} Menunggu
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Mahasiswa, NIM, atau Topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['Semua', 'Menunggu Verifikasi', 'Hadir (Diverifikasi)', 'Ditolak'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Cards List */}
      <div className="space-y-3">
        {filteredAttendances.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Belum ada rekam presensi bimbingan yang tercatat. Mahasiswa dapat mengisi form 'Presensi Bimbingan' sebelum atau saat sesi konsultasi.
          </div>
        ) : (
          filteredAttendances.map((att) => {
            const isVerified = att.status === 'Hadir (Diverifikasi)';
            const isRejected = att.status === 'Ditolak';
            const isPending = att.status === 'Menunggu Verifikasi';

            return (
              <div
                key={att.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={att.studentName} size="md" shape="circle" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">
                          {att.studentName}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                          {att.nim}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Calendar className="h-3.5 w-3.5" /> {att.date} {att.time ? `(${att.time})` : ''}
                        </span>
                        <span className="flex items-center gap-1 text-indigo-600 font-medium">
                          {att.method.includes('Offline') ? <MapPin className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                          {att.method}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full self-start sm:self-auto flex items-center gap-1 ${
                    isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    isRejected ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isVerified && <CheckCircle2 className="h-3 w-3" />}
                    {isRejected && <XCircle className="h-3 w-3" />}
                    {isPending && <Clock className="h-3 w-3" />}
                    {att.status}
                  </span>
                </div>

                {/* Topic Plan */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Rencana / Materi yang Dibahas Saat Bimbingan:
                  </span>
                  <p className="text-slate-800 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                    "{att.topicPlan}"
                  </p>
                </div>

                {/* Dosen Notes if verified or rejected */}
                {att.dosenNotes && (
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] text-indigo-800">Catatan Dosen Pembimbing:</strong>
                      <span>"{att.dosenNotes}"</span>
                      {att.verifiedAt && (
                        <span className="block text-[10px] text-slate-400 mt-1 font-mono">Diverifikasi: {att.verifiedAt}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions for Pending */}
                {isPending && (
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenAction(att.id, 'reject')}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-semibold text-xs transition"
                    >
                      Tolak Presensi
                    </button>
                    <button
                      onClick={() => handleOpenAction(att.id, 'verify')}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verifikasi Kehadiran (Hadir)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Action Verification / Rejection */}
      {selectedActionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {actionType === 'verify' ? 'Verifikasi Kehadiran Mahasiswa' : 'Tolak Presensi Bimbingan'}
            </h3>
            <p className="text-xs text-slate-500">
              {actionType === 'verify' 
                ? 'Konfirmasi bahwa mahasiswa telah hadir mengikuti bimbingan skripsi sesuai rencana topik.' 
                : 'Berikan alasan mengapa presensi ini tidak diverifikasi/ditolak.'}
            </p>

            <textarea
              rows={3}
              required
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Tuliskan catatan evaluasi bimbingan tatap muka..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedActionId(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm transition ${
                  actionType === 'verify' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{actionType === 'verify' ? 'Simpan Verifikasi Hadir' : 'Kirim Penolakan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
