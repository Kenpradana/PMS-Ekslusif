'use client';

import { formatRp, formatDate } from '@/lib/utils';
// ❌ import { additions, burialLocations, ... } from '@/data/constants';

interface Addition {
  id: string;
  name: string;
  price: number;
}

interface BurialLocation {
  id: string;
  name: string;
  address: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  day_cost: number;
}

interface StepSummaryProps {
  deceased: { deceased_name: string; deceased_age: string; death_date: string; pic_name: string; pic_phone: string };
  selectedPkg: Package;
  selectedDays: number;
  selectedLocId: string | null;
  isCustomLoc: boolean;
  customLoc: { customName: string; customAddr: string; customNote: string };
  additions: Addition[];           // ← dari props
  selectedAdditions: string[];
  locations: BurialLocation[];     // ← dari props (untuk lookup nama lokasi)
  specialNotes: string;
  refCode: string;
}

export default function StepSummary({
  deceased, selectedPkg, selectedDays,
  selectedLocId, isCustomLoc, customLoc,
  additions, selectedAdditions, locations,
  specialNotes, refCode,
}: StepSummaryProps) {
  const dayCost = selectedPkg.day_cost * selectedDays;
  const addCost = selectedAdditions.reduce((sum, id) => {
    const a = additions.find((x) => x.id === id);
    return sum + (a ? a.price : 0);
  }, 0);
  const total = selectedPkg.price + dayCost + addCost;

  let locName = '';
  let locAddr = '';
  if (isCustomLoc) {
    locName = customLoc.customName;
    locAddr = customLoc.customAddr + (customLoc.customNote ? ` — ${customLoc.customNote}` : '');
  } else {
    const loc = locations.find((l) => l.id === selectedLocId);
    locName = loc?.name || '-';
    locAddr = loc?.address || '';
  }

  return (
    <div className="animate-fade-in">
      {/* ... header sama ... */}
      <div className="border border-dark-400 rounded-2xl bg-dark-200 overflow-hidden mb-8">
        <div className="px-7 py-6 border-b border-dark-400 flex items-center justify-between">
          <h3 className="font-serif text-lg text-white">Detail Pesanan</h3>
          <span className="text-[11px] tracking-[2px] uppercase text-mute-500">{refCode}</span>
        </div>
        <div className="px-7 py-5 divide-y divide-dark-400">
          <SummaryRow label="Nama Almarhum/ah" value={deceased.deceased_name || '-'} />
          <SummaryRow label="Usia" value={deceased.deceased_age || '-'} />
          <SummaryRow label="Tanggal Wafat" value={formatDate(deceased.death_date)} />
          <SummaryRow label="Penanggung Jawab" value={(deceased.pic_name || '-') + (deceased.pic_phone ? ` — ${deceased.pic_phone}` : '')} />
          <SummaryRow label="Paket" value={selectedPkg.name} />
          <SummaryRow label="Harga Paket" value={formatRp(selectedPkg.price)} />
          <SummaryRow label="Lama di Rumah Duka" value={`${selectedDays} hari`} />
          <SummaryRow label="Biaya Rumah Duka" value={`${formatRp(dayCost)} (${formatRp(selectedPkg.day_cost)}/hari)`} />
          <SummaryRow label="Lokasi Pemakaman" value={<div>{locName}{locAddr && <small className="block text-mute-500 mt-0.5">{locAddr}</small>}</div>} />
          {selectedAdditions.map((id) => {
            const a = additions.find((x) => x.id === id);
            return a ? <SummaryRow key={id} label={a.name} value={formatRp(a.price)} /> : null;
          })}
          {specialNotes && <SummaryRow label="Catatan Khusus" value={specialNotes} />}
        </div>
        <div className="px-7 py-5 border-t border-dark-500 flex items-center justify-between bg-white/[0.02]">
          <span className="text-[11px] tracking-[2px] uppercase text-mute-400">Total Estimasi</span>
          <span className="font-serif text-[28px] font-semibold text-white">{formatRp(total)}</span>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-3.5">
      <span className="text-[13px] text-mute-400">{label}</span>
      <span className="text-[13px] font-medium text-white text-right max-w-[55%]">{value}</span>
    </div>
  );
}