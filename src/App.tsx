/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Filter, RotateCcw, ShieldCheck, Users, Edit3, Award, Clock, MapPin, Building2, Mail, Phone } from 'lucide-react';
import { UserRole, Thesis, ChapterStage, LogStatus, NewApplicant, TitleChangeRequest, AttendanceRecord, DosenProfile, AuthSession } from './types/index.ts';
import { CURRENT_DOSEN, INITIAL_THESES, INITIAL_APPLICANTS, standardMilestones } from './data/mockData.ts';
import { calculateRiskLevel, extractAngkatan } from './utils/rules.ts';
import { Header } from './components/Header.tsx';
import { SummaryCards } from './components/dosen/SummaryCards.tsx';
import { BottleneckChart } from './components/dosen/BottleneckChart.tsx';
import { RiskScatterPlot } from './components/dosen/RiskScatterPlot.tsx';
import { DistributionCharts } from './components/dosen/DistributionCharts.tsx';
import { MonthlyGuidanceTrendChart } from './components/dosen/MonthlyGuidanceTrendChart.tsx';
import { ResearchClustersView } from './components/dosen/ResearchClustersView.tsx';
import { ProgressTableView } from './components/dosen/ProgressTableView.tsx';
import { ReviewModal } from './components/dosen/ReviewModal.tsx';
import { VerifySKModal } from './components/dosen/VerifySKModal.tsx';
import { EditDosenProfileModal } from './components/dosen/EditDosenProfileModal.tsx';
import { ApplicantManagementView } from './components/dosen/ApplicantManagementView.tsx';
import { AttendanceManagementView } from './components/dosen/AttendanceManagementView.tsx';
import { PersonalDashboard } from './components/mahasiswa/PersonalDashboard.tsx';
import { AttendanceView } from './components/mahasiswa/AttendanceView.tsx';
import { UpdateProgressForm } from './components/mahasiswa/UpdateProgressForm.tsx';
import { LogBimbinganView } from './components/mahasiswa/LogBimbinganView.tsx';
import { ChangeTitleModal } from './components/mahasiswa/ChangeTitleModal.tsx';
import { ChangePasswordModal } from './components/mahasiswa/ChangePasswordModal.tsx';
import { UploadSKModal } from './components/mahasiswa/UploadSKModal.tsx';
import { ApplyGuidanceModal } from './components/public/ApplyGuidanceModal.tsx';
import { EditProfileModal, StudentProfileUpdatePayload } from './components/mahasiswa/EditProfileModal.tsx';
import { LoginScreen } from './components/auth/LoginScreen.tsx';

const LOCAL_STORAGE_KEY_AUTH = 'skripsitrack_auth_session_strict_v2';
const LOCAL_STORAGE_KEY_DOSEN = 'skripsitrack_dosen_profile_syaifuddin_v2';
const LOCAL_STORAGE_KEY_THESES = 'skripsitrack_theses_syaifuddin_v14_prod';
const LOCAL_STORAGE_KEY_APPLICANTS = 'skripsitrack_applicants_syaifuddin_v14_prod';

