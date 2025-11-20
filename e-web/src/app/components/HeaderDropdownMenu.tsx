'use client'

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import Link from "next/link";


const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 .54 1.73v.5a2 2 0 0 1-.54 1.73l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-.54-1.73v-.5a2 2 0 0 1 .54 1.73l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  { name: 'Artigos', icon: <HomeIcon className="w-5 h-5" />, href: '/articles' },
  { name: 'Portal', icon: <UserIcon className="w-5 h-5" />, href: '/portal' },
  { name: 'Sair', icon: <SettingsIcon className="w-5 h-5" />, href: '' },
  { name: 'Entrar', icon: <SettingsIcon className="w-5 h-5"/>, href: '/login'}
];

export const HeaderDropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionsMenuStyle = 'flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors';
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative md:hidden">
      {/* Botão de Toggle (Hamburger) */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none z-50"
        aria-label="Abrir menu"
      >
        {/* Animação de fade entre os ícones */}
        <div className={`text-[#CAD2C5] transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
          <MenuIcon className="w-6 h-6" />
        </div>
        <div className={`text-[#CAD2C5] absolute top-2 left-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <CloseIcon className="w-6 h-6" />
        </div>
      </button>

      {/* Painel do Dropdown */}
      <div
        className={`
          absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-40
          border border-gray-100 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
      >
        <nav className="flex flex-col p-2">
          {/* {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)} // Fecha o menu ao clicar no item
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </a>
            ))} */}
            <Link href={menuItems[0].href} className={optionsMenuStyle} onClick={() => setIsOpen(false)}>{menuItems[0].icon}<span className="font-medium text-sm">{menuItems[0].name}</span></Link>
            <Link href={menuItems[1].href} className={optionsMenuStyle} onClick={() => setIsOpen(false)}>{menuItems[1].icon}<span className="font-medium text-sm">{menuItems[1].name}</span></Link>
            {isAuthenticated 
              ?
              (<button onClick={() => logout()} className={optionsMenuStyle}>{menuItems[2].icon}<span className="font-medium text-sm">{menuItems[2].name}</span></button>)
              :
              (<Link href={menuItems[3].href} className={optionsMenuStyle} onClick={() => setIsOpen(false)}>{menuItems[3].icon}<span className="font-medium text-sm">{menuItems[3].name}</span></Link>)
            }
        </nav>
      </div>
    </div>
  );
};