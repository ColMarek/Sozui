# Sozui

![Test CI](https://github.com/ColMarek/sozui/workflows/test-workflow/badge.svg)

A Discord bot for anime/manga.

## Usage

### Linking

You can link anime/manga using:

```
Anime (detailed)  ->  :{anime title}:
Anime             ->  :{{anime title}}:
Manga (detailed)  ->  :<manga title>:
Manga             ->  :<<manga title>>:
```
#### Detailed

![Detail](./img/detail.png)

#### Mini

![Mini](./img/mini.png)

### Searching

You can search for anime using `/search`

```
# discord will auto-complete

/search query: Black Clover is-anime: true
```

![Search](./img/search.png)

## Commands

```
/info

/help

/search
```
## Setup

> Requires Node 16+ for discord.js 13

Install dependencies

```
npm install
```

Copy .env file

```
cp .env.sample .env
```

Run 

```
npm start
```
