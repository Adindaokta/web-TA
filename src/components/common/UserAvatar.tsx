import React from 'react';

/**
 * Ekstraksi 2 inisial nama secara cerdas tanpa gelar akademik.
 * Contoh: "Adinda Okta Rubiyanti" -> "AO", "Nazwa Sulistiyawati" -> "NS", "Raka" -> "RA"
 */
export function getInitials(name: string): string {
  if (!name) return '??';
  const clean = name
    .replace(/(Ir\.|S\.Kom\.|M\.Kom\.|IPM|ASEAN Eng|Dr\.|Prof\.)/gi, '')
    .trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const GRADIENTS = [
  'from-indigo-600 to-violet-600',
  'from-blue-600 to-indigo-600',
  'from-teal-600 to-emerald-600',
  'from-emerald-600 to-green-600',
  'from-sky-600 to-cyan-600',
  'from-violet-600 to-purple-600',
  'from-rose-600 to-pink-600',
  'from-amber-600 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-slate-700 to-indigo-900',
];

export function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

interface UserAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'rounded' | 'circle';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = 'md',
  className = '',
  shape = 'rounded'
}) => {
  const initials = getInitials(name);
  const gradient = getAvatarGradient(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg'
  }[size];

  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  return (
    <div
      className={`inline-flex items-center justify-center font-bold text-white bg-gradient-to-tr ${gradient} shadow-xs ring-1 ring-white/20 select-none shrink-0 ${sizeClasses} ${shapeClasses} ${className}`}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
};
