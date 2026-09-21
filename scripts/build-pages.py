from pathlib import Path
import re, html
root=Path(__file__).resolve().parents[1]
socials=[('Email','mailto:hello@admetoslabs.com'),('Jefe Prompt','https://jefeprompt.com'),('Glorb','https://glorbai.com')]
def social_html():
 return ''.join(f'<a href="{u}" target="_blank" rel="noopener noreferrer"><span>{n}</span></a>' for n,u in socials)
def button(label,href,external=False):
 extra=' target="_blank" rel="noopener noreferrer"' if external else ''
 return f'<a class="button-05" href="{href}"{extra}><span class="glass" aria-hidden="true"></span><span class="content"><span class="copy">{label}</span></span></a>'
nav=(root/'references/drawer-markup.html').read_text()
nav=nav[:nav.index('  <div class="page">')]
nav=nav.replace('<p class="eyebrow">Navigation</p>','<p class="eyebrow">Admetos Labs</p>')
labels=[('Home','/'),('Mission','/mission/'),('Projects','/projects/'),('Lab','/lab/'),('Contact','/contact/')]
nav=nav.replace('</ul>', '<li><a href=""><span><!-- Page label --></span></a></li></ul>', 1)
for label,url in labels:
 nav=nav.replace('<li><a href=""><span><!-- Page label --></span></a></li>',f'<li><a href="{url}"><span>{label}</span></a></li>',1)
nav=re.sub(r'<div class="socials">.*?</div>',f'<div class="socials">{social_html()}</div>',nav,flags=re.S)
blur=(root/'references/blur-markup.html').read_text()
aura='<div class="contact-aura" data-aura-border data-dither-src="https://www.details.so/vault-previews/aurora-glow/_astro/dither.DYfTq7JB.png" data-state="off" data-palette="spectrum" aria-hidden="true"><canvas data-aura-canvas aria-hidden="true"></canvas><span data-aura-origin></span></div>'
footer='<footer class="site-footer content-width"><span>© 2026 Admetos Labs</span><a href="#top">Back to top</a></footer>'
brand='<a class="site-brand" href="/" aria-label="Admetos Labs home"><span class="admetos-wordmark">admetos<span>LABS</span></span></a>'
def shell(title,description,path,body):
 return f'''<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><title>{title}</title><meta name="description" content="{description}"><link rel="canonical" href="https://admetos.org{path}"><meta property="og:title" content="{title}"><meta property="og:description" content="{description}"><meta property="og:type" content="website"><meta property="og:url" content="https://admetos.org{path}"><meta property="og:image" content="https://admetos.org/admetos-glass.png"><meta property="og:image:width" content="1734"><meta property="og:image:height" content="907"><meta property="og:image:type" content="image/png"><meta property="og:image:alt" content="Admetos mark in glass"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://admetos.org/admetos-glass.png"><meta name="twitter:image:alt" content="Admetos mark in glass"><link rel="icon" href="/favicon.svg"><script type="module" src="/src/main.js"></script></head>
<body id="top"><a class="skip-link" href="#swup">Skip to content</a>{nav}
{brand}<div class="page"><div class="page-content"><main class="transition-fade" id="swup">{body}{footer}</main></div>{blur}<button class="cover" type="button" tabindex="-1" aria-label="Close navigation"></button></div></div>{aura}<noscript><style>.hero-section-01 .loader{{display:none}}[data-reveal-06]{{color:#f5f5f5;-webkit-text-fill-color:#f5f5f5;background:none}}[data-drawer-navigation] .toggle{{display:none}}</style><p class="noscript-nav"><a href="/">Home</a> <a href="/contact/">Contact</a></p></noscript></body></html>'''
metrics=''.join(f'<div class="metric"><dt><span class="stat-fallback">{label}</span><span class="nf nf-stat" data-number-flow-stat data-start="0" data-value="{value}" data-suffix="{suffix}" aria-label="{label}"><number-flow class="nf-number" data-stat-number></number-flow></span></dt><dd>{caption}</dd></div>' for value,suffix,label,caption in [(3,'','3','Projects in the ecosystem'),(4,'','4','Research disciplines'),(1,'','1','Shared mission')])
story=f'''<section class="story-section content-width" id="story"><div><p class="section-label">Our mission</p><h2>Intelligence.<br><span data-reveal-06 data-resting-color="#f5f5f5">In practice.</span></h2><dl class="metrics">{metrics}</dl></div><div class="story-copy"><p class="lead">Advancing artificial intelligence through research and practical applications.</p><p>We believe the future lies at the intersection of artificial intelligence and decentralized technologies. Our mission is to build the tools, systems, and knowledge that will guide humanity through this transformation.</p><p>Through research, practical applications, and collaborative innovation, we’re building toward a future where artificial intelligence and human intelligence work together.</p><p>From prompt engineering to agentic frameworks, our work explores how intelligent systems can expand what people do.</p><p class="lead">Building tomorrow, today.</p></div></section>'''

