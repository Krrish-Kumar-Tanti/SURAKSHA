import React, { useEffect, useState } from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { checkBackendHealth } from '../../lib/api';

type BackendStatus = Awaited<ReturnType<typeof checkBackendHealth>>;

export function AdminPage() {
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      setStatus(await checkBackendHealth());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshStatus();
  }, []);

  return (
    <main className="min-h-[70vh] bg-[#F8F5EE] px-4 py-10 text-left text-[#1C1D1A] sm:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] px-3.5 py-1.5 text-xs font-medium text-[#444C3D]">
            <Shield className="h-3.5 w-3.5" />
            System administration
          </div>
          <h1 className="font-['Instrument_Serif'] text-4xl">Administration</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#55544E]">
            Check whether the application service is reachable.
          </p>
        </div>

        <section className="mb-5 rounded-2xl border border-[#E5DFD5] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Application service</h2>
              <p className="mt-1 text-sm text-[#55544E]">
                {isLoading
                  ? 'Checking the service…'
                  : status?.connected
                    ? `${status.service || 'Backend'} responded successfully.`
                    : 'The backend service is currently unreachable.'}
              </p>
              {status && (
                <p className="mt-2 text-xs text-[#706E66]">
                  Status: {status.status}{status.sih ? ` · ${status.sih}` : ''}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => void refreshStatus()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#DDD6C9] px-4 py-2 text-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Check again
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
