# 🎓 Professor do Futuro

**Curso: Criação de Slides com IA, Inclusão e Gestão da Sala de Aula Digital**
Da Educação Infantil ao Ensino Médio, com foco em Educação Especial (AEE) e Gestão de Comportamento.

---

## 📁 Estrutura do projeto

| Arquivo | Conteúdo |
|---------|----------|
| `PLANO_DO_CURSO.md` | Plano geral: objetivos, carga horária, público-alvo, ferramentas e avaliação |
| `Modulo-1_Slides-com-IA.md` | Módulo 1 — Gamma, Canva, Tome, ChatGPT/Claude e adaptação por faixa etária |
| `Modulo-2_Inclusao-e-AEE.md` | Módulo 2 — CAA, pictogramas, Easy Read, TEA/TDAH e acessibilidade universal |
| `Modulo-3_IA-na-Pratica-Escolar.md` | Módulo 3 — IA como tutora, ética, detectores e avaliações à prova de IA |
| `Modulo-4_Gestao-de-Sala-de-Aula.md` | Módulo 4 — engajamento, 3 níveis na mesma turma e combinados |
| `Modulo-5_Educacao-Financeira.md` | Módulo 5 — Educação Financeira no Ensino Médio (Bloco 1: vida familiar, social e bens pessoais) |
| `Modulo-6_Nanotecnologia.md` | Módulo 6 — Nanotecnologia: abordagem interdisciplinar para o Ensino Médio |
| `_PROMPTS_PRONTOS.md` | Banco de prompts para copiar e colar (29 prompts, organizados por módulo) |
| `_PROMPTS_100P_KAIO.md` | Banco "100% prontos" — sem edição, copie e envie (16 prompts completos) |
| `iniciar-site.bat` | Servidor local: sobe o site em `http://localhost:8000` e abre o navegador |
| `site/` | Site do curso (HTML/CSS/JS, 100% offline, sem dependências externas) |

## 🌐 O site

O site fica em `site/` e roda direto no navegador (duplo clique em `index.html`
ou sirva a pasta com qualquer servidor estático). Páginas:

- **`index.html`** — home com hero, módulos e CTA
- **`curso.html`** — estrutura completa do curso
- **`modulos.html`** — conteúdo detalhado dos 4 módulos + checklist geral (`#checklists`)
- **`ferramentas.html`** — Laboratório do Professor: semáforo da sala, gerador de plano de aula e quiz jogável (offline)
- **`prompts.html`** — banco de 49 prompts com filtro por categoria e botão copiar
- **`slides.html`** — apresentação interativa com 60 slides + **2 decks extras**: Educação Financeira e Nanotecnologia

### Apresentação (slides.html)
- Clique em um card para abrir o modo apresentação
- Navegue com **← →** (ou espaço), **F** tela cheia, **Esc** fecha
- Filtre por módulo ou busque por palavra-chave

### Login e registro (Supabase)
O site usa **Supabase Auth** (e-mail + senha). O administrador cria as contas e envia
as credenciais para cada pessoa — **não existe cadastro público**.

- **`login.html`** — página de login
- **`register.html`** — página "solicitar acesso" (explica como obter a conta)
- **`js/supabase.js`** — cole aqui a **URL do projeto** e a **anon key**
- **`criar_conta.js`** — cria uma conta para um aluno no Supabase (via Admin API):
  ```
  node criar_conta.js <URL> <SERVICE_ROLE_KEY> <EMAIL> <SENHA> [NOME]
  ```
  A chave `service_role` fica em Project Settings > API e **só o administrador usa**.

Conta de demonstração (criar com o comando acima, se ainda não existir no projeto):
- E-mail: `klzinnmta202010@gmail.com`
- Senha: `147192Kaio@`

> **Importante:** o `auth.js` depende do Supabase estar configurado (`supabase.js`).
> Enquanto as credenciais não forem preenchidas, o login exibe aviso e não funciona.

### Estrutura do site
```
site/
├── index.html
├── curso.html
├── modulos.html
├── prompts.html
├── slides.html
├── css/style.css        → tema global
└── js/
    ├── data.js          → deck da apresentação (60 slides) + metadados dos módulos
    ├── present.js       → motor de apresentação
    └── main.js          → nav/footer, botões copiar, animações
```

## 🚀 Como usar

1. **Duplo clique em `iniciar-site.bat`** — sobe o servidor local, abre `http://localhost:8000` no navegador e mostra o site do curso. (Ou abra `site/index.html` direto no navegador, ou sirva a pasta com `python -m http.server` na raiz do site.)
2. Use o banco de prompts (`prompts.html` ou `_PROMPTS_PRONTOS.md`) para gerar materiais.
3. Siga o `PLANO_DO_CURSO.md` para a sequência pedagógica.
4. Guarde as apresentações geradas em subpastas por módulo.

> **Dica:** revise sempre o conteúdo gerado por IA — ela pode errar fatos e datas.
