# Play Software — Site Institucional (design spec)

**Data:** 2026-08-14
**Status:** aprovado para implementação

## 1. Objetivo

Site institucional da **Play Software**, software house de Henrique e Marcelo. Funciona como cartão de
visitas: apresenta a empresa, os serviços, o processo de trabalho, os projetos já entregues e os
fundadores, e converte o visitante em conversa via WhatsApp.

Já existe um protótipo anterior do site. Este projeto **reconstrói o site do zero**, reproduzindo
fielmente o design e reaproveitando os textos do protótipo (transcritos na seção 6).

Não-objetivos: blog, CMS, área logada, i18n, formulário com backend/e-mail, analytics.

## 2. Decisões

| Tema | Decisão | Motivo |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | SEO/metadata/OG nativos, imagens otimizadas, deploy Vercel de primeira classe |
| Estilo | Tailwind CSS v4 + CSS vars | Design enxuto e custom; tokens num lugar só |
| Componentes | Próprios (sem shadcn) | Todo o visual é autoral; shadcn traria peso e opinião a sobrescrever |
| Ícones | `lucide-react` | É a família usada no protótipo |
| Animação | `motion` (reveal on scroll) | Sutil, só fade+translate na entrada das seções |
| Renderização | Estática (SSG), sem runtime dinâmico | É conteúdo fixo |
| Estrutura | Landing única com âncoras | Confirmado com o cliente |
| Formulário | Abre WhatsApp com mensagem pré-preenchida | Zero infra, zero custo; envio isolado atrás de uma função para trocar depois |
| Conteúdo | Centralizado em `src/content/site.ts` | Rebrand/edição sem tocar em componente |
| Deploy | Vercel, domínio `playsoftware.dev` | — |

**Nome e domínio não estão fechados.** Por isso nenhum componente escreve "Play Software", e-mail ou
domínio literalmente — tudo vem de `site.ts`. Trocar a marca é editar um arquivo.

## 3. Estrutura de arquivos

```
playsoftware-site/
├── CLAUDE.md
├── next.config.ts
├── tsconfig.json
├── package.json
├── public/
│   ├── portfolio/            # capas dos cases (placeholder no início)
│   ├── founders/             # fotos dos fundadores (placeholder no início)
│   └── og.png
└── src/
    ├── app/
    │   ├── layout.tsx        # fontes, metadata, OG, JSON-LD
    │   ├── page.tsx          # compõe as seções na ordem
    │   ├── globals.css       # tokens + base + utilitários
    │   ├── icon.svg          # favicon "E" verde
    │   └── not-found.tsx
    ├── content/
    │   └── site.ts           # TODO o conteúdo, tipado
    ├── lib/
    │   ├── whatsapp.ts       # buildWhatsappUrl()
    │   └── cn.ts
    └── components/
        ├── ui/               # Section, Eyebrow, Heading, Card, Button, Reveal
        ├── layout/           # Navbar, Footer
        └── sections/         # Hero, Services, Differentials, Portfolio,
                              # Process, Founders, CtaStats, Contact
```

Regra de tamanho: um componente por arquivo; se um passar de ~150 linhas, quebrar.

## 4. Design system

### Tokens (CSS vars em `globals.css`, expostos ao Tailwind v4 via `@theme`)

```
--bg          #0A0E10   fundo da página
--bg-alt      #0D1214   faixas alternadas de seção
--surface     #12171A   cards
--surface-2   #171D21   inputs, hover de card
--border      #1F262A   borda 1px de tudo
--border-soft #2A3338   borda em hover
--text        #E8EDEF   texto principal
--muted       #8A9BA3   parágrafos e legendas
--accent      #00E39B   verde-menta (única cor de destaque)
--accent-dim  #0B7A5A   estados apagados / número "01" do processo
--accent-soft rgba(0,227,155,.10)  fundo de ícone e badge
```

Nenhum outro tom de verde/azul entra no site. Estados de foco usam `--accent` com `outline-offset`.

### Tipografia

- **Inter** (`next/font/google`, variável) — títulos e corpo
- **JetBrains Mono** (`next/font/google`) — bloco de código, eyebrows em caps, números de etapa, stats

