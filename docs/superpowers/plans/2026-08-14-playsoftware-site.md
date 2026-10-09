# Play Software Site Institucional — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o site institucional da software house Play Software — uma landing page única, estática, em português, que apresenta serviços, portfólio, processo e fundadores, e converte o visitante em conversa via WhatsApp.

**Architecture:** Next.js 16 App Router renderizando estaticamente uma única rota (`/`) composta por 8 seções. Todo o conteúdo textual vive em um módulo de dados tipado (`src/content/site.ts`) que nenhum componente contorna. Os componentes se dividem em três camadas: primitivos de UI reutilizáveis (`ui/`), casca da página (`layout/`) e seções (`sections/`). A lógica real do site — montar a URL do WhatsApp e validar o formulário — fica em funções puras em `src/lib/`, e é o único código coberto por testes automatizados.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript, Tailwind CSS 4.3, lucide-react 1.x, motion 13.x, Vitest 4.x. Deploy na Vercel.

**Spec:** `docs/superpowers/specs/2026-08-14-playsoftware-site-design.md` — leia antes de começar; este plano implementa aquele documento e não o repete por inteiro (os textos completos das seções estão lá).

## Global Constraints

Estas regras valem para **todas** as tasks:

- **Node 22.** O projeto exige Node 22. Se algum comando `npm`/`npx` falhar com erro de sintaxe críptico, é sinal de que uma versão antiga está no PATH — garanta o Node 22 (via `nvm use 22` ou prefixando o PATH com o diretório `bin` da instalação correta).
- **Diretório de trabalho:** a raiz deste repositório. O repositório git já existe (branch `main`, dois commits de documentação). Todos os caminhos neste plano são relativos a essa raiz.
- **Versões exatas a instalar:** `next@16.3.1`, `react@19.2.8`, `react-dom@19.2.8`, `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`, `lucide-react@1.31.0`, `motion@13.1.0`, `vitest@4.1.10`.
- **Idioma:** todo texto visível é português do Brasil, com acentuação correta. Nunca escreva "nao" por "não". Mensagens de commit também em português.
- **Zero hardcode de marca.** Nenhum componente escreve "Play Software", e-mail, telefone, domínio ou URL de projeto literalmente. Tudo vem de `src/content/site.ts`. O nome da empresa ainda pode mudar.
- **Uma cor de destaque.** `--color-accent` (`#00E39B`) é o único acento. Não introduza azul, roxo, laranja ou um segundo verde.
- **Mobile-first.** Classes base valem para celular; breakpoints só adicionam. Zero scroll horizontal em 360px de largura, em qualquer seção.
- **Paleta (valores exatos):** `bg #0A0E10` · `bg-alt #0D1214` · `surface #12171A` · `surface-2 #171D21` · `border #1F262A` · `border-soft #2A3338` · `text #E8EDEF` · `muted #8A9BA3` · `accent #00E39B` · `accent-dim #0B7A5A` · `accent-soft rgba(0,227,155,0.10)`.
- **Commits frequentes**, um por task no mínimo, formato `tipo: descrição em português`.

---

## Estrutura de arquivos

Mapa do que existirá ao final. A coluna "Task" indica onde cada arquivo nasce.

