import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Send, 
  BookOpen, 
  Newspaper, 
  Award, 
  Trash2,
  ExternalLink,
  Layers,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { Thesis, ChapterStage, GraduationTrack, JournalStage, DefenseStatus } from '../../types/index.ts';
import { CHAPTER_ORDER } from '../../utils/rules.ts';

interface UpdateProgressFormProps {
  thesis: Thesis;
  onUpdateThesis: (updatedThesis: Thesis) => void;
  onNavigateTab: (tab: string) => void;
}

export const UpdateProgressForm: React.FC<UpdateProgressFormProps> = ({
  thesis,
  onUpdateThesis,
  onNavigateTab
}) => {
  // Track State: 'Skripsi' vs 'Jurnal'
  const [selectedTrack, setSelectedTrack] = useState<GraduationTrack>(thesis.graduationTrack || 'Skripsi');

  // Skripsi track state
  const [selectedChapter, setSelectedChapter] = useState<ChapterStage>(
    thesis.currentChapter === 'Belum Mulai' ? 'Bab 1' : thesis.currentChapter
  );

  // Jurnal track state: 'Draft' | 'Submit' | 'Revisi' | 'Accepted/Published'
  const [selectedJournalStage, setSelectedJournalStage] = useState<JournalStage>(
    thesis.journalStage || 'Draft'
  );
  const [journalName, setJournalName] = useState(
    thesis.journalName || (thesis.graduationTrack === 'Jurnal' ? 'Jurnal Repositor (Informatika UMM)' : '')
  );
  const [journalUrl, setJournalUrl] = useState(thesis.journalUrl || '');
  const [journalReviewNotes, setJournalReviewNotes] = useState(thesis.journalReviewNotes || '');

  // Common Defense Status & Student Notes
  const [selectedDefenseStatus, setSelectedDefenseStatus] = useState<DefenseStatus>(thesis.defenseStatus);
  const [studentNotes, setStudentNotes] = useState('');
  
  // Real file upload state (simulated PDF)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>({
    name: selectedTrack === 'Skripsi'
      ? `Draft_${selectedChapter.replace(' ', '')}_${thesis.studentName.replace(/\s+/g, '')}.pdf`
      : `Artikel_Jurnal_${thesis.studentName.replace(/\s+/g, '')}.pdf`,
    size: '2.8 MB'
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFile({
        name: file.name,
        size: `${sizeMB} MB`
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLogChapter: ChapterStage = selectedTrack === 'Skripsi' ? selectedChapter : 'Bab 5';
    const logDesc = selectedTrack === 'Skripsi'
      ? studentNotes.trim() || `Pengajuan perbaikan dan kemajuan penulisan untuk ${selectedChapter}.`
      : studentNotes.trim() || `Pembaruan status manuskrip publikasi jurnal ke tahap: ${selectedJournalStage} (${journalName || 'Jurnal UMM'}).`;

    const newLog = {
      id: `log-${Date.now()}`,
      thesisId: thesis.id,
      chapter: newLogChapter,
      submissionDate: formattedDate,
      fileName: uploadedFile?.name || (selectedTrack === 'Skripsi' ? `Draft_${selectedChapter}.pdf` : 'Naskah_Jurnal.pdf'),
      fileSize: uploadedFile?.size || '2.4 MB',
      studentNotes: logDesc,
      status: 'Menunggu Review' as const,
      version: (thesis.logs?.length || 0) + 1
    };

    const updatedThesis: Thesis = {
      ...thesis,
      graduationTrack: selectedTrack,
      currentChapter: selectedTrack === 'Skripsi' ? selectedChapter : (selectedJournalStage === 'Accepted/Published' ? 'Pasca Sidang' : 'Bab 4'),
      journalStage: selectedTrack === 'Jurnal' ? selectedJournalStage : undefined,
      journalName: selectedTrack === 'Jurnal' ? (journalName.trim() || undefined) : undefined,
      journalUrl: selectedTrack === 'Jurnal' ? (journalUrl.trim() || undefined) : undefined,
      journalReviewNotes: selectedTrack === 'Jurnal' ? (journalReviewNotes.trim() || undefined) : undefined,
      journalPaperFileName: selectedTrack === 'Jurnal' ? uploadedFile?.name : undefined,
      defenseStatus: selectedDefenseStatus,
      lastUpdate: now.toISOString().split('T')[0],
      logs: [newLog, ...(thesis.logs || [])]
    };

    onUpdateThesis(updatedThesis);
    setIsSuccess(true);
    setStudentNotes('');

    setTimeout(() => {
      setIsSuccess(false);
      onNavigateTab('logs');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Form Pembaruan Progres Bimbingan & Naskah
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih jalur kelulusan Anda (Skripsi vs Jurnal), perbarui tahapan kemajuan, dan unggah berkas naskah terbaru.
              </p>
            </div>
          </div>

          {/* Current Track Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="text-slate-400 font-normal">Jalur Terpilih:</span>
            <span className={selectedTrack === 'Jurnal' ? 'text-violet-700 font-bold' : 'text-indigo-700 font-bold'}>
              {selectedTrack}
            </span>
          </div>
        </div>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>
            Progres berhasil diperbarui! Berkas dan catatan baru telah dicatat pada Log Bimbingan untuk diverifikasi dosen. Mengalihkan ke riwayat log...
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        
        {/* === PILIHAN JALUR KELULUSAN (SKRIPSI VS JURNAL) === */}
        <div className="space-y-3 pb-5 border-b border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            Pilih Jalur Kelulusan Tugas Akhir
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Skripsi */}
            <button
              type="button"
              onClick={() => setSelectedTrack('Skripsi')}
              className={`p-4 rounded-2xl text-left border transition relative flex items-start gap-3.5 ${
                selectedTrack === 'Skripsi'
                  ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${selectedTrack === 'Skripsi' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Jalur Skripsi</span>
                  {selectedTrack === 'Skripsi' && (
                    <span className="text-[10px] uppercase font-bold tracking-wide bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Penyusunan naskah laporan tugas akhir bab demi bab (Bab 1 sampai Bab 5), dilanjutkan Ujian Sidang Skripsi.
                </p>
              </div>
            </button>

            {/* Option 2: Jurnal */}
            <button
              type="button"
              onClick={() => setSelectedTrack('Jurnal')}
              className={`p-4 rounded-2xl text-left border transition relative flex items-start gap-3.5 ${
                selectedTrack === 'Jurnal'
                  ? 'bg-violet-50/70 border-violet-500 ring-2 ring-violet-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${selectedTrack === 'Jurnal' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Newspaper className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Jalur Publikasi Jurnal</span>
                  {selectedTrack === 'Jurnal' && (
                    <span className="text-[10px] uppercase font-bold tracking-wide bg-violet-600 text-white px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Publikasi karya ilmiah pada Jurnal Nasional Terakreditasi (SINTA) atau Konferensi Internasional terindeks.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KONDISIONAL: JALUR SKRIPSI (Form Unggah Progres Berdasarkan Bab)          */}
        {/* ========================================================================= */}
        {selectedTrack === 'Skripsi' && (
          <div className="space-y-6 animate-in fade-in">
            {/* 1. Pilih Bab */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                1. Pilih Tahapan Bab yang Diajukan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {CHAPTER_ORDER.map((stage) => {
                  const isSelected = selectedChapter === stage;
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setSelectedChapter(stage)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition text-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {stage}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500">
                Pilih bab yang baru saja Anda selesaikan atau revisi untuk dievaluasi oleh Ir. Syaifuddin S.Kom., M.Kom.
              </p>
            </div>

            {/* 2. Upload Dokumen Bab */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                2. Unggah Dokumen Draft Naskah {selectedChapter} (PDF / DOCX)
              </label>

              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-6 bg-slate-50/60 hover:bg-indigo-50/20 transition text-center relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="p-3 bg-white rounded-full shadow-xs text-indigo-600">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Klik untuk memilih berkas naskah {selectedChapter} atau seret ke sini
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Format: PDF atau DOCX (Maksimal 25 MB per dokumen)
                  </p>
                </div>
              </div>

              {uploadedFile && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">{uploadedFile.name}</span>
                    <span className="text-slate-500 text-[11px]">({uploadedFile.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Hapus file terpilih"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* KONDISIONAL: JALUR JURNAL (Dropdown Status Jurnal: Draft, Submit, Revisi,   */}
        {/* Accepted/Published)                                                       */}
        {/* ========================================================================= */}
        {selectedTrack === 'Jurnal' && (
          <div className="space-y-6 animate-in fade-in">
            {/* 1. Dropdown Status Jurnal */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-violet-600" />
                1. Status Progres Manuskrip Jurnal
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Draft', 'Submit', 'Revisi', 'Accepted/Published'] as JournalStage[]).map((stage) => {
                  const isSelected = selectedJournalStage === stage;
                  const colors = {
                    Draft: isSelected ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50/50 text-amber-800 border-amber-200',
                    Submit: isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50/50 text-blue-800 border-blue-200',
                    Revisi: isSelected ? 'bg-orange-600 text-white border-orange-600' : 'bg-orange-50/50 text-orange-800 border-orange-200',
                    'Accepted/Published': isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50/50 text-emerald-800 border-emerald-200'
                  };

                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setSelectedJournalStage(stage)}
                      className={`p-3.5 rounded-xl border text-center transition font-bold text-xs ${colors[stage]} shadow-xs`}
                    >
                      <div className="text-xs">{stage}</div>
                      <div className="text-[10px] font-normal opacity-85 mt-0.5">
                        {stage === 'Draft' && 'Penyusunan Artikel'}
                        {stage === 'Submit' && 'Terkirim ke Redaksi'}
                        {stage === 'Revisi' && 'Revisi Reviewer'}
                        {stage === 'Accepted/Published' && 'Diterima / Terbit'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dropdown fallback selector */}
              <select
                value={selectedJournalStage}
                onChange={(e) => setSelectedJournalStage(e.target.value as JournalStage)}
                className="w-full mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              >
                <option value="Draft">Draft (Penulisan manuskrip artikel sesuai template jurnal)</option>
                <option value="Submit">Submit (Naskah sudah dikirim ke redaksi OJS jurnal)</option>
                <option value="Revisi">Revisi (Menerima hasil review dan sedang melakukan perbaikan)</option>
                <option value="Accepted/Published">Accepted / Published (Memperoleh LOA resmi atau artikel terbit)</option>
              </select>
            </div>

            {/* 2. Informasi Nama Jurnal & URL Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Target / Nama Jurnal Ilmiah
                </label>
                <input
                  type="text"
                  value={journalName}
                  onChange={(e) => setJournalName(e.target.value)}
                  placeholder="Contoh: Jurnal Repositor UMM (SINTA 3) / Jurnal RESTI (SINTA 2)"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Tautan Sistem OJS / Tautan Submission
                </label>
                <input
                  type="url"
                  value={journalUrl}
                  onChange={(e) => setJournalUrl(e.target.value)}
                  placeholder="Contoh: https://repositor.umm.ac.id/index.php/repositor/author"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
            </div>

            {/* 3. Upload File Naskah Artikel / LOA */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-violet-600" />
                Unggah Berkas Naskah Artikel Jurnal / Surat Acceptance (LOA)
              </label>

              <div className="border-2 border-dashed border-slate-300 hover:border-violet-400 rounded-2xl p-6 bg-slate-50/60 hover:bg-violet-50/20 transition text-center relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="p-3 bg-white rounded-full shadow-xs text-violet-600">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Klik untuk memilih naskah artikel jurnal atau seret ke sini
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Format: PDF, DOCX (Sertakan file artikel atau lampiran LOA jika sudah Accepted)
                  </p>
                </div>
              </div>

              {uploadedFile && (
                <div className="p-3 bg-violet-50/70 border border-violet-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-violet-600" />
                    <span className="font-bold text-slate-800">{uploadedFile.name}</span>
                    <span className="text-slate-500 text-[11px]">({uploadedFile.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Hapus file terpilih"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Feedback Reviewer Jurnal (Jika Status Revisi / Submit) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Poin Komentar Reviewer / Riwayat Korespondensi Jurnal (Opsional)
              </label>
              <textarea
                rows={2}
                value={journalReviewNotes}
                onChange={(e) => setJournalReviewNotes(e.target.value)}
                placeholder="Salin poin revisi dari reviewer redaksi jurnal atau tanggapan perbaikan Anda..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
          </div>
        )}

        {/* === BAGIAN CATATAN UMUM & PERSIAPAN SIDANG === */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Sidang */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600" />
                Status Sidang / Ujian Tugas Akhir
              </label>
              <select
                value={selectedDefenseStatus}
                onChange={(e) => setSelectedDefenseStatus(e.target.value as DefenseStatus)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Belum Daftar">Belum Daftar Sidang</option>
                <option value="Siap Sidang">Siap Sidang (Berkas Naskah / Jurnal Siap)</option>
                <option value="Terjadwal Sidang">Terjadwal Sidang oleh Prodi Informatika</option>
                <option value="Lulus (Revisi)">Lulus dengan Catatan Revisi Penguji</option>
                <option value="Lulus Bebas Revisi">Lulus Bebas Revisi (Siap Yudisium)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700">Kebijakan SK Bimbingan:</span>{' '}
                Bimbingan dan pengisian presensi dapat berjalan lancar meskipun status Anda masih <em>Belum SK</em>. Pengajuan SK dapat dilakukan paralel melalui menu Upload SK.
              </div>
            </div>
          </div>

          {/* Catatan untuk Dosen */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Catatan Kemajuan / Pengantar untuk Dosen Pembimbing
            </label>
            <textarea
              rows={3}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Tuliskan poin-poin yang telah dikerjakan, kendala teknis eksperimen, atau bagian naskah yang membutuhkan arahan khusus dari Bapak Ir. Syaifuddin S.Kom., M.Kom..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>Kirim Pembaruan Progres ({selectedTrack})</span>
          </button>
        </div>
      </form>
    </div>
  );
};
