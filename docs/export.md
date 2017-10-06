# Export to SPA without Server-Side-Rendering

Just enter:

```bash
npm run export
```

Your application was exported in `dist` folder.

To get a full deployable (with an integrated SPA enabled HTTP server and package.json) just enter:

```bash
npm run export:package
```

Run a fterwards with:

```bash
cd dist
npm run dev
```