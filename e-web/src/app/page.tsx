import Link from "next/link";
import { BotaoCta } from "./components/BotaoCta";
import { azeretMono, lekton } from "./fonts/fonts";

export default function HomePage() {
  return(
    <main className="min-h-screen p-6 flex flex-col gap-32 md:gap-0 py-40 md:py-0 md:justify-evenly items-center">
      <div className="text-center md:text-start flex flex-col gap-2 text-[#52796F] md:w-2/5">
        <p className="">Onde grandes ideias encontram seu público.</p>
        <h2 className={`${azeretMono.className} text-3xl tracking-tight`}>Faça o mundo ouvir sua voz.</h2>
        <p className={`text-lg ${lekton.className}`}>A plataforma aberta para criadores de conteúdo, leitores curiosos e mentes que se conectam.</p>
      </div>

      <div className="flex gap-8">
        <Link href={"/portal"}><BotaoCta textColor="EEF0FB" bgColor="52796F" borderColor="52796F">Começar a escrever</BotaoCta></Link>
        <Link href={"/articles"}><BotaoCta textColor="EEF0FB" bgColor="52796F" borderColor="52796F">Ler artigos</BotaoCta></Link>
      </div>
    </main>
  )
};