import { ChapterStage, RiskLevel, Thesis, SKStatus } from '../types/index.ts';

/**
 * Menghitung tingkat risiko keterlambatan mahasiswa berdasarkan bab dan durasi (dalam bulan).
 * Target ideal kelulusan tugas akhir adalah 4-6 bulan.
 */
export function calculateRiskLevel(chapter: ChapterStage, durationMonths: number): RiskLevel {
  if (durationMonths <= 3) {
    return 'Aman';
  }

  switch (chapter) {
    case 'Belum Mulai':
    case 'Bab 1':
    case 'Bab 2':
      if (durationMonths >= 5.5) return 'Kritis';
      if (durationMonths >= 3.5) return 'Waspada';
      return 'Aman';

    case 'Bab 3':
      if (durationMonths >= 7.0) return 'Kritis';
      if (durationMonths >= 5.0) return 'Waspada';
      return 'Aman';

    case 'Bab 4':
      if (durationMonths >= 9.0) return 'Kritis';
      if (durationMonths >= 7.0) return 'Waspada';
      return 'Aman';

    case 'Bab 5':
      if (durationMonths >= 11.0) return 'Kritis';
      if (durationMonths >= 8.5) return 'Waspada';
      return 'Aman';

    case 'Pasca Sidang':
      if (durationMonths >= 12.0) return 'Waspada';
      return 'Aman';

    default:
      return 'Aman';
  }
}

/**
 * Menghitung durasi bimbingan sejak tanggal ACC judul (approved_at)
 * Jika judul belum di-ACC (pending / null), durasi bernilai 0.0 bulan
 */
export function calculateDurationMonths(approvedAt: string | null, referenceDate = '2026-10-22'): number {
  if (!approvedAt) return 0;
  try {
    const approved = new Date(approvedAt);
    const now = new Date(referenceDate);
    const diffTime = Math.max(now.getTime() - approved.getTime(), 0);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const diffMonths = Number((diffDays / 30.4375).toFixed(1));
    return diffMonths;
  } catch {
    return 0;
  }
}

/**
 * Ekstraksi tahun angkatan dari 4 digit pertama NIM mahasiswa.
 * Contoh: "202310370311104" -> "2023", "202110370311495" -> "2021"
 */
export function extractAngkatan(nim: string): string {
  if (!nim || nim.length < 4) return 'Lainnya';
  const prefix = nim.slice(0, 4);
  return /^\d{4}$/.test(prefix) ? prefix : 'Lainnya';
}

export interface BottleneckItem {
  stage: ChapterStage;
  count: number;
  percentage: number;
  avgDuration: number;
  isBottleneck: boolean;
}

export const CHAPTER_ORDER: ChapterStage[] = [
  'Bab 1',
  'Bab 2',
  'Bab 3',
  'Bab 4',
  'Bab 5',
  'Pasca Sidang'
];

export function calculateBottleneckPipeline(theses: Thesis[]): BottleneckItem[] {
  // Hanya menghitung mahasiswa yang sudah di-ACC judulnya atau semua yang telah memulai
  const targetTheses = theses.filter(t => t.titleStatus === 'Approved' || t.currentChapter !== 'Belum Mulai');
  const total = targetTheses.length;

  if (total === 0) {
    return CHAPTER_ORDER.map(stage => ({
      stage,
      count: 0,
      percentage: 0,
      avgDuration: 0,
      isBottleneck: false
    }));
  }

  const counts: Record<ChapterStage, { count: number; totalDuration: number }> = {
    'Belum Mulai': { count: 0, totalDuration: 0 },
    'Bab 1': { count: 0, totalDuration: 0 },
    'Bab 2': { count: 0, totalDuration: 0 },
    'Bab 3': { count: 0, totalDuration: 0 },
    'Bab 4': { count: 0, totalDuration: 0 },
    'Bab 5': { count: 0, totalDuration: 0 },
    'Pasca Sidang': { count: 0, totalDuration: 0 },
  };

  targetTheses.forEach(t => {
    const stage = t.currentChapter in counts ? t.currentChapter : 'Bab 1';
    counts[stage].count += 1;
    counts[stage].totalDuration += (t.durationMonths || 0);
  });

  let maxCount = 0;
  CHAPTER_ORDER.forEach(stage => {
    if (counts[stage].count > maxCount) {
      maxCount = counts[stage].count;
    }
  });

  return CHAPTER_ORDER.map(stage => {
    const stageData = counts[stage];
    return {
      stage,
      count: stageData.count,
      percentage: Math.round((stageData.count / total) * 100),
      avgDuration: stageData.count > 0 ? Number((stageData.totalDuration / stageData.count).toFixed(1)) : 0,
      isBottleneck: stageData.count === maxCount && maxCount > 0
    };
  });
}

