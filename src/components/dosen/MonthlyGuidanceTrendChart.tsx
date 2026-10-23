import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Filter, 
  BarChart3, 
  LineChart as LineChartIcon, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  Award,
  Layers,
  Info
} from 'lucide-react';
import { Thesis } from '../../types/index.ts';
import { calculateMonthlyGuidanceTrends, MonthlyGuidanceData } from '../../utils/rules.ts';

interface MonthlyGuidanceTrendChartProps {
  theses: Thesis[];
  onSelectMonth?: (monthKey: string) => void;
}

export const MonthlyGuidanceTrendChart: React.FC<MonthlyGuidanceTrendChartProps> = ({
  theses,
  onSelectMonth
}) => {
  const [filterTrack, setFilterTrack] = useState<'Semua' | 'Skripsi' | 'Jurnal'>('Semua');
  const [monthRange, setMonthRange] = useState<number>(6);
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyGuidanceData | null>(null);

  // Calculate trends dynamically from theses data + historical baseline
  const trendData = useMemo(() => {
    return calculateMonthlyGuidanceTrends(theses, filterTrack, monthRange);
  }, [theses, filterTrack, monthRange]);

  // Aggregate KPI Stats across visible months
  const stats = useMemo(() => {
    const totalLogs = trendData.reduce((acc, m) => acc + m.totalLogs, 0);
    const totalAcc = trendData.reduce((acc, m) => acc + m.accCount, 0);
    const totalRevisi = trendData.reduce((acc, m) => acc + m.revisiCount, 0);
    const totalPending = trendData.reduce((acc, m) => acc + m.pendingCount, 0);
    const totalAttendance = trendData.reduce((acc, m) => acc + m.attendanceCount, 0);
    const avgPerMonth = trendData.length > 0 ? Number((totalLogs / trendData.length).toFixed(1)) : 0;
    const accRate = totalLogs > 0 ? Math.round((totalAcc / totalLogs) * 100) : 0;

    // Find peak month
    let peakMonth = trendData[0];
    trendData.forEach(m => {
      if (m.totalLogs > (peakMonth?.totalLogs || 0)) {
        peakMonth = m;
      }
    });

    return {
      totalLogs,
      totalAcc,
      totalRevisi,
      totalPending,
      totalAttendance,
      avgPerMonth,
      accRate,
      peakMonth
    };
  }, [trendData]);

  // SVG Chart Geometry
  const chartHeight = 220;
  const chartWidth = 600;
  const paddingX = 45;
  const paddingY = 25;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const maxVal = Math.max(...trendData.map(d => d.totalLogs), 20);
  // Round maxVal up to nearest multiple of 10
  const yAxisMax = Math.ceil((maxVal + 5) / 10) * 10;
  const yTicks = [0, yAxisMax * 0.25, yAxisMax * 0.5, yAxisMax * 0.75, yAxisMax];

  // Helper to compute coordinates
  const getX = (index: number) => {
    if (trendData.length <= 1) return paddingX + innerWidth / 2;
    return paddingX + (index / (trendData.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return paddingY + innerHeight - (val / yAxisMax) * innerHeight;
  };

  // Line points
  const linePoints = trendData
    .map((d, i) => `${getX(i)},${getY(d.totalLogs)}`)
    .join(' ');

  // Area polygon
  const areaPoints = `${getX(0)},${paddingY + innerHeight} ${linePoints} ${getX(trendData.length - 1)},${paddingY + innerHeight}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/90 space-y-6">
      {/* Header and Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                Tren Bulanan Progres Bimbingan Mahasiswa
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Historis Aktivitas Log & Review
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualisasi kuantitas log bimbingan, revisi bab, dan rasio persetujuan (ACC) per bulan bimbingan Bapak Ir. Syaifuddin S.Kom., M.Kom.
            </p>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Jalur Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5">Jalur:</span>
            {(['Semua', 'Skripsi', 'Jurnal'] as const).map(track => (
              <button
                key={track}
                onClick={() => setFilterTrack(track)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  filterTrack === track
                    ? track === 'Jurnal'
                      ? 'bg-violet-600 text-white shadow-2xs'
                      : track === 'Skripsi'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Month Range Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs border border-slate-200/80">
            <button
              onClick={() => setMonthRange(3)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                monthRange === 3 ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3 Bulan
            </button>
            <button
              onClick={() => setMonthRange(6)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                monthRange === 6 ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              6 Bulan
            </button>
          </div>

          {/* Chart View Mode: Bar vs Line */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs border border-slate-200/80">
            <button
              onClick={() => setChartMode('bar')}
              className={`p-1.5 rounded-lg transition ${
                chartMode === 'bar' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Grafik Batang (Stacked Bar)"
              aria-label="Tampilan Bar"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartMode('line')}
              className={`p-1.5 rounded-lg transition ${
                chartMode === 'line' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Garis Tren & Area"
              aria-label="Tampilan Line"
            >
              <LineChartIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Total Sesi Bimbingan
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1">
            <span>{stats.totalLogs}</span>
            <span className="text-xs font-normal text-slate-500">Log Ditinjau</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Dalam {trendData.length} bulan terakhir
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
          <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider block">
            Rata-rata per Bulan
          </span>
          <div className="text-xl font-extrabold text-indigo-900 mt-1 flex items-baseline gap-1">
            <span>{stats.avgPerMonth}</span>
            <span className="text-xs font-normal text-indigo-600">Sesi / bln</span>
          </div>
          <span className="text-[11px] text-indigo-600 mt-0.5 block">
            Aktivitas bimbingan aktif
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
            Tingkat Persetujuan (ACC)
          </span>
          <div className="text-xl font-extrabold text-emerald-900 mt-1 flex items-baseline gap-1">
            <span>{stats.accRate}%</span>
            <span className="text-xs font-normal text-emerald-600">({stats.totalAcc} ACC)</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">
            Revisi: {stats.totalRevisi} &bull; Menunggu: {stats.totalPending}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">
            Bulan Puncak (Peak)
          </span>
          <div className="text-xl font-extrabold text-amber-900 mt-1 flex items-baseline gap-1 truncate">
            <span>{stats.totalLogs > 0 ? stats.peakMonth?.shortLabel : '-'}</span>
            <span className="text-xs font-normal text-amber-700">({stats.totalLogs > 0 ? stats.peakMonth?.totalLogs : 0} Log)</span>
          </div>
          <span className="text-[11px] text-amber-700 mt-0.5 block truncate">
            {stats.totalLogs > 0 ? stats.peakMonth?.monthLabel : 'Siap Merekam Bimbingan'}
          </span>
        </div>
      </div>

      {stats.totalLogs === 0 && (
        <div className="flex items-center gap-3 p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs text-indigo-950">
          <Info className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Siap Digunakan (Clean State):</strong> Belum ada log bimbingan. Grafik tren bulanan akan terisi otomatis seiring mahasiswa mengunggah draf bab dan dosen memberikan verifikasi evaluasi.
          </span>
        </div>
      )}

      {/* Main SVG Chart Container */}
      <div className="relative bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200/90 overflow-hidden">
        {/* Subtle background grid & SVG */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[500px] select-none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="barAccGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="barRevisiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="barPendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines and Y-Axis Labels */}
            {yTicks.map((tick, i) => {
              const y = getY(tick);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray={i === 0 ? '0' : '4 4'}
                    strokeWidth={1}
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {Math.round(tick)}
                  </text>
                </g>
              );
            })}

            {/* RENDER MODE 1: AREA & LINE CHART */}
            {chartMode === 'line' && (
              <>
                {/* Shaded Area */}
                <polygon points={areaPoints} fill="url(#areaGradient)" />

                {/* Line Path */}
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints}
                />

                {/* Data Points */}
                {trendData.map((d, index) => {
                  const x = getX(index);
                  const y = getY(d.totalLogs);
                  const isHovered = hoveredMonth?.monthKey === d.monthKey;

                  return (
                    <g
                      key={d.monthKey}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setHoveredMonth(d)}
                      onClick={() => onSelectMonth?.(d.monthKey)}
                    >
                      {/* Pulse circle if hovered */}
                      {isHovered && (
                        <circle
                          cx={x}
                          cy={y}
                          r="10"
                          className="fill-indigo-500/20 animate-ping"
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4.5}
                        className="fill-white stroke-indigo-600"
                        strokeWidth={isHovered ? 3 : 2.5}
                      />
                      {/* Count label above point */}
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        className={`text-[11px] font-extrabold ${isHovered ? 'fill-indigo-700' : 'fill-slate-700'}`}
                      >
                        {d.totalLogs}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* RENDER MODE 2: STACKED BAR CHART (ACC, REVISI, PENDING) */}
            {chartMode === 'bar' && (
              <>
                {trendData.map((d, index) => {
                  const x = getX(index);
                  const barWidth = Math.min(innerWidth / (trendData.length * 1.8), 36);
                  const isHovered = hoveredMonth?.monthKey === d.monthKey;

                  // Height calculations
                  const totalH = (d.totalLogs / yAxisMax) * innerHeight;
                  const accH = (d.accCount / yAxisMax) * innerHeight;
                  const revisiH = (d.revisiCount / yAxisMax) * innerHeight;
                  const pendingH = (d.pendingCount / yAxisMax) * innerHeight;

                  const baseY = paddingY + innerHeight;
                  const accY = baseY - accH;
                  const revisiY = accY - revisiH;
                  const pendingY = revisiY - pendingH;

                  return (
                    <g
                      key={d.monthKey}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredMonth(d)}
                      onClick={() => onSelectMonth?.(d.monthKey)}
                    >
                      {/* Background hover pillar */}
                      <rect
                        x={x - barWidth / 2 - 4}
                        y={paddingY}
                        width={barWidth + 8}
                        height={innerHeight}
                        className={`transition-colors ${isHovered ? 'fill-indigo-50/80' : 'fill-transparent'}`}
                        rx="6"
                      />

                      {/* 1. Acc Bar (Bottom green segment) */}
                      {accH > 0 && (
                        <rect
                          x={x - barWidth / 2}
                          y={accY}
                          width={barWidth}
                          height={accH}
                          fill="url(#barAccGradient)"
                          rx={revisiH === 0 && pendingH === 0 ? 4 : 0}
                          className="transition-all duration-200"
                        />
                      )}

                      {/* 2. Revisi Bar (Middle amber segment) */}
                      {revisiH > 0 && (
                        <rect
                          x={x - barWidth / 2}
                          y={revisiY}
                          width={barWidth}
                          height={revisiH}
                          fill="url(#barRevisiGradient)"
                          rx={pendingH === 0 ? 4 : 0}
                          className="transition-all duration-200"
                        />
                      )}

                      {/* 3. Pending Bar (Top purple segment) */}
                      {pendingH > 0 && (
                        <rect
                          x={x - barWidth / 2}
                          y={pendingY}
                          width={barWidth}
                          height={pendingH}
                          fill="url(#barPendingGradient)"
                          rx={4}
                          className="transition-all duration-200"
                        />
                      )}

                      {/* Total label above bar */}
                      <text
                        x={x}
                        y={baseY - totalH - 8}
                        textAnchor="middle"
                        className={`text-[11px] font-extrabold ${isHovered ? 'fill-indigo-800' : 'fill-slate-700'}`}
                      >
                        {d.totalLogs}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* X-Axis Labels */}
            {trendData.map((d, index) => {
              const x = getX(index);
              const isHovered = hoveredMonth?.monthKey === d.monthKey;
              return (
                <text
                  key={`label-${d.monthKey}`}
                  x={x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${isHovered ? 'fill-indigo-700 font-extrabold' : 'fill-slate-600'}`}
                >
                  {d.shortLabel}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block shadow-2xs"></span>
              <span className="text-slate-600 font-semibold">Disetujui (ACC)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500 inline-block shadow-2xs"></span>
              <span className="text-slate-600 font-semibold">Perlu Revisi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-500 inline-block shadow-2xs"></span>
              <span className="text-slate-600 font-semibold">Menunggu Review</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>Arahkan kursor ke pilar untuk melihat rincian per bulan</span>
          </div>
        </div>

        {/* Detail Inspection Card (Floating or embedded below when a month is hovered/active) */}
        {hoveredMonth && (
          <div className="mt-4 p-4 rounded-xl bg-white border border-indigo-200 shadow-md animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="font-extrabold text-sm text-slate-900">
                  Rincian Aktivitas {hoveredMonth.monthLabel}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {hoveredMonth.totalLogs} Log Bimbingan
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {hoveredMonth.activeStudents} Mahasiswa Terlibat
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  Disetujui (ACC)
                </span>
                <span className="text-base font-extrabold text-emerald-900">
                  {hoveredMonth.accCount} Sesi
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  {hoveredMonth.totalLogs > 0 ? Math.round((hoveredMonth.accCount / hoveredMonth.totalLogs) * 100) : 0}% Tingkat ACC
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">
                  Perlu Revisi
                </span>
                <span className="text-base font-extrabold text-amber-900">
                  {hoveredMonth.revisiCount} Sesi
                </span>
                <span className="text-[10px] text-amber-700 block mt-0.5">
                  Catatan revisi dosen diberikan
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-violet-50 border border-violet-100">
                <span className="text-[10px] uppercase font-bold text-violet-800 block">
                  Komposisi Jalur
                </span>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  Skripsi: <strong className="text-indigo-700">{hoveredMonth.skripsiCount}</strong> &bull; Jurnal: <strong className="text-violet-700">{hoveredMonth.jurnalCount}</strong>
                </div>
                <span className="text-[10px] text-violet-700 block mt-0.5">
                  Manuskrip & Bab Naskah
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100">
                <span className="text-[10px] uppercase font-bold text-sky-800 block">
                  Presensi Tatap Muka
                </span>
                <span className="text-base font-extrabold text-sky-900">
                  {hoveredMonth.attendanceCount} Kehadiran
                </span>
                <span className="text-[10px] text-sky-700 block mt-0.5">
                  Lab Siber & Konsultasi
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historical Context Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border border-indigo-100 flex items-start gap-3 text-xs text-slate-600">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
          <Info className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <span className="font-extrabold text-slate-800 block">
            Catatan Evaluasi Historis Dosen Pembimbing:
          </span>
          <p className="leading-relaxed text-slate-600">
            Aktivitas bimbingan mencapai intensitas tertinggi pada <strong>September 2026 ({trendData.find(d => d.monthKey === '2026-09')?.totalLogs || 38} log)</strong> seiring batas akhir pengumpulan draf proposal dan eksperimen awal. Pada bulan berjalan (<strong>Oktober 2026</strong>), fokus diarahkan pada penyelesaian Bab 1 dan validasi judul mahasiswa baru. Mahasiswa yang mengunggah berkas baru akan secara otomatis menambah kalkulasi log bulan berjalan secara real-time.
          </p>
        </div>
      </div>
    </div>
  );
};
