'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/auth-context';
import { loginUser, registerUser } from '@/app/services/credential-service';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthdate, setBirthdate] = useState(Date);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Remove tudo que não for dígito
    const maskedValue = value
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(maskedValue);
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]){
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if(previewUrl){
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('lastname', lastname);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('cpf', cpf);
        formData.append('datebirth', birthdate);
        if(profilePicture) {
          formData.append('profilePicture', profilePicture);
        }
        await registerUser(formData);
        alert('Registo realizado com sucesso!');
        setIsRegistering(false);
      } else {
        const data = await loginUser({ email, password });

        if(data.user && data.token){
          login(data.token, data.user);
          router.push('/');
        } else {
          throw new Error('Resposta de login inválida do servidor.')
        }
      }
    } catch (error) {
      console.error("Erro ao logar/registrar. cod: 31298", error)
      setError("Ops! Alguma coisa deu errado... Por favor, tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center">{isRegistering ? 'Criar Conta' : 'Entrar na plataforma'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              {/* Upload da Foto de Perfil */}
              <div className="flex flex-col items-center space-y-2">
                <label htmlFor="profilePictureInput" className="cursor-pointer">
                  <div className="flex items-center min-h-20 justify-center overflow-hidden hover:border-sky-500">
                    {previewUrl ? (
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-24 h-24 rounded-full border border-slate-200">
                          <img src={previewUrl} alt="Pré-visualização" className="w-full h-full rounded-full" />
                        </div>
                        <div>
                          <button className="text-gray-400 hover:text-blue-400 text-xs tracking-wider uppercase" onClick={() => setPreviewUrl(null)}>Apagar</button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs text-center hover:text-blue-400">Foto de Perfil</span>
                    )}
                  </div>
                </label>
                <input id="profilePictureInput" type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
              </div>
              <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required className="input-user" />
              <input type="text" placeholder="Sobrenome" value={lastname} onChange={e => setLastname(e.target.value)} required className="input-user" />
              <input type="text" placeholder="CPF" value={cpf} onChange={handleCpfChange} className="input-user" />
              <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} required className="input-user" />              
            </>
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="input-user" />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="input-user" />
          <button type="submit" className="w-full py-2 px-4 bg-sky-600 rounded-md hover:bg-sky-700 transition">{isRegistering ? 'Registar' : 'Entrar'}</button>
          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>
        <p className="text-center text-sm">
          {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="ml-2 text-sky-400 hover:underline">
            {isRegistering ? 'Faça o login' : 'Registe-se'}
          </button>
        </p>
      </div>
    </div>
  );
}
