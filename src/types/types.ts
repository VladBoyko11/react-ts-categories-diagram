export type Category = {
  id: number;
  text: string;
  children: Array<Category>;
};

export type Categories = Category[];