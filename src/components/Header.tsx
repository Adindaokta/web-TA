import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  GitFork, 
  TableProperties, 
  FileEdit, 
  History, 
  RotateCcw,
  UserPlus,
  Send,
  ClipboardCheck,
  LogOut,
  UserCheck,
  KeyRound,
  Edit3,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { UserRole, Thesis, DosenProfile, AuthSession } from '../types/index.ts';
import { UserAvatar } from './common/UserAvatar.tsx';

interface HeaderProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  dosen: DosenProfile;
  currentStudent?: Thesis;
  totalThesesCount: number;
  onResetData: () => void;
  onOpenApplyModal: () => void;
  onOpenEditDosenProfile?: () => void;
  onOpenChangePassword?: () => void;
  onOpenEditStudentProfile?: () => void;
  onLogout: () => void;
  authSession?: AuthSession | null;
  pendingApplicantsCount: number;
  pendingTitlesCount: number;
  pendingAttendanceCount?: number;
  pendingReviewCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  dosen,
  currentStudent,
  totalThesesCount,
  onResetData,
  onOpenApplyModal,
  onOpenEditDosenProfile,
  onOpenChangePassword,
  onOpenEditStudentProfile,
  onLogout,
  authSession,
  pendingApplicantsCount,
  pendingTitlesCount,
  pendingAttendanceCount = 0,
  pendingReviewCount = 0
}) => {
  const [showNotif, setShowNotif] = useState(false);

  // --- LOGIKA NOTIFIKASI PINTAR (REAL-TIME) ---
  const getNotifications = () => {
    const notifs = [];
    
    if (currentRole === 'dosen') {
      if (pendingReviewCount > 0) {
        notifs.push({ id: 'd1', title: 'Antrean Review Bab', desc: `Ada ${pendingReviewCount} dokumen draft mahasiswa menunggu direview.`, type: 'warning' });
      }
      if (pendingTitlesCount > 0) {
        notifs.push({ id: 'd2', title: 'Usulan Judul', desc: `Ada ${pendingTitlesCount} pengajuan ganti judul baru.`, type: 'info' });
      }
      if (pendingApplicantsCount > 0) {
        notifs.push({ id: 'd3', title: 'Pendaftar Baru', desc: `Ada ${pendingApplicantsCount} mahasiswa mendaftar bimbingan.`, type: 'success' });
      }
      if (pendingAttendanceCount > 0) {
        notifs.push({ id: 'd4', title: 'Presensi Bimbingan', desc: `Ada ${pendingAttendanceCount} presensi menunggu verifikasi Anda.`, type: 'indigo' });
      }
    } else if (currentRole === 'mahasiswa' && currentStudent) {
      if (currentStudent.skStatus === 'Sudah SK') {
        notifs.push({ id: 'm1', title: 'SK Telah Terverifikasi', desc: 'Berkas SK Tugas Akhir Anda telah disetujui oleh Dosen.', type: 'success' });
      } else if (currentStudent.skVerificationStatus === 'Ditolak') {
        notifs.push({ id: 'm4', title: 'SK Ditolak', desc: 'Verifikasi SK Anda ditolak, silakan unggah ulang dokumen yang benar.', type: 'danger' });
      }
      
      const latestLog = currentStudent.logs?.[0];
      if (latestLog && latestLog.status !== 'Menunggu Review' && latestLog.reviewedAt) {
        notifs.push({ 
          id: 'm2', 
          title: `Hasil Review ${latestLog.chapter}`, 
          desc: `Draft Anda telah direview dengan status: ${latestLog.status}.`, 
          type: latestLog.status === 'Disetujui (ACC)' ? 'success' : 'warning' 
        });
      }

      if (currentStudent.titleStatus === 'Approved') {
        notifs.push({ id: 'm3', title: 'Judul Disetujui', desc: `Judul Skripsi Anda telah di-ACC.`, type: 'success' });
      }
    }
    return notifs;
  };

  const notifications = getNotifications();

  interface TabItem {
    id: string;
    label: string;
    icon: any;
    badge?: string;
    count?: number;
  }

  const dosenTabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard Visualisasi', icon: LayoutDashboard },
    { id: 'review-queue', label: 'Antrean Review Bab', icon: FileEdit, count: pendingReviewCount > 0 ? pendingReviewCount : undefined },
    { id: 'attendance', label: 'Presensi Bimbingan', icon: ClipboardCheck, count: pendingAttendanceCount > 0 ? pendingAttendanceCount : undefined },
    { id: 'applicants', label: 'Pendaftar & Ganti Judul', icon: UserPlus, count: (pendingApplicantsCount + pendingTitlesCount) > 0 ? (pendingApplicantsCount + pendingTitlesCount) : undefined },
    { id: 'clusters', label: 'Klaster Rumpun Riset', icon: GitFork },
    { id: 'table', label: `Tabel Manajemen Mahasiswa`, icon: TableProperties, count: totalThesesCount }
  ];

  const mahasiswaTabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard Personal', icon: LayoutDashboard },
    { id: 'attendance', label: 'Presensi Bimbingan', icon: ClipboardCheck, count: currentStudent?.attendances?.length },
    { id: 'update', label: 'Form Update Progres', icon: FileEdit },
    { id: 'logs', label: 'Log Bimbingan', icon: History, count: currentStudent?.logs?.length }
  ];

  const tabs = currentRole === 'dosen' ? dosenTabs : mahasiswaTabs;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-3.5 gap-3 border-b border-slate-800/80">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-white/20 shrink-0">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  SkripsiTrack
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sistem Informasi Tugas Akhir &bull; <strong className="text-slate-300">Ir. Syaifuddin S.Kom., M.Kom.</strong> &bull; <span className="text-indigo-300 font-medium">Informatika UMM</span>
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            
            {/* --- FITUR LONCENG NOTIFIKASI --- */}
            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)} 
                className="relative p-2.5 text-slate-400 hover:text-white transition rounded-full hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer"
                title="Notifikasi"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse ring-2 ring-slate-900"></span>
                )}
              </button>

              {/* Dropdown Notifikasi */}
              {showNotif && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Bell className="h-4 w-4 text-indigo-600" />
                      Pusat Notifikasi
                    </h3>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                      {notifications.length} Baru
                    </span>
                  </div>
                  
                  <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        Tidak ada notifikasi terbaru.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {notifications.map(notif => (
                          <div key={notif.id} className="p-4 hover:bg-slate-50 transition flex gap-3">
                            <div className="shrink-0 mt-0.5">
                              {notif.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                              {notif.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500" />}
                              {notif.type === 'info' && <Info className="h-5 w-5 text-sky-500" />}
                              {notif.type === 'danger' && <AlertCircle className="h-5 w-5 text-rose-500" />}
                              {notif.type === 'indigo' && <ClipboardCheck className="h-5 w-5 text-indigo-500" />}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 mb-0.5">{notif.title}</h4>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{notif.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* --------------------------------- */}

            {currentRole === 'dosen' ? (
              <>
                <div className="hidden md:flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400">Sesi:</span>
                  <span className="font-bold text-white">Dosen Pembimbing</span>
                </div>
                {onOpenEditDosenProfile && (
                  <button onClick={onOpenEditDosenProfile} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition shadow-xs cursor-pointer">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Profil Dosen</span>
                  </button>
                )}
                <button onClick={onOpenApplyModal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition cursor-pointer">
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Bimbingan Baru</span>
                </button>
                <button onClick={onResetData} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700/60 transition cursor-pointer" title="Reset Data">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                {currentStudent && (
                  <div className="hidden sm:flex items-center gap-2.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
                    <UserAvatar name={currentStudent.studentName} size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-white truncate max-w-[150px]">{currentStudent.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">NIM: {currentStudent.nim}</div>
                    </div>
                  </div>
                )}
                {onOpenChangePassword && (
                  <button onClick={onOpenChangePassword} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer">
                    <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                  </button>
                )}
                {onOpenEditStudentProfile && (
                  <button onClick={onOpenEditStudentProfile} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer">
                    <Edit3 className="h-3.5 w-3.5 text-indigo-300" />
                  </button>
                )}
              </>
            )}

            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer ml-1">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Sub-Bar: Navigation Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-2 pb-1 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-2 py-1 overflow-x-auto w-full md:w-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Context Snippet */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            {currentRole === 'dosen' ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Total Bimbingan:</span>
                <span className="font-bold text-slate-200">{totalThesesCount} Mahasiswa</span>
              </div>
            ) : (
              currentStudent && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Status Tugas Akhir:</span>
                  <span className="font-semibold text-slate-200">
                    {currentStudent.titleStatus === 'Approved' ? 'ACC Judul' : 'Pending ACC'}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};