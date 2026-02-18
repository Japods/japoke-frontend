export function isItemSoldOut(item) {
  if (!item.isTrackable) return false;
  return item.currentStock < (item.portionSize || 1);
}
