// Daraz Logo Component - Orange 3D style with play button
const DarazLogo = ({ className = "h-7 w-7" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Orange background shape - 3D hexagon style */}
      <defs>
        <linearGradient id="darazGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6A00" />
          <stop offset="100%" stopColor="#FF8533" />
        </linearGradient>
      </defs>
      <path
        d="M25 35 L35 25 L65 25 L75 35 L75 55 L65 65 L45 70 L25 65 L20 55 L20 45 Z"
        fill="url(#darazGradient)"
        stroke="none"
      />
      {/* White play button triangle */}
      <path
        d="M40 38 L40 62 L62 50 Z"
        fill="white"
      />
    </svg>
  );
};

export default DarazLogo;

