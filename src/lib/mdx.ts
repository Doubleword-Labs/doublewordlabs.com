type ImagePropsWithOptionalAlt = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "alt"
> & { alt?: string };

export type MDXEntry<T> = T & { href: string; metadata: T };

export interface Article {
  date: string;
  title: string;
  description: string;
  author: {
    name: string;
    role: string;
    image: ImagePropsWithOptionalAlt;
  };
}

export interface CaseStudy {
  date: string;
  client: string;
  title: string;
  description: string;
  summary: Array<string>;
  logo: ImageMetadata;
  image: ImagePropsWithOptionalAlt;
  service: string;
  testimonial: {
    author: {
      name: string;
      role: string;
    };
    content: string;
  };
}

export function loadArticles() {
  return [];
}

export function loadCaseStudies() {
  return [];
}
