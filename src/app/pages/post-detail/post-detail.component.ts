import { isPlatformServer } from '@angular/common';
import { Component, inject, makeStateKey, OnInit, PLATFORM_ID, signal, TransferState } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContentfulService } from '../../services/contentful.service';
import { Post } from '../../types/contentful';

const POST_KEY = makeStateKey<Post>('post');
const CONTENT_KEY = makeStateKey<string>('content');

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentful = inject(ContentfulService);
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);
  post = signal<Post | null>(null);
  content = signal<string>('');

  async ngOnInit() {
    // サーバーサイドでのみデータを取得
    if (isPlatformServer(this.platformId)) {
      await this.loadPost();
      this.transferState.set(POST_KEY, this.post());
      this.transferState.set(CONTENT_KEY, this.content());
    } else {
      this.post.set(this.transferState.get(POST_KEY, null));
      this.content.set(this.transferState.get(CONTENT_KEY, ''));
    }
  }

  private async loadPost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }


    // 事前生成されたJSONファイルからデータを取得
    const post = await firstValueFrom(this.contentful.getEntry(id));
    this.post.set(post);

    this.content.set(post.content);

    // メタ情報の更新
    const title = `${post.title} | r-yanyoのブログ`;
    this.setMetaTags(title, post.content);

  }

  // メタタグを設定するヘルパーメソッド
  private setMetaTags(title: string, content: string) {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });

    // HTMLタグを正規表現で削除（document.createElementは使用しない）
    const description = content
      .substring(0, 500)
      .replace(/<[^>]*>/g, '') // HTMLタグを削除
      .replace(/&nbsp;/g, ' ') // 特殊文字を置換
      .replace(/\s+/g, ' ')    // 複数の空白を単一の空白に
      .trim()
      .substring(0, 160);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}
