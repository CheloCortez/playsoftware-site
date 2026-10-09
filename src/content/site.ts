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
    /** Parte do nome pintada de verde no logo (as duas partes são separadas por um espaço). */
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
    /** Identificador usado dentro do snippet de código do CodeCard. */
    codeIdentifier: "playSoftware",
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
