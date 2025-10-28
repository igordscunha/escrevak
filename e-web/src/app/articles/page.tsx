import { getArticles } from "../services/credential-service";
import Image from 'next/image';

type Article = {
  id: number;
  title: string;
  image: string;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    lastname: string;
    profile_picture?: string;
  };
};

export default async function ArticlesPage(){
  const articles: Article[] = await getArticles(); // Diretamente no servidor - assíncrono

  return (
    <div className="min-h-screen container mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-8 text-center text-sky-400">Últimos Artigos</h1>
      
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0,3).map((article) => (
            <div key={article.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative w-full h-48">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  layout="fill" 
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-white h-24 overflow-hidden">{article.title}</h2>
                <p className="text-gray-400 mb-4 h-20 overflow-hidden">{article.content.substring(0, 100)}...</p>
                <div className="text-right text-sm text-sky-400 flex justify-end items-center gap-4">
                  <span>
                    Por {article.user.name} {article.user.lastname}
                  </span>
                  {article.user.profile_picture ? 
                    (
                      <div className="flex">
                        <Image src={article.user.profile_picture} alt={"Foto de " + article.user.name} width={42} height={42} className="rounded-full"/>
                      </div>
                    ) : null
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-20">
          <h2 className="text-2xl">Nenhum artigo encontrado.</h2>
          <p>Seja o primeiro a criar um no portal!</p>
        </div>
      )}
    </div>
  );
}