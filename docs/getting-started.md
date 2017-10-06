# Getting Started

* [Installation](#installation)
* [CLI](#cli)
* [Setup a Server-Side React App](#setup-a-server-side-react-app)
* [Programmers Guide](#programmers-guide)

## Installation

Reunify is super easy to set up. Just `npm install -g reunify`, write a web page using React, and then use one of the following snippets to get started. For more info, read the Reunify docs.

```bash
npm install -g reunify
```

Alternatively

```bash
yarn global add reunify
```

## CLI

```bash
reunify help
```

```bash
Usage: reunify [options] [command]


Options:

  -V, --version  output the version number
  -h, --help     output usage information


Commands:

  create <folder>  Creates an new application.
  serve            Serves an application.
  export           Exports application without server-side-rendering.
  help [cmd]       display help for [cmd]
```

## Setup a Server-Side React App

```bash
reunify create my-react-app
cd my-react-app

npm test #Test environment
npm run dev #Development environment
npm start #Production environment
```

## Programmers Guide

> coming soon