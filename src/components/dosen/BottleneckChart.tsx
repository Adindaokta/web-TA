import React from 'react';
import { GitCommit, AlertOctagon, Info, ChevronRight, User } from 'lucide-react';
import { Thesis, ChapterStage } from '../../types/index.ts';
import { calculateBottleneckPipeline, BottleneckItem } from '../../utils/rules.ts';

interface BottleneckChartProps {
  theses: Thesis[];
  selectedStage: ChapterStage | 'All';
  onSelectStage: (stage: ChapterStage | 'All') => void;
}

export const BottleneckChart: React.FC<BottleneckChartProps> = ({
  theses,
  selectedStage,
  onSelectStage
}) => {
  const pipeline = calculateBottleneckPipeline(theses);
  const maxCount = Math.max(...pipeline.map(p => p.count), 1);
  const topBottleneck = pipeline.find(p => p.isBottleneck);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base">
              Grafik Bottleneck Pipeline Mahasiswa
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Alur Bab 1 - 5 & Sidang
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Menganalisis di bab mana mahasiswa bimbingan paling banyak tertahan (bottleneck)
          </p>
        </div>

        {selectedStage !== 'All' && (
          <button
            onClick={() => onSelectStage('All')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
          >
            Tampilkan Semua Bab
          </button>
        )}
      </div>

      {/* Top Bottleneck Alert Insight */}
      {topBottleneck && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-amber-900">
              Titik Bottleneck Utama Terdeteksi di {topBottleneck.stage}:
            </span>
            <span className="text-amber-800 ml-1">
              Sebanyak <strong>{topBottleneck.count} mahasiswa ({topBottleneck.percentage}%)</strong> sedang berada di tahap ini dengan rata-rata durasi <strong>{topBottleneck.avgDuration} bulan</strong>.
              Rekomendasi: Jadwalkan sesi klinik penulisan atau review intensif untuk bab ini.
            </span>
          </div>
        </div>
      )}

      {/* Interactive Pipeline Horizontal Bars */}
      <div className="mt-5 space-y-3.5">
        {pipeline.map((item) => {
          const isSelected = selectedStage === item.stage;
          const barWidthPercent = (item.count / maxCount) * 100;
          
          return (
            <div
              key={item.stage}
              onClick={() => onSelectStage(isSelected ? 'All' : item.stage)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                  : item.isBottleneck
                  ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
                  : 'border-slate-100 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${item.isBottleneck ? 'text-amber-800' : 'text-slate-800'}`}>
                    {item.stage}
                  </span>
                  {item.isBottleneck && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                      Bottleneck
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                      Aktif Dipilih
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-500">
                  <span>Rata-rata: <strong className="text-slate-700">{item.avgDuration} bln</strong></span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                    {item.count} Mahasiswa ({item.percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.isBottleneck
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                      : item.stage === 'Pasca Sidang'
                      ? 'bg-gradient-to-r from-teal-400 to-emerald-600'
                      : 'bg-gradient-to-r from-indigo-500 to-blue-600'
                  }`}
                  style={{ width: `${Math.max(barWidthPercent, 3)}%` }}
                />
              </div>

              {/* Mini student avatars if selected or hovered */}
              {item.count > 0 && (
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {theses
                      .filter(t => t.currentChapter === item.stage)
                      .slice(0, 4)
                      .map(t => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px]"
                          title={`${t.studentName} (${t.nim}) - ${t.durationMonths} bln`}
                        >
                          <User className="h-2.5 w-2.5 text-slate-400" />
                          {t.studentName.split(' ')[0]}
                        </span>
                      ))}
                    {item.count > 4 && (
                      <span className="text-[10px] text-slate-400">+{item.count - 4} lainnya</span>
                    )}
                  </div>
                  <span className="text-[10px] text-indigo-600 font-medium hover:underline flex items-center">
                    Klik untuk filter <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
