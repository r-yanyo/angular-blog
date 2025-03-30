import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Entry } from 'contentful';
import { ContentfulService } from '../../services/contentful.service';
import { MarkdownService } from '../../services/markdown.service';
import { BlogPostSkeleton } from '../../types/contentful';

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

  post = signal<Entry<BlogPostSkeleton> | null>(null);
  content = signal<string>('');

  constructor() {
    this.loadPost();
  }

  private async loadPost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      this.post.set(await this.contentful.getEntry(id));
      this.content.set(await this.markdown.parse(this.post()?.fields.content as string));
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }
}
