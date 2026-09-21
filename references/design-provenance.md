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

- Cinematic hero: original loader panels, progress, SplitText entrance, media scale, section handoff. Uses the exact P Wilms Pexels video and matching poster as its single visual (video 36244108). Light neutral colors change in integration CSS. The logo remains in the header, footer, and favicon.
- Navigation drawer: original markup and CSS; the six primary destinations replace labels.
- Stacked scroll panels: original DOM, CSS, and GSAP initializer; featured Company OS, Stored, Govern content and identity assets.
- NumberFlow: counts derived from the actual ecosystem, systems, and four focus areas.
- Gradient text reveal, arrow CTA button, Swup transitions, progressive blur, contact aura: supplied implementations retained.
- Research accordion: Google Doc `Web Animation Effects`, section 16, uses the supplied CSS and checkbox/label/answer structure.

The original sixteen P Wilms source files remain unchanged. The three additional Google Doc components retain their source implementations with automatic page bootstrapping replaced by named exports for route lifecycle support. Site integration supports cleanup on route changes, search/category filtering, and reduced motion.

## Content and assets

Recovered Admetos local source: `/Users/preston/Documents/Codex/2026-07-27/realtime-voice-chat-4/work/admetos`. Original files remain untouched. Its product/company/system wording informed the rebuild. The only reused image is `public/images/admetos-mark.png`, copied byte-for-byte to `public/brand/admetos-mark.png`. No old illustrative artwork is included.

Current ecosystem: Company OS, Stored, Govern, Cadre, Chippi, Scalar, TellMe, Operate, Marketer, Symbolic, Clusters. Product sources are recorded with each entry in `content/products.json`. Current public product identity assets came from those sites. Products without a verified downloadable mark use their written names.

Hades and Scorpio are described as foundational system work, without inventing public release claims. Existing newsroom articles were not recovered; editorial drafts remain unpublished.

## Additional supplied components and editorial correction

- Doc section 06: draggable card stack on Company; source keyboard/drag behavior plus explicit Previous/Next controls.
- Doc section 09: infinite card carousel on Home and Developers; source motion plus pause, focus pause, and reduced-motion fallback.
- Doc section 04: Keen parallax carousel on Research; source motion, keyboard interaction, and a skip link.
- Gradient reveal is exclusively the supplied text animation, now on inner-page titles as well as home.
- No cream palette or decorative emoji. The hero uses the original P Wilms video.

Inspected OpenAI's Introducing Codex, Introducing o3 and o4-mini, and Scaling storage for one billion users (part one) pages in addition to the index pages. Product visuals illustrate the actual tool; technical illustrations connect to the article subject; stories use people photography. The first generated abstract-gradient images were rejected and excluded from public assets and deployment.

Replacement editorial illustrations in public/editorial are newly generated conceptual diagrams: context (memory archive), authority (permission boundaries), execution (bounded work bays). They share white/black/cobalt architectural linework. They are not product screenshots or recovered brand assets. User acceptance of this replacement set has not been established.

## User reference correction: cinematic realism

The user rejected the diagram set and supplied six cinematic photographic references. Those diagrams are replaced by three generated photographic scenes: illuminated portals in a concrete hall; a suspended practical light above a field; an engineer working on a mechanical horse. All share cool dramatic light and realistic materials. Reference attachments informed the new images rather than being placed directly on the site.

Every inner page now has a full-width media hero, currently using these stills. `content/hero-media.json` accepts the user-supplied video URL when available; no new video was supplied in this turn. The original P Wilms video remains on the home hero. White content surfaces and the supplied gradient TEXT animation remain.

## Dark appearance and mark-only branding

Default appearance changed to dark throughout page, drawer, content, cards, filters, accordions, and motion component tokens. Header/footer use only the existing circularly clipped mark, with no adjacent Admetos wordmark. Original vendor files remain untouched.

The expanded eighteen-image batch was rejected by the user as an unwanted AI-generated direction before deployment. It is excluded from public assets. Imagery remains at the preceding deployed state pending clarification.
