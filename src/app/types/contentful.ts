import { Entry, EntrySkeletonType } from 'contentful';

export interface BlogPostFields {
  title: string;
  content: string;
  date: string;
  slug: string;
}

export interface BlogPostSkeleton extends EntrySkeletonType {
  fields: BlogPostFields;
  contentTypeId: 'blogPost';
}

export type BlogPost = Entry<BlogPostSkeleton>;
