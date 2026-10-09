# NEXORA Studio Portfolio

A polished, responsive portfolio website built with **plain HTML, CSS, and JavaScript**. No React, Node.js, build step, database, CSS framework, or package installation is required.

## Files

- `index.html` — page content and semantic structure
- `style.css` — visual system, responsive layouts, and animations
- `script.js` — mobile navigation, scroll effects, project filters, project details modal, and WhatsApp contact form

## Run locally

Open `index.html` in a modern browser. For best results, serve the folder through any simple static server, but there is no build step.

## Publish with GitHub Pages

1. Create a GitHub repository (for example, `nexora-portfolio`).
2. Upload `index.html`, `style.css`, `script.js`, and this README to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site and open the URL shown in the Pages settings.

## Included interactions

- Responsive desktop and mobile navigation
- Scroll-progress indicator and back-to-top control
- Viewport reveal animations and subtle pointer effects
- Filterable project cards and accessible project-details modal
- Contact form that prepares a message in WhatsApp (it does not send or store form data itself)
- Copy-to-clipboard action for the WhatsApp number
- Reduced-motion support and keyboard-friendly controls

## Update before publishing

- Confirm the displayed name and brand identity are what you want to use.
- Replace project summaries, images, and demo links with the latest public versions of your work.
- The GigUp card links to `https://giguphq.com`; the other project cards open their local case-study summaries until you add public demo links.
- Stock photography loads from the Unsplash image CDN, and the fonts load from Google Fonts, so those visuals/fonts require an internet connection. The page layout, CSS effects, icons, and interactions are local.
- The Unsplash license allows photos to be used for free in personal and commercial projects, though contributor attribution is appreciated. Review the current license at <https://unsplash.com/license>.

## Contact configuration

The WhatsApp number is configured in `script.js` and repeated in the direct contact links in `index.html`. If the number changes, update both places. The contact form opens WhatsApp with a pre-filled message; it does not use a backend, email service, or database.
