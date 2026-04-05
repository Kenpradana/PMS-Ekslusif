'use client';

interface StepDeceasedProps {
  data: {
    deceased_name: string;
    deceased_age: string;
    death_date: string;
    pic_name: string;
    pic_phone: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function StepDeceased({ data, onChange }: StepDeceasedProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <p className="text-[10px] tracking-[4px] uppercase text-mute-500 mb-3">
          Langkah 1 dari 5
        </p>
        <h2 className="font-serif text-[32px] font-medium text-white leading-tight">
          Data Almarhum / Almarhumah
        </h2>
        <p className="text-sm text-mute-400 mt-2.5 max-w-md mx-auto leading-relaxed">
          Lengkapi data terlebih dahulu agar kami dapat memberikan
          layanan yang sesuai dan penuh penghormatan.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4 mb-8">
        <div>
          <label className="block text-[11px] tracking-[1.5px] uppercase text-mute-500 mb-2">
            Nama Lengkap Almarhum / Almarhumah
          </label>
          <input
            type="text"
            value={data.deceased_name}
            onChange={(e) => onChange('deceased_name', e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="w-full px-4 py-3.5 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm
                       outline-none transition-all focus:border-mute-400 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.03)]
                       placeholder:text-mute-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] tracking-[1.5px] uppercase text-mute-500 mb-2">
              Usia
            </label>
            <input
              type="text"
              value={data.deceased_age}
              onChange={(e) => onChange('deceased_age', e.target.value)}
              placeholder="Contoh: 72 tahun"
              className="w-full px-4 py-3.5 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm
                         outline-none transition-all focus:border-mute-400 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.03)]
                         placeholder:text-mute-700"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[1.5px] uppercase text-mute-500 mb-2">
              Tanggal Wafat
            </label>
            <input
              type="date"
              value={data.death_date}
              onChange={(e) => onChange('death_date', e.target.value)}
              className="w-full px-4 py-3.5 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm
                         outline-none transition-all focus:border-mute-400 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.03)]
                         placeholder:text-mute-700"
            />
          </div>
        </div>

        <div className="h-px bg-dark-400 my-2" />

        <div>
          <label className="block text-[11px] tracking-[1.5px] uppercase text-mute-500 mb-2">
            Nama Penanggung Jawab (Keluarga)
          </label>
          <input
            type="text"
            value={data.pic_name}
            onChange={(e) => onChange('pic_name', e.target.value)}
            placeholder="Nama keluarga yang bisa dihubungi"
            className="w-full px-4 py-3.5 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm
                       outline-none transition-all focus:border-mute-400 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.03)]
                       placeholder:text-mute-700"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-[1.5px] uppercase text-mute-500 mb-2">
            Nomor Telepon PIC
          </label>
          <input
            type="tel"
            value={data.pic_phone}
            onChange={(e) => onChange('pic_phone', e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full px-4 py-3.5 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm
                       outline-none transition-all focus:border-mute-400 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.03)]
                       placeholder:text-mute-700"
          />
        </div>
      </div>
    </div>
  );
}