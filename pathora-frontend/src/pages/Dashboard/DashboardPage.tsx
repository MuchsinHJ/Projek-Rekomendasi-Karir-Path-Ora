import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import SkorDashboard from "./SkorDashboard";
import UploadCv from "./UploadCv";
import Riwayat from "./Riwayat";
import { useDashboard } from "../../hooks/useDashboard";

const DashboardPage: React.FC = () => {
  const { summary, history, isLoading, error, refresh } = useDashboard();

  return (
    <AppLayout>
      {/* Container utama dengan padding responsif */}
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-['Newsreader'] text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm font-['Manrope',_sans-serif]">
            Welcome. Here is a summary of your progress and career readiness
            based on the latest data analysis.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <span className="font-bold">⚠️</span> {error}
          </div>
        )}

        {/* Grid untuk Skor dan Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-['Newsreader']">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-64 animate-pulse" />
          ) : (
            <SkorDashboard summary={summary} />
          )}
          <UploadCv />
        </div>

        {/* Section Riwayat */}
        <div>
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-sm text-gray-500 animate-pulse">
              Loading analysis history...
            </div>
          ) : (
            <Riwayat history={history} onDeleted={refresh} />
          )}
        </div>
        
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
