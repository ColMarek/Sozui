# Sozui

[![Build Status](https://travis-ci.org/ColMarek/Sozui.svg?branch=master)](https://travis-ci.org/ColMarek/Sozui)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/17a474d963f14101b480b98fa25f8f40)](https://www.codacy.com/app/ColMarek/Sozui?utm_source=github.com&utm_medium=referral&utm_content=ColMarek/Sozui&utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/ColMarek/Sozui/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ColMarek/Sozui?targetFile=package.json)

A Discord bot for anime.

## Usage

You can search for anime by:

- wrapping the anime title in curly braces e.g. `{Fullmetal Alchemist}`. This will allow you to search for multiple anime in one message.
- using the anime command e.g. `!sozui anime Fullmetal Alchemist`.

## Commands

Default prefix: `!sozui`

Use `!sozui help` to view a more updated list of commands.

**NB:** In a DM message, you don't need a prefix.  
**NB:** Do not include the angle brackets `<`, `>` in the command.

### Search anime

`!sozui anime <anime title>`

Example: `!sozui anime Boku no Hero`

It is also possible to search using brackets e.g. `{Boku no Hero}`.  
You can have multiple searches in a message.

To get extended info, use `!sozui anime-extended <anime title>` or `!sozui ae <anime title>`

### Help

`!sozui help`

### Info

`!sozui info`

### Ping

`!sozui ping`
