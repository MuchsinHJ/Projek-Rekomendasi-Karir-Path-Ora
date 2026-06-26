import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

const NotFoundContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const primaryTarget = isAuthenticated ? "/dashboard" : "/login";
  const primaryLabel = isAuthenticated ? "Go to Home" : "Go to Sign In";

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#8FB399]/25 text-[#102619] dark:bg-[#8FB399]/15 dark:text-[#d1d5d1]">
          <SearchX size={42} strokeWidth={1.8} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#2A4033] dark:text-[#8FB399]">
          404 Not Found
        </p>
        <h1 className="font-['Newsreader'] text-4xl font-bold text-gray-900 dark:text-[#d1d5d1] sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600 dark:text-[#d1d5d1]/75 sm:text-base">
          The route you requested is unavailable or has been moved. Please
          return to the main Path`Ora app page.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={primaryTarget}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#102619] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1a3a26] dark:bg-[#8FB399] dark:text-[#051B0F] dark:hover:bg-[#b7d6c2] sm:w-auto"
          >
            <Home size={18} />
            {primaryLabel}
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#8FB399]/70 bg-white px-5 py-3 text-sm font-semibold text-[#102619] transition hover:bg-[#eef5ef] dark:border-[#8FB399]/40 dark:bg-[#0B2A18] dark:text-[#d1d5d1] dark:hover:bg-[#123720] sm:w-auto"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>
    </section>
  );
};

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-[#F4F9F4] text-gray-900 dark:bg-[#051B0F]">
      <NotFoundContent />
    </main>
  );
};

export default NotFoundPage;
