# ♿ MÓDULO 2 — Educação Especial, Inclusão e AEE (Atendimento Educacional Especializado)

> **Objetivo do módulo:** Usar IA para tornar materiais didáticos acessíveis — Comunicação Alternativa e Aumentativa (CAA), pictogramas, Easy Read, design anti-sobrecarga sensorial para TEA e TDAH, e acessibilidade universal (legendas, audiodescrição, alto contraste).

---

## 2.1 Deficiência Intelectual e Transtornos do Desenvolvimento

### O que é CAA (Comunicação Alternativa e Aumentativa)?

É um conjunto de recursos para **dar voz** a quem tem dificuldade na fala ou na escrita: **pictogramas** (desenhos-símbolos), **pranchas de comunicação**, **bonecos/gestos**, **voz digitalizada**. A IA pode gerar slides com esses símbolos e textos simples.

**Princípios ao montar o slide:**
- Use **um símbolo/pictograma por linha** ao lado do texto.
- Frases curtas (3–6 palavras).
- Comece com **substantivos concretos** (objetos, pessoas, ações fáceis de desenhar).
- Associe cor sempre igual (ex.: verbos sempre verde, lugares sempre azul).

### Easy Read (Leitura Fácil)
Texto com **linguagem simples**, frases curtas, palavras do dia a dia, **uma ideia por frase** e **imagem que explica** o que o texto diz.

Regras do Easy Read:
| Regra | Exemplo |
|-------|---------|
| Frase curta | "Beba água." (em vez de "Ingerir líquidos...") |
| Palavras conhecidas | "comprar comida" (em vez de "evento de subsistência") |
| Uma ideia por linha | separar sem quebrar a frase |
| Imagem explícita | desenho da água ao lado de "Beba água" |
| Símbolos e gestos | setas, símbolos de direção |

---

### 2.1.1 Prompts para gerar CAA e pictogramas com IA

**Prompt 1 — transformar texto complexo em frases simples:**
```
Reescreva o texto a seguir em língua fácil (Easy Read), para aluno com deficiência
intelectual. Frases de no máx 6 palavras, palavras simples, 1 ideia por linha.
[cole o texto]
```

**Prompt 2 — sugerir pictogramas por frase:**
```
Para cada frase abaixo, sugira um PICTograma (desenho simples) que ilustre a ideia.
Saída no formato: FRASE → PICTograma sugerido.
[1] Beba água.
[2] Vá ao refeitório.
[3] Vamos ler um livro.
```

**Prompt 3 — gerar descrição de imagem pictórica para slide:**
```
Crie uma imagem simples e colorida que ilustre "criança bebendo água", no estilo
pictograma (traço grosso, fundo limpo, sem detalhes). Cores suaves e alegres.
```

---

### 2.1.2 Adaptando conceitos complexos em passo a passo visual

Técnica: transformar um **conceito abstrato** em **sequência de passos**, cada passo em um slide.

**Prompt de passo a passo visual:**
```
Transforme o conceito "FOTOSSÍNTESE" em 5 passos SIMPLES com ilustração de cada passo,
para aluno com deficiência intelectual. Cada passo: 1 frase curta + 1 imagem.
Passo 1: A planta pega a luz do sol. [imagem] ...
```

**Exemplo (Ciclo da água simplificado):**
- Passo 1: O sol esquenta a água. ☀️
- Passo 2: A água vira névoa e sobe. ☁️
- Passo 3: A névoa vira nuvem.
- Passo 4: A nuvem chove. 🌧️
- Passo 5: O chuva volta para o rio. 🌊

**Dica:** peça à IA para usar **cores de apoio estrutural** e um **guia de progresso** ("passo 1 de 5") para quem precisa de previsibilidade.

---

## 2.2 Autismo (TEA) e TDAH — Design anti-sobrecarga

### Por que é importante
Estudantes com TEA/TDAH podem se sentir **sobrecarregados** com muitos estímulos visuais. O slide certo **organiza** e **acalma**; o errado pode desencadear ansiedade ou dispersão.

### Técnicas de design para TEA/TDAH
- **Cores neutras** (fundo claro, sem neons, sem muitas variações).
- **Redução de poluentes visuais** (remova texto em excesso, imagens bagunçadas, animações piscantes).
- **Um item de cada vez** (evite listas de 10; use uns 3 itens).
- **Bordas e caixas claras** → organize por regiões.
- **Elementos previsíveis** (mesma posição do título, mesmo estilo).
- **Fonte sem serifa, grande** (Arial, Verdana), espaçamento amplo.
- Para **TDAH:** use **âncoras visuais** (ícones como "✔ façamos", "✅ consegui", "⏭ próximo") e **sequências muito visuais**; inclua **pausas** (slide de "Vamos alongar 30s").

### Rotina visual e quadros de antecipação (em formato de slides)
Um **quadro de antecipação** avisa o aluno *o que vem* para reduzir ansiedade.

