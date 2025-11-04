'use client'

import { useAuth } from '@/app/contexts/auth-context';
import React, { useState, useRef, useEffect, JSX } from 'react';
import { createArticle } from '@/app/services/credential-service';
import { useRouter } from 'next/navigation';
import { LoadingComponent } from '../components/LoadingComponent';

const UploadIcon = (): JSX.Element => ( <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> );
interface CharacterCounterProps { count: number; max: number }
const CharacterCounter = ({ count, max }: CharacterCounterProps): JSX.Element => { const progress = (count / max) * 100; const strokeColor = progress > 90 ? 'stroke-red-500' : 'stroke-sky-500'; return ( <div className="relative w-16 h-16"><svg className="w-full h-full" viewBox="0 0 36 36"><path className="stroke-current text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" /><path className={`transition-all duration-300 ease-in-out ${strokeColor}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" /></svg><div className="absolute top-0 left-0 flex items-center justify-center w-full h-full"><span className="text-sm font-semibold text-gray-300">{count}</span></div></div> ); };

function ArticleForm(): JSX.Element {
  const { token } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 15000;

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); if (!ctx) return;
      const img = new Image(); img.src = imageSrc;
      img.onload = () => {
        const canvasAspect = canvas.width / canvas.height; const imgAspect = img.width / img.height;
        let sx, sy, sWidth, sHeight;
        if (imgAspect > canvasAspect) { sHeight = img.height; sWidth = sHeight * canvasAspect; sx = (img.width - sWidth) / 2; sy = 0; } else { sWidth = img.width; sHeight = sWidth / canvasAspect; sx = 0; sy = (img.height - sHeight) / 2; }
        ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [imageSrc]);

  const handleFileSelect = (file: File | null | undefined) => { if (file && file.type.startsWith('image/')) { setImageFile(file); const reader = new FileReader(); reader.onload = (e: ProgressEvent<FileReader>) => { if (typeof e.target?.result === 'string') { setImageSrc(e.target.result); } }; reader.readAsDataURL(file); } };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; handleFileSelect(file); };
  const onUploadAreaClick = () => { if (fileInputRef.current) { fileInputRef.current.click(); } };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; handleFileSelect(file); };
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && currentTag.trim() !== '') { e.preventDefault(); if (!tags.includes(currentTag.trim())) { setTags([...tags, currentTag.trim()]); } setCurrentTag(''); } };
  const removeTag = (tagToRemove: string) => { setTags(tags.filter(tag => tag !== tagToRemove)); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) { alert('Por favor, selecione uma imagem de destaque.'); return; }
    if (!token) { alert('A sua sessão expirou. Será redirecionado para o login.'); router.push('/login'); return; }

    setIsSubmitting(true); setSubmitStatus('idle');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));
    formData.append('articleImage', imageFile);

    try {
      await createArticle(formData, token);
      setSubmitStatus('success');
      setTimeout(() => { router.push('/'); }, 2000);
    } catch (error: any) {
      console.error('Erro no envio:', error);
      setSubmitStatus('error');
      alert(`Erro ao publicar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <header className="text-center mb-10"><h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">Crie o seu Artigo</h1><p className="text-gray-400 mt-2">Partilhe as suas ideias com o mundo.</p></header>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col"><label htmlFor="title" className="mb-2 font-semibold text-gray-400">Título do Artigo</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="O Futuro da Inteligência Artificial" className="p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300" required /></div>
          <div className="flex flex-col flex-grow"><label htmlFor="content" className="mb-2 font-semibold text-gray-400">Conteúdo</label><div className="relative flex-grow"><textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} maxLength={MAX_CHARS} placeholder="Comece a escrever a sua história aqui..." className="w-full h-full min-h-[300px] p-4 bg-gray-800 border-2 border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300" required /><div className="absolute bottom-4 right-4"><CharacterCounter count={content.length} max={MAX_CHARS} /></div></div></div>
          <div className="flex flex-col"><label htmlFor="tags" className="mb-2 font-semibold text-gray-400">Temas / Tags</label><div className="flex flex-wrap items-center p-2 bg-gray-800 border-2 border-gray-700 rounded-lg">{tags.map(tag => (<div key={tag} className="flex items-center bg-sky-500/20 text-sky-300 rounded-full px-3 py-1 text-sm mr-2 mb-2"><span>{tag}</span><button type="button" onClick={() => removeTag(tag)} className="ml-2 text-sky-200 hover:text-white">&times;</button></div>))}<input id="tags" type="text" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Adicionar tema..." className="flex-grow p-2 bg-transparent outline-none min-w-[120px]" /></div></div>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-400">Imagem de Destaque</label>
          <div className={`relative flex-grow w-full border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 ${isDragging ? 'border-sky-500 bg-gray-800/50' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <canvas ref={canvasRef} width="600" height="400" className={`rounded-lg transition-opacity duration-500 ${imageSrc ? 'opacity-100' : 'opacity-0'}`} />
            {!imageSrc && (<div className="absolute text-center text-gray-500 cursor-pointer" onClick={onUploadAreaClick}><UploadIcon /><p className="mt-2">Arraste e solte ou <span className="text-sky-400 font-semibold">clique aqui</span></p><p className="text-sm">PNG, JPG, WEBP (Recomendado: 1200x800px)</p></div>)}
            {imageSrc && (<button type="button" onClick={onUploadAreaClick} className="absolute bottom-4 right-4 bg-gray-900/70 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition-all">Trocar Imagem</button>)}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*" className="hidden" />
        </div>
        <div className="lg:col-span-2 mt-4">
          <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
            {isSubmitting ? 'A publicar...' : 'Publicar Artigo'}
          </button>
          {submitStatus === 'success' && <p className="text-green-400 text-center mt-4">Artigo publicado com sucesso! A redirecionar...</p>}
          {submitStatus === 'error' && <p className="text-red-400 text-center mt-4">Ocorreu um erro. Tente novamente.</p>}
        </div>
      </form>
    </div>
  );
}

export default function PortalPage(): JSX.Element {

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!isLoading && !isAuthenticated){
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if(isLoading || !isAuthenticated){
    return <LoadingComponent />
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <ArticleForm />
    </div>
  ); 
}
