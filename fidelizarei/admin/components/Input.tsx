import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '8px 12px',
          border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          borderRadius: 6,
          fontSize: '16px',
        }}
        {...props}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}
