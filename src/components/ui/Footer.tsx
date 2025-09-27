'use client';

export function Footer() {
  return (
    <footer className="fixed bottom-0 h-16 w-full glass-strong border-t border-blue-500/20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center text-sm gap-4 text-slate-300/80">
          <div className="flex items-center gap-2">
            <span>Desarrollado con ❤️ por</span>
            <a 
              href="https://juanalvarez.pro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium hover:underline"
            >
              juanalvarez.pro
            </a>
          </div>
          <div className="text-slate-400/60">
            2025
          </div>
        </div>
      </div>
    </footer>
  );
}
