import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRiskLevel, calculateDurationMonths, calculateBottleneckPipeline, calculateSummaryStats, extractAngkatan, calculateMonthlyGuidanceTrends } from './rules.ts';
import { Thesis } from '../types/index.ts';

test('extractAngkatan correctly extracts 4 digits from NIM', () => {
  assert.equal(extractAngkatan('202310370311104'), '2023');
  assert.equal(extractAngkatan('202110370311495'), '2021');
  assert.equal(extractAngkatan('202210370311045'), '2022');
  assert.equal(extractAngkatan(''), 'Lainnya');
});

test('calculateDurationMonths computes accurate duration in months from approvedAt date', () => {
  // Approved on 2026-10-16, reference date 2026-10-22 (6 days ago)
  const duration16 = calculateDurationMonths('2026-10-16', '2026-10-22');
  assert.equal(duration16, 0.2);

  // Approved on 2026-10-21, reference date 2026-10-22 (1 day ago)
  const duration21 = calculateDurationMonths('2026-10-21', '2026-10-22');
  assert.equal(duration21, 0.0);

  // Pending student without approvedAt
  assert.equal(calculateDurationMonths(null, '2026-10-22'), 0);
});

test('calculateRiskLevel assigns Aman for clean state initial students', () => {
  assert.equal(calculateRiskLevel('Bab 1', 0.2), 'Aman');
  assert.equal(calculateRiskLevel('Belum Mulai', 0.0), 'Aman');
  assert.equal(calculateRiskLevel('Bab 1', 6.0), 'Kritis');
});

test('calculateBottleneckPipeline handles clean state without dividing by zero', () => {
  const cleanStateTheses: Thesis[] = [
    {
      id: '1',
      studentId: 's1',
      studentName: 'Adinda',
      nim: '104',
      email: 'adinda@student.umm.ac.id',
      avatar: '',
      title: 'Judul 1',
      titleStatus: 'Approved',
      approvedAt: '2026-10-16',
      abstract: '',
      cluster: 'Topik Implementatif Dasar',
      currentChapter: 'Bab 1',
      durationMonths: 0.2,
      startDate: '2026-10-16',
      skStatus: 'Belum SK',
      defenseStatus: 'Belum Daftar',
      graduationTrack: 'Skripsi',
      journalStage: 'Draft',
      journalStatus: 'Belum',
      lastUpdate: '2026-10-16',
      riskLevel: 'Aman',
      attendances: [],
      logs: [],
      milestones: []
    }
  ];

  const pipeline = calculateBottleneckPipeline(cleanStateTheses);
  const bab1 = pipeline.find(p => p.stage === 'Bab 1');
  assert.equal(bab1?.count, 1);
  assert.equal(bab1?.percentage, 100);
});

test('calculateMonthlyGuidanceTrends aggregates historical data and reacts to dynamic logs', () => {
  const trends = calculateMonthlyGuidanceTrends([], 'Semua', 6);
  assert.equal(trends.length, 6);
  assert.equal(trends[trends.length - 1].monthKey, '2026-10');

  // Verify that adding a thesis with an October log dynamically increments totalLogs in Oct
  const sampleTheses: Thesis[] = [
    {
      id: 'thesis-test-1',
      studentId: 'std-test-1',
      studentName: 'Budi Santoso',
      nim: '202310370311999',
      email: 'budi@student.umm.ac.id',
      avatar: 'BS',
      title: 'Deteksi Intrusi',
      titleStatus: 'Approved',
      approvedAt: '2026-10-16',
      abstract: '',
      cluster: 'Machine Learning & Zero-Day',
      currentChapter: 'Bab 1',
      durationMonths: 0.2,
      startDate: '2026-10-16',
      skStatus: 'Belum SK',
      defenseStatus: 'Belum Daftar',
      graduationTrack: 'Skripsi',
      lastUpdate: '2026-10-22',
      riskLevel: 'Aman',
      attendances: [],
      logs: [
        {
          id: 'log-1',
          thesisId: 'thesis-test-1',
          chapter: 'Bab 1',
          submissionDate: '2026-10-22 14:00',
          fileName: 'Bab1.pdf',
          fileSize: '1.2 MB',
          studentNotes: 'Revisi Bab 1',
          status: 'Disetujui (ACC)',
          version: 1
        }
      ],
      milestones: []
    }
  ];

  const updatedTrends = calculateMonthlyGuidanceTrends(sampleTheses, 'Semua', 6);
  const octBaseline = trends[trends.length - 1].totalLogs;
  const octUpdated = updatedTrends[updatedTrends.length - 1].totalLogs;
  assert.equal(octUpdated, octBaseline + 1);
  assert.equal(updatedTrends[updatedTrends.length - 1].accCount, trends[trends.length - 1].accCount + 1);
});
