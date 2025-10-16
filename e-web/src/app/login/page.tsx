'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/auth-context';
import { loginUser, registerUser } from '@/app/services/credential-service';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        await registerUser({ name, lastname, email, password });
        alert('Registo realizado com sucesso! Faça o login.');
        setIsRegistering(false);
      } else {
        const data = await loginUser({ email, password });
        login(data.token);
        router.push('/portal');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">{isRegistering ? 'Criar Conta' : 'Aceder à Plataforma'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <>
              <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input type="text" placeholder="Apelido" value={lastname} onChange={e => setLastname(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </>
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-sky-600 rounded-md hover:bg-sky-700 transition disabled:opacity-50">
            {isLoading ? 'A processar...' : (isRegistering ? 'Registar' : 'Entrar')}
          </button>
          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>
        <p className="text-center text-sm text-gray-400">
          {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button onClick={() => setIsRegistering(!isRegistering)} className="ml-2 font-medium text-sky-400 hover:underline">
            {isRegistering ? 'Faça o login' : 'Registe-se'}
          </button>
        </p>
      </div>
    </div>
  );
}
