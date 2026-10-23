import React from 'react';
import { 
  Users, 
  FileCheck2, 
  Award, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Hourglass,
  FileX2,
  GraduationCap
} from 'lucide-react';
import { Thesis } from '../../types/index.ts';
import { calculateSummaryStats } from '../../utils/rules.ts';

interface SummaryCardsProps {
  theses: Thesis[];
  onFilterRisk?: (risk: string) => void;
  onFilterTitleStatus?: (status: 'Approved' | 'Pending') => void;
  onFilterSK?: (status: 'Semua' | 'Belum SK' | 'Sudah SK') => void;
  onFilterTrack?: (track: 'Semua' | 'Skripsi' | 'Jurnal') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  theses, 
  onFilterRisk,
  onFilterTitleStatus,
  onFilterSK,
  onFilterTrack
}) => {
  const stats = calculateSummaryStats(theses);
  const approvedCount = theses.filter(t => t.titleStatus === 'Approved').length;
  const pendingCount = theses.filter(t => t.titleStatus !== 'Approved').length;

  return (
    <div className="space-y-4">
      {/* 4 Primary Mandated KPI Cards: Total Mahasiswa, Belum SK, Sudah SK, Lulus/Sidang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Mahasiswa */}
        <div 
          onClick={() => {
            onFilterSK?.('Semua');
          }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
          title="Klik untuk menampilkan semua mahasiswa"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Mahasiswa
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-500 font-medium">Bimbingan Aktif</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Dosen Pembimbing:</span>
            <span className="font-bold text-slate-700 truncate">
              Ir. Syaifuddin S.Kom., M.Kom.
            </span>
          </div>
        </div>

        {/* 2. Belum SK */}
        <div 
          onClick={() => onFilterSK?.('Belum SK')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-amber-300 transition cursor-pointer group"
          title="Klik untuk filter mahasiswa yang Belum SK"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Belum SK
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition">
              <FileX2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{stats.belumSK}</span>
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {Math.round((stats.belumSK / (stats.total || 1)) * 100)}% Total
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-amber-700 font-medium">Bukan Blocker Bimbingan</span>
            <span className="font-semibold text-indigo-600 group-hover:underline">Filter List &rarr;</span>
          </div>
        </div>

        {/* 3. Sudah SK */}
        <div 
          onClick={() => onFilterSK?.('Sudah SK')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
          title="Klik untuk filter mahasiswa yang Sudah SK"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sudah SK
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700">{stats.sudahSK}</span>
            <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              {Math.round((stats.sudahSK / (stats.total || 1)) * 100)}% Total
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>SK Terverifikasi Sah:</span>
            <span className="font-semibold text-slate-700">{stats.sudahSK} Mahasiswa</span>
          </div>
        </div>

        {/* 4. Lulus / Sidang */}
        <div 
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lulus / Sidang
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{stats.lulusSidang}</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Pasca Sidang
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Target Kelulusan:</span>
            <span className="font-semibold text-emerald-700">6 Bulan Standar</span>
          </div>
        </div>
      </div>

      {/* Sub-Strip: Status Usulan Judul, Jalur Kelulusan & Status Risiko */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Validasi Usulan Judul */}
        <div className="bg-white/80 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Validasi Usulan Judul</span>
              <span className="font-bold text-slate-900">{approvedCount} ACC &bull; {pendingCount} Pending</span>
            </div>
          </div>
          <button
            onClick={() => onFilterTitleStatus?.('Pending')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold border border-amber-200 transition text-[11px]"
          >
            Review {pendingCount}
          </button>
        </div>

        {/* Jalur Kelulusan Breakdown */}
        <div className="bg-white/80 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Jalur:</span>
            <button
              onClick={() => onFilterTrack?.('Skripsi')}
              className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 text-[11px] transition"
              title="Filter Jalur Skripsi"
            >
              Skripsi ({stats.totalSkripsi})
            </button>
            <button
              onClick={() => onFilterTrack?.('Jurnal')}
              className="px-2 py-0.5 rounded bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold border border-violet-200 text-[11px] transition"
              title="Filter Jalur Jurnal"
            >
              Jurnal ({stats.totalJurnal})
            </button>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {theses.length} Total
          </span>
        </div>

        {/* Durasi Rata-rata */}
        <div className="bg-white/80 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Rata-rata Durasi Argo</span>
              <span className="font-bold text-slate-900">{stats.avgDuration} Bulan (Hari ke-1)</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ACC Judul
          </span>
        </div>

        {/* Distribusi Risiko */}
        <div className="bg-white/80 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Risiko:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onFilterRisk?.('Aman')}
              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 text-[11px] transition"
            >
              Aman ({stats.totalAman})
            </button>
            <button
              onClick={() => onFilterRisk?.('Waspada')}
              className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold border border-amber-200 text-[11px] transition"
            >
              Waspada ({stats.totalWaspada})
            </button>
            <button
              onClick={() => onFilterRisk?.('Kritis')}
              className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 text-[11px] transition"
            >
              Kritis ({stats.totalKritis})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
