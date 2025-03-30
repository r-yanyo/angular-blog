import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/posts">Posts</a>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      padding: 1rem;
      background-color: #f8f9fa;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    nav {
      display: flex;
      gap: 1rem;
    }
    a {
      text-decoration: none;
      color: #333;
    }
    a:hover {
      color: #007bff;
    }
  `]
})
export class HeaderComponent { }
