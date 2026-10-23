import { DosenProfile, Thesis, Milestone, NewApplicant, ResearchCluster, ChapterStage, AttendanceRecord } from '../types/index.ts';
import { calculateDurationMonths, calculateRiskLevel } from '../utils/rules.ts';

export const CURRENT_DOSEN: DosenProfile = {
  id: 'dosen-syaifuddin',
  name: 'Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng',
  nip: '10816120590PNS',
  title: 'Dosen Pembimbing Skripsi / Lektor Kepala',
  department: 'Program Studi Informatika, Fakultas Teknik',
  institution: 'Universitas Muhammadiyah Malang (UMM)',
  email: 'syaifuddin@umm.ac.id',
  phone: '0812-3388-9021',
  room: 'Ruang Dosen Informatika Lt. 3 / Lab Keamanan Siber GKB III',
  expertise: 'Keamanan Siber, Deteksi Intrusi (IDS/DDoS), Honeypot, IoT Security, Machine Learning',
  officeHours: 'Senin & Rabu: 09:00 - 12:00 WIB (Lab Siber), Kamis: 13:00 - 15:30 WIB',
  academicBio: 'Dosen dan Peneliti di bidang Cyber Security & Network Engineering Informatika UMM. Membimbing skripsi dan manuskrip jurnal bereputasi dengan fokus arsitektur pertahanan siber terkini.',
  lab: 'Laboratorium Keamanan Siber & Jaringan Komputer Informatika UMM',
  avatar: 'IS',
  mustChangePassword: true
};

export const standardMilestones = (currentChapter: string): Milestone[] => [
  {
    month: 1,
    label: 'Bulan 1',
    expectedChapter: 'Bab 1',
    description: 'Penyusunan Proposal, Latar Belakang & Rumusan Masalah (Sempro)',
    isCompleted: ['Bab 2', 'Bab 3', 'Bab 4', 'Bab 5', 'Pasca Sidang'].includes(currentChapter),
    isCurrent: currentChapter === 'Bab 1' || currentChapter === 'Belum Mulai'
  },
  {
    month: 2,
    label: 'Bulan 2',
    expectedChapter: 'Bab 2',
    description: 'Kajian Pustaka, State-of-the-Art & Landasan Teori Riset',
    isCompleted: ['Bab 3', 'Bab 4', 'Bab 5', 'Pasca Sidang'].includes(currentChapter),
    isCurrent: currentChapter === 'Bab 2'
  },
  {
    month: 3,
    label: 'Bulan 3',
    expectedChapter: 'Bab 3',
    description: 'Metodologi Penelitian, Perancangan Arsitektur Eksperimen & Dataset',
    isCompleted: ['Bab 4', 'Bab 5', 'Pasca Sidang'].includes(currentChapter),
    isCurrent: currentChapter === 'Bab 3'
  },
  {
    month: 4,
    label: 'Bulan 4',
    expectedChapter: 'Bab 4',
    description: 'Eksperimen, Pengujian Serangan/Deteksi, dan Analisis Evaluasi',
    isCompleted: ['Bab 5', 'Pasca Sidang'].includes(currentChapter),
    isCurrent: currentChapter === 'Bab 4'
  },
  {
    month: 5,
    label: 'Bulan 5',
    expectedChapter: 'Bab 5',
    description: 'Kesimpulan, Saran & Finalisasi Naskah Lengkap + Draft Jurnal',
    isCompleted: currentChapter === 'Pasca Sidang',
    isCurrent: currentChapter === 'Bab 5'
  },
  {
    month: 6,
    label: 'Bulan 6',
    expectedChapter: 'Pasca Sidang',
    description: 'Sidang Tugas Akhir, Revisi Pasca Sidang, Publikasi Jurnal & Bebas Lab',
    isCompleted: currentChapter === 'Pasca Sidang',
    isCurrent: currentChapter === 'Pasca Sidang'
  }
];

