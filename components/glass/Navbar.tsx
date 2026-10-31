'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { Menu, X, Zap, Users, Sparkles } from 'lucide-react';

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Início' },
    { href: '/#features', label: 'Recursos' },
    { href: '/#metrics', label: 'Resultados' },
    { href: '/#faq', label: 'Dúvidas' },
    { href: '/vendas', label: 'Comprar' },
  ];

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[rgba(18,44,33,0.62)] dark:bg-[rgba(18,44,33,0.78)] shadow-[0_10px_30px_-6px_rgba(0,0,0,0.08)]'
          : 'bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(18,44,33,0.78)] backdrop-blur-lg -webkit-backdrop-blur-lg border-b border-[rgba(255,255,255,0.18)] dark:border-[rgba(255,255,255,0.06)]',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-deep via-brand-teal to-brand-gold text-white text-xl shadow-lg">
              <Zap size={1.5} />
            </div>
            <span className="font-head font-bold text-xl tracking-tight text-brand-ink dark:text-white">
              Professor <span className="text-brand-gold">do Futuro</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-brand-mute hover:text-brand-deep dark:hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/vendas"
              className="px-5 py-2.5 rounded-full bg-gradient-to-br from-brand-deep via-brand-teal to-brand-gold text-white text-sm font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Comprar Agora
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-[rgba(255,255,255,0.4)] dark:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.35)] dark:border-[rgba(255,255,255,0.12)] text-brand-ink dark:text-white"
            aria-label="Abrir menu"
          >
            {isOpen ? <X size={1.5} /> : <Menu size={1.5} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm -webkit-backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      {isOpen && (
        <div className="fixed top-20 right-0 w-72 h-[calc(100vh-80px)] z-50 bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(18,44,33,0.9)] backdrop-blur-xl -webkit-backdrop-blur-xl border-l border-[rgba(255,255,255,0.35)] dark:border-[rgba(255,255,255,0.12)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] transform transition-transform duration-300 translate-x-0">
          <div className="p-6 space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-brand-ink dark:text-white hover:bg-brand-paper-soft dark:hover:bg-brand-deep/30 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/vendas"
              className="block px-4 py-3 rounded-full text-center bg-gradient-to-br from-brand-deep via-brand-teal to-brand-gold text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Comprar Agora
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
