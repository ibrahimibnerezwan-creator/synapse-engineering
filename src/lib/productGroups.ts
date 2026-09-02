export const CATEGORY_ORDER = [
  'Industrial Automation',
  'Solar & Power Solutions',
  'Consumer Tech & Gadgets',
  'Global Sourcing & Import'
] as const;

export type CatalogCategory = (typeof CATEGORY_ORDER)[number];

export type GroupChip = 'chip-ink' | 'chip-jade' | 'chip-copper' | 'chip-kiln';

export type GroupTone = {
  id: 'automation' | 'solar' | 'gadgets' | 'sourcing';
  short: string;
  chip: GroupChip;
  tab: 'tab-ink' | 'tab-jade' | 'tab-copper' | 'tab-kiln';
  band: 'band-ink' | 'band-jade' | 'band-copper' | 'band-kiln';
  bar: 'bar-ink' | 'bar-jade' | 'bar-copper' | 'bar-kiln';
  wrap: 'wrap-ink' | 'wrap-jade' | 'wrap-copper' | 'wrap-kiln';
  wash: 'wash-ink' | 'wash-jade' | 'wash-copper' | 'wash-kiln';
};

export const GROUP_TONE: Record<CatalogCategory, GroupTone> = {
  'Industrial Automation': {
    id: 'automation',
    short: 'Automation',
    chip: 'chip-ink',
    tab: 'tab-ink',
    band: 'band-ink',
    bar: 'bar-ink',
    wrap: 'wrap-ink',
    wash: 'wash-ink'
  },
  'Solar & Power Solutions': {
    id: 'solar',
    short: 'Solar & ESS',
    chip: 'chip-jade',
    tab: 'tab-jade',
    band: 'band-jade',
    bar: 'bar-jade',
    wrap: 'wrap-jade',
    wash: 'wash-jade'
  },
  'Consumer Tech & Gadgets': {
    id: 'gadgets',
    short: 'Gadgets',
    chip: 'chip-copper',
    tab: 'tab-copper',
    band: 'band-copper',
    bar: 'bar-copper',
    wrap: 'wrap-copper',
    wash: 'wash-copper'
  },
  'Global Sourcing & Import': {
    id: 'sourcing',
    short: 'Sourcing',
    chip: 'chip-kiln',
    tab: 'tab-kiln',
    band: 'band-kiln',
    bar: 'bar-kiln',
    wrap: 'wrap-kiln',
    wash: 'wash-kiln'
  }
};

export function groupTone(category?: string | null): GroupTone {
  if (category && category in GROUP_TONE) {
    return GROUP_TONE[category as CatalogCategory];
  }
  return GROUP_TONE['Industrial Automation'];
}

/** Sub-groups contrast with each other, not only with paper. */
export function subGroupChip(subCategory?: string | null, category?: string | null): GroupChip {
  const sub = (subCategory || '').toLowerCase();
  if (sub.includes('lithium') || sub.includes('portable') || sub.includes('power')) return 'chip-jade';
  if (sub.includes('charg') || sub.includes('cable')) return 'chip-copper';
  if (sub.includes('smart')) return 'chip-ink';
  if (sub.includes('plc') || sub.includes('i/o') || sub.includes('module')) return 'chip-ink';
  if (sub.includes('contactor') || sub.includes('motor')) return 'chip-copper';
  if (sub.includes('procurement') || sub.includes('turnkey') || sub.includes('qc')) return 'chip-kiln';
  return groupTone(category).chip;
}

export const CONSUMER_FILTERS = [
  { id: 'All' as const, label: 'All', chip: 'chip-ink' as GroupChip, tab: 'tab-all' as const },
  { id: 'Power' as const, label: 'Power', chip: 'chip-jade' as GroupChip, tab: 'tab-jade' as const },
  { id: 'Charging' as const, label: 'Charging', chip: 'chip-copper' as GroupChip, tab: 'tab-copper' as const },
  { id: 'Smart Home' as const, label: 'Smart Home', chip: 'chip-ink' as GroupChip, tab: 'tab-ink' as const }
];
