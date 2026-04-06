'use client';

import Image from 'next/image';
import { formatRp } from '@/lib/utils';
import type { Package } from '@/lib/data';

interface PackageModalProps {
  pkg: Package | null;
  onClose: () => void;
}

export default function PackageModal({ pkg, onClose }: PackageModalProps) {
  if (!pkg) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative w-full max-w-3xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-mute-500 hover:text-white transition-colors text-sm z-10"
        >
          <i className="fas fa-times mr-2" /> Tutup
        </button>

        {/* Image */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-dark-400">
          {pkg.image_url ? (
            <Image
              src={pkg.image_url}
              alt={pkg.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-dark-200 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-image text-4xl text-dark-500 mb-3 block" />
                <p className="text-mute-500 text-sm">Belum ada foto dekorasi</p>
              </div>
            </div>
          )}

          {/* Overlay info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-7">
            <span className="text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded border border-white/20 text-mute-200 inline-block mb-2">
              {pkg.badge}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-white mb-1">
              {pkg.name}
            </h3>
            <p className="font-serif text-lg sm:text-xl font-semibold text-white">
              {formatRp(pkg.price)}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {pkg.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5">
              <i className="fas fa-check text-[9px] text-mute-400 mt-[4px] flex-shrink-0" />
              <span className="text-[12px] text-mute-300 leading-snug">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}