**Exemplo de rotina em slides (manhã):**
1. 🕗 CHEGADA — guardar a mochila.
2. 📖 RODA — chamada e conversa.
3. 📝 ATIVIDADE 1 — escrita.
4. 🚻 RECREIO.
5. 🎨 ATIVIDADE 2 — artes.
6. ✅ FINAL — resumo do dia.

### Prompts para rotina visual / quadro de antecipação
```
Crie 6 slides de ROTINA para um aluno autista/TDAH (café da manhã→fim da aula).
Cada slide: 1 imagem + 1 frase curta + um ícone de "fazer" (✓). Cores suaves,
fundo claro, sem excesso. Sem animações.
```

```
Monte um "quadro de antecipação": mostre ANTES da aula uma sequência de atividades
com o total de passos e um slide final que diz "Falta 1!" quando perto do fim.
```

### Slide de "calma" (para momentos de crise/ansiedade)
```
Crie 3 slides de ACALMO: 1) "Responde com calma", 2) "Respiro devagar: inspire, segure, solte",
3) uma imagem tranquila com a mensagem "Você consegue". Visual minimalista, cores azul/verde suaves.
```

---

## 2.3 Acessibilidade Universal

### Como gerar legendas, audiodescrição e alto contraste

**1) Legendas automáticas:**
- Vídeos: use o **YouTube** (legendas automáticas) e edite as legendas.
- Apresentações: no PowerPoint, "Legendas e legendas em tempo real" (com microfone) e **Transcrição**.
- IA: peça ao ChatGPT/Claude para gerar o **texto falado** dos slides (banco de roteiro).

**Prompt legenda/transcrição:**
```
Transcreva meu roteiro abaixo em boas legendas, quebrando a cada 2-3 segundos de leitura.
[cole o texto]
```

**2) Audiodescrição (áudio que narra o visual):**
```
Gere uma audiodescrição (narração curta) descrevendo esta imagem para pessoas com deficiência
visual: cores, objeto central, ação e cenário. Máx 2 frases. [descreva ou anexe a imagem]
```

**3) Alto contraste:**
```
Sugira uma paleta de ALTO CONTRASTE para slides acessíveis (ex.: fundo azul-escuro com
texto amarelo-claro, ou fundo branco com texto preto grosso). Evite verde+vermelho juntos
(deuteranopia) e azul+violeta juntos. Especifique códigos hex em pares seguros.
```

### Tabela de combinações seguras de cores (contraste)
| Combinação | Contraste |
|-----------|-----------|
| Preto / Branco | ✅ Alto |
| Azul-escuro / Amarelo | ✅ Alto |
| Branco / Preto grosso | ✅ Bom |
| Texto vermelho / fundo verde | ⚠️ Evitar (daltonismo) |
| Cinza-claro / Rosa | ⚠️ Baixo |

### Prompt universal para deixar o material acessível
```
Revise esta apresentação para acessibilidade: 1) alto contraste, 2) sem texto sobreposto,
3) fonte legível (≥ 20-28pt), 4) legendas/transcrição, 5) texto alternativo nas imagens.
Gere a versão acessível.
```

---

## 2.4 Exemplos Práticos de Prompts (Módulo 2) — para copiar

1) **Texto simples para aluno com DI:**
```
Escreva 3 atividades para "soma até 10" em língua fácil, com 1 desenho cada,
para um aluno de 3º ano com deficiência intelectual.
```

2) **Quadro de antecipação para a semana:**
```
Monte 6 imagens de sequência: segunda a sábado com o evento do dia + ícone de espera (⏳).
Use cores neutras. Sem paredes de texto.
```

3) **Prompt para criar pictograma no Canva IA:**
```
Crie um pictograma grande e simples, traço limpo, fundo branco, 1 figura humana
bem destacada, sem detalhes. Tema (por ex.): "lanchar".
```

4) **Rotina visual para TEA:**
```
Crie 4 slides: "Agora = [atividade]", "Próximo = [atividade]", "Falta 1!", "Parabéns 🎉".
Visual limpo, cores suaves. Sem animações automáticas.
```

5) **Audiodescrição de slide:**
```
Dê audiodescrições (máx 2 frases cada) para estes slides: [descreva as 3 imagens].
```

---

## ✅ Checklist do Módulo 2
- [ ] Adaptei 1 texto em **língua fácil (Easy Read)** com IA.
- [ ] Criei slides com **CAA/pictogramas** para uma rotina ou conceito.
- [ ] Produzi um **quadro de antecipação/rotina visual** para TEA.
- [ ] Ajustei cores/fonte para **não sobrecarregar** alunos TDAH/TEA.
- [ ] Adicionei **legenda ou audiodescrição** e alto contraste em um slide.
- [ ] Confirmei com o **professor do AEE** se o material está adequado.