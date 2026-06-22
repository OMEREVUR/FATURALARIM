import { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// Tüm uygulama verisi (müşteri, iş, iş tipleri) ve işlemleri burada.
// Veri yalnızca localStorage'da tutulur; hiçbir ağ isteği yapılmaz.
export function AppProvider({ children }) {
  const [customers, setCustomers] = useLocalStorage('itm_customers', []);
  const [jobs, setJobs] = useLocalStorage('itm_jobs', []);
  const [jobTypes, setJobTypes] = useLocalStorage('itm_jobTypes', []);

  // --- Müşteri işlemleri ---
  const addCustomer = useCallback((data) => {
    const customer = { id: uid(), ...data };
    setCustomers((prev) => [customer, ...prev]);
    return customer;
  }, [setCustomers]);

  const updateCustomer = useCallback((id, data) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data, id } : c)));
  }, [setCustomers]);

  const deleteCustomer = useCallback((id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setJobs((prev) => prev.filter((j) => j.customerId !== id));
  }, [setCustomers, setJobs]);

  const getCustomer = useCallback(
    (id) => customers.find((c) => c.id === id),
    [customers]);

  // --- İş işlemleri ---
  const addJob = useCallback((data) => {
    const job = { id: uid(), ...data };
    setJobs((prev) => [job, ...prev]);
    return job;
  }, [setJobs]);

  const updateJob = useCallback((id, data) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...data, id } : j)));
  }, [setJobs]);

  const deleteJob = useCallback((id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, [setJobs]);

  const toggleJobStatus = useCallback((id) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: j.status === 'paid' ? 'pending' : 'paid' }
          : j));
  }, [setJobs]);

  // Bir müşterinin işleri, tarihe göre yeniden eskiye.
  const jobsByCustomer = useCallback(
    (customerId) =>
      jobs
        .filter((j) => j.customerId === customerId)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [jobs]);

  // Bir müşterinin bekleyen (ödenmemiş) toplam borcu.
  const customerBalance = useCallback(
    (customerId) =>
      jobs
        .filter((j) => j.customerId === customerId && j.status === 'pending')
        .reduce((sum, j) => sum + (Number(j.fee) || 0), 0),
    [jobs]);

  // --- İş tipleri ---
  const addJobType = useCallback((name) => {
    const t = String(name || '').trim();
    if (!t) return;
    setJobTypes((prev) =>
      prev.some((x) => x.toLowerCase() === t.toLowerCase()) ? prev : [...prev, t]);
  }, [setJobTypes]);

  const deleteJobType = useCallback((name) => {
    setJobTypes((prev) => prev.filter((x) => x !== name));
  }, [setJobTypes]);

  const value = useMemo(() => ({
    customers, jobs, jobTypes,
    addCustomer, updateCustomer, deleteCustomer, getCustomer,
    addJob, updateJob, deleteJob, toggleJobStatus, jobsByCustomer, customerBalance,
    addJobType, deleteJobType,
  }), [
    customers, jobs, jobTypes,
    addCustomer, updateCustomer, deleteCustomer, getCustomer,
    addJob, updateJob, deleteJob, toggleJobStatus, jobsByCustomer, customerBalance,
    addJobType, deleteJobType,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp, AppProvider içinde kullanılmalı');
  return ctx;
}
