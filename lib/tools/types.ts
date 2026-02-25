export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  icon: string;
  keywords: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tools: Tool[];
}
