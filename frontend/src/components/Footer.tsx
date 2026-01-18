import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2025 AutoBiz AI
          </p>
          <p className="text-xs text-muted-foreground">
            Real-time market data powered by Yahoo Finance
          </p>
        </div>
      </div>
    </footer>
  );
}
