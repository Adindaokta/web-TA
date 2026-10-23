import React, { useState } from 'react';
import { 
  Cpu, 
  Code2, 
  ShieldCheck, 
  Wifi, 
  ExternalLink, 
  User, 
  Clock, 
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Kanban,
  Network,
  Database,
  Radio,
  Sparkles,
  Layers
} from 'lucide-react';
import { Thesis, ResearchCluster } from '../../types/index.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface ResearchClustersViewProps {
  theses: Thesis[];
  onSelectStudent: (thesis: Thesis) => void;
}

export const CLUSTERS: { 
  name: ResearchCluster; 
  shortName: string;
  icon: any; 
  color: string; 
  bgLight: string; 
  border: string;
  badge: string;
  description: string;
}[] = [
  {
    name: 'Honeypot & Akuisisi Data',
    shortName: 'Honeypot & Akuisisi',
    icon: Radio,
    color: 'text-rose-600',
    bgLight: 'bg-rose-50/70',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    description: 'Pemasangan sensor honeypot SSH/HTTP/IoT, crawler, dan ekstraksi payload serangan siber.'
  },
  {
    name: 'Dataset & Rekayasa Fitur',
    shortName: 'Dataset & Fitur',
    icon: Database,
    color: 'text-cyan-600',
    bgLight: 'bg-cyan-50/70',
    border: 'border-cyan-200',
    badge: 'bg-cyan-100 text-cyan-800',
    description: 'Pembersihan data CICIoT2023 / IoT-DH, seleksi fitur (IG, RFE, Chi-Sq), dan penyeimbangan SMOTE.'
  },
  {
    name: 'Machine Learning & Zero-Day',
    shortName: 'ML & Zero-Day',
    icon: Cpu,
    color: 'text-indigo-600',
    bgLight: 'bg-indigo-50/70',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800',
    description: 'Model deteksi DDoS, XGBoost, Random Forest, Autoencoder, dan ketahanan terhadap ancaman zero-day.'
  },
  {
    name: 'Deep Reinforcement Learning',
    shortName: 'Deep RL',
    icon: Sparkles,
    color: 'text-violet-600',
    bgLight: 'bg-violet-50/70',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-800',
    description: 'Eksplorasi agen DRL otonom untuk mitigasi dinamis dan deteksi intrusi cerdas pada lingkungan IoT.'
  },
  {
    name: 'Edge, Mitigasi & Kajian',
    shortName: 'Edge & Mitigasi',
    icon: Wifi,
    color: 'text-amber-600',
    bgLight: 'bg-amber-50/70',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    description: 'Gateway edge computing, protokol MQTT/CoAP, deteksi ICMP flood, dan mitigasi otomatis.'
  },
  {
    name: 'Topik Implementatif Dasar',
    shortName: 'Implementatif Dasar',
    icon: Code2,
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    description: 'Kriptografi AES/RSA, steganografi citra HEIC/LSB, security pipeline DevSecOps, dan aplikasi web.'
  }
];