stack=(root/'references/stacked-markup.html').read_text()
stack=stack.replace('<main class="stacked-scroll-preview" data-theme="light">','<div class="stacked-scroll-preview" data-theme="dark" id="work">').replace('</main>','</div>')
stack=stack.replace('aria-label="Product features"','aria-label="Admetos projects"').replace('<p class="section-cue">Scroll down</p>','<p class="section-cue">What we’re building.</p>')
projects=[('Jefe Prompt','Prompt engineering','A tool that helps users craft AI prompts for better results. Fast, free, and designed for everyone.','https://jefeprompt.com','Explore Jefe Prompt'),('Glorb','Agentic systems','Our first iteration on an agentic framework and context engine designed to run and automate complex business operations.','https://glorbai.com','Explore Glorb'),('Glorb GPTs','Applied intelligence','A collection of professional prompts and AI agents on the ChatGPT marketplace.','https://gpts.glorbai.com','Explore Glorb GPTs')]
idx=0
def panel(m):
 global idx
 name,subtitle,copy,url,cta=projects[idx];idx+=1
 b=m.group(0)
 b=re.sub(r'<h2>.*?</h2>',f'<h2><span>{name}</span></h2><p class="project-category">{subtitle}</p>',b,flags=re.S)
 b=re.sub(r'(<div class="stacked-scroll-panel__description">)\s*<p>.*?</p>',lambda _:f'{_.group(1)}<p>{copy}</p>{button(cta,url,url.startswith("https"))}',b,flags=re.S)
 return b
stack=re.sub(r'<article class="stacked-scroll-panel">.*?</article>',panel,stack,flags=re.S)
stack=re.sub(r'<section class="next-section">.*?</section>','',stack,flags=re.S)
# Keep all three source panels and use the established Admetos glass asset.
stack=re.sub(r'(<img\s+class="stacked-scroll-panel__image"\s+src=")[^"]+',lambda m:m.group(1)+'/admetos-glass.png',stack)
stack=re.sub(r'alt="[^"]*"', 'alt="Admetos glass mark"', stack)

hero=(root/'references/hero-markup.html').read_text()
hero=hero.replace('https://www.details.so/vault-previews/section-04/media/video-mobile.mp4','https://videos.pexels.com/video-files/36244108/15370421_2560_1440_30fps.mp4').replace('https://www.details.so/vault-previews/section-04/media/video.mp4','https://videos.pexels.com/video-files/36244108/15370421_2560_1440_30fps.mp4')
hero=re.sub(r'<source\s+[^>]*>', '', hero)
hero=hero.replace('</video>', '<source src="https://videos.pexels.com/video-files/36244108/15370421_2560_1440_30fps.mp4" type="video/mp4"></video>')
hero=hero.replace('https://www.details.so/vault-previews/section-04/media/poster.webp','https://images.pexels.com/videos/36244108/pexels-photo-36244108.jpeg?auto=compress&amp;w=1260&amp;h=750&amp;dpr=1')
hero=hero.replace('<main class="hero-page">','<div class="hero-page">').replace('</main>','</div>')
hero=re.sub(r'<header>.*?</header>','',hero,flags=re.S)
hero=re.sub(r'<div class="item">\s*<img.*?</div>', '', hero, flags=re.S)
hero=re.sub(r'<span class="divider"[^>]*></span>', '', hero)
# Hidden single-item hook preserves the supplied hero lifecycle without a media selector.
hero=re.sub(r'<div class="thumbs".*?</div>', '<div class="thumbs" hidden inert aria-hidden="true"><button type="button" tabindex="-1" aria-label="Background video"></button></div>', hero, flags=re.S)

