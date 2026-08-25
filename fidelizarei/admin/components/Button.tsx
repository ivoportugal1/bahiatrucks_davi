import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    borderRadius: 6,
    fontWeight: 500,
    border: 'none',
    transition: 'all 0.2s',
    cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
  };

  const variantStyle = {
    primary: { backgroundColor: '#2563eb', color: 'white' },
    secondary: { backgroundColor: '#e2e8f0', color: '#0f172a' },
    danger: { backgroundColor: '#dc2626', color: 'white' },
  }[variant];

  const sizeStyle = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '8px 16px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '18px' },
  }[size];

  return (
    <button
      style={{ ...baseStyle, ...variantStyle, ...sizeStyle, ...style }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  );
}