Escala: H1 `clamp(2.75rem, 7vw, 4.5rem)` / peso 800 / `tracking-tight` / `leading-[1.05]`.
H2 `clamp(2rem, 4.5vw, 3rem)` / peso 800. Corpo `1rem`–`1.0625rem` / `leading-relaxed` / `--muted`.

### Padrões visuais recorrentes

1. **Eyebrow** — mono, `uppercase`, `text-xs`, `tracking-[0.2em]`, cor `--accent`. Pode ter separador `·`.
2. **Heading com ênfase** — uma palavra em `italic` + `--accent` (ex.: *produtos*, *começa aqui.*, *incrível.*).
3. **Card** — `bg-surface`, `border border-border`, `rounded-xl`, `p-6`; hover eleva a borda para `--border-soft` e aplica um glow verde bem fraco.
4. **Ícone em caixa** — 40×40, `rounded-lg`, `bg-accent-soft`, ícone lucide 20px em `--accent`.
5. **Reveal** — wrapper que anima `opacity 0→1` e `translateY 16px→0` quando entra na viewport, uma vez só. Respeita `prefers-reduced-motion`.
6. **Fundo do hero** — grid de linhas 1px muito sutil (CSS `repeating-linear-gradient`) + glow radial verde no centro-direita, ambos com máscara que apaga nas bordas.

### Responsivo

Os prints do protótipo são todos desktop. O comportamento mobile é decisão nossa, e o site é
**construído mobile-first**: as classes base valem para celular e os breakpoints só adicionam.
Alvo de referência: 360px de largura (o menor aparelho relevante hoje).

**Container.** `max-width: 1200px`, padding lateral `1.25rem` → `2rem` a partir de `md`.

**Grids por seção:**

| Seção | base (<640px) | `sm` ≥640 | `lg` ≥1024 |
|---|---|---|---|
| Hero | 1 col, código abaixo do texto | — | 2 col |
| Serviços | 1 col | 2 col | 3 col |
| Diferenciais | 1 col (título acima da lista) | — | 2 col (título à esquerda, sticky) |
| Portfólio | 1 col | — | 2 col (`md` ≥768) |
| Processo | 1 col | 2 col | 5 col |
| Fundadores | 1 col | — | 2 col (`md` ≥768) |
| Stats | 3 col sempre (números curtos cabem) | — | — |
| Footer | 1 col empilhado | — | 3 col (`md`) |

**Navbar mobile (<768px).** Logo + botão hamburger. Ao abrir, um painel full-screen desliza de
cima com os 4 links em fonte grande e o botão "Agendar Conversa" ocupando a largura toda. Fecha ao
clicar num link, no backdrop ou com `Escape`; trava o scroll do body enquanto aberto; foco preso
dentro do painel e devolvido ao hamburger ao fechar. `aria-expanded` e `aria-controls` no botão.

**Ajustes mobile específicos:**

- **Bloco de código do hero** — a única coisa que pode estourar a largura. Recebe
  `overflow-x: auto` próprio, `font-size` menor (`0.8125rem`) e `-webkit-overflow-scrolling: touch`.
  O `body` nunca rola na horizontal.
- **Tipografia** — o `clamp()` do H1/H2 já resolve; conferir que o H1 não passa de 4 linhas em 360px.
- **Alvos de toque** — todo elemento clicável com no mínimo 44×44px, inclusive os ícones sociais
  do footer e os links "Visitar projeto".
- **CTAs do hero** — largura total e empilhados abaixo de `sm`, lado a lado a partir dali.
- **Formulário** — nome e e-mail lado a lado só em `md`+; empilhados abaixo. Inputs com
  `font-size: 16px` para o iOS não dar zoom ao focar. `inputMode`/`autoComplete` corretos
  (`name`, `email`).
- **Espaçamento vertical** — seções com `py-16` no mobile e `py-24`/`py-28` em desktop.
- **Fundo do hero** — o glow radial reduz de intensidade no mobile para não lavar o texto.

**Verificação obrigatória:** testar em 360px, 390px, 768px e 1440px, confirmando zero scroll
horizontal em qualquer um.

## 5. Seções e ordem

