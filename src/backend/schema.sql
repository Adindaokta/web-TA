-- =====================================================================
-- SKRIPSITRACK SIM-TA SINGLE-TENANT DATABASE SCHEMA (POSTGRESQL / MYSQL)
-- Dosen Pembimbing: Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng (NIP. 10816120590PNS)
-- Program Studi Informatika, Fakultas Teknik, Universitas Muhammadiyah Malang (UMM)
-- =====================================================================

-- 1. Tabel Dosen Pembimbing (Single-Tenant: 1 Master Dosen Pembimbing)
CREATE TABLE IF NOT EXISTS dosen (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nip VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    institution VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    lab VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Mahasiswa Bimbingan
-- Jalur Migrasi: 35 akun awal di-generate dengan password bawaan 'bimbingan123'
-- must_change_password bernilai TRUE sampai mahasiswa mengganti password saat login perdana.
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    nim VARCHAR(25) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    must_change_password BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Tugas Akhir / Skripsi
-- Aturan Bisnis Super-Ketat:
-- - status_sk ('Belum SK' | 'Sudah SK') BUKAN blocker bimbingan. Mahasiswa judul ACC langsung bisa bimbingan & presensi.
-- - Seluruh 35 mahasiswa di hari ke-1 berstatus status_sk = 'Belum SK'.
-- - rumpun_riset: 6 klaster resmi riset pembimbing.
-- - jalur_kelulusan: 'Skripsi' (Bab 1 - 5) atau 'Jurnal' (Draft, Submit, Revisi, Accepted/Published).
-- - Filter Angkatan: Diekstrak otomatis dari 4 digit awal NIM (SUBSTRING(nim FROM 1 FOR 4)).
CREATE TABLE IF NOT EXISTS theses (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    dosen_id VARCHAR(50) NOT NULL REFERENCES dosen(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    title_status VARCHAR(30) NOT NULL DEFAULT 'Pending',   -- 'Approved', 'Pending', 'Perlu Revisi'
    approved_at DATE NULL,                                 -- Tanggal ACC Judul (Basis hitung argo durasi kelulusan)
    rumpun_riset VARCHAR(100) NOT NULL CHECK (rumpun_riset IN (
        'Honeypot & Akuisisi Data',
        'Dataset & Rekayasa Fitur',
        'Machine Learning & Zero-Day',
        'Deep Reinforcement Learning',
        'Edge, Mitigasi & Kajian',
        'Topik Implementatif Dasar'
    )),
    jalur_kelulusan VARCHAR(30) NOT NULL DEFAULT 'Skripsi' CHECK (jalur_kelulusan IN ('Skripsi', 'Jurnal')),
    current_chapter VARCHAR(30) NOT NULL DEFAULT 'Bab 1' CHECK (current_chapter IN ('Belum Mulai', 'Bab 1', 'Bab 2', 'Bab 3', 'Bab 4', 'Bab 5', 'Pasca Sidang')),
    status_sk VARCHAR(30) NOT NULL DEFAULT 'Belum SK' CHECK (status_sk IN ('Belum SK', 'Sudah SK')),
    sk_number VARCHAR(100) NULL,
    sk_date DATE NULL,
    sk_file_url VARCHAR(255) NULL,
    defense_status VARCHAR(50) NOT NULL DEFAULT 'Belum Daftar',
    journal_stage VARCHAR(50) NULL CHECK (journal_stage IN ('Draft', 'Submit', 'Revisi', 'Accepted/Published')),
    journal_name VARCHAR(255) NULL,
    journal_url VARCHAR(255) NULL,
    risk_level VARCHAR(30) NOT NULL DEFAULT 'Aman' CHECK (risk_level IN ('Aman', 'Waspada', 'Kritis')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Presensi Bimbingan
CREATE TABLE IF NOT EXISTS attendances (
    id VARCHAR(50) PRIMARY KEY,
    thesis_id VARCHAR(50) NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    attendance_time VARCHAR(20) NULL,
    method VARCHAR(50) NOT NULL,                           -- 'Offline (Lab/Tatap Muka)', 'Online (Google Meet/Zoom)'
    topic_plan TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Menunggu Verifikasi' CHECK (status IN ('Menunggu Verifikasi', 'Hadir (Diverifikasi)', 'Ditolak')),
    dosen_notes TEXT NULL,
    verified_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Log Naskah / Unggahan Bab Skripsi
CREATE TABLE IF NOT EXISTS chapter_logs (
    id VARCHAR(50) PRIMARY KEY,
    thesis_id VARCHAR(50) NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    chapter VARCHAR(30) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    student_notes TEXT NOT NULL,
    dosen_feedback TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Menunggu Review' CHECK (status IN ('Menunggu Review', 'Perlu Revisi', 'Disetujui (ACC)')),
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Usulan Perubahan Judul (Title Change Requests)
CREATE TABLE IF NOT EXISTS title_change_requests (
    id VARCHAR(50) PRIMARY KEY,
    thesis_id VARCHAR(50) NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    current_title TEXT NOT NULL,
    proposed_title TEXT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Disetujui', 'Ditolak')),
    dosen_notes TEXT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Calon Pendaftar Bimbingan Baru (Jalur B / Public Landing Page)
CREATE TABLE IF NOT EXISTS new_applicants (
    id VARCHAR(50) PRIMARY KEY,
    nim VARCHAR(25) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    proposed_title TEXT NOT NULL,
    cluster VARCHAR(100) NOT NULL,
    proposal_summary TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Diterima', 'Ditolak')),
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance dashboard querying & filtering
CREATE INDEX IF NOT EXISTS idx_theses_student_id ON theses(student_id);
CREATE INDEX IF NOT EXISTS idx_theses_status_sk ON theses(status_sk);
CREATE INDEX IF NOT EXISTS idx_theses_title_status ON theses(title_status);
CREATE INDEX IF NOT EXISTS idx_theses_jalur_kelulusan ON theses(jalur_kelulusan);
CREATE INDEX IF NOT EXISTS idx_theses_rumpun_riset ON theses(rumpun_riset);
CREATE INDEX IF NOT EXISTS idx_attendances_thesis_id ON attendances(thesis_id);
CREATE INDEX IF NOT EXISTS idx_chapter_logs_thesis_id ON chapter_logs(thesis_id);
