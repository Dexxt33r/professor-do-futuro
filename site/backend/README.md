# 🤖 Back-end — Gerador de Atividade Pronta (IA gratuita)

Este é o back-end da ferramenta **“Gerar Atividade Pronta”** do
Laboratório do Professor (`site/ferramentas.html#gerar`).

> O site do curso é **HTML/CSS/JS puro** (sem Next.js e sem build), então o
> papel de “API Route / Server Action” é exercido por uma
> **Edge Function do Supabase** — a mesma arquitetura já usada no
> `vendas/backend/`. A chave da IA fica **apenas no servidor** (Secret),
> nunca no navegador.

```
ferramentas.html (formulário)
        │  POST + Authorization: Bearer <sessão do aluno>
        ▼
Supabase Edge Function  gerar-atividade   ← guarda a chave gratuita
        │  1) Google Gemini  (free tier)
        │  2) Groq           (plano Free)         ← cadeia de fallback
        │  3) OpenRouter     (modelos ":free")
        ▼
JSON estruturado → site/js/atividade.js → FOLHA A4 (imprimir / salvar em PDF)
```

Se **nenhuma** chave estiver configurada, ou se o aluno estiver sem internet,
o próprio navegador monta a folha em **modo offline** (roteiro de estudo +
caça-palavras) e avisa na tela. Nada quebra.

---

## 🆓 Provedores gratuitos (escolha 1; pode configurar mais de um)

| Provedor | Secret | Modelo padrão | Como pegar a chave (grátis, sem cartão) | Limites do plano grátis |
|---|---|---|---|---|
| **Google Gemini** *(recomendado)* | `GEMINI_API_KEY` | `gemini-2.5-flash` | https://aistudio.google.com/apikey → *Create API key* | Cotas diárias gratuitas por modelo (RPD/RPM/TPM); confira em https://ai.google.dev/gemini-api/docs/rate-limits |
| **Groq** | `GROQ_API_KEY` | `openai/gpt-oss-120b` | https://console.groq.com/keys | Plano Free: 30 req/min · 1.000 req/dia · 8K tokens/min por modelo |
| **OpenRouter** | `OPENROUTER_API_KEY` | `openrouter/free` (alias que escolhe um modelo gratuito) | https://openrouter.ai/keys | Modelos com `:free` têm teto diário de requisições; sem créditos = teto menor |

> ⚠️ **Free tier não é o mesmo que “sem condições de uso”**: as cotas são
> limitadas e, nos planos gratuitos, o conteúdo enviado **pode ser usado para
> melhorar os modelos**. Por isso o formulário não pede nome de aluno nem dado
> pessoal — e o site avisa isso explicitamente.

Variáveis opcionais (úteis para trocar de modelo sem mexer no código):

```
GEMINI_MODELO=gemini-2.5-flash        # ou gemini-2.5-flash-lite (mais cota, mais rápido)
GROQ_MODELO=openai/gpt-oss-120b
OPENROUTER_MODELO=openrouter/free
SITE_URL=https://professor-do-futuro-brown.vercel.app
```


---

## ⚙️ Deploy (Supabase CLI)

O projeto do curso é o mesmo do login: `ngkkhpvganrfctvyyvle`
(veja `site/js/supabase.js`).

```bash
# 1) vincular o projeto (só na primeira vez)
supabase link --project-ref ngkkhpvganrfctvyyvle

# 2) cadastrar a chave gratuita como SECRET (nunca no código!)
supabase secrets set GEMINI_API_KEY=AIza...sua-chave-gratuita...

# (opcional) outros provedores de reserva
# supabase secrets set GROQ_API_KEY=gsk_...
# supabase secrets set OPENROUTER_API_KEY=sk-or-v1-...

# 3) publicar a função
supabase functions deploy gerar-atividade --project-ref ngkkhpvganrfctvyyvle
```

> A função exige **aluno logado** (`Authorization: Bearer <access_token>`), que
> é justamente o que `site/js/atividade.js` envia depois do login. Além disso o
> Supabase verifica o JWT por padrão (`verify_jwt` ligado). Se a sua versão da
> CLI reclamar de verificação de JWT em função pública, publique com
> `--no-verify-jwt` — a validação continua sendo feita dentro da função, contra
> `SUPABASE_URL/auth/v1/user`.

### Testar depois do deploy

