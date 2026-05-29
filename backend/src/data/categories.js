/**
 * Data referensi kategori karir + skill bank.
 * Dipakai oleh:
 *  - seed.js  -> mengisi tabel categories
 *  - aiAdapter (mode mock) -> deteksi skill & klasifikasi
 *
 * Fokus proyek: IT & Data (sesuai batasan PRD), ditambah kategori lain
 * yang muncul pada API Contract (Engineering, Digital Media, Business, Finance).
 *
 * File ini SENGAJA tanpa dependency eksternal agar bisa dipakai mock adapter
 * secara standalone (mudah diuji tanpa database).
 */

export const CATEGORIES = [
  {
    code: 'INFORMATION-TECHNOLOGY',
    display_name: 'Information Technology',
    description:
      'Pengembangan perangkat lunak, infrastruktur, dan sistem informasi.',
    skills: [
      'Python',
      'JavaScript',
      'TypeScript',
      'Java',
      'SQL',
      'React',
      'Node.js',
      'Express',
      'Docker',
      'Kubernetes',
      'AWS',
      'Git',
      'REST API',
      'Linux',
    ],
  },
  {
    code: 'DATA-SCIENCE',
    display_name: 'Data Science',
    description:
      'Analisis data, machine learning, dan pemodelan statistik.',
    skills: [
      'Python',
      'Machine Learning',
      'Deep Learning',
      'TensorFlow',
      'PyTorch',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'Data Visualization',
      'Statistics',
      'SQL',
      'NLP',
    ],
  },
  {
    code: 'ENGINEERING',
    display_name: 'Engineering',
    description:
      'Rekayasa teknik (sipil, mekanikal, elektrikal) dan manajemen proyek.',
    skills: [
      'Machine Learning',
      'Data Science',
      'AutoCAD',
      'MATLAB',
      'Civil Engineering',
      'Mechanical Design',
      'Electrical Systems',
      'Project Management',
    ],
  },
  {
    code: 'DIGITAL-MEDIA',
    display_name: 'Digital Media',
    description:
      'Konten digital, desain visual, dan analitik media.',
    skills: [
      'Data Visualization',
      'Big Data Analytics',
      'Graphic Design',
      'Video Editing',
      'Content Writing',
      'SEO',
      'Adobe Photoshop',
      'Social Media',
    ],
  },
  {
    code: 'BUSINESS-DEVELOPMENT',
    display_name: 'Business Development',
    description:
      'Pengembangan bisnis, penjualan, dan hubungan pelanggan.',
    skills: [
      'Market Analysis',
      'Sales Strategy',
      'Negotiation',
      'Customer Relationship Management',
      'Business Planning',
      'Communication',
      'Lead Generation',
    ],
  },
  {
    code: 'FINANCE',
    display_name: 'Finance',
    description:
      'Keuangan, akuntansi, dan analisis investasi.',
    skills: [
      'Financial Modeling',
      'Investment Analysis',
      'Accounting',
      'Risk Management',
      'Financial Reporting',
      'Excel',
      'Budgeting',
    ],
  },
];

/** Map cepat: code -> display_name */
export const CATEGORY_DISPLAY = Object.fromEntries(
  CATEGORIES.map((c) => [c.code, c.display_name]),
);

export default CATEGORIES;
