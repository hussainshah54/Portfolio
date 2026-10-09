# NEXORA Studio — Portfolio Website

A responsive portfolio built with **HTML5, CSS, and vanilla JavaScript only**. It has no build step, package installation, backend, database, or local server requirement.

## Files

- `index.html` — semantic site structure, metadata, interface mockups, concept cards, contact form, and project dialog.
- `style.css` — visual system, responsive layouts, concept previews, focus states, and reduced-motion support.
- `script.js` — mobile navigation, project filters, concept-detail dialog, current year, reveal transitions, and client-side WhatsApp message preparation.

## Preview locally

1. Download or clone the repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` directly in a modern browser. No local server is required.

## Publish with GitHub Pages

1. Upload these files to the repository's publishing branch (commonly `main`) and keep `index.html` at the repository root.
2. Open the repository on GitHub and go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the branch and `/ (root)` folder, then save.
4. Wait for GitHub Pages to finish publishing and open the site URL shown in the Pages settings.

All local asset references are relative (`./style.css` and `./script.js`), so the site also works from a repository subpath.

## External dependency

The site optionally loads **Space Grotesk** and **DM Sans** from Google Fonts. If the fonts cannot load, local system-font fallbacks are defined in the CSS. No external images are required; the portfolio previews are composed from HTML, CSS, and a small inline SVG chart.

## Project content note

Pulse, Forma, Orbit, and Northstar are clearly identified as illustrative concepts / UI explorations. They are not represented as completed client projects, and their detail views are local explanatory notes rather than fake case-study links.

## Contact form behavior

The form validates its fields in the browser and opens WhatsApp with a URL-encoded draft addressed to `+92349 9019790`. It does not submit to a server, automatically send the message, or store form data. The visitor reviews and sends the draft inside WhatsApp. The direct WhatsApp CTA is also available independently of the form.

## Accessibility and responsive behavior

- Semantic landmarks, one H1, skip link, descriptive labels, and visible keyboard focus.
- Mobile navigation supports keyboard focus, Escape-to-close, and closes after a destination is chosen.
- Project filters update the visible cards and announce the result count.
- The concept dialog can close through its close button, Escape, or backdrop click.
- Reduced-motion preferences are respected, and content remains visible when reveal observation is unavailable.
- Layout breakpoints cover narrow phones through desktop widths.
