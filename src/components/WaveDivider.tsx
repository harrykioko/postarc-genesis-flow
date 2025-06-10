
interface WaveDividerProps {
  color?: string;
  flipped?: boolean;
}

export const WaveDivider = ({ color = "#FFFFFF", flipped = false }: WaveDividerProps) => {
  return (
    <div className={`absolute left-0 right-0 w-full overflow-hidden z-20 ${flipped ? 'top-0' : 'bottom-0'}`}>
      <svg 
        viewBox="0 0 1440 48" 
        className={`w-full h-12 ${flipped ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <path 
          d="M0,48 L0,16 Q360,0 720,16 T1440,16 L1440,48 Z" 
          fill={color}
        />
      </svg>
    </div>
  );
};
