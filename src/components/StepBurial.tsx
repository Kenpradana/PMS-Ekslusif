'use client';

// ❌ import { burialLocations } from '@/data/constants';
// Tambahkan interface lokal atau import dari utils

interface BurialLocation {
  id: string;
  name: string;
  address: string;
  tag: string;
}

interface StepBurialProps {
  locations: BurialLocation[];  // ← dari props
  selectedLocId: string | null;
  isCustom: boolean;
  customName: string;
  customAddr: string;
  customNote: string;
  onSelectDefault: (id: string) => void;
  onSelectCustom: () => void;
  onCustomChange: (field: string, value: string) => void;
}

export default function StepBurial({
  locations,           // ← pakai ini
  selectedLocId,
  isCustom,
  customName,
  customAddr,
  customNote,
  onSelectDefault,
  onSelectCustom,
  onCustomChange,
}: StepBurialProps) {
  return (
    <div className="animate-fade-in">
      {/* ... header sama ... */}

      <p className="text-[11px] tracking-[2px] uppercase text-mute-500 mb-3.5 pl-0.5">
        Rekomendasi Lokasi Kami
      </p>
      <div className="space-y-2 mb-8">
        {locations.map((loc) => {              // ← pakai locations dari props
          const isSelected = !isCustom && selectedLocId === loc.id;
          return (
            <div key={loc.id} onClick={() => onSelectDefault(loc.id)}
              className={`border rounded-[10px] px-5 py-4 flex items-center gap-4 cursor-pointer transition-all duration-300
                ${isSelected ? 'border-white bg-dark-300' : 'border-dark-400 bg-dark-200 hover:border-dark-500 hover:bg-dark-300'}`}>
              <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 transition-all
                ${isSelected ? 'border-white' : 'border-mute-500'}`}>
                <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-300 ${isSelected ? 'scale-100' : 'scale-0'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{loc.name}</div>
                <div className="text-xs text-mute-500 truncate">{loc.address}</div>
              </div>
              <span className={`text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 rounded border flex-shrink-0
                ${isSelected ? 'text-mute-300 border-mute-400' : 'text-mute-500 border-dark-400'}`}>
                {loc.tag}
              </span>
            </div>
          );
        })}
      </div>

      {/* ... bagian custom location sama persis ... */}
    </div>
  );
}