
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-24',
    medium: 'w-32',
    large: 'w-40'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex flex-col items-center`}>
      <div className="w-full text-center">
        <span className="text-4xl font-bold tracking-tighter text-faircut-light cyberpunk-text">
          FAIR
          <span className="text-3xl font-light">-</span>
          <span className="text-4xl font-bold text-red-500">CUT</span>
        </span>
        <div className="mt-1 text-xs text-center text-faircut-text/70">
          No Convenience Fee. Just Movies.
        </div>
      </div>
    </div>
  );
};

export default Logo;
