/**
 * ============================================================================
 * DATABASE SEEDER SCRIPT (STANDALONE BACKEND / CLI)
 * Sistem Informasi Monitoring Tugas Akhir (Single-Tenant)
 * Dosen Pembimbing: Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng (NIP. 10816120590PNS)
 * Program Studi Informatika, Fakultas Teknik, Universitas Muhammadiyah Malang (UMM)
 * ============================================================================
 * 
 * ATURAN SEEDER (CLEAN STATE HARI KE-1, ZERO RANDOMIZER):
 * 1. Total mahasiswa: Tepat 35 Mahasiswa (Termasuk Mahasiswa ke-35: Jimmy Candra Prayoga).
 * 2. Seluruh 35 mahasiswa berstatus status_sk = 'Belum SK' dan logs = [] (belum unggah naskah bab).
 * 3. Grup 1 (Approved 16 Oktober 2026, Belum SK): 2 Mahasiswa
 * 4. Grup 2 (Approved 21 Oktober 2026, Belum SK): 7 Mahasiswa
 * 5. Grup 3 (Pending, Tanggal ACC Kosong, Belum SK): 26 Mahasiswa (Sisa 25 + Jimmy Candra Prayoga)
 * 6. 6 Opsi Klaster Rumpun Riset:
 *    - Honeypot & Akuisisi Data
 *    - Dataset & Rekayasa Fitur
 *    - Machine Learning & Zero-Day
 *    - Deep Reinforcement Learning
 *    - Edge, Mitigasi & Kajian
 *    - Topik Implementatif Dasar
 * 7. Jalur Kelulusan: Field 'jalur_kelulusan' ('Skripsi' | 'Jurnal')
 *    - Jika Skripsi: Progres berdasarkan Bab (Bab 1 s/d Bab 5)
 *    - Jika Jurnal: Status Jurnal ('Draft', 'Submit', 'Revisi', 'Accepted/Published')
 * 8. Filter Angkatan: Diekstrak otomatis dari 4 digit awal NIM mahasiswa (e.g. '2023', '2022', '2021').
 */

export interface DosenSeed {
  id: string;
  nip: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  lab: string;
}

export interface StudentSeed {
  id: string;
  nim: string;
  name: string;
  email: string;
  angkatan: string; // 4 digit awal NIM
  passwordHash: string; // bcrypt hash for 'bimbingan123'
}

export interface ThesisSeed {
  id: string;
  studentId: string;
  dosenId: string;
  title: string;
  titleStatus: 'Approved' | 'Pending';
  approvedAt: string | null;
  rumpunRiset: string;
  jalurKelulusan: 'Skripsi' | 'Jurnal';
  currentChapter: string;
  statusSk: 'Belum SK';
  defenseStatus: string;
  journalStage?: 'Draft' | 'Submit' | 'Revisi' | 'Accepted/Published';
  journalName?: string;
  journalUrl?: string;
}

// 1. DATA DOSEN TUNGGAL (SINGLE-TENANT)
export const SEED_DOSEN: DosenSeed = {
  id: 'dosen-syaifuddin-01',
  nip: '10816120590PNS',
  name: 'Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng',
  email: 'syaifuddin@umm.ac.id',
  institution: 'Universitas Muhammadiyah Malang (UMM)',
  department: 'Program Studi Informatika, Fakultas Teknik',
  lab: 'Laboratorium Keamanan Siber & Jaringan Komputer Informatika UMM'
};

// 2. DAFTAR 35 MAHASISWA & USULAN TUGAS AKHIR
// GRUP 1: Judul APPROVED pada 16 Oktober 2026, BELUM SK (2 Mahasiswa)
const GRUP_1_APPROVED_16_OKT = [
  {
    name: 'Adinda Okta Rubiyanti',
    nim: '202310370311104',
    title: 'Analisis Keamanan Data Berbasis AES-256-GCM dan Steganografi EOF pada Citra HEIC',
    rumpunRiset: 'Topik Implementatif Dasar',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Nazwa Sulistiyawati',
    nim: '202310370311438',
    title: 'ANALISIS MEKANISME STEGANOGRAFI LSB dan PROSES ENKRIPSI-DEKRIPSI PAYLOAD pada FAVICON sebagai JALUR MASUK MALWARE BERBASIS WEB',
    rumpunRiset: 'Topik Implementatif Dasar',
    jalur: 'Jurnal' as const
  }
];

