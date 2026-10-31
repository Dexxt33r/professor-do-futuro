import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-slate-200 selection:bg-emerald-500/30">
      {/* Ambient Background Meshes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] h-[40rem] w-[40rem] rounded-full bg-emerald-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[0%] h-[30rem] w-[30rem] rounded-full bg-teal-500/15 blur-[100px]" />
        <div className="absolute bottom-[5%] left-[20%] h-[35rem] w-[35rem] rounded-full bg-cyan-600/10 blur-[110px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
            <span className="text-lg font-bold tracking-tight text-white">Professor do Futuro</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400">Recursos</a>
            <a href="#metrics" className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400">Resultados</a>
            <a href="#faq" className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400">FAQ</a>
          </div>
          <Link
            href="/vendas"
            className="group relative overflow-hidden rounded-full bg-white/5 px-6 py-2 text-sm font-semibold text-emerald-400 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <span className="relative z-10">Área de Membros</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="glass-panel mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Nova plataforma 2.0 disponível
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-7xl">
          Educação inteligente para <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">mentes extraordinárias</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
          Transforme sua jornada de aprendizado com nossa metodologia adaptativa.
          Tecnologia de ponta e pedagogia humanizada em perfeita harmonia.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/vendas"
            className="group relative overflow-hidden rounded-xl bg-emerald-500 px-8 py-4 text-base font-bold text-[#050505] shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"
          >
            Começar Agora
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <button className="flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver Demonstração
          </button>
        </div>

        {/* Floating Glass Cards Preview */}
        <div className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { title: 'Metodologia Ativa', desc: 'Aprendizado baseado em projetos reais e resolução de problemas.', icon: '🧠' },
            { title: 'Mentoria Personalizada', desc: 'Acompanhamento próximo com especialistas da área.', icon: '🎯' },
            { title: 'Certificação Global', desc: 'Reconhecimento internacional das suas competências.', icon: '🌍' },
          ].map((item, i) => (
            <div key={i} className="glass-panel group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.15)]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl ring-1 ring-white/10">{item.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="relative z-10 border-y border-white/5 bg-black/20 py-24 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[
            { value: '+15k', label: 'Alunos Ativos' },
            { value: '98%', label: 'Taxa de Aprovação' },
            { value: '4.9/5', label: 'Satisfação Média' },
            { value: '+200', label: 'Empresas Parceiras' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-white md:text-5xl">{stat.value}</div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wider text-emerald-500/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Deep Dive */}
      <section id="features" className="relative z-10 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Tecnologia a favor do seu potencial</h2>
            <p className="mt-4 text-lg text-slate-400">Nossa plataforma utiliza algoritmos avançados para adaptar o conteúdo ao seu ritmo de aprendizado.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-panel group relative overflow-hidden rounded-3xl p-8 transition-all hover:border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-6 h-1 w-12 rounded-full bg-emerald-500/50 transition-all group-hover:w-20 group-hover:bg-emerald-400" />
                  <h3 className="mb-3 text-xl font-bold text-white">Recurso Avançado {i}</h3>
                  <p className="text-slate-400">Descrição detalhada sobre como este recurso específico ajuda no desenvolvimento profissional e acadêmico do aluno.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <details key={i} className="glass-panel group rounded-2xl open:border-emerald-500/30">
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-lg font-semibold text-white [&::-webkit-details-marker]:hidden">
                  Como funciona a metodologia de ensino?
                  <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition-transform group-open:rotate-45">
                    <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-400">
                  Nossa metodologia combina aulas ao vivo, conteúdos gravados em alta qualidade e projetos práticos supervisionados por mentores experientes.
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#020202] py-12 text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-400 to-teal-600" />
            <span className="font-semibold text-slate-300">Professor do Futuro</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-400">Termos</a>
            <a href="#" className="hover:text-emerald-400">Privacidade</a>
            <a href="#" className="hover:text-emerald-400">Contato</a>
          </div>
          <div>© 2024 Todos os direitos reservados.</div>
        </div>
      </footer>
    </div>
  );
}