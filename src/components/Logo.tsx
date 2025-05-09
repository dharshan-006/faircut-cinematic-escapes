
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-24',
    medium: 'w-32',
    large: 'w-48'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="/lovable-uploads/8fbab84f-3317-4a9c-85fb-54969283a244.png" 
        alt="Fair Cut Logo" 
        className="w-full h-auto"
      />
    </div>
  );
};

export default Logo;
