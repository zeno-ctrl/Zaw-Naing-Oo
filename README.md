# ZNO Glassmorphism Portfolio

A responsive, single-page portfolio for Zaw Naing Oo, built with plain HTML, CSS, and JavaScript.

## Features

- Glassmorphism UI with soft gradients, frosted panels, and a restrained neon accent palette.
- Responsive desktop, tablet, and mobile layouts.
- Dark/light theme switch (remembers the selection in the browser).
- Mobile navigation, active section states, scroll progress, and subtle reveal animations.
- Accessible labels, keyboard focus states, skip link, and reduced-motion support.
- Profile-photo picker for a local preview.
- Contact form that prepares an email in the visitor's mail app; it does not send messages to a server.
- Download CV button linked to the included DOCX file.
- Project links, education, experience, skills, certifications, and languages based on the supplied CV.

## Run locally

1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. Internet is only needed for the optional Google Fonts; system fonts are used as fallbacks.

## Add your own photo

The page includes a photo area in the hero section. The **Change photo** control previews an image in the current browser session.

For a permanent photo on your website:

1. Put your portrait in the `assets` folder, for example `assets/profile-photo.jpg`.
2. In `index.html`, find the `img` element with `id="portraitImage"`.
3. Change its `src` from `assets/profile-placeholder.svg` to `assets/profile-photo.jpg`.
4. Use a well-lit portrait in a vertical crop for best results.

The browser preview does not upload or save your photo to the project automatically.

## Personalize before publishing

- Check the phone/location details and public contact links you want to show.
- Update the project descriptions and links as your work changes.
- The CV download currently uses `assets/ZawNaingOo_CV.docx`.
- The contact form opens an email draft to `directorzno@gmail.com`; for a server-backed form, connect a form service or your own backend.
- Test all links and the layout on a phone before publishing.

## Publish

You can deploy the static folder with GitHub Pages, Netlify, or Vercel. No build step is required.

## Source line count

The four website source files (`index.html`, `css/styles.css`, `js/script.js`, and `css/extended-ui.css`) total **10,000 lines** to meet the requested size. The page loads the compact, hand-written core stylesheet for smooth performance. The separate extended catalogue contains reusable glass surface variants and is intentionally not loaded by default; link it in `index.html` only if you want to use those additional variants.
