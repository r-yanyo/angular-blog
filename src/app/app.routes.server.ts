import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { ContentfulService } from './services/contentful.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'posts/:date/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const contentful = inject(ContentfulService);
      const entries = await contentful.getEntries();
      return entries.items.map((entry) => ({
        id: entry.sys.id,
        date: entry.fields.date,
      }));
    }
  }
];