| Arquivo | Responsabilidade | Task |
|---|---|---|
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` | Configuração do projeto | 1 |
| `src/app/globals.css` | Tokens de design, base, utilitários de fundo | 1 |
| `src/app/layout.tsx` | Fontes, `<html lang="pt-BR">`, metadata, JSON-LD, skip-link | 1, 5, 12 |
| `src/app/page.tsx` | Compõe as 8 seções na ordem | 1, 6–11 |
| `vitest.config.ts` | Runner dos testes de `src/lib` e `src/content` | 2 |
| `src/content/site.ts` | **Todo** o conteúdo do site, tipado | 2 |
| `src/content/site.test.ts` | Guarda contra conteúdo faltando/incompleto | 2 |
| `src/lib/whatsapp.ts` | `buildWhatsappUrl()` — função pura | 3 |
| `src/lib/contact.ts` | `validateContact()` — função pura | 3 |
| `src/lib/*.test.ts` | Testes das duas funções acima | 3 |
| `src/lib/cn.ts` | Concatenação de classes | 4 |
| `src/components/ui/Icon.tsx` | Mapeia `IconName` → componente lucide | 4 |
| `src/components/ui/Section.tsx` | Wrapper de seção: id, container, padding, fundo | 4 |
| `src/components/ui/Eyebrow.tsx` | Rótulo mono em caps verde | 4 |
| `src/components/ui/Heading.tsx` | H2 com palavra em itálico verde | 4 |
| `src/components/ui/Card.tsx` | Card padrão com hover | 4 |
| `src/components/ui/IconBox.tsx` | Caixa 40×40 com ícone verde | 4 |
| `src/components/ui/Button.tsx` | Botão/link, variantes primary e secondary | 4 |
| `src/components/ui/Reveal.tsx` | Animação de entrada na viewport | 4 |
| `src/components/layout/Navbar.tsx` | Navbar sticky + estado do menu mobile | 5 |
| `src/components/layout/MobileMenu.tsx` | Painel full-screen do menu mobile | 5 |
| `src/components/layout/Logo.tsx` | Logo bicolor | 5 |
| `src/components/layout/Footer.tsx` | Rodapé em 3 colunas | 5 |
| `src/components/sections/Hero.tsx` | Seção 1 | 6 |
| `src/components/sections/CodeCard.tsx` | Janela de código do hero | 6 |
| `src/components/sections/Services.tsx` | Seção 2 | 7 |
| `src/components/sections/Differentials.tsx` | Seção 3 | 7 |
| `src/components/sections/Portfolio.tsx` | Seção 4 | 8 |
| `src/components/sections/Process.tsx` | Seção 5 | 9 |
| `src/components/sections/Founders.tsx` | Seção 6 | 9 |
| `src/components/sections/CtaStats.tsx` | Seção 7 | 10 |
| `src/components/sections/Contact.tsx` | Seção 8 (casca estática) | 11 |
| `src/components/sections/ContactForm.tsx` | Formulário (client) | 11 |
| `public/portfolio/*.svg`, `public/founders/*.svg` | Imagens placeholder | 8, 9 |
| `src/app/sitemap.ts`, `src/app/icon.svg`, `src/app/not-found.tsx`, `public/robots.txt` | SEO e 404 | 12 |
| `CLAUDE.md`, `README.md` | Documentação do projeto | 13 |

---

### Task 1: Scaffold, tokens de design e tipografia

Cria o projeto Next.js e traduz a paleta e a tipografia do spec em tokens do Tailwind v4. Ao final, a página inicial mostra apenas um título de teste — mas já na cor, fonte e fundo corretos.

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` (via scaffold)
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**
- Consumes: nada (primeira task)
- Produces: classes utilitárias Tailwind derivadas dos tokens — `bg-bg`, `bg-bg-alt`, `bg-surface`, `bg-surface-2`, `border-border`, `border-border-soft`, `text-text`, `text-muted`, `text-accent`, `bg-accent-soft`, `font-sans`, `font-mono`. Todas as tasks seguintes usam esses nomes.

- [ ] **Step 1: Gerar o projeto na raiz existente**

O diretório já contém `.git`, `.gitignore` e `docs/`. Gere o scaffold dentro dele:

```bash
cd "$(git rev-parse --show-toplevel)"
npx create-next-app@16.3.1 . \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack --use-npm --yes
```

Se o comando reclamar que o diretório não está vazio, responda que sim para prosseguir (ele preserva `.git` e `docs/`). Confirme depois que `docs/superpowers/` continua lá — se o scaffold tiver apagado algo, recupere com `git checkout -- docs`.

- [ ] **Step 2: Verificar que o scaffold roda**

```bash
npm run build
```

Esperado: build conclui sem erro, com a rota `/` marcada como estática.

- [ ] **Step 3: Instalar as dependências do projeto**

```bash
npm install lucide-react@1.31.0 motion@13.1.0
```

- [ ] **Step 4: Escrever os tokens em `src/app/globals.css`**

Substitua todo o conteúdo do arquivo por:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0e10;
  --color-bg-alt: #0d1214;
  --color-surface: #12171a;
  --color-surface-2: #171d21;
  --color-border: #1f262a;
  --color-border-soft: #2a3338;
  --color-text: #e8edef;
  --color-muted: #8a9ba3;
  --color-accent: #00e39b;
  --color-accent-dim: #0b7a5a;
  --color-accent-soft: rgb(0 227 155 / 0.1);

  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono-jb), ui-monospace, monospace;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* A navbar tem 64px; as âncoras param abaixo dela. */
  [id] {
    scroll-margin-top: 5rem;
  }

  ::selection {
    background-color: var(--color-accent);
    color: var(--color-bg);
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
    border-radius: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer utilities {
  /* Grid de linhas sutil do hero, apagando nas bordas. */
  .bg-grid {
    background-image:
      repeating-linear-gradient(
        to right,
        var(--color-border) 0 1px,
        transparent 1px 80px
      ),
      repeating-linear-gradient(
        to bottom,
        var(--color-border) 0 1px,
        transparent 1px 80px
      );
    opacity: 0.35;
    mask-image: radial-gradient(ellipse 100% 70% at 50% 30%, #000 40%, transparent 100%);
  }

  /* Brilho verde do hero. Mais fraco no mobile para não lavar o texto. */
  .bg-glow {
    background-image: radial-gradient(
      ellipse 60% 50% at 70% 35%,
      rgb(0 227 155 / 0.1),
      transparent 70%
    );
  }

  @media (max-width: 767px) {
    .bg-glow {
      background-image: radial-gradient(
        ellipse 90% 40% at 50% 20%,
        rgb(0 227 155 / 0.06),
        transparent 70%
      );
    }
  }

  .container-page {
    width: 100%;
    max-width: 1200px;
    margin-inline: auto;
    padding-inline: 1.25rem;
  }

  @media (min-width: 768px) {
    .container-page {
      padding-inline: 2rem;
    }
  }
}
```

- [ ] **Step 5: Configurar as fontes em `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Play Software",
  description: "Software house digital.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Liberar SVG no otimizador de imagens (`next.config.ts`)**

As capas do portfólio e os avatares dos fundadores começam como SVG nossos. O `next/image`
recusa SVG por padrão, então libere explicitamente — com CSP restritiva, já que todos os arquivos
são nossos e locais:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
```

- [ ] **Step 7: Página de verificação em `src/app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="container-page py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Verificação de tokens
      </p>
      <h1 className="mt-4 text-5xl font-extrabold tracking-tight">
        Transformando ideias em{" "}
        <em className="italic text-accent">produtos</em>
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Se este parágrafo está cinza-azulado sobre fundo quase preto, com a
        palavra acima em verde-menta itálico, os tokens estão corretos.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-surface p-6">
        <span className="font-mono text-sm text-muted">card de superfície</span>
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Verificar visualmente**

```bash
npm run dev
```

Abra `http://localhost:3000`. Confirme: fundo quase preto (`#0A0E10`), título branco-gelo em Inter extrabold, "produtos" em verde-menta itálico, rótulo em JetBrains Mono, card com borda cinza-escura 1px. Pare o servidor.

- [ ] **Step 9: Verificar build e lint**

```bash
npm run build && npm run lint
```

Esperado: ambos sem erro.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js com tokens de design e tipografia da Play Software"
```

---

### Task 2: Modelo de conteúdo

Todo o texto do site, tipado, num arquivo só. Um teste garante que nenhuma seção fique incompleta ao editar. Os textos completos estão na seção 6 do spec — copie de lá, palavra por palavra.

**Files:**
- Create: `vitest.config.ts`
- Create: `src/content/site.ts`
- Create: `src/content/site.test.ts`
- Modify: `package.json` (scripts de teste)

**Interfaces:**
- Consumes: nada
- Produces: `import { site } from "@/content/site"` e os tipos `IconName`, `NavLink`, `Service`, `Differential`, `Project`, `ProcessStep`, `Founder`, `Stat`, `SocialLink`. Toda seção lê daqui.

- [ ] **Step 1: Instalar e configurar o Vitest**

```bash
npm install -D vitest@4.1.10
```

Crie `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

Adicione os scripts em `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: Escrever o teste que falha**

Crie `src/content/site.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";

describe("conteúdo do site", () => {
  it("tem as quantidades esperadas de itens em cada seção", () => {
    expect(site.services_list).toHaveLength(6);
    expect(site.differentials_list).toHaveLength(4);
    expect(site.projects).toHaveLength(4);
    expect(site.process.steps).toHaveLength(5);
    expect(site.founders).toHaveLength(2);
    expect(site.stats).toHaveLength(3);
    expect(site.nav).toHaveLength(4);
  });

  it("não deixa nenhum texto vazio", () => {
    const textos = [
      site.brand.name,
      site.brand.tagline,
      site.hero.badge,
      site.hero.title,
      site.hero.subtitle,
      ...site.services_list.flatMap((s) => [s.title, s.description]),
      ...site.differentials_list.flatMap((d) => [d.title, d.description]),
      ...site.projects.flatMap((p) => [p.tag, p.title, p.description]),
      ...site.process.steps.flatMap((s) => [s.number, s.title, s.description]),
      ...site.founders.flatMap((f) => [f.name, f.role, f.quote, f.education]),
      ...site.stats.flatMap((s) => [s.value, s.label]),
    ];
    for (const texto of textos) {
      expect(texto.trim().length).toBeGreaterThan(0);
    }
  });

  it("usa acentuação em português (nenhum texto é ASCII puro por engano)", () => {
    const comAcento = [
      site.hero.title,
      site.services_list[0]!.description,
      site.process.title,
    ];
    expect(comAcento.some((t) => /[áàâãéêíóôõúç]/i.test(t))).toBe(true);
  });

  it("numera as etapas do processo de 01 a 05", () => {
    expect(site.process.steps.map((s) => s.number)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);
  });

  it("expõe o telefone do WhatsApp só com dígitos", () => {
    expect(site.contact.whatsapp).toMatch(/^\d{12,13}$/);
  });
});
```

- [ ] **Step 3: Rodar o teste e ver falhar**

```bash
npm test
```

Esperado: FAIL — "Cannot find module '@/content/site'".

- [ ] **Step 4: Escrever `src/content/site.ts`**

```ts
export type IconName =
  | "code"
  | "layers"
  | "rocket"
  | "monitor"
  | "globe"
  | "refresh"
  | "target"
  | "zap"
  | "shield"
  | "message"
  | "send"
  | "mail"
  | "arrowRight"
  | "externalLink"
  | "github"
  | "linkedin"
  | "instagram";

export type NavLink = { label: string; href: string };
export type Service = { icon: IconName; title: string; description: string };
export type Differential = { icon: IconName; title: string; description: string };
export type Project = {
  tag: string;
  title: string;
  description: string;
  url: string;
  image: string;
};
export type ProcessStep = { number: string; title: string; description: string };
export type Founder = {
  name: string;
  role: string;
  quote: string;
  education: string;
  photo: string;
};
export type Stat = { value: string; label: string };
export type SocialLink = { icon: IconName; label: string; url: string };

export const site = {
  brand: {
    name: "Play Software",
    /** Parte do nome pintada de verde no logo. */
    nameAccent: "Play",
    nameRest: "Software",
    url: "https://playsoftware.dev",
    tagline:
      "Studio de engenharia dedicado a construir soluções digitais de alto valor, com rigor técnico e visão de negócio.",
    copyright: "© 2026 Play Software. Todos os direitos reservados.",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "Serviços", href: "#servicos" },
    { label: "Portfólio", href: "#portfolio" },
    { label: "Sobre", href: "#sobre" },
  ] satisfies NavLink[],

  navCta: { label: "Agendar Conversa", href: "#contato" },

  hero: {
    badge: "SOFTWARE HOUSE DIGITAL",
    title: "Transformando ideias em",
    titleEmphasis: "produtos",
    subtitle:
      "Desenvolvimento de sistemas web com rigor técnico e pragmatismo. Onde a excelência técnica encontra a estratégia de escala.",
    /** Trecho de `subtitle` destacado em branco. */
    subtitleHighlight: "excelência técnica",
    primaryCta: { label: "Iniciar um Projeto", href: "#contato" },
    secondaryCta: { label: "Explorar Case Studies", href: "#portfolio" },
    codeTitle: "PlaySoftware.StartProject",
    deliveryLabel: "Taxa de Entrega",
    deliveryValue: "100%",
  },

  services: {
    eyebrow: "SERVIÇOS · O QUE FAZEMOS",
    title: "Soluções Digitais",
    titleEmphasis: "de Alta Fidelidade.",
    subtitle:
      "Construímos software que não apenas funciona bem, mas que acompanha o mercado e se torna parte do sucesso do seu negócio.",
  },

  differentials: {
    eyebrow: "DIFERENCIAIS",
    title: "O Rigor que seu",
    titleEmphasis: "Projeto Merece.",
  },

  portfolio: {
    eyebrow: "NOSSOS CASES",
    title: "Projetos em Produção.",
    linkLabel: "Visitar projeto",
  },

  process: {
    eyebrow: "PROCESSO",
    title: "Workflow de Engenharia",
    subtitle:
      "Um processo iterativo e transparente para entregar, medir e evoluir o produto a cada sprint.",
    steps: [
      {
        number: "01",
        title: "Discovery",
        description:
          "Análise profunda do cenário e identificação de requisitos estratégicos.",
      },
      {
        number: "02",
        title: "Arquitetura",
        description:
          "Definição de infraestrutura e stack tecnológico escalável e adequado.",
      },
      {
        number: "03",
        title: "UX/UI Design",
        description:
          "Interfaces de alta performance com UX/UI coerentes ao produto e mercado.",
      },
      {
        number: "04",
        title: "Sprint Dev",
        description:
          "Desenvolvimento com entregas contínuas, qualidade de código e revisões constantes.",
      },
      {
        number: "05",
        title: "Launch & Scale",
        description:
          "Deploy com suporte pós-entrega, monitoramento e evoluções contínuas do produto.",
      },
    ] satisfies ProcessStep[],
    highlight: {
      icon: "message" as IconName,
      title: "Validação contínua com você",
      description:
        "A cada etapa, fazemos uma conversa para alinhar expectativas, validar decisões e garantir que o produto segue no caminho certo.",
    },
  },

  about: {
    eyebrow: "FUNDADORES · LEADERSHIP",
    title: "Mentes por trás",
    titleEmphasis: "da execução.",
    subtitle:
      "A união entre visão técnica e visão de negócios é o que torna cada projeto uma solução real, não apenas código.",
  },

  cta: {
    title: "O próximo sistema que vai mudar o jogo",
    titleEmphasis: "começa aqui.",
    subtitle:
      "Projetos desenvolvidos com foco em performance, clareza e resultado. Tecnologia aplicada com visão prática de mercado.",
  },

  stats: [
    { value: "10+", label: "Projetos Entregues" },
    { value: "100%", label: "Foco em Soluções Web" },
    { value: "4+", label: "Segmentos Atendidos" },
  ] satisfies Stat[],

  services_list: [
    {
      icon: "code",
      title: "Desenvolvimento de SaaS",
      description:
        "Plataformas multi-tenant com arquitetura escalável e alto desempenho para atender milhares de usuários com eficiência.",
    },
    {
      icon: "layers",
      title: "Micro-SaaS",
      description:
        "Soluções ultra-focadas, rentáveis e com baixo custo operacional. Ideal para nichos específicos e operações enxutas.",
    },
    {
      icon: "rocket",
      title: "MVPs de Engenharia",
      description:
        "Validação rápida de conceitos com código de produção real, não protótipos descartáveis. Do zero ao mercado com velocidade.",
    },
    {
      icon: "monitor",
      title: "Sistemas Customizados",
      description:
        "Digitalização de operações complexas com interfaces intuitivas, regras de negócio sofisticadas e fluxos automatizados.",
    },
    {
      icon: "globe",
      title: "Experiências Web",
      description:
        "Marketing sites com estratégia de conversão, landing pages de alto desempenho e plataformas digitais que geram resultado.",
    },
    {
      icon: "refresh",
      title: "Modernização de Stack",
      description:
        "Refatoração e evolução de sistemas legados para tecnologias modernas, garantindo performance e manutenibilidade.",
    },
  ] satisfies Service[],

  differentials_list: [
    {
      icon: "target",
      title: "Foco no que importa pra você",
      description:
        "Não entregamos só código. Entregamos soluções que fazem sentido pro seu negócio. Cada funcionalidade é pensada pra gerar resultado real, não só preencher requisito.",
    },
    {
      icon: "zap",
      title: "Agilidade de verdade",
      description:
        "Trabalhamos em ciclos rápidos com entregas frequentes. Você acompanha a evolução do projeto de perto e participa de cada decisão importante.",
    },
    {
      icon: "shield",
      title: "Feito pra crescer com você",
      description:
        "Seu projeto começa pronto pra escalar. Não importa se hoje são 10 usuários ou amanhã serão 10 mil, a base já está preparada desde o início.",
    },
    {
      icon: "message",
      title: "Comunicação clara, prazos e preços reais",
      description:
        "Sem surpresas. Falamos de forma direta, cumprimos o que combinamos e praticamos preços justos. Você sabe exatamente o que esperar em cada etapa.",
    },
  ] satisfies Differential[],

  projects: [
    {
      tag: "SITE INSTITUCIONAL",
      title: "TSTECK Equipamentos",
      description:
        "Presença digital empresarial construída para transmitir solidez e confiança no segmento de equipamentos industriais.",
      url: "#",
      image: "/portfolio/tsteck.svg",
    },
    {
      tag: "PLATAFORMA SAAS",
      title: "AulaMarcada",
      description:
        "Sistema completo de agendamento e gestão de aulas particulares, com painel do professor e experiência do aluno integrada.",
      url: "#",
      image: "/portfolio/aulamarcada.svg",
    },
    {
      tag: "OPERAÇÃO COMERCIAL DIGITAL",
      title: "Site Mercado Livre",
      description:
        "Plataforma de operação comercial digital com foco em performance e experiência de compra otimizada.",
      url: "#",
      image: "/portfolio/mercado-livre.svg",
    },
    {
      tag: "E-COMMERCE · MARCA",
      title: "Vortex Patins",
      description:
        "Presença digital de nicho para marca de patins. E-commerce com identidade visual forte e experiência de compra premium.",
      url: "#",
      image: "/portfolio/vortex.svg",
    },
  ] satisfies Project[],

  founders: [
    {
      name: "Henrique",
      role: "CEO & Business Architect",
      quote:
        "Cada projeto é uma parceria. Nosso papel é traduzir ambição em estratégia e estratégia em resultado mensurável.",
      education: "Administração, PUC '24",
      photo: "/founders/henrique.svg",
    },
    {
      name: "Marcelo",
      role: "CTO & Product Architect",
      quote:
        "Tecnologia boa é a que resolve dores reais de negócio. A inovação é o canal, não o objetivo.",
      education: "Bacharel em Sistemas de Informação, FIAP 2023",
      photo: "/founders/marcelo.svg",
    },
  ] satisfies Founder[],

  contactSection: {
    title: "Vamos construir algo",
    titleEmphasis: "incrível.",
    subtitle:
      "Preencha o formulário abaixo ou entre em contato direto via WhatsApp.",
    fields: {
      name: { label: "SEU NOME", placeholder: "Nome completo" },
      email: { label: "E-MAIL PROFISSIONAL", placeholder: "email@empresa.com" },
      message: {
        label: "FALE DO PROJETO",
        placeholder: "Descreva brevemente sua ideia ou necessidade...",
      },
    },
    submitLabel: "Solicitar Proposta Técnica",
    whatsappPrompt: "Prefere conversar?",
    whatsappLabel: "WhatsApp direto",
    successMessage: "Abrimos o WhatsApp numa nova aba. Até já!",
  },

  contact: {
    /** Placeholder — substituir pelo número real. Só dígitos, com DDI. */
    whatsapp: "5511999999999",
    /** Placeholder — substituir pelo e-mail real. */
    email: "contato@playsoftware.dev",
  },

  footer: {
    navTitle: "NAVEGAÇÃO",
    contactTitle: "CONTATO",
    links: [
      { label: "Home", href: "#home" },
      { label: "Serviços", href: "#servicos" },
      { label: "Portfólio", href: "#portfolio" },
      { label: "Sobre", href: "#sobre" },
      { label: "Contato", href: "#contato" },
    ] satisfies NavLink[],
    socials: [
      { icon: "github", label: "GitHub", url: "#" },
      { icon: "linkedin", label: "LinkedIn", url: "#" },
      { icon: "instagram", label: "Instagram", url: "#" },
    ] satisfies SocialLink[],
  },

  seo: {
    title: "Play Software — Software House Digital",
    description:
      "Software house especializada em SaaS, micro-SaaS e sistemas web sob medida. Transformamos ideias em produtos com rigor técnico e visão de negócio.",
    keywords: [
      "software house",
      "desenvolvimento de SaaS",
      "micro-SaaS",
      "MVP",
      "sistemas web sob medida",
      "desenvolvimento web",
    ],
  },
} as const;
```

> **Nota de nomenclatura:** `services`/`services_list` e `differentials`/`differentials_list` são pares intencionais — o primeiro guarda os títulos e o subtítulo da seção, o segundo os itens listados. Mantenha essa convenção ao adicionar conteúdo.

- [ ] **Step 5: Rodar os testes e ver passar**

```bash
npm test
```

Esperado: 5 testes PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: modelo de conteúdo tipado do site com testes de integridade"
```

---

### Task 3: Lógica de contato (WhatsApp e validação)

As duas únicas funções com regra de negócio do site. TDD de verdade aqui.

**Files:**
- Create: `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`
- Create: `src/lib/contact.ts`, `src/lib/contact.test.ts`

**Interfaces:**
- Consumes: nada
- Produces:
  - `type ContactInput = { name: string; email: string; message: string }` (exportado de `@/lib/contact`)
  - `type ContactErrors = Partial<Record<keyof ContactInput, string>>` (de `@/lib/contact`)
  - `function validateContact(input: ContactInput): ContactErrors` (de `@/lib/contact`)
  - `function buildWhatsappUrl(phone: string, input: ContactInput): string` (de `@/lib/whatsapp`)
  - A Task 11 consome as três.

- [ ] **Step 1: Escrever os testes que falham**

Crie `src/lib/whatsapp.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildWhatsappUrl } from "@/lib/whatsapp";

const input = {
  name: "João Souza",
  email: "joao@empresa.com.br",
  message: "Preciso de um sistema de agendamento.",
};

describe("buildWhatsappUrl", () => {
  it("aponta para wa.me com o número informado", () => {
    const url = buildWhatsappUrl("5511988887777", input);
    expect(url.startsWith("https://wa.me/5511988887777?text=")).toBe(true);
  });

  it("remove qualquer caractere não numérico do telefone", () => {
    const url = buildWhatsappUrl("+55 (11) 98888-7777", input);
    expect(url.startsWith("https://wa.me/5511988887777?text=")).toBe(true);
  });

  it("monta a mensagem com nome, e-mail e o texto do projeto", () => {
    const url = buildWhatsappUrl("5511988887777", input);
    const texto = decodeURIComponent(url.split("?text=")[1]!);
    expect(texto).toBe(
      "Olá! Meu nome é João Souza (joao@empresa.com.br).\n\nPreciso de um sistema de agendamento.",
    );
  });

  it("codifica acentos e quebras de linha na URL", () => {
    const url = buildWhatsappUrl("5511988887777", input);
    const query = url.split("?text=")[1]!;
    expect(query).not.toContain(" ");
    expect(query).not.toContain("\n");
    expect(query).toContain("%0A");
  });

  it("remove espaços nas pontas dos campos", () => {
    const url = buildWhatsappUrl("5511988887777", {
      name: "  Ana  ",
      email: " ana@x.com ",
      message: "  Oi  ",
    });
    const texto = decodeURIComponent(url.split("?text=")[1]!);
    expect(texto).toBe("Olá! Meu nome é Ana (ana@x.com).\n\nOi");
  });
});
```

Crie `src/lib/contact.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateContact } from "@/lib/contact";

const valido = {
  name: "João Souza",
  email: "joao@empresa.com.br",
  message: "Preciso de um sistema de agendamento para minha clínica.",
};

describe("validateContact", () => {
  it("não retorna erro para uma entrada válida", () => {
    expect(validateContact(valido)).toEqual({});
  });

  it("exige o nome", () => {
    const erros = validateContact({ ...valido, name: "   " });
    expect(erros.name).toBe("Informe seu nome.");
  });

  it("exige nome com pelo menos 2 caracteres", () => {
    expect(validateContact({ ...valido, name: "A" }).name).toBe(
      "Informe seu nome completo.",
    );
  });

  it("exige o e-mail", () => {
    expect(validateContact({ ...valido, email: "" }).email).toBe(
      "Informe seu e-mail.",
    );
  });

  it("rejeita e-mail em formato inválido", () => {
    for (const email of ["joao", "joao@", "@empresa.com", "joao empresa.com"]) {
      expect(validateContact({ ...valido, email }).email).toBe(
        "E-mail inválido.",
      );
    }
  });

  it("aceita e-mail com subdomínio e sinal de mais", () => {
    expect(validateContact({ ...valido, email: "joao+tag@mail.empresa.com.br" }).email).toBeUndefined();
  });

  it("exige mensagem com pelo menos 10 caracteres", () => {
    expect(validateContact({ ...valido, message: "oi" }).message).toBe(
      "Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).",
    );
  });

  it("acumula todos os erros de uma vez", () => {
    const erros = validateContact({ name: "", email: "x", message: "" });
    expect(Object.keys(erros).sort()).toEqual(["email", "message", "name"]);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
npm test
```

Esperado: FAIL — módulos `@/lib/whatsapp` e `@/lib/contact` não existem.

- [ ] **Step 3: Implementar `src/lib/contact.ts`**

```ts
export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name.length === 0) {
    errors.name = "Informe seu nome.";
  } else if (name.length < 2) {
    errors.name = "Informe seu nome completo.";
  }

  if (email.length === 0) {
    errors.email = "Informe seu e-mail.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "E-mail inválido.";
  }

  if (message.length < 10) {
    errors.message =
      "Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).";
  }

  return errors;
}
```

- [ ] **Step 4: Implementar `src/lib/whatsapp.ts`**

```ts
import type { ContactInput } from "@/lib/contact";

/**
 * Monta o link do WhatsApp com a mensagem já preenchida.
 * `phone` aceita qualquer formatação — só os dígitos são usados.
 */
export function buildWhatsappUrl(phone: string, input: ContactInput): string {
  const digits = phone.replace(/\D/g, "");
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const text = `Olá! Meu nome é ${name} (${email}).\n\n${message}`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
```

- [ ] **Step 5: Rodar e ver passar**

```bash
npm test
```

Esperado: todos os testes PASS (5 de conteúdo + 5 de whatsapp + 8 de contato).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: validação do formulário e montagem do link de WhatsApp"
```

---

### Task 4: Primitivos de UI

Os oito blocos reutilizados por todas as seções. Nada de conteúdo aqui — só forma.

**Files:**
- Create: `src/lib/cn.ts`
- Create: `src/components/ui/Icon.tsx`, `Section.tsx`, `Eyebrow.tsx`, `Heading.tsx`, `Card.tsx`, `IconBox.tsx`, `Button.tsx`, `Reveal.tsx`

**Interfaces:**
- Consumes: `IconName` de `@/content/site`; classes de tokens da Task 1
- Produces (assinaturas que as Tasks 5–11 usam):
  - `cn(...classes: (string | false | null | undefined)[]): string`
  - `<Icon name={IconName} className?={string} />`
  - `<Section id?={string} alt?={boolean} className?={string} labelledBy?={string}>`
  - `<Eyebrow>{children}</Eyebrow>`
  - `<Heading as?={"h1"|"h2"} id?={string} text={string} emphasis?={string} className?={string} />`
  - `<Card className?={string} interactive?={boolean}>{children}</Card>`
  - `<IconBox name={IconName} size?={"sm"|"md"} />`
  - `<Button href={string} variant?={"primary"|"secondary"} icon?={IconName} external?={boolean} className?={string}>{children}</Button>`
  - `<Reveal delay?={number} className?={string}>{children}</Reveal>`

- [ ] **Step 1: `src/lib/cn.ts`**

```ts
export function cn(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 2: `src/components/ui/Icon.tsx`**

```tsx
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Github,
  Globe,
  Instagram,
  Layers,
  Linkedin,
  Mail,
  MessageCircle,
  Monitor,
  RefreshCw,
  Rocket,
  Send,
  Shield,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/site";

const ICONS: Record<IconName, LucideIcon> = {
  code: Code2,
  layers: Layers,
  rocket: Rocket,
  monitor: Monitor,
  globe: Globe,
  refresh: RefreshCw,
  target: Target,
  zap: Zap,
  shield: Shield,
  message: MessageCircle,
  send: Send,
  mail: Mail,
  arrowRight: ArrowRight,
  externalLink: ExternalLink,
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
};

export function Icon({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) {
  const Component = ICONS[name];
  return <Component className={className} aria-hidden="true" />;
}
```

> Se `npm run build` acusar que algum desses nomes não existe em `lucide-react@1.x`, rode `node -e "console.log(Object.keys(require('lucide-react')).filter(n => /^(Github|Linkedin|Instagram)$/i.test(n)))"` e ajuste a capitalização do import (`Github` vs `GitHub`). Não troque o ícone — só o nome.

- [ ] **Step 3: `src/components/ui/Section.tsx`**

```tsx
import { cn } from "@/lib/cn";

export function Section({
  id,
  alt = false,
  className,
  labelledBy,
  children,
}: {
  id?: string;
  alt?: boolean;
  className?: string;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-16 md:py-24 lg:py-28",
        alt ? "bg-bg-alt" : "bg-bg",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: `src/components/ui/Eyebrow.tsx`**

```tsx
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent",
        className,
      )}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 5: `src/components/ui/Heading.tsx`**

