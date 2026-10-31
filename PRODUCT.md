++ 
++ # PRODUCT.md — Professor do Futuro
++ 
++ ## Produto
++ **Professor do Futuro** — Curso + Laboratório de IA para educadores (Educação Infantil ao Ensino Médio) com foco em inclusão (AEE, TEA, TDAH), gestão de sala e criação de materiais didáticos.
++ 
++ ## Promessa central
++ **Diminuir a carga horária do professor** transformando horas de preparação em minutos, com materiais prontos para usar, adaptados para inclusão e validados em sala de aula real.
++ 
++ ## Mecanismo diferenciador (moat)
++ 1. **Laboratório integrado (11 ferramentas no navegador, sem IA externa)** — Semáforo da sala, gerador de plano de aula, quiz jogável, cronômetro, sorteador de grupos, rubrica à prova de IA, checklist de acessibilidade, combinados da turma, simplificador de texto, gerador de atividade e **Corretor de Redação ENEM (chave oficial Inep 0–1000)**.
++ 2. **Gerador de Atividade Pronta com IA gratuita** — Entrega folha A4 completa: texto explicativo, questões, caça-palavras, gabarito e **adaptações para TDAH/TEA**, pronta para imprimir ou salvar PDF. Funciona offline (modo degradado) quando sem internet/chave.
++ 3. **Chat/IA exclusiva do professor** — Assistente conversacional dedicado (tutor, corretor, gerador) que conhece o contexto do curso e responde ao vivo — não é wrapper genérico de ChatGPT.
++ 4. **Curso completo 6 módulos (24h)** — Slides com IA, Inclusão/AEE, IA na prática escolar, Gestão de sala, Educação Financeira (BNCC Bloco 1 EM), Nanotecnologia interdisciplinar. **82 slides do curso + 119 slides em 10 coleções temáticas**.
++ 5. **58 prompts prontos (copiar/colar)** organizados por módulo + 16 prompts "100% prontos" sem edição.
++ 6. **Funciona na realidade brasileira** — Pensado para escolas com pouca estrutura e pouca internet; materiais funcionam offline ou em modo degradado.
++ 
++ ## Usuários & Jobs-to-be-Done
++ 
++ | Perfil | Situação | Job principal | Jobs secundários |
++ |--------|----------|---------------|------------------|
++ | **Professor (EI–EM)** | Sala de aula, pouco tempo, turmas diversas (incl. TEA/TDAH) | Criar materiais didáticos inclusivos em minutos | Corrigir redações ENEM, gerenciar comportamento, planejar aulas, adaptar para AEE |
++ | **Professor AEE / Inclusão** | Atendimento especializado, precisa de CAA, pictogramas, Easy Read | Produzir materiais acessíveis sem depender de designer | Checklist de acessibilidade, simplificador de texto, gerador de atividade adaptada |
++ | **Coordenador pedagógico** | Apoia equipe, padroniza qualidade, compra para escola | Capacitar professores em IA com método testado | Biblioteca de slides, banco de prompts, relatórios de uso |
++ | **Secretaria / Mantenedora (B2B)** | Decide compra para rede/escola, olha custo-benefício e aderência BNCC | Contratar formação completa com ferramentas práticas | Página B2B em `vendas/`, checkout Mercado Pago, prospecção |
++ 
++ ## Restrições duráveis (não-negociáveis)
++ - **Stack**: HTML/CSS/JS puro (sem build, sem framework, sem bundler). Arquivos abrem direto no navegador ou via servidor estático.
++ - **Auth**: Supabase Auth (e-mail + senha). **Admin cria contas** via `criar_conta.js` (service_role). **Não existe cadastro público**. Não mexer na arquitetura Supabase — apenas corrigir bugs se houver.
++ - **Hospedagem**: Vercel (site principal) + Supabase (Auth/DB).
++ - **Preço**: Não alterar (definido em `vendas/`).
++ - **Identidade**: "Educação / Tecnologia / Inclusão" — paleta indigo/teal/dourado, ícone 🎓, slogan "Diminua sua carga horária".
++ - **Conteúdo base**: 6 módulos `.md`, 82+119 slides, 58 prompts, PDFs de referência — preservar substância; apresentação pode evoluir.
++ - **Acessibilidade**: WCAG AA mínimo; ferramentas devem funcionar para TEA/TDAH (modo semáforo, simplificador, adaptações).
++ - **Offline-first**: Ferramentas do Laboratório rodam no navegador sem IA externa; gerador de atividade tem fallback offline.
++ 
++ ## Plataforma
++ **Web** (site estático + Supabase Auth/Functions). Não é app nativo (iOS/Android). Mobile web é alvo prioritário.
++ 
++ ## Stack técnica
++ - **Frontend**: HTML5, CSS3 (custom properties, grid/flex, `prefers-reduced-motion`, `prefers-color-scheme`), ES6 modules (IIFE pattern)
++ - **Auth/Backend**: Supabase (Auth, Edge Functions para IA do gerador de atividade, Storage se necessário)
++ - **Deploy**: Vercel (static) + Supabase (managed)
++ - **Ferramentas locais**: `iniciar-site.bat` (Python http.server), `criar_conta.js` (Node + service_role), `deploy-ia.bat`
++ - **Sem**: TypeScript, React, Vue, Vite, Webpack, Tailwind, npm scripts de build
++ 
++ ## Superfícies (routes)
++ 
++ ### Site principal (`site/`)
++ - `index.html` — Hero, hub 4 categorias, 6 módulos, benefícios, CTA
++ - `curso.html` — Estrutura completa do curso
++ - `modulos.html` — Conteúdo detalhado dos 6 módulos + checklists
++ - `ferramentas.html` — **Laboratório do Professor** (11 ferramentas + Corretor ENEM + Gerador Atividade IA)
++ - `slides.html` — Biblioteca 82 slides + 10 coleções (119 slides) + modo apresentação (teclado, fullscreen)
++ - `prompts.html` — Banco 58 prompts com filtro/cópia
++ - `leitura.html` — Biblioteca de leitura/trilha
++ - `perguntas.html` — FAQ / dúvidas frequentes
++ - `login.html` / `register.html` — Auth (login + solicitar acesso)
++ 
++ ### Site de vendas (`vendas/`) — repositório próprio, embutido
++ - Página de vendas B2C, página B2B para escolas, termos, privacidade, checkout Mercado Pago
++ - `vendas/prospeccao/` — Material de prospecção
++ 
++ ## Métricas de sucesso (leading indicators)
++ - **Ativação**: % de contas criadas que acessam `ferramentas.html` na 1ª semana
++ - **Retenção**: % de professores que usam ≥3 ferramentas diferentes em 30 dias
++ - **Adoção B2B**: # escolas/secretarias convertidas via `vendas/`
++ - **NPS qualitativo**: "Conseguiu diminuir carga horária?" (pesquisa no curso)
++ 
++ ## Riscos & Debs conhecidos
++ - **Visual "AI slop" detectado**: side-tabs (bordas grossas), gradient-text, grid decorativo, low-contrast em slides.html, dark-glow — precisa refino (critique/polish)
++ - **Supabase Functions** para IA do gerador: custo/latência; fallback offline mitiga
++ - **Sem testes automatizados** — validação manual
++ - **SEO**: meta tags presentes, mas sem sitemap/structured data
++ 
++ ## Próximos passos sugeridos (pós-init)
++ 1. `$impeccable document site` — registrar DESIGN.md do sistema visual atual
++ 2. `$impeccable critique site` — auditoria completa (hierarquia, layout, tipo, cor, motion, copy, a11y, edge cases)
++ 3. `$impeccable polish site` — corrigir backlog P0/P1 (side-tabs, gradient-text, contraste, padding, glows)
++ 4. `$impeccable adapt site` — garantir mobile-first responsivo e acessível
++ 
++ ---
++ *Gerado via `impeccable init` — verdades de produto capturadas em 30/10/2026.*
++ 
++ *Para alterar: edite este arquivo. Não sobrescreva sem razão explícita do usuário.*