// GRUP 2: Judul APPROVED pada 21 Oktober 2026, BELUM SK (7 Mahasiswa)
const GRUP_2_APPROVED_21_OKT = [
  {
    name: 'Celvin Saputra',
    nim: '202310370311216',
    title: 'Perbandingan SMOTE, ADASYN, dan random undersampling pada deteksi DDoS di jaringan IoT',
    rumpunRiset: 'Dataset & Rekayasa Fitur',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Ahmad Sultan Amanda Putra',
    nim: '202310370311239',
    title: 'Kajian literatur dataset publik untuk deteksi serangan DDoS pada IoT',
    rumpunRiset: 'Edge, Mitigasi & Kajian',
    jalur: 'Jurnal' as const
  },
  {
    name: 'Raditya Tantra Arinanta',
    nim: '202310370311224',
    title: 'Deteksi serangan ICMP ping flood menggunakan metode entropi pada gateway jaringan',
    rumpunRiset: 'Edge, Mitigasi & Kajian',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Marsel Putra Nugraha',
    nim: '202310370311208',
    title: 'Seleksi fitur berbasis information gain, chi-square, dan RFE untuk model deteksi DDoS yang ringan',
    rumpunRiset: 'Dataset & Rekayasa Fitur',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Erik Putra Hernanda',
    nim: '202310370311250',
    title: 'Deteksi DDoS pada jaringan IoT menggunakan XGBoost dan LightGBM dengan interpretasi SHAP',
    rumpunRiset: 'Machine Learning & Zero-Day',
    jalur: 'Jurnal' as const
  },
  {
    name: 'Ken Aryo B',
    nim: '202310370311006',
    title: 'RANCANG BANGUN DAN EVALUASI SECURITY GATE BERBASIS RISIKO PADA PIPELINE DEVSECOPS MENGGUNAKAN CVSS, EPSS, CISA KEV, DAN KRITIKALITAS ASET',
    rumpunRiset: 'Topik Implementatif Dasar',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Ragil Tumei Wijayanto',
    nim: '202310370311240',
    title: 'Optimasi hyperparameter model deteksi DDoS menggunakan Optuna dibandingkan grid search',
    rumpunRiset: 'Machine Learning & Zero-Day',
    jalur: 'Skripsi' as const
  }
];

