'use client';

import { formatRp } from '@/lib/utils';
import type { Package } from '@/lib/data';
// ❌ import { packages, formatRp } from '@/data/constants';

interface StepPackageProps {
  packages: Package[];   // ← sekarang datang dari props
  selected: Package | null;
  onSelect: (pkg: Package) => void;
}

export default function StepPackage({ packages, selected, onSelect }: StepPackageProps) {
  // ... sisanya TIDAK BERUBAH sama sekali
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <p className="text-[10px] tracking-[4px] uppercase text-mute-500 mb-3">Langkah 2 dari 5</p>
        <h2 className="font-serif text-[32px] font-medium text-white leading-tight">Pilih Paket Layanan</h2>
        <p className="text-sm text-mute-400 mt-2.5 max-w-md mx-auto leading-relaxed">
          Setiap paket telah dirancang dengan penuh penghormatan untuk mendampingi keluarga di masa berduka.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {packages.map((pkg) => {
          const isSelected = selected?.id === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => onSelect(pkg)}
              className={`border rounded-xl p-7 cursor-pointer transition-all duration-300 relative overflow-hidden
                ${isSelected
                  ? 'border-white bg-dark-300 shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                  : 'border-dark-400 bg-dark-200 hover:border-dark-500 hover:bg-dark-300 hover:-translate-y-0.5'
                }`}
            >
              {isSelected && <div className="absolute top-0 left-0 w-full h-0.5 bg-white" />}
              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] transition-all
                  ${isSelected ? 'bg-white border-white text-dark' : 'border-dark-500 text-transparent'}`}>
                  <i className="fas fa-check" />
                </div>
              </div>
              <span className={`inline-block text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded border mb-4
                ${isSelected ? 'text-white border-mute-400' : 'text-mute-500 border-dark-400'}`}>
                {pkg.badge}
              </span>
              <h3 className="font-serif text-xl font-medium text-white mb-1">{pkg.name}</h3>
              <p className="text-sm text-mute-400 mb-4">
                <span className="text-2xl font-semibold text-white">{formatRp(pkg.price)}</span>
              </p>
              <ul className="space-y-2">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-mute-300 leading-snug">
                    <i className={`fas fa-circle text-[8px] mt-[5px] flex-shrink-0 ${isSelected ? 'text-white' : 'text-mute-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}