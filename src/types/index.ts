export type UserRole = 'dosen' | 'mahasiswa' | 'guest';

export type StandardResearchCluster = 
  | 'Honeypot & Akuisisi Data'
  | 'Dataset & Rekayasa Fitur'
  | 'Machine Learning & Zero-Day'
  | 'Deep Reinforcement Learning'
  | 'Edge, Mitigasi & Kajian'
  | 'Topik Implementatif Dasar';

export type ResearchCluster = StandardResearchCluster | (string & {});

export type ChapterStage = 'Belum Mulai' | 'Bab 1' | 'Bab 2' | 'Bab 3' | 'Bab 4' | 'Bab 5' | 'Pasca Sidang';

export type TitleStatus = 'Approved' | 'Pending' | 'Perlu Revisi';

export type SKStatus = 'Belum SK' | 'Sudah SK';

export type DefenseStatus = 
  | 'Belum Daftar' 
  | 'Siap Sidang' 
  | 'Terjadwal Sidang' 
  | 'Lulus (Revisi)' 
  | 'Lulus Bebas Revisi';

export type GraduationTrack = 'Skripsi' | 'Jurnal';

export type JournalStage = 'Draft' | 'Submit' | 'Revisi' | 'Accepted/Published';

export type JournalStatus = 'Belum' | 'Draft' | 'Submit' | 'Revisi' | 'Publish';

export type RiskLevel = 'Aman' | 'Waspada' | 'Kritis';

export type LogStatus = 'Menunggu Review' | 'Perlu Revisi' | 'Disetujui (ACC)';

export type AttendanceMethod = 'Offline (Lab/Tatap Muka)' | 'Online (Google Meet/Zoom)';
export type AttendanceStatus = 'Menunggu Verifikasi' | 'Hadir (Diverifikasi)' | 'Ditolak';

export interface AttendanceRecord {
  id: string;
  thesisId: string;
  studentId: string;
  studentName: string;
  nim: string;
  date: string;
  time?: string;
  method: AttendanceMethod;
  topicPlan: string;
  status: AttendanceStatus;
  dosenNotes?: string;
  verifiedAt?: string;
}

export interface LogEntry {
  id: string;
  thesisId: string;
  chapter: ChapterStage;
  submissionDate: string;
  fileName: string;
  fileSize: string;
  studentNotes: string;
  dosenFeedback?: string;
  status: LogStatus;
  reviewedAt?: string;
  version: number;
}

export interface Milestone {
  month: number;
  label: string;
  expectedChapter: ChapterStage;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface TitleChangeRequest {
  id: string;
  thesisId: string;
  studentName: string;
  nim: string;
  currentTitle: string;
  proposedTitle: string;
  reason: string;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  dosenNotes?: string;
  requestedAt: string;
  reviewedAt?: string;
}

export interface NewApplicant {
  id: string;
  nim: string;
  name: string;
  email: string;
  phone: string;
  proposedTitle: string;
  cluster: ResearchCluster;
  proposalSummary: string;
  status: 'Pending' | 'Diterima' | 'Ditolak';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  generatedPassword?: string;
}

export interface Thesis {
  id: string;
  studentId: string;
  studentName: string;
  nim: string;
  email: string;
  phone?: string;
  avatar: string;
  title: string;
  titleStatus: TitleStatus;
  approvedAt: string | null;
  abstract: string;
  cluster: ResearchCluster;
  currentChapter: ChapterStage;
  durationMonths: number;
  startDate: string;
  skStatus: SKStatus;
  skNumber?: string;
  skDate?: string;
  skFileName?: string;
  skFileUrl?: string;
  skUploadDate?: string;
  skVerificationStatus?: 'Belum Upload' | 'Menunggu Verifikasi' | 'Diverifikasi' | 'Ditolak';
  skNotes?: string;
  defenseStatus: DefenseStatus;
  graduationTrack: GraduationTrack;
  journalStage?: JournalStage;
  journalStatus?: JournalStatus;
  journalName?: string;
  journalUrl?: string;
  journalPaperFileName?: string;
  journalPaperFileUrl?: string;
  journalSubmissionDate?: string;
  journalReviewNotes?: string;
  lastUpdate: string;
  riskLevel: RiskLevel;
  mustChangePassword?: boolean;
  titleChangeRequests?: TitleChangeRequest[];
  attendances: AttendanceRecord[];
  logs: LogEntry[];
  milestones: Milestone[];
  // Authentication & Security
  password?: string;
  // Complete Profile Extended Fields
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  targetGraduationSemester?: string;
  bioNotes?: string;
}

export interface DosenProfile {
  id: string;
  name: string;
  nip: string;
  title: string;
  department: string;
  institution: string;
  email: string;
  avatar: string;
  lab: string;
  phone?: string;
  room?: string;
  expertise?: string;
  officeHours?: string;
  academicBio?: string;
  mustChangePassword?: boolean;
  password?: string;
}

export interface AuthSession {
  role: 'dosen' | 'mahasiswa';
  userId: string;
  name: string;
  nim?: string;
  email?: string;
  loggedInAt: string;
}
