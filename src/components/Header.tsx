import React from 'react';
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
  GraduationCap,
  Edit3
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
  pendingAttendanceCount = 0
}) => {
  interface TabItem {
    id: string;
    label: string;
    icon: any;
    badge?: string;
    count?: number;
  }

  const dosenTabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard Visualisasi', icon: LayoutDashboard },
    { 
      id: 'attendance', 
      label: 'Presensi Bimbingan', 
      icon: ClipboardCheck, 
      count: pendingAttendanceCount > 0 ? pendingAttendanceCount : undefined 
    },
    { 
      id: 'applicants', 
      label: 'Pendaftar & Ganti Judul', 
      icon: UserPlus, 
      count: (pendingApplicantsCount + pendingTitlesCount) > 0 ? (pendingApplicantsCount + pendingTitlesCount) : undefined 
    },
    { id: 'clusters', label: 'Klaster Rumpun Riset', icon: GitFork },
    { id: 'table', label: `Tabel Manajemen ${totalThesesCount} Mahasiswa`, icon: TableProperties, count: totalThesesCount }
  ];

  const mahasiswaTabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard Personal', icon: LayoutDashboard },
    { 
      id: 'attendance', 
      label: 'Presensi Bimbingan', 
      icon: ClipboardCheck, 
      count: currentStudent?.attendances?.length 
    },
    { id: 'update', label: 'Form Update Progres', icon: FileEdit },
    { id: 'logs', label: 'Log Bimbingan', icon: History, count: currentStudent?.logs?.length }
  ];

  const tabs = currentRole === 'dosen' ? dosenTabs : mahasiswaTabs;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Brand & Session-Specific Controls (NO ROLE SWITCHER) */}
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

          {/* Right Controls: STRICT Role Profile & Actions (NO SWITCHER) */}
          <div className="flex items-center flex-wrap gap-2.5">
            {currentRole === 'dosen' ? (
              /* DOSEN LOGGED-IN CONTROLS */
              <>
                {/* Dosen Badge */}
                <div className="hidden md:flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400">Sesi:</span>
                  <span className="font-bold text-white">Dosen Pembimbing</span>
                  <span className="text-slate-400 font-mono text-[11px]">(NIP. {dosen.nip})</span>
                </div>

                {/* Edit Profil Dosen */}
                {onOpenEditDosenProfile && (
                  <button
                    onClick={onOpenEditDosenProfile}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition shadow-xs cursor-pointer"
                    title="Edit Profil Lengkap Dosen Pembimbing"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-indigo-300" />
                    <span>Profil Dosen</span>
                  </button>
                )}

                {/* Public Apply Modal (Jalur B) */}
                <button
                  onClick={onOpenApplyModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  title="Formulir Pendaftaran Mahasiswa Baru (Jalur B)"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Ajukan Bimbingan Baru</span>
                </button>

                {/* Reset Data Button */}
                <button
                  onClick={onResetData}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700/60 transition cursor-pointer"
                  title="Reset data demo ke awal (35 mahasiswa aktif)"
                  aria-label="Reset data ke awal"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            ) : (
              /* MAHASISWA LOGGED-IN CONTROLS */
              <>
                {currentStudent && (
                  <div className="flex items-center gap-2.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
                    <UserAvatar name={currentStudent.studentName} size="sm" shape="circle" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white truncate max-w-[150px]">
                          {currentStudent.studentName}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          currentStudent.graduationTrack === 'Jurnal'
                            ? 'bg-violet-500/30 text-violet-300 border border-violet-500/40'
                            : 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                        }`}>
                          {currentStudent.graduationTrack}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        NIM: {currentStudent.nim}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ubah Password Mahasiswa */}
                {onOpenChangePassword && (
                  <button
                    onClick={onOpenChangePassword}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                    title="Ganti Password Akun Mahasiswa"
                  >
                    <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                    <span>Ganti Password</span>
                  </button>
                )}

                {/* Edit Profil Mahasiswa */}
                {onOpenEditStudentProfile && (
                  <button
                    onClick={onOpenEditStudentProfile}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                    title="Edit Profil Mahasiswa Lengkap"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-indigo-300" />
                    <span>Edit Profil</span>
                  </button>
                )}
              </>
            )}

            {/* Logout Button (Common to all authenticated roles) */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition shadow-xs cursor-pointer ml-1"
              title="Keluar dari sesi akun saat ini"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-300" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Bottom Sub-Bar: Navigation Tabs (STRICT TO CURRENT ROLE ONLY) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-2 pb-1 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-2 py-1 overflow-x-auto w-full md:w-auto" aria-label="Tabs Navigasi">
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
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                      {tab.badge}
                    </span>
                  )}
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
                <span className="text-slate-500 text-[11px]">&bull; Panel Pembimbing</span>
              </div>
            ) : (
              currentStudent && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Status Tugas Akhir:</span>
                  <span className="font-semibold text-slate-200">
                    {currentStudent.titleStatus === 'Approved' ? 'ACC Judul (Bab 1)' : 'Pending ACC'}
                  </span>
                  <span className="text-slate-500 text-[11px]">&bull; {currentStudent.skStatus}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
