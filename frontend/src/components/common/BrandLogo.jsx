import { Link } from 'react-router-dom';

export default function BrandLogo({
  size = 'md',
  showText = true,
  subtitle = null,
  className = '',
  to = '/',
  asLink = true,
}) {
  const sizeMap = {
    sm: {
      box: 'w-7 h-7 rounded-lg',
      img: 'w-7 h-7 rounded-lg',
      text: 'text-[17px]',
      gap: 'gap-2',
    },
    md: {
      box: 'w-8 h-8 rounded-lg',
      img: 'w-8 h-8 rounded-lg',
      text: 'text-[20px]',
      gap: 'gap-2.5',
    },
    lg: {
      box: 'w-10 h-10 rounded-xl',
      img: 'w-10 h-10 rounded-xl',
      text: 'text-[24px]',
      gap: 'gap-3',
    },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center ${selectedSize.gap} ${className}`}>
      {/* Brand Icon using real CareerBridge brand asset */}
      <div className={`relative ${selectedSize.box} shrink-0 bg-black flex items-center justify-center overflow-hidden shadow-xs border border-black/10`}>
        <img
          src="/logo.png"
          alt="CareerBridge logo"
          className={`w-full h-full object-contain ${selectedSize.img}`}
          loading="eager"
          decoding="async"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${selectedSize.text} font-extrabold text-[#080D1C] tracking-tight`}>
            CareerBridge
          </span>
          {subtitle && (
            <span className="text-[10px] font-bold text-[#FF5A0A] tracking-wider uppercase mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink && to) {
    return (
      <Link
        to={to}
        className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A] rounded-lg transition-transform active:scale-[0.98]"
        aria-label="CareerBridge home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

