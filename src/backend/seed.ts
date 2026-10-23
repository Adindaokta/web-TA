import { PrismaClient, Role, TitleStatus, GradPath, SkStatus } from '@prisma/client'

const prisma = new PrismaClient()

// --- 1. DATA DOSEN TUNGGAL ---
const SEED_DOSEN = {
  nim: '10816120590PNS', // Menggunakan NIM field untuk NIP
  name: 'Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng',
  email: 'syaifuddin@umm.ac.id',
  password: 'admin123', // Anda bisa menggunakan bcrypt hash di aplikasi riil
  role: Role.ADMIN,
};

// --- 2. DATA 35 MAHASISWA (Sesuai Konfigurasi Anda) ---
const GRUP_1_APPROVED_16_OKT = [
  { name: 'Adinda Okta Rubiyanti', nim: '202310370311104', title: 'Analisis Keamanan Data Berbasis AES-256-GCM dan Steganografi EOF pada Citra HEIC', rumpunRiset: 'Topik Implementatif Dasar', jalur: GradPath.SKRIPSI },
  { name: 'Nazwa Sulistiyawati', nim: '202310370311438', title: 'ANALISIS MEKANISME STEGANOGRAFI LSB dan PROSES ENKRIPSI-DEKRIPSI PAYLOAD pada FAVICON sebagai JALUR MASUK MALWARE BERBASIS WEB', rumpunRiset: 'Topik Implementatif Dasar', jalur: GradPath.JURNAL }
];

const GRUP_2_APPROVED_21_OKT = [
  { name: 'Celvin Saputra', nim: '202310370311216', title: 'Perbandingan SMOTE, ADASYN, dan random undersampling pada deteksi DDoS di jaringan IoT', rumpunRiset: 'Dataset & Rekayasa Fitur', jalur: GradPath.SKRIPSI },
  { name: 'Ahmad Sultan Amanda Putra', nim: '202310370311239', title: 'Kajian literatur dataset publik untuk deteksi serangan DDoS pada IoT', rumpunRiset: 'Edge, Mitigasi & Kajian', jalur: GradPath.JURNAL },
  { name: 'Raditya Tantra Arinanta', nim: '202310370311224', title: 'Deteksi serangan ICMP ping flood menggunakan metode entropi pada gateway jaringan', rumpunRiset: 'Edge, Mitigasi & Kajian', jalur: GradPath.SKRIPSI },
  { name: 'Marsel Putra Nugraha', nim: '202310370311208', title: 'Seleksi fitur berbasis information gain, chi-square, dan RFE untuk model deteksi DDoS yang ringan', rumpunRiset: 'Dataset & Rekayasa Fitur', jalur: GradPath.SKRIPSI },
  { name: 'Erik Putra Hernanda', nim: '202310370311250', title: 'Deteksi DDoS pada jaringan IoT menggunakan XGBoost dan LightGBM dengan interpretasi SHAP', rumpunRiset: 'Machine Learning & Zero-Day', jalur: GradPath.JURNAL },
  { name: 'Ken Aryo B', nim: '202310370311006', title: 'RANCANG BANGUN DAN EVALUASI SECURITY GATE BERBASIS RISIKO PADA PIPELINE DEVSECOPS MENGGUNAKAN CVSS, EPSS, CISA KEV, DAN KRITIKALITAS ASET', rumpunRiset: 'Topik Implementatif Dasar', jalur: GradPath.SKRIPSI },
  { name: 'Ragil Tumei Wijayanto', nim: '202310370311240', title: 'Optimasi hyperparameter model deteksi DDoS menggunakan Optuna dibandingkan grid search', rumpunRiset: 'Machine Learning & Zero-Day', jalur: GradPath.SKRIPSI }
];