| # | id | Seção | Fundo |
|---|---|---|---|
| — | — | Navbar (sticky, blur, borda inferior ao rolar) | — |
| 1 | `home` | Hero | `--bg` + grid + glow |
| 2 | `servicos` | Serviços — 6 cards | `--bg-alt` |
| 3 | — | Diferenciais — 4 itens | `--bg` |
| 4 | `portfolio` | Portfólio — 4 cases | `--bg-alt` |
| 5 | — | Processo — 5 etapas + card de validação | `--bg` |
| 6 | `sobre` | Fundadores | `--bg-alt` |
| 7 | — | CTA + Números | `--bg` |
| 8 | `contato` | Formulário de contato | `--bg` |
| — | — | Footer | `--bg-alt` |

Navegação: Home, Serviços, Portfólio, Sobre + botão "Agendar Conversa" (leva a `#contato`).

> O protótipo mostra a navbar como "Home · Serviços · Sobre · Portfólio", mas o footer como
> "Home · Serviços · Portfólio · Sobre · Contato" — e esta segunda é a ordem em que as seções
> aparecem na página. Adotamos a ordem do footer nos dois lugares.
Rolagem suave via `scroll-behavior: smooth` + `scroll-margin-top` nas seções (compensa a navbar).

## 6. Conteúdo (transcrito do protótipo)

Tudo abaixo vive em `src/content/site.ts`.

### Marca
- Logo: `EN` em `--accent` + `YX` em `--text`, mono/bold.
- Tagline do footer: "Studio de engenharia dedicado a construir soluções digitais de alto valor, com rigor técnico e visão de negócio."
- Copyright: "© 2026 Play Software. Todos os direitos reservados."

### Hero
- Badge: `SOFTWARE HOUSE DIGITAL` (com dot verde pulsante)
- Título: "Transformando ideias em ***produtos***"
- Subtítulo: "Desenvolvimento de sistemas web com rigor técnico e pragmatismo. Onde a **excelência técnica** encontra a estratégia de escala." (trecho em negrito na cor `--text`)
- CTAs: "Iniciar um Projeto" (primário, seta) → `#contato` · "Explorar Case Studies" (secundário, ícone link externo) → `#portfolio`
- Bloco de código — título da janela `PlaySoftware.StartProject`, três traffic lights (vermelho/amarelo/verde):
  ```js
  const projeto = await playSoftware
    .analisar(requisitos)
    .projetar(arquitetura)
    .desenvolver(features)
    .entregar(produção);
  // resultado: produto pronto ✓
  console.log(projeto.status);
  ```
  Rodapé do card, separado por linha: "Taxa de Entrega" — **100%**.
  O syntax highlight é estático (spans com classe), não uma lib.

### Serviços
- Eyebrow: `SERVIÇOS · O QUE FAZEMOS`
- Título: "Soluções Digitais de Alta Fidelidade."
- Subtítulo: "Construímos software que não apenas funciona bem, mas que acompanha o mercado e se torna parte do sucesso do seu negócio."

| Ícone | Título | Descrição |
|---|---|---|
| `Code2` | Desenvolvimento de SaaS | Plataformas multi-tenant com arquitetura escalável e alto desempenho para atender milhares de usuários com eficiência. |
| `Layers` | Micro-SaaS | Soluções ultra-focadas, rentáveis e com baixo custo operacional. Ideal para nichos específicos e operações enxutas. |
| `Rocket` | MVPs de Engenharia | Validação rápida de conceitos com código de produção real, não protótipos descartáveis. Do zero ao mercado com velocidade. |
| `Monitor` | Sistemas Customizados | Digitalização de operações complexas com interfaces intuitivas, regras de negócio sofisticadas e fluxos automatizados. |
| `Globe` | Experiências Web | Marketing sites com estratégia de conversão, landing pages de alto desempenho e plataformas digitais que geram resultado. |
| `RefreshCw` | Modernização de Stack | Refatoração e evolução de sistemas legados para tecnologias modernas, garantindo performance e manutenibilidade. |

### Diferenciais
- Eyebrow: `DIFERENCIAIS` · Título: "O Rigor que seu Projeto Merece."

