import { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';

export interface BlogPostFields {
  title: EntryFieldTypes.Text;
  content: EntryFieldTypes.Text;
  date: EntryFieldTypes.Date;
  slug: EntryFieldTypes.Text;
}

export interface BlogPostSkeleton extends EntrySkeletonType {
  contentTypeId: 'blogPost';
  fields: BlogPostFields;
}

export type BlogPost = Entry<BlogPostSkeleton>;
