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
  url?: string;
  pdf?: string;
  stars?: number;
  updatedAt?: string;
  readme?: string;
};
export const technologyCategories = ['Linguagens', 'Front-end', 'Back-end', 'Dados', 'Ferramentas'] as const;
export type TechnologyCategory = (typeof technologyCategories)[number];

export type Artifact = {
  name: string;
  title: string;
  description: string;
  tags: string[];
  art: string;
  categories?: TechnologyCategory[];
  paragraphs?: string[];
  items?: string[];
  links?: { label: string; url: string; download?: boolean }[];
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

export type Technology = {
  name: string;
  category: 'Linguagens' | 'Front-end' | 'Back-end' | 'Dados' | 'Ferramentas';
  years?: number;
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
  cv: { pt: string; en: string };
  githubFeatured: string[];
  githubExclude: string[];
  githubOverrides: Record<string, { title?: string; description?: string }>;
  technologies: Technology[];
};

const cvFiles = import.meta.glob('/curriculo/*.docx', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const certificateFiles = import.meta.glob('/certificados/*.pdf', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const certificateTitleOverrides: Record<string, string> = {
  'ai fundamentals with ibm skillsbuild': 'AI Fundamentals with IBM SkillsBuild',
  'computer hardware basics': 'Computer Hardware Basics',
  'digital awareness': 'Digital Awareness',
  'introduction to cybersecurity': 'Introduction to Cybersecurity',
  'introduction to data science': 'Introduction to Data Science',
  'introduction to iot': 'Introduction to IoT',
  'introduction to modern ai': 'Introduction to Modern AI',
  'python essentials 1': 'Python Essentials 1',
};

const humanizeCertificateTitle = (fileName: string): string => {
  const normalized = fileName
    .replace(/\.pdf$/i, '')
    .replace(/^_+/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const cleaned = normalized
    .replace(/\b(?:certificate|certificado)\b/gi, ' ')
    .replace(/\b(?:aluno|cotemig|com|br)\b/gi, ' ')
    .replace(/\b\d{6,}\b/g, ' ')
    .replace(/\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const mapped = certificateTitleOverrides[cleaned.toLowerCase()];
  if (mapped) return mapped;
  return cleaned || normalized;
};

export const profile: Profile = {
  name: 'Henrique Santos de Souza',
  role: 'Software Developer | Software Engineering Student | Software • Data • AI',
  bio: 'Sou estudante de Engenharia de Software na PUC Minas e Técnico em Informática formado pelo Cotemig, com experiência prática em suporte de TI, infraestrutura e automação de processos. Tenho interesse em desenvolvimento de software, engenharia de dados e inteligência artificial, buscando construir soluções que combinem tecnologia, eficiência e boas práticas de desenvolvimento.',
  location: 'Belo Horizonte, Minas Gerais, Brasil',
  stack: ['Java', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'Node.js', 'HTML', 'CSS', 'Git', 'GitHub', 'RPA'],
  email: 'henriquetrabalhodossantos@gmail.com',
  github: 'henriquessouzas',
  linkedin: 'https://www.linkedin.com/in/henriquesdesouzas/',
  cv: {
    pt: cvFiles['/curriculo/Curriculo_Henrique_Santos_de_Souza.docx'] ?? '/curriculo/Curriculo_Henrique_Santos_de_Souza.docx',
    en: cvFiles['/curriculo/Henrique_Santos_de_Souza_Resume_EN.docx'] ?? '/curriculo/Henrique_Santos_de_Souza_Resume_EN.docx',
  },
  githubFeatured: ['portfolio-rpg', 'stanley-spider', 'Books_spider', 'Api-Clima'],
  githubExclude: ['henriquessouzas'],
  githubOverrides: {},
  technologies: [
    { name: 'Java', category: 'Linguagens', years: 1 },
    { name: 'TypeScript', category: 'Linguagens', years: 1 },
    { name: 'JavaScript', category: 'Linguagens', years: 3 },
    { name: 'Python', category: 'Linguagens', years: 3 },
    { name: 'C#', category: 'Linguagens', years: 3 },
    { name: 'HTML', category: 'Front-end', years: 3 },
    { name: 'CSS', category: 'Front-end', years: 3 },
    { name: 'React', category: 'Front-end', years: 3 },
    { name: 'Node.js', category: 'Back-end', years: 3 },
    { name: 'Spring Boot', category: 'Back-end', years: 1 },
    { name: 'SQL', category: 'Dados', years: 3 },
    { name: 'SQL Server', category: 'Dados', years: 3 },
    { name: 'Git', category: 'Ferramentas', years: 3 },
    { name: 'GitHub', category: 'Ferramentas', years: 3 },
    { name: 'RPA', category: 'Ferramentas', years: 3 },
    { name: 'Godot', category: 'Ferramentas', years: 1 },
  ],
};

const certificateEntries = Object.entries(certificateFiles)
  .map(([key, url]) => {
    const title = humanizeCertificateTitle(key.split('/').at(-1) ?? key);
    return title ? { title, url } : null;
  })
  .filter((entry): entry is { title: string; url: string } => entry !== null)
  .filter(
    (entry, index, all) =>
      all.findIndex((other) => other.title.toLowerCase() === entry.title.toLowerCase()) === index,
  )
  .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));

export const certificateBooks: Book[] = certificateEntries.map((book, index) => ({
  title: book.title,
  subtitle: 'Certificado',
  description: 'Certificado disponível para visualização.',
  tags: ['Certificado'],
  color: ['forest', 'royal', 'gold', 'ember', 'mana'][index % 5] as Book['color'],
  url: book.url,
  pdf: book.url,
}));

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
        title: 'Formação e estudo',
        description: 'Minha trajetória acadêmica e técnica em tecnologia e desenvolvimento de software.',
        tags: ['Tecnologia', 'Formação'],
        art: 'book',
        books: [
          {
            title: 'Técnico em Informática',
            subtitle: 'Cotemig · 2025',
            description: 'Fundamentos de programação, desenvolvimento de sistemas, manipulação de dados, planilhas e bancos de dados.',
            tags: ['Programação', 'Bancos de dados'],
            color: 'ember',
          },
          {
            title: 'Engenharia de Software',
            subtitle: 'PUC Minas · 2026–2030 (previsão)',
            description: 'Formação em desenvolvimento de software, engenharia de sistemas e fundamentos de computação, em andamento.',
            tags: ['Engenharia de Software', 'Computação'],
            color: 'forest',
          },
        ],
      },
      {
        name: 'Certificados',
        title: 'Certificações',
        description: 'Formações e marcos de aprendizado em tecnologia, IA, dados e infraestrutura.',
        tags: ['Certificados', 'Formação'],
        art: 'scroll',
        books: certificateBooks,
      },
      {
        name: 'Projetos',
        title: 'Meus repositórios públicos no GitHub',
        description: 'Projetos acadêmicos e pessoais publicados no GitHub.',
        tags: ['Projetos', 'GitHub'],
        art: 'books',
        books: [],
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
        description: 'Do Cotemig ao DNIT, à Direcional Engenharia e à Engenharia de Software na PUC Minas.',
        tags: ['Tecnologia', 'História'],
        art: 'throne',
        paragraphs: [
          'Minha trajetória na tecnologia começou com a formação técnica em Informática no Cotemig, onde desenvolvi minha base em programação, bancos de dados e desenvolvimento de sistemas.',
          'Em 2024, comecei minha experiência profissional no DNIT, trabalhando com suporte técnico e infraestrutura de TI. Nesse período, tive contato com manutenção de computadores, notebooks e impressoras, atendimento de chamados e organização de informações.',
          'Posteriormente, atuei na Direcional Engenharia, com foco em TI e automação de processos. Nesse trabalho, tive contato com automações de rotinas financeiras e integração com SQL Server.',
          'Essas experiências ampliaram meu interesse por desenvolvimento de software, automação e manipulação de dados.',
          'Atualmente, curso Engenharia de Software na PUC Minas e continuo desenvolvendo meus conhecimentos por meio de estudos e projetos práticos.',
        ],
      },
      {
        name: 'Pergaminho',
        title: 'Sobre mim',
        description: 'Estudante de Engenharia de Software na PUC Minas e Técnico em Informática pelo Cotemig.',
        tags: ['Software', 'Dados', 'IA'],
        art: 'scroll',
        paragraphs: [
          'Sou estudante de Engenharia de Software na PUC Minas e Técnico em Informática formado pelo Cotemig, com experiência prática em suporte de TI, infraestrutura e automação de processos. Tenho interesse em desenvolvimento de software, engenharia de dados e inteligência artificial, buscando construir soluções que combinem tecnologia, eficiência e boas práticas de desenvolvimento.',
        ],
        links: [
          { label: 'Baixar currículo (Português) · DOCX', url: profile.cv.pt, download: true },
          { label: 'Download resume (English) · DOCX', url: profile.cv.en, download: true },
        ],
      },
      {
        name: 'Troféus',
        title: 'Destaques',
        description: 'Formação, experiência profissional e projetos que marcaram minha trajetória.',
        tags: ['Destaques'],
        art: 'trophy',
        items: [
          'Formação técnica em Informática pelo Cotemig.',
          'Graduação em Engenharia de Software em andamento na PUC Minas.',
          'Experiência profissional em suporte técnico e infraestrutura de TI no DNIT.',
          'Experiência com automação de processos na Direcional Engenharia.',
          'Contato com integração de dados utilizando SQL Server.',
          'Participação em projetos acadêmicos de desenvolvimento de software.',
          'Desenvolvimento de um portfólio pessoal com identidade visual inspirada em RPGs e castelos.',
        ],
      },
      {
        name: 'Mensageiro',
        title: 'Vamos escrever uma nova história?',
        description: 'Fale comigo por e-mail, GitHub ou LinkedIn.',
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
        title: 'Onde estou',
        description: 'Estou em Belo Horizonte, Minas Gerais, Brasil.',
        tags: ['Localização'],
        art: 'bed',
      },
      {
        name: 'Mesa',
        title: 'Meu setup',
        description: 'Meu computador e minhas ferramentas.',
        tags: ['Setup', 'Ferramentas'],
        art: 'desk',
        items: ['Computador desktop com NVIDIA GeForce RTX 4060 Ti Super.'],
      },
      {
        name: 'Pôster',
        title: 'Hobbies',
        description: 'Leio ficção científica, romance e fantasia; assisto filmes, séries e animes; e jogo Red Dead Redemption, God of War, Skull: The Hero Slayer e Valorant.',
        tags: ['Inspiração', 'Hobbies'],
        art: 'poster',
        items: [
          'Ler livros de ficção científica, romance e fantasia.',
          'Assistir a filmes, séries e animes.',
          'Jogar videogames, especialmente Red Dead Redemption, God of War, Skull: The Hero Slayer e Valorant.',
          'Explorar universos fictícios, histórias e narrativas de jogos.',
        ],
      },
      {
        name: 'Baú',
        title: 'Curiosidades',
        description: 'Cibersegurança, automação, jogos e inteligência artificial estão entre os meus interesses.',
        tags: ['Curiosidades'],
        art: 'chest',
        items: [
          'Tenho interesse em cibersegurança e em entender como proteger sistemas e aplicações.',
          'Gosto de explorar automação de processos e maneiras de tornar tarefas mais eficientes.',
          'Tenho interesse em desenvolvimento de jogos e na criação de projetos próprios.',
          'Gosto de conhecer novas tecnologias e explorar aplicações práticas de inteligência artificial.',
        ],
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
        title: 'Linguagens',
        description: 'Linguagens que uso: Java, TypeScript, JavaScript, Python e C#.',
        tags: ['Linguagens'],
        art: 'sword',
        categories: ['Linguagens'],
      },
      {
        name: 'Arco',
        title: 'Back-end e dados',
        description: 'Back-end e dados: Node.js, Spring Boot, SQL e SQL Server.',
        tags: ['Back-end', 'Dados'],
        art: 'bow',
        categories: ['Back-end', 'Dados'],
      },
      {
        name: 'Escudo',
        title: 'Front-end',
        description: 'Front-end: HTML, CSS e React.',
        tags: ['Front-end'],
        art: 'shield',
        categories: ['Front-end'],
      },
      {
        name: 'Bigorna',
        title: 'Ferramentas',
        description: 'Ferramentas: Git, GitHub, RPA e Godot.',
        tags: ['Ferramentas'],
        art: 'anvil',
        categories: ['Ferramentas'],
      },
      {
        name: 'Esfera das tecnologias',
        title: 'Esfera das tecnologias',
        description: 'Mapa interativo das principais tecnologias e competências que uso em software, dados e automação.',
        tags: ['Tecnologias', 'Competências'],
        art: 'orb',
        categories: ['Linguagens', 'Front-end', 'Back-end', 'Dados', 'Ferramentas'],
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
        title: 'Cibersegurança',
        description: 'Tenho interesse em cibersegurança e em entender como proteger sistemas e aplicações.',
        tags: ['Interesses'],
        art: 'potion',
      },
      {
        name: 'Poção verde',
        title: 'Jogos',
        description: 'Tenho interesse em desenvolvimento de jogos e na criação de projetos próprios. Uso o Godot.',
        tags: ['Interesses'],
        art: 'flask',
      },
      {
        name: 'Caldeirão',
        title: 'IA e automação',
        description: 'Gosto de explorar automação de processos e aplicações práticas de inteligência artificial.',
        tags: ['Interesses'],
        art: 'cauldron',
      },
    ],
  },
];
