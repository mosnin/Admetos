# P Wilms source restoration

Source: mosnin/pwilms at 31d5fbf02e74200b041a081683d5dd1439c14d46.
Destination: mosnin/Admetos, codex/admetos-pwilms.

The rejected rebuild preserved vendor components but replaced their surrounding composition. This restoration replaces the accumulated host overrides with the original `src/styles/site.css`, byte-for-byte. All original vendor files are unchanged. The runtime comes from the same source, with only accordion/style imports and reduced-motion handling added.

Mapping:
- Home: original cinematic hero + one home-intro + original compact footer.
- Company and product/system details: original story-section two-column composition.
- Products: original ventures introduction and stacked product panels, followed by a source writing-destinations directory for all 11 products.
- Research, Developers, News: original editorial-page/writing-destinations composition. Research retains the supplied Google Doc accordion.
- Contact, Careers, Investors: original contact-page/contact-columns composition.
- Legacy aliases retain their destinations.

Admetos-specific CSS is isolated in src/styles/admetos.css: circular brand mark (as requested), content lists, directory/accordion integration and reduced-motion fallback. No replacement header, mega-footer, photographic inner-page heroes, card grids, or infinite carousels remain in the generated pages. Existing generated photographs remain available and appear in the original venture-panel media slots; no new images were generated.

Checks: source/vendor byte comparison; production build of all 27 routes; local link/image/style reference validation; desktop source/target hero comparison in Chrome; rendered Products and Company at 390px. Navigation from homepage to Products retained styling. Browser console warnings inspected were from the installed MetaMask extension.

The original files under references/pwilms-layout are build inputs, not deployed routes. Source repository remains untouched. User visual acceptance is separate from these checks.
