# Design and content provenance

## User direction

Use P Wilms aesthetics and supplied components, with a light palette. Use OpenAI for AI lab information architecture. Retain the existing Admetos logo. Recover context and wording from the old Admetos local site; do not reuse its illustrations, artwork, or other imagery.

## OpenAI research, 2026-09-21

Inspected the live homepage, research index, research overview, and news index in the visible browser before implementation continued.

- https://openai.com/ — primary destinations for research, products, developers, company; homepage links into featured work, news, and research; footer groups destinations by purpose.
- https://openai.com/research/ — overview explains purpose, then focus areas and links to detailed work.
- https://openai.com/research/index/ — categorized research entries linking to individual articles.
- https://openai.com/news/ — category navigation, dated entries, individual articles, RSS.

Applied these relationships to Admetos: Research, Products, Developers, News, Company. The visual and motion source remains P Wilms, not OpenAI artwork. No OpenAI claims or content are copied.

## Component mapping

P Wilms source: `../reference/pwilms`, source commit `31d5fbf02e74200b041a081683d5dd1439c14d46`.

- Cinematic hero: original loader panels, progress, SplitText entrance, media scale, section handoff. Uses the existing Admetos logo as its single visual. Light colors change in integration CSS.
- Navigation drawer: original markup and CSS; the six primary destinations replace labels.
- Stacked scroll panels: original DOM, CSS, and GSAP initializer; featured Company OS, Stored, Govern content and identity assets.
- NumberFlow: counts derived from the actual ecosystem, systems, and four focus areas.
- Gradient text reveal, arrow CTA button, Swup transitions, progressive blur, contact aura: supplied implementations retained.
- Research accordion: Google Doc `Web Animation Effects`, section 16, uses the supplied CSS and checkbox/label/answer structure.

All source implementations in `src/vendor` remain unchanged. Site integration supports cleanup on route changes, search/category filtering, and reduced motion.

## Content and assets

Recovered Admetos local source: `/Users/preston/Documents/Codex/2026-07-27/realtime-voice-chat-4/work/admetos`. Original files remain untouched. Its product/company/system wording informed the rebuild. The only reused image is `public/images/admetos-mark.png`, copied byte-for-byte to `public/brand/admetos-mark.png`. No old illustrative artwork is included.

Current ecosystem: Company OS, Stored, Govern, Cadre, Chippi, Scalar, TellMe, Operate, Marketer, Symbolic, Clusters. Product sources are recorded with each entry in `content/products.json`. Current public product identity assets came from those sites. Products without a verified downloadable mark use their written names.

Hades and Scorpio are described as foundational system work, without inventing public release claims. Existing newsroom articles were not recovered; editorial drafts remain unpublished.
