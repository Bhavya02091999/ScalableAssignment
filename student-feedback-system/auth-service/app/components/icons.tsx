import React from 'react';
import { Loader2, Mail, Lock, User, Github, GitBranch } from 'lucide-react';

// Define types for icon props
interface IconProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
}

// Create a simple Google icon component
const GoogleIcon: React.FC<IconProps> = ({ className = '', style = {} }) => {
  return (
    <span 
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg 
        width="1em" 
        height="1em" 
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{
          width: '1em',
          height: '1em',
        }}
      >
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
    </span>
  );
};

// Type for our icons
interface IconsType {
  [key: string]: React.ComponentType<IconProps>;
}

const Icons: IconsType = {
  logo: GitBranch as React.ComponentType<IconProps>,
  spinner: Loader2 as React.ComponentType<IconProps>,
  mail: Mail as React.ComponentType<IconProps>,
  lock: Lock as React.ComponentType<IconProps>,
  user: User as React.ComponentType<IconProps>,
  github: Github as React.ComponentType<IconProps>,
  google: GoogleIcon,
};

export default Icons;
