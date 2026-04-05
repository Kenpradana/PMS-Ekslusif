'use client';

const steps = [
  { num: 1, label: 'Almarhum' },
  { num: 2, label: 'Paket' },
  { num: 3, label: 'Lama Hari' },
  { num: 4, label: 'Pemakaman' },
  { num: 5, label: 'Ringkasan' },
];

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="mb-10">
      {/* Lingkaran + garis */}
      <div className="flex items-center justify-center">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium
                  transition-all duration-500 flex-shrink-0 border
                  ${currentStep > step.num
                    ? 'bg-mute-400 text-dark border-mute-400'
                    : currentStep === step.num
                      ? 'bg-white text-dark border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                      : 'bg-dark-100 border-dark-500 text-mute-500'
                  }
                `}
              >
                {currentStep > step.num ? (
                  <i className="fas fa-check text-[11px]" />
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`
                  text-[10px] tracking-[1.5px] uppercase mt-2.5 transition-colors duration-400
                  ${currentStep === step.num ? 'text-white' : 'text-mute-500'}
                `}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-[60px] h-px transition-all duration-500 mb-5 ${
                  currentStep > step.num ? 'bg-mute-400' : 'bg-dark-500'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}