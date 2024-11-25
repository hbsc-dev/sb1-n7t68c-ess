import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ServiceForm from './components/ServiceForm';
import ServiceTable from './components/ServiceTable';
import StatsPage from './components/StatsPage';
import PreferencesPage from './components/PreferencesPage';
import SettingsPage from './components/SettingsPage';
import CompletedTasksPage from './components/CompletedTasksPage';
import PartsPage from './components/PartsPage';
import BottomNav from './components/BottomNav';
import Auth from './components/Auth';
import { useStore } from './store/useStore';

function ServicePage() {
  const { records, addRecord, updateRecordStatus } = useStore();
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="space-y-8 pb-20">
      <ServiceForm onSubmit={addRecord} />
      
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Service Records</h2>
        {records.length > 0 ? (
          <ServiceTable 
            records={records} 
            onStatusChange={updateRecordStatus}
            showCompleted={showCompleted}
            onToggleShowCompleted={() => setShowCompleted(!showCompleted)}
          />
        ) : (
          <div className="modern-card p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No service records yet. Add a new record to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const { initialize } = useStore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      initialize();
    }
  }, [initialize, user]);

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<ServicePage />} />
            <Route path="/completed" element={<CompletedTasksPage />} />
            <Route path="/parts" element={<PartsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/admin" element={<SettingsPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}