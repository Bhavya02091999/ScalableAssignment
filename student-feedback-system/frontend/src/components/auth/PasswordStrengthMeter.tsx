'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export function PasswordStrengthMeter({ 
  password, 
  className 
}: PasswordStrengthMeterProps) {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[a-z]/.test(password)) score += 1; // Lowercase
    if (/[A-Z]/.test(password)) score += 1; // Uppercase
    if (/[0-9]/.test(password)) score += 1; // Numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // Special chars
    
    // Cap the score at 5 for our meter
    return Math.min(score, 5);
  }, [password]);
  
  const strengthText = useMemo(() => {
    if (!password) return '';
    
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  }, [password, strength]);
  
  const strengthColor = useMemo(() => {
    if (!password) return 'bg-gray-200';
    
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  }, [password, strength]);
  
  if (!password) return null;
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={cn('h-1.5 rounded-full transition-all duration-300', strengthColor)}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Password strength: {strengthText}</span>
        <span className="text-right">
          {password.length > 0 && `${password.length} characters`}
        </span>
      </div>
    </div>
  );
}
