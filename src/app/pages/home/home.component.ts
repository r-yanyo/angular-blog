import { isPlatformServer } from '@angular/common';
import { Component, inject, makeStateKey, PLATFORM_ID, signal, TransferState } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContentfulService, } from '../../services/contentful.service';
import { Post } from '../../types/contentful';

const POSTS_KEY = makeStateKey<Post[]>('posts');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private contentful = inject(ContentfulService);
  posts = signal<Post[]>([]);
  transferState = inject(TransferState);
  platformId = inject(PLATFORM_ID);
  async ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      await this.loadPosts();
      this.transferState.set(POSTS_KEY, this.posts());
    }

    if (this.transferState.hasKey(POSTS_KEY)) {
      this.posts.set(this.transferState.get(POSTS_KEY, []));
    }
  }

  private async loadPosts() {
    try {
      const entries = await firstValueFrom(this.contentful.getEntries());
      this.posts.set(entries);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }
}
