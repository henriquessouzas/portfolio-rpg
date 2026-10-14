import PF from 'pathfinding';
import type { Lang } from './i18n';

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
const roomsEn: [Room, Room, Room, Room, Room] = [
  {
    id: 'B',
    name: 'Library',
    category: 'Knowledge',
    subtitle: 'Every book, a new discovery.',
    destination: { x: 2, y: 2 },
    objects: [
      {
        name: 'Courses',
        title: 'Education & Study',
        description: 'My academic and technical journey in technology and software development.',
        tags: ['Technology', 'Education'],
        art: 'book',
        books: [
          {
            title: 'IT Technician',
            subtitle: 'Cotemig · 2025',
            description: 'Programming fundamentals, systems development, data handling, spreadsheets and databases.',
            tags: ['Programming', 'Databases'],
            color: 'ember',
          },
          {
            title: 'Software Engineering',
            subtitle: 'PUC Minas · 2026–2030 (expected)',
            description: 'Degree in software development, systems engineering and computing fundamentals, currently in progress.',
            tags: ['Software Engineering', 'Computing'],
            color: 'forest',
          },
        ],
      },
      {
        name: 'Certificates',
        title: 'Certifications',
        description: 'Courses and learning milestones in technology, AI, data and infrastructure.',
        tags: ['Certificates', 'Education'],
        art: 'scroll',
        books: certificateBooks,
      },
      {
        name: 'Projects',
        title: 'My public GitHub repositories',
        description: 'Academic and personal projects published on GitHub.',
        tags: ['Projects', 'GitHub'],
        art: 'books',
        books: [],
      },
    ],
  },
  {
    id: 'T',
    name: 'Throne Room',
    category: 'My Story',
    subtitle: 'Every adventure begins with a story.',
    destination: { x: 6, y: 2 },
    objects: [
      {
        name: 'Throne',
        title: 'Henrique Santos de Souza',
        description: 'From Cotemig to DNIT, Direcional Engenharia and Software Engineering at PUC Minas.',
        tags: ['Technology', 'Story'],
        art: 'throne',
        paragraphs: [
          'My journey in technology began with a technical degree in IT at Cotemig, where I built my foundation in programming, databases and systems development.',
          'In 2024, I started my professional experience at DNIT, working with technical support and IT infrastructure. During this period I handled computer, notebook and printer maintenance, ticket management and information organisation.',
          'Later, I worked at Direcional Engenharia, focused on IT and process automation, with exposure to financial routine automation and SQL Server integration.',
          'These experiences deepened my interest in software development, automation and data handling.',
          'I am currently studying Software Engineering at PUC Minas and continue to grow through self-study and hands-on projects.',
        ],
      },
      {
        name: 'Scroll',
        title: 'About me',
        description: 'Software Engineering student at PUC Minas and IT Technician from Cotemig.',
        tags: ['Software', 'Data', 'AI'],
        art: 'scroll',
        paragraphs: [
          'I am a Software Engineering student at PUC Minas and a certified IT Technician from Cotemig, with hands-on experience in IT support, infrastructure and process automation. I am interested in software development, data engineering and artificial intelligence, aiming to build solutions that combine technology, efficiency and good development practices.',
        ],
        links: [
          { label: 'Download résumé (Portuguese) · DOCX', url: profile.cv.pt, download: true },
          { label: 'Download resume (English) · DOCX', url: profile.cv.en, download: true },
        ],
      },
      {
        name: 'Trophies',
        title: 'Highlights',
        description: 'Education, professional experience and projects that shaped my journey.',
        tags: ['Highlights'],
        art: 'trophy',
        items: [
          'IT Technician degree from Cotemig.',
          'Software Engineering degree in progress at PUC Minas.',
          'Professional experience in technical support and IT infrastructure at DNIT.',
          'Experience with process automation at Direcional Engenharia.',
          'Exposure to data integration using SQL Server.',
          'Participation in academic software development projects.',
          'Development of a personal portfolio with a visual identity inspired by RPGs and castles.',
        ],
      },
      {
        name: 'Messenger',
        title: "Let's write a new story?",
        description: 'Reach me by email, GitHub or LinkedIn.',
        tags: ['Contact'],
        art: 'letter',
      },
    ],
  },
  {
    id: 'A',
    name: 'Chambers',
    category: 'Beyond the Code',
    subtitle: 'The human side behind the hero.',
    destination: { x: 10, y: 2 },
    objects: [
      {
        name: 'Bed',
        title: 'Where I am',
        description: 'I am in Belo Horizonte, Minas Gerais, Brazil.',
        tags: ['Location'],
        art: 'bed',
      },
      {
        name: 'Desk',
        title: 'My setup',
        description: 'My computer and tools.',
        tags: ['Setup', 'Tools'],
        art: 'desk',
        items: ['Desktop computer with NVIDIA GeForce RTX 4060 Ti Super.'],
      },
      {
        name: 'Poster',
        title: 'Hobbies',
        description: 'I read sci-fi, romance and fantasy; watch films, series and anime; and play Red Dead Redemption, God of War, Skull: The Hero Slayer and Valorant.',
        tags: ['Inspiration', 'Hobbies'],
        art: 'poster',
        items: [
          'Reading sci-fi, romance and fantasy books.',
          'Watching films, series and anime.',
          'Playing video games, especially Red Dead Redemption, God of War, Skull: The Hero Slayer and Valorant.',
          'Exploring fictional universes, stories and game narratives.',
        ],
      },
      {
        name: 'Chest',
        title: 'Fun facts',
        description: 'Cybersecurity, automation, games and artificial intelligence are among my interests.',
        tags: ['Fun facts'],
        art: 'chest',
        items: [
          'I am interested in cybersecurity and understanding how to protect systems and applications.',
          'I enjoy exploring process automation and ways to make tasks more efficient.',
          'I am interested in game development and creating my own projects.',
          'I like learning about new technologies and exploring practical applications of artificial intelligence.',
        ],
      },
    ],
  },
  {
    id: 'R',
    name: 'Arsenal',
    category: 'Skills',
    subtitle: 'The tools to face any mission.',
    destination: { x: 2, y: 8 },
    objects: [
      {
        name: 'Sword',
        title: 'Languages',
        description: 'Languages I use: Java, TypeScript, JavaScript, Python and C#.',
        tags: ['Languages'],
        art: 'sword',
        categories: ['Linguagens'],
      },
      {
        name: 'Bow',
        title: 'Back-end & Data',
        description: 'Back-end and data: Node.js, Spring Boot, SQL and SQL Server.',
        tags: ['Back-end', 'Data'],
        art: 'bow',
        categories: ['Back-end', 'Dados'],
      },
      {
        name: 'Shield',
        title: 'Front-end',
        description: 'Front-end: HTML, CSS and React.',
        tags: ['Front-end'],
        art: 'shield',
        categories: ['Front-end'],
      },
      {
        name: 'Anvil',
        title: 'Tools',
        description: 'Tools: Git, GitHub, RPA and Godot.',
        tags: ['Tools'],
        art: 'anvil',
        categories: ['Ferramentas'],
      },
      {
        name: 'Tech Sphere',
        title: 'Tech Sphere',
        description: 'Interactive map of the main technologies and skills I use in software, data and automation.',
        tags: ['Technologies', 'Skills'],
        art: 'orb',
        categories: ['Linguagens', 'Front-end', 'Back-end', 'Dados', 'Ferramentas'],
      },
    ],
  },
  {
    id: 'L',
    name: 'Laboratory',
    category: 'Experiments',
    subtitle: 'Ideas in transformation. Watch out for the potions.',
    destination: { x: 10, y: 8 },
    objects: [
      {
        name: 'Blue Potion',
        title: 'Cybersecurity',
        description: 'I am interested in cybersecurity and understanding how to protect systems and applications.',
        tags: ['Interests'],
        art: 'potion',
      },
      {
        name: 'Green Potion',
        title: 'Games',
        description: 'I am interested in game development and creating my own projects. I use Godot.',
        tags: ['Interests'],
        art: 'flask',
      },
      {
        name: 'Cauldron',
        title: 'AI & Automation',
        description: 'I enjoy exploring process automation and practical applications of artificial intelligence.',
        tags: ['Interests'],
        art: 'cauldron',
      },
    ],
  },
];

const profileEn: Profile = {
  ...profile,
  role: 'Software Developer | Software Engineering Student | Software • Data • AI',
  bio: 'I am a Software Engineering student at PUC Minas and a certified IT Technician from Cotemig, with hands-on experience in IT support, infrastructure and process automation. I am interested in software development, data engineering and artificial intelligence, aiming to build solutions that combine technology, efficiency and good development practices.',
  location: 'Belo Horizonte, Minas Gerais, Brazil',
};

export function getRooms(lang: Lang): [Room, Room, Room, Room, Room] {
  return lang === 'en' ? roomsEn : rooms;
}

export function getProfile(lang: Lang): Profile {
  return lang === 'en' ? profileEn : profile;
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