`emphasis` é renderizado numa segunda linha, em itálico verde — o padrão de todos os títulos do site.

```tsx
import { cn } from "@/lib/cn";

export function Heading({
  as: Tag = "h2",
  id,
  text,
  emphasis,
  className,
}: {
  as?: "h1" | "h2";
  id?: string;
  text: string;
  emphasis?: string;
  className?: string;
}) {
  const size =
    Tag === "h1"
      ? "text-[clamp(2.5rem,7vw,4.5rem)]"
      : "text-[clamp(2rem,4.5vw,3rem)]";

  return (
    <Tag
      id={id}
      className={cn(
        size,
        "font-extrabold leading-[1.08] tracking-tight text-balance",
        className,
      )}
    >
      {text}
      {emphasis ? (
        <>
          {" "}
          <em className="italic text-accent">{emphasis}</em>
        </>
      ) : null}
    </Tag>
  );
}
```

- [ ] **Step 6: `src/components/ui/Card.tsx`**

```tsx
import { cn } from "@/lib/cn";

export function Card({
  className,
  interactive = false,
  children,
}: {
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface",
        interactive &&
          "transition-colors duration-200 hover:border-border-soft hover:bg-surface-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 7: `src/components/ui/IconBox.tsx`**

```tsx
import type { IconName } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function IconBox({
  name,
  size = "md",
}: {
  name: IconName;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent",
        size === "md" ? "size-10" : "size-9",
      )}
    >
      <Icon name={name} className={size === "md" ? "size-5" : "size-4"} />
    </span>
  );
}
```

- [ ] **Step 8: `src/components/ui/Button.tsx`**

Sempre renderiza um `<a>` — no site todos os CTAs são links. `min-h-11` garante o alvo de toque de 44px.

```tsx
import type { IconName } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function Button({
  href,
  variant = "primary",
  icon,
  external = false,
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  icon?: IconName;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors duration-200",
        variant === "primary"
          ? "bg-accent text-bg hover:bg-accent/90"
          : "border border-border bg-transparent text-text hover:border-border-soft hover:bg-surface",
        className,
      )}
    >
      {children}
      {icon ? <Icon name={icon} className="size-4" /> : null}
    </a>
  );
}
```

- [ ] **Step 9: `src/components/ui/Reveal.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 10: Verificar que tudo compila**

