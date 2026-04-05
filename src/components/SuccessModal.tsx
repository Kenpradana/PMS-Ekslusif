'use client';

interface SuccessModalProps {
  refCode: string;
  onReset: () => void;
}

export default function SuccessModal({ refCode, onReset }: SuccessModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) return;
      }}
    >
      <div className="bg-dark-100 border border-dark-400 rounded-2xl px-10 py-12 text-center max-w-[440px] w-full animate-fade-in">
        <div className="w-[60px] h-10 h-[60px] border border-mute-400 rounded-full flex items-center justify-center mx-auto mb-6 text-[22px] text-white">
          <i className="fas fa-check" />
        </div>
        <h3 className="font-serif text-2xl text-white mb-3">
          Pesanan Terajukan
        </h3>
        <p className="text-sm text-mute-400 leading-relaxed mb-7">
          Terima kasih telah mempercayakan layanan kami. Tim kami akan
          menghubungi keluarga dalam waktu 1x24 jam untuk konfirmasi
          selanjutnya. Data telah tersimpan secara aman.
        </p>
        <div className="text-xs tracking-[2px] text-mute-500 py-2.5 px-5 border border-dark-400 rounded-md inline-block mb-7">
          {refCode}
        </div>
        <br />
        <button
          onClick={onReset}
          className="w-full py-3.5 bg-white text-dark rounded-lg text-[13px] font-semibold tracking-[1px]
                     uppercase hover:bg-mute-200 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-all"
        >
          Buat Pesanan Baru
        </button>
      </div>
    </div>
  );
}