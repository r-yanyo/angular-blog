import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="header">
      <a class="header-title" routerLink="/">r-yanyoのブログ</a>
    </header>
  `,
  styles: [`
    .header {
      padding: 0.5rem;
      text-align: center;
    }
    .header-title {
      font-size: 1.2rem;
      font-weight: bold;
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
