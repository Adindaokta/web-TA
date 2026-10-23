import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Video, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Thesis, AttendanceRecord, AttendanceMethod } from '../../types/index.ts';

interface AttendanceViewProps {
  thesis: Thesis;
  onAddAttendance: (newRecord: Omit<AttendanceRecord, 'id' | 'status' | 'dosenNotes' | 'verifiedAt'>) => void;
  onNavigateTab: (tab: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  thesis,
  onAddAttendance,
  onNavigateTab
}) => {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('2026-10-22');
  const [time, setTime] = useState('10:00 WIB');
  const [method, setMethod] = useState<AttendanceMethod>('Offline (Lab/Tatap Muka)');
  const [topicPlan, setTopicPlan] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const attendances = thesis.attendances || [];
  const totalPresensi = attendances.length;
  const verifiedCount = attendances.filter(a => a.status === 'Hadir (Diverifikasi)').length;
  const pendingCount = attendances.filter(a => a.status === 'Menunggu Verifikasi').length;
  const rejectedCount = attendances.filter(a => a.status === 'Ditolak').length;
  const attendanceRate = totalPresensi > 0 ? Math.round((verifiedCount / totalPresensi) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicPlan.trim()) return;

    onAddAttendance({
      thesisId: thesis.id,
      studentId: thesis.studentId,
      studentName: thesis.studentName,
      nim: thesis.nim,
      date,
      time,
      method,
      topicPlan: topicPlan.trim()
    });

    setFormSuccess(true);
    setTopicPlan('');
    setTimeout(() => {
      setFormSuccess(false);
      setShowForm(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">
                Presensi & Log Kehadiran Bimbingan
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {thesis.studentName} ({thesis.nim})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Catat setiap sesi bimbingan tatap muka di lab atau online bersama Dosen Pembimbing (Ir. Syaifuddin S.Kom., M.Kom.)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start md:self-auto shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{showForm ? 'Tutup Formulir' : 'Isi Presensi Bimbingan'}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total Sesi Diajukan</span>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {totalPresensi} <span className="text-sm font-normal text-slate-500">Pertemuan</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Target minimal prodi: <strong className="text-slate-700">8 Sesi Bimbingan</strong>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Kehadiran Terverifikasi</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">
            {verifiedCount} <span className="text-sm font-normal text-slate-500">Sesi ACC</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Tingkat kehadiran: <strong className="text-emerald-700">{attendanceRate}%</strong>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Menunggu Verifikasi</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600">
            {pendingCount} <span className="text-sm font-normal text-slate-500">Sesi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Menunggu approval dosen pembimbing
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Status Judul Skripsi</span>
            <ShieldCheck className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 text-base font-extrabold text-slate-800">
            {thesis.titleStatus === 'Approved' ? (
              <span className="text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Judul Disetujui (ACC)
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" /> Menunggu Persetujuan
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {thesis.approvedAt ? `ACC: ${thesis.approvedAt}` : 'Belum divalidasi pembimbing'}
          </div>
        </div>
      </div>

      {/* Form Submission Modal/Section */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">
                Formulir Presensi Kehadiran Bimbingan
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Informatika UMM &bull; Ruang Dosen Pembimbing
            </span>
          </div>

          {formSuccess ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Presensi Berhasil Diajukan!</h3>
              <p className="text-xs text-slate-500">
                Data presensi bimbingan telah dikirim ke Dosen Pembimbing untuk diverifikasi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Bimbingan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waktu / Jam Sesi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Contoh: 10:00 WIB"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Metode Pertemuan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as AttendanceMethod)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Offline (Lab/Tatap Muka)">Offline (Tatap Muka di Informatika UMM / Ruang Dosen)</option>
                    <option value="Online (Google Meet/Zoom)">Online (Google Meet / Zoom)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rencana Topik / Pokok Bahasan Bimbingan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={topicPlan}
                  onChange={(e) => setTopicPlan(e.target.value)}
                  placeholder="Deskripsikan poin diskusi atau bab naskah yang dikonsultasikan (misal: review literatur dataset PCAP DDoS, penentuan parameter algoritma klasifikasi, validasi hasil eksperimen, dsb.)"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Kirim Presensi untuk Diverifikasi</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* History List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Riwayat Presensi Bimbingan Mahasiswa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar seluruh rekaman kehadiran konsultasi tugas akhir yang telah diajukan
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
            {attendances.length} Catatan
          </span>
        </div>

        {attendances.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">Belum Ada Riwayat Presensi</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Anda belum mengisi formulir presensi kehadiran bimbingan. Klik tombol "Isi Presensi Bimbingan" di atas setelah atau sebelum melaksanakan sesi bimbingan bersama dosen.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Isi Presensi Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {attendances.map((record) => (
              <div key={record.id} className="p-5 hover:bg-slate-50/80 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
                      <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{record.date}</span>
                      {record.time && <span className="text-slate-400 font-normal">&bull; {record.time}</span>}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      {record.method.includes('Offline') ? (
                        <span className="flex items-center gap-1 text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-sky-200">
                          <MapPin className="h-3 w-3" /> Offline (Informatika UMM)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-purple-200">
                          <Video className="h-3 w-3" /> Online Meet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {record.status === 'Hadir (Diverifikasi)' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Hadir & Terverifikasi
                      </span>
                    )}
                    {record.status === 'Menunggu Verifikasi' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="h-3.5 w-3.5" /> Menunggu Validasi Dosen
                      </span>
                    )}
                    {record.status === 'Ditolak' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="h-3.5 w-3.5" /> Kehadiran Ditolak
                      </span>
                    )}
                  </div>
                </div>

                {/* Topic Plan */}
                <div className="mt-3 text-xs text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-900 block mb-0.5">Topik / Bahasan Bimbingan:</span>
                  <p className="leading-relaxed">{record.topicPlan}</p>
                </div>

                {/* Dosen Notes if verified or rejected */}
                {record.dosenNotes && (
                  <div className="mt-2.5 flex items-start gap-2 bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900">
                    <MessageSquare className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Catatan Dosen (Ir. Syaifuddin S.Kom., M.Kom.):</span>
                        {record.verifiedAt && (
                          <span className="text-[10px] text-indigo-500 font-mono">
                            Diverifikasi pada {record.verifiedAt}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-indigo-800">{record.dosenNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
