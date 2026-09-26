# Saurabh Pandey — Portfolio

A responsive portfolio built with React and Vite. Content is organized into reusable sections and data files.

## Overview

The portfolio includes About, Skills, Projects, GitHub, coding activity, and Contact sections. Project data lives in `src/data/content.js`; add verified work there when ready.

## Stack

- React
- Vite
- JavaScript
- CSS

## Project structure

- `src/components/` — shared interface components
- `src/sections/` — page sections
- `src/data/` — portfolio content
- `src/assets/` — local images and other assets

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Deployment

The project is deployed on GitHub Pages with GitHub Actions. To publish live WakaTime activity, add a repository Actions secret named `WAKATIME_API_KEY` under **Settings → Secrets and variables → Actions**. The build reads that secret on the server and writes only the resulting summaries to `dist/wakatime.json`; the API key is never included in the site bundle. The scheduled workflow refreshes the published summary hourly. If the secret is missing or WakaTime is unavailable, the site displays a small fallback state.
