@AGENTS.md

# CLAUDE.md — playsoftware-site

> A linha `@AGENTS.md` acima é gerada e sobrescrita automaticamente pelo `next dev`
> (`node_modules/next/dist/server/lib/generate-agent-files.js`). Não a remova nem a mova —
> ela precisa continuar sendo a primeira linha do arquivo para que `next dev` e a
> documentação abaixo coexistam sem um sobrescrever o outro.

## Visão

Site institucional de página única (`/`) para a Play Software, uma software house. Funciona como
cartão de visitas digital: apresenta serviços, portfólio, processo de trabalho e
fundadores, e converte contato via formulário (que abre o WhatsApp com a mensagem
pré-preenchida) ou link direto de WhatsApp.

100% estático — sem backend, sem banco de dados, sem CMS. Todo o conteúdo textual vive em
`src/content/site.ts`.

Spec de design original (aprovado pelo cliente):
[`docs/superpowers/specs/2026-08-14-playsoftware-site-design.md`](./docs/superpowers/specs/2026-08-14-playsoftware-site-design.md).
Plano de implementação em 13 tasks:
[`docs/superpowers/plans/2026-08-14-playsoftware-site.md`](./docs/superpowers/plans/2026-08-14-playsoftware-site.md).

## Stack e versões

- **Next.js 16** (App Router, Turbopack) — ver `node_modules/next/dist/docs/` para as
  mudanças de API desta versão antes de assumir comportamento de versões anteriores.
- **React 19**
- **Tailwind CSS v4** — tokens de design via `@theme` em `src/app/globals.css`, não em
  `tailwind.config.*` (v4 não usa mais arquivo de config para tokens).
- **TypeScript** em modo `strict`.
- **Vitest** para testes unitários (`src/**/*.test.ts`).
- **ESLint** com `eslint-config-next`.

## Estrutura de pastas

```
src/
  app/                  # App Router: rotas, layout raiz, metadata, CSS global
    layout.tsx          #   fonts (next/font), <head> metadata, JSON-LD, skip-link
    page.tsx            #   monta a página inteira: Navbar + seções + Footer
    globals.css          #   tokens de design (@theme), estilos base, utilitários (.bg-grid, .reveal...)
    not-found.tsx        #   página 404
    sitemap.ts            #   gera /sitemap.xml a partir de site.brand.url
    robots.ts               #   gera /robots.txt a partir de site.brand.url
    opengraph-image.tsx      #   gera a imagem de Open Graph/Twitter Card (ImageResponse)
    icon.svg               #   favicon
  content/
    site.ts               # ÚNICA fonte de verdade para todo texto/dado do site
    site.test.ts           #   testes de integridade do conteúdo (todo campo obrigatório presente etc.)
  components/
    ui/                   # primitivos genéricos, agnósticos de conteúdo específico
                            #   (Button, Card, Eyebrow, Heading, Icon, IconBox, Reveal, Section)
    layout/                # chrome da página: Navbar, MobileMenu, Footer, Logo
    sections/               # uma seção da landing por arquivo (Hero, Services, Differentials,
                            #   Portfolio, Process, Founders, CtaStats, Contact, ContactForm, CodeCard)
                            #   — cada uma consome site.ts, nunca hardcoda texto
  lib/
    cn.ts                   # helper de concatenação de classes (sem dependência externa)
    contact.ts               # validação do formulário de contato + testes
    whatsapp.ts               # normalização de telefone e montagem da URL wa.me + testes
public/
  portfolio/                 # capas dos projetos do portfólio (hoje: SVGs placeholder)
  founders/                   # fotos dos fundadores (hoje: SVGs placeholder)
scripts/
  shot.sh                     # screenshots headless para auditoria responsiva (leia os
                              #   comentários do topo: este Chrome tem armadilhas)
docs/superpowers/              # spec de design e plano de implementação (histórico do SDD)
```

### Responsabilidade de cada camada

- **`content/site.ts`** é o único lugar onde texto, rótulo, número, URL ou copy de
  marketing deveria existir. Componentes leem daqui; nunca escrevem conteúdo.
- **`components/ui/`** não sabe nada sobre a Play Software especificamente — são primitivos de
  layout/estilo reutilizáveis (um `Card` não sabe o que vai dentro dele).
- **`components/layout/`** é o "esqueleto" que envolve as seções (navbar fixa, menu
  mobile, rodapé) — aparece uma vez por página.
- **`components/sections/`** é uma seção = um componente = um pedaço de `site.ts`. Ordem
  das seções na página é definida em `app/page.tsx`.
- **`lib/`** só tem funções puras e testáveis, sem JSX, sem estado de componente.

## Regra: nada de marca ou contato hardcoded

Nenhum componente em `src/components/` deve ter texto de marca, número de telefone,
e-mail, URL de rede social ou qualquer copy de conteúdo escrito diretamente no JSX. Se você
se pegar digitando um texto direto num componente, pare e mova o valor para
`src/content/site.ts` (crie um novo campo tipado se precisar). Isso vale mesmo para
placeholders — os valores atuais de `site.contact.whatsapp`, `site.contact.email`,
`site.projects[].url`, `site.footer.socials[].url` e `site.brand.url` **são** placeholders
documentados (ver `README.md`), e o padrão é que troca desses dados seja só editar
`site.ts`, nunca procurar por strings espalhadas em componentes.

Exemplo do padrão a seguir: `src/components/layout/Footer.tsx` filtra
`site.footer.socials` por `url !== "#"` antes de renderizar os ícones — assim, um social
sem URL real simplesmente não aparece, em vez de aparecer um link quebrado.

