import PF from 'pathfinding';

export type Point = { x: number; y: number };
export type RoomId = 'B' | 'T' | 'A' | 'R' | 'L';
export type BookColor = 'ember' | 'forest' | 'mana' | 'gold' | 'royal';
export type Book = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  color: BookColor;
};
export type Artifact = {
  name: string;
  title: string;
  description: string;
  tags: string[];
  art: string;
  books?: Book[];
};
export type Room = {
  id: RoomId;
  name: string;
  category: string;
  subtitle: string;
  destination: Point;
  objects: [Artifact, ...Artifact[]];
};

export type Profile = {
  name: string;
  role: string;
  bio: string;
  location: string;
  stack: string[];
  email: string;
  github: string;
  linkedin: string;
  cvUrl: string;
  githubFeatured: string[];
  githubExclude: string[];
  githubOverrides: Record<string, { title?: string; description?: string }>;
};

export const profile: Profile = {
  name: 'Henrique Santos de Souza',
  role: 'Seu cargo',
  bio: '',
  location: '',
  stack: [],
  email: '',
  github: '',
  linkedin: '',
  cvUrl: '',
  githubFeatured: [],
  githubExclude: [],
  githubOverrides: {},
};

export const castleMap = [
  '#############',
  '#BBB#TTT#AAA#',
  '#BBB#TTT#AAA#',
  '#BBB#TTT#AAA#',
  '##D###D###D##',
  '#...........#',
  '##D###D###D##',
  '#RRR#PPP#LLL#',
  '#RRR#PPP#LLL#',
  '#RRR#PPP#LLL#',
  '######E######',
];
export const entrance: Point = { x: 6, y: 10 };
// The courtyard fountain occupies a tile, unlike the walkable courtyard floor.
export const castleObstacles: Point[] = [{ x: 6, y: 8 }];
export const castleNavigationGrid = castleMap.map((row, y) =>
  [...row]
    .map((cell, x) => (castleObstacles.some((p) => p.x === x && p.y === y) ? '#' : cell))
    .join(''),
);
export function findPath(start: Point, end: Point, map = castleNavigationGrid): Point[] {
  const valid = (p: Point) => Boolean(map[p.y]?.[p.x] && map[p.y]?.[p.x] !== '#');
  if (!valid(start) || !valid(end)) return [];
  const grid = new PF.Grid(map.map((row) => [...row].map((cell) => (cell === '#' ? 1 : 0))));
  return new PF.AStarFinder({ allowDiagonal: false })
    .findPath(start.x, start.y, end.x, end.y, grid)
    .flatMap(([x, y]) => (typeof x === 'number' && typeof y === 'number' ? [{ x, y }] : []));
}
export const rooms: [Room, Room, Room, Room, Room] = [
  {
    id: 'B',
    name: 'Biblioteca',
    category: 'Conhecimento',
    subtitle: 'Cada livro, uma nova descoberta.',
    destination: { x: 2, y: 2 },
    objects: [
      {
        name: 'Cursos',
        title: 'O conhecimento é uma aventura',
        description:
          'Uma coleção de estudos em desenvolvimento web, interfaces e arquitetura de software. Cada capítulo abre caminho para novas possibilidades.',
        tags: ['Estudos', 'Desenvolvimento web'],
        art: 'book',
        books: [
          {
            title: 'Fundamentos da Web',
            subtitle: 'Curso',
            description:
              'Livro reservado para um curso real: HTML, CSS e JavaScript. Informe a plataforma, a carga horária e o que você construiu.',
            tags: ['HTML', 'CSS', 'JavaScript'],
            color: 'ember',
          },
          {
            title: 'TypeScript na prática',
            subtitle: 'Curso',
            description:
              'Espaço para o curso de TypeScript: tipos, generics e como isso mudou o seu jeito de programar.',
            tags: ['TypeScript'],
            color: 'mana',
          },
          {
            title: 'React moderno',
            subtitle: 'Curso',
            description: 'Componentes, hooks e estado. Conte o projeto final deste estudo.',
            tags: ['React', 'Hooks'],
            color: 'forest',
          },
          {
            title: 'Node e APIs',
            subtitle: 'Curso',
            description: 'Servidores, rotas e integrações. Substitua pelo curso real.',
            tags: ['Node.js', 'REST'],
            color: 'royal',
          },
          {
            title: 'Git e colaboração',
            subtitle: 'Curso',
            description: 'Branches, pull requests e trabalho em equipe.',
            tags: ['Git', 'GitHub'],
            color: 'gold',
          },
          {
            title: 'Acessibilidade na web',
            subtitle: 'Curso',
            description: 'Como construir interfaces para todas as pessoas.',
            tags: ['A11y', 'Semântica'],
            color: 'ember',
          },
        ],
      },
      {
        name: 'Certificados',
        title: 'Conquistas da jornada',
        description:
          'Este espaço reúne certificações, formações e marcos de aprendizado. As conquistas reais serão adicionadas aqui.',
        tags: ['Formação', 'Conquistas'],
        art: 'scroll',
        books: [
          {
            title: 'Certificado 1',
            subtitle: 'Certificado',
            description:
              'Reserve este livro para uma certificação real: nome, instituição, ano e link de validação.',
            tags: ['Formação'],
            color: 'forest',
          },
          {
            title: 'Certificado 2',
            subtitle: 'Certificado',
            description: 'Outra conquista reconhecida. Inclua o link para validar.',
            tags: ['Formação'],
            color: 'royal',
          },
          {
            title: 'Certificado 3',
            subtitle: 'Certificado',
            description: 'Mais um marco da jornada de aprendizado.',
            tags: ['Conquistas'],
            color: 'gold',
          },
          {
            title: 'Certificado 4',
            subtitle: 'Certificado',
            description: 'Espaço livre para a próxima certificação.',
            tags: ['Conquistas'],
            color: 'ember',
          },
        ],
      },
      {
        name: 'Projetos',
        title: 'Histórias que viraram código',
        description:
          'Uma estante para projetos concluídos: o desafio inicial, as escolhas de tecnologia e o que cada construção ensinou.',
        tags: ['Projetos', 'Portfólio'],
        art: 'books',
        books: [
          {
            title: 'Este castelo',
            subtitle: 'Projeto',
            description:
              'O portfólio que você está explorando: salas, herói animado e interações acessíveis, feito com React e TypeScript.',
            tags: ['React', 'TypeScript', 'Acessibilidade'],
            color: 'mana',
          },
          {
            title: 'Projeto 2',
            subtitle: 'Projeto',
            description:
              'Conte o desafio inicial, as escolhas de tecnologia e o que este projeto ensinou. Inclua o link do repositório.',
            tags: ['Em breve'],
            color: 'forest',
          },
          {
            title: 'Projeto 3',
            subtitle: 'Projeto',
            description: 'Outra história que virou código. Substitua pelo projeto real.',
            tags: ['Em breve'],
            color: 'royal',
          },
          {
            title: 'Projeto 4',
            subtitle: 'Projeto',
            description: 'Um espaço para o próximo livro da estante.',
            tags: ['Em breve'],
            color: 'gold',
          },
        ],
      },
    ],
  },
  {
    id: 'T',
    name: 'Sala do trono',
    category: 'Minha história',
    subtitle: 'Toda aventura começa com uma história.',
    destination: { x: 6, y: 2 },
    objects: [
      {
        name: 'Trono',
        title: 'Henrique Santos de Souza',
        description:
          'Bem-vindo ao meu castelo. Aqui, habilidades são armas, projetos são experimentos e conhecimento ocupa as estantes. Uma forma diferente de contar uma jornada em tecnologia.',
        tags: ['Criatividade', 'Tecnologia'],
        art: 'throne',
      },
      {
        name: 'Pergaminho',
        title: 'O próximo capítulo',
        description:
          'Construir experiências que aproximam pessoas e tecnologia. Este pergaminho guarda espaço para a trajetória, os objetivos e os próximos desafios.',
        tags: ['História', 'Objetivos'],
        art: 'scroll',
      },
      {
        name: 'Troféus',
        title: 'Pequenas e grandes vitórias',
        description:
          'Um lugar reservado para entregas marcantes, desafios superados e conquistas ao longo da jornada.',
        tags: ['Destaques'],
        art: 'trophy',
      },
      {
        name: 'Mensageiro',
        title: 'Vamos escrever uma nova história?',
        description:
          'O mensageiro aguarda seus contatos. E-mail, GitHub e LinkedIn serão exibidos aqui quando os endereços reais forem informados.',
        tags: ['Contato'],
        art: 'letter',
      },
    ],
  },
  {
    id: 'A',
    name: 'Aposentos',
    category: 'Além do código',
    subtitle: 'O lado humano por trás do herói.',
    destination: { x: 10, y: 2 },
    objects: [
      {
        name: 'Cama',
        title: 'Além das telas',
        description:
          'Nem toda aventura acontece no código. Um espaço para compartilhar a rotina, os interesses e o que inspira novas ideias.',
        tags: ['Pessoal'],
        art: 'bed',
      },
      {
        name: 'Mesa',
        title: 'Meu lugar de criação',
        description:
          'Uma bancada para transformar ideias em experiências. Aqui entram as ferramentas favoritas, o editor e os detalhes do setup.',
        tags: ['Setup', 'Ferramentas'],
        art: 'desk',
      },
      {
        name: 'Pôster',
        title: 'Outros universos',
        description:
          'Jogos, música, filmes e histórias que alimentam a criatividade. Este espaço será preenchido com os interesses reais de Henrique.',
        tags: ['Inspiração', 'Hobbies'],
        art: 'poster',
      },
      {
        name: 'Baú',
        title: 'Há sempre algo para descobrir',
        description:
          'Um pequeno baú de curiosidades, ideias inesperadas e detalhes que não cabem em um currículo.',
        tags: ['Curiosidades'],
        art: 'chest',
      },
    ],
  },
  {
    id: 'R',
    name: 'Arsenal',
    category: 'Habilidades',
    subtitle: 'As ferramentas para enfrentar qualquer missão.',
    destination: { x: 2, y: 8 },
    objects: [
      {
        name: 'Espada',
        title: 'TypeScript & JavaScript',
        description:
          'A lâmina principal deste arsenal. Tipagem, componentes e lógica se encontram para criar interfaces claras e aplicações bem estruturadas.',
        tags: ['TypeScript', 'JavaScript', 'React'],
        art: 'sword',
      },
      {
        name: 'Arco',
        title: 'Python & APIs',
        description:
          'Conectar sistemas e alcançar novos territórios. Scripts, automações e integrações são as flechas desta coleção de habilidades.',
        tags: ['Python', 'REST', 'APIs'],
        art: 'bow',
      },
      {
        name: 'Escudo',
        title: 'Testes & qualidade',
        description:
          'Uma boa aventura precisa de proteção. Testes de lógica e de interação ajudam a manter cada caminho seguro, do primeiro clique ao resultado final.',
        tags: ['Vitest', 'Playwright', 'Acessibilidade'],
        art: 'shield',
      },
      {
        name: 'Bigorna',
        title: 'Git & Docker',
        description:
          'Onde o código é forjado. Versionamento e ambientes consistentes ajudam a construir, revisar e entregar com confiança.',
        tags: ['Git', 'Docker'],
        art: 'anvil',
      },
    ],
  },
  {
    id: 'L',
    name: 'Laboratório',
    category: 'Experimentos',
    subtitle: 'Ideias em transformação. Cuidado com as poções.',
    destination: { x: 10, y: 8 },
    objects: [
      {
        name: 'Poção azul',
        title: 'Este castelo',
        description:
          'Um portfólio que também é uma pequena aventura. Exploração por salas, personagens animados e interações acessíveis em uma experiência feita para a web.',
        tags: ['Em construção', 'React', 'TypeScript'],
        art: 'potion',
      },
      {
        name: 'Poção verde',
        title: 'Um novo experimento',
        description:
          'Espaço para um projeto em andamento: o problema a resolver, as descobertas e o próximo passo da construção.',
        tags: ['Protótipo', 'Experimento'],
        art: 'flask',
      },
      {
        name: 'Caldeirão',
        title: 'Ideias para o futuro',
        description:
          'Toda criação começa com uma mistura de curiosidade e tentativa. Aqui ficam as ideias que ainda estão ganhando forma.',
        tags: ['Ideia', 'Pesquisa'],
        art: 'cauldron',
      },
    ],
  },
];
