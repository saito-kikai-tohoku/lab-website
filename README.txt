のりまき研究室 サイト試作データ

使い方
1. assets フォルダ内の画像・動画を実データに差し替えてください。
2. data/note-feed.json のタイトルを、noteの記事タイトルに置き換えてください。
3. 電話番号、メールアドレス、各ページの ***ここに記入する*** を更新してください。
4. GitHub Pages などの静的ホスティングにそのまま配置できます。

主な差し替えファイル
- assets/movie_top.mp4
- assets/movie_labo_1.mp4
- assets/movie_labo_2.mp4
- assets/pic_professor.jpg
- assets/pic_students.jpg
- assets/img_*.jpg

note 連携について
今回は data/note-feed.json を読む構成です。
GitHub Actions などで note のRSS/JSON を取得してこのファイルを自動更新する構成に差し替えやすい形にしています。
