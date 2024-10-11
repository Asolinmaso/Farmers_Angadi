function PulseLoader({ className }: { className: string }) {
    return <div className={`bg-slate-300 animate-pulse ${className}`}></div>;
  }
  
  export default function Loading() {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-100 gap-12">
        <PulseLoader className="w-full h-1/3" />
        <div className="w-9/12 h-1/3 flex items-center justify-between gap-6">
          <PulseLoader className="w-1/2 h-64 rounded-lg" />
          <PulseLoader className="w-1/2 h-64 rounded-lg" />
        </div>
        <div className="w-10/12 h-1/3 bg-slate-300 animate-pulse flex flex-col items-center justify-center gap-4">
          <PulseLoader className="w-8/12 bg-slate-400 rounded-full h-4" />
          <PulseLoader className="w-6/12 bg-slate-400 rounded-full h-4" />
          <PulseLoader className="w-4/12 bg-slate-400 rounded-full h-4" />
          <div className="flex items-center justify-between w-9/12">
            <PulseLoader className="rounded-lg px-24 py-6 w-20 bg-slate-400" />
            <PulseLoader className="rounded-lg px-24 py-6 w-20 bg-slate-400" />
            <PulseLoader className="rounded-lg px-24 py-6 w-20 bg-slate-400" />
          </div>
        </div>
      </div>
    );
  }
  