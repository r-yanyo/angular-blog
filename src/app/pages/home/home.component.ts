import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Entry } from 'contentful';
import { ContentfulService } from '../../services/contentful.service';
import { BlogPostSkeleton } from '../../types/contentful';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private contentful: ContentfulService;
  posts: Entry<BlogPostSkeleton>[] = [];

  constructor() {
    this.contentful = inject(ContentfulService);
    this.loadPosts();
  }

  private async loadPosts() {
    try {
      const response = await this.contentful.getEntries();
      this.posts = response.items;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }
}