// Helper to deduce research cluster based on the 6 mandated research tracks
export const deduceCluster = (title: string): ResearchCluster => {
  const t = title.toLowerCase();

  // 1. Deep Reinforcement Learning
  if (t.includes('reinforcement') || t.includes('drl')) {
    return 'Deep Reinforcement Learning';
  }

  // 2. Honeypot & Akuisisi Data
  if (t.includes('honeypot') || t.includes('brute force') || t.includes('brute-force') || t.includes('akuisisi') || t.includes('scanner') || t.includes('pemindai') || t.includes('forensic') || t.includes('forensik')) {
    return 'Honeypot & Akuisisi Data';
  }

  // 3. Dataset & Rekayasa Fitur
  if (t.includes('dataset') || t.includes('rekayasa fitur') || t.includes('seleksi fitur') || t.includes('reduksi fitur') || t.includes('smote') || t.includes('adasyn') || t.includes('tshark') || t.includes('cicflowmeter') || t.includes('trafik normal') || t.includes('pembagian data')) {
    return 'Dataset & Rekayasa Fitur';
  }

  // 4. Machine Learning & Zero-Day
  if (t.includes('zero-day') || t.includes('zero day') || t.includes('xgboost') || t.includes('lightgbm') || t.includes('optuna') || t.includes('autoencoder') || t.includes('isolation forest') || t.includes('random forest') || t.includes('knn') || t.includes('svm') || t.includes('klasifikasi multikelas') || t.includes('phising')) {
    return 'Machine Learning & Zero-Day';
  }

  // 5. Edge, Mitigasi & Kajian
  if (t.includes('gateway') || t.includes('mitigasi') || t.includes('snort') || t.includes('suricata') || t.includes('deauthentication') || t.includes('icmp') || t.includes('amplifikasi') || t.includes('coap') || t.includes('mqtt') || t.includes('kajian literatur')) {
    return 'Edge, Mitigasi & Kajian';
  }

  // 6. Topik Implementatif Dasar (Kriptografi, DevSecOps, App Web, Steganografi, Dasar)
  return 'Topik Implementatif Dasar';
};

// 1. GRUP 1: Judul APPROVED tgl 16 Oktober 2026, BELUM SK (2 Mahasiswa)
const GRUP_1_APPROVED_OCT_16 = [
  {
    name: 'Adinda Okta Rubiyanti',
    nim: '202310370311104',
    title: 'Analisis Keamanan Data Berbasis AES-256-GCM dan Steganografi EOF pada Citra HEIC',
    cluster: 'Topik Implementatif Dasar' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Nazwa Sulistiyawati',
    nim: '202310370311438',
    title: 'ANALISIS MEKANISME STEGANOGRAFI LSB dan PROSES ENKRIPSI-DEKRIPSI PAYLOAD pada FAVICON sebagai JALUR MASUK MALWARE BERBASIS WEB',
    cluster: 'Topik Implementatif Dasar' as ResearchCluster,
    jalur: 'Jurnal' as const
  }
];

// 2. GRUP 2: Judul APPROVED tgl 21 Oktober 2026, BELUM SK (7 Mahasiswa)
const GRUP_2_APPROVED_OCT_21 = [
  {
    name: 'Celvin Saputra',
    nim: '202310370311216',
    title: 'Perbandingan SMOTE, ADASYN, dan random undersampling pada deteksi DDoS di jaringan IoT',
    cluster: 'Dataset & Rekayasa Fitur' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Ahmad Sultan Amanda Putra',
    nim: '202310370311239',
    title: 'Kajian literatur dataset publik untuk deteksi serangan DDoS pada IoT',
    cluster: 'Edge, Mitigasi & Kajian' as ResearchCluster,
    jalur: 'Jurnal' as const
  },
  {
    name: 'Raditya Tantra Arinanta',
    nim: '202310370311224',
    title: 'Deteksi serangan ICMP ping flood menggunakan metode entropi pada gateway jaringan',
    cluster: 'Edge, Mitigasi & Kajian' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Marsel Putra Nugraha',
    nim: '202310370311208',
    title: 'Seleksi fitur berbasis information gain, chi-square, dan RFE untuk model deteksi DDoS yang ringan',
    cluster: 'Dataset & Rekayasa Fitur' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Erik Putra Hernanda',
    nim: '202310370311250',
    title: 'Deteksi DDoS pada jaringan IoT menggunakan XGBoost dan LightGBM dengan interpretasi SHAP',
    cluster: 'Machine Learning & Zero-Day' as ResearchCluster,
    jalur: 'Jurnal' as const
  },
  {
    name: 'Ken Aryo B',
    nim: '202310370311006',
    title: 'RANCANG BANGUN DAN EVALUASI SECURITY GATE BERBASIS RISIKO PADA PIPELINE DEVSECOPS MENGGUNAKAN CVSS, EPSS, CISA KEV, DAN KRITIKALITAS ASET',
    cluster: 'Topik Implementatif Dasar' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Ragil Tumei Wijayanto',
    nim: '202310370311240',
    title: 'Optimasi hyperparameter model deteksi DDoS menggunakan Optuna dibandingkan grid search',
    cluster: 'Machine Learning & Zero-Day' as ResearchCluster,
    jalur: 'Skripsi' as const
  }
];

