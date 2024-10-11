export default function ProductsLoading() {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-100 gap-12">
        <div className="max-w-[1280px] w-screen flex flex-wrap h-full gap-6">
          {/* Reduce the number of large animated placeholders to improve performance */}
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="w-1/4 h-1/2 max-w-[350px] max-h-[400px] m-auto my-6 rounded-lg bg-slate-300 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  