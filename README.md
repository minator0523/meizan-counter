# meizan-counter
MaplibreとPostgreSQLの連携

## 概要
地図上に百名山・二百名山・三百名山の位置を表示し，各山を登った回数を色により可視化する．データベースと連携させ，ブラウザから登った回数を更新できる．

![実際の](./img/スクリーンショット%202025-03-13%20165555.jpg)

## 使い方
1. リポジトリをクローンする
```
$ git clone git@github.com:minator0523/meizan-counter.git
```

2. Dockerコンテナ起動
```
$ cd ./meizan-counter
$ docker compose up -d
```
3. Edgeに
```
http://127.0.0.1:3000/index.html
```
を入力（Edge以外はCORSエラーになり，山頂のシンボルが表示されない）

4. 登った回数を入力する

山頂のシンボル（円）をクリックし，左下に山名，標高，カウント（登った回数）を表示させる．カウントに新たな値を入力し，更新ボタンをクリックすると，山頂シンボルの色が更新された値に対応する．

## ディレクトリ構成
```
meizan-counter/
├── Dockerfile
├── README.md
├── app
│   ├── __init__.py
│   ├── main.py
│   └── model.py
├── docker-compose.yml
├── postgis-init
│   ├── 01-setput.sql
│   └── 02-meizan02.sql
└── static
    ├── index.html
    ├── main.js
    └── style.css
```

## データの出典（各山頂の位置）
* [日本百選と座標値](https://100sen.cyber-ninja.jp/#website)