| Ícone | Título | Descrição |
|---|---|---|
| `Target` | Foco no que importa pra você | Não entregamos só código. Entregamos soluções que fazem sentido pro seu negócio. Cada funcionalidade é pensada pra gerar resultado real, não só preencher requisito. |
| `Zap` | Agilidade de verdade | Trabalhamos em ciclos rápidos com entregas frequentes. Você acompanha a evolução do projeto de perto e participa de cada decisão importante. |
| `Shield` | Feito pra crescer com você | Seu projeto começa pronto pra escalar. Não importa se hoje são 10 usuários ou amanhã serão 10 mil, a base já está preparada desde o início. |
| `MessageCircle` | Comunicação clara, prazos e preços reais | Sem surpresas. Falamos de forma direta, cumprimos o que combinamos e praticamos preços justos. Você sabe exatamente o que esperar em cada etapa. |

### Portfólio
- Eyebrow: `NOSSOS CASES` · Título: "Projetos em Produção." · Link de cada card: "Visitar projeto" + ícone externo

| Tag | Título | Descrição |
|---|---|---|
| SITE INSTITUCIONAL | TSTECK Equipamentos | Presença digital empresarial construída para transmitir solidez e confiança no segmento de equipamentos industriais. |
| PLATAFORMA SAAS | AulaMarcada | Sistema completo de agendamento e gestão de aulas particulares, com painel do professor e experiência do aluno integrada. |
| OPERAÇÃO COMERCIAL DIGITAL | Site Mercado Livre | Plataforma de operação comercial digital com foco em performance e experiência de compra otimizada. |
| E-COMMERCE · MARCA | Vortex Patins | Presença digital de nicho para marca de patins. E-commerce com identidade visual forte e experiência de compra premium. |

### Processo
- Eyebrow: `PROCESSO` · Título: "Workflow de Engenharia"
- Subtítulo: "Um processo iterativo e transparente para entregar, medir e evoluir o produto a cada sprint."

| Nº | Etapa | Descrição |
|---|---|---|
| 01 | Discovery | Análise profunda do cenário e identificação de requisitos estratégicos. |
| 02 | Arquitetura | Definição de infraestrutura e stack tecnológico escalável e adequado. |
| 03 | UX/UI Design | Interfaces de alta performance com UX/UI coerentes ao produto e mercado. |
| 04 | Sprint Dev | Desenvolvimento com entregas contínuas, qualidade de código e revisões constantes. |
| 05 | Launch & Scale | Deploy com suporte pós-entrega, monitoramento e evoluções contínuas do produto. |

Card final (ícone `MessageCircle`): **Validação contínua com você** — "A cada etapa, fazemos uma
conversa para alinhar expectativas, validar decisões e garantir que o produto segue no caminho certo."

### Fundadores
- Eyebrow: `FUNDADORES · LEADERSHIP` · Título: "Mentes por trás da execução."
- Subtítulo: "A união entre visão técnica e visão de negócios é o que torna cada projeto uma solução real, não apenas código."

| Nome | Cargo | Citação | Formação |
|---|---|---|---|
| Henrique | CEO & Business Architect | "Cada projeto é uma parceria. Nosso papel é traduzir ambição em estratégia e estratégia em resultado mensurável." | Administração, PUC '24 |
| Marcelo | CTO & Product Architect | "Tecnologia boa é a que resolve dores reais de negócio. A inovação é o canal, não o objetivo." | Bacharel em Sistemas de Informação, FIAP 2023 |

### CTA + Números
- Título (centralizado): "O próximo sistema que vai mudar o jogo ***começa aqui.***"
- Subtítulo: "Projetos desenvolvidos com foco em performance, clareza e resultado. Tecnologia aplicada com visão prática de mercado."
- Stats: **10+** Projetos Entregues · **100%** Foco em Soluções Web · **4+** Segmentos Atendidos

### Contato
- Título: "Vamos construir algo ***incrível.***"
- Subtítulo: "Preencha o formulário abaixo ou entre em contato direto via WhatsApp."
- Campos: `SEU NOME` / "Nome completo" · `E-MAIL PROFISSIONAL` / "email@empresa.com" · `FALE DO PROJETO` / "Descreva brevemente sua ideia ou necessidade..." (textarea)
- Botão: "Solicitar Proposta Técnica" (ícone `Send`)
- Rodapé: "Prefere conversar?" + link "WhatsApp direto"

