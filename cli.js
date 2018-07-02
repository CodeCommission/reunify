#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const meow = require('meow');
const findup = require('find-up');
const readPkg = require('read-pkg-up').sync;
const openBrowser = require('react-dev-utils/openBrowser');
const chalk = require('chalk');
const clipboard = require('clipboardy');

const config = require('pkg-conf').sync('reunify');
const pkg = readPkg().pkg;

const cli = meow(
  `
  ${chalk.gray('Usage')}

    ${chalk.gray('Server')}

      ${chalk.cyan('reunify pages')}

    ${chalk.gray('Export')}

      ${chalk.cyan('reunify export pages')}

  ${chalk.gray('Options')}

      --webpack       Path to webpack config file
      --match         String to match routes against using minimatch

    ${chalk.gray('Server')}

      -o --open       Open server in default browser
      -p --port       Port for server
      -h --host       Host address for server
      --analyze       Runs with webpack-bundle-analyzer plugin

    ${chalk.gray('Export')}

      -d --out-dir    Output directory (default dist)
      -s --static     Output static HTML without JS bundle
      -t --template   Path to custom HTML template
      --basename      Basename for URL paths
      --title         Page title
`,
  {
    flags: {
      // dev
      open: {
        type: 'boolean',
        alias: 'o'
      },
      port: {
        type: 'number',
        alias: 'p'
      },
      host: {
        type: 'string',
        alias: 'h'
      },
      analyze: {},
      // export
      outDir: {
        type: 'string',
        alias: 'd'
      },
      static: {
        type: 'boolean'
      },
      template: {
        type: 'string',
        alias: 't'
      },
      // shared
      config: {
        type: 'string',
        alias: 'c'
      },
      match: {
        type: 'string'
      },
      scope: {
        type: 'string'
      },
      webpack: {
        type: 'string'
      },
      debug: {
        type: 'boolean'
      }
    }
  }
);

const [cmd, file] = cli.input;

if (!cmd) {
  cli.showHelp(0);
}

const input = path.resolve(file || cmd);
const stats = fs.statSync(input);
const dirname = stats.isDirectory() ? input : path.dirname(input);
const filename = stats.isDirectory() ? null : input;

const opts = Object.assign(
  {
    input,
    dirname,
    filename,
    stats,
    outDir: 'dist',
    basename: '',
    scope: {},
    pkg
  },
  config,
  cli.flags
);

opts.outDir = path.resolve(opts.outDir);
if (opts.config) opts.config = path.resolve(opts.config);
if (opts.webpack) {
  opts.webpack = require(path.resolve(opts.webpack));
} else {
  const webpackConfig = findup.sync('webpack.config.js', {cwd: dirname});
  if (webpackConfig) opts.webpack = require(webpackConfig);
}

if (opts.template) {
  opts.template = require(path.resolve(opts.template));
}

const handleError = err => {
  console.error(err);
  process.exit(1);
};

process.stdout.write(chalk.cyan('Reunify '));

switch (cmd) {
  case 'export':
    console.log('Exporting static site');
    const exportSite = require('./lib/export');
    exportSite(opts)
      .then(res => {
        console.log('Site saved to ' + opts.outDir);
      })
      .catch(handleError);
    break;
  case 'run':
  default:
    console.log(`Starting server (${process.env.NODE_ENV})`);
    const run = require('./lib/run');
    opts.mode = 'development';
    run(opts)
      .then(({server}) => {
        const {port, host} = server.options;
        const url = `http://${host}:${port}`;
        console.log('Server listening on', chalk.green(url), chalk.gray('(copied to clipboard)'));
        clipboard.write(url);
        if (opts.open) {
          openBrowser(url);
        }
      })
      .catch(handleError);
    break;
}

require('update-notifier')({
  pkg: require('./package.json')
}).notify();
