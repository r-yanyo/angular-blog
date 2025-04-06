import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from '../types/contentful';

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {
  private http = inject(HttpClient);

  constructor() { }

  getEntries(): Observable<Post[]> {
    // 静的JSONファイルからエントリーリストを取得
    return this.http.get<Post[]>('/data/posts/index.json').pipe(
      map(entries => entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())),

      catchError(error => {
        console.error('静的ファイルの取得に失敗しました。Contentful APIにフォールバックします。', error);
        throw error;
      })
    );
  }

  getEntry(id: string): Observable<Post> {
    // 静的JSONファイルから特定のエントリーを取得
    return this.http.get<Post>(`/data/posts/${id}.json`).pipe(
      catchError(error => {
        console.error(`静的ファイル ${id}.json の取得に失敗しました。Contentful APIにフォールバックします。`, error);
        throw error;
      })
    );
  }
}
