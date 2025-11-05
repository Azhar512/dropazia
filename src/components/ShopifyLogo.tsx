// Shopify Logo Component - Green shopping bag with S
const ShopifyLogo = ({ className = "h-7 w-7" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shopifyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#95BF47" />
          <stop offset="100%" stopColor="#7FA832" />
        </linearGradient>
      </defs>
      {/* Shopping bag body - 3D style */}
      <path
        d="M20 45 L20 95 Q20 105 30 105 L70 105 Q80 105 80 95 L80 45 Q80 40 75 40 L60 40 L55 30 L45 30 L40 40 L25 40 Q20 40 20 45 Z"
        fill="url(#shopifyGradient)"
        stroke="none"
      />
      {/* Bag handles */}
      <path
        d="M30 45 Q30 35 40 35 L60 35 Q70 35 70 45"
        stroke="#7FA832"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Letter S - bold and centered */}
      <text
        x="50"
        y="80"
        fontSize="40"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        S
      </text>
    </svg>
  );
};

export default ShopifyLogo;

