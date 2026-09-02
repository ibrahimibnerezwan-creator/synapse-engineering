import { groupTone, subGroupChip } from '@/lib/productGroups';

export function GroupChip({
  category,
  subCategory,
  className = ''
}: {
  category?: string | null;
  subCategory?: string | null;
  className?: string;
}) {
  const label = subCategory || groupTone(category).short;
  const chip = subCategory ? subGroupChip(subCategory, category) : groupTone(category).chip;
  return <span className={`chip ${chip} ${className}`}>{label}</span>;
}
