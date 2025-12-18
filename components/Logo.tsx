
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", size = 40 }) => {
  return (
    <div className={`${className} flex items-center justify-center relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cerebrix-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" /> {/* Emerald/Green */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Crecimiento - Flecha ascendente estilizada */}
        <path
          d="M50 85V15M50 15L30 35M50 15L70 35"
          stroke="url(#cerebrix-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-20"
        />

        {/* Inteligencia - Silueta de cerebro minimalista formada por conexiones */}
        <path
          d="M50 25C35 25 25 35 25 50C25 65 35 75 50 75C65 75 75 65 75 50C75 35 65 25 50 25Z"
          stroke="url(#cerebrix-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Nodos de red neuronal */}
        <circle cx="50" cy="50" r="5" fill="url(#cerebrix-gradient)" />
        <circle cx="35" cy="40" r="3" fill="#10b981" />
        <circle cx="65" cy="40" r="3" fill="#3b82f6" />
        <circle cx="35" cy="60" r="3" fill="#10b981" />
        <circle cx="65" cy="60" r="3" fill="#3b82f6" />
        
        {/* Líneas de conexión internas */}
        <path d="M50 50L35 40" stroke="url(#cerebrix-gradient)" strokeWidth="2" strokeDasharray="2 2" />
        <path d="M50 50L65 40" stroke="url(#cerebrix-gradient)" strokeWidth="2" strokeDasharray="2 2" />
        <path d="M50 50L35 60" stroke="url(#cerebrix-gradient)" strokeWidth="2" strokeDasharray="2 2" />
        <path d="M50 50L65 60" stroke="url(#cerebrix-gradient)" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
    </div>
  );
};

export default Logo;