export interface SummaryStats {
  total: number;
  totalApproved: number;
  totalPending: number;
  belumSK: number;
  sudahSK: number;
  lulusSidang: number;
  avgDuration: number;
  totalAman: number;
  totalWaspada: number;
  totalKritis: number;
  totalSkripsi: number;
  totalJurnal: number;
}

export function calculateSummaryStats(theses: Thesis[]): SummaryStats {
  const total = theses.length;
  if (total === 0) {
    return {
      total: 0,
      totalApproved: 0,
      totalPending: 0,
      belumSK: 0,
      sudahSK: 0,
      lulusSidang: 0,
      avgDuration: 0,
      totalAman: 0,
      totalWaspada: 0,
      totalKritis: 0,
      totalSkripsi: 0,
      totalJurnal: 0
    };
  }

  let totalApproved = 0;
  let totalPending = 0;
  let belumSK = 0;
  let sudahSK = 0;
  let lulusSidang = 0;
  let totalDuration = 0;
  let totalAman = 0;
  let totalWaspada = 0;
  let totalKritis = 0;
  let totalSkripsi = 0;
  let totalJurnal = 0;

  theses.forEach(t => {
    if (t.titleStatus === 'Approved') totalApproved++;
    else totalPending++;

    if (t.skStatus === 'Belum SK') belumSK++;
    if (t.skStatus === 'Sudah SK') sudahSK++;
    if (t.defenseStatus === 'Lulus (Revisi)' || t.defenseStatus === 'Lulus Bebas Revisi' || t.currentChapter === 'Pasca Sidang') {
      lulusSidang++;
    }
    totalDuration += (t.durationMonths || 0);

    if (t.riskLevel === 'Aman') totalAman++;
    else if (t.riskLevel === 'Waspada') totalWaspada++;
    else if (t.riskLevel === 'Kritis') totalKritis++;

    if (t.graduationTrack === 'Jurnal') totalJurnal++;
    else totalSkripsi++;
  });

  return {
    total,
    totalApproved,
    totalPending,
    belumSK,
    sudahSK,
    lulusSidang,
    avgDuration: totalApproved > 0 ? Number((totalDuration / totalApproved).toFixed(1)) : 0,
    totalAman,
    totalWaspada,
    totalKritis,
    totalSkripsi,
    totalJurnal
  };
}

export function generateCSVContent(theses: Thesis[]): string {
  const headers = [
    'NIM',
    'Nama Mahasiswa',
    'Jalur Kelulusan',
    'Status Judul',
    'Tanggal ACC Judul',
    'Judul Skripsi',
    'Rumpun Riset',
    'Tahap Progres',
    'Status SK',
    'Durasi (Bulan)',
    'Tingkat Risiko',
    'Status Jurnal',
    'Status Sidang',
    'Jumlah Presensi'
  ];

  const escapeCSV = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = theses.map(t => [
    escapeCSV(t.nim),
    escapeCSV(t.studentName),
    escapeCSV(t.graduationTrack || 'Skripsi'),
    escapeCSV(t.titleStatus),
    escapeCSV(t.approvedAt || 'Menunggu ACC'),
    escapeCSV(t.title),
    escapeCSV(t.cluster),
    escapeCSV(t.graduationTrack === 'Jurnal' ? (t.journalStage || 'Draft') : t.currentChapter),
    escapeCSV(t.skStatus),
    escapeCSV(t.durationMonths),
    escapeCSV(t.riskLevel),
    escapeCSV(t.journalStage || t.journalStatus || 'Belum'),
    escapeCSV(t.defenseStatus),
    escapeCSV(t.attendances ? t.attendances.filter(a => a.status === 'Hadir (Diverifikasi)').length : 0)
  ].join(','));

  return [headers.join(','), ...rows].join('\r\n');
}

