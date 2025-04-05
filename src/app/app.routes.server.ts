import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { ContentfulService } from './services/contentful.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'posts/:date/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      try {
        const contentful = inject(ContentfulService);
        const entries = await contentful.getEntries();

        const params = entries.items.map((entry) => ({
          id: entry.sys.id,
          date: entry.fields.date,
        }));

        return params;
      } catch (error) {
        console.error('Error generating SSG params:', error);
        return [];
      }
    }
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
];
