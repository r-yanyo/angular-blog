import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { firstValueFrom } from 'rxjs';
import { ContentfulService } from './services/contentful.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'posts/:date/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      try {
        console.log('[SSG] Generating paams for blog posts');
        const contentful = inject(ContentfulService);

        // 事前生成されたインデックスファイルからデータを取得
        const entries = await firstValueFrom(contentful.getEntries());

        // 各エントリーからパラメータを生成
        const params = entries.map(entry => {
          return { id: entry.id, date: entry.date };
        });

        console.log(`[SSG] Generated params for ${params.length} blog posts`);
        return params;
      } catch (error) {
        console.error('[SSG] Error generating params:', error);
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