// 3. GRUP 3: Sisa 26 Mahasiswa (Judul PENDING, BELUM SK, termasuk pendaftar ke-35 Jimmy Candra Prayoga)
const GRUP_3_PENDING_SISA_26 = [
  {
    name: 'Ahmad Gustya Faris S',
    nim: '202310370311235',
    title: 'Systematic literature review penerapan deep reinforcement learning untuk deteksi serangan DDoS dan intrusi pada IoT',
    cluster: 'Deep Reinforcement Learning' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Angga Surya Tri Putra',
    nim: '202310370311305',
    title: 'Analisis karakteristik trafik normal dan serangan DDoS per protokol pada dataset IoT-DH',
    cluster: 'Dataset & Rekayasa Fitur' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Anggun Ramadhani',
    nim: '202310370311077',
    title: 'Rancang Bangun Web-Based Digital Forensic URL Analyzer Menggunakan Multi-Layer Detection Engine Terintegrasi Framework MITRE ATT&CK',
    cluster: 'Topik Implementatif Dasar' as ResearchCluster,
    jalur: 'Jurnal' as const
  },
  {
    name: 'Athaullah Rozan Hibrizi',
    nim: '202310370311315',
    title: 'Analisis Komparatif Alat Ekstraksi fitur PCAP (CICFlowMeter vs TShark) Terhadap akurasi Deteksi DDoS pada Dataset IoT',
    cluster: 'Dataset & Rekayasa Fitur' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Dhiaulhaq Ramadhan',
    nim: '202310370311339',
    title: 'Pengaruh metode normalisasi data terhadap kinerja KNN dan SVM dalam deteksi DDoS',
    cluster: 'Machine Learning & Zero-Day' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Ihwannul M',
    nim: '202310370311219',
    title: 'Perbandingan kinerja Snort dan Suricata dalam mendeteksi serangan ICMP flood dan SYN flood',
    cluster: 'Edge, Mitigasi & Kajian' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Lian Adrian',
    nim: '202310370311336',
    title: 'Rancang bangun aplikasi web deteksi DDoS berbasis file CSV trafik jaringan',
    cluster: 'Topik Implementatif Dasar' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Lira Aurora Verina',
    nim: '202310370311200',
    title: 'Live Forensics dan Dead Forensics dalam Investigasi Serangan Brute Force SSH pada Server Linux: Analisis Artefak Media Penyimpanan dan Memori',
    cluster: 'Honeypot & Akuisisi Data' as ResearchCluster,
    jalur: 'Jurnal' as const
  },
  {
    name: 'Moch Farhan Fauzi',
    nim: '202310370311100',
    title: 'Rancang bangun dashboard monitoring serangan honeypot berbasis Grafana/Wazuh',
    cluster: 'Honeypot & Akuisisi Data' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Mohammad Nadif Reza Fahlevi',
    nim: '202310370311242',
    title: 'Prototipe mitigasi otomatis serangan DDoS pada gateway IoT berbasis hasil deteksi',
    cluster: 'Edge, Mitigasi & Kajian' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Muh Khotibul Umam',
    nim: '202310370311478',
    title: 'implementasi kriptografi AES & RSA untuk pengamanan komunikasi data antara client dan server pada jaringan komputer',
    cluster: 'Topik Implementatif Dasar' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Muhammad Abel Putra Mayuri',
    nim: '202310370311157',
    title: 'Klasifikasi Multikelas Jenis Serangan DDoS pada Dataset CICIoT 2023',
    cluster: 'Machine Learning & Zero-Day' as ResearchCluster,
    jalur: 'Jurnal' as const
  },
  {
    name: 'Muhammad Daffa Priyantana',
    nim: '202310370311472',
    title: 'Analisis dampak serangan Deauthentication terhadap kinerja WiFi WPA2 berdasarkan parameter QoS dengan Acuan Ketegorisasi TIPHON',
    cluster: 'Edge, Mitigasi & Kajian' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Muhammad Irfan Maulana',
    nim: '202310370311480',
    title: 'Deteksi serangan amplifikasi DoS pada protokol CoAP menggunakan machine learning',
    cluster: 'Edge, Mitigasi & Kajian' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Muhammad Nandito Fajri',
    nim: '202310370311191',
    title: 'Analisis pola serangan brute-force SSH dan Telnet pada honeypot IoT',
    cluster: 'Honeypot & Akuisisi Data' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Raka',
    nim: '202110370311058',
    title: '(Usulan Topik Riset Belum Ditentukan - Konsultasi Mandiri)',
    cluster: 'Topik Implementatif Dasar' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Rendra Verdian Arrassy',
    nim: '202310370311148',
    title: 'Pengaruh Rasio Pembagian Data dan K-Fold Cross Validation terhadap Kinerja Random Forest dalam Deteksi Serangan DDoS pada Dataset IoT-DH',
    cluster: 'Dataset & Rekayasa Fitur' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'DwiSepta Indranawasta',
    nim: '202110370311495',
    title: 'Sistem Deteksi URL Phising Menggunakan Metode Hibrida Berbasis Aturan Heuristik dan Random Forest pada ancaman di indonesia',
    cluster: 'Machine Learning & Zero-Day' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Rifqi Maulana Ishak',
    nim: '202310370311252',
    title: 'Deteksi serangan flooding pada broker MQTT berbasis analisis trafik dan machine learning',
    cluster: 'Edge, Mitigasi & Kajian' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Rozaq Akbar Rizqi',
    nim: '202310370311040',
    title: 'Deteksi anomali DDoS tanpa label menggunakan Autoencoder dan Isolation Forest',
    cluster: 'Machine Learning & Zero-Day' as ResearchCluster,
    jalur: 'Jurnal' as const
  },
  {
    name: 'Slamet Hariyadi',
    nim: '202310370311221',
    title: 'Analisis degradasi kinerja model machine learning konvensional pada skenario serangan zero-day',
    cluster: 'Machine Learning & Zero-Day' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Tasyah Aulia Rahma',
    nim: '202310370311248',
    title: 'Analisis pola request pemindai (scanner) internet menggunakan honeypot HTTP',
    cluster: 'Honeypot & Akuisisi Data' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Wahyu Kusumawardhana',
    nim: '202310370311302',
    title: 'Perbandingan algoritma machine learning klasik untuk deteksi DDoS pada dataset IoT-DH dan CICIoT2023',
    cluster: 'Machine Learning & Zero-Day' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Zidane Alfarizy',
    nim: '202310370311058',
    title: 'Deteksi serangan brute-force SSH dari log autentikasi server menggunakan metode rule-based',
    cluster: 'Honeypot & Akuisisi Data' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Fikri Haikal',
    nim: '202210370311045',
    title: 'Implementasi Gateway IoT Berbasis ESP32 dengan Autentikasi Token Enkripsi untuk Smart Campus',
    cluster: 'Topik Implementatif Dasar' as ResearchCluster,
    jalur: 'Skripsi' as const
  },
  {
    name: 'Jimmy Candra Prayoga',
    nim: '202310370311146',
    title: 'Evaluasi Pengaruh Reduksi Fitur terhadap Efisiensi dan Kinerja Deteksi Intrusi pada Dataset CICIoT2023',
    cluster: 'Dataset & Rekayasa Fitur' as ResearchCluster,
    jalur: 'Jurnal' as const
  }
];