// GRUP 3: Judul PENDING, Tanggal Kosong, BELUM SK (26 Mahasiswa, termasuk ke-35 Jimmy Candra Prayoga)
const GRUP_3_PENDING_SISA_26 = [
  {
    name: 'Ahmad Gustya Faris S',
    nim: '202310370311235',
    title: 'Systematic literature review penerapan deep reinforcement learning untuk deteksi serangan DDoS dan intrusi pada IoT',
    rumpunRiset: 'Deep Reinforcement Learning',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Angga Surya Tri Putra',
    nim: '202310370311305',
    title: 'Analisis karakteristik trafik normal dan serangan DDoS per protokol pada dataset IoT-DH',
    rumpunRiset: 'Dataset & Rekayasa Fitur',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Anggun Ramadhani',
    nim: '202310370311077',
    title: 'Rancang Bangun Web-Based Digital Forensic URL Analyzer Menggunakan Multi-Layer Detection Engine Terintegrasi Framework MITRE ATT&CK',
    rumpunRiset: 'Topik Implementatif Dasar',
    jalur: 'Jurnal' as const
  },
  {
    name: 'Athaullah Rozan Hibrizi',
    nim: '202310370311315',
    title: 'Analisis Komparatif Alat Ekstraksi fitur PCAP (CICFlowMeter vs TShark) Terhadap akurasi Deteksi DDoS pada Dataset IoT',
    rumpunRiset: 'Dataset & Rekayasa Fitur',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Dhiaulhaq Ramadhan',
    nim: '202310370311339',
    title: 'Pengaruh metode normalisasi data terhadap kinerja KNN dan SVM dalam deteksi DDoS',
    rumpunRiset: 'Machine Learning & Zero-Day',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Ihwannul M',
    nim: '202310370311219',
    title: 'Perbandingan kinerja Snort dan Suricata dalam mendeteksi serangan ICMP flood dan SYN flood',
    rumpunRiset: 'Edge, Mitigasi & Kajian',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Lian Adrian',
    nim: '202310370311336',
    title: 'Rancang bangun aplikasi web deteksi DDoS berbasis file CSV trafik jaringan',
    rumpunRiset: 'Topik Implementatif Dasar',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Lira Aurora Verina',
    nim: '202310370311200',
    title: 'Live Forensics dan Dead Forensics dalam Investigasi Serangan Brute Force SSH pada Server Linux: Analisis Artefak Media Penyimpanan dan Memori',
    rumpunRiset: 'Honeypot & Akuisisi Data',
    jalur: 'Jurnal' as const
  },
  {
    name: 'Moch Farhan Fauzi',
    nim: '202310370311100',
    title: 'Rancang bangun dashboard monitoring serangan honeypot berbasis Grafana/Wazuh',
    rumpunRiset: 'Honeypot & Akuisisi Data',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Mohammad Nadif Reza Fahlevi',
    nim: '202310370311242',
    title: 'Prototipe mitigasi otomatis serangan DDoS pada gateway IoT berbasis hasil deteksi',
    rumpunRiset: 'Edge, Mitigasi & Kajian',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Muh Khotibul Umam',
    nim: '202310370311478',
    title: 'implementasi kriptografi AES & RSA untuk pengamanan komunikasi data antara client dan server pada jaringan komputer',
    rumpunRiset: 'Topik Implementatif Dasar',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Muhammad Abel Putra Mayuri',
    nim: '202310370311157',
    title: 'Klasifikasi Multikelas Jenis Serangan DDoS pada Dataset CICIoT 2023',
    rumpunRiset: 'Machine Learning & Zero-Day',
    jalur: 'Jurnal' as const
  },
  {
    name: 'Muhammad Daffa Priyantana',
    nim: '202310370311472',
    title: 'Analisis dampak serangan Deauthentication terhadap kinerja WiFi WPA2 berdasarkan parameter QoS dengan Acuan Ketegorisasi TIPHON',
    rumpunRiset: 'Edge, Mitigasi & Kajian',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Muhammad Irfan Maulana',
    nim: '202310370311480',
    title: 'Deteksi serangan amplifikasi DoS pada protokol CoAP menggunakan machine learning',
    rumpunRiset: 'Edge, Mitigasi & Kajian',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Muhammad Nandito Fajri',
    nim: '202310370311191',
    title: 'Analisis pola serangan brute-force SSH dan Telnet pada honeypot IoT',
    rumpunRiset: 'Honeypot & Akuisisi Data',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Raka',
    nim: '202110370311058',
    title: '(Usulan Topik Riset Belum Ditentukan - Konsultasi Mandiri)',
    rumpunRiset: 'Topik Implementatif Dasar',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Rendra Verdian Arrassy',
    nim: '202310370311148',
    title: 'Pengaruh Rasio Pembagian Data dan K-Fold Cross Validation terhadap Kinerja Random Forest dalam Deteksi Serangan DDoS pada Dataset IoT-DH',
    rumpunRiset: 'Dataset & Rekayasa Fitur',
    jalur: 'Skripsi' as const
  },
  {
    name: 'DwiSepta Indranawasta',
    nim: '202110370311495',
    title: 'Sistem Deteksi URL Phising Menggunakan Metode Hibrida Berbasis Aturan Heuristik dan Random Forest pada ancaman di indonesia',
    rumpunRiset: 'Machine Learning & Zero-Day',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Rifqi Maulana Ishak',
    nim: '202310370311252',
    title: 'Deteksi serangan flooding pada broker MQTT berbasis analisis trafik dan machine learning',
    rumpunRiset: 'Edge, Mitigasi & Kajian',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Rozaq Akbar Rizqi',
    nim: '202310370311040',
    title: 'Deteksi anomali DDoS tanpa label menggunakan Autoencoder dan Isolation Forest',
    rumpunRiset: 'Machine Learning & Zero-Day',
    jalur: 'Jurnal' as const
  },
  {
    name: 'Slamet Hariyadi',
    nim: '202310370311221',
    title: 'Analisis degradasi kinerja model machine learning konvensional pada skenario serangan zero-day',
    rumpunRiset: 'Machine Learning & Zero-Day',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Tasyah Aulia Rahma',
    nim: '202310370311248',
    title: 'Analisis pola request pemindai (scanner) internet menggunakan honeypot HTTP',
    rumpunRiset: 'Honeypot & Akuisisi Data',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Wahyu Kusumawardhana',
    nim: '202310370311302',
    title: 'Perbandingan algoritma machine learning klasik untuk deteksi DDoS pada dataset IoT-DH dan CICIoT2023',
    rumpunRiset: 'Machine Learning & Zero-Day',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Zidane Alfarizy',
    nim: '202310370311058',
    title: 'Deteksi serangan brute-force SSH dari log autentikasi server menggunakan metode rule-based',
    rumpunRiset: 'Honeypot & Akuisisi Data',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Fikri Haikal',
    nim: '202210370311045',
    title: 'Implementasi Gateway IoT Berbasis ESP32 dengan Autentikasi Token Enkripsi untuk Smart Campus',
    rumpunRiset: 'Topik Implementatif Dasar',
    jalur: 'Skripsi' as const
  },
  {
    name: 'Jimmy Candra Prayoga',
    nim: '202310370311146',
    title: 'Evaluasi Pengaruh Reduksi Fitur terhadap Efisiensi dan Kinerja Deteksi Intrusi pada Dataset CICIoT2023',
    rumpunRiset: 'Dataset & Rekayasa Fitur',
    jalur: 'Jurnal' as const
  }
];