```bash
npm run build && npm run lint
```

Esperado: sem erro. (A `page.tsx` ainda é a de verificação da Task 1 — normal.)

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: primitivos de UI (section, heading, card, button, icon, reveal)"
```

---

### Task 5: Navbar, menu mobile e footer

A casca da página. É a task com mais lógica de interface do projeto — o menu mobile precisa estar realmente acessível.

**Files:**
- Create: `src/components/layout/Logo.tsx`, `Navbar.tsx`, `MobileMenu.tsx`, `Footer.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.brand`, `site.nav`, `site.navCta`, `site.footer`, `site.contact` de `@/content/site`; `Icon`, `cn`
- Produces: `<Navbar />` e `<Footer />` sem props, usados em `page.tsx`

- [ ] **Step 1: `src/components/layout/Logo.tsx`**

```tsx
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-mono text-xl font-bold tracking-tight", className)}>
      <span className="text-accent">{site.brand.nameAccent}</span>
      <span className="text-text">{site.brand.nameRest}</span>
    </span>
  );
}
```

- [ ] **Step 2: `src/components/layout/MobileMenu.tsx`**

Painel full-screen. Fecha com clique em link, backdrop ou `Escape`; trava o scroll do body; move o foco para dentro e devolve ao fechar.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-bg/80 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        id="menu-mobile"
        className="relative mt-16 border-b border-border bg-bg-alt px-5 pb-8 pt-4"
      >
        <nav aria-label="Navegação principal">
          <ul className="flex flex-col">
            {site.nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onClose}
                  className="flex min-h-14 items-center border-b border-border text-lg font-medium text-text transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={site.navCta.href}
          onClick={onClose}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-bg"
        >
          {site.navCta.label}
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `src/components/layout/Navbar.tsx`**

Fica transparente no topo e ganha fundo com blur + borda depois de 8px de rolagem.

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled || menuOpen
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#home" aria-label={`${site.brand.name} — início`}>
          <Logo />
        </a>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {site.nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={site.navCta.href}
          className="hidden min-h-10 items-center rounded-full bg-accent px-5 text-sm font-semibold text-bg transition-colors hover:bg-accent/90 md:inline-flex"
        >
          {site.navCta.label}
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          className="inline-flex size-11 items-center justify-center rounded-lg text-text md:hidden"
        >
          {menuOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
```