### Footer
Logo + tagline · **NAVEGAÇÃO**: Home, Serviços, Portfólio, Sobre, Contato · **CONTATO**: e-mail
com ícone `Mail`, ícones sociais GitHub / LinkedIn / Instagram · copyright.

## 7. Formulário → WhatsApp

Componente client. Fluxo:

1. Estado local dos 3 campos.
2. Validação no submit: nome não vazio; e-mail com formato válido; mensagem com ≥10 caracteres.
   Erro aparece abaixo do campo, borda vermelha, `aria-invalid` e `aria-describedby`.
3. Se válido, `buildWhatsappUrl({ name, email, message })` monta:
   ```
   Olá! Meu nome é {name} ({email}).

   {message}
   ```
   e retorna `https://wa.me/{numero}?text={encodeURIComponent(texto)}`.
4. Abre em nova aba (`window.open(url, '_blank', 'noopener')`), mostra confirmação inline e limpa o form.

`buildWhatsappUrl` fica em `src/lib/whatsapp.ts`, pura e testável. O submit chama uma única função
`submitContact` — trocar por envio de e-mail depois é substituir o corpo dela.

## 8. Dados placeholder

O site começa com placeholders, listados aqui para troca depois (tudo em `site.ts` / `public/`):

| Item | Placeholder |
|---|---|
| WhatsApp | `5511999999999` |
| E-mail | `contato@playsoftware.dev` |
| Domínio | `https://playsoftware.dev` |
| URLs dos 4 cases | `#` (link fica desabilitado quando a URL é `#`) |
| Capas do portfólio | SVG gradiente escuro com o nome do projeto |
| Fotos dos fundadores | Avatar SVG com a inicial |
| Redes sociais | `#` (ícone não renderiza se a URL for `#`) |

## 9. SEO e acessibilidade

- `metadata` no layout: title, description, keywords, `openGraph`, `twitter:card`, `metadataBase`, `alternates.canonical`, `robots`.
- JSON-LD `Organization` no layout.
- `public/robots.txt` e `app/sitemap.ts`.
- HTML semântico: um `<h1>` só, `<section>` com `aria-labelledby`, `<nav>`, `<footer>`.
- Skip-link para o conteúdo principal.
- Contraste: `--muted` sobre `--bg` fica em ~7:1; `--accent` sobre `--bg` em ~9:1. Verde nunca é usado como fundo de texto pequeno.
- Foco visível em todo elemento interativo. Animações desligadas com `prefers-reduced-motion`.
- `lang="pt-BR"`.

## 10. Testes e verificação

Site estático de conteúdo fixo — teste unitário só onde há lógica de verdade:

- **Vitest** em `src/lib/whatsapp.test.ts`: URL correta, encoding de acentos e quebras de linha, número sem caracteres não numéricos.
- **Vitest** na validação do formulário: e-mail inválido, campos vazios, mensagem curta.
- Sem testes de snapshot de layout.

Antes de declarar pronto: `npm run build` e `npm run lint` limpos, e conferência visual seção a
seção contra os prints, em desktop e mobile.

## 11. Riscos e pontos em aberto

- **Nome/domínio não confirmados** — mitigado pela centralização em `site.ts`.
- **Textos ajustados.** Cinco trechos do protótipo estavam truncados ou redundantes e foram
  reescritos (com aval do cliente) — o restante é fiel ao original:

  | Onde | Antes | Agora |
  |---|---|---|
  | Hero | "…e pragmatismo para crescer. Uma **excelência técnica** encontra…" | "…e pragmatismo. Onde a **excelência técnica** encontra…" |
  | Serviços | "…mas sim busca paridade ao mercado e se torna…" | "…mas que acompanha o mercado e se torna…" |
  | Processo | "…iterativo e transparente para entregar, iterar, medir e evoluir…" | "…iterativo e transparente para entregar, medir e evoluir…" |
  | Case ML | "Plataforma voltada a operação comercial digital … experiência otimizada de compra." | "Plataforma de operação comercial digital … experiência de compra otimizada." |
  | Footer | "Studio de engenharia exclusivo para construir…" | "Studio de engenharia dedicado a construir…" |

  O cliente revisa todo o copy depois da primeira versão no ar.
- **Capas dos cases** — sem as imagens reais, a seção mais forte do site fica fraca. É o primeiro
  item a substituir.
