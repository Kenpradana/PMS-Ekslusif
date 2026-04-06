'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatRp } from '@/lib/utils';
import { getPackages, getLocations, getAdditions, insertOrder, type Package, type BurialLocation, type Addition } from '@/lib/data';
import Stepper from '@/components/Stepper';
import StepDeceased from '@/components/StepDeceased';
import StepPackage from '@/components/StepPackage';
import StepDays from '@/components/StepDays';
import StepBurial from '@/components/StepBurial';
import StepSummary from '@/components/StepSummary';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';

export default function OrderPage() {
  // === MASTER DATA dari Supabase ===
  const [packages, setPackages] = useState<Package[]>([]);
  const [locations, setLocations] = useState<BurialLocation[]>([]);
  const [additionsData, setAdditionsData] = useState<Addition[]>([]);
  const [loading, setLoading] = useState(true);

  // === FORM STATE ===
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [showModal, setShowModal] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deceased, setDeceased] = useState({
    deceased_name: '', deceased_age: '', death_date: '', pic_name: '', pic_phone: '',
  });
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [selectedLocId, setSelectedLocId] = useState<string | null>(null);
  const [isCustomLoc, setIsCustomLoc] = useState(false);
  const [customLoc, setCustomLoc] = useState({ customName: '', customAddr: '', customNote: '' });
  const [selectedAdditions, setSelectedAdditions] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  // === FETCH DATA DARI SUPABASE ===
  useEffect(() => {
    async function load() {
      try {
        const [pkgs, locs, adds] = await Promise.all([
          getPackages(),
          getLocations(),
          getAdditions(),
        ]);
        setPackages(pkgs);
        setLocations(locs);
        setAdditionsData(adds);
      } catch (err) {
        console.error(err);
        showToast('Gagal memuat data. Periksa koneksi internet.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // === HELPERS ===
  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }, []);

  const handleDeceasedChange = (field: string, value: string) => {
    setDeceased((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomLocChange = (field: string, value: string) => {
    setCustomLoc((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAddition = (id: string) => {
    setSelectedAdditions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // === NAVIGATION ===
  const goStep = (step: number) => {
    if (step > currentStep) {
      if (currentStep === 1) {
        if (!deceased.deceased_name.trim()) return showToast('Masukkan nama almarhum/ah');
        if (!deceased.pic_name.trim()) return showToast('Masukkan nama penanggung jawab');
        if (!deceased.pic_phone.trim()) return showToast('Masukkan nomor telepon PIC');
      }
      if (currentStep === 2 && !selectedPkg) return showToast('Silakan pilih paket');
      if (currentStep === 3 && !selectedDays) return showToast('Silakan pilih lama hari');
      if (currentStep === 4) {
        if (!isCustomLoc && !selectedLocId) return showToast('Silakan pilih lokasi pemakaman');
        if (isCustomLoc && (!customLoc.customName.trim() || !customLoc.customAddr.trim()))
          return showToast('Lengkapi data lokasi kustom');
      }
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // === SUBMIT ===
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const dayCost = selectedPkg!.day_cost * selectedDays!;
    const addCost = selectedAdditions.reduce((sum, id) => {
      const a = additionsData.find((x) => x.id === id);
      return sum + (a ? a.price : 0);
    }, 0);
    const total = selectedPkg!.price + dayCost + addCost;

    const addServices = selectedAdditions.map((id) => {
      const a = additionsData.find((x) => x.id === id);
      return { id, name: a?.name ?? '', price: a?.price ?? 0 };
    });

    let locName = '';
    let locAddr = '';
    if (isCustomLoc) {
      locName = customLoc.customName;
      locAddr = customLoc.customAddr + (customLoc.customNote ? ` — ${customLoc.customNote}` : '');
    } else {
      const loc = locations.find((l) => l.id === selectedLocId);
      locName = loc?.name || '';
      locAddr = loc?.address || '';
    }

    try {
      const result = await insertOrder({
        deceased_name: deceased.deceased_name || null,
        deceased_age: deceased.deceased_age || null,
        death_date: deceased.death_date || null,
        pic_name: deceased.pic_name || null,
        pic_phone: deceased.pic_phone || null,
        package_id: selectedPkg!.id,
        package_name: selectedPkg!.name,
        package_price: selectedPkg!.price,
        days_at_mourning_house: selectedDays!,
        day_cost: dayCost,
        burial_type: isCustomLoc ? 'custom' : 'default',
        burial_location_id: isCustomLoc ? null : selectedLocId,
        burial_location_name: locName,
        burial_location_address: locAddr || null,
        additional_services: addServices,
        additional_cost: addCost,
        special_notes: specialNotes || null,
        total_price: total,
      });

      setRefCode(result.ref_code);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      showToast('Gagal mengajukan pesanan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // === RESET ===
  const resetAll = () => {
    setCurrentStep(1);
    setDeceased({ deceased_name: '', deceased_age: '', death_date: '', pic_name: '', pic_phone: '' });
    setSelectedPkg(null);
    setSelectedDays(null);
    setSelectedLocId(null);
    setIsCustomLoc(false);
    setCustomLoc({ customName: '', customAddr: '', customNote: '' });
    setSelectedAdditions([]);
    setSpecialNotes('');
    setRefCode('');
    setShowModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // === LOADING ===
  if (loading) {
    return (
      <div className="relative z-[2] max-w-[960px] mx-auto px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-mute-500 text-2xl mb-4 block" />
          <p className="text-mute-500 text-sm tracking-wider">Memuat data...</p>
        </div>
      </div>
    );
  }

  // === RENDER ===
  return (
    <div className="relative z-[2] max-w-[960px] mx-auto px-6">
      <header className="pt-6 pb-5 border-b border-dark-400 mb-10">
        <div className="grid grid-cols-3 items-center">
          {/* Kiri */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[1.5px] sm:tracking-[2px] uppercase text-mute-500 hover:text-mute-300 transition-colors"
            >
              <i className="fas fa-arrow-left text-[9px] sm:text-[10px]" />
              <span className="hidden sm:inline">Kembali ke Katalog</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
          </div>

          {/* Tengah */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-3 sm:gap-3.5">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <span className="font-serif text-[22px] sm:text-[26px] font-medium tracking-[3px] uppercase text-white whitespace-nowrap">
                The Grand
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] tracking-[4px] sm:tracking-[5px] uppercase text-mute-500 whitespace-nowrap mt-1">
              PMS Ekslusif Funeral Organizer Service
            </p>
          </div>

          {/* Kanan */}
          <div />
        </div>
      </header>

      <Stepper currentStep={currentStep} />

      {/* Step 1 */}
      {currentStep === 1 && (
        <>
          <StepDeceased data={deceased} onChange={handleDeceasedChange} />
          <ButtonRow>
            <div />
            <BtnPrimary onClick={() => goStep(2)}>
              Lanjutkan <i className="fas fa-arrow-right ml-2.5" />
            </BtnPrimary>
          </ButtonRow>
        </>
      )}

      {/* Step 2 */}
      {currentStep === 2 && (
        <>
          <StepPackage packages={packages} selected={selectedPkg} onSelect={setSelectedPkg} />
          <ButtonRow>
            <BtnSecondary onClick={() => goStep(1)}>
              <i className="fas fa-arrow-left mr-2.5" /> Kembali
            </BtnSecondary>
            <BtnPrimary onClick={() => goStep(2)} disabled={!selectedPkg}>
              Lanjutkan <i className="fas fa-arrow-right ml-2.5" />
            </BtnPrimary>
          </ButtonRow>
        </>
      )}

      {/* Step 3 */}
      {currentStep === 3 && (
        <>
          <StepDays selected={selectedDays} onSelect={setSelectedDays} />
          <ButtonRow>
            <BtnSecondary onClick={() => goStep(2)}>
              <i className="fas fa-arrow-left mr-2.5" /> Kembali
            </BtnSecondary>
            <BtnPrimary onClick={() => goStep(3)} disabled={!selectedDays}>
              Lanjutkan <i className="fas fa-arrow-right ml-2.5" />
            </BtnPrimary>
          </ButtonRow>
        </>
      )}

      {/* Step 4 */}
      {currentStep === 4 && (
        <>
          <StepBurial
            locations={locations}
            selectedLocId={selectedLocId}
            isCustom={isCustomLoc}
            customName={customLoc.customName}
            customAddr={customLoc.customAddr}
            customNote={customLoc.customNote}
            onSelectDefault={(id) => { setSelectedLocId(id); setIsCustomLoc(false); }}
            onSelectCustom={() => { setIsCustomLoc(true); setSelectedLocId(null); }}
            onCustomChange={handleCustomLocChange}
          />
          <ButtonRow>
            <BtnSecondary onClick={() => goStep(3)}>
              <i className="fas fa-arrow-left mr-2.5" /> Kembali
            </BtnSecondary>
            <BtnPrimary onClick={() => goStep(4)}>
              Lanjutkan <i className="fas fa-arrow-right ml-2.5" />
            </BtnPrimary>
          </ButtonRow>
        </>
      )}

      {/* Step 5 */}
      {currentStep === 5 && selectedPkg && selectedDays && (
        <>
          <div className="animate-fade-in mb-8">
            <p className="text-[11px] tracking-[2px] uppercase text-mute-500 mb-3.5 pl-0.5">
              Layanan Tambahan (Opsional)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {additionsData.map((add) => {
                const isSelected = selectedAdditions.includes(add.id);
                return (
                  <div
                    key={add.id}
                    onClick={() => toggleAddition(add.id)}
                    className={`border rounded-[10px] px-5 py-4 flex items-center gap-3.5 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-mute-400 bg-dark-300'
                        : 'border-dark-400 bg-dark-200 hover:border-dark-500 hover:bg-dark-300'
                    }`}
                  >
                    <div
                      className={`w-[18px] h-[18px] rounded border flex items-center justify-center flex-shrink-0 text-[10px] transition-all ${
                        isSelected
                          ? 'bg-white border-white text-dark'
                          : 'border-mute-500 text-transparent'
                      }`}
                    >
                      <i className="fas fa-check" />
                    </div>
                    <span className="text-[13px] font-medium text-white">{add.name}</span>
                    <span className="text-[11px] text-mute-500 ml-auto flex-shrink-0">
                      {formatRp(add.price)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div>
              <label className="block text-[11px] tracking-[1.5px] uppercase text-mute-500 mb-2">
                Catatan Khusus
              </label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Adakah permintaan khusus lainnya? Tuliskan di sini..."
                rows={3}
                className="w-full px-4 py-3.5 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm outline-none transition-all focus:border-mute-400 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.03)] placeholder:text-mute-700 resize-y min-h-[80px]"
              />
            </div>
          </div>

          <StepSummary
            deceased={deceased}
            selectedPkg={selectedPkg}
            selectedDays={selectedDays}
            selectedLocId={selectedLocId}
            isCustomLoc={isCustomLoc}
            customLoc={customLoc}
            additions={additionsData}
            selectedAdditions={selectedAdditions}
            locations={locations}
            specialNotes={specialNotes}
            refCode={refCode || 'ER------'}
          />

          <ButtonRow>
            <BtnSecondary onClick={() => goStep(4)}>
              <i className="fas fa-arrow-left mr-2.5" /> Ubah
            </BtnSecondary>
            <BtnPrimary onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <><i className="fas fa-spinner fa-spin mr-2.5" /> Mengirim...</>
              ) : (
                <><i className="fas fa-paper-plane mr-2.5" /> Ajukan Pesanan</>
              )}
            </BtnPrimary>
          </ButtonRow>
        </>
      )}

      <footer className="text-center py-10 mt-5 border-t border-dark-400">
        <p className="text-[11px] text-mute-500 tracking-[1px]">
          Eternal Rest Funeral Organizer — Mengantar dengan penghormatan terakhir
        </p>
      </footer>

      {showModal && <SuccessModal refCode={refCode} onReset={resetAll} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}

function ButtonRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-4 mt-10 pt-8 border-t border-dark-400">
      {children}
    </div>
  );
}

function BtnPrimary({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-8 py-3.5 bg-white text-[#0a0a0a] rounded-lg text-[13px] font-semibold tracking-[1px] uppercase inline-flex items-center transition-all hover:bg-mute-200 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none"
    >
      {children}
    </button>
  );
}

function BtnSecondary({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3.5 bg-transparent border border-dark-500 text-mute-300 rounded-lg text-[13px] font-semibold tracking-[1px] uppercase inline-flex items-center transition-all hover:border-mute-400 hover:text-white"
    >
      {children}
    </button>
  );
}