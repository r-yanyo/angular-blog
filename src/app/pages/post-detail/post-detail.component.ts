import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, makeStateKey, PLATFORM_ID, signal, TransferState } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ContentfulService } from '../../services/contentful.service';
import { MarkdownService } from '../../services/markdown.service';
import { Post } from '../../types/contentful';

const BODY_KEY = makeStateKey<Post>('post');
const CONTENT_KEY = makeStateKey<string>('content');

@Component({
  selector: 'app-post-detail',
  imports: [],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
  private contentful = inject(ContentfulService);
  private markdown = inject(MarkdownService);
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  post = signal<Post | null>(null);
  content = signal<string>('');
  transferState = inject(TransferState);

  async ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      await this.loadPost();
      this.transferState.set(BODY_KEY, this.post());
      this.transferState.set(CONTENT_KEY, this.content());
    }

    if (this.transferState.hasKey(BODY_KEY) && this.transferState.hasKey(CONTENT_KEY)) {
      this.post.set(this.transferState.get(BODY_KEY, null));
      this.content.set(this.transferState.get(CONTENT_KEY, ''));
    }
  }

  private async loadPost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      const post = await this.contentful.getEntry(id);
      this.post.set(post);

      const parsedContent = await this.markdown.parse(post.fields.content as string);
      this.content.set(parsedContent);

      // メタ情報を更新
      if (post) {
        const title = `${post.fields.title} | r-yanyoのブログ`;
        this.title.setTitle(title);
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ name: 'twitter:title', content: title });

        const description = post.fields.content.substring(0, 160);
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ name: 'twitter:description', content: description });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }
}
