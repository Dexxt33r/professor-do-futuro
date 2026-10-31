'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="bg-brand-deep text-white/90 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-deep via-brand-teal to-brand-gold text-white text-xl shadow-lg">
                <Zap size={1.5} />
              </div>
              <span className="font-head font-bold text-xl tracking-tight text-white">
                Professor <span className="text-brand-gold">do Futuro</span>
              </span>
            </div>
            <p className="text-white/70 text-sm max-w-sm leading-relaxed">
              Educação fluida para mentes inquietas. Design system glassmorphism
              compartilhado entre site institucional e loja de vendas.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-brand-gold mb-4">Produto</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/#features" className="hover:text-brand-gold transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="/vendas" className="hover:text-brand-gold transition-colors">
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-gold transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-gold transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-brand-gold mb-4">Institucional</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="#" className="hover:text-brand-gold transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-gold transition-colors">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-gold transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-brand-gold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="#" className="hover:text-brand-gold transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-gold transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-gold transition-colors">
                  LGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/55 text-xs">
            © 2026 Professor do Futuro. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
