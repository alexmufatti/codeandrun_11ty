# AI Coding Instructions for Code and Run Blog

## Project Overview

This is an **Eleventy v3** static site generator blog for "Code and Run" - a bilingual (Italian primary, English secondary) blog combining software development and running content. The site uses modern zero-JavaScript output with performance-focused features.

## Architecture & Key Patterns

### Content Structure

- **Dual content types**: `content/posts/` (tech blog posts) and `content/activities/` (running training logs)
- **Unified collections**: Both post types merge into `postsAndActivities` collection for feeds
- **Date-based routing**: Activities use `YYYY-MM-DD-description/` folder structure with `index.md`
- **Layout inheritance**: All content uses `layouts/post.njk` → `layouts/base.njk` chain

### Custom Shortcodes (Essential for Content)

```javascript
// Core running-specific shortcodes in eleventy.config.js
{% strava { id:'123', embedId:'abc123' } %}           // Embed Strava activities
{% figure { src:'image.jpg', title:'Caption' } %}     // Responsive figures
{% youtube { id:'videoId', title:'Title' } %}         // YouTube embeds
```

### Italian-First Internationalization

- **Metadata**: Site language set to "it" in `_data/metadata.js`
- **Date formatting**: Uses Luxon with Italian locale patterns (`dd LLLL yyyy`)
- **Social links**: Extensive social media integration including Strava, Mastodon, BlueSky
- **Content**: Mix of Italian running logs and English tech posts

## Development Workflow

### Essential Commands

```bash
npm start                    # Development server with live reload
npm run build               # Production build (quiet mode)
npm run build:prod          # Production build with ELEVENTY_ENV=production
npm run debug               # Debug mode with Eleventy internals
```

### Image Optimization Pipeline

- **Automatic processing**: `eleventy-img` transforms to AVIF, WebP, auto formats
- **Co-location**: Images live alongside content in same directories
- **Lazy loading**: Built-in with `loading="lazy"` and `decoding="async"`
- **Watch targets**: Images trigger rebuilds via `addWatchTarget()`

### Draft Content System

- **Front matter**: `draft: true` in any content
- **Environment-aware**: Drafts only appear in `--serve`/`--watch` mode
- **Schema validation**: Zod validates draft boolean in `_data/eleventyDataSchema.js`

## Critical File Patterns

### Activity Content Structure

```markdown
---
title: Settimana 38-39
tags: [Sport, Running]
date: 2025-09-15 19:51:11
trainingTypes: [🟢, 🔴, 🟢] # Color coding for training intensity
trainingFeelings: [😭, 😀, 🙂] # Emoji mood tracking
feature_image: IMG_5591_feature.jpg
---

Content with <!--more--> excerpt marker
```

### Data Cascade Configuration

- **Content directory**: `content/` (not root)
- **Relative includes**: `_includes` is `../` relative to content
- **Shared data**: Global data in `_data/metadata.js` and filters in `_config/filters.js`

### CSS Bundle Strategy

- **Inline critical CSS**: Colors and index styles inlined in `<head>`
- **Per-page bundles**: Via `eleventy-plugin-bundle` with CSS/JS extraction
- **Watch targets**: CSS changes trigger rebuilds

## Content Creation Guidelines

### Running Activities

- Use `YYYY-MM-DD-title/index.md` structure in `content/activities/`
- Include Strava embeds with `{% strava %}` shortcode
- Add activity maps and photos with `{% figure %}` shortcode
- Use emoji arrays for `trainingTypes` and `trainingFeelings`

### Blog Posts

- Traditional blog structure in `content/posts/YYYY-MM-DD-title/index.md`
- Can include code blocks (syntax highlighting via Prism)
- Support for both Italian and English content

### Navigation & SEO

- **Auto-navigation**: Uses `eleventyNavigation` plugin for header nav
- **Conditional header**: Blue header with avatar only shows on non-post/activity pages
- **Feed generation**: Atom feed combines both content types, limited to 10 items
- **Social meta**: Open Graph image and description from metadata

## Performance Optimizations

- **Zero-JavaScript output**: All interactivity server-rendered
- **Image optimization**: Automatic format conversion and responsive markup
- **CSS bundles**: Minified and extracted for production
- **Lighthouse-optimized**: Targets 400 Lighthouse score

## Deployment

- **Netlify**: Primary deployment via `netlify.toml` (build command: `npm run build`)
- **Vercel**: Alternative deployment with trailing slash config
- **GitHub Pages**: Sample workflow available but not active

When working with this codebase, prioritize the dual content model, maintain Italian language patterns, and leverage the extensive shortcode system for rich content presentation.