- [ ] **Step 4: `src/components/layout/Footer.tsx`**

```tsx
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  const socials = site.footer.socials.filter((s) => s.url !== "#");

  return (
    <footer className="border-t border-border bg-bg-alt">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.brand.tagline}
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-text">
              {site.footer.navTitle}
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {site.footer.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-text">
              {site.footer.contactTitle}
            </h2>
            <a
              href={`mailto:${site.contact.email}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
            >
              <Icon name="mail" className="size-4" />
              {site.contact.email}
            </a>

            {socials.length > 0 ? (
              <ul className="mt-4 flex gap-3">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex size-11 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-border-soft hover:text-accent"
                    >
                      <Icon name={social.icon} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-center text-xs text-muted">
          {site.brand.copyright}
        </p>
      </div>
    </footer>
  );
}
```

> As redes sociais estão com URL `#` no conteúdo placeholder, então o bloco inteiro some por ora. Ao preencher as URLs reais na Task 13, ele reaparece sozinho.

- [ ] **Step 5: Montar a casca em `src/app/page.tsx`**

```tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="conteudo">
        <section id="home" className="pt-40 pb-24">
          <div className="container-page">
            <p className="text-muted">Seções entram aqui nas próximas tasks.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Verificar navbar e menu mobile**

```bash
npm run dev
```

Confira em `http://localhost:3000`:
1. Desktop (1440px): navbar transparente no topo, ganha fundo escuro com blur e borda ao rolar; 4 links; botão verde arredondado à direita.
2. Mobile (DevTools, 390px): links e botão somem, aparece o hamburger. Ao tocar: painel escuro desce, o body para de rolar, o primeiro link recebe foco. `Escape` fecha. Clicar num link fecha e rola até a âncora.
3. Teclado: `Tab` percorre logo → links → CTA na ordem visual, com contorno verde visível.

- [ ] **Step 7: Build e lint**

```bash
npm run build && npm run lint
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: navbar sticky com menu mobile acessível e footer"
```

---

### Task 6: Seção Hero

**Files:**
- Create: `src/components/sections/CodeCard.tsx`, `src/components/sections/Hero.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.hero`; `Heading`, `Button`, `Reveal`
- Produces: `<Hero />` sem props

- [ ] **Step 1: `src/components/sections/CodeCard.tsx`**

O realce de sintaxe é estático — spans com classe, sem biblioteca. `overflow-x-auto` isola a rolagem horizontal dentro do card.

