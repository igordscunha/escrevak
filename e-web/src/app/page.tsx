// Esta página buscará os artigos da sua API no futuro.
// Por agora, usamos dados mockados.

// Tipo para um artigo (deve corresponder ao seu model do backend)
type Article = {
  id: number;
  title: string;
  image: string;
  content: string;
  user: { name: string };
};

// Mock de dados
const mockArticles: Article[] = [
  { id: 1, title: 'O Futuro da Inteligência Artificial em 2025', image: 'https://placehold.co/600x400/0ea5e9/ffffff?text=IA', content: 'A IA continua a evoluir a um ritmo alucinante...', user: { name: 'Ana Silva' } },
  { id: 2, title: 'Guia Completo de Next.js 14', image: 'https://placehold.co/600x400/1e293b/ffffff?text=Next.js', content: 'Aprenda tudo sobre as novas features do Next.js...', user: { name: 'Bruno Costa' } },
  { id: 3, title: 'Explorando os Mistérios de Marte', image: 'https://placehold.co/600x400/ef4444/ffffff?text=Marte', content: 'As últimas descobertas dos rovers da NASA...', user: { name: 'Carla Dias' } },
];


export default function HomePage() {
  const articles = mockArticles; // No futuro: const articles = await fetchArticles();

  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-sky-400">Últimos Artigos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-white">{article.title}</h2>
              <p className="text-gray-400 mb-4">{article.content.substring(0, 100)}...</p>
              <div className="text-right text-sm text-sky-400">
                Por {article.user.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
