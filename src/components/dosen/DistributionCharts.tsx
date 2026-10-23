import React, { useState } from 'react';
import { BookOpen, Newspaper, Hourglass, Layers } from 'lucide-react';
import { Thesis } from '../../types/index.ts';

interface DistributionChartsProps {
  theses: Thesis[];
}

export const DistributionCharts: React.FC<DistributionChartsProps> = ({ theses }) => {
  const [activeTab, setActiveTab] = useState<'stage' | 'journal' | 'track' | 'duration'>('stage');
  const total = theses.length || 1;

  // 1. Data Tahap Penulisan (Khusus Mahasiswa Jalur Skripsi)
  const skripsiStudents = theses.filter(t => (t.graduationTrack || 'Skripsi') === 'Skripsi');
  const totalSkripsi = skripsiStudents.length || 1;
  const stageCounts: Record<string, number> = {
    'Bab 1': 0,
    'Bab 2': 0,
    'Bab 3': 0,
    'Bab 4': 0,
    'Bab 5': 0,
    'Pasca Sidang': 0
  };
  skripsiStudents.forEach(t => {
    if (stageCounts[t.currentChapter] !== undefined) stageCounts[t.currentChapter]++;
  });

  const stageData = Object.entries(stageCounts).map(([label, count], index) => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4'];
    return {
      label,
      count,
      percent: Math.round((count / totalSkripsi) * 100),
      color: colors[index % colors.length]
    };
  });

  // 2. Data Status Jurnal (Khusus Mahasiswa Jalur Jurnal - Mandat Prompt)
  const jurnalStudents = theses.filter(t => t.graduationTrack === 'Jurnal');
  const totalJurnal = jurnalStudents.length || 1;
  const journalStageCounts: Record<string, number> = {
    'Draft': 0,
    'Submit': 0,
    'Revisi': 0,
    'Accepted/Published': 0
  };
  jurnalStudents.forEach(t => {
    const stage = t.journalStage || 'Draft';
    if (journalStageCounts[stage] !== undefined) {
      journalStageCounts[stage]++;
    } else {
      journalStageCounts['Draft']++;
    }
  });

  const journalData = [
    { label: 'Draft Manuskrip', count: journalStageCounts['Draft'], color: '#f59e0b' },
    { label: 'Submit ke Redaksi', count: journalStageCounts['Submit'], color: '#3b82f6' },
    { label: 'Revisi Reviewer', count: journalStageCounts['Revisi'], color: '#ea580c' },
    { label: 'Accepted / Published', count: journalStageCounts['Accepted/Published'], color: '#10b981' }
  ].map(item => ({
    ...item,
    percent: Math.round((item.count / totalJurnal) * 100)
  }));

  // 3. Data Komposisi Jalur Kelulusan (Skripsi vs Jurnal)
  const trackData = [
    { label: 'Jalur Skripsi (Bab 1 - 5)', count: skripsiStudents.length, color: '#6366f1' },
    { label: 'Jalur Publikasi Jurnal', count: jurnalStudents.length, color: '#8b5cf6' }
  ].map(item => ({
    ...item,
    percent: Math.round((item.count / total) * 100)
  }));

  // 4. Data Sebaran Durasi
  let under4 = 0;
  let between4and6 = 0;
  let between7and9 = 0;
  let above9 = 0;

  theses.forEach(t => {
    if (t.durationMonths < 4) under4++;
    else if (t.durationMonths <= 6) between4and6++;
    else if (t.durationMonths <= 9) between7and9++;
    else above9++;
  });

  const durationData = [
    { label: '< 4 Bulan (Awal/Cepat)', count: under4, color: '#10b981' },
    { label: '4 - 6 Bulan (Standar Ideal)', count: between4and6, color: '#3b82f6' },
    { label: '7 - 9 Bulan (Mendekati Batas)', count: between7and9, color: '#f59e0b' },
    { label: '> 9 Bulan (Perlu Intervensi)', count: above9, color: '#ef4444' }
  ].map(item => ({
    ...item,
    percent: Math.round((item.count / total) * 100)
  }));

  const currentDataset = 
    activeTab === 'stage' ? stageData :
    activeTab === 'journal' ? journalData :
    activeTab === 'track' ? trackData : durationData;

  const datasetTotal = 
    activeTab === 'stage' ? totalSkripsi :
    activeTab === 'journal' ? totalJurnal : total;

  // Calculate SVG donut stroke-dasharray and stroke-dashoffset
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="font-bold text-slate-800 text-base">
            Grafik Distribusi Mahasiswa
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Komposisi bab skripsi, sebaran status naskah jurnal ({jurnalStudents.length} mhs), jalur kelulusan, dan argo durasi bimbingan
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('stage')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition whitespace-nowrap ${
              activeTab === 'stage'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            <span>Tahap Bab ({skripsiStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition whitespace-nowrap ${
              activeTab === 'journal'
                ? 'bg-white text-violet-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="h-3 w-3" />
            <span>Status Jurnal ({jurnalStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition whitespace-nowrap ${
              activeTab === 'track'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Jalur (Skripsi/Jurnal)</span>
          </button>

          <button
            onClick={() => setActiveTab('duration')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition whitespace-nowrap ${
              activeTab === 'duration'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hourglass className="h-3 w-3" />
            <span>Sebaran Durasi</span>
          </button>
        </div>
      </div>

      {/* Main Visual: Donut Chart + Legend */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Donut Chart */}
        <div className="md:col-span-5 flex justify-center items-center relative">
          <svg width="190" height="190" viewBox="0 0 190 190" className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="95"
              cy="95"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="24"
            />

            {/* Segments */}
            {currentDataset.map((slice, index) => {
              const strokeLength = (slice.count / (datasetTotal || 1)) * circumference;
              const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
              const strokeDashoffset = -accumulatedAngle;
              accumulatedAngle += strokeLength;

              if (slice.count === 0) return null;

              return (
                <circle
                  key={index}
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="24"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 hover:opacity-80"
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900">{datasetTotal}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {activeTab === 'stage' ? 'Mhs Skripsi' : activeTab === 'journal' ? 'Mhs Jurnal' : 'Mahasiswa'}
            </span>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="md:col-span-7 space-y-2">
          {currentDataset.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-semibold text-slate-700">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">
                  {item.count} mhs
                </span>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded min-w-[42px] text-right">
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