const GRUP_3_PENDING_SISA_26 = [
  { name: 'Ahmad Gustya Faris S', nim: '202310370311235', title: 'Systematic literature review penerapan deep reinforcement learning untuk deteksi serangan DDoS dan intrusi pada IoT', rumpunRiset: 'Deep Reinforcement Learning', jalur: GradPath.SKRIPSI },
  { name: 'Angga Surya Tri Putra', nim: '202310370311305', title: 'Analisis karakteristik trafik normal dan serangan DDoS per protokol pada dataset IoT-DH', rumpunRiset: 'Dataset & Rekayasa Fitur', jalur: GradPath.SKRIPSI },
  { name: 'Anggun Ramadhani', nim: '202310370311077', title: 'Rancang Bangun Web-Based Digital Forensic URL Analyzer Menggunakan Multi-Layer Detection Engine Terintegrasi Framework MITRE ATT&CK', rumpunRiset: 'Topik Implementatif Dasar', jalur: GradPath.JURNAL },
  { name: 'Athaullah Rozan Hibrizi', nim: '202310370311315', title: 'Analisis Komparatif Alat Ekstraksi fitur PCAP (CICFlowMeter vs TShark) Terhadap akurasi Deteksi DDoS pada Dataset IoT', rumpunRiset: 'Dataset & Rekayasa Fitur', jalur: GradPath.SKRIPSI },
  { name: 'Dhiaulhaq Ramadhan', nim: '202310370311339', title: 'Pengaruh metode normalisasi data terhadap kinerja KNN dan SVM dalam deteksi DDoS', rumpunRiset: 'Machine Learning & Zero-Day', jalur: GradPath.SKRIPSI },
  { name: 'Ihwannul M', nim: '202310370311219', title: 'Perbandingan kinerja Snort dan Suricata dalam mendeteksi serangan ICMP flood dan SYN flood', rumpunRiset: 'Edge, Mitigasi & Kajian', jalur: GradPath.SKRIPSI },
  { name: 'Lian Adrian', nim: '202310370311336', title: 'Rancang bangun aplikasi web deteksi DDoS berbasis file CSV trafik jaringan', rumpunRiset: 'Topik Implementatif Dasar', jalur: GradPath.SKRIPSI },
  { name: 'Lira Aurora Verina', nim: '202310370311200', title: 'Live Forensics dan Dead Forensics dalam Investigasi Serangan Brute Force SSH pada Server Linux: Analisis Artefak Media Penyimpanan dan Memori', rumpunRiset: 'Honeypot & Akuisisi Data', jalur: GradPath.JURNAL },
  { name: 'Moch Farhan Fauzi', nim: '202310370311100', title: 'Rancang bangun dashboard monitoring serangan honeypot berbasis Grafana/Wazuh', rumpunRiset: 'Honeypot & Akuisisi Data', jalur: GradPath.SKRIPSI },
  { name: 'Mohammad Nadif Reza Fahlevi', nim: '202310370311242', title: 'Prototipe mitigasi otomatis serangan DDoS pada gateway IoT berbasis hasil deteksi', rumpunRiset: 'Edge, Mitigasi & Kajian', jalur: GradPath.SKRIPSI },
  { name: 'Muh Khotibul Umam', nim: '202310370311478', title: 'implementasi kriptografi AES & RSA untuk pengamanan komunikasi data antara client dan server pada jaringan komputer', rumpunRiset: 'Topik Implementatif Dasar', jalur: GradPath.SKRIPSI },
  { name: 'Muhammad Abel Putra Mayuri', nim: '202310370311157', title: 'Klasifikasi Multikelas Jenis Serangan DDoS pada Dataset CICIoT 2023', rumpunRiset: 'Machine Learning & Zero-Day', jalur: GradPath.JURNAL },
  { name: 'Muhammad Daffa Priyantana', nim: '202310370311472', title: 'Analisis dampak serangan Deauthentication terhadap kinerja WiFi WPA2 berdasarkan parameter QoS dengan Acuan Ketegorisasi TIPHON', rumpunRiset: 'Edge, Mitigasi & Kajian', jalur: GradPath.SKRIPSI },
  { name: 'Muhammad Irfan Maulana', nim: '202310370311480', title: 'Deteksi serangan amplifikasi DoS pada protokol CoAP menggunakan machine learning', rumpunRiset: 'Edge, Mitigasi & Kajian', jalur: GradPath.SKRIPSI },
  { name: 'Muhammad Nandito Fajri', nim: '202310370311191', title: 'Analisis pola serangan brute-force SSH dan Telnet pada honeypot IoT', rumpunRiset: 'Honeypot & Akuisisi Data', jalur: GradPath.SKRIPSI },
  { name: 'Raka', nim: '202110370311058', title: '(Usulan Topik Riset Belum Ditentukan - Konsultasi Mandiri)', rumpunRiset: 'Topik Implementatif Dasar', jalur: GradPath.SKRIPSI },
  { name: 'Rendra Verdian Arrassy', nim: '202310370311148', title: 'Pengaruh Rasio Pembagian Data dan K-Fold Cross Validation terhadap Kinerja Random Forest dalam Deteksi Serangan DDoS pada Dataset IoT-DH', rumpunRiset: 'Dataset & Rekayasa Fitur', jalur: GradPath.SKRIPSI },
  { name: 'DwiSepta Indranawasta', nim: '202110370311495', title: 'Sistem Deteksi URL Phising Menggunakan Metode Hibrida Berbasis Aturan Heuristik dan Random Forest pada ancaman di indonesia', rumpunRiset: 'Machine Learning & Zero-Day', jalur: GradPath.SKRIPSI },
  { name: 'Rifqi Maulana Ishak', nim: '202310370311252', title: 'Deteksi serangan flooding pada broker MQTT berbasis analisis trafik dan machine learning', rumpunRiset: 'Edge, Mitigasi & Kajian', jalur: GradPath.SKRIPSI },
  { name: 'Rozaq Akbar Rizqi', nim: '202310370311040', title: 'Deteksi anomali DDoS tanpa label menggunakan Autoencoder dan Isolation Forest', rumpunRiset: 'Machine Learning & Zero-Day', jalur: GradPath.JURNAL },
  { name: 'Slamet Hariyadi', nim: '202310370311221', title: 'Analisis degradasi kinerja model machine learning konvensional pada skenario serangan zero-day', rumpunRiset: 'Machine Learning & Zero-Day', jalur: GradPath.SKRIPSI },
  { name: 'Tasyah Aulia Rahma', nim: '202310370311248', title: 'Analisis pola request pemindai (scanner) internet menggunakan honeypot HTTP', rumpunRiset: 'Honeypot & Akuisisi Data', jalur: GradPath.SKRIPSI },
  { name: 'Wahyu Kusumawardhana', nim: '202310370311302', title: 'Perbandingan algoritma machine learning klasik untuk deteksi DDoS pada dataset IoT-DH dan CICIoT2023', rumpunRiset: 'Machine Learning & Zero-Day', jalur: GradPath.SKRIPSI },
  { name: 'Zidane Alfarizy', nim: '202310370311058', title: 'Deteksi serangan brute-force SSH dari log autentikasi server menggunakan metode rule-based', rumpunRiset: 'Honeypot & Akuisisi Data', jalur: GradPath.SKRIPSI },
  { name: 'Fikri Haikal', nim: '202210370311045', title: 'Implementasi Gateway IoT Berbasis ESP32 dengan Autentikasi Token Enkripsi untuk Smart Campus', rumpunRiset: 'Topik Implementatif Dasar', jalur: GradPath.SKRIPSI },
  { name: 'Jimmy Candra Prayoga', nim: '202310370311146', title: 'Evaluasi Pengaruh Reduksi Fitur terhadap Efisiensi dan Kinerja Deteksi Intrusi pada Dataset CICIoT2023', rumpunRiset: 'Dataset & Rekayasa Fitur', jalur: GradPath.JURNAL }
];

