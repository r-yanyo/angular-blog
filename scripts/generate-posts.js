#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { createClient } = require('contentful');
const { marked } = require('marked');
const hljs = require('highlight.js');

// 環境変数から取得するか、直接指定
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!SPACE_ID || !ACCESS_TOKEN) {
  console.error('環境変数 CONTENTFUL_SPACE_ID と CONTENTFUL_ACCESS_TOKEN を設定してください');
  process.exit(1);
}

// Contentfulクライアントの初期化
const client = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

// Markdownパーサーの設定
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
});

// 出力ディレクトリの作成
const OUTPUT_DIR = path.resolve(__dirname, '../public/data/posts');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generatePostFiles() {
  try {
    console.log('Contentfulからブログ記事を取得中...');

    // エントリーのリストを取得
    const entries = await client.getEntries();

    console.log(`${entries.items.length}件の記事を取得しました`);

    // 個別のエントリーを処理し、ファイルに保存
    for (const entry of entries.items) {
      const { id } = entry.sys;
      const { title, content, date, tags } = entry.fields;

      // コンテンツをHTMLに変換
      const htmlContent = marked(content || '');

      // メタデータを含むJSONオブジェクト
      const postData = {
        id,
        title,
        date,
        tags,
        content: htmlContent,
      };

      // IDごとにファイルを保存
      const filePath = path.join(OUTPUT_DIR, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(postData, null, 2));
      console.log(`記事を保存しました: ${filePath}`);
    }

    // 全記事のインデックスファイルを作成
    const index = entries.items.map(entry => ({
      id: entry.sys.id,
      title: entry.fields.title,
      date: entry.fields.date,
      tags: entry.fields.tags,
      // コンテンツ全体は含めない
    }));

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'index.json'),
      JSON.stringify(index, null, 2)
    );

    console.log('すべての記事の処理が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプトの実行
generatePostFiles();
