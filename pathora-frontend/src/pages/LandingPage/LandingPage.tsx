import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  // Intersection Observer untuk animasi scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#FAF9F4] text-[#1b1c19] font-sans selection:bg-[#061B0E] selection:text-white">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#FAF9F4]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300 border-b border-[#e9e8e3]">
        <div className="flex justify-between items-center px-6 md:px-16 py-5 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-2xl font-bold text-[#061B0E] tracking-tight"
          >
            Path'Ora
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <a
              href="#process"
              className="text-sm uppercase tracking-widest text-[#737973] font-medium hover:text-[#061B0E] transition-colors"
            >
              Process
            </a>
            <a
              href="#analysis"
              className="text-sm uppercase tracking-widest text-[#737973] font-medium hover:text-[#061B0E] transition-colors"
            >
              Analysis
            </a>
           
          </div>

          {/* Call to Action Button */}
          <Link
            to="/login"
            className="bg-[#061B0E] text-[#ffffff] px-7 py-3 text-sm font-medium uppercase tracking-widest hover:bg-[#0a2012] transition-all duration-300 active:scale-95 text-center shadow-lg shadow-[#061B0E]/10"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-28">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center px-6 md:px-16 py-12 md:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full">
            {/* Teks Hero */}
            <div className="md:col-span-7 z-10 pr-0 md:pr-10">
              <span className="text-sm text-[#061B0E] font-medium uppercase tracking-[0.2em] mb-6 block scroll-reveal">
                Professional Exclusivity
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-[4rem] text-[#061B0E] mb-8 leading-[1.1] font-semibold tracking-tight scroll-reveal">
                Navigate Your Career with <br className="hidden md:block" />{" "}
                <span className="italic font-light">AI Precision</span>
              </h1>
              <p className="text-lg md:text-xl text-[#434843] mb-10 max-w-xl leading-relaxed scroll-reveal">
                In-depth CV analysis to discover the professional path that best aligns with your potential. Beyond keywords, we read ambition.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 scroll-reveal">
                <Link to="/login" className="bg-[#061B0E] text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-[#0a2012] transition-all active:scale-95 shadow-xl shadow-[#061B0E]/15">
                  Start Analysis Now
                </Link>
                
                <button className="border border-[#c3c8c1] bg-transparent text-[#061B0E] px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-[#f5f4ef] transition-all active:scale-95">
                  Explore Methodology
                </button>
              </div>
            </div>

            {/* Gambar Hero */}
            <div className="md:col-span-5 relative mt-12 md:mt-0 scroll-reveal">
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                  alt="Path'Ora Workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#061B0E]/10 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#cfe9d3] rounded-full blur-[80px] opacity-60 -z-10"></div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section
          id="process"
          className="bg-[#f5f4ef] py-24 px-6 md:px-16 border-y border-[#e9e8e3]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#061B0E] mb-6 scroll-reveal">
                The Path'Ora Process
              </h2>
              <div className="h-px w-20 bg-[#061B0E]/20 mx-auto scroll-reveal"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="bg-white p-10 lg:p-12 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#e9e8e3] group scroll-reveal">
                <div className="w-14 h-14 flex items-center justify-center bg-[#061B0E] text-white rounded-full mb-8 text-sm font-semibold">
                  01
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#061B0E] mb-4 uppercase tracking-tight">
                  Upload
                </h3>
                <p className="text-[#434843] text-base leading-relaxed mb-8 min-h-[80px]">
                  Submit your professional document into our secure ecosystem. We accept globally standard CV formats.
                </p>
                <div className="flex items-center text-[#061B0E] text-sm font-bold uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all gap-2">
                  Start Upload <span className="text-lg">→</span>
                </div>
              </div>
              {/* Step 2 */}
              <div className="bg-white p-10 lg:p-12 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#e9e8e3] group scroll-reveal">
                <div className="w-14 h-14 flex items-center justify-center bg-[#061B0E] text-white rounded-full mb-8 text-sm font-semibold">
                  02
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#061B0E] mb-4 uppercase tracking-tight">
                  Analysis
                </h3>
                <p className="text-[#434843] text-base leading-relaxed mb-8 min-h-[80px]">
                  Our AI extracts not only experience, but also core competencies, leadership style, and latent potential.
                </p>
                <div className="flex items-center text-[#061B0E] text-sm font-bold uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all gap-2">
                  View AI Demo <span className="text-lg">→</span>
                </div>
              </div>
              {/* Step 3 */}
              <div className="bg-white p-10 lg:p-12 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#e9e8e3] group scroll-reveal">
                <div className="w-14 h-14 flex items-center justify-center bg-[#061B0E] text-white rounded-full mb-8 text-sm font-semibold">
                  03
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#061B0E] mb-4 uppercase tracking-tight">
                  Recommendations
                </h3>
                <p className="text-[#434843] text-base leading-relaxed mb-8 min-h-[80px]">
                  Get a personally curated career roadmap, complete with the most relevant industry opportunities.
                </p>
                <div className="flex items-center text-[#061B0E] text-sm font-bold uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all gap-2">
                  Sample Results <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Prop / Bento Grid Section */}
        <section id="analysis" className="py-24 px-6 md:px-16 bg-[#FAF9F4]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Large Feature (Atas Kiri) */}
              <div className="col-span-1 md:col-span-8 bg-[#061B0E] text-white p-10 lg:p-14 rounded-3xl flex flex-col justify-between min-h-[380px] scroll-reveal">
                <div>
                  <span className="text-xs lg:text-sm text-[#819985] uppercase tracking-[0.2em] mb-6 block font-semibold">
                    Applied NLP Technology
                  </span>
                  <h2 className="font-serif text-4xl lg:text-5xl mb-6 leading-tight font-semibold">
                    Intelligence for Your Future
                  </h2>
                  <p className="text-base lg:text-lg text-[#cfe9d3] max-w-2xl leading-relaxed opacity-90">
                    We use advanced Natural Language Processing to examine every nuance in your career history, ensuring our guidance is not just algorithmic, but a reflection of your true ambition.
                  </p>
                </div>
                <div className="mt-10 flex items-center gap-6">
                  <span className="w-16 h-px bg-white/20"></span>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#b4cdb8]">
                    Optimized for Leadership Roles
                  </p>
                </div>
              </div>

              {/* Small Feature 1 - Privacy (Atas Kanan) */}
              <div className="col-span-1 md:col-span-4 bg-[#e9e8e3] p-10 lg:p-12 rounded-3xl flex flex-col justify-end min-h-[380px] scroll-reveal">
                <div className="mb-auto">
                  <div className="w-12 h-12 rounded-full border border-[#061B0E]/20 flex items-center justify-center mb-8">
                     <span className="text-xl">🔒</span>
                  </div>
                </div>
                <h4 className="font-serif text-2xl font-semibold text-[#061B0E] mb-3">
                  Absolute Privacy
                </h4>
                <p className="text-[#434843] leading-relaxed">
                  Your data is protected with bank-grade encryption and used exclusively for your personal profile analysis.
                </p>
              </div>

              {/* Small Feature 2 - Testimonial (Bawah Kiri) */}
              <div className="col-span-1 md:col-span-4 bg-white p-10 lg:p-12 rounded-3xl border border-[#e9e8e3] flex flex-col justify-center min-h-[380px] scroll-reveal">
                <div className="flex items-center gap-1 mb-8 text-[#061B0E]">
                  ★ ★ ★ ★ ★
                </div>
                <p className="font-serif italic text-2xl leading-snug text-[#061B0E] mb-8">
                  "Path'Ora opened a new perspective on my career that I had never recognized before."
                </p>
                <div className="mt-auto">
                  <span className="w-8 h-px bg-[#061B0E]/20 block mb-4"></span>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#737973]">
                    Senior Strategy Director
                  </p>
                </div>
              </div>

              {/* Small Feature 3 - Image (Bawah Kanan) */}
              <div className="col-span-1 md:col-span-8 relative rounded-3xl overflow-hidden min-h-[380px] scroll-reveal group">
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200"
                  alt="Collaborative Intelligence"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061B0E]/90 via-[#061B0E]/30 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10">
                  <p className="text-white font-serif text-2xl lg:text-3xl font-medium tracking-wide">
                    Synergy between human intuition and machine precision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-6 text-center border-t border-[#e9e8e3]">
          <div className="max-w-3xl mx-auto scroll-reveal">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#061B0E] mb-6">
              Ready to Start a New Chapter?
            </h2>
            <p className="text-lg md:text-xl text-[#434843] mb-12 leading-relaxed">
              The first step toward a more aligned future is just one upload away. Join our curated professional network.
            </p>
            <Link
              to="/login"
              className="inline-block bg-[#061B0E] text-white px-12 py-5 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#0a2012] transition-all active:scale-95 shadow-2xl shadow-[#061B0E]/20"
            >
              Analyze My Profile
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white w-full border-t border-[#e9e8e3]">
        <div className="flex flex-col md:flex-row justify-between items-center py-10 px-6 md:px-16 max-w-7xl mx-auto gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-serif text-2xl font-bold text-[#061B0E]">
              Path'Ora
            </span>
            <p className="text-[#737973] text-sm">
              © 2024 Path'Ora. Elevating Professional Journeys.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#terms" className="text-sm text-[#434843] hover:text-[#061B0E] transition-colors">
              Terms of Service
            </a>
            <a href="#privacy" className="text-sm text-[#434843] hover:text-[#061B0E] transition-colors">
              Privacy Policy
            </a>
            <a href="#access" className="text-sm text-[#434843] hover:text-[#061B0E] transition-colors">
              Institutional Access
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
