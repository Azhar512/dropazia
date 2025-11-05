// Dropazia Logo Component - Colored squares grid with truck silhouette
const DropaziaLogo = ({ className = "h-12 w-12", showText = false }: { className?: string; showText?: boolean }) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        className={className}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background - Black */}
        <rect x="0" y="0" width="200" height="200" fill="black" rx="20" />
        
        {/* Colored squares in 2x2 grid */}
        <defs>
          <linearGradient id="orangeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8533" />
            <stop offset="100%" stopColor="#FF6A00" />
          </linearGradient>
          <linearGradient id="orangeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8533" />
            <stop offset="100%" stopColor="#FF6A00" />
          </linearGradient>
          <linearGradient id="greenGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="greenGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        
        {/* Top-left: Orange square */}
        <rect x="20" y="20" width="50" height="50" rx="4" fill="url(#orangeGrad1)" />
        
        {/* Top-right: Green square */}
        <rect x="75" y="20" width="50" height="50" rx="4" fill="url(#greenGrad1)" />
        
        {/* Bottom-left: Green square */}
        <rect x="20" y="75" width="50" height="50" rx="4" fill="url(#greenGrad2)" />
        
        {/* Bottom-right: Larger orange square (offset/overlapping) */}
        <rect x="70" y="70" width="70" height="70" rx="4" fill="url(#orangeGrad2)" />
        
        {/* Semi-truck silhouette */}
        <g transform="translate(30, 120)">
          {/* Trailer - White box with black outline */}
          <rect x="0" y="10" width="80" height="40" fill="white" stroke="black" strokeWidth="2" />
          
          {/* Trailer wheels - Small circles at front */}
          <circle cx="15" cy="50" r="4" fill="white" />
          <circle cx="25" cy="50" r="4" fill="white" />
          <circle cx="35" cy="50" r="4" fill="white" />
          
          {/* Trailer wheels - Larger circles at rear */}
          <circle cx="60" cy="50" r="6" fill="white" stroke="black" strokeWidth="1" />
          <circle cx="75" cy="50" r="6" fill="white" stroke="black" strokeWidth="1" />
          
          {/* Tractor (Cab) - Black with white details */}
          <rect x="80" y="5" width="50" height="45" fill="black" rx="2" />
          
          {/* Cab windows - White outlines */}
          <rect x="88" y="12" width="12" height="10" fill="white" opacity="0.3" rx="1" />
          <rect x="102" y="12" width="20" height="10" fill="white" opacity="0.3" rx="1" />
          
          {/* Cab grille details */}
          <rect x="88" y="25" width="34" height="8" fill="white" opacity="0.2" rx="1" />
          
          {/* Tractor wheels - Larger circles */}
          <circle cx="95" cy="55" r="8" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="115" cy="55" r="8" fill="white" stroke="black" strokeWidth="2" />
        </g>
      </svg>
      {showText && (
        <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Dropazia
        </span>
      )}
    </div>
  );
};

export default DropaziaLogo;

