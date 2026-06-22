import { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import StatCard from '../components/StatCard';
import PeriodPicker from '../components/PeriodPicker';
import { formatCurrency } from '../utils/format';
import { shiftPeriod, isInPeriod } from '../utils/period';

export default function Dashboard() {
  const { customers, jobs } = useApp();
  const [periodType, setPeriodType] = useState('month'); // 'month' | 'year'
  const [refDate, setRefDate] = useState(new Date());

  const stats = useMemo(() => {
    const inPeriod = jobs.filter((j) => isInPeriod(j.date, refDate, periodType));
    const earned = inPeriod
      .filter((j) => j.status === 'paid')
      .reduce((s, j) => s + (Number(j.fee) || 0), 0);
    // Bekleyen alacak dönemden bağımsız: tüm ödenmemiş işler.
    const pendingAll = jobs
      .filter((j) => j.status === 'pending')
      .reduce((s, j) => s + (Number(j.fee) || 0), 0);
    return {
      customerCount: customers.length,
      jobCount: inPeriod.length,
      earned,
      pendingAll,
    };
  }, [customers, jobs, refDate, periodType]);

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Özet</h1>
      </header>

      <div className="segmented">
        <button
          className={periodType === 'month' ? 'active' : ''}
          onClick={() => setPeriodType('month')}
        >
          Aylık
        </button>
        <button
          className={periodType === 'year' ? 'active' : ''}
          onClick={() => setPeriodType('year')}
        >
          Yıllık
        </button>
      </div>

      <div className="period-nav">
        <button
          className="icon-btn"
          onClick={() => setRefDate((d) => shiftPeriod(d, periodType, -1))}
          aria-label="Önceki dönem"
        >
          ‹
        </button>
        <PeriodPicker
          refDate={refDate}
          periodType={periodType}
          onChange={setRefDate}
        />
        <button
          className="icon-btn"
          onClick={() => setRefDate((d) => shiftPeriod(d, periodType, 1))}
          aria-label="Sonraki dönem"
        >
          ›
        </button>
      </div>

      <div className="stat-grid">
        <StatCard label="Toplam Müşteri" value={stats.customerCount} accent="brand" />
        <StatCard label="Dönemdeki İş Adedi" value={stats.jobCount} accent="brand" />
        <StatCard label="Kazanılan Tutar" value={formatCurrency(stats.earned)} accent="success" />
        <StatCard label="Toplam Bekleyen Alacak" value={formatCurrency(stats.pendingAll)} accent="danger" />
      </div>

      <p className="hint">
        "Toplam Bekleyen Alacak", seçili dönemden bağımsız olarak sistemdeki tüm
        ödenmemiş işlerin toplamını gösterir.
      </p>
    </div>
  );
}
