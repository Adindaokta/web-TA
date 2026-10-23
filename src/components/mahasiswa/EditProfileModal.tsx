import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  MapPin, 
  HeartHandshake, 
  Calendar, 
  BookOpen,
  Info,
  Hash
} from 'lucide-react';
import { Thesis } from '../../types/index.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';

export interface StudentProfileUpdatePayload {
  nim?: string;
  studentName?: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  targetGraduationSemester?: string;
  bioNotes?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  thesis: Thesis;
  onSaveProfile: (studentId: string, updatedData: StudentProfileUpdatePayload) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  thesis,
  onSaveProfile
}) => {
  const [nim, setNim] = useState(thesis.nim || '');
  const [studentName, setStudentName] = useState(thesis.studentName || '');
  const [email, setEmail] = useState(thesis.email || '');
  const [phone, setPhone] = useState(thesis.phone || '');
  const [address, setAddress] = useState(thesis.address || '');
  const [emergencyContactName, setEmergencyContactName] = useState(thesis.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(thesis.emergencyContactPhone || '');
  const [targetGraduationSemester, setTargetGraduationSemester] = useState(thesis.targetGraduationSemester || 'Semester 7 (Ganjil 2026/2027)');
  const [bioNotes, setBioNotes] = useState(thesis.bioNotes || '');

  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNim(thesis.nim || '');
      setStudentName(thesis.studentName || '');
      setEmail(thesis.email || '');
      setPhone(thesis.phone || '');
      setAddress(thesis.address || '');
      setEmergencyContactName(thesis.emergencyContactName || '');
      setEmergencyContactPhone(thesis.emergencyContactPhone || '');
      setTargetGraduationSemester(thesis.targetGraduationSemester || 'Semester 7 (Ganjil 2026/2027)');
      setBioNotes(thesis.bioNotes || '');
      setIsSaved(false);
      setErrorMessage('');
    }
  }, [isOpen, thesis]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim.trim()) {
      setErrorMessage('Nomor Induk Mahasiswa (NIM) wajib diisi.');
      return;
    }
    if (!studentName.trim()) {
      setErrorMessage('Nama lengkap mahasiswa tidak boleh kosong.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Alamat email aktif wajib diisi.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Nomor WhatsApp / HP wajib diisi.');
      return;
    }

    onSaveProfile(thesis.id, {
      nim: nim.trim(),
      studentName: studentName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      targetGraduationSemester: targetGraduationSemester.trim(),
      bioNotes: bioNotes.trim()
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Edit Profil Mahasiswa & Pengaturan NIM
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Perbarui NIM (Username login), identitas nama, kontak, domisili, dan rencana kelulusan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSaved ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Profil & NIM Berhasil Diperbarui!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Username login Anda telah disinkronkan dengan NIM baru <strong>{nim}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs">
                {errorMessage}
              </div>
            )}

            {/* Read-only Academic Summary Banner */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <UserAvatar name={studentName || thesis.studentName} size="md" shape="rounded" />
                <div>
                  <div className="font-extrabold text-sm text-slate-900">
                    {studentName || thesis.studentName}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span>NIM: {nim || thesis.nim}</span>
                    <span>&bull;</span>
                    <span className="text-indigo-600 font-bold">Jalur {thesis.graduationTrack || 'Skripsi'}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                {thesis.cluster}
              </div>
            </div>

            {/* Section 1: Identitas Pokok & NIM (Username Dinamis) */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
                1. Kredensial Login & Identitas Pokok
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* NIM INPUT (MANDAT: EDIT NIM MEMPENGARUHI USERNAME LOGIN) */}
                <div className="sm:col-span-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1.5">
                  <label className="block font-bold text-indigo-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-indigo-600" />
                      Nomor Induk Mahasiswa (NIM) *
                    </span>
                    <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded">
                      Username Login Dinamis
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 202310370311104"
                    className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                  <p className="text-[10px] text-indigo-700 leading-tight">
                    *Karena login menggunakan NIM, jika Anda mengubah NIM di sini, username untuk login berikutnya otomatis berubah mengikuti NIM baru ini.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap Mahasiswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Sesuai nama di KTM / Ijazah"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-indigo-600" /> Alamat Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@student.umm.ac.id"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Untuk notifikasi revisi & jadwal sempro
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" /> No. WhatsApp / HP Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Kontak konsultasi lab Informatika UMM
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Domisili & Kontak Darurat */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
                2. Domisili di Malang & Kontak Darurat
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-600" /> Alamat Domisili / Kos di Malang
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jl. Tirto Utomo No. 12, Dau, Malang"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <HeartHandshake className="h-3.5 w-3.5 text-amber-600" /> Nama Kontak Darurat (Orang Tua / Wali)
                  </label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="Contoh: Bpk. H. Sukardi (Ayah)"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-amber-600" /> No. HP Kontak Darurat
                  </label>
                  <input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="Contoh: 0813-9876-5432"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Rencana Akademik & Catatan */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
                3. Rencana Kelulusan & Catatan Bimbingan
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-600" /> Target Semester Kelulusan
                  </label>
                  <select
                    value={targetGraduationSemester}
                    onChange={(e) => setTargetGraduationSemester(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold"
                  >
                    <option value="Semester 7 (Ganjil 2026/2027)">Semester 7 (Ganjil 2026/2027)</option>
                    <option value="Semester 8 (Genap 2026/2027)">Semester 8 (Genap 2026/2027)</option>
                    <option value="Semester 9 (Ganjil 2027/2028)">Semester 9 (Ganjil 2027/2028)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-teal-600" /> Catatan Tambahan Mahasiswa
                  </label>
                  <input
                    type="text"
                    value={bioNotes}
                    onChange={(e) => setBioNotes(e.target.value)}
                    placeholder="Contoh: Fokus publikasi SINTA 2 / repositor UMM"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Profil & NIM</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