```tsx
import { site } from "@/content/site";

const KW = "text-accent";
const FN = "text-accent";
const VAR = "text-text";
const PUNC = "text-muted";
const COMMENT = "text-muted/70";

export function CodeCard() {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-muted">
          {site.hero.codeTitle}
        </span>
      </div>

      <div className="overflow-x-auto px-4 py-5 sm:px-6">
        <pre className="font-mono text-[0.8125rem] leading-relaxed sm:text-sm">
          <code>
            <span className={KW}>const</span> <span className={VAR}>projeto</span>{" "}
            <span className={PUNC}>=</span> <span className={KW}>await</span>{" "}
            <span className={VAR}>playSoftware</span>
            {"\n  "}
            <span className={PUNC}>.</span>
            <span className={FN}>analisar</span>
            <span className={PUNC}>(requisitos)</span>
            {"\n  "}
            <span className={PUNC}>.</span>
            <span className={FN}>projetar</span>
            <span className={PUNC}>(arquitetura)</span>
            {"\n  "}
            <span className={PUNC}>.</span>
            <span className={FN}>desenvolver</span>
            <span className={PUNC}>(features)</span>
            {"\n  "}
            <span className={PUNC}>.</span>
            <span className={FN}>entregar</span>
            <span className={PUNC}>(produção);</span>
            {"\n"}
            <span className={COMMENT}>{"// resultado: produto pronto ✓"}</span>
            {"\n"}
            <span className={VAR}>console</span>
            <span className={PUNC}>.</span>
            <span className={FN}>log</span>
            <span className={PUNC}>(projeto.status);</span>
          </code>
        </pre>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-4 sm:px-6">
        <span className="font-mono text-xs text-muted">
          {site.hero.deliveryLabel}
        </span>
        <span className="font-mono text-2xl font-bold text-accent">
          {site.hero.deliveryValue}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `src/components/sections/Hero.tsx`**

O subtítulo tem um trecho em branco. Em vez de HTML solto, quebre a string em torno de `subtitleHighlight`:

```tsx
import { site } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CodeCard } from "@/components/sections/CodeCard";

function Subtitle() {
  const { subtitle, subtitleHighlight } = site.hero;
  const [antes, depois] = subtitle.split(subtitleHighlight);

  return (
    <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
      {antes}
      <strong className="font-semibold text-text">{subtitleHighlight}</strong>
      {depois}
    </p>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-page relative pb-20 pt-28 md:pb-28 md:pt-36 lg:pb-32 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                  {site.hero.badge}
                </span>
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <Heading
                as="h1"
                text={site.hero.title}
                emphasis={site.hero.titleEmphasis}
                className="mt-8"
              />
              <Subtitle />
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href={site.hero.primaryCta.href} icon="arrowRight">
                  {site.hero.primaryCta.label}
                </Button>
                <Button
                  href={site.hero.secondaryCta.href}
                  variant="secondary"
                  icon="externalLink"
                >
                  {site.hero.secondaryCta.label}
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.24}>
            <CodeCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Usar em `src/app/page.tsx`**

Substitua a `<section id="home">` provisória por `<Hero />` (importando de `@/components/sections/Hero`).

- [ ] **Step 4: Verificar**

```bash
npm run dev
```

Compare com o print do hero: badge com bolinha pulsante, H1 em duas linhas com "produtos" em itálico verde, dois CTAs, card de código à direita com traffic lights e "Taxa de Entrega / 100%". Em 360px: tudo empilhado, CTAs em largura total, e o card de código rola sozinho na horizontal **sem** a página rolar junto.

- [ ] **Step 5: Build, lint e commit**

```bash
npm run build && npm run lint
git add -A
git commit -m "feat: seção hero com card de código e fundo em grid"
```

---

### Task 7: Seções Serviços e Diferenciais

Duas seções que compartilham o mesmo material (card + ícone), então vão juntas.

**Files:**
- Create: `src/components/sections/Services.tsx`, `src/components/sections/Differentials.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.services`, `site.services_list`, `site.differentials`, `site.differentials_list`; `Section`, `Eyebrow`, `Heading`, `Card`, `IconBox`, `Reveal`
- Produces: `<Services />`, `<Differentials />`

> **Regra dos títulos, válida daqui em diante.** O itálico verde só aparece em **três** seções —
> Hero ("produtos"), CTA ("começa aqui.") e Contato ("incrível."). Nos títulos de Serviços,
> Diferenciais, Portfólio, Processo e Sobre o texto é **inteiramente branco**: concatene
> `title` + `titleEmphasis` e **não** passe a prop `emphasis` ao `Heading`.

- [ ] **Step 1: `src/components/sections/Services.tsx`**

```tsx
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { Reveal } from "@/components/ui/Reveal";

export function Services() {
  return (
    <Section id="servicos" alt labelledBy="servicos-titulo">
      <Reveal>
        <Eyebrow>{site.services.eyebrow}</Eyebrow>
        <Heading
          id="servicos-titulo"
          text={`${site.services.title} ${site.services.titleEmphasis}`}
          className="mt-4 max-w-2xl"
        />
        <p className="mt-6 max-w-2xl leading-relaxed text-muted">
          {site.services.subtitle}
        </p>
      </Reveal>

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {site.services_list.map((service, index) => (
          <li key={service.title}>
            <Reveal delay={index * 0.05} className="h-full">
              <Card interactive className="h-full p-6">
                <IconBox name={service.icon} />
                <h3 className="mt-5 text-lg font-bold text-text">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 2: `src/components/sections/Differentials.tsx`**

Duas colunas em `lg`: título à esquerda, grudado ao rolar; lista à direita.

```tsx
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconBox } from "@/components/ui/IconBox";
import { Reveal } from "@/components/ui/Reveal";