## Regra: mobile-first, com verificação em 360px

Toda seção nova ou alterada deve ser desenhada mobile-first (classes base = mobile,
`sm:`/`md:`/`lg:` para telas maiores) e verificada visualmente em **360px de largura**
(o menor breakpoint alvo do projeto) antes de ser considerada pronta — não só em 1440px
ou na largura da janela do editor.

Ao verificar responsividade:

- Meça `document.documentElement.scrollWidth <= window.innerWidth` — não confie só em
  olhar a screenshot, porque overflow horizontal nem sempre é visualmente óbvio.
- Todo alvo clicável (link, botão) deve ter pelo menos 44px de altura — o padrão do
  projeto é `min-h-11` (ou `min-h-12`/`min-h-14` onde já há mais padding natural).
- Um Chrome headless local tem viewport mínimo de 500px e não tira screenshot confiável
  acima de ~6000px de altura; se for gerar screenshots para auditoria, veja
  `scripts/shot.sh` e leia os comentários no topo do
  arquivo antes de usar — e desconfie de qualquer elemento que apareça "em branco" bem
  perto de um múltiplo de 5000px de altura: é a técnica de fatiar+costurar screenshots
  criando um artefato de captura, não um bug do site (visto e confirmado na Task 13; a
  forma de confirmar é inspecionar o elemento via CDP — opacidade, posição, texto — em
  vez de confiar só na imagem).

## Design system

Tema escuro único (sem modo claro). Os tokens vivem em `src/app/globals.css`, dentro de
`@theme` — é o único lugar onde essas cores/fontes devem ser definidas.

### Paleta

| Token | Hex/valor | Uso |
|---|---|---|
| `--color-bg` | `#0a0e10` | Fundo padrão das seções |
| `--color-bg-alt` | `#0d1214` | Fundo das seções alternadas (`<Section alt>`) e do rodapé |
| `--color-surface` | `#12171a` | Fundo de cards |
| `--color-surface-2` | `#171d21` | Fundo de inputs, hover de cards |
| `--color-border` | `#1f262a` | Borda padrão |
| `--color-border-soft` | `#2a3338` | Borda em hover/estado ativo |
| `--color-text` | `#e8edef` | Texto principal |
| `--color-muted` | `#8a9ba3` | Texto secundário/legendas |
| `--color-accent` | `#00e39b` | **Única cor de destaque do site.** Verde. |
| `--color-accent-dim` | `#0b7a5a` | Variante escurecida do accent (ex.: números `01`–`05` do processo) |
| `--color-accent-soft` | `rgb(0 227 155 / 0.1)` | Fundo sutil (ex.: `IconBox`) |

**Uma cor só.** Na dúvida sobre qual cor usar, use `--color-muted` ou `--color-border`.
Verde (`--color-accent`) é só para destaque de verdade — CTA principal, ícones,
palavra-chave de um heading, badges de status. Não vire decoração.

### Tipografia

- **Inter** (`--font-sans`, via `next/font/google`) — texto geral.
- **JetBrains Mono** (`--font-mono`, via `next/font/google`) — eyebrows em caixa alta
  (`SERVIÇOS · O QUE FAZEMOS`), números do processo (`01`–`05`), o `CodeCard` do hero,
  rótulos de formulário.

### Padrões visuais recorrentes

- **Eyebrow**: `font-mono text-xs uppercase tracking-[0.2em] text-accent` — precede quase
  todo heading de seção.
- **Heading**: extrabold, `tracking-tight`, tamanho fluido via `clamp()`, com uma palavra
  de destaque em `<em>` itálico na cor accent (ex.: "de Alta *Fidelidade.*").
- **Card**: `rounded-xl border border-border bg-surface`; variante `interactive` adiciona
  hover (`border-border-soft` + `bg-surface-2`).
- **IconBox**: ícone dentro de `rounded-lg bg-accent-soft text-accent`, tamanho `size-10`
  (ou `size-9` na variante `sm`).
- **Botão primário**: `bg-accent text-bg`, pill/`rounded-lg`. **Secundário**: borda, fundo
  transparente. Ambos `min-h-11`.
- **Seções**: `py-16 md:py-24 lg:py-28`, alternando fundo `bg-bg`/`bg-bg-alt` seção a
  seção (`<Section alt>`), largura de conteúdo via `.container-page` (max-width 1200px).
- **Reveal-on-scroll**: `.reveal` em `globals.css` é CSS puro (`animation-timeline:
  view()`), sem JavaScript e sem dependência de biblioteca — o conteúdo é visível por
  padrão e só anima onde o navegador suporta scroll-driven animations e o usuário não
  pediu `prefers-reduced-motion`. Não reintroduza uma versão em JS/IntersectionObserver
  disso; foi trocado de propósito (ver commit `947809c`) para nunca deixar o hero em
  branco caso JS falhe ou demore.
- **Estética "código"**: o `CodeCard` do hero simula uma janela de editor (três bolinhas
  de semáforo, fonte mono, sintaxe colorida simples) — é o único lugar do site com esse
  motivo, não repita em outras seções.

## Testes

Cada helper em `src/lib/` tem um `*.test.ts` colocado ao lado. `src/content/site.test.ts`
garante a integridade do conteúdo (nenhum campo placeholder acidentalmente vazio, listas
com o tamanho esperado etc.). Ao adicionar um campo novo em `site.ts` que tenha uma
invariante importante (formato, obrigatoriedade), considere cobri-lo lá.
