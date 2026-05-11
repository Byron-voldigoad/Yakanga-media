export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col 
                    items-center justify-center gap-8">
      
      <div className="text-5xl font-black tracking-tight">
        <span className="text-green-700">Y</span>
        <span className="text-gray-900">akan</span>
        <span className="text-green-700">ga</span>
      </div>

      <p className="text-sm text-gray-400 italic">
        La mémoire des cultures contemporaines
      </p>

      <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-green-700 rounded-full"
             style={{ animation: 'slideRight 1.5s ease-in-out infinite' }}
        />
      </div>

      <style>{`
        @keyframes slideRight {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
