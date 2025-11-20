import { ReactNode } from "react"

interface BotaoCtaProps {
  children: ReactNode;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export function BotaoCta({ children, textColor, bgColor, borderColor }: BotaoCtaProps){
  function norm(element: string){
    return element.startsWith('#') ? element : `#${element}`;
  }
  
  return(
    <button 
      style={{ color: norm(textColor), backgroundColor: norm(bgColor), borderColor: norm(borderColor) }}
      className={`border px-6 py-3 rounded-xl hover:scale-115 transform transition-transform duration-500 ease-in-out`} type="button"
    >
      {children}
    </button>
  )
};