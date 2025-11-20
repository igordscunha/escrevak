export const LoadingComponent: React.FC = () => {
  return (
    <main className="flex min-h-screen w-full justify-center items-center bg-[#CAD2C5]">
      <div className="matrix-loader-wrapper">
        <div className="matrix-loader">
          <div className="cube">
            <div className="layer l1">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="layer l2">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="layer l3">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};