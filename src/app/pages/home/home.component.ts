import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentfulService, } from '../../services/contentful.service';
import { Post } from '../../types/contentful';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private contentful: ContentfulService;
  posts = signal<Post[]>([]);

  constructor() {
    this.contentful = inject(ContentfulService);
    this.loadPosts();
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
