import React, { useState } from 'react';
import { 
  HelpCircle, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Clock,
  BookOpen,
  User,
  Info
} from 'lucide-react';
import { Thesis, ChapterStage, RiskLevel } from '../../types/index.ts';

interface RiskScatterPlotProps {
  theses: Thesis[];
  onSelectStudent: (thesis: Thesis) => void;
}

// Tahap Bab pada sumbu Y dari bawah ke atas
const Y_STAGES: ChapterStage[] = [
  'Belum Mulai',
  'Bab 1',
  'Bab 2',
  'Bab 3',
  'Bab 4',
  'Bab 5',
  'Pasca Sidang'
];

export const RiskScatterPlot: React.FC<RiskScatterPlotProps> = ({ theses, onSelectStudent }) => {
  const [activeFilter, setActiveFilter] = useState<'Semua' | RiskLevel>('Semua');
  const [hoveredThesis, setHoveredThesis] = useState<Thesis | null>(null);

  const filteredTheses = theses.filter(t => {
    if (activeFilter === 'Semua') return true;
    return t.riskLevel === activeFilter;
  });

  // Plot geometry constants
  // Sumbu X: Durasi dalam Bulan (0 hingga 12 bulan)
  // Sumbu Y: Tahap Bab (Belum Mulai s/d Pasca Sidang)
  const maxMonths = 12;
  const padding = { top: 35, right: 35, bottom: 50, left: 95 };
  const width = 640;
  const height = 360;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // X position based on duration in months (0 at left, 12 at right)
  const getX = (duration: number) => {
    const clamped = Math.min(Math.max(duration, 0), maxMonths);
    return padding.left + (clamped / maxMonths) * plotWidth;
  };

  // Y position based on Chapter stage (Belum Mulai at bottom, Pasca Sidang at top)
  const getY = (chapter: ChapterStage) => {
    const idx = Y_STAGES.indexOf(chapter);
    const validIdx = idx >= 0 ? idx : 0;
    // Y increases downwards in SVG, so index 0 is at bottom
    return padding.top + plotHeight - (validIdx / (Y_STAGES.length - 1)) * plotHeight;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base">
              Matriks Risiko Keterlambatan (Scatter Plot)
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Sumbu X: Durasi (Bulan) &bull; Sumbu Y: Tahap Bab
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap titik merepresentasikan 1 mahasiswa. Warna titik membedakan tingkat risiko (Aman vs Kritis).
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto">
          {(['Semua', 'Aman', 'Waspada', 'Kritis'] as const).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  isSelected
                    ? filter === 'Kritis'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : filter === 'Waspada'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : filter === 'Aman'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Canvas Scatter Plot */}
      <div className="relative mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[540px] select-none"
        >
          {/* Background Zone Fills */}
          {/* Critical Risk Zone (Durasi > 6 Bulan pada bab awal) */}
          <rect
            x={getX(6)}
            y={padding.top}
            width={getX(maxMonths) - getX(6)}
            height={plotHeight}
            fill="#fff1f2"
            opacity="0.45"
          />
          {/* Safe Zone (Durasi <= 6 Bulan) */}
          <rect
            x={padding.left}
            y={padding.top}
            width={getX(6) - padding.left}
            height={plotHeight}
            fill="#f0fdf4"
            opacity="0.45"
          />

          {/* Vertical 6 Months Target Guideline */}
          <line
            x1={getX(6)}
            y1={padding.top}
            x2={getX(6)}
            y2={padding.top + plotHeight}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={getX(6) + 4}
            y={padding.top + 12}
            fontSize="10"
            fontWeight="bold"
            fill="#059669"
          >
            Target Kelulusan (6 Bulan)
          </text>

          {/* Grid lines for each Chapter on Y axis */}
          {Y_STAGES.map((stage) => {
            const y = getY(stage);
            return (
              <g key={stage}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="600"
                  fill="#475569"
                >
                  {stage}
                </text>
              </g>
            );
          })}

          {/* Grid lines for Duration on X axis */}
          {[0, 2, 4, 6, 8, 10, 12].map((m) => {
            const x = getX(m);
            return (
              <g key={m}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + plotHeight}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padding.top + plotHeight + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#64748b"
                >
                  {m} bln
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 8}
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#334155"
          >
            Sumbu X: Durasi Pengerjaan Sejak ACC Judul (Bulan)
          </text>
          <text
            transform={`rotate(-90)`}
            x={-(padding.top + plotHeight / 2)}
            y={18}
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#334155"
          >
            Sumbu Y: Tahap Penulisan Naskah
          </text>

          {/* Student Points with jitter to avoid complete overlapping */}
          {filteredTheses.map((thesis, i) => {
            const baseX = getX(thesis.durationMonths);
            const baseY = getY(thesis.currentChapter);

            // Deterministic jitter offset based on index so dots don't stack directly
            const jitterX = ((i % 5) - 2) * 5;
            const jitterY = (((i * 3) % 5) - 2) * 4;

            const cx = Math.max(padding.left + 8, Math.min(padding.left + plotWidth - 8, baseX + jitterX));
            const cy = Math.max(padding.top + 8, Math.min(padding.top + plotHeight - 8, baseY + jitterY));

            const isHovered = hoveredThesis?.id === thesis.id;
            const isCritical = thesis.riskLevel === 'Kritis';
            const isWarning = thesis.riskLevel === 'Waspada';

            const fillColor = isCritical 
              ? '#e11d48' 
              : isWarning 
              ? '#f59e0b' 
              : '#10b981';

            const strokeColor = isCritical 
              ? '#881337' 
              : isWarning 
              ? '#78350f' 
              : '#064e3b';

            return (
              <g
                key={thesis.id}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectStudent(thesis)}
                onMouseEnter={() => setHoveredThesis(thesis)}
                onMouseLeave={() => setHoveredThesis(null)}
              >
                {/* Glow ring if hovered */}
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="13"
                    fill={fillColor}
                    opacity="0.3"
                  />
                )}

                {/* Dot Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? "7.5" : "5.5"}
                  fill={fillColor}
                  stroke={isHovered ? strokeColor : "#ffffff"}
                  strokeWidth="1.5"
                  className="filter drop-shadow-xs"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredThesis && (
          <div className="absolute top-2 right-4 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs pointer-events-none z-20 animate-in fade-in duration-100">
            <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
              <span className="font-extrabold text-sm text-white">
                {hoveredThesis.studentName}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                hoveredThesis.riskLevel === 'Kritis' ? 'bg-rose-500 text-white' :
                hoveredThesis.riskLevel === 'Waspada' ? 'bg-amber-500 text-white' :
                'bg-emerald-500 text-white'
              }`}>
                {hoveredThesis.riskLevel}
              </span>
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div>NIM: <strong className="text-white font-mono">{hoveredThesis.nim}</strong></div>
              <div>Tahap: <strong className="text-indigo-300">{hoveredThesis.currentChapter}</strong></div>
              <div>Durasi: <strong className="text-white">{hoveredThesis.durationMonths} Bulan</strong> (ACC: {hoveredThesis.approvedAt || 'Pending'})</div>
              <div>Status SK: <strong className={hoveredThesis.skStatus === 'Sudah SK' ? 'text-blue-300' : 'text-amber-300'}>{hoveredThesis.skStatus}</strong></div>
              <div className="line-clamp-2 italic text-slate-400 mt-1">"{hoveredThesis.title}"</div>
            </div>
            <div className="mt-2 text-[10px] text-indigo-300 font-semibold border-t border-slate-800 pt-1">
              Klik titik untuk meninjau detail & berkas naskah &rarr;
            </div>
          </div>
        )}
      </div>

      {/* Legend & Summary Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-700">Legenda Warna Risiko:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-2xs"></span>
            <span className="text-slate-700 font-medium">Aman (Durasi Ideal &le; Target)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-2xs"></span>
            <span className="text-slate-700 font-medium">Waspada (Mendekati Batas Bab)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block shadow-2xs"></span>
            <span className="text-slate-700 font-medium">Kritis (Tertahan Lebih Lama)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Total {filteredTheses.length} mahasiswa terpeta
        </div>
      </div>
    </div>
  );
};