export const ResearchClustersView: React.FC<ResearchClustersViewProps> = ({
  theses,
  onSelectStudent
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'fishbone'>('kanban');

  return (
    <div className="space-y-6">
      {/* Top Banner & View Switcher */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Klasterisasi Berdasarkan 6 Rumpun Riset
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200">
              6 Research Tracks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelompokan 35 mahasiswa bimbingan Ir. Syaifuddin S.Kom., M.Kom. menurut domain riset untuk memfasilitasi penelitian kolaboratif, sharing dataset, dan monitoring percepatan kelulusan.
          </p>
        </div>

        {/* Layout Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto shrink-0 border border-slate-200">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              viewMode === 'kanban'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span>Tampilan Kanban (6 Kolom)</span>
          </button>
          <button
            onClick={() => setViewMode('fishbone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              viewMode === 'fishbone'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Tampilan Diagram Fishbone</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Kanban Board View (6 Columns) */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CLUSTERS.map((cluster) => {
            const clusterTheses = theses.filter(t => t.cluster === cluster.name);
            const Icon = cluster.icon;
            const avgDuration = clusterTheses.length > 0
              ? (clusterTheses.reduce((acc, c) => acc + c.durationMonths, 0) / clusterTheses.length).toFixed(1)
              : '0';

            const criticalCount = clusterTheses.filter(t => t.riskLevel === 'Kritis').length;
            const approvedCount = clusterTheses.filter(t => t.titleStatus === 'Approved').length;

            return (
              <div
                key={cluster.name}
                className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 flex flex-col h-full shadow-2xs hover:border-slate-300 transition"
              >
                {/* Column Header */}
                <div className={`p-3.5 rounded-xl ${cluster.bgLight} border ${cluster.border} mb-3.5`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-white shadow-xs ${cluster.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-xs leading-tight">
                        {cluster.name}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${cluster.badge}`}>
                      {clusterTheses.length} Mhs
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                    {cluster.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>ACC Judul: <strong className="text-slate-700">{approvedCount}</strong></span>
                    <span>Rata-rata: <strong>{avgDuration} bln</strong></span>
                  </div>

                  {criticalCount > 0 && (
                    <div className="mt-2 text-[10px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {criticalCount} mahasiswa status kritis
                    </div>
                  )}
                </div>

                {/* Student Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[580px] pr-1">
                  {clusterTheses.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 bg-white/50 rounded-xl border border-dashed border-slate-200">
                      Belum ada mahasiswa di rumpun ini
                    </div>
                  ) : (
                    clusterTheses.map((thesis) => (
                      <div
                        key={thesis.id}
                        onClick={() => onSelectStudent(thesis)}
                        className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
                      >
                        {/* Student Name & NIM */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <UserAvatar name={thesis.studentName} size="xs" shape="circle" />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                                {thesis.studentName}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {thesis.nim} (Angkatan {thesis.nim.slice(0, 4)})
                              </span>
                            </div>
                          </div>

                          {/* Risk Badge */}
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                              thesis.riskLevel === 'Kritis'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : thesis.riskLevel === 'Waspada'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {thesis.riskLevel === 'Kritis' && <AlertTriangle className="h-2.5 w-2.5" />}
                            {thesis.riskLevel === 'Waspada' && <AlertCircle className="h-2.5 w-2.5" />}
                            {thesis.riskLevel === 'Aman' && <CheckCircle2 className="h-2.5 w-2.5" />}
                            {thesis.riskLevel}
                          </span>
                        </div>

                        {/* Title */}
                        <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3 leading-snug">
                          {thesis.title}
                        </p>

                        {/* Stage, Track & Duration Pill */}
                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                              {thesis.currentChapter}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-600">
                              {thesis.graduationTrack || 'Skripsi'}
                            </span>
                          </div>
                          <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {thesis.durationMonths} bln
                          </span>
                        </div>

                        {/* SK Status & Title Status */}
                        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-50 pt-1.5">
                          <span className={thesis.titleStatus === 'Approved' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-medium'}>
                            Judul: {thesis.titleStatus}
                          </span>
                          <span className="text-slate-500">
                            {thesis.skStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Mode 2: Fishbone Diagram Layout (6 Ribs) */
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
          <div className="min-w-[960px] relative py-8">
            {/* Main Central Spine of Fishbone */}
            <div className="h-3 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 rounded-full w-full relative mb-12 shadow-sm">
              {/* Fishbone Head (Goal) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md text-xs font-bold whitespace-nowrap flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Target Kelulusan & Publikasi Tepat Waktu (6 Bulan)</span>
              </div>
            </div>

            {/* Fishbone Ribs (6 Clusters: 3 above spine, 3 below spine) */}
            <div className="grid grid-cols-3 gap-6">
              {CLUSTERS.map((cluster, idx) => {
                const clusterTheses = theses.filter(t => t.cluster === cluster.name);
                const Icon = cluster.icon;
                const isTop = idx < 3;

                return (
                  <div
                    key={cluster.name}
                    className={`flex flex-col ${isTop ? '-mt-24 mb-6' : 'mt-4'} relative`}
                  >
                    {/* Rib connection pin */}
                    <div className={`p-3 rounded-xl ${cluster.bgLight} border ${cluster.border} shadow-xs mb-3`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${cluster.color}`} />
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">
                            {cluster.shortName}
                          </h4>
                        </div>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-white rounded-full text-slate-700 shadow-2xs">
                          {clusterTheses.length} Mhs
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {cluster.description}
                      </p>
                    </div>

                    {/* Student cards branching off */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {clusterTheses.map(t => (
                        <div
                          key={t.id}
                          onClick={() => onSelectStudent(t)}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition cursor-pointer text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                            <span className="truncate max-w-[140px]">{t.studentName}</span>
                            <span className="text-[10px] text-indigo-600 px-1.5 py-0.2 bg-indigo-50 rounded">
                              {t.currentChapter}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{t.graduationTrack || 'Skripsi'} &bull; {t.durationMonths} bln</span>
                            <span className={t.riskLevel === 'Kritis' ? 'text-rose-600 font-bold' : t.riskLevel === 'Waspada' ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                              {t.riskLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
