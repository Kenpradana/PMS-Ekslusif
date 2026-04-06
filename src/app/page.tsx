'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatRp } from '@/lib/utils';
import type { Package, BurialLocation } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import PackageModal from '@/components/PackageModal';

// ===== DATA (fetch di client karena butuh intersection observer) =====
function useCatalogData() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [locations, setLocations] = useState<BurialLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
          setError('Environment variable tidak ditemukan');
          return;
        }

        const [pkgRes, locRes] = await Promise.all([
          supabase.from('packages').select('*').order('sort_order', { ascending: true }),
          supabase.from('burial_locations').select('*').order('sort_order', { ascending: true }),
        ]);
        setPackages((pkgRes.data as Package[]) ?? []);
        setLocations((locRes.data as BurialLocation[]) ?? []);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { packages, locations, loading, error };
}

// ===== SCROLL REVEAL HOOK =====
function useReveal(ready: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const children = el.querySelectorAll('.reveal');
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [ready]);

  return ref;
}

// ===== COMPONENT =====
export default function CatalogPage() {
  const { packages, locations, loading, error } = useCatalogData();
  const mainRef = useReveal(!loading && !error);
  const [previewPkg, setPreviewPkg] = useState<Package | null>(null);

  if (loading) {
    return (
      <div className="relative z-[2] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-mute-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-mute-300 text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-[2] min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 border border-dark-500 rounded-full flex items-center justify-center mx-auto mb-5 text-mute-500 text-lg">
            <i className="fas fa-exclamation-triangle" />
          </div>
          <h2 className="font-serif text-xl text-white mb-3">Gagal Memuat Data</h2>
          <p className="text-sm text-mute-400 leading-relaxed mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-[#0a0a0a] rounded-lg text-[12px] font-semibold tracking-[1px] uppercase"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-[2]" ref={mainRef}>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-dark-400" id="navbar">
        <div className="max-w-[960px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* === LOGO: ganti src kalau sudah punya file sendiri === */}
            {/* Kalau pakai file: src="/logo.png" */}
            {/* Kalau pakai icon dulu: */}
            <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-full" />
            <span className="font-serif text-sm tracking-[2px] uppercase text-white">
              The Grand
            </span>
          </Link>
          <Link
            href="/order"
            className="px-5 py-2 border border-dark-500 rounded-lg text-[11px] tracking-[1.5px] uppercase text-mute-400 hover:border-mute-400 hover:text-white transition-all"
          >
            Pesan
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 border-b border-dark-400 relative">
        <div className="max-w-2xl">
          <p className="hero-anim-1 text-[10px] tracking-[6px] uppercase text-mute-500 mb-6">
            PMS Ekslusif Funeral Organizer Service
          </p>
          <h1 className="hero-anim-1 font-serif text-5xl sm:text-6xl md:text-7xl font-medium text-white leading-[1.1] mb-6">
            The<br />Grand
          </h1>
          <div className="hero-anim-2 h-px bg-mute-500 mx-auto mb-6" />
          <p className="hero-anim-3 text-mute-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-10">
            Mengantar ke peristirahatan terakhir dengan layanan yang penuh
            penghormatan, tenang, dan profesional.
          </p>
          <Link
            href="/order"
            className="hero-anim-4 inline-flex items-center gap-3 px-10 py-4 bg-white text-[#0a0a0a] rounded-lg text-[13px] font-semibold tracking-[1px] uppercase hover:bg-[#e0e0e0] hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-all"
          > 
            Mulai Pesan Sekarang
            <i className="fas fa-arrow-right text-xs" />
          </Link>
        </div>

        <div className="hero-anim-5 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[3px] uppercase text-mute-500">Scroll</span>
          <div className="w-px h-8 bg-dark-500 relative overflow-hidden">
            <div className="w-full h-3 bg-mute-400 scroll-dot" />
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-24 px-6 border-b border-dark-400">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: 'fas fa-hands-praying', title: 'Penghormatan', desc: 'Setiap detail kami tangani dengan penuh rasa hormat terhadap almarhum/ah dan keluarga.' },
            { icon: 'fas fa-shield-halved', title: 'Profesional', desc: 'Tim berpengalaman yang siap mengurus seluruh kebutuhan dari awal hingga selesai.' },
            { icon: 'fas fa-heart', title: 'Peduli', desc: 'Kami memahami bahwa ini adalah momen sulit. Kami ada untuk membantu meringankan beban.' },
          ].map((item, i) => (
            <div key={item.title} className={`reveal reveal-delay-${i + 1} text-center`}>
              <div className="w-12 h-12 border border-dark-500 rounded-full flex items-center justify-center mx-auto mb-5 text-mute-400">
                <i className={item.icon} />
              </div>
              <h3 className="font-serif text-lg text-white mb-3">{item.title}</h3>
              <p className="text-[13px] text-mute-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PACKAGES ===== */}
      <section className="py-24 px-6 border-b border-dark-400">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-[10px] tracking-[4px] uppercase text-mute-500 mb-3">
              Pilihan Paket
            </p>
            <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl font-medium text-white mb-4">
              Layanan Kami
            </h2>
            <p className="reveal reveal-delay-2 text-sm text-mute-400 max-w-md mx-auto leading-relaxed">
              Empat pilihan paket yang dirancang untuk berbagai kebutuhan,
              dari yang sederhana hingga pelayanan penuh VIP.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={pkg.id}
                className={`reveal reveal-delay-${Math.min(i + 1, 5)} card-shine border border-dark-400 rounded-xl overflow-hidden bg-dark-200 hover:border-dark-500 hover:bg-dark-300 transition-all duration-500 group`}
              >
                {/* Foto */}
                <div className="relative h-[260px] sm:h-[300px] overflow-hidden">
                  {pkg.image_url ? (
                    <Image
                      src={pkg.image_url}
                      alt={pkg.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
                      sizes="(max-width: 960px) 100vw, 960px"
                    />
                  ) : (
                    <div className="w-full h-full bg-dark-300 flex items-center justify-center">
                      <i className="fas fa-image text-3xl text-dark-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-dark-200/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[9px] tracking-[2px] uppercase px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-mute-200">
                      {pkg.badge}
                    </span>
                    {pkg.image_url && (
                      <button
                        onClick={() => setPreviewPkg(pkg)}
                        className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-mute-200 hover:text-white hover:border-white/30 transition-all"
                        title="Lihat dekorasi"
                      >
                        <i className="fas fa-expand text-[10px]" />
                      </button>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <span className="font-serif text-2xl sm:text-3xl font-semibold text-white drop-shadow-lg">
                      {formatRp(pkg.price)}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-white drop-shadow-lg">
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                {/* Detail */}
                <div className="p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 mb-6">
                    <ul className="space-y-2.5">
                      {pkg.features.slice(0, Math.ceil(pkg.features.length / 2)).map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[13px] text-mute-300 leading-snug">
                          <i className="fas fa-circle text-[6px] mt-[6px] flex-shrink-0 text-mute-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-2.5">
                      {pkg.features.slice(Math.ceil(pkg.features.length / 2)).map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[13px] text-mute-300 leading-snug">
                          <i className="fas fa-circle text-[6px] mt-[6px] flex-shrink-0 text-mute-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-dark-400">
                    <p className="text-[11px] text-mute-500">
                      Rumah duka: <span className="text-mute-300">{formatRp(pkg.day_cost)}/hari</span>
                    </p>
                    <Link
                      href="/order"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0a0a] rounded-lg text-[12px] font-semibold tracking-[1px] uppercase hover:bg-[#e0e0e0] transition-all"
                    >
                      Pilih
                      <i className="fas fa-arrow-right text-[10px]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATIONS ===== */}
      <section className="py-24 px-6 border-b border-dark-400">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-[10px] tracking-[4px] uppercase text-mute-500 mb-3">
              Lokasi Pemakaman
            </p>
            <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl font-medium text-white mb-4">
              Rekomendasi Kami
            </h2>
            <p className="reveal reveal-delay-2 text-sm text-mute-400 max-w-md mx-auto leading-relaxed">
              Lokasi pemakaman yang sering digunakan di daerah Solo, atau sampaikan
              permintaan khusus dari keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc, i) => (
              <div
                key={loc.id}
                className={`reveal reveal-delay-${Math.min(i + 1, 5)} card-shine border border-dark-400 rounded-xl p-6 bg-dark-200 hover:border-dark-500 hover:bg-dark-300 transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 border border-dark-500 rounded-full flex items-center justify-center text-mute-500 text-xs flex-shrink-0">
                    <i className="fas fa-map-marker-alt" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{loc.name}</h3>
                    {loc.tag === 'Rekomendasi' && (
                      <span className="text-[9px] tracking-[1px] uppercase text-mute-500">{loc.tag}</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-mute-500 leading-relaxed">{loc.address}</p>
              </div>
            ))}
            <div className="reveal reveal-delay-3 border border-dashed border-dark-500 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-mute-500 transition-colors">
              <div className="w-8 h-8 border border-dark-500 rounded-full flex items-center justify-center text-mute-500 text-xs mb-3">
                <i className="fas fa-plus" />
              </div>
              <p className="text-sm text-mute-400">Lokasi Khusus</p>
              <p className="text-[11px] text-mute-500 mt-1">Sesuai permintaan keluarga</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-24 px-6 border-b border-dark-400">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-[10px] tracking-[4px] uppercase text-mute-500 mb-3">
              Alur Pemesanan
            </p>
            <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl font-medium text-white">
              Lima Langkah Mudah
            </h2>
          </div>

          <div className="space-y-0">
            {[
              { num: '01', title: 'Data Almarhum/ah', desc: 'Isi data identitas dan kontak penanggung jawab keluarga.' },
              { num: '02', title: 'Pilih Paket', desc: 'Tentukan paket layanan yang sesuai dengan kebutuhan.' },
              { num: '03', title: 'Lama di Rumah Duka', desc: 'Pilih durasi penggunaan rumah duka, 1 sampai 7 hari.' },
              { num: '04', title: 'Lokasi Pemakaman', desc: 'Gunakan rekomendasi kami atau sampaikan permintaan khusus.' },
              { num: '05', title: 'Konfirmasi', desc: 'Periksa ringkasan dan ajukan pesanan. Tim kami akan segera menghubungi.' },
            ].map((step, i) => (
              <div key={step.num} className={`reveal reveal-delay-${Math.min(i + 1, 5)} flex gap-6`}>
                <div className="flex flex-col items-center">
                  <span className="step-num font-serif text-lg text-mute-500">{step.num}</span>
                  {i < 4 && <div className="w-px flex-1 bg-dark-400 mt-2" />}
                </div>
                <div className="pb-10">
                  <h3 className="text-sm font-medium text-white mb-1">{step.title}</h3>
                  <p className="text-[13px] text-mute-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="reveal w-12 h-12 border border-mute-400 rounded-full flex items-center justify-center mx-auto mb-6 text-mute-300 text-sm">
            <i className="fas fa-cross" />
          </div>
          <h2 className="reveal reveal-delay-1 font-serif text-3xl font-medium text-white mb-4">
            Siap Menghubungi Kami
          </h2>
          <p className="reveal reveal-delay-2 text-sm text-mute-400 leading-relaxed mb-8">
            Kami siap membantu keluarga dalam masa sulit ini.
            Ajukan pesanan dan tim kami akan merespons dalam 1x24 jam.
          </p>
          <Link
            href="/order"
            className="reveal reveal-delay-3 inline-flex items-center gap-3 px-10 py-4 bg-white text-[#0a0a0a] rounded-lg text-[13px] font-semibold tracking-[1px] uppercase hover:bg-[#e0e0e0] hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-all"
          >
            Ajukan Pesanan Sekarang
            <i className="fas fa-arrow-right text-xs" />
          </Link>
        </div>
      </section>
      
            {previewPkg && (
        <PackageModal pkg={previewPkg} onClose={() => setPreviewPkg(null)} />
      )}

    

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-dark-400 py-10 px-6">
        <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
            <span className="font-serif text-sm tracking-[2px] uppercase text-mute-500">
              The Grand
            </span>
          </div>
          <p className="text-[11px] text-mute-500 tracking-[1px]">
            Mengantar dengan penghormatan terakhir
          </p>
        </div>
      </footer>
    </div>
  );
}