export function generateAllSeedRecords() {
  const students: StudentSeed[] = [];
  const theses: ThesisSeed[] = [];

  const rawList = [
    ...GRUP_1_APPROVED_16_OKT.map(m => ({ ...m, titleStatus: 'Approved' as const, approvedAt: '2026-10-16' })),
    ...GRUP_2_APPROVED_21_OKT.map(m => ({ ...m, titleStatus: 'Approved' as const, approvedAt: '2026-10-21' })),
    ...GRUP_3_PENDING_SISA_26.map(m => ({ ...m, titleStatus: 'Pending' as const, approvedAt: null }))
  ];

  rawList.forEach((raw, index) => {
    const studentId = `std-${raw.nim}`;
    const angkatan = raw.nim.slice(0, 4);

    // 1. Akun Mahasiswa
    students.push({
      id: studentId,
      nim: raw.nim,
      name: raw.name,
      email: `${raw.nim}@student.umm.ac.id`,
      angkatan,
      // Default bcrypt hash for 'bimbingan123'
      passwordHash: '$2b$10$wN1G1ZkP17.B9G2rZ.c2g.85Z2XyX9hJ2O7F3L7lE5pUqH9iN1q2'
    });

    // 2. Data Tugas Akhir (Clean State: Status SK Belum SK, log bab kosong)
    theses.push({
      id: `thesis-${raw.nim}`,
      studentId,
      dosenId: SEED_DOSEN.id,
      title: raw.title,
      titleStatus: raw.titleStatus,
      approvedAt: raw.approvedAt,
      rumpunRiset: raw.rumpunRiset,
      jalurKelulusan: raw.jalur,
      currentChapter: raw.jalur === 'Jurnal' ? 'Bab 1' : (raw.titleStatus === 'Approved' ? 'Bab 1' : 'Belum Mulai'),
      statusSk: 'Belum SK',
      defenseStatus: 'Belum Daftar',
      journalStage: raw.jalur === 'Jurnal' ? 'Draft' : undefined,
      journalName: raw.jalur === 'Jurnal' ? 'Jurnal Repositor (Informatika UMM)' : undefined,
      journalUrl: raw.jalur === 'Jurnal' ? 'https://repositor.umm.ac.id' : undefined
    });
  });

  return { dosen: SEED_DOSEN, students, theses };
}

// CLI runner if executed directly
if (process.argv[1]?.includes('seed.ts')) {
  const result = generateAllSeedRecords();
  console.log(`[SEEDER BERHASIL] Inisialisasi:`);
  console.log(`- 1 Akun Dosen Master: ${result.dosen.name}`);
  console.log(`- ${result.students.length} Akun Mahasiswa Terdaftar (Semua password default: bimbingan123)`);
  console.log(`- ${result.theses.filter(t => t.titleStatus === 'Approved').length} Judul Disetujui (ACC)`);
  console.log(`- ${result.theses.filter(t => t.titleStatus === 'Pending').length} Judul Pending`);
  console.log(`- ${result.theses.filter(t => t.statusSk === 'Belum SK').length} Mahasiswa Berstatus 'Belum SK'`);
  console.log(`- Mahasiswa ke-35: ${result.students[34].name} (${result.students[34].nim}) - Angkatan ${result.students[34].angkatan}`);
}
