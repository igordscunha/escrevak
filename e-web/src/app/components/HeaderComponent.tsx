'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function HeaderComponent() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Redireciona para a home após o logout
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-sky-400 hover:text-sky-300 transition-colors">
          Escrevak
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-sky-400 transition-colors">Home</Link>
          <Link href="/portal" className="hover:text-sky-400 transition-colors">Portal</Link>
          
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
            <Link href="/login" className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg transition-colors">
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
