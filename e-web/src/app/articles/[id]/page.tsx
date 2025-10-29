import { getArticleById } from "@/app/services/credential-service";
import { notFound } from "next/navigation";
import Image from 'next/image';

type Article = {
  id: number;
  title: string;
  image: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    lastname: string;
    profile_picture?: string;
  };
};

interface ArticleProps {
  params: {
    id: string // vem da pasta :id
  };
};

export default async function Article({ params }: ArticleProps){

  const article: Article | null = await getArticleById(params.id);
  if(!article){
    notFound(); // página 404 padrão do next
  }

  return(
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <article>
        {/* Título */}
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Informações do Autor */}
        <div className="flex items-center gap-4 mb-8">
          {article.user.profile_picture ? (
            <Image
              src={article.user.profile_picture}
              alt={"Foto de " + article.user.name}
              width={50}
              height={50}
              className="rounded-full"
            /> 
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-sky-400 font-bold">
              {article.user.name[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-white">
              Por {article.user.name} {article.user.lastname}
            </p>
            <p className="text-sm text-gray-400">
              Publicado em {new Date(article.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Imagem de Destaque */}
        <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8 shadow-xl">
          <Image
            src={article.image}
            alt={article.title}
            layout="fill"
            className="object-cover"
            priority // Diz ao Next.js para carregar esta imagem primeiro
          />
        </div>

        {/* Conteúdo do Artigo */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          {/* Usamos 'whitespace-pre-wrap' para respeitar as quebras de linha
            que o utilizador digitou no <textarea>
          */}
          <p className="whitespace-pre-wrap">
            {article.content}
          </p>
        </div>
        
        {/* Tags */}
        <div className="mt-12 flex flex-wrap gap-2">
          {article.tags?.map((tag) => (
            <span key={tag} className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </main>
  )
};