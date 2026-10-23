import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Edit3,
  ShieldCheck,
  Clock,
  Sparkles,
  Check,
  RotateCcw,
  FileCheck2,
  FileX2
} from 'lucide-react';
import { Thesis, ResearchCluster, RiskLevel, SKStatus, TitleStatus } from '../../types/index.ts';
import { downloadCSV } from '../../utils/rules.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface ProgressTableViewProps {
  theses: Thesis[];
  onSelectStudent: (thesis: Thesis) => void;
  initialRiskFilter?: string;
  initialTitleFilter?: 'Semua' | 'Approved' | 'Pending';
  initialSKFilter?: 'Semua' | 'Belum SK' | 'Sudah SK';
  initialTrackFilter?: 'Semua' | 'Skripsi' | 'Jurnal';
  onApproveTitle?: (thesisId: string) => void;
  onReviseTitle?: (thesisId: string) => void;
  onOpenVerifySK?: (thesis: Thesis) => void;
}

export const ProgressTableView: React.FC<ProgressTableViewProps> = ({
  theses,
  onSelectStudent,
  initialRiskFilter,
  initialTitleFilter = 'Semua',
  initialSKFilter = 'Semua',
  initialTrackFilter = 'Semua',
  onApproveTitle,
  onReviseTitle,
  onOpenVerifySK
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('Semua');
  const [selectedRisk, setSelectedRisk] = useState<string>(initialRiskFilter || 'Semua');
  const [selectedSK, setSelectedSK] = useState<string>(initialSKFilter);
  const [selectedTrack, setSelectedTrack] = useState<'Semua' | 'Skripsi' | 'Jurnal'>(initialTrackFilter);
  const [selectedAngkatan, setSelectedAngkatan] = useState<string>('Semua');
  const [titleTab, setTitleTab] = useState<'Semua' | 'Approved' | 'Pending'>(initialTitleFilter);
  const [sortField, setSortField] = useState<'durationMonths' | 'studentName' | 'currentChapter' | 'lastUpdate'>('studentName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const clusters: string[] = [
    'Semua',
    'Honeypot & Akuisisi Data',
    'Dataset & Rekayasa Fitur',
    'Machine Learning & Zero-Day',
    'Deep Reinforcement Learning',
    'Edge, Mitigasi & Kajian',
    'Topik Implementatif Dasar'
  ];

  // Dynamic extraction of distinct Angkatan from NIM (first 4 digits)
  const availableAngkatan = useMemo(() => {
    const years = Array.from(new Set(theses.map(t => t.nim.slice(0, 4)).filter(Boolean))).sort().reverse();
    return ['Semua', ...years];
  }, [theses]);

  const approvedCount = theses.filter(t => t.titleStatus === 'Approved').length;
  const pendingCount = theses.filter(t => t.titleStatus !== 'Approved').length;
  const belumSKCount = theses.filter(t => t.skStatus === 'Belum SK').length;
  const sudahSKCount = theses.filter(t => t.skStatus === 'Sudah SK').length;
  const skripsiCount = theses.filter(t => (t.graduationTrack || 'Skripsi') === 'Skripsi').length;
  const jurnalCount = theses.filter(t => t.graduationTrack === 'Jurnal').length;

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredTheses = useMemo(() => {
    return theses.filter(t => {
      // Title Status Tab
      if (titleTab === 'Approved' && t.titleStatus !== 'Approved') return false;
      if (titleTab === 'Pending' && t.titleStatus === 'Approved') return false;

      // Track Filter (Skripsi vs Jurnal)
      if (selectedTrack === 'Skripsi' && (t.graduationTrack || 'Skripsi') !== 'Skripsi') return false;
      if (selectedTrack === 'Jurnal' && t.graduationTrack !== 'Jurnal') return false;

      // Angkatan Filter (4 digit pertama NIM)
      if (selectedAngkatan !== 'Semua' && !t.nim.startsWith(selectedAngkatan)) return false;

      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.studentName.toLowerCase().includes(q) ||
        t.nim.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q);

      // Cluster
      const matchCluster = selectedCluster === 'Semua' || t.cluster === selectedCluster;

      // Risk
      const matchRisk = selectedRisk === 'Semua' || t.riskLevel === selectedRisk;

      // SK
      const matchSK = selectedSK === 'Semua' || t.skStatus === selectedSK;

      return matchSearch && matchCluster && matchRisk && matchSK;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'durationMonths') {
        comparison = a.durationMonths - b.durationMonths;
      } else if (sortField === 'studentName') {
        comparison = a.studentName.localeCompare(b.studentName);
      } else if (sortField === 'currentChapter') {
        comparison = a.currentChapter.localeCompare(b.currentChapter);
      } else if (sortField === 'lastUpdate') {
        comparison = new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [theses, titleTab, selectedTrack, selectedAngkatan, searchQuery, selectedCluster, selectedRisk, selectedSK, sortField, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCluster('Semua');
    setSelectedRisk('Semua');
    setSelectedSK('Semua');
    setSelectedTrack('Semua');
    setSelectedAngkatan('Semua');
    setTitleTab('Semua');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden space-y-4">
      {/* Table Header Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Tabel Manajemen Progres Mahasiswa Bimbingan
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {filteredTheses.length} dari {theses.length} Mahasiswa
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar rekam jejak bimbingan, verifikasi SK, validasi usulan judul, dan status penulisan bab per mahasiswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCSV(theses)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              title="Unduh data dalam format CSV / Excel"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition"
              title="Reset semua filter"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Filters Strip 1: Title Validation & SK Status Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Title Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 font-semibold mr-1">Status Judul:</span>
            <button
              onClick={() => setTitleTab('Semua')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                titleTab === 'Semua'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua ({theses.length})
            </button>

            <button
              onClick={() => setTitleTab('Approved')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                titleTab === 'Approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Approved ({approvedCount})</span>
            </button>

            <button
              onClick={() => setTitleTab('Pending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                titleTab === 'Pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Pending ({pendingCount})</span>
            </button>
          </div>

          {/* SK Status Filter Pills (Required by Prompt) */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-slate-400 font-semibold mr-1">Filter SK:</span>
            {(['Semua', 'Belum SK', 'Sudah SK'] as const).map(sk => {
              const isSelected = selectedSK === sk;
              const count = sk === 'Semua' ? theses.length : sk === 'Belum SK' ? belumSKCount : sudahSKCount;
              return (
                <button
                  key={sk}
                  onClick={() => setSelectedSK(sk)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? sk === 'Sudah SK'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : sk === 'Belum SK'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sk === 'Sudah SK' && <FileCheck2 className="h-3 w-3" />}
                  {sk === 'Belum SK' && <FileX2 className="h-3 w-3" />}
                  <span>{sk} ({count})</span>
                </button>
              );
            })}
          </div>

            {/* Jalur Kelulusan Filter Pills (Required by Prompt) */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-slate-400 font-semibold mr-1">Jalur:</span>
            {(['Semua', 'Skripsi', 'Jurnal'] as const).map(track => {
              const isSelected = selectedTrack === track;
              const count = track === 'Semua' ? theses.length : track === 'Skripsi' ? skripsiCount : jurnalCount;
              return (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? track === 'Jurnal'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : track === 'Skripsi'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{track} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Filter Angkatan (4 digit pertama NIM - Mandat Prompt) */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-slate-400 font-semibold mr-1">Angkatan:</span>
            {availableAngkatan.map(year => {
              const isSelected = selectedAngkatan === year;
              const count = year === 'Semua' ? theses.length : theses.filter(t => t.nim.startsWith(year)).length;
              return (
                <button
                  key={year}
                  onClick={() => setSelectedAngkatan(year)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {year === 'Semua' ? 'Semua Thn' : `'${year.slice(2)}`} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Informational Callout when viewing Pending Tab */}
        {titleTab === 'Pending' && (
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Antrean Mahasiswa Menunggu Persetujuan Judul ({pendingCount} Mahasiswa):</span>
              <p className="mt-0.5 text-amber-800">
                Mahasiswa pada daftar ini belum memulai penulisan bab (Tahap: Belum Mulai). Klik tombol <strong>ACC Judul</strong> untuk mengesahkan judul skripsi mereka dan memulai bimbingan Bab 1.
              </p>
            </div>
          </div>
        )}

        {/* Filter & Search Bar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-1">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Nama, NIM, atau Kata Kunci Judul..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Cluster Filter (6 valid tracks) */}
          <div className="lg:col-span-3">
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {clusters.map((c) => (
                <option key={c} value={c}>
                  {c === 'Semua' ? 'Semua Rumpun Riset' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Angkatan Filter Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedAngkatan}
              onChange={(e) => setSelectedAngkatan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {availableAngkatan.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === 'Semua' ? 'Semua Angkatan' : `Angkatan ${yr}`}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Semua">Semua Tingkat Risiko</option>
              <option value="Aman">Risiko: Aman</option>
              <option value="Waspada">Risiko: Waspada</option>
              <option value="Kritis">Risiko: Kritis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[960px]">
          <thead>
            <tr className="bg-slate-50/80 border-y border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('studentName')}>
                <div className="flex items-center gap-1">
                  <span>Mahasiswa</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 min-w-[240px]">Judul Skripsi & Rumpun Riset</th>
              <th className="py-3 px-4">Jalur</th>
              <th className="py-3 px-4">Status Judul</th>
              <th className="py-3 px-4">Status SK</th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('currentChapter')}>
                <div className="flex items-center gap-1">
                  <span>Tahap Progres</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('durationMonths')}>
                <div className="flex items-center gap-1">
                  <span>Durasi ACC</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Risiko</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTheses.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                  Tidak ada mahasiswa yang cocok dengan kriteria filter yang dipilih.
                </td>
              </tr>
            ) : (
              filteredTheses.map((thesis) => {
                const isApproved = thesis.titleStatus === 'Approved';
                const hasPendingSK = thesis.skVerificationStatus === 'Menunggu Verifikasi';

                return (
                  <tr
                    key={thesis.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    {/* Mahasiswa Info with Clean Initials Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={thesis.studentName} size="sm" shape="circle" />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                            {thesis.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {thesis.nim}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Judul & Rumpun */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                        {thesis.title}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {thesis.cluster}
                      </span>
                    </td>

                    {/* Jalur Kelulusan */}
                    <td className="py-3.5 px-4">
                      {thesis.graduationTrack === 'Jurnal' ? (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            Jurnal
                          </span>
                          <div className="text-[10px] font-semibold text-slate-500">
                            {thesis.journalStage || 'Draft'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          Skripsi
                        </span>
                      )}
                    </td>

                    {/* Status Judul & ACC */}
                    <td className="py-3.5 px-4">
                      {isApproved ? (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Approved
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ACC: {thesis.approvedAt}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                          <div className="text-[10px] text-slate-400">
                            Menunggu Dosen
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Status SK (with Quick Action if Pending) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          thesis.skStatus === 'Sudah SK'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : hasPendingSK
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 font-extrabold'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {thesis.skStatus === 'Sudah SK' ? <FileCheck2 className="h-3 w-3" /> : <FileX2 className="h-3 w-3" />}
                          {thesis.skStatus}
                        </span>

                        {hasPendingSK && (
                          <div>
                            <button
                              onClick={() => onOpenVerifySK?.(thesis)}
                              className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition inline-flex items-center gap-1"
                              title="Tinjau & Verifikasi SK Mahasiswa"
                            >
                              <span>Verifikasi SK &rarr;</span>
                            </button>
                          </div>
                        )}

                        {thesis.skNumber && (
                          <div className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]" title={thesis.skNumber}>
                            {thesis.skNumber}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Tahap Progres / Luaran */}
                    <td className="py-3.5 px-4">
                      {thesis.graduationTrack === 'Jurnal' ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-violet-100 text-violet-800">
                            {thesis.journalStage || 'Draft'}
                          </span>
                          <div className="text-[9px] text-slate-400 truncate max-w-[130px]" title={thesis.journalName}>
                            {thesis.journalName || 'Jurnal UMM'}
                          </div>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          thesis.currentChapter === 'Pasca Sidang' ? 'bg-emerald-100 text-emerald-800' :
                          thesis.currentChapter === 'Bab 5' ? 'bg-indigo-100 text-indigo-800' :
                          thesis.currentChapter === 'Bab 4' ? 'bg-sky-100 text-sky-800' :
                          thesis.currentChapter === 'Belum Mulai' ? 'bg-slate-100 text-slate-500' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {thesis.currentChapter}
                        </span>
                      )}
                    </td>

                    {/* Durasi Bulan */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {thesis.durationMonths} <span className="text-slate-400 font-normal">bln</span>
                    </td>

                    {/* Tingkat Risiko */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        thesis.riskLevel === 'Kritis' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        thesis.riskLevel === 'Waspada' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {thesis.riskLevel === 'Kritis' && <AlertTriangle className="h-3 w-3" />}
                        {thesis.riskLevel === 'Waspada' && <AlertCircle className="h-3 w-3" />}
                        {thesis.riskLevel === 'Aman' && <CheckCircle2 className="h-3 w-3" />}
                        {thesis.riskLevel}
                      </span>
                    </td>

                    {/* Kolom Aksi */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Approval actions for Pending students */}
                        {!isApproved && onApproveTitle && (
                          <button
                            onClick={() => onApproveTitle(thesis.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition flex items-center gap-1"
                            title="ACC usulan judul skripsi dan mulai bimbingan Bab 1"
                          >
                            <Check className="h-3 w-3" />
                            <span>ACC Judul</span>
                          </button>
                        )}

                        {/* Open Verification / Review Modal */}
                        <button
                          onClick={() => onSelectStudent(thesis)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold text-[11px] transition flex items-center gap-1"
                          title="Buka tinjauan naskah, log bimbingan, atau berikan feedback"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Review</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          Menampilkan <strong className="text-slate-800">{filteredTheses.length}</strong> dari total <strong className="text-slate-800">{theses.length}</strong> mahasiswa bimbingan Ir. Syaifuddin S.Kom., M.Kom. (Informatika UMM)
        </div>
        <div className="text-[11px] text-slate-400">
          Clean State Hari ke-1 &bull; 9 Approved (Bab 1), 26 Pending (Belum Mulai)
        </div>
      </div>
    </div>
  );
};
