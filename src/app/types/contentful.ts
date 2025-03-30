
export interface BlogPostFields {
  title: string;
  content: string;
  date: string;
  slug: string;
  tags: string[];
}

export interface GetEntriesResponse {
  items: Array<Post>;
}

export interface Post {
  sys: {
    id: string;
  };
  fields: BlogPostFields;
}