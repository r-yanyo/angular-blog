import { Injectable } from '@angular/core';
import { ContentfulClientApi, createClient } from 'contentful';
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

  getEntries() {
    return this.client.getEntries<BlogPostSkeleton>();
  }

  getEntry(id: string) {
    return this.client.getEntry<BlogPostSkeleton>(id);
  }
}
