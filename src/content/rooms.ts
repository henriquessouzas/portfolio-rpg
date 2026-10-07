import type { Room } from '@/types/room';

export const rooms: Room[] = [
  {
    key: 'armory',
    name: 'Arsenal',
    colorToken: '--ember',
    objects: [
      {
        id: 'sword-ts',
        name: 'Espada',
        subtitle: 'TypeScript',
        description:
          'Minha arma principal. Tipagem estática que elimina bugs antes de chegarem à produção.',
        tags: ['TypeScript', 'JavaScript', 'React'],
        emoji: '⚔️',
      },
      {
        id: 'bow-react',
        name: 'Arco',
        subtitle: 'React',
        description:
          'Ataque à distância. Componentes reutilizáveis e estado previsível para interfaces complexas.',
        tags: ['React', 'Hooks', 'Context'],
        emoji: '🏹',
      },
      {
        id: 'shield-tests',
        name: 'Escudo',
        subtitle: 'Testes',
        description:
          'Defesa sólida. Vitest e Testing Library garantem que nada quebra silenciosamente.',
        tags: ['Vitest', 'Testing Library', 'TDD'],
        emoji: '🛡️',
      },
      {
        id: 'anvil-node',
        name: 'Bigorna',
        subtitle: 'Node.js',
        description: 'Onde as ferramentas são forjadas. APIs, scripts e automações no back-end.',
        tags: ['Node.js', 'Express', 'REST'],
        emoji: '⚒️',
      },
    ],
  },
  {
    key: 'lab',
    name: 'Laboratório',
    colorToken: '--mana',
    objects: [
      {
        id: 'potion-portfolio',
        name: 'Poção Roxa',
        subtitle: 'Este portfólio',
        description:
          'Em andamento. Portfólio interativo em formato de RPG feito com Vite, React e TypeScript.',
        tags: ['React', 'TypeScript', 'Vite', 'CSS Modules'],
        emoji: '🧪',
      },
      {
        id: 'potion-api',
        name: 'Poção Azul',
        subtitle: 'API REST',
        description:
          'Em andamento. API de gerenciamento de tarefas com autenticação JWT e banco de dados.',
        tags: ['Node.js', 'Express', 'PostgreSQL', 'JWT'],
        emoji: '🔵',
      },
      {
        id: 'potion-mobile',
        name: 'Poção Verde',
        subtitle: 'App Mobile',
        description: 'Em andamento. Aplicativo de hábitos diários com notificações e gráficos.',
        tags: ['React Native', 'Expo', 'TypeScript'],
        emoji: '🟢',
      },
    ],
  },
  {
    key: 'library',
    name: 'Biblioteca',
    colorToken: '--forest',
    objects: [
      {
        id: 'book-courses',
        name: 'Estante de Cursos',
        subtitle: 'Cursos',
        description:
          'Formação contínua. Cursos de desenvolvimento web, algoritmos e boas práticas.',
        tags: ['Rocketseat', 'Alura', 'Udemy'],
        emoji: '📚',
      },
      {
        id: 'book-certs',
        name: 'Estante de Certificados',
        subtitle: 'Certificados',
        description: 'Conquistas formais. Certificações que comprovam domínio das ferramentas.',
        tags: ['AWS', 'Google', 'Microsoft'],
        emoji: '📜',
      },
      {
        id: 'book-projects',
        name: 'Estante de Projetos',
        subtitle: 'Projetos concluídos',
        description: 'Trabalhos entregues. Projetos finalizados com código aberto no GitHub.',
        tags: ['GitHub', 'Open Source'],
        emoji: '📖',
      },
    ],
  },
  {
    key: 'quarters',
    name: 'Aposentos',
    colorToken: '--royal',
    objects: [
      {
        id: 'bed',
        name: 'Cama',
        subtitle: 'Descanso',
        description: 'Fora do código gosto de jogos, séries de ficção científica e café forte.',
        tags: ['Jogos', 'Séries', 'Café'],
        emoji: '🛏️',
      },
      {
        id: 'desk',
        name: 'Mesa',
        subtitle: 'Setup',
        description: 'Monitor ultrawide, teclado mecânico e fones com cancelamento de ruído.',
        tags: ['Hardware', 'Ergonomia'],
        emoji: '🖥️',
      },
      {
        id: 'poster',
        name: 'Pôster',
        subtitle: 'Inspirações',
        description: 'Clean Code, The Pragmatic Programmer e Designing Data-Intensive Applications.',
        tags: ['Livros', 'Leitura'],
        emoji: '🖼️',
      },
      {
        id: 'chest',
        name: 'Baú',
        subtitle: 'Curiosidades',
        description: 'Comecei a programar aos 16 anos. Meu primeiro projeto foi um bot de Discord.',
        tags: ['História', 'Origem'],
        emoji: '📦',
      },
    ],
  },
  {
    key: 'throne',
    name: 'Sala do Trono',
    colorToken: '--gold',
    objects: [
      {
        id: 'scroll',
        name: 'Pergaminho',
        subtitle: 'Minha história',
        description:
          'Desenvolvedor apaixonado por interfaces bem feitas e código que outras pessoas conseguem ler.',
        tags: ['Sobre mim'],
        emoji: '📜',
      },
      {
        id: 'trophies',
        name: 'Troféus',
        subtitle: 'Destaques',
        description: 'Projetos e conquistas que mais me orgulho ao longo da carreira.',
        tags: ['Carreira', 'Conquistas'],
        emoji: '🏆',
      },
      {
        id: 'messenger',
        name: 'Mensageiro',
        subtitle: 'Contato',
        description: 'Aberto a oportunidades. Me encontre no LinkedIn ou mande um e-mail.',
        tags: ['LinkedIn', 'E-mail', 'GitHub'],
        emoji: '✉️',
      },
    ],
  },
];