hero=hero.replace('Give your story an unforgettable entrance','Building <br><span data-hero-gradient>tomorrow.<br>Today.</span>')
hero=re.sub(r'(<div class="content">\s*).*?(<h1>)',r'\1\2',hero,flags=re.S)
hero=re.sub(r'(<div class="content">.*?<h1>.*?</h1>)\s*<p>.*?</p>',r'\1<p>Admetos Labs. AI research &amp; development. <span>Intelligent systems. Practical innovation.</span></p>',hero,flags=re.S)
home_intro=f'''<section class="home-intro content-width"><p class="section-label">AI research laboratory</p><h2>Human ambition.<br><span data-reveal-06 data-resting-color="#f5f5f5">Machine intelligence.</span></h2><div class="home-summary"><p class="lead">We build tools, systems, and knowledge at the intersection of artificial intelligence and decentralized technologies.</p><div class="cta-row">{button('Our mission','/mission/')}{button('Explore our projects','/projects/')}{button('Inside the lab','/lab/')}</div></div></section>'''

hero=hero.replace('<!-- Existing or new next-section content -->',home_intro)
(root/'index.html').write_text(shell('Admetos Labs | AI Research &amp; Development','AI research and development. Intelligent systems and practical innovation.','/',hero))
contact=f'''<section class="contact-page content-width"><p class="section-label">Collaborate</p><h1>Let’s build<br><span data-reveal-06 data-resting-color="#f5f5f5">what comes next.</span></h1><div class="contact-columns"><div><p class="lead">Have something worth exploring?</p><p>For research, collaborations, and conversations about intelligent systems, get in touch with Admetos Labs.</p><div class="cta-row">{button('hello@admetoslabs.com','mailto:hello@admetoslabs.com')}</div></div><div><p class="lead">From ideas to applications.</p><p>Explore our work in prompt engineering, agentic frameworks, and human–computer interaction.</p>{button('Explore our projects','/projects/')}</div></div><div class="social-row">{social_html()}</div></section>'''

(root/'contact/index.html').write_text(shell('Contact Admetos Labs','Connect with Admetos Labs about research, intelligent systems, and collaboration.','/contact/',contact))
story=story.replace('<h2>', '<h1>', 1).replace('</h2>', '</h1>', 1)
ventures_intro='<header class="page-intro content-width"><p class="section-label">Projects</p><h1>What we’re<br><span data-reveal-06 data-resting-color="#f5f5f5">building.</span></h1><p class="lead">Tools and platforms exploring how we interact with artificial intelligence.</p></header>'
stack=re.sub(r'<div class="scroll-cue">.*?</div>', '', stack, flags=re.S)
areas=[('Neural architecture','Advanced AI system design and optimization.'),('Prompt engineering','Optimized AI interactions and response quality.'),('Agent systems','Autonomous AI workflows and multi-agent coordination.'),('Web3 integration','Decentralized AI and blockchain convergence.')]
research='<section class="accordion" aria-labelledby="accordion-title"><h2 id="accordion-title" class="sr-only">Research disciplines</h2>'+''.join(f'<article class="item"><input class="toggle" type="checkbox" id="research-{i}"/><label class="question" for="research-{i}"><span>{title}</span><span class="icon" aria-hidden="true"><span class="icon-mark"></span></span></label><div class="answer"><div class="answer-inner"><p>{copy}</p></div></div></article>' for i,(title,copy) in enumerate(areas))+'</section>'

writing_page=f'''<section class="editorial-page content-width"><p class="section-label">The lab</p><h1>Ideas into<br><span data-reveal-06 data-resting-color="#f5f5f5">intelligence.</span></h1><p class="lead">Our lab combines theoretical research with practical applications, exploring artificial intelligence and human–computer interaction.</p><div class="research-disciplines">{research}</div><div class="cta-row">{button('Collaborate with us','/contact/')}</div></section>'''

for slug,title,description,body in [
 ('mission','Mission | Admetos Labs','The mission behind Admetos Labs.',story+'<section class="page-next content-width">'+button('Explore our projects','/projects/')+'</section>'),
 ('projects','Projects | Admetos Labs','Jefe Prompt, Glorb, and Glorb GPTs.',ventures_intro+stack),
 ('lab','Lab | Admetos Labs','Research disciplines at Admetos Labs.',writing_page)]:
 (root/slug).mkdir(exist_ok=True)
 (root/slug/'index.html').write_text(shell(title,description,f'/{slug}/',body))
print('Generated Home, Mission, Projects, Lab, and Contact pages.')
