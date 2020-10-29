export const getAdjacentRegionIndex = (
  index: number,
  width: number,
  height: number
): number[] => {
  const row: number = Math.floor(index / width);
  const column: number = index % 3;
  const res: number[] = [];

  if (row > 0) {
    res.push(index - column);
  }

  if (column < height - 1) {
    res.push(index + 1);
  }

  if (row < width - 1) {
    res.push(index + column);
  }

  if (column > 0) {
    res.push(index - 1);
  }
  return res;
};
