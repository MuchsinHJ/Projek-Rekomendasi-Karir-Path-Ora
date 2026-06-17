import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import {
  AlertTriangle,
  CheckCircle,
  LoaderCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCVUpload } from "../../hooks/useCVUpload";
import { useAnalysis } from "../../hooks/useAnalysis";
import { cvService } from "../../services/cv.service";
import { parseApiError } from "../../utils/error";

type UploadedCvMetadata = {
  cvId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
};

const UPLOADED_CV_METADATA_KEY = "pathora-uploaded-cv-metadata";

const formatFileSize = (size: number) => {
  if (!Number.isFinite(size) || size <= 0) return "-";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getStoredUploadedMetadata = (): UploadedCvMetadata | null => {
  const storedMetadata = localStorage.getItem(UPLOADED_CV_METADATA_KEY);
  if (!storedMetadata) return null;

  try {
    const metadata = JSON.parse(storedMetadata) as UploadedCvMetadata;
    if (metadata.cvId && metadata.fileName) return metadata;
  } catch {
    localStorage.removeItem(UPLOADED_CV_METADATA_KEY);
  }

  return null;
};

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedCvId, setUploadedCvId] = useState<string | null>(null);
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [hasAiConsent, setAiConsent] = useState(false);
  const [uploadedMetadata, setUploadedMetadata] =
    useState<UploadedCvMetadata | null>(null);
  const [isCancellingAnalysis, setCancellingAnalysis] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [pendingReplacementFile, setPendingReplacementFile] =
    useState<File | null>(null);
  const [isReplaceConfirmOpen, setReplaceConfirmOpen] = useState(false);
  const [isReplacingFile, setReplacingFile] = useState(false);
  const [replaceError, setReplaceError] = useState<string | null>(null);
  const {
    uploadCV,
    isLoading,
    progress,
    error,
    resetState: resetUploadState,
  } = useCVUpload();
  const { analyzeCV, isAnalyzing, error: analyzeError } = useAnalysis();

  useEffect(() => {
    const metadata = getStoredUploadedMetadata();
    if (metadata) {
      setUploadedCvId(metadata.cvId);
      setUploadedMetadata(metadata);
    }
  }, []);

  useEffect(() => {
    const syncUploadedMetadata = () => {
      const metadata = getStoredUploadedMetadata();
      setUploadedMetadata((currentMetadata) => {
        if (
          currentMetadata?.cvId === metadata?.cvId &&
          currentMetadata?.fileName === metadata?.fileName &&
          currentMetadata?.fileSize === metadata?.fileSize &&
          currentMetadata?.uploadedAt === metadata?.uploadedAt
        ) {
          return currentMetadata;
        }

        return metadata;
      });
      setUploadedCvId((currentCvId) => {
        if (metadata?.cvId) return metadata.cvId;
        return currentCvId && !selectedFile ? null : currentCvId;
      });
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === UPLOADED_CV_METADATA_KEY) {
        syncUploadedMetadata();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", syncUploadedMetadata);

    const intervalId = window.setInterval(syncUploadedMetadata, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", syncUploadedMetadata);
      window.clearInterval(intervalId);
    };
  }, [selectedFile]);

  const persistUploadedMetadata = (metadata: UploadedCvMetadata) => {
    localStorage.setItem(UPLOADED_CV_METADATA_KEY, JSON.stringify(metadata));
    setUploadedMetadata(metadata);
  };

  const clearUploadedMetadata = () => {
    localStorage.removeItem(UPLOADED_CV_METADATA_KEY);
    setUploadedMetadata(null);
  };

  const runAnalysis = async (cvId: string) => {
    setAnalysisFailed(false);
    setFeedbackOpen(true);
    const analysisResult = await analyzeCV(cvId);

    if (analysisResult?.id) {
      clearUploadedMetadata();
      navigate(`/analysis/${analysisResult.id}`);
      return;
    }

    setAnalysisFailed(true);
  };

  const resetUploadFlow = () => {
    setSelectedFile(null);
    setUploadedCvId(null);
    setAnalysisFailed(false);
    setAiConsent(false);
    setCancelError(null);
    clearUploadedMetadata();
    setFeedbackOpen(false);
    resetUploadState();
    setFileInputKey((current) => current + 1);
    navigate("/upload", { replace: true });
  };

  const uploadSelectedFile = async (file: File) => {
    setSelectedFile(file);
    setUploadedCvId(null);
    setAnalysisFailed(false);
    setAiConsent(false);
    setCancelError(null);
    setReplaceError(null);
    clearUploadedMetadata();
    setFeedbackOpen(false);

    const uploadResult = await uploadCV({
      source_type: "file",
      file,
    });

    if (!uploadResult) {
      setFeedbackOpen(true);
      return;
    }

    setUploadedCvId(uploadResult.id);
    persistUploadedMetadata({
      cvId: uploadResult.id,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    });
    setFeedbackOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const existingMetadata = uploadedMetadata ?? getStoredUploadedMetadata();

    if (existingMetadata?.cvId) {
      setUploadedMetadata(existingMetadata);
      setUploadedCvId(existingMetadata.cvId);
      setPendingReplacementFile(file);
      setReplaceConfirmOpen(true);
      setReplaceError(null);
      setFeedbackOpen(false);
      setFileInputKey((current) => current + 1);
      return;
    }

    await uploadSelectedFile(file);
  };

  const cancelReplaceFile = () => {
    if (isReplacingFile) return;
    setPendingReplacementFile(null);
    setReplaceConfirmOpen(false);
    setReplaceError(null);
  };

  const confirmReplaceFile = async () => {
    if (!pendingReplacementFile || !uploadedMetadata?.cvId || isReplacingFile) {
      return;
    }

    setReplacingFile(true);
    setReplaceError(null);

    try {
      await cvService.deleteCV(uploadedMetadata.cvId);
      const fileToUpload = pendingReplacementFile;
      setPendingReplacementFile(null);
      setReplaceConfirmOpen(false);
      await uploadSelectedFile(fileToUpload);
    } catch (error) {
      setReplaceError(parseApiError(error));
    } finally {
      setReplacingFile(false);
    }
  };

  const cancelAnalysisAndDeleteCv = async () => {
    if (!uploadedCvId || isCancellingAnalysis || isAnalyzing) return;

    setCancellingAnalysis(true);
    setCancelError(null);

    try {
      await cvService.deleteCV(uploadedCvId);
      resetUploadFlow();
    } catch (error) {
      setCancelError(parseApiError(error));
    } finally {
      setCancellingAnalysis(false);
    }
  };

  const isProcessing =
    isLoading || isAnalyzing || isCancellingAnalysis || isReplacingFile;
  const errorMessage = error || analyzeError;
  const showFeedbackModal =
    isFeedbackOpen && (!!errorMessage || (!!uploadedCvId && !error));
  const isAnalyzeError = analysisFailed && !!uploadedCvId;
  const isUploadError = !!error && !isAnalyzeError;
  const shouldShowConsent =
    !!uploadedCvId &&
    !errorMessage &&
    !isAnalyzing &&
    !analysisFailed &&
    !isCancellingAnalysis;
  const feedbackTitle = errorMessage
    ? isAnalyzeError
      ? "Analisis AI gagal diproses"
      : "Unggah CV gagal"
    : isAnalyzing
      ? "Analisis CV sedang berjalan"
      : shouldShowConsent
        ? "Persetujuan Analisis AI"
        : "CV berhasil diunggah";
  const feedbackMessage = errorMessage
    ? errorMessage
    : isAnalyzing
      ? "Sistem sedang membaca CV, mengekstrak skill, dan menghitung rekomendasi karir. Proses ini dapat memakan waktu beberapa saat."
      : shouldShowConsent
        ? "Path`Ora akan menggunakan AI untuk membaca dan menganalisis CV Anda, termasuk prediksi kategori karir, skill yang terdeteksi, skill yang perlu ditingkatkan, dan rekomendasi karir.\n\nData CV digunakan hanya untuk proses analisis dan menampilkan hasil kepada Anda."
        : analysisFailed
          ? "File sudah tersimpan, tetapi analisis gagal. Silakan unggah file lagi untuk memulai analisis baru."
          : "CV sudah tersimpan dan hasil analisis siap ditampilkan.";

  return (
    <AppLayout>
      {/* Header - Menggunakan padding responsif pengganti ml-10 */}
      <div className="mb-6 md:mb-7 px-4 md:px-10 mt-4 md:mt-0">
        <h1 className="text-2xl md:text-3xl font-bold font-['Newsreader'] text-gray-900">
          Unggah CV
        </h1>
        <p className="text-gray-600 mt-2 text-sm font-['Manrope',_sans-serif]">
          Kirimkan riwayat profesional Anda untuk memulai analisis mendalam.
          Sistem kami menguraikan pengalaman Anda menjadi informasi karier yang
          dapat ditindaklanjuti.
        </p>
      </div>

      {/* Container utama dibungkus padding agar sejajar dengan header di mobile */}
      <div className="px-4 md:px-10 pb-8">
        <div className="w-full max-w-2xl mx-auto mb-5 rounded-2xl border border-[#8FB399]/40 bg-[#8FB399]/15 p-5 font-['Manrope',_sans-serif] text-[#102619] dark:border-[#8FB399]/25 dark:bg-[#0B2A18] dark:text-[#d1d5d1]">
          <h2 className="font-['Newsreader'] text-xl font-semibold">
            Pemberitahuan Format CV
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-[#d1d5d1]/80">
            Pastikan CV yang Anda unggah menggunakan format ATS-friendly dan
            hanya terdiri dari 1 kolom agar sistem dapat membaca serta
            menganalisis isi CV dengan lebih akurat.
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-[#d1d5d1]/80">
            Hindari penggunaan desain kompleks seperti tabel, grafik, ikon
            berlebihan, gambar, atau layout multi-kolom karena dapat mengganggu
            proses analisis AI.
          </p>
          <div className="mt-4 rounded-xl bg-white/75 p-4 text-sm leading-6 dark:bg-[#051B0F]/55">
            <p className="font-semibold text-[#102619] dark:text-[#8FB399]">
              Format yang disarankan:
            </p>
            <p className="mt-1 text-gray-700 dark:text-[#d1d5d1]/80">
              CV sederhana, rapi, berbasis teks, 1 kolom, dan mudah dibaca oleh
              sistem.
            </p>
          </div>
          <a
            href="https://foto.kontan.co.id/bvTNQQtkFQ3kBFTmpmipyNVLJNM=/smart/filters:format(webp)/2024/05/08/706731588.jpg"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#102619] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3a26] dark:bg-[#8FB399] dark:text-[#051B0F] dark:hover:bg-[#b7d6c2]"
          >
            Lihat Contoh Template CV ATS
          </a>
        </div>

        <div className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-white rounded-3xl border border-gray-200 font-['Newsreader']">
          <label
            htmlFor="file-upload"
            className="border border-dashed border-gray-400 rounded-3xl min-h-[280px] md:h-[340px] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition text-center"
          >
            {/* Ikon diperkecil sedikit di mobile */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center mb-6 md:mb-8 dark:bg-[#8FB399] dark:text-[#051B0F]">
              <Upload className="w-6 h-6 md:w-8 md:h-8 text-[#102619] dark:text-[#051B0F]" />
            </div>

            <h2 className="text-2xl md:text-3xl mb-3 text-[#102619]">
              Unggah Dokumen Anda
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-md mb-6 md:mb-8">
              Format yang didukung: PDF dibawah 10MB. Pastikan dokumen tidak
              terkunci agar proses ekstraksi berjalan optimal.
            </p>

            <span className="bg-[#061B0E] text-white px-6 md:px-8 py-3 rounded-lg text-sm md:text-base font-medium">
              PILIH FILE
            </span>

            <input
              key={fileInputKey}
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              disabled={isProcessing || isReplaceConfirmOpen}
              onChange={handleFileChange}
            />
          </label>

          {selectedFile && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                File Dipilih
              </p>
              <p className="font-medium text-sm md:text-base text-[#102619] truncate">
                {selectedFile.name}
              </p>
            </div>
          )}

          {uploadedMetadata && !selectedFile && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                File Terakhir Diunggah
              </p>
              <p className="font-medium text-sm md:text-base text-[#102619] truncate">
                {uploadedMetadata.fileName}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {formatFileSize(uploadedMetadata.fileSize)} •{" "}
                {new Date(uploadedMetadata.uploadedAt).toLocaleString("id-ID")}
              </p>
            </div>
          )}

          {shouldShowConsent && !isFeedbackOpen && (
            <div className="mt-6 rounded-xl border border-emerald-100 bg-green-50 p-4">
              <p className="text-sm font-semibold text-[#102619]">
                CV berhasil diunggah
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Lanjutkan ke persetujuan analisis AI untuk memproses CV Anda.
              </p>
              <button
                type="button"
                onClick={() => setFeedbackOpen(true)}
                className="mt-3 rounded-lg bg-[#102619] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3a26]"
              >
                Lanjutkan Analisis
              </button>
              <button
                type="button"
                onClick={cancelAnalysisAndDeleteCv}
                disabled={isCancellingAnalysis}
                className="ml-0 mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-3"
              >
                {isCancellingAnalysis ? "Membatalkan..." : "Batalkan Analisis"}
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="mt-6">
              <div className="h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#102619] transition-all duration-300"
                  style={{ width: `${isAnalyzing ? 100 : progress}%` }}
                />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-2 font-['Manrope',_sans-serif]">
                {isAnalyzing
                  ? "Menganalisis CV..."
                  : `Mengunggah... ${progress}%`}
              </p>
            </div>
          )}
        </div>
      </div>

      {isReplaceConfirmOpen && pendingReplacementFile && uploadedMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0B2A18]">
            <button
              type="button"
              onClick={cancelReplaceFile}
              disabled={isReplacingFile}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#d1d5d1]/70 dark:hover:bg-[#123720] dark:hover:text-[#d1d5d1]"
              aria-label="Tutup konfirmasi"
            >
              <X size={18} />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8FB399]/25 text-[#102619] dark:bg-[#8FB399] dark:text-[#051B0F]">
              <Upload size={24} />
            </div>

            <h2 className="pr-8 text-xl md:text-2xl font-semibold font-['Newsreader'] text-[#102619] dark:text-[#d1d5d1]">
              Ganti file sebelumnya?
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 font-['Manrope',_sans-serif] dark:text-[#d1d5d1]/75">
              Anda masih memiliki CV yang sudah diunggah dan tersimpan di
              metadata. Apakah Anda ingin mengganti file sebelumnya dengan file
              baru yang dipilih?
            </p>

            <div className="mt-5 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#8FB399]/20 dark:bg-[#051B0F]/55">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#d1d5d1]/55">
                  File sebelumnya
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-[#102619] dark:text-[#d1d5d1]">
                  {uploadedMetadata.fileName}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#d1d5d1]/55">
                  File baru
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-[#102619] dark:text-[#d1d5d1]">
                  {pendingReplacementFile.name}
                </p>
              </div>
            </div>

            {replaceError && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
                {replaceError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelReplaceFile}
                disabled={isReplacingFile}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#8FB399]/30 dark:text-[#d1d5d1] dark:hover:bg-[#123720]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmReplaceFile}
                disabled={isReplacingFile}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#102619] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3a26] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#8FB399] dark:text-[#051B0F] dark:hover:bg-[#b7d6c2]"
              >
                {isReplacingFile && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {isReplacingFile ? "Mengganti..." : "Ganti File"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Feedback (Sudah cukup responsif, hanya memastikan padding aman di layar kecil) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setFeedbackOpen(false)}
              disabled={isAnalyzing}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Tutup pesan"
            >
              <X size={18} />
            </button>

            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                errorMessage
                  ? "bg-red-100"
                  : isAnalyzing
                    ? "bg-[#E8F5EA]"
                    : "bg-green-100"
              }`}
            >
              {errorMessage ? (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              ) : isAnalyzing ? (
                <LoaderCircle className="h-7 w-7 animate-spin text-[#102619]" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-700" />
              )}
            </div>

            <h2
              className={`pr-8 text-xl md:text-2xl font-semibold font-['Newsreader'] ${
                errorMessage ? "text-red-700" : "text-[#102619]"
              }`}
            >
              {feedbackTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 font-['Manrope',_sans-serif]">
              {feedbackMessage.split("\n").map((line, index) => (
                <React.Fragment key={`${line}-${index}`}>
                  {line}
                  {index < feedbackMessage.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>

            {shouldShowConsent && (
              <div className="mt-5">
                {uploadedMetadata && (
                  <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      File yang sudah diunggah
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-[#102619]">
                      {uploadedMetadata.fileName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatFileSize(uploadedMetadata.fileSize)}
                    </p>
                  </div>
                )}

                <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <input
                    type="checkbox"
                    checked={hasAiConsent}
                    onChange={(event) => setAiConsent(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#102619]"
                  />
                  <span className="text-sm leading-6 text-gray-700 font-['Manrope',_sans-serif]">
                    Saya menyetujui CV saya diproses menggunakan AI untuk
                    kebutuhan analisis karir di Path`Ora.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => runAnalysis(uploadedCvId)}
                  disabled={!hasAiConsent || isAnalyzing}
                  className="mt-4 w-full rounded-lg bg-[#102619] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1a3a26] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Setuju & Analisis CV
                </button>

                <button
                  type="button"
                  onClick={cancelAnalysisAndDeleteCv}
                  disabled={isCancellingAnalysis || isAnalyzing}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {isCancellingAnalysis
                    ? "Membatalkan..."
                    : "Batalkan Analisis & Hapus CV"}
                </button>

                {cancelError && (
                  <p className="mt-3 text-sm text-red-600">{cancelError}</p>
                )}
              </div>
            )}

            {isAnalyzing && (
              <div className="mt-5">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-[#102619]" />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#102619]" />
                    Membaca isi CV
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#102619]" />
                    Mengekstrak skill dan pengalaman
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#102619]" />
                    Menyusun prediksi karir
                  </div>
                </div>
              </div>
            )}

            {(isAnalyzeError || isUploadError) && (
              <button
                type="button"
                onClick={resetUploadFlow}
                disabled={isAnalyzing || isLoading}
                className="mt-5 w-full md:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-[#102619] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3a26] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload size={16} />
                Unggah File Lagi
              </button>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default UploadPage;
