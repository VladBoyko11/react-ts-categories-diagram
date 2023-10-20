export type Category = {
  id: number;
  text: string;
  // level: number;
  children: Array<Category | EnrichedCategory>;
  // parent: Category | null;
};

export type EnrichedCategory = Category & {
  depth: number,
  descendentsCount: number,
  heightDiffWithLastDirectChild: number
  // parent: Category | null;
};

export type Categories = Category[];