// Helper builder function to create a pristine clean state student record (Strict 35 records)
const buildStudent = (
  raw: { name: string; nim: string; title: string; cluster?: ResearchCluster; jalur?: 'Skripsi' | 'Jurnal' },
  titleStatus: 'Approved' | 'Pending',
  approvedAt: string | null
): Thesis => {
  const cluster = raw.cluster || deduceCluster(raw.title);
  const duration = calculateDurationMonths(approvedAt, '2026-10-22');
  const isJurnal = raw.jalur === 'Jurnal';
  const currentChapter: ChapterStage = isJurnal ? 'Bab 1' : (titleStatus === 'Approved' ? 'Bab 1' : 'Belum Mulai');
  const risk = calculateRiskLevel(currentChapter, duration);
  
  // Initials badge instead of dummy photos (Mandated: NO DUMMY PHOTOS)
  const avatar = raw.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  // Clean State: 0 dummy presensi records
  const initialAttendances: AttendanceRecord[] = [];

  return {
    id: `thesis-${raw.nim}`,
    studentId: `std-${raw.nim}`,
    studentName: raw.name,
    nim: raw.nim,
    email: `${raw.nim}@student.umm.ac.id`,
    phone: `0812${raw.nim.slice(-8)}`,
    avatar,
    title: raw.title,
    titleStatus,
    approvedAt,
    abstract: `Penelitian tugas akhir mahasiswa Program Studi Informatika UMM di bawah bimbingan Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng (NIP. 10816120590PNS), Informatika UMM.`,
    cluster,
    currentChapter,
    durationMonths: duration,
    startDate: approvedAt || '2026-10-22',
    // MANDAT MUTLAK: Seluruh 35 mahasiswa pada Hari Ke-1 berstatus skStatus = 'Belum SK'
    skStatus: 'Belum SK',
    skNumber: undefined,
    skDate: undefined,
    skFileName: undefined,
    skFileUrl: undefined,
    skUploadDate: undefined,
    skVerificationStatus: 'Belum Upload',
    defenseStatus: 'Belum Daftar',
    // JALUR KELULUSAN (Skripsi vs Jurnal)
    graduationTrack: isJurnal ? 'Jurnal' : 'Skripsi',
    journalStage: isJurnal ? 'Draft' : undefined,
    journalStatus: isJurnal ? 'Draft' : undefined,
    journalName: isJurnal ? 'Jurnal Repositor (SINTA 2/3 Informatika UMM)' : undefined,
    journalUrl: isJurnal ? 'https://repositor.umm.ac.id' : undefined,
    lastUpdate: approvedAt || '2026-10-22',
    riskLevel: risk,
    mustChangePassword: true,
    milestones: standardMilestones(currentChapter),
    attendances: initialAttendances,
    logs: [] // CLEAN STATE: Seluruh 35 mahasiswa log progres kosong di hari pertama!
  };
};

export const INITIAL_THESES: Thesis[] = [
  // 1. Grup 1 (Approved tgl 16 Oktober 2026, Belum SK) - 2 Mahasiswa
  ...GRUP_1_APPROVED_OCT_16.map((mhs) => buildStudent(mhs, 'Approved', '2026-10-16')),
  // 2. Grup 2 (Approved tgl 21 Oktober 2026, Belum SK) - 7 Mahasiswa
  ...GRUP_2_APPROVED_OCT_21.map((mhs) => buildStudent(mhs, 'Approved', '2026-10-21')),
  // 3. Grup 3 (Judul Pending, Belum SK) - 26 Mahasiswa (termasuk 35 Jimmy Candra Prayoga)
  ...GRUP_3_PENDING_SISA_26.map((mhs) => buildStudent(mhs, 'Pending', null))
];

// Clean State: Belum ada pendaftar baru dari Landing Page sebelum digunakan
export const INITIAL_APPLICANTS: NewApplicant[] = [];

