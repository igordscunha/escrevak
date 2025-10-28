import { azeretMono, lekton } from "./fonts/fonts";

export default function HomePage() {
  return(
    <main className="min-h-screen p-6 flex flex-col items-center">
      <div className="text-center flex flex-col gap-6">
        <h4 className={`${azeretMono.className} text-3xl font-semibold tracking-tight`}>Faça o mundo ouvir sua voz.</h4>
        <div className={`text-lg ${lekton.className} font-bold`}>
          <p>Crie artigos. Compartilhe-os.</p>
          <p>Fácil. Prático.</p>
        </div>
      </div>
    </main>
  )
};