'use client';

import { useState, useEffect } from 'react';
import { Loader2, Lock, Cpu } from 'lucide-react';
import AdminLayout from './components/AdminLayout';
import { errorText, readJson } from '@/lib/clientApi';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const checkAuth = async () => {
      try {
        const data = await readJson<{ isAuthenticated: boolean }>(await fetch('/api/admin/check', { cache: 'no-store', signal: controller.signal }));
        if (!controller.signal.aborted) setIsAuthenticated(data.isAuthenticated === true);
      } catch {
        // A missing or expired session returns to the login form.
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void checkAuth();
    return () => controller.abort();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await readJson<{ success: boolean; error?: string }>(res);
      if (data.success) {
        setIsAuthenticated(true); setPassword('');
      } else {
        setLoginError(data.error || 'Incorrect admin password');
      }
    } catch (cause) {
      setLoginError(errorText(cause));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    const response = await fetch('/api/admin/login', { method: 'DELETE' });
    await readJson(response);
    setIsAuthenticated(false); setPassword('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <Loader2 className="animate-spin text-[#1a3a5c]" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafaf8]">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 max-w-sm w-full text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1a3a5c] text-white flex items-center justify-center mx-auto shadow-md">
            <Cpu className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-[#1a1a1a]">Synapse Seller Desk</h1>
            <p className="text-xs text-gray-500">Enter your admin password to manage products and orders.</p>
          </div>

          {loginError && (
            <div role="alert" className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label htmlFor="admin-password" className="text-xs font-bold text-gray-700 block mb-1">Admin Password</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-[#1a3a5c]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-[#1a3a5c] hover:bg-[#0f2a45] disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              <span>Login to Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminLayout onLogout={handleLogout} />;
}
