import { Injectable } from '@angular/core';
import { ContentfulClientApi, createClient } from 'contentful';
import { environment } from '../../environments/environment';
import { GetEntriesResponse, Post } from '../types/contentful';

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
    return this.client.getEntries() as unknown as Promise<GetEntriesResponse>;
  }

  getEntry(id: string) {
    return this.client.getEntry(id) as unknown as Promise<Post>;
  }
}