```bash
# sem token → 401 (é o esperado)
curl -i -X POST https://ngkkhpvganrfctvyyvle.supabase.co/functions/v1/gerar-atividade \
  -H "Content-Type: application/json" \
  -d "{\"disciplina\":\"História\",\"ano\":\"5º ano\",\"tema\":\"Revolução Francesa\",\"tipo\":\"mista\",\"quantidade\":5}"

# com token (pegue no navegador: DevTools → Application → Local Storage → *-auth-token)
curl -s -X POST https://ngkkhpvganrfctvyyvle.supabase.co/functions/v1/gerar-atividade \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -d "{\"disciplina\":\"Ciências\",\"ano\":\"5º ano do Ensino Fundamental\",\"tema\":\"Fotossíntese\",\"tipo\":\"texto_perguntas\",\"quantidade\":6,\"adaptaTdahTea\":true}"
```

Resposta esperada:

```json
{
  "ok": true,
  "provedor": "gemini",
  "modelo": "gemini-2.5-flash",
  "atividade": {
    "titulo": "...", "objetivo": "...", "texto_apoio": { "titulo": "...", "paragrafos": ["..."] },
    "questoes": [{ "numero": 1, "enunciado": "...", "tipo": "multipla_escolha", "alternativas": ["..."], "correta": 0 }],
    "gabarito": [{ "numero": 1, "resposta": "...", "comentario": "..." }]
  }
}
```

Erros retornam `{ "ok": false, "erro": "...", "detalhes": "..." }` com status
`401` (sem login), `400` (tema vazio) ou `502` (IA fora do ar / cota estourada).
Em qualquer um desses casos a página **continua funcionando** no modo offline.

---

## 🧪 Testes (rodam offline, sem chave e sem internet)

```bash
cd site/backend
node test/atividade.test.mjs   # prompt, normalização, caça-palavras e folha A4 (30 verificações)
node test/ui.test.mjs          # formulário → folha → imprimir/copiar/fechar (8 verificações)
```

Os testes usam apenas Node (v20+; o ideal é Node 22/24, que já entende `.ts`).
Eles importam a **mesma lógica pura** usada pela função
(`supabase/functions/gerar-atividade/prompt.ts`) e o **mesmo módulo da página**
(`site/js/atividade.js`), então uma mudança que quebre a folha A4 falha aqui.

---

## 🧩 Arquivos

| Arquivo | Papel |
|---|---|
| `supabase/functions/gerar-atividade/index.ts` | Endpoint (Deno): valida o aluno, chama os provedores gratuitos e devolve JSON |
| `supabase/functions/gerar-atividade/prompt.ts` | Lógica pura: prompt pedagógico, esquema JSON e normalização da resposta |
| `site/js/atividade.js` | Front-end: formulário, chamada à função, folha A4, caça-palavras e modo offline |
| `site/css/style.css` (bloco “FOLHA A4”) | Estilo do papel A4 + regras de impressão (`@page`, quebra de página) |

---

## 🛠️ Manutenção e problemas comuns

- **`{ ok:false, detalhes:"Nenhuma chave de IA configurada" }`** → falta rodar
  `supabase secrets set GEMINI_API_KEY=...` (ou Groq/OpenRouter) e reimplantar.
- **`Gemini: resposta vazia`** → o modelo estava com raciocínio ligado consumindo
  o limite de saída. A função já desliga isso (`thinkingBudget: 0`) nos modelos
  2.5/3.x; se acontecer, troque `GEMINI_MODELO` (ex.: `gemini-2.5-flash-lite`).
- **`429` / `Rate limit exceeded`** → a cota gratuita do dia estourou. Configure
  um segundo provedor: a função passa sozinha para o próximo da fila
  (Gemini → Groq → OpenRouter).
- **A folha imprime cortada** → use “Salvar como PDF” na janela de impressão,
  papel **A4**, margens **padrão**, escala **100%** e desmarque “cabeçalhos e
  rodapés”. A segunda página é o gabarito (desmarque “Incluir a folha do
  professor” para imprimir só a folha do aluno).
- **Logs da função** → Supabase Dashboard → *Edge Functions* → `gerar-atividade`
  → *Logs*. O back-end não guarda nada: nenhum dado do formulário é persistido.
- **Custo** → R$ 0,00 enquanto você ficar nos planos gratuitos. Se um dia passar
  dos limites gratuitos, a ferramenta continua funcionando no modo offline ou
  com outro provedor gratuito da fila.