export function Differentials() {
  return (
    <Section labelledBy="diferenciais-titulo">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-32">
            <Eyebrow>{site.differentials.eyebrow}</Eyebrow>
            <Heading
              id="diferenciais-titulo"
              text={`${site.differentials.title} ${site.differentials.titleEmphasis}`}
              className="mt-4"
            />
          </div>
        </Reveal>

        <ul className="flex flex-col gap-10">
          {site.differentials_list.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 0.05}>
                <div className="flex gap-4">
                  <IconBox name={item.icon} size="sm" />
                  <div>
                    <h3 className="text-base font-bold text-text">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Adicionar as duas em `src/app/page.tsx`**, na ordem `<Hero /> <Services /> <Differentials />`.

- [ ] **Step 4: Verificar**

```bash
npm run dev
```

Serviços: 6 cards em 3 colunas (desktop), 2 (tablet), 1 (mobile); ícone verde em caixa arredondada; cards da mesma linha com a mesma altura. Diferenciais: título à esquerda que acompanha a rolagem, 4 itens à direita; em mobile o título fica acima da lista.

- [ ] **Step 5: Build, lint e commit**

```bash
npm run build && npm run lint
git add -A
git commit -m "feat: seções de serviços e diferenciais"
```

---

### Task 8: Seção Portfólio

**Files:**
- Create: `public/portfolio/tsteck.svg`, `aulamarcada.svg`, `mercado-livre.svg`, `vortex.svg`
- Create: `src/components/sections/Portfolio.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.portfolio`, `site.projects`; `Section`, `Eyebrow`, `Heading`, `Card`, `Icon`, `Reveal`
- Produces: `<Portfolio />`

- [ ] **Step 1: Criar as capas placeholder**

Crie `public/portfolio/tsteck.svg` com o conteúdo abaixo, e depois os outros três trocando **apenas** o texto do `<text>` (`AulaMarcada`, `Site Mercado Livre`, `Vortex Patins`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#12171A"/>
      <stop offset="100%" stop-color="#0A0E10"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <rect width="1200" height="675" fill="none" stroke="#1F262A" stroke-width="2"/>
  <text x="600" y="345" fill="#8A9BA3" font-family="monospace" font-size="46" font-weight="bold" text-anchor="middle">TSTECK Equipamentos</text>
</svg>
```

- [ ] **Step 2: `src/components/sections/Portfolio.tsx`**

O link "Visitar projeto" só vira link de verdade quando a URL deixa de ser `#`.

```tsx
import Image from "next/image";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function Portfolio() {
  return (
    <Section id="portfolio" alt labelledBy="portfolio-titulo">
      <Reveal>
        <Eyebrow>{site.portfolio.eyebrow}</Eyebrow>
        <Heading
          id="portfolio-titulo"
          text={site.portfolio.title}
          className="mt-4"
        />
      </Reveal>

      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {site.projects.map((project, index) => (
          <li key={project.title}>
            <Reveal delay={index * 0.06} className="h-full">
              <Card interactive className="h-full overflow-hidden">
                <div className="relative aspect-[16/9] border-b border-border bg-bg">
                  <Image
                    src={project.image}
                    alt={`Capa do projeto ${project.title}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-accent">
                    {project.tag}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-text">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  {project.url !== "#" ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
                    >
                      {site.portfolio.linkLabel}
                      <Icon name="externalLink" className="size-4" />
                    </a>
                  ) : (
                    <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted">
                      {site.portfolio.linkLabel}
                      <Icon name="externalLink" className="size-4" />
                    </span>
                  )}
                </div>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 3: Adicionar `<Portfolio />` em `page.tsx`**, depois de `<Differentials />`.

- [ ] **Step 4: Verificar**

Grid 2×2 no desktop, 1 coluna no mobile; capas em 16:9 sem distorção; tag verde em mono; os 4 cards da mesma linha com a mesma altura.

- [ ] **Step 5: Build, lint e commit**

```bash
npm run build && npm run lint
git add -A
git commit -m "feat: seção de portfólio com capas placeholder"
```

---

### Task 9: Seções Processo e Fundadores

**Files:**
- Create: `public/founders/henrique.svg`, `public/founders/marcelo.svg`
- Create: `src/components/sections/Process.tsx`, `src/components/sections/Founders.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.process`, `site.about`, `site.founders`; `Section`, `Eyebrow`, `Heading`, `Card`, `IconBox`, `Reveal`
- Produces: `<Process />`, `<Founders />`

- [ ] **Step 1: Avatares placeholder**

`public/founders/henrique.svg` (depois repita para `marcelo.svg` trocando a letra para `M`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img">
  <circle cx="48" cy="48" r="48" fill="#171D21"/>
  <circle cx="48" cy="48" r="47" fill="none" stroke="#1F262A" stroke-width="2"/>
  <text x="48" y="62" fill="#00E39B" font-family="monospace" font-size="38" font-weight="bold" text-anchor="middle">H</text>
</svg>
```

- [ ] **Step 2: `src/components/sections/Process.tsx`**

```tsx
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  return (
    <Section labelledBy="processo-titulo">
      <Reveal>
        <Eyebrow>{site.process.eyebrow}</Eyebrow>
        <Heading
          id="processo-titulo"
          text={site.process.title}
          className="mt-4"
        />
        <p className="mt-6 max-w-xl leading-relaxed text-muted">
          {site.process.subtitle}
        </p>
      </Reveal>

      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        {site.process.steps.map((step, index) => (
          <li key={step.number}>
            <Reveal delay={index * 0.05}>
              <span className="font-mono text-4xl font-bold text-accent-dim">
                {step.number}
              </span>
              <h3 className="mt-3 text-base font-bold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal delay={0.1}>
        <Card className="mx-auto mt-16 max-w-2xl p-6">
          <div className="flex gap-4">
            <IconBox name={site.process.highlight.icon} />
            <div>
              <h3 className="text-base font-bold text-text">
                {site.process.highlight.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {site.process.highlight.description}
              </p>
            </div>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 3: `src/components/sections/Founders.tsx`**

```tsx
import Image from "next/image";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

export function Founders() {
  return (
    <Section id="sobre" alt labelledBy="sobre-titulo">
      <Reveal>
        <Eyebrow>{site.about.eyebrow}</Eyebrow>
        <Heading
          id="sobre-titulo"
          text={`${site.about.title} ${site.about.titleEmphasis}`}
          className="mt-4 max-w-xl"
        />
        <p className="mt-6 max-w-2xl leading-relaxed text-muted">
          {site.about.subtitle}
        </p>
      </Reveal>

      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {site.founders.map((founder, index) => (
          <li key={founder.name}>
            <Reveal delay={index * 0.08} className="h-full">
              <Card className="h-full p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={founder.photo}
                    alt={`Foto de ${founder.name}`}
                    width={56}
                    height={56}
                    className="size-14 rounded-full border border-border object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-text">
                      {founder.name}
                    </h3>
                    <p className="text-sm font-medium text-accent">
                      {founder.role}
                    </p>
                  </div>
                </div>

                <blockquote className="mt-6 text-sm italic leading-relaxed text-muted">
                  &ldquo;{founder.quote}&rdquo;
                </blockquote>

                <p className="mt-6 text-xs text-muted/80">{founder.education}</p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 4: Adicionar em `page.tsx`**, na ordem `<Portfolio /> <Process /> <Founders />`.

- [ ] **Step 5: Verificar**

Processo: 5 colunas no desktop com números grandes em verde escuro, 2 colunas em tablet, 1 no mobile; card de validação centralizado abaixo. Fundadores: 2 cards lado a lado, avatar circular, cargo em verde, citação em itálico.

- [ ] **Step 6: Build, lint e commit**

```bash
npm run build && npm run lint
git add -A
git commit -m "feat: seções de processo e fundadores"
```

---

### Task 10: Seção CTA + Números

**Files:**
- Create: `src/components/sections/CtaStats.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site.cta`, `site.stats`; `Section`, `Heading`, `Reveal`
- Produces: `<CtaStats />`

- [ ] **Step 1: `src/components/sections/CtaStats.tsx`**

Única seção centralizada do site. O itálico verde aparece aqui.

```tsx
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";

export function CtaStats() {
  return (
    <Section labelledBy="cta-titulo">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <Heading
            id="cta-titulo"
            text={site.cta.title}
            emphasis={site.cta.titleEmphasis}
          />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted">
            {site.cta.subtitle}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4">
          {site.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-mono text-3xl font-bold text-accent sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-xs text-muted sm:text-sm">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 2: Adicionar `<CtaStats />` em `page.tsx`**, depois de `<Founders />`.

- [ ] **Step 3: Verificar em 360px** que os três números ficam lado a lado sem quebrar o rótulo em mais de duas linhas.

- [ ] **Step 4: Build, lint e commit**

```bash
npm run build && npm run lint
git add -A
git commit -m "feat: seção de CTA com números da empresa"
```

---

### Task 11: Seção de Contato

Fecha o circuito: o formulário usa as funções puras da Task 3.

**Files:**
- Create: `src/components/sections/ContactForm.tsx`, `src/components/sections/Contact.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `validateContact`, `ContactErrors`, `ContactInput` de `@/lib/contact`; `buildWhatsappUrl` de `@/lib/whatsapp`; `site.contactSection`, `site.contact`
- Produces: `<Contact />`

- [ ] **Step 1: `src/components/sections/ContactForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import {
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

const VAZIO: ContactInput = { name: "", email: "", message: "" };

const labelClass =
  "block font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-muted";

const fieldClass =
  "mt-2 w-full rounded-lg border bg-surface-2 px-4 py-3 text-[16px] text-text placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none";

/**
 * Ponto único de entrega da mensagem. Hoje abre o WhatsApp;
 * trocar por envio de e-mail é substituir o corpo desta função.
 */
function submitContact(input: ContactInput) {
  const url = buildWhatsappUrl(site.contact.whatsapp, input);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(VAZIO);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  function update(field: keyof ContactInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSent(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    submitContact(values);
    setValues(VAZIO);
    setSent(true);
  }

  const { fields } = site.contactSection;

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="contato-nome" className={labelClass}>
            {fields.name.label}
          </label>
          <input
            id="contato-nome"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={fields.name.placeholder}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "erro-nome" : undefined}
            className={cn(
              fieldClass,
              errors.name ? "border-red-500/70" : "border-border",
            )}
          />
          {errors.name ? (
            <p id="erro-nome" role="alert" className="mt-2 text-xs text-red-400">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contato-email" className={labelClass}>
            {fields.email.label}
          </label>
          <input
            id="contato-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={fields.email.placeholder}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "erro-email" : undefined}
            className={cn(
              fieldClass,
              errors.email ? "border-red-500/70" : "border-border",
            )}
          />
          {errors.email ? (
            <p id="erro-email" role="alert" className="mt-2 text-xs text-red-400">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contato-mensagem" className={labelClass}>
          {fields.message.label}
        </label>
        <textarea
          id="contato-mensagem"
          name="message"
          rows={5}
          placeholder={fields.message.placeholder}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "erro-mensagem" : undefined}
          className={cn(
            fieldClass,
            "resize-y",
            errors.message ? "border-red-500/70" : "border-border",
          )}
        />
        {errors.message ? (
          <p id="erro-mensagem" role="alert" className="mt-2 text-xs text-red-400">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-bold text-bg transition-colors hover:bg-accent/90"
      >
        <Icon name="send" className="size-4" />
        {site.contactSection.submitLabel}
      </button>

      {sent ? (
        <p role="status" className="mt-4 text-center text-sm text-accent">
          {site.contactSection.successMessage}
        </p>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted">
        {site.contactSection.whatsappPrompt}{" "}
        <a
          href={`https://wa.me/${site.contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent hover:opacity-80"
        >
          <Icon name="message" className="size-4" />
          {site.contactSection.whatsappLabel}
        </a>
      </p>
    </form>
  );
}
```

- [ ] **Step 2: `src/components/sections/Contact.tsx`**

```tsx
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";

export function Contact() {
  return (
    <Section id="contato" labelledBy="contato-titulo">
      <Reveal>
        <Card className="mx-auto max-w-3xl p-6 sm:p-10">
          <div className="text-center">
            <Heading
              id="contato-titulo"
              text={site.contactSection.title}
              emphasis={site.contactSection.titleEmphasis}
            />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.contactSection.subtitle}
            </p>
          </div>

          <ContactForm />
        </Card>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 3: Adicionar `<Contact />` em `page.tsx`**, como última seção antes do `</main>`.

- [ ] **Step 4: Verificar o fluxo completo**

```bash
npm run dev
```

1. Enviar vazio → três erros aparecem, bordas vermelhas, nenhuma aba abre.
2. E-mail `joao` → "E-mail inválido."
3. Mensagem "oi" → erro de mínimo.
4. Preencher tudo válido → abre `wa.me` numa aba nova com nome, e-mail e mensagem já no texto; o formulário limpa e aparece a confirmação verde.
5. Em iPhone simulado: focar um campo **não** dá zoom (é o `text-[16px]`).
6. Leitor de tela / DevTools: cada input tem `<label>` associado e o erro é lido via `aria-describedby`.

- [ ] **Step 5: Rodar toda a suíte, build, lint e commit**

```bash
npm test && npm run build && npm run lint
git add -A
git commit -m "feat: seção de contato com formulário que abre o WhatsApp"
```

---

### Task 12: SEO, favicon, 404 e acessibilidade

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/icon.svg`, `src/app/sitemap.ts`, `src/app/not-found.tsx`
- Create: `public/robots.txt`

**Interfaces:**
- Consumes: `site.seo`, `site.brand`, `site.contact`
- Produces: metadata completa, JSON-LD e skip-link no layout

- [ ] **Step 1: Layout completo em `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.brand.url),
  title: site.seo.title,
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.brand.url,
    siteName: site.brand.name,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.brand.name,
  url: site.brand.url,
  description: site.brand.tagline,
  email: site.contact.email,
  founder: site.founders.map((f) => ({
    "@type": "Person",
    name: f.name,
    jobTitle: f.role,
  })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
        >
          Pular para o conteúdo
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: `src/app/icon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#0A0E10"/>
  <text x="32" y="45" fill="#00E39B" font-family="monospace" font-size="38" font-weight="bold" text-anchor="middle">P</text>
</svg>
```

- [ ] **Step 3: `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.brand.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
```

- [ ] **Step 4: `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://playsoftware.dev/sitemap.xml
```

- [ ] **Step 5: `src/app/not-found.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center text-center">
      <Logo />
      <p className="mt-8 font-mono text-5xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        O endereço que você acessou não existe ou foi movido.
      </p>
      <Button href="/" className="mt-8" icon="arrowRight">
        Voltar para o início
      </Button>
    </main>
  );
}
```

- [ ] **Step 6: Verificar**

```bash
npm run build
npm start
```

- `curl -s localhost:3000 | grep -o '<title>[^<]*</title>'` → título do site
- `curl -s localhost:3000 | grep -c 'application/ld+json'` → `1`
- `curl -s localhost:3000/sitemap.xml | head -3` → XML válido
- `curl -s -o /dev/null -w "%{http_code}" localhost:3000/rota-inexistente` → `404`
- No navegador: `Tab` a partir do topo revela o skip-link verde.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: metadata, JSON-LD, sitemap, favicon e página 404"
```

---

### Task 13: Verificação responsiva, documentação e deploy

**Files:**
- Create: `CLAUDE.md`, `README.md`
- Modify: `../CLAUDE.md` (índice de projetos do diretório pai, fora deste repositório)

**Interfaces:**
- Consumes: tudo
- Produces: site verificado, documentado e no ar

- [ ] **Step 1: Auditoria responsiva**

```bash
npm run build && npm start
```

Nos DevTools, para cada largura — **360px, 390px, 768px, 1024px, 1440px** — percorra a página inteira e confirme:

1. `document.documentElement.scrollWidth <= window.innerWidth` (cole no console; deve dar `true` em todas).
2. Nenhum texto cortado ou sobreposto.
3. O card de código do hero rola sozinho na horizontal, sem arrastar a página.
4. Menu mobile abre, trava o scroll e fecha nas três formas (link, backdrop, `Escape`).
5. Todos os alvos clicáveis com ao menos 44px de altura.

Anote e corrija o que falhar antes de seguir.

- [ ] **Step 2: Verificação final da suíte**

```bash
npm test && npm run build && npm run lint
```

Esperado: 18 testes PASS, build estático da rota `/`, lint sem aviso. Se algo falhar, conserte antes de continuar — não prossiga com falha conhecida.

- [ ] **Step 3: Escrever `README.md`**

Deve conter: o que é o projeto, comandos (`npm run dev`, `build`, `test`, `lint`), e um bloco "Como atualizar o conteúdo" explicando que **tudo** se edita em `src/content/site.ts` e que as imagens vivem em `public/portfolio/` e `public/founders/`.

- [ ] **Step 4: Escrever `CLAUDE.md` do projeto**

Deve conter: visão do site, stack e versões, estrutura de pastas com a responsabilidade de cada camada, o design system (paleta com valores hex, fontes, os padrões visuais recorrentes), a regra de que nenhum componente hardcoda marca ou contato, a regra de mobile-first com verificação em 360px, e o link para o spec.

- [ ] **Step 5: Registrar o projeto no índice da raiz**

No `CLAUDE.md` do diretório pai (fora deste repositório), acrescente uma quarta entrada na lista, no mesmo formato das outras três:

```markdown
- **`playsoftware-site/`** — **Play Software**, site institucional da software house (cartão de visitas): serviços,
  portfólio, processo e fundadores, com contato via WhatsApp. Next.js 16 + Tailwind v4, estático,
  deploy na Vercel.
  👉 Leia **[`playsoftware-site/CLAUDE.md`](playsoftware-site/CLAUDE.md)** — tem o design system e a regra de que
  todo conteúdo vive em `src/content/site.ts`.
```

- [ ] **Step 6: Commit da documentação**

```bash
git add -A
git commit -m "docs: README e CLAUDE.md do projeto"
```

- [ ] **Step 7: Substituir os placeholders (com o cliente)**

Peça ao usuário e aplique em `src/content/site.ts`:

| Campo | Onde |
|---|---|
| Número do WhatsApp (só dígitos, com DDI) | `site.contact.whatsapp` |
| E-mail real | `site.contact.email` |
| URLs dos 4 projetos | `site.projects[].url` |
| URLs de GitHub / LinkedIn / Instagram | `site.footer.socials[].url` |
| Domínio final | `site.brand.url` e `public/robots.txt` |

E substitua as imagens em `public/portfolio/` e `public/founders/` pelas reais (mantendo os mesmos nomes de arquivo, ou atualizando `image`/`photo` no conteúdo). Se as capas forem `.png`/`.jpg`, ajuste as extensões em `site.projects[].image`.

Se o usuário ainda não tiver os dados, **não bloqueie o deploy** — o site funciona com placeholders. Registre o pendente e siga.

- [ ] **Step 8: Deploy na Vercel**

Este passo exige login interativo. Peça ao usuário que rode, no próprio chat:

```
! npx vercel login
```

Depois:

```bash
npx vercel link --yes
npx vercel --prod
```

Confirme que a URL de produção carrega, que o menu mobile funciona no celular de verdade e que o botão do WhatsApp abre o app.

- [ ] **Step 9: Commit final**

```bash
git add -A
git commit -m "chore: dados de contato reais e deploy de produção"
```

---

## Notas para quem executa

- **A ordem importa.** As Tasks 1–4 constroem a base que todas as seções usam. Não pule para a Task 7 sem a 4.
- **Não invente conteúdo.** Se um texto não estiver na Task 2 nem na seção 6 do spec, pergunte — não escreva um placeholder criativo.
- **Uma cor só.** Ao ficar em dúvida sobre uma cor, use `--color-muted` ou `--color-border`. Verde só para destaque de verdade.
- **Confie no `site.ts`.** Se você se pegar escrevendo um texto direto no JSX, pare e mova para o conteúdo.
