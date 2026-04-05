'use client';


const dayOptions = [
  { days: 1, note: 'Pemakaman keesokan harinya' },
  { days: 2, note: '1 malam di rumah duka' },
  { days: 3, note: '2 malam di rumah duka' },
  { days: 4, note: '3 malam di rumah duka' },
  { days: 5, note: '4 malam di rumah duka' },
  { days: 6, note: '5 malam di rumah duka' },
  { days: 7, note: '6 malam di rumah duka' },
];

interface StepDaysProps {
  selected: number | null;
  onSelect: (days: number) => void;
}

export default function StepDays({ selected, onSelect }: StepDaysProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <p className="text-[10px] tracking-[4px] uppercase text-mute-500 mb-3">
          Langkah 3 dari 5
        </p>
        <h2 className="font-serif text-[32px] font-medium text-white leading-tight">
          Lama di Rumah Duka
        </h2>
        <p className="text-sm text-mute-400 mt-2.5 max-w-md mx-auto leading-relaxed">
          Tentukan durasi penggunaan rumah duka sesuai kebutuhan
          keluarga dan jadwal pemakaman.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-dark-200 border border-dark-400 rounded-xl p-5 flex items-start gap-3.5 mb-8">
        <i className="fas fa-info-circle text-mute-400 mt-0.5 flex-shrink-0" />
        <p className="text-[13px] text-mute-300 leading-relaxed">
          Harga sudah termasuk pengaturan rumah duka, dekorasi standar,
          pendingin ruangan, dan kursi pengunjung untuk setiap harinya.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
        {dayOptions.map((d) => {
          const isSelected = selected === d.days;
          return (
            <div
              key={d.days}
              onClick={() => onSelect(d.days)}
              className={`
                border rounded-[10px] py-5 px-3 text-center cursor-pointer transition-all duration-300
                ${isSelected
                  ? 'border-white bg-dark-300'
                  : 'border-dark-400 bg-dark-200 hover:border-dark-500 hover:bg-dark-300'
                }
              `}
            >
              <div className="font-serif text-[28px] font-medium text-white">
                {d.days}
              </div>
              <div className={`text-[11px] tracking-[1px] uppercase mt-1 ${
                isSelected ? 'text-mute-300' : 'text-mute-500'
              }`}>
                Hari
              </div>
              <div className="text-[10px] text-mute-500 mt-2 leading-snug">
                {d.note}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}