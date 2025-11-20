'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';
import { useRouter } from 'next/navigation';
import { HeaderDropdownMenu } from './HeaderDropdownMenu';

export default function HeaderComponent() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="relative flex justify-center items-center bg-[#52796F] w-full min-h-20 text-white shadow-lg/20 z-20">
      <nav className="container mx-auto md:w-2/3 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg md:text-2xl font-bold text-[#CAD2C5] transition-colors">
          Escrevak
        </Link>

        {/* MOBILE */}

        <HeaderDropdownMenu />

        {/* DESKTOP */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/articles" className="hover:text-[#c0c4bc] transition-colors">Artigos</Link>
          <Link href="/portal" className="hover:text-[#c0c4bc] transition-colors">Portal</Link>

          {isLoading ? (
            <div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Olá, {user?.name}</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">
                Sair
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-[#CAD2C5] hover:bg-[#52796F] border border-[#CAD2C5] hover:border hover:border-[#CAD2C5] px-4 py-2 rounded-lg transition-colors">
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
