'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { Button } from './Button';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ backgroundColor: '#2563eb', color: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
          🎫 Fidelizarei
        </Link>

        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/programas" style={{ color: 'white', textDecoration: 'none' }}>Programas</Link>
          <Link href="/qrcodes" style={{ color: 'white', textDecoration: 'none' }}>QR Codes</Link>
          <Link href="/clientes" style={{ color: 'white', textDecoration: 'none' }}>Clientes</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px' }}>{user.nome}</span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );
}
