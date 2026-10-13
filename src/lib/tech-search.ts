export type TechSearchItem = {
  name: string;
  category: string;
  years?: number;
  tags?: string[];
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();

export function searchTechs(
  items: TechSearchItem[],
  query: string,
  category: string = 'Todas',
): TechSearchItem[] {
  const normalizedQuery = normalizeText(query);
  const normalizedCategory = normalizeText(category);

  const filtered = items.filter((item) => {
    const haystack = [
      item.name,
      item.category,
      ...(item.tags ?? []),
    ]
      .join(' ')
      .trim();

    const matchesCategory =
      normalizedCategory === '' || normalizedCategory === 'todas' || normalizeText(item.category) === normalizedCategory;

    const matchesQuery =
      normalizedQuery.length === 0 ||
      normalizeText(haystack).includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  return [...filtered].sort((left, right) => {
    const byYears = (right.years ?? 0) - (left.years ?? 0);
    if (byYears !== 0) return byYears;
    return left.name.localeCompare(right.name, 'pt-BR');
  });
}
