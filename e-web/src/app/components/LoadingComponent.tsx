export const LoadingComponent: React.FC = () => {
  return (
    <>
      <style>{`
        /* A animação customizada 'cosmic-rotate' é definida aqui para criar um 
          efeito único que não está disponível nas classes padrão do Tailwind.
        */
        @keyframes cosmic-rotate {
          0%, 100% {
            transform: scale(0.9) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 1;
          }
        }
        .cosmic-cube {
          animation: cosmic-rotate 3s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
          transform-origin: center;
        }
      `}</style>
      <div
        role="status"
        aria-label="Carregando"
        className="flex items-center justify-center w-full min-h-screen bg-gray-700"
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-28 h-28"
        >

          <defs>
            <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" /> {/* Roxo (purple-500) */}
              <stop offset="50%" stopColor="#ec4899" /> {/* Pink (pink-500) */}
              <stop offset="100%" stopColor="#f97316" /> {/* Laranja (orange-500) */}
            </linearGradient>
          </defs>

          <g>
            <rect
              x="35" y="35" width="30" height="30"
              fill="url(#cosmicGradient)"
              className="cosmic-cube"
              style={{ animationDelay: '0s' }}
              rx="5"
            />
            <rect
              x="35" y="35" width="30" height="30"
              fill="url(#cosmicGradient)"
              className="cosmic-cube"
              style={{ animationDelay: '-0.25s' }}
              rx="5"
            />
            <rect
              x="35" y="35" width="30" height="30"
              fill="url(#cosmicGradient)"
              className="cosmic-cube"
              style={{ animationDelay: '-0.5s' }}
              rx="5"
            />
             <rect
              x="35" y="35" width="30" height="30"
              fill="url(#cosmicGradient)"
              className="cosmic-cube"
              style={{ animationDelay: '-0.75s' }}
              rx="5"
            />
          </g>
        </svg>
      </div>
    </>
  );
};