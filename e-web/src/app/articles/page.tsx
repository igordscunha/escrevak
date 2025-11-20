import Link from "next/link";
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

interface ArticlesPageProps {
  searchParams?: {
    search?: string; // parâmetro 'search' da url
  }
};

function SearchForm({ initialSearch = ''}: { initialSearch: string }){
  return(
    <form action="/articles" method="GET" className="mb-8 w-full max-w-lg mx-auto">
      <div className="flex rounded-lg shadow-sm border border-[#2f3e46] overflow-hidden">
        <input
          type="search"
          name="search" // O nome 'search' corresponde ao parâmetro esperado pela API
          placeholder="Procurar artigos por título ou tag..."
          defaultValue={initialSearch} // Preenche com a pesquisa atual
          className="flex-grow p-3 bg-[#2f3e46] text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          className="bg-[#52796F] hover:bg-[#CAD2C5] text-white hover:text-[#52796F] px-6 py-3 font-semibold transition-colors"
        >
          Procurar
        </button>
      </div>
    </form>    
  )
}

function trunkedWords(text: string, addEllipsis: boolean){
  if(!text) return;
  const maxWords: number = 50;
  const words: string[] = text.trim().split(/\s+/);

  if(words.length <= maxWords) return text;

  const result = words.slice(0, maxWords).join(' ');

  return addEllipsis ? result + '...' : result;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps){
  const searchTerm = searchParams?.search || '';
  const articles: Article[] = await getArticles(searchTerm);

  return (
    <div className="min-h-screen container mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#2f3e46]">Últimos Artigos</h1>
      
      {/* Pesquisa */}
      <SearchForm initialSearch={searchTerm}/>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 py-16 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0,3).map((article) => (
            <Link href={`/articles/${article.id}`} key={article.id}>
              <div key={article.id} className="cursor-pointer bg-[#2f3e46] rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
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
                  <p className="text-gray-400 mb-4 min-h-20 overflow-hidden">{trunkedWords(article.content, true)} Leia mais...</p>
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
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-20">
          <h2 className="text-2xl">{searchTerm ? 'Nenhum artigo encontrado para "' + searchTerm + '"' : 'Nenhum artigo encontrado.'}</h2>
          <p>{searchTerm ? 'Tente uma pesquisa diferente.' : 'Seja o primeiro a criar um no portal!'}</p>
        </div>
      )}
    </div>
  );
}