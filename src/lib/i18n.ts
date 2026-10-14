export type Lang = 'pt' | 'en';

export const dict = {
  pt: {
    // header
    brandSub: 'PORTFÓLIO • RPG',
    skipGame: 'Pular o jogo',
    backToGame: 'Voltar ao jogo',
    openToAdventures: 'Aberto a novas aventuras',

    // castle screen
    eyebrowCastle: 'UM PORTFÓLIO, UMA AVENTURA',
    heroSubtitle: 'Código, criatividade e um mundo para descobrir.',
    worldLabel: 'REINO DE HENRIQUE',
    enterCastle: 'Entrar no castelo',
    openingGates: 'Abrindo os portões...',
    castleCoordinate: 'EST. 2026 ✦ UMA NOVA JORNADA',
    fiveRooms: 'Cinco salas. Muitas histórias.',
    devExplorer: 'DESENVOLVEDOR & EXPLORADOR',

    // map / adventure screen
    eyebrowJourney: 'A JORNADA CONTINUA',
    insideCastle: 'Dentro do castelo',
    castleDesc: 'Um reino de ideias, conquistas e possibilidades.',
    backToMap: 'Voltar ao mapa',
    leaveCastle: 'Sair do castelo',
    castle: 'CASTELO',
    map: 'MAPA',
    explorer: 'EXPLORADOR',
    exploring: 'Explorando...',
    readyNext: 'Pronto para a próxima aventura',
    yourMap: 'SEU MAPA',
    explorationDiary: 'Diário de\nexploração',
    roomsDiscovered: 'Salas descobertas',
    allPathsFound: 'Todos os caminhos foram descobertos.',
    eachRoomHolds: 'Cada sala guarda uma parte da jornada.',
    noPathToRoom: 'Não há caminho até essa sala.',
    noPathToObject: 'Não há caminho até esse objeto.',
    headingTo: (name: string) => `A caminho: ${name}`,
    techSelected: (name: string) => `Tecnologia selecionada: ${name}`,

    // simple screen
    eyebrowSimple: 'A MESMA HISTÓRIA, OUTRO CAMINHO',
    portfolioSections: 'Seções do portfólio',

    // footer
    madeOf: 'FEITO DE CÓDIGO & CURIOSIDADE',
    copyright: '© 2026',

    // hud
    roomsVisited: (n: number) => `Salas visitadas: ${n}/5`,

    // achievement
    achievementTitle: 'Explorador do castelo',
    achievementText: 'Você visitou as cinco salas. Obrigado pela visita!',
    closeAchievement: 'Fechar conquista',

    // typewriter
    clickToSkip: 'clique para pular',

    // shelf
    loadingProjects: 'Buscando seus projetos no GitHub…',
    errorProjects: 'Não consegui carregar os projetos agora.',
    emptyProjects: 'Nenhum projeto para mostrar por enquanto.',
    chooseBook: 'Escolha um livro',
    projectsOnShelf: (n: number) => `${n} projetos nesta estante`,
    clickSpine: 'Clique em uma lombada para abrir o projeto e ler os detalhes.',
    updatedAt: (date: string) => `Atualizado em ${date}`,
    openCertificate: 'Abrir certificado',
    openDocument: 'Abrir documento',
    viewOnGitHub: 'Ver no GitHub',
    loadingReadme: 'Carregando README…',
    readmeUnavailable: 'README indisponível',
    openReadme: 'Abrir README',
    closeShelf: 'Fechar estante',
    projects: 'Projetos',
    autoUpdatedGitHub: 'Atualizado automaticamente do GitHub',
    profile: 'perfil',

    // popup
    shelfPrefix: 'Estante:',
    openCvPt: 'Abrir currículo em português',
    openCvEn: 'Abrir currículo em inglês',
    level: 'Nível',
    category: 'Categoria',
    years: 'Anos',
    yearsUnit: (n: number) => `${n} anos`,
    repositories: 'Repositórios',
    noRepos: 'Nenhum repositório com a linguagem principal correspondente.',

    // messenger
    messengerIntro: 'Quer conversar? Escolha um canal.',
    sendEmail: 'Enviar e-mail',
    yourName: 'Seu nome',
    yourEmail: 'Seu e-mail',
    message: 'Mensagem',
    writeMessage: 'Escreva sua mensagem...',
    sendMessage: 'Enviar mensagem',
    openGitHub: 'Abrir o GitHub em uma nova aba',
    openLinkedIn: 'Abrir o LinkedIn em uma nova aba',

    // tech-search
    searchTech: 'Buscar tecnologia',
    searchPlaceholder: 'Ex.: React, Docker',
    filterByCategory: 'Filtrar por categoria',
    techCount: (n: number) => `${n} tecnologias`,
    noTechFound: 'Nenhuma tecnologia encontrada.',
    clearFilters: 'Limpar filtros',
    domainPct: (name: string, v: number) => `${name}: ${v}% de domínio`,

    // lang toggle
    langLabel: 'Idioma',
    langToggle: 'EN',
  },

  en: {
    // header
    brandSub: 'PORTFOLIO • RPG',
    skipGame: 'Skip the game',
    backToGame: 'Back to game',
    openToAdventures: 'Open to new adventures',

    // castle screen
    eyebrowCastle: 'A PORTFOLIO, AN ADVENTURE',
    heroSubtitle: 'Code, creativity and a world to discover.',
    worldLabel: "HENRIQUE'S REALM",
    enterCastle: 'Enter the castle',
    openingGates: 'Opening the gates...',
    castleCoordinate: 'EST. 2026 ✦ A NEW JOURNEY',
    fiveRooms: 'Five rooms. Many stories.',
    devExplorer: 'DEVELOPER & EXPLORER',

    // map / adventure screen
    eyebrowJourney: 'THE JOURNEY CONTINUES',
    insideCastle: 'Inside the castle',
    castleDesc: 'A realm of ideas, achievements and possibilities.',
    backToMap: 'Back to map',
    leaveCastle: 'Leave the castle',
    castle: 'CASTLE',
    map: 'MAP',
    explorer: 'EXPLORER',
    exploring: 'Exploring...',
    readyNext: 'Ready for the next adventure',
    yourMap: 'YOUR MAP',
    explorationDiary: 'Exploration\njournal',
    roomsDiscovered: 'Rooms discovered',
    allPathsFound: 'All paths have been discovered.',
    eachRoomHolds: 'Each room holds a part of the journey.',
    noPathToRoom: 'No path to that room.',
    noPathToObject: 'No path to that object.',
    headingTo: (name: string) => `Heading to: ${name}`,
    techSelected: (name: string) => `Technology selected: ${name}`,

    // simple screen
    eyebrowSimple: 'THE SAME STORY, ANOTHER PATH',
    portfolioSections: 'Portfolio sections',

    // footer
    madeOf: 'MADE OF CODE & CURIOSITY',
    copyright: '© 2026',

    // hud
    roomsVisited: (n: number) => `Rooms visited: ${n}/5`,

    // achievement
    achievementTitle: 'Castle Explorer',
    achievementText: 'You visited all five rooms. Thanks for stopping by!',
    closeAchievement: 'Close achievement',

    // typewriter
    clickToSkip: 'click to skip',

    // shelf
    loadingProjects: 'Fetching your GitHub projects…',
    errorProjects: "Couldn't load projects right now.",
    emptyProjects: 'No projects to show yet.',
    chooseBook: 'Choose a book',
    projectsOnShelf: (n: number) => `${n} projects on this shelf`,
    clickSpine: 'Click a spine to open the project and read the details.',
    updatedAt: (date: string) => `Updated on ${date}`,
    openCertificate: 'Open certificate',
    openDocument: 'Open document',
    viewOnGitHub: 'View on GitHub',
    loadingReadme: 'Loading README…',
    readmeUnavailable: 'README unavailable',
    openReadme: 'Open README',
    closeShelf: 'Close shelf',
    projects: 'Projects',
    autoUpdatedGitHub: 'Auto-updated from GitHub',
    profile: 'profile',

    // popup
    shelfPrefix: 'Shelf:',
    openCvPt: 'Open résumé in Portuguese',
    openCvEn: 'Open résumé in English',
    level: 'Level',
    category: 'Category',
    years: 'Years',
    yearsUnit: (n: number) => `${n} yr${n !== 1 ? 's' : ''}`,
    repositories: 'Repositories',
    noRepos: 'No repository with a matching primary language.',

    // messenger
    messengerIntro: 'Want to chat? Choose a channel.',
    sendEmail: 'Send email',
    yourName: 'Your name',
    yourEmail: 'Your email',
    message: 'Message',
    writeMessage: 'Write your message...',
    sendMessage: 'Send message',
    openGitHub: 'Open GitHub in a new tab',
    openLinkedIn: 'Open LinkedIn in a new tab',

    // tech-search
    searchTech: 'Search technology',
    searchPlaceholder: 'e.g. React, Docker',
    filterByCategory: 'Filter by category',
    techCount: (n: number) => `${n} technologies`,
    noTechFound: 'No technology found.',
    clearFilters: 'Clear filters',
    domainPct: (name: string, v: number) => `${name}: ${v}% proficiency`,

    // lang toggle
    langLabel: 'Language',
    langToggle: 'PT',
  },
} as const satisfies Record<Lang, Record<string, unknown>>;

export type Dict = (typeof dict)['pt'];
