export const getAdjacentRegionIndex = (
  index: number,
  width: number,
  height: number
): number[] => {
  const row: number = Math.floor(index / height);
  const column: number = index % width;
  const res: number[] = [];

  if (row > 0) {
    res.push(index - width);
  }

  if (column < width - 1) {
    res.push(index + 1);
  }

  if (row < height - 1) {
    res.push(index + width);
  }

  if (column > 0) {
    res.push(index - 1);
  }
  return res;
};
