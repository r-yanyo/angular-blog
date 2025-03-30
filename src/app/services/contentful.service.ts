import { Injectable } from '@angular/core';
import { ContentfulClientApi, createClient, Entry, EntryCollection } from 'contentful';
import { environment } from '../../environments/environment';
import { BlogPostSkeleton } from '../types/contentful';

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {
  private client: ContentfulClientApi<undefined>;

  constructor() {
    this.client = createClient({
      space: environment.contentful.spaceId,
      accessToken: environment.contentful.accessToken
    });
  }

  getEntries(): Promise<EntryCollection<BlogPostSkeleton>> {
    return this.client.getEntries<BlogPostSkeleton>();
  }

  getEntry(id: string): Promise<Entry<BlogPostSkeleton>> {
    return this.client.getEntry<BlogPostSkeleton>(id);
  }
}
