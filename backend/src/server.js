import app from './app.js';
import env, { validateEnv } from './config/env.js';
import pool from './config/db.js';

const { warnings, errors } = validateEnv();
warnings.forEach((w) => console.warn(`[env] WARNING: ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`[env] ERROR: ${e}`));
  console.error('[env] Konfigurasi tidak lengkap. Server tetap start, namun fitur DB mungkin gagal.');
}

const server = app.listen(env.port, () => {
  console.log(`\nPath'Ora API berjalan di http://localhost:${env.port}`);
  console.log(`  Environment : ${env.nodeEnv}`);
  console.log(`  AI provider : ${env.aiProvider}`);
  console.log(`  Health      : http://localhost:${env.port}/api/v1/health\n`);
});

// --- Graceful shutdown (mencegah koneksi DB menggantung) ---
async function shutdown(signal) {
  console.log(`\n[server] ${signal} diterima, menutup server ...`);
  server.close(async () => {
    try {
      await pool.end();
    } catch {
      /* abaikan */
    }
    process.exit(0);
  });
}

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

// Jaring pengaman: jangan biarkan unhandled error meng-crash diam-diam.
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught Exception:', err);
});

export default server;