export function downloadCSV(theses: Thesis[], filename = 'daftar_mahasiswa_bimbingan_syaifuddin.csv') {
  const csvContent = '\uFEFF' + generateCSVContent(theses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface MonthlyGuidanceData {
  monthKey: string;
  monthLabel: string;
  shortLabel: string;
  totalLogs: number;
  accCount: number;
  revisiCount: number;
  pendingCount: number;
  activeStudents: number;
  skripsiCount: number;
  jurnalCount: number;
  attendanceCount: number;
}

// Clean State: 0 dummy log historis sebelum sistem mulai digunakan
export const HISTORICAL_BASELINE_TRENDS: Record<string, {
  logs: number;
  acc: number;
  revisi: number;
  pending: number;
  students: number;
  skripsi: number;
  jurnal: number;
  attendances: number;
}> = {};


const MONTH_NAMES: Record<string, { full: string; short: string }> = {
  '01': { full: 'Januari', short: 'Jan' },
  '02': { full: 'Februari', short: 'Feb' },
  '03': { full: 'Maret', short: 'Mar' },
  '04': { full: 'April', short: 'Apr' },
  '05': { full: 'Mei', short: 'Mei' },
  '06': { full: 'Juni', short: 'Jun' },
  '07': { full: 'Juli', short: 'Jul' },
  '08': { full: 'Agustus', short: 'Agu' },
  '09': { full: 'September', short: 'Sep' },
  '10': { full: 'Oktober', short: 'Okt' },
  '11': { full: 'November', short: 'Nov' },
  '12': { full: 'Desember', short: 'Des' },
};

export function calculateMonthlyGuidanceTrends(
  theses: Thesis[],
  filterTrack: 'Semua' | 'Skripsi' | 'Jurnal' = 'Semua',
  monthsRange = 6
): MonthlyGuidanceData[] {
  // Pre-seed months sequence (Mei 2026 to Okt 2026)
  const defaultMonths = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
  const targetMonths = defaultMonths.slice(-monthsRange);

  const monthMap: Record<string, MonthlyGuidanceData> = {};

  targetMonths.forEach(mKey => {
    const [year, monthNum] = mKey.split('-');
    const nameInfo = MONTH_NAMES[monthNum] || { full: `Bulan ${monthNum}`, short: monthNum };
    const base = HISTORICAL_BASELINE_TRENDS[mKey] || {
      logs: 0,
      acc: 0,
      revisi: 0,
      pending: 0,
      students: 0,
      skripsi: 0,
      jurnal: 0,
      attendances: 0
    };

    // Calculate baseline adjusted for track filter
    let baseLogs = base.logs;
    let baseAcc = base.acc;
    let baseRevisi = base.revisi;
    let basePending = base.pending;

    if (filterTrack === 'Skripsi') {
      baseLogs = base.skripsi;
      baseAcc = Math.round(base.acc * 0.75);
      baseRevisi = Math.round(base.revisi * 0.75);
      basePending = Math.max(0, baseLogs - baseAcc - baseRevisi);
    } else if (filterTrack === 'Jurnal') {
      baseLogs = base.jurnal;
      baseAcc = Math.round(base.acc * 0.25);
      baseRevisi = Math.round(base.revisi * 0.25);
      basePending = Math.max(0, baseLogs - baseAcc - baseRevisi);
    }

    monthMap[mKey] = {
      monthKey: mKey,
      monthLabel: `${nameInfo.full} ${year}`,
      shortLabel: `${nameInfo.short} '${year.slice(-2)}`,
      totalLogs: baseLogs,
      accCount: baseAcc,
      revisiCount: baseRevisi,
      pendingCount: basePending,
      activeStudents: base.students,
      skripsiCount: base.skripsi,
      jurnalCount: base.jurnal,
      attendanceCount: base.attendances
    };
  });

  // Now dynamically aggregate active theses logs and verified attendances
  const filteredTheses = theses.filter(t => {
    if (filterTrack !== 'Semua' && (t.graduationTrack || 'Skripsi') !== filterTrack) {
      return false;
    }
    return true;
  });

  filteredTheses.forEach(t => {
    const isJurnal = t.graduationTrack === 'Jurnal';

    // 1. Logs
    t.logs?.forEach(log => {
      const dateStr = log.submissionDate || log.reviewedAt || '';
      const match = dateStr.match(/^(\d{4})-(\d{2})/);
      if (match) {
        const mKey = `${match[1]}-${match[2]}`;
        if (monthMap[mKey]) {
          monthMap[mKey].totalLogs += 1;
          if (isJurnal) monthMap[mKey].jurnalCount += 1;
          else monthMap[mKey].skripsiCount += 1;

          if (log.status === 'Disetujui (ACC)') monthMap[mKey].accCount += 1;
          else if (log.status === 'Perlu Revisi') monthMap[mKey].revisiCount += 1;
          else monthMap[mKey].pendingCount += 1;
        }
      }
    });

    // 2. Verified Attendances
    t.attendances?.forEach(att => {
      const dateStr = att.date || att.verifiedAt || '';
      const match = dateStr.match(/^(\d{4})-(\d{2})/);
      if (match) {
        const mKey = `${match[1]}-${match[2]}`;
        if (monthMap[mKey] && att.status === 'Hadir (Diverifikasi)') {
          monthMap[mKey].attendanceCount += 1;
        }
      }
    });
  });

  return targetMonths.map(mKey => monthMap[mKey]);
}
