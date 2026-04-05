'use client';

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] bg-dark-200 border border-dark-500
        text-white px-6 py-3.5 rounded-xl text-[13px] flex items-center gap-2.5
        shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-transform duration-400
        ${visible ? 'translate-x-1/2 translate-y-0' : 'translate-x-1/2 translate-y-[100px]'}
      `}
    >
      <i className="fas fa-exclamation-circle text-mute-400" />
      <span>{message}</span>
    </div>
  );
}