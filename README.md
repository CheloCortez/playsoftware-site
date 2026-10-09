# Play Software — Site Institucional

Landing page institucional da Play Software, uma software house. É o "cartão de visitas"
digital da empresa: serviços, portfólio, processo de trabalho, fundadores e um formulário
de contato que abre o WhatsApp com a mensagem já preenchida.

Site 100% estático, página única (`/`), construído com **Next.js 16** (App Router) e
**Tailwind CSS v4**. Sem backend, sem banco de dados — todo o conteúdo textual vive num
único arquivo TypeScript tipado.

Para detalhes de arquitetura, design system e convenções de código, veja
[`CLAUDE.md`](./CLAUDE.md). Para o spec de design original (aprovado pelo cliente), veja
[`docs/superpowers/specs/2026-08-14-playsoftware-site-design.md`](./docs/superpowers/specs/2026-08-14-playsoftware-site-design.md).

## Comandos

Node 22 (ou mais recente) é necessário — o script `dev`/`build`/etc. usa recursos do
Next 16 que exigem uma versão recente. Se o Node padrão da máquina for mais antigo, use o
[nvm](https://github.com/nvm-sh/nvm) para instalar/ativar a versão certa antes de rodar
qualquer comando abaixo:

```bash
nvm install 22
nvm use 22
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento (`next dev`), com hot reload. |
| `npm run build` | Gera o build de produção estático (`next build`). A rota `/` é pré-renderizada. |
| `npm start` | Serve o build de produção já gerado (rode `build` antes). |
| `npm test` | Roda a suíte de testes (Vitest) uma vez. |
| `npm run test:watch` | Roda os testes em modo watch. |
| `npm run lint` | Roda o ESLint. Deve terminar sem nenhum aviso. |

Antes de considerar qualquer mudança pronta, os três comandos abaixo devem passar limpos:

```bash
npm test && npm run build && npm run lint
```

## Como atualizar o conteúdo

**Todo o conteúdo textual do site vive em [`src/content/site.ts`](./src/content/site.ts).**
Títulos, parágrafos, itens de serviço, diferenciais, projetos do portfólio, passos do
processo, fundadores, textos do formulário de contato, links do rodapé, SEO — tudo isso é
um único objeto `site` tipado. Nenhum componente em `src/components/` deveria ter texto de
marca ou de conteúdo escrito diretamente no JSX; se algo assim aparecer, é para ser movido
para `site.ts`.

Para trocar um texto, uma cor de destaque, um valor de estatística etc., edite o campo
correspondente em `site.ts` — os componentes só consomem esses valores, não precisam ser
tocados.

### Imagens

- **Portfólio:** `public/portfolio/` — hoje contém SVGs placeholder (`tsteck.svg`,
  `aulamarcada.svg`, `mercado-livre.svg`, `vortex.svg`). Para trocar por capas reais, ou
  mantenha os mesmos nomes de arquivo, ou troque o nome e atualize o campo `image` do
  projeto correspondente em `site.projects` (dentro de `site.ts`). Se a capa real for
  `.png`/`.jpg` em vez de `.svg`, ajuste a extensão em `image`.
- **Fundadores:** `public/founders/` — mesma lógica, com os campos `photo` em
  `site.founders`.

### Pendências conhecidas (placeholders a substituir com o cliente)

O site funciona normalmente com os placeholders atuais — nada abaixo bloqueia o
funcionamento ou o deploy. Quando os dados reais estiverem disponíveis, atualize:

| Campo | Onde | Placeholder atual |
|---|---|---|
| WhatsApp (só dígitos, com DDI) | `site.contact.whatsapp` | `5511999999999` |
| E-mail | `site.contact.email` | `contato@playsoftware.dev` |
| URL de cada projeto do portfólio | `site.projects[].url` | `#` (4 projetos) |
| URLs de GitHub / LinkedIn / Instagram | `site.footer.socials[].url` | `#` (os 3 — o rodapé já esconde automaticamente qualquer social cuja URL seja `#`) |

O link de WhatsApp é normalizado (só dígitos) tanto no envio do formulário quanto no link
direto "WhatsApp direto" — ver `src/lib/whatsapp.ts` — então qualquer formatação (`+55 (11)
98888-7777`, com espaços, traços etc.) funciona no campo `whatsapp`.

## Deploy (Vercel)

O site está no projeto Vercel `playsoftware-site` (time `cheloideas`), conectado ao
repositório GitHub `CheloCortez/playsoftware-site`:

- todo push na `main` gera um deploy de **produção** automaticamente;
- pushes em outras branches geram deploys de **preview**.

Domínios do projeto: `playsoftware.dev` (principal) e `www.playsoftware.dev`
(redireciona 308 para o principal). O DNS do domínio fica na name.com.

Deploy manual pela CLI, se necessário: `npx vercel --prod`.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** (tokens de design em `src/app/globals.css`, via `@theme`)
- **TypeScript** (strict)
- **Vitest** para testes unitários
- **ESLint** (`eslint-config-next`)