export default function App() {
  // Session Authentication State (Protected Routes: null -> Halaman Login)
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse cached auth session:', e);
    }
    return null;
  });

  const currentRole: UserRole = authSession ? authSession.role : 'guest';
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Mahasiswa yang sedang login didapat LANGSUNG dari authSession.userId
  const selectedStudentId = authSession?.role === 'mahasiswa' && authSession.userId 
    ? authSession.userId 
    : INITIAL_THESES[0].id;

  const [reviewingThesis, setReviewingThesis] = useState<Thesis | null>(null);
  const [verifyingSKThesis, setVerifyingSKThesis] = useState<Thesis | null>(null);

  // Dashboard-level Filters (Dosen View)
  const [dashboardTrackFilter, setDashboardTrackFilter] = useState<'Semua' | 'Skripsi' | 'Jurnal'>('Semua');
  const [dashboardSKFilter, setDashboardSKFilter] = useState<'Semua' | 'Belum SK' | 'Sudah SK'>('Semua');
  const [dashboardAngkatanFilter, setDashboardAngkatanFilter] = useState<string>('Semua');

  // Table-level Filters (Dosen View)
  const [tableRiskFilter, setTableRiskFilter] = useState<string>('Semua');
  const [tableTitleFilter, setTableTitleFilter] = useState<'Semua' | 'Approved' | 'Pending'>('Semua');
  const [tableSKFilter, setTableSKFilter] = useState<'Semua' | 'Belum SK' | 'Sudah SK'>('Semua');
  const [tableTrackFilter, setTableTrackFilter] = useState<'Semua' | 'Skripsi' | 'Jurnal'>('Semua');
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<ChapterStage | 'All'>('All');

  // Modals state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isChangeTitleModalOpen, setIsChangeTitleModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isUploadSKModalOpen, setIsUploadSKModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditDosenModalOpen, setIsEditDosenModalOpen] = useState(false);

  // Load Dosen Profile (Single-Tenant Master)
  const [dosenProfile, setDosenProfile] = useState<DosenProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DOSEN);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse cached dosen profile:', e);
    }
    return CURRENT_DOSEN;
  });

  // Load theses data (Fixed 35 Initial Data)
  const [theses, setTheses] = useState<Thesis[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THESES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse cached theses:', e);
    }
    return INITIAL_THESES;
  });

  // Load applicants data (Jalur B)
  const [applicants, setApplicants] = useState<NewApplicant[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_APPLICANTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse cached applicants:', e);
    }
    return INITIAL_APPLICANTS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_THESES, JSON.stringify(theses));
    } catch (e) {
      console.error('Failed to save theses:', e);
    }
  }, [theses]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_APPLICANTS, JSON.stringify(applicants));
    } catch (e) {
      console.error('Failed to save applicants:', e);
    }
  }, [applicants]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DOSEN, JSON.stringify(dosenProfile));
    } catch (e) {
      console.error('Failed to save dosen profile:', e);
    }
  }, [dosenProfile]);

  // Current logged in student thesis record
  const currentStudent = useMemo(() => {
    if (authSession?.role === 'mahasiswa' && authSession.userId) {
      return theses.find(t => t.id === authSession.userId) || theses[0];
    }
    return theses[0];
  }, [authSession, theses]);

  // STRICT FORCE CHANGE PASSWORD DETECTION (BAIK DOSEN MAUPUN MAHASISWA)
  // Jika user (Dosen atau Mahasiswa) masih menggunakan password default,
  // sistem WAJIB memblokir layar secara mutlak sampai password baru disimpan.
  const isDosenForcePassword = useMemo(() => {
    if (authSession?.role !== 'dosen') return false;
    const isDefault = !dosenProfile.password || dosenProfile.password === 'dosen123';
    return Boolean(dosenProfile.mustChangePassword || isDefault);
  }, [authSession, dosenProfile]);

  const isStudentForcePassword = useMemo(() => {
    if (authSession?.role !== 'mahasiswa' || !currentStudent) return false;
    const isDefault = !currentStudent.password || currentStudent.password === 'bimbingan123';
    return Boolean(currentStudent.mustChangePassword || isDefault);
  }, [authSession, currentStudent]);

  const isForceChangePasswordActive = isDosenForcePassword || isStudentForcePassword;

  // URL Hash Synchronizer for Protected Routes
  const syncHashRoute = useCallback((role: 'dosen' | 'mahasiswa' | 'guest', tab: string) => {
    if (role === 'guest') {
      window.location.hash = '#/login';
    } else if (role === 'dosen') {
      window.location.hash = `#/dosen/${tab}`;
    } else if (role === 'mahasiswa') {
      window.location.hash = `#/mahasiswa/${tab}`;
    }
  }, []);

  // Update hash when activeTab or role changes
  useEffect(() => {
    if (!authSession) {
      window.location.hash = '#/login';
    } else {
      syncHashRoute(authSession.role, activeTab);
    }
  }, [authSession, activeTab, syncHashRoute]);

  // Listen to browser hash changes (e.g. back/forward button or URL typing)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!authSession) {
        if (hash !== '#/login') {
          window.location.hash = '#/login';
        }
        return;
      }

      if (authSession.role === 'dosen') {
        if (hash.startsWith('#/dosen/')) {
          const tab = hash.replace('#/dosen/', '');
          if (['dashboard', 'attendance', 'applicants', 'clusters', 'table'].includes(tab)) {
            setActiveTab(tab);
          }
        } else {
          // Protected Route: Dosen redirected back if trying to access unauthorized route
          window.location.hash = `#/dosen/${activeTab}`;
        }
      } else if (authSession.role === 'mahasiswa') {
        if (hash.startsWith('#/mahasiswa/')) {
          const tab = hash.replace('#/mahasiswa/', '');
          if (['dashboard', 'attendance', 'update', 'logs'].includes(tab)) {
            setActiveTab(tab);
          }
        } else {
          // Protected Route: Mahasiswa redirected back if trying to access unauthorized route
          window.location.hash = `#/mahasiswa/${activeTab}`;
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [authSession, activeTab]);

  // Aggregate title change requests
  const titleChangeRequests = useMemo(() => {
    const allReqs: TitleChangeRequest[] = [];
    theses.forEach(t => {
      if (t.titleChangeRequests && t.titleChangeRequests.length > 0) {
        allReqs.push(...t.titleChangeRequests);
      }
    });
    return allReqs;
  }, [theses]);

  // Aggregate pending attendance requests
  const pendingAttendanceCount = useMemo(() => {
    let count = 0;
    theses.forEach(t => {
      t.attendances?.forEach(a => {
        if (a.status === 'Menunggu Verifikasi') count++;
      });
    });
    return count;
  }, [theses]);

  const pendingApplicantsCount = applicants.filter(a => a.status === 'Pending').length;
  const pendingTitlesCount = titleChangeRequests.filter(t => t.status === 'Pending').length;

  // LOGIN HANDLER: Directs to /dosen/dashboard or /mahasiswa/dashboard
  const handleLogin = (session: AuthSession) => {
    setAuthSession(session);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_AUTH, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save auth session:', e);
    }
    setActiveTab('dashboard');
    syncHashRoute(session.role, 'dashboard');
  };

  // LOGOUT HANDLER: Clears session and returns to #/login
  const handleLogout = () => {
    setAuthSession(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH);
    } catch (e) {
      console.error('Failed to clear auth session:', e);
    }
    setActiveTab('dashboard');
    window.location.hash = '#/login';
  };

  // RESET ALL DATA TO CLEAN INITIAL STATE
  const handleResetData = () => {
    if (confirm('Reset seluruh data simulasi kembali ke kondisi awal (35 mahasiswa bimbingan, status Belum SK, log bersih)? Anda akan dialihkan ke Halaman Login.')) {
      setTheses(INITIAL_THESES);
      setApplicants(INITIAL_APPLICANTS);
      setDosenProfile(CURRENT_DOSEN);
      setAuthSession(null);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH);
        localStorage.removeItem(LOCAL_STORAGE_KEY_THESES);
        localStorage.removeItem(LOCAL_STORAGE_KEY_APPLICANTS);
        localStorage.removeItem(LOCAL_STORAGE_KEY_DOSEN);
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
      setActiveTab('dashboard');
      window.location.hash = '#/login';
    }
  };

  // Dynamic extraction of Angkatan from 4 digits of NIM (Mandat Prompt)
  const availableAngkatan = useMemo(() => {
    const years = Array.from(new Set(theses.map(t => extractAngkatan(t.nim)))).filter(y => y !== 'Lainnya').sort().reverse();
    return ['Semua', ...years];
  }, [theses]);

  // Multi-Filter Dashboard Filter Calculation (Jalur Kelulusan, Status SK, Angkatan)
  const dashboardFilteredTheses = useMemo(() => {
    return theses.filter(t => {
      // 1. Jalur Kelulusan (Skripsi vs Jurnal)
      if (dashboardTrackFilter === 'Skripsi' && (t.graduationTrack || 'Skripsi') !== 'Skripsi') return false;
      if (dashboardTrackFilter === 'Jurnal' && t.graduationTrack !== 'Jurnal') return false;

      // 2. Status SK (Belum SK vs Sudah SK)
      if (dashboardSKFilter !== 'Semua' && t.skStatus !== dashboardSKFilter) return false;

      // 3. Angkatan (4 digit pertama NIM)
      if (dashboardAngkatanFilter !== 'Semua') {
        const studentYear = extractAngkatan(t.nim);
        if (studentYear !== dashboardAngkatanFilter) return false;
      }

      return true;
    });
  }, [theses, dashboardTrackFilter, dashboardSKFilter, dashboardAngkatanFilter]);

  // Student update handler from Mahasiswa form
  const handleUpdateThesis = (updated: Thesis) => {
    const newRisk = calculateRiskLevel(updated.currentChapter, updated.durationMonths);
    const finalized = { ...updated, riskLevel: newRisk };
    setTheses(prev => prev.map(t => t.id === finalized.id ? finalized : t));
  };

  // Review submission handler from Dosen modal
  const handleSubmitReview = (
    thesisId: string, 
    feedback: string, 
    decision: LogStatus, 
    advanceChapter?: ChapterStage
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTheses(prev => prev.map(t => {
      if (t.id !== thesisId) return t;

      const newChapter = advanceChapter || t.currentChapter;
      const newRisk = calculateRiskLevel(newChapter, t.durationMonths);

      const updatedLogs = [...t.logs];
      if (updatedLogs.length > 0) {
        updatedLogs[0] = {
          ...updatedLogs[0],
          dosenFeedback: feedback,
          status: decision,
          reviewedAt: formattedDate
        };
      } else {
        // Add initial review record
        updatedLogs.unshift({
          id: `log-rev-${Date.now()}`,
          thesisId: t.id,
          chapter: newChapter,
          submissionDate: formattedDate,
          fileName: `Catatan_Bimbingan_Awal.pdf`,
          fileSize: '0.5 MB',
          studentNotes: 'Konsultasi berkas naskah awal bersama pembimbing.',
          dosenFeedback: feedback,
          status: decision,
          reviewedAt: formattedDate,
          version: 1
        });
      }

      return {
        ...t,
        currentChapter: newChapter,
        riskLevel: newRisk,
        lastUpdate: now.toISOString().split('T')[0],
        logs: updatedLogs
      };
    }));
  };

  // ATTENDANCE HANDLERS
  const handleVerifyAttendance = (attendanceId: string, notes?: string) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTheses(prev => prev.map(t => ({
      ...t,
      attendances: t.attendances?.map(a => a.id === attendanceId ? {
        ...a,
        status: 'Hadir (Diverifikasi)' as const,
        dosenNotes: notes || 'Bimbingan tatap muka di Informatika UMM telah diverifikasi dan disetujui.',
        verifiedAt: formattedDate
      } : a) || []
    })));
  };

  const handleRejectAttendance = (attendanceId: string, notes?: string) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTheses(prev => prev.map(t => ({
      ...t,
      attendances: t.attendances?.map(a => a.id === attendanceId ? {
        ...a,
        status: 'Ditolak' as const,
        dosenNotes: notes || 'Presensi bimbingan ditolak oleh dosen pembimbing.',
        verifiedAt: formattedDate
      } : a) || []
    })));
  };

  const handleAddAttendance = (data: Omit<AttendanceRecord, 'id' | 'status' | 'dosenNotes' | 'verifiedAt'>) => {
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      ...data,
      status: 'Menunggu Verifikasi'
    };

    setTheses(prev => prev.map(t => {
      if (t.id === data.thesisId) {
        return {
          ...t,
          attendances: [newRecord, ...(t.attendances || [])]
        };
      }
      return t;
    }));
  };

  // TITLE APPROVAL HANDLERS (Pending -> Approved)
  const handleApproveStudentTitle = (thesisId: string) => {
    const today = '2026-10-22';
    setTheses(prev => prev.map(t => {
      if (t.id !== thesisId) return t;
      return {
        ...t,
        titleStatus: 'Approved',
        approvedAt: today,
        currentChapter: 'Bab 1',
        durationMonths: 0.0,
        skStatus: 'Belum SK', // SK bukan blocker bimbingan
        lastUpdate: today,
        riskLevel: 'Aman'
      };
    }));
  };

  const handleReviseStudentTitle = (thesisId: string) => {
    setTheses(prev => prev.map(t => {
      if (t.id !== thesisId) return t;
      return {
        ...t,
        titleStatus: 'Perlu Revisi',
        lastUpdate: '2026-10-22'
      };
    }));
  };

  // SK SUBMISSION & VERIFICATION HANDLERS
  const handleSubmitSK = (data: {
    skNumber: string;
    skDate: string;
    fileName: string;
    fileSize: string;
    notes?: string;
  }) => {
    const today = '2026-10-22';
    setTheses(prev => prev.map(t => {
      if (t.id !== currentStudent.id) return t;
      return {
        ...t,
        skNumber: data.skNumber,
        skDate: data.skDate,
        skFileName: data.fileName,
        skUploadDate: today,
        skVerificationStatus: 'Menunggu Verifikasi',
        skStatus: 'Belum SK',
        skNotes: data.notes
      };
    }));
  };

  const handleConfirmVerifySK = (thesisId: string, skNumber: string, skDate: string, notes?: string) => {
    setTheses(prev => prev.map(t => {
      if (t.id !== thesisId) return t;
      return {
        ...t,
        skStatus: 'Sudah SK',
        skVerificationStatus: 'Diverifikasi',
        skNumber,
        skDate,
        skNotes: notes || 'SK telah diverifikasi sah oleh Dosen Pembimbing.'
      };
    }));
  };

  const handleRejectVerifySK = (thesisId: string, reason: string) => {
    setTheses(prev => prev.map(t => {
      if (t.id !== thesisId) return t;
      return {
        ...t,
        skVerificationStatus: 'Ditolak',
        skNotes: reason
      };
    }));
  };

  // JALUR B: Submit new applicant from Public Modal
  const handleSubmitNewApplication = (data: Omit<NewApplicant, 'id' | 'status' | 'submittedAt'>) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newApplicant: NewApplicant = {
      id: `app-${Date.now()}`,
      ...data,
      status: 'Pending',
      submittedAt: formattedDate
    };

    setApplicants(prev => [newApplicant, ...prev]);
  };

  // DOSEN ACTION: Approve Applicant
  const handleApproveApplicant = (applicantId: string) => {
    const target = applicants.find(a => a.id === applicantId);
    if (!target) return;

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];

    const newThesis: Thesis = {
      id: `thesis-${Date.now()}`,
      studentId: `std-${target.nim}`,
      studentName: target.name,
      nim: target.nim,
      email: target.email,
      avatar: target.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      title: target.proposedTitle,
      titleStatus: 'Approved',
      approvedAt: formattedDate,
      abstract: target.proposalSummary,
      cluster: target.cluster,
      currentChapter: 'Bab 1',
      durationMonths: 0.0,
      startDate: formattedDate,
      skStatus: 'Belum SK',
      skVerificationStatus: 'Belum Upload',
      defenseStatus: 'Belum Daftar',
      graduationTrack: 'Skripsi',
      journalStage: 'Draft',
      journalStatus: 'Belum',
      lastUpdate: formattedDate,
      riskLevel: 'Aman',
      mustChangePassword: true,
      milestones: standardMilestones('Bab 1'),
      attendances: [],
      logs: []
    };

    setApplicants(prev => prev.map(a => a.id === applicantId ? {
      ...a,
      status: 'Diterima',
      reviewedAt: formattedDate,
      generatedPassword: 'bimbingan123'
    } : a));

    setTheses(prev => [newThesis, ...prev]);
  };

  // DOSEN ACTION: Reject Applicant
  const handleRejectApplicant = (applicantId: string, reason: string) => {
    const now = new Date().toISOString().split('T')[0];
    setApplicants(prev => prev.map(a => a.id === applicantId ? {
      ...a,
      status: 'Ditolak',
      reviewedAt: now,
      rejectionReason: reason
    } : a));
  };

  // MAHASISWA ACTION: Request Title Change
  const handleSubmitTitleChange = (proposedTitle: string, reason: string) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRequest: TitleChangeRequest = {
      id: `tcr-${Date.now()}`,
      thesisId: currentStudent.id,
      studentName: currentStudent.studentName,
      nim: currentStudent.nim,
      currentTitle: currentStudent.title,
      proposedTitle,
      reason,
      status: 'Pending',
      requestedAt: formattedDate
    };

    setTheses(prev => prev.map(t => {
      if (t.id !== currentStudent.id) return t;
      return {
        ...t,
        titleChangeRequests: [newRequest, ...(t.titleChangeRequests || [])]
      };
    }));
  };

  // DOSEN ACTION: Approve Title Change
  const handleApproveTitleChange = (requestId: string) => {
    const now = new Date().toISOString().split('T')[0];

    setTheses(prev => prev.map(t => {
      const matchReq = t.titleChangeRequests?.find(r => r.id === requestId);
      if (!matchReq) return t;

      const updatedReqs = t.titleChangeRequests?.map(r => r.id === requestId ? {
        ...r,
        status: 'Disetujui' as const,
        reviewedAt: now
      } : r);

      return {
        ...t,
        title: matchReq.proposedTitle,
        lastUpdate: now,
        titleChangeRequests: updatedReqs
      };
    }));
  };

  // DOSEN ACTION: Reject Title Change
  const handleRejectTitleChange = (requestId: string, notes: string) => {
    const now = new Date().toISOString().split('T')[0];

    setTheses(prev => prev.map(t => {
      const matchReq = t.titleChangeRequests?.find(r => r.id === requestId);
      if (!matchReq) return t;

      const updatedReqs = t.titleChangeRequests?.map(r => r.id === requestId ? {
        ...r,
        status: 'Ditolak' as const,
        dosenNotes: notes,
        reviewedAt: now
      } : r);

      return {
        ...t,
        titleChangeRequests: updatedReqs
      };
    }));
  };

  // MAHASISWA ACTION: Change Default Password (Resolves Force Blocking)
  const handleSaveNewPassword = (newPassword: string) => {
    setTheses(prev => prev.map(t => {
      if (t.id === currentStudent.id) {
        return {
          ...t,
          password: newPassword,
          mustChangePassword: false
        };
      }
      return t;
    }));
    setIsChangePasswordModalOpen(false);
  };

  // DOSEN ACTION: Change Default Password (Resolves Force Blocking)
  const handleSaveDosenPassword = (newPassword: string) => {
    const updated: DosenProfile = {
      ...dosenProfile,
      password: newPassword,
      mustChangePassword: false
    };
    setDosenProfile(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DOSEN, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save dosen profile:', e);
    }
  };

  // DOSEN ACTION: Edit Complete Profile
  const handleSaveDosenProfile = (updated: DosenProfile) => {
    setDosenProfile(updated);
  };

  // MAHASISWA ACTION: Edit Profile & Username Dinamis (NIM)
  const handleSaveStudentProfile = (studentId: string, payload: StudentProfileUpdatePayload) => {
    const newNim = payload.nim ? payload.nim.trim() : undefined;

    setTheses(prev => prev.map(t => {
      if (t.id === studentId) {
        const finalNim = newNim || t.nim;
        const newAvatar = (payload.studentName || t.studentName)
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(w => w[0])
          .join('')
          .toUpperCase();

        const updatedAttendances = t.attendances?.map(a => ({
          ...a,
          nim: finalNim,
          studentName: payload.studentName || a.studentName
        })) || [];

        const updatedTitleRequests = t.titleChangeRequests?.map(r => ({
          ...r,
          nim: finalNim,
          studentName: payload.studentName || r.studentName
        })) || [];

        return {
          ...t,
          nim: finalNim,
          studentName: payload.studentName || t.studentName,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          emergencyContactName: payload.emergencyContactName,
          emergencyContactPhone: payload.emergencyContactPhone,
          targetGraduationSemester: payload.targetGraduationSemester,
          bioNotes: payload.bioNotes,
          avatar: newAvatar || t.avatar,
          attendances: updatedAttendances,
          titleChangeRequests: updatedTitleRequests
        };
      }
      return t;
    }));

    // LOGIKA USERNAME DINAMIS: Jika Mahasiswa mengubah NIM, update username sesi aktif secara otomatis
    if (newNim && authSession?.role === 'mahasiswa' && authSession.userId === studentId) {
      const updatedSession: AuthSession = {
        ...authSession,
        nim: newNim,
        name: payload.studentName || authSession.name,
        email: payload.email || authSession.email
      };
      setAuthSession(updatedSession);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_AUTH, JSON.stringify(updatedSession));
      } catch (e) {
        console.error('Failed to update auth session with new NIM:', e);
      }
    }
  };

  const handleFilterRiskFromSummary = (risk: string) => {
    setTableRiskFilter(risk);
    setActiveTab('table');
  };

  const handleFilterTitleFromSummary = (status: 'Approved' | 'Pending') => {
    setTableTitleFilter(status);
    setActiveTab('table');
  };

  const handleFilterSKFromSummary = (status: 'Semua' | 'Belum SK' | 'Sudah SK') => {
    setTableSKFilter(status);
    setActiveTab('table');
  };

  const handleFilterTrackFromSummary = (track: 'Semua' | 'Skripsi' | 'Jurnal') => {
    setTableTrackFilter(track);
    setActiveTab('table');
  };

  // 1. STRICT PROTECTED ROUTE: Jika Belum Login -> Wajib Menampilkan Halaman Login
  if (!authSession) {
    return (
      <>
        <LoginScreen
          theses={theses}
          dosen={dosenProfile}
          onLogin={handleLogin}
          onOpenApplyModal={() => setIsApplyModalOpen(true)}
        />

        {/* Public Apply Guidance Modal (Jalur B) */}
        <ApplyGuidanceModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSubmit={handleSubmitNewApplication}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 font-sans flex flex-col relative">
      
      {/* 2. STRICT FORCE CHANGE PASSWORD OVERLAY (BLOKIR LAYAR BAIK DOSEN MAUPUN MAHASISWA):
          Jika user login dan masih terdeteksi menggunakan password default,
          seluruh menu terblokir secara absolut di tengah layar! */}
      {isDosenForcePassword && (
        <ChangePasswordModal
          isOpen={true}
          isForced={true}
          role="dosen"
          nim={dosenProfile.nip}
          studentName={dosenProfile.name}
          onSavePassword={handleSaveDosenPassword}
        />
      )}

      {isStudentForcePassword && (
        <ChangePasswordModal
          isOpen={true}
          isForced={true}
          role="mahasiswa"
          nim={currentStudent.nim}
          studentName={currentStudent.studentName}
          onSavePassword={handleSaveNewPassword}
        />
      )}

      {/* Global Application Header (STRICT ROLE SEPARATION - NO TOGGLE BUTTON) */}
      <Header
        currentRole={currentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dosen={dosenProfile}
        currentStudent={currentStudent}
        totalThesesCount={theses.length}
        onResetData={handleResetData}
        onOpenApplyModal={() => setIsApplyModalOpen(true)}
        onOpenEditDosenProfile={() => setIsEditDosenModalOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
        onOpenEditStudentProfile={() => setIsEditProfileModalOpen(true)}
        onLogout={handleLogout}
        authSession={authSession}
        pendingApplicantsCount={pendingApplicantsCount}
        pendingTitlesCount={pendingTitlesCount}
        pendingAttendanceCount={pendingAttendanceCount}
      />

      {/* Main Content Area (Protected views by current authenticated role) */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isForceChangePasswordActive ? 'pointer-events-none filter blur-[2px] select-none' : ''}`}>
        
        {/* ========================================================
            VIEW 1: DOSEN PEMBIMBING PROTECTED ROUTES (/dosen/*)
           ======================================================== */}
        {currentRole === 'dosen' && (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Dosen Profile Summary Banner (Single-Tenant Master) */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-white/20 shrink-0">
                        {dosenProfile.avatar || 'IS'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                            Dosen Pembimbing Utama
                          </span>
                          <span className="text-xs font-bold text-indigo-300">
                            {dosenProfile.title}
                          </span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                          {dosenProfile.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                          <span className="font-mono text-slate-400">NIP. {dosenProfile.nip}</span>
                          <span>&bull;</span>
                          <span>{dosenProfile.email}</span>
                          {dosenProfile.phone && (
                            <>
                              <span>&bull;</span>
                              <span className="font-mono">WA: {dosenProfile.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs space-y-1 max-w-md">
                        <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                          <Building2 className="h-3.5 w-3.5" />
                          <span className="truncate">{dosenProfile.lab}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span className="truncate">{dosenProfile.officeHours || 'Senin & Rabu: 09:00 - 12:00 WIB'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditDosenModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition shrink-0 cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit Profil Dosen</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* MANDAT UTAMA: Filter Toolbar Dashboard Dosen (Jalur Kelulusan, Status SK, Angkatan) */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Filter className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Filter Dashboard Bimbingan
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-extrabold text-slate-700">
                          {dashboardFilteredTheses.length} / {theses.length} Mahasiswa
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Filter interaktif otomatis mempengaruhi Card Ringkasan, Grafik Bottleneck, Diagram Rumpun, dan Scatter Plot.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* 1. Jalur Kelulusan (Skripsi vs Jurnal) */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Jalur:</span>
                      {(['Semua', 'Skripsi', 'Jurnal'] as const).map(track => (
                        <button
                          key={track}
                          onClick={() => setDashboardTrackFilter(track)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            dashboardTrackFilter === track
                              ? track === 'Jurnal'
                                ? 'bg-violet-600 text-white shadow-xs'
                                : track === 'Skripsi'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {track}
                        </button>
                      ))}
                    </div>

                    {/* 2. Status SK (Belum SK vs Sudah SK) */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase px-2">SK:</span>
                      {(['Semua', 'Belum SK', 'Sudah SK'] as const).map(sk => (
                        <button
                          key={sk}
                          onClick={() => setDashboardSKFilter(sk)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            dashboardSKFilter === sk
                              ? sk === 'Sudah SK'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : sk === 'Belum SK'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {sk}
                        </button>
                      ))}
                    </div>

                    {/* 3. Angkatan (Ekstrak 4 Digit Pertama NIM - Mandat) */}
                    <div className="flex items-center bg-slate-100 px-2 py-1 rounded-xl text-xs border border-slate-200/80 gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Angkatan:</span>
                      <select
                        value={dashboardAngkatanFilter}
                        onChange={(e) => setDashboardAngkatanFilter(e.target.value)}
                        className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                      >
                        {availableAngkatan.map(year => (
                          <option key={year} value={year}>
                            {year === 'Semua' ? 'Semua Angkatan' : `Angkatan ${year}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Reset Button if filter active */}
                    {(dashboardTrackFilter !== 'Semua' || dashboardSKFilter !== 'Semua' || dashboardAngkatanFilter !== 'Semua') && (
                      <button
                        onClick={() => {
                          setDashboardTrackFilter('Semua');
                          setDashboardSKFilter('Semua');
                          setDashboardAngkatanFilter('Semua');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200 cursor-pointer"
                        title="Reset filter dashboard"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                <SummaryCards
                  theses={dashboardFilteredTheses}
                  onFilterRisk={handleFilterRiskFromSummary}
                  onFilterTitleStatus={handleFilterTitleFromSummary}
                  onFilterSK={handleFilterSKFromSummary}
                  onFilterTrack={handleFilterTrackFromSummary}
                />

                {/* Tren Bulanan Progres Bimbingan */}
                <MonthlyGuidanceTrendChart
                  theses={dashboardFilteredTheses}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5">
                    <BottleneckChart
                      theses={dashboardFilteredTheses}
                      selectedStage={selectedPipelineStage}
                      onSelectStage={setSelectedPipelineStage}
                    />
                  </div>
                  <div className="lg:col-span-7">
                    <RiskScatterPlot
                      theses={selectedPipelineStage === 'All' 
                        ? dashboardFilteredTheses 
                        : dashboardFilteredTheses.filter(t => t.currentChapter === selectedPipelineStage)
                      }
                      onSelectStudent={(t) => setReviewingThesis(t)}
                    />
                  </div>
                </div>

                <DistributionCharts theses={dashboardFilteredTheses} />
              </div>
            )}

            {activeTab === 'attendance' && (
              <AttendanceManagementView
                theses={theses}
                onVerifyAttendance={handleVerifyAttendance}
                onRejectAttendance={handleRejectAttendance}
              />
            )}

            {activeTab === 'applicants' && (
              <ApplicantManagementView
                applicants={applicants}
                titleChangeRequests={titleChangeRequests}
                onApproveApplicant={handleApproveApplicant}
                onRejectApplicant={handleRejectApplicant}
                onApproveTitleChange={handleApproveTitleChange}
                onRejectTitleChange={handleRejectTitleChange}
              />
            )}

            {activeTab === 'clusters' && (
              <ResearchClustersView
                theses={theses}
                onSelectStudent={(t) => setReviewingThesis(t)}
              />
            )}

            {activeTab === 'table' && (
              <ProgressTableView
                theses={theses}
                onSelectStudent={(t) => setReviewingThesis(t)}
                initialRiskFilter={tableRiskFilter}
                initialTitleFilter={tableTitleFilter}
                initialSKFilter={tableSKFilter}
                initialTrackFilter={tableTrackFilter}
                onApproveTitle={handleApproveStudentTitle}
                onReviseTitle={handleReviseStudentTitle}
                onOpenVerifySK={(t) => setVerifyingSKThesis(t)}
              />
            )}
          </>
        )}

        {/* ========================================================
            VIEW 2: MAHASISWA PROTECTED ROUTES (/mahasiswa/*)
           ======================================================== */}
        {currentRole === 'mahasiswa' && (
          <>
            {activeTab === 'dashboard' && (
              <PersonalDashboard
                thesis={currentStudent}
                dosen={dosenProfile}
                onNavigateTab={setActiveTab}
                onRequestChangeTitle={() => setIsChangeTitleModalOpen(true)}
                onRequestChangePassword={() => setIsChangePasswordModalOpen(true)}
                onRequestEditProfile={() => setIsEditProfileModalOpen(true)}
                onOpenUploadSK={() => setIsUploadSKModalOpen(true)}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView
                thesis={currentStudent}
                onAddAttendance={handleAddAttendance}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'update' && (
              <UpdateProgressForm
                thesis={currentStudent}
                onUpdateThesis={handleUpdateThesis}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'logs' && (
              <LogBimbinganView
                thesis={currentStudent}
                onNavigateTab={setActiveTab}
              />
            )}
          </>
        )}
      </main>

      {/* Review Modal for Dosen */}
      <ReviewModal
        thesis={reviewingThesis}
        onClose={() => setReviewingThesis(null)}
        onSubmitReview={handleSubmitReview}
      />

      {/* Verify SK Modal for Dosen */}
      <VerifySKModal
        thesis={verifyingSKThesis}
        isOpen={Boolean(verifyingSKThesis)}
        onClose={() => setVerifyingSKThesis(null)}
        onConfirmVerification={handleConfirmVerifySK}
        onRejectVerification={handleRejectVerifySK}
      />

      {/* Student Upload SK Modal */}
      <UploadSKModal
        isOpen={isUploadSKModalOpen}
        onClose={() => setIsUploadSKModalOpen(false)}
        thesis={currentStudent}
        onSubmitSK={handleSubmitSK}
      />

      {/* Public Apply Guidance Modal (Jalur B) */}
      <ApplyGuidanceModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleSubmitNewApplication}
      />

      {/* Student Change Title Modal */}
      <ChangeTitleModal
        isOpen={isChangeTitleModalOpen}
        onClose={() => setIsChangeTitleModalOpen(false)}
        thesis={currentStudent}
        onSubmitTitleChange={handleSubmitTitleChange}
      />

      {/* Student Change Password Modal (Normal / Voluntary Mode) */}
      {!isForceChangePasswordActive && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          isForced={false}
          onClose={() => setIsChangePasswordModalOpen(false)}
          nim={currentStudent.nim}
          studentName={currentStudent.studentName}
          onSavePassword={handleSaveNewPassword}
        />
      )}

      {/* Student Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        thesis={currentStudent}
        onSaveProfile={handleSaveStudentProfile}
      />

      {/* Dosen Edit Profile Modal */}
      <EditDosenProfileModal
        isOpen={isEditDosenModalOpen}
        onClose={() => setIsEditDosenModalOpen(false)}
        dosen={dosenProfile}
        onSaveProfile={handleSaveDosenProfile}
      />

      {/* Global Clean Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SkripsiTrack SIM-TA</span>
            <span>&bull; Pembimbing: {dosenProfile.name} (NIP. {dosenProfile.nip})</span>
          </div>
          <div className="text-slate-400">
            {dosenProfile.department} &bull; {dosenProfile.institution}
          </div>
        </div>
      </footer>
    </div>
  );
}
