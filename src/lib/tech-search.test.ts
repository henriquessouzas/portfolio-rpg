import { describe, expect, it } from 'vitest';
import { searchTechs } from './tech-search';

const items = [
  { name: 'React', category: 'Front-end', years: 4, tags: ['ui', 'spa'] },
  { name: 'Docker', category: 'Ferramentas', years: 2, tags: ['containers', 'deploy'] },
  { name: 'C#', category: 'Linguagens', years: 3, tags: ['backend', 'dotnet'] },
  { name: 'SQL Server', category: 'Dados', years: 5, tags: ['banco', 'relacional'] },
  { name: 'Acessibilidade', category: 'Front-end', years: 1, tags: ['áudio', 'wcag'] },
  { name: 'Node.js', category: 'Back-end', years: 4, tags: ['runtime', 'api'] },
];

describe('searchTechs', () => {
  it('ignores accents and case while matching name, category and tags', () => {
    expect(searchTechs(items, 'react').map((tech) => tech.name)).toEqual(['React']);
    expect(searchTechs(items, 'WCAG').map((tech) => tech.name)).toEqual(['Acessibilidade']);
    expect(searchTechs(items, 'áudio').map((tech) => tech.name)).toEqual(['Acessibilidade']);
  });

  it('combines a text query with a category filter using logical AND', () => {
    expect(searchTechs(items, 'api', 'Back-end').map((tech) => tech.name)).toEqual(['Node.js']);
    expect(searchTechs(items, 'react', 'Dados')).toEqual([]);
    expect(searchTechs(items, 'front', 'Front-end').map((tech) => tech.name)).toEqual(['React', 'Acessibilidade']);
  });

  it('returns an empty result set when nothing matches', () => {
    expect(searchTechs(items, 'tecnologia inexistente')).toEqual([]);
  });

  it('orders results by descending level', () => {
    expect(searchTechs(items, '').map((tech) => tech.name)).toEqual([
      'SQL Server',
      'Node.js',
      'React',
      'C#',
      'Docker',
      'Acessibilidade',
    ]);
  });
});
