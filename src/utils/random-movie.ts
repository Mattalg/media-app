const MAX_RANK = 250;

export function getRandomRanks(skip?: string[]): [string, string] {
  const first = (Math.floor(Math.random() * MAX_RANK) + 1).toString();
  const second = (Math.floor(Math.random() * MAX_RANK) + 1).toString();

  if (first === second) return getRandomRanks(skip);

  if (skip && (skip.includes(first) || skip.includes(second))) return getRandomRanks(skip);

  return [first, second];
}
