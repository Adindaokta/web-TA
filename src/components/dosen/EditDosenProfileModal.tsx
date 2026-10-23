import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { DosenProfile } from '../../types/index.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';

interface EditDosenProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  dosen: DosenProfile;
  onSaveProfile: (updatedProfile: DosenProfile) => void;
}

export const EditDosenProfileModal: React.FC<EditDosenProfileModalProps> = ({
  isOpen,
  onClose,
  dosen,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<DosenProfile>(dosen);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...dosen,
        phone: dosen.phone || '0812-3388-9021',
        room: dosen.room || 'Ruang Dosen Informatika Lt. 3 / Lab Keamanan Siber GKB III',
        expertise: dosen.expertise || 'Keamanan Siber, Deteksi Intrusi (IDS/DDoS), Honeypot, IoT Security, Machine Learning',
        officeHours: dosen.officeHours || 'Senin & Rabu: 09:00 - 12:00 WIB (Lab Siber), Kamis: 13:00 - 15:30 WIB',
        academicBio: dosen.academicBio || 'Dosen dan Peneliti di bidang Cyber Security & Network Engineering Informatika UMM.'
      });
      setIsSaved(false);
      setErrorMessage('');
    }
  }, [isOpen, dosen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof DosenProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Nama lengkap dan gelar dosen wajib diisi.');
      return;
    }
    if (!formData.nip.trim()) {
      setErrorMessage('NIP Dosen wajib diisi.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Alamat email resmi wajib diisi.');
      return;
    }

    // Auto-update initials avatar if name changes
    const initials = formData.name
      .replace(/(Ir\.|S\.Kom\.|M\.Kom\.|IPM|ASEAN Eng|,)/g, '')
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase() || 'IS';

    const finalizedProfile: DosenProfile = {
      ...formData,
      avatar: initials
    };

    onSaveProfile(finalizedProfile);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <UserCheck className="h-5 w-5" />
            </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  Edit Profil Lengkap Dosen Pembimbing
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Perbarui data identitas akademik, kontak resmi, laboratorium, dan bidang keahlian bimbingan.
                </p>
              </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Tutup Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSaved ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Profil Dosen Berhasil Disimpan!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Perubahan identitas, kontak bimbingan, dan laboratorium telah diperbarui secara menyeluruh di sistem.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs">
                {errorMessage}
              </div>
            )}

            {/* Profile Avatar & Primary Identity Preview Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                  {formData.avatar || 'IS'}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {formData.name || 'Ir. Syaifuddin S.Kom., M.Kom.'}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                    <span>NIP. {formData.nip}</span>
                    <span>&bull;</span>
                    <span className="text-indigo-600 font-bold">{formData.title}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                Inisial Avatar Teks (Anti-Dummy Photo)
              </div>
            </div>

            {/* Section 1: Data Identitas Akademik */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
                1. Identitas Akademik & Kepegawaian
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap beserta Gelar Akademik & Sertifikasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Contoh: Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIP / NIDN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => handleChange('nip', e.target.value)}
                    placeholder="10816120590PNS"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jabatan / Peran Pembimbing
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Dosen Pembimbing Skripsi / Lektor Kepala"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Program Studi & Fakultas
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    placeholder="Program Studi Informatika, Fakultas Teknik"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Perguruan Tinggi
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    placeholder="Universitas Muhammadiyah Malang (UMM)"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Kontak & Ruang Kerja */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
                2. Kontak Komunikasi & Lokasi Bimbingan
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-indigo-600" /> Email Resmi Institusi *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="syaifuddin@umm.ac.id"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" /> No. WhatsApp / HP Aktif
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="0812-3388-9021"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-600" /> Laboratorium & Ruang Bimbingan Utama
                  </label>
                  <input
                    type="text"
                    value={formData.lab}
                    onChange={(e) => handleChange('lab', e.target.value)}
                    placeholder="Laboratorium Keamanan Siber & Jaringan Komputer Informatika UMM"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-600" /> Ruang Kerja / Kantor Dosen
                  </label>
                  <input
                    type="text"
                    value={formData.room || ''}
                    onChange={(e) => handleChange('room', e.target.value)}
                    placeholder="Ruang Dosen Informatika Lt. 3 / Lab Keamanan Siber GKB III"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Bidang Keahlian, Jam Konsultasi & Bio */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-1">
                3. Fokus Riset & Jadwal Konsultasi (Office Hours)
              </span>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-600" /> Bidang Keahlian / Klaster Riset Utama
                </label>
                <input
                  type="text"
                  value={formData.expertise || ''}
                  onChange={(e) => handleChange('expertise', e.target.value)}
                  placeholder="Keamanan Siber, Deteksi Intrusi (IDS/DDoS), Honeypot, IoT Security, Machine Learning"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-sky-600" /> Jadwal Konsultasi / Jam Tatap Muka Lab
                </label>
                <input
                  type="text"
                  value={formData.officeHours || ''}
                  onChange={(e) => handleChange('officeHours', e.target.value)}
                  placeholder="Senin & Rabu: 09:00 - 12:00 WIB (Lab Siber), Kamis: 13:00 - 15:30 WIB"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-600" /> Bio Akademik Singkat & Petunjuk Mahasiswa
                </label>
                <textarea
                  rows={2}
                  value={formData.academicBio || ''}
                  onChange={(e) => handleChange('academicBio', e.target.value)}
                  placeholder="Petunjuk khusus bagi mahasiswa bimbingan tugas akhir..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs resize-none"
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Profil Dosen</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
