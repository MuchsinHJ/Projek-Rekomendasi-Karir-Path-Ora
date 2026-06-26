import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import { useProfile } from "../../hooks/useProfile";

const ProfilePage: React.FC = () => {
  const { user, analyses, isLoading, error } = useProfile();
  const confidenceScores = analyses
    .map((analysis) => Number(analysis.confidence))
    .filter((confidence) => Number.isFinite(confidence));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 md:p-10 text-gray-600">Loading profile...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-6 md:p-10 text-red-500">{error}</div>
      </AppLayout>
    );
  }

  const averageConfidence =
    confidenceScores.length > 0
      ? Math.round(
          (confidenceScores.reduce((acc, confidence) => acc + confidence, 0) /
            confidenceScores.length) *
            100,
        )
      : 0;

  return (
    <AppLayout>
      {/* Container utama: Padding px-4 untuk mobile, px-10 untuk desktop */}
      <div className="pathora-profile-page min-h-screen bg-[#F7F6F2] px-3 sm:px-5 lg:px-10 pt-4 lg:pt-0 pb-8 font-['Newsreader']">
        <div className="mb-5 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-['Newsreader'] text-gray-900 leading-tight">
            Profile
          </h1>
        </div>

        <div className="max-w-7xl mx-auto lg:px-10">
          {/* Card Profil User */}
          <div className="pathora-profile-card bg-white rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm mb-6 sm:mb-8 lg:mb-16">
            {/* Flex-col untuk mobile (menumpuk tengah), Flex-row untuk desktop (menyamping) */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 lg:gap-8">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#102619] text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() ?? "P"}
                </div>
              )}

              <div className="mt-2 sm:mt-0 min-w-0">
                <h2 className="font-['Newsreader'] text-xl sm:text-2xl lg:text-3xl font-bold text-[#102619] break-words">
                  {user?.name}
                </h2>
                <p className="text-[#9A7A57] mt-1 lg:mt-2 text-xs sm:text-sm lg:text-lg font-['Manrope',_sans-serif] break-all">
                  {user?.email}
                </p>
                <p className="text-gray-400 mt-2 text-xs lg:text-sm hidden sm:block font-['Manrope',_sans-serif]">
                  Joined on{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Section Riwayat Analisis */}
          <div className="pathora-history-card bg-white rounded-xl shadow-sm p-4 sm:p-5 lg:p-7 mt-5 lg:mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-5 lg:mb-6">
              <h2 className="font-['Newsreader'] text-lg sm:text-xl lg:text-2xl font-bold text-[#102619]">
                Analysis History
              </h2>
              {/* Teks "VIEW ALL ->" untuk mobile menyesuaikan gambar, atau Total Analisis untuk Desktop */}
              <div className="text-[10px] sm:text-xs lg:text-sm font-bold uppercase tracking-widest text-gray-500 font-['Manrope',_sans-serif]">
                <span className="hidden sm:inline">Total Analyses: {analyses.length}</span>
                <span className="sm:hidden flex items-center gap-1 cursor-pointer">View All &rarr;</span>
              </div>
            </div>

            {analyses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 font-['Manrope',_sans-serif] text-sm">No analysis history yet.</p>
              </div>
            ) : (
              <>
                {/* --- 1. TAMPILAN MOBILE (Card View) --- */}
                {/* Menyesuaikan persis dengan gambar, disembunyikan di layar besar (md:hidden) */}
                <div className="grid grid-cols-1 gap-3 sm:hidden font-['Manrope',_sans-serif]">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="pathora-history-mobile-card bg-[#F9FAFB] rounded-2xl p-4 flex flex-col gap-4">
                      {/* Baris Atas: Tanggal & Status */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {analysis.created_at
                            ? new Date(analysis.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                            analysis.status === "success" 
                              ? "bg-[#E3F0E6] text-[#2F6B43]"
                              : "bg-[#EAEAEA] text-[#555555]"
                          }`}
                        >
                          {analysis.status === "success"
                            ? "Success"
                            : analysis.status === "pending"
                            ? "Processing"
                            : "Failed"}
                        </span>
                      </div>

                      {/* Baris Bawah: Target Role & Skor */}
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                            Target Role
                          </p>
                          <p className="font-bold text-[#102619] text-sm leading-snug">
                            {analysis.predicted_category}
                          </p>
                        </div>
                        <div className="font-['Newsreader'] text-2xl font-bold text-[#102619] leading-none">
                          {Number.isFinite(Number(analysis.confidence))
                            ? Math.round(Number(analysis.confidence) * 100)
                            : 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- 2. TAMPILAN TABLET & DESKTOP (Table View) --- */}
                {/* Disembunyikan di mobile (hidden md:block) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="pathora-history-table w-full min-w-[640px]">
                    <thead>
                      <tr className="border-t border-b border-gray-200">
                        <th className="py-3 lg:py-4 text-left text-[10px] lg:text-xs uppercase tracking-widest text-gray-500 font-medium font-['Manrope',_sans-serif]">
                          Date
                        </th>
                        <th className="py-3 lg:py-4 text-left text-[10px] lg:text-xs uppercase tracking-widest text-gray-500 font-medium font-['Manrope',_sans-serif]">
                          Target Role
                        </th>
                        <th className="py-3 lg:py-4 text-center text-[10px] lg:text-xs uppercase tracking-widest text-gray-500 font-medium font-['Manrope',_sans-serif]">
                          Score
                        </th>
                        <th className="py-3 lg:py-4 text-right text-[10px] lg:text-xs uppercase tracking-widest text-gray-500 font-medium font-['Manrope',_sans-serif]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyses.map((analysis) => (
                        <tr
                          key={analysis.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 lg:py-4 text-gray-700 font-['Manrope',_sans-serif] text-xs lg:text-sm">
                            {analysis.created_at
                              ? new Date(analysis.created_at).toLocaleDateString("en-US")
                              : "-"}
                          </td>
                          <td className="py-3 lg:py-4 text-gray-900 font-medium font-['Manrope',_sans-serif] text-xs lg:text-sm">
                            {analysis.predicted_category}
                          </td>
                          <td className="py-3 lg:py-4 text-center">
                            <span className="font-['Newsreader'] text-xl lg:text-2xl font-bold text-[#102619]">
                              {Number.isFinite(Number(analysis.confidence))
                                ? Math.round(Number(analysis.confidence) * 100)
                                : 0}
                            </span>
                          </td>
                          <td className="py-3 lg:py-4 text-right">
                            <span
                              className={`px-3 lg:px-4 py-2 rounded-full text-[10px] lg:text-xs font-bold tracking-wider uppercase font-['Manrope',_sans-serif] ${
                                analysis.status === "success"
                                  ? "bg-green-100 text-green-900"
                                  : analysis.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {analysis.status === "success"
                                ? "Success"
                                : analysis.status === "pending"
                                ? "Processing"
                                : "Failed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Bagian Rata-Rata */}
            {analyses.length > 0 && (
              <div className="mt-6 lg:mt-8 flex justify-center sm:justify-end">
                <div className="pathora-confidence-summary bg-[#F7F6F2] rounded-xl px-5 sm:px-6 py-4 w-full sm:w-auto text-center sm:text-left border border-gray-100">
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 font-bold uppercase tracking-wider font-['Manrope',_sans-serif]">
                    Average Confidence
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold font-['Newsreader'] text-[#102619] mt-1">
                    {averageConfidence}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
