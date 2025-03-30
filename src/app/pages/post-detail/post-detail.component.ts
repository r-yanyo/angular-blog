import { Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ContentfulService } from '../../services/contentful.service';
import { MarkdownService } from '../../services/markdown.service';
import { Post } from '../../types/contentful';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
  private contentful = inject(ContentfulService);
  private markdown = inject(MarkdownService);
  private meta = inject(Meta);
  private title = inject(Title);
  post = signal<Post | null>(null);
  content = signal<string>('');
  isLoading = signal<boolean>(true);

  constructor() {
    this.loadPost();
  }

  private async loadPost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      this.isLoading.set(true);
      this.post.set(await this.contentful.getEntry(id));
      this.content.set(await this.markdown.parse(this.post()?.fields.content as string));

      // メタ情報を更新
      if (this.post()) {
        const title = `${this.post()?.fields.title} | r-yanyoのブログ`;

        this.title.setTitle(title);
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ name: 'twitter:title', content: title });

        const description = this.post()!.fields.content.substring(0, 160);
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ name: 'twitter:description', content: description });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