async function main() {
  console.log('⏳ Memulai proses injeksi data ke database MySQL...');

  // 1. Injeksi Akun Dosen
  const dosen = await prisma.user.upsert({
    where: { nim: SEED_DOSEN.nim },
    update: {},
    create: SEED_DOSEN,
  });
  console.log(`✅ Berhasil membuat akun Dosen: ${dosen.name}`);

  // 2. Gabungkan dan format data mahasiswa
  const allRawStudents = [
    ...GRUP_1_APPROVED_16_OKT.map(m => ({ ...m, titleStatus: TitleStatus.APPROVED, approvedAt: new Date('2026-10-16T00:00:00Z') })),
    ...GRUP_2_APPROVED_21_OKT.map(m => ({ ...m, titleStatus: TitleStatus.APPROVED, approvedAt: new Date('2026-10-21T00:00:00Z') })),
    ...GRUP_3_PENDING_SISA_26.map(m => ({ ...m, titleStatus: TitleStatus.PENDING, approvedAt: null }))
  ];

  let accCount = 0;
  let pendingCount = 0;

  // 3. Injeksi Akun Mahasiswa beserta Relasi Skripsinya
  for (const mhs of allRawStudents) {
    await prisma.user.upsert({
      where: { nim: mhs.nim },
      update: {},
      create: {
        nim: mhs.nim,
        name: mhs.name,
        email: `${mhs.nim}@student.umm.ac.id`,
        password: 'bimbingan123', // Default password
        role: Role.STUDENT,
        thesis: {
          create: {
            title: mhs.title,
            titleStatus: mhs.titleStatus,
            approvedAt: mhs.approvedAt,
            researchTrack: mhs.rumpunRiset,
            graduationPath: mhs.jalur,
            skStatus: SkStatus.BELUM_SK, // Mengunci kondisi "Belum SK" untuk semuanya
          }
        }
      }
    });
    
    if(mhs.titleStatus === TitleStatus.APPROVED) accCount++;
    else pendingCount++;
  }

  console.log(`✅ Berhasil membuat ${allRawStudents.length} akun Mahasiswa.`);
  console.log(`📊 Statistik Seeder:`);
  console.log(`   - ${accCount} Judul Approved (ACC)`);
  console.log(`   - ${pendingCount} Judul Pending`);
  console.log(`   - Semua mahasiswa terkunci dalam status 'Belum SK'`);
  console.log('🚀 Seeding selesai sepenuhnya!');
}

main()
  .catch((e) => {
    console.error('❌ Gagal menjalankan seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });