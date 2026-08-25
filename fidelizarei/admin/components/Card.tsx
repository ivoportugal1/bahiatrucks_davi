import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 24 }}>
      {title && <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: 4 }}>{title}</h2>}
      {description && <p style={{ color: '#64748b', fontSize: '14px', marginBottom: 16 }}>{description}</p>}
      {children}
    </div>
  );
}
