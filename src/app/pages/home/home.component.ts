import { isPlatformServer } from '@angular/common';
import { Component, inject, makeStateKey, PLATFORM_ID, signal, TransferState } from '@angular/core';
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

  async ngOnInit() {
    if (isPlatformServer(PLATFORM_ID)) {
      await this.loadPosts();
      this.transferState.set(POSTS_KEY, this.posts());
    }

    if (this.transferState.hasKey(POSTS_KEY)) {
      this.posts.set(this.transferState.get(POSTS_KEY, []));
    }
  }

  private async loadPosts() {
    try {
      const response = await this.contentful.getEntries();
      this.posts.set(response.items);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }
}
