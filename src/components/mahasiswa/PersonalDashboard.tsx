import React, { useMemo } from 'react';
import { 
  BookOpen, 
  Clock, 
  FileCheck2, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  FileEdit, 
  ArrowRight, 
  History, 
  Award, 
  Sparkles, 
  Info, 
  Edit3, 
  KeyRound, 
  ShieldAlert,
  ClipboardCheck,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
  UploadCloud,
  FileText,
  Newspaper
} from 'lucide-react';
import { Thesis, DosenProfile, ChapterStage } from '../../types/index.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';
import { CHAPTER_ORDER } from '../../utils/rules.ts';

interface PersonalDashboardProps {
  thesis: Thesis;
  dosen: DosenProfile;
  onNavigateTab: (tab: string) => void;
  onRequestChangeTitle: () => void;
  onRequestChangePassword: () => void;
  onRequestEditProfile: () => void;
  onOpenUploadSK: () => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  thesis,
  dosen,
  onNavigateTab,
  onRequestChangeTitle,
  onRequestChangePassword,
  onRequestEditProfile,
  onOpenUploadSK
}) => {
  const currentMonthRounded = Math.ceil(thesis.durationMonths);
  const pendingTitleChange = thesis.titleChangeRequests?.find(t => t.status === 'Pending');
  const attendances = thesis.attendances || [];
  const verifiedAttendances = attendances.filter(a => a.status === 'Hadir (Diverifikasi)');

  // LOGIKA PINTAR: Update status Milestone secara Real-time berdasarkan thesis.currentChapter
  const dynamicMilestones = useMemo(() => {
    const currentChapterIndex = CHAPTER_ORDER.indexOf(thesis.currentChapter);
    
    return thesis.milestones.map((milestone) => {
      // Bandingkan bab pada milestone dengan bab mahasiswa saat ini
      const milestoneChapterIndex = CHAPTER_ORDER.indexOf(milestone.expectedChapter);
      
      let isCompleted = false;
      let isCurrent = false;

      // Jika bab saat ini berada lebih tinggi dari bab pada milestone, berarti sudah selesai (ACC)
      if (currentChapterIndex > milestoneChapterIndex) {
        isCompleted = true;
      } 
      // Jika sama persis, berarti sedang berjalan (Warna Biru)
      else if (currentChapterIndex === milestoneChapterIndex) {
        isCurrent = true;
      }

      // Khusus untuk Pasca Sidang
      if (milestone.expectedChapter === 'Pasca Sidang' && thesis.currentChapter === 'Pasca Sidang') {
        isCurrent = true;
        isCompleted = false;
      }

      return {
        ...milestone,
        isCompleted,
        isCurrent
      };
    });
  }, [thesis.currentChapter, thesis.milestones]);

  return (
    <div className="space-y-6">
      {/* Alert if default password needs change */}
      {thesis.mustChangePassword && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 bg-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold block">Peringatan Keamanan Akun (Jalur A):</span>
              <span>
                Anda saat ini menggunakan password bawaan sistem (<code>bimbingan123</code>). Segera ubah password Anda.
              </span>
            </div>
          </div>
          <button
            onClick={onRequestChangePassword}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Ganti Password Sekarang</span>
          </button>
        </div>
      )}

      {/* Student Thesis Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Clean Initials Avatar Badge */}
            <UserAvatar name={thesis.studentName} size="xl" shape="rounded" />

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                  {thesis.cluster}
                </span>

                {/* Jalur Kelulusan Badge */}
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                  thesis.graduationTrack === 'Jurnal'
                    ? 'bg-violet-500/30 text-violet-200 border-violet-500/50'
                    : 'bg-indigo-500/30 text-indigo-200 border-indigo-500/50'
                }`}>
                  Jalur: {thesis.graduationTrack || 'Skripsi'}
                  {thesis.graduationTrack === 'Jurnal' && thesis.journalStage && ` (${thesis.journalStage})`}
                </span>

                {thesis.titleStatus === 'Approved' ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Judul Disetujui (ACC: {thesis.approvedAt})
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-500/50 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Validasi Judul: Pending
                  </span>
                )}

                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  thesis.riskLevel === 'Kritis' ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50' :
                  thesis.riskLevel === 'Waspada' ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50' :
                  'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                }`}>
                  Status Progres: {thesis.riskLevel}
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                {thesis.studentName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-300 font-mono">
                <span>NIM: {thesis.nim}</span>
                <span>&bull;</span>
                <span>{thesis.email}</span>
                <span>&bull;</span>
                <span>WA/HP: {thesis.phone || '0812-xxxx-xxxx'}</span>
                <button
                  type="button"
                  onClick={onRequestEditProfile}
                  className="inline-flex items-center gap-1 ml-1 px-2.5 py-0.5 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 border border-indigo-400/40 text-[11px] font-sans font-bold transition cursor-pointer"
                  title="Perbarui data profil lengkap mahasiswa"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit Profil Lengkap</span>
                </button>
              </div>

              {(thesis.address || thesis.emergencyContactName || thesis.targetGraduationSemester) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-1 font-sans">
                  {thesis.targetGraduationSemester && (
                    <span>Target: <strong className="text-slate-300">{thesis.targetGraduationSemester}</strong></span>
                  )}
                  {thesis.address && (
                    <span>&bull; Domisili: <span className="text-slate-300">{thesis.address}</span></span>
                  )}
                  {thesis.emergencyContactName && (
                    <span>&bull; Wali: <span className="text-slate-300">{thesis.emergencyContactName} {thesis.emergencyContactPhone ? `(${thesis.emergencyContactPhone})` : ''}</span></span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dosen Pembimbing Info Box (Single Tenant) */}
          <div className="bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-700/80 text-xs shrink-0 max-w-sm">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
              Dosen Pembimbing Skripsi
            </span>
            <div className="font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-400" />
              <span>{dosen.name}</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-mono">
              NIP. {dosen.nip}
            </div>
            <div className="text-[11px] font-medium text-indigo-300 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>Informatika UMM</span>
            </div>
          </div>
        </div>

        {/* Thesis Title Box with Change Title Action */}
        <div className="mt-5 pt-4 border-t border-slate-800/90 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Judul Naskah Skripsi / Tugas Akhir
              </span>
              {pendingTitleChange && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  Usulan Ganti Judul Sedang Ditinjau Dosen
                </span>
              )}
            </div>
            <p className="text-sm md:text-base font-semibold text-slate-100 mt-1 leading-snug">
              "{thesis.title}"
            </p>
          </div>

          <button
            onClick={onRequestChangeTitle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition self-start shrink-0 cursor-pointer"
            title="Ajukan perubahan judul jika terdapat instruksi revisi mayor dosen"
          >
            <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Ajukan Ganti Judul</span>
          </button>
        </div>
      </div>

      {/* SK TUGAS AKHIR STATUS STRIP (BUKAN BLOCKER) */}
      <div className={`p-5 rounded-2xl border transition-all ${
        thesis.skStatus === 'Sudah SK' 
          ? 'bg-blue-50/70 border-blue-200' 
          : thesis.skVerificationStatus === 'Menunggu Verifikasi'
          ? 'bg-amber-50/80 border-amber-200'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl ${
              thesis.skStatus === 'Sudah SK' 
                ? 'bg-blue-600 text-white' 
                : thesis.skVerificationStatus === 'Menunggu Verifikasi'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-white'
            }`}>
              <FileCheck2 className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-800">
                  Status SK Tugas Akhir:
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  thesis.skStatus === 'Sudah SK'
                    ? 'bg-blue-600 text-white'
                    : thesis.skVerificationStatus === 'Menunggu Verifikasi'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 text-slate-800 border border-slate-300'
                }`}>
                  {thesis.skStatus === 'Sudah SK' ? 'Sudah SK (Terverifikasi)' : 
                   thesis.skVerificationStatus === 'Menunggu Verifikasi' ? 'SK Diunggah (Menunggu Verifikasi Dosen)' : 
                   'Belum SK'}
                </span>

                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                  &bull; Bukan Blocker: Bimbingan & Upload Tetap Berjalan Penuh
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {thesis.skStatus === 'Sudah SK' ? (
                  <>
                    Nomor SK: <strong className="font-mono text-blue-900">{thesis.skNumber}</strong> &bull; Tanggal Terbit: <strong>{thesis.skDate || '-'}</strong>. SK telah diverifikasi sah oleh dosen pembimbing.
                  </>
                ) : thesis.skVerificationStatus === 'Menunggu Verifikasi' ? (
                  <>
                    Nomor SK diajukan: <strong className="font-mono text-amber-900">{thesis.skNumber}</strong>. Berkas PDF telah dikirim ke Dosen Pembimbing untuk diverifikasi.
                  </>
                ) : (
                  <>
                    Mahasiswa dengan judul yang telah disetujui (Approved) <strong>dapat langsung melakukan bimbingan, mengisi presensi, dan mengunggah draf Bab 1 s/d Bab 5</strong> meskipun belum memiliki SK Tugas Akhir. Durasi bimbingan ideal dihitung sejak tanggal ACC judul ({thesis.approvedAt || 'Pending'}).
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onOpenUploadSK}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer ${
                thesis.skStatus === 'Sudah SK'
                  ? 'bg-white hover:bg-slate-100 text-blue-700 border border-blue-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              <UploadCloud className="h-4 w-4" />
              <span>{thesis.skStatus === 'Sudah SK' ? 'Perbarui Berkas SK' : 'Unggah SK Tugas Akhir'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Chapter or Journal Stage */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">
              {thesis.graduationTrack === 'Jurnal' ? 'Status Manuskrip Jurnal' : 'Tahap Naskah Skripsi'}
            </span>
            {thesis.graduationTrack === 'Jurnal' ? (
              <Newspaper className="h-4 w-4 text-violet-600" />
            ) : (
              <BookOpen className="h-4 w-4 text-indigo-600" />
            )}
          </div>
          <div className={`mt-2 text-2xl font-extrabold ${thesis.graduationTrack === 'Jurnal' ? 'text-violet-700' : 'text-indigo-700'}`}>
            {thesis.graduationTrack === 'Jurnal' ? (thesis.journalStage || 'Draft') : thesis.currentChapter}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Jalur: <strong className="text-slate-700">{thesis.graduationTrack || 'Skripsi'}</strong> &bull; {thesis.titleStatus === 'Approved' ? 'ACC' : 'Pending'}
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Durasi Sejak ACC</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {thesis.durationMonths} <span className="text-sm font-normal text-slate-500">Bulan</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            ACC: <strong className="text-slate-700">{thesis.approvedAt || 'Belum ACC'}</strong>
          </div>
        </div>

        {/* Presensi Bimbingan Card */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Presensi Bimbingan</span>
            <ClipboardCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-700">
            {verifiedAttendances.length} <span className="text-sm font-normal text-slate-500">/ {attendances.length} Hadir</span>
          </div>
          <div 
            className="mt-2 text-xs text-indigo-600 font-semibold cursor-pointer hover:underline flex items-center gap-1"
            onClick={() => onNavigateTab('attendance')}
          >
            <span>Kelola Presensi &bull; Buka Modul</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* Status Sidang & Luaran */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Status Sidang & Luaran</span>
            <Award className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-800">
            Sidang: <span className="text-indigo-600">{thesis.defenseStatus}</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 truncate">
            {thesis.graduationTrack === 'Jurnal' ? (
              <span>Target: <strong className="text-violet-700">{thesis.journalName || 'Jurnal UMM'}</strong></span>
            ) : (
              <span>Target: <strong className="text-indigo-700">Ujian Sidang Skripsi</strong></span>
            )}
          </div>
        </div>
      </div>

      {/* Target Roadmap Milestone Section (Visual Timeline) */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-800 text-base">
                Roadmap Target Waktu Standar Penyelesaian Skripsi
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Target 6 Bulan Kelulusan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Panduan waktu baku bimbingan Bapak Ir. Syaifuddin S.Kom., M.Kom. (Informatika UMM) untuk memonitor progres penulisan dan riset skripsi.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              <span>Presensi Bimbingan</span>
            </button>
            <button
              onClick={() => onNavigateTab('update')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <FileEdit className="h-3.5 w-3.5" />
              <span>{thesis.graduationTrack === 'Jurnal' ? 'Update Status Jurnal' : 'Update Progres Bab'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('logs')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <History className="h-3.5 w-3.5" />
              <span>Log Bimbingan ({thesis.logs.length})</span>
            </button>
          </div>
        </div>

        {/* MENGGUNAKAN LOGIKA PINTAR dynamicMilestones */}
        <div className="relative pt-4 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
            {dynamicMilestones.map((milestone) => {
              const isPast = milestone.isCompleted;
              const isCurrent = milestone.isCurrent;
              
              return (
                <div
                  key={milestone.month}
                  className={`relative p-4 rounded-xl border flex flex-col justify-between transition ${
                    isCurrent
                      ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                      : isPast
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50/60 border-slate-200 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                        isCurrent ? 'bg-indigo-600 text-white' :
                        isPast ? 'bg-emerald-600 text-white' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {milestone.label}
                      </span>

                      {isPast ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                        </span>
                      ) : (
                        <Circle className="h-4 w-4 text-slate-300" />
                      )}
                    </div>

                    <div className="font-bold text-xs text-slate-900 mb-1">
                      {milestone.expectedChapter}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-bold">
                    {isPast && <span className="text-emerald-700">&bull; Selesai Tuntas</span>}
                    {isCurrent && <span className="text-indigo-700">&bull; Tahap Sedang Berjalan</span>}
                    {!isPast && !isCurrent && <span className="text-slate-400">&bull; Tahap Berikutnya</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Insight Evaluation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800">Evaluasi Posisi Progres Anda:</span>
            <span className="text-slate-600 ml-1">
              Saat ini Anda berada pada tahapan <strong>{thesis.currentChapter}</strong>.
              Target standar kelulusan adalah 6 bulan.
              {thesis.riskLevel === 'Aman' && ' Progres penulisan dan eksperimen berjalan lancar sesuai target roadmap. Pertahankan konsistensi konsultasi berkala di Informatika UMM!'}
              {thesis.riskLevel === 'Waspada' && ' Peringatan: Durasi bimbingan mulai mendekati batas toleransi bab ini. Disarankan segera menyelesaikan naskah bab saat ini.'}
              {thesis.riskLevel === 'Kritis' && ' Peringatan Kritis: Durasi Anda telah melewati batas toleransi ideal. Segera lakukan bimbingan tatap muka dengan Bapak Ir. Syaifuddin S.Kom., M.Kom.!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};