"""Admetos content in the original P Wilms page compositions."""
from pathlib import Path
import html,json,re
R=Path(__file__).resolve().parents[1]
e=lambda v:html.escape(str(v),quote=True)
products=json.loads((R/'content/products.json').read_text())
systems=json.loads((R/'content/systems.json').read_text())
source=(R/'references/pwilms-layout/home.html').read_text()
source_main=re.search(r'<main class="transition-fade" id="swup">(.*?)</main>',source,re.S).group(1)
hero=source_main.split('<footer class="site-footer')[0]
hero=hero.replace('Building the <br><span data-hero-gradient>agentic AI <br>frontier.</span>','Building the <br><span data-hero-gradient>intelligent <br>future.</span>')
hero=hero.replace('I’m Preston Wilms. Entrepreneur, builder, and author. <span>Admetos. Fortitudo. Independent ventures.</span>','Admetos. AI research &amp; development. <span>Independent products. Shared ambition.</span>')
def button(label,url):
 return f'<a class="button-05" href="{e(url)}"><span class="glass" aria-hidden="true"></span><span class="content"><span class="copy">{e(label)}</span></span></a>'
def reveal(text):return f'<span data-reveal-06 data-resting-color="#f5f5f5">{text}</span>'
def intro(label,title,description):
 return f'<header class="page-intro content-width"><p class="section-label">{label}</p><h1>{title}</h1><p class="lead">{description}</p></header>'
nav=[('Home','/'),('Company','/company/'),('Products','/products/'),('Research','/research/'),('Contact','/contact/')]
secondary=[('Developers','/developers/'),('News','/news/'),('Careers','/careers/'),('Investors','/investors/')]
links=lambda items:''.join(f'<a href="{u}"><span>{n}</span></a>' for n,u in items)
shell=re.sub(r'<main class="transition-fade" id="swup">.*?</main>','<main class="transition-fade" id="swup">__BODY__</main>',source,flags=re.S)
shell=re.sub(r'<head>.*?</head>','__HEAD__',shell,flags=re.S)
shell=re.sub(r'<ul class="links">.*?</ul>','<ul class="links">'+''.join(f'<li><a href="{u}"><span>{n}</span></a></li>' for n,u in nav)+'</ul>',shell,flags=re.S)
shell=re.sub(r'<div class="socials">.*?</div>','<div class="socials">'+links(secondary)+'</div>',shell,flags=re.S)
shell=shell.replace('<p class="eyebrow">Preston Wilms</p>','<p class="eyebrow">Admetos</p>')
shell=re.sub(r'<a class="site-brand".*?</a>','<a class="site-brand admetos-brand" href="/" aria-label="Admetos home"><img src="/brand/admetos-mark.png" width="40" height="40" alt="Admetos"></a>',shell,flags=re.S)
routes=[]
bodies={}
def write(path,title,desc,body):
 target=R/(path.strip('/')+'/index.html' if path!='/' else 'index.html');target.parent.mkdir(parents=True,exist_ok=True)
 head=f'<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><title>{e(title)} | Admetos</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="https://admetos.org{path}"><link rel="icon" href="/brand/admetos-mark.png"><link rel="alternate" type="application/rss+xml" title="Admetos News" href="/feed.xml"><script type="module" src="/src/main.js"></script></head>'
 footer='<footer class="site-footer content-width"><span>© 2026 Admetos</span><a href="#top">Back to top</a></footer>'
 target.write_text('\n'.join(line.rstrip() for line in shell.replace('__HEAD__',head).replace('__BODY__',body+footer).splitlines())+'\n');routes.append(str(target.relative_to(R)));bodies[path]=(title,desc,body)
summary=f'<section class="home-intro content-width"><p class="section-label">Admetos</p><h2>Human ambition.<br>Machine {reveal("intelligence.")}</h2><div class="home-summary"><p class="lead">We build focused technology companies for people, AI agents, and the businesses they run together.</p><div class="cta-row">{button("Our company","/company/")}{button("Explore our products","/products/")}{button("Inside the lab","/research/")}</div></div></section>'
hero=re.sub(r'<section class="home-intro content-width">.*?</section>',lambda m:summary,hero,flags=re.S)
write('/','Research & Products','Independent research and focused software products for people and AI agents.',hero)
metrics=''.join(f'<div class="metric"><dt><span class="stat-fallback">{v}</span><span class="nf nf-stat" data-number-flow-stat data-start="0" data-value="{v}" aria-label="{v}"><number-flow class="nf-number" data-stat-number></number-flow></span></dt><dd>{label}</dd></div>' for v,label in [(len(products),'Products in the ecosystem'),(len(systems),'Foundational systems'),(4,'Areas of research')])
company=f'<section class="story-section content-width"><div><p class="section-label">Our company</p><h1>Built for<br>{reveal("what’s next.")}</h1><dl class="metrics">{metrics}</dl></div><div class="story-copy"><p class="lead">Admetos builds and operates focused technology companies for AI agents, the people who direct them, and the businesses that rely on them.</p><p>A capable model is only the beginning. Agents need memory, permissions, reliable execution, and a way to coordinate work over time. We build the products around those needs.</p><p>Each product begins with a clear customer need and keeps its own purpose and customers. Admetos provides shared engineering, operating support, and direction.</p><p class="lead">Independent products. A shared ambition to expand what people and intelligent systems can do.</p></div></section><section class="page-next content-width">{button("Explore our products","/products/")}</section>'
write('/company/','Company','The purpose and operating model behind Admetos.',company)
# Preserve the source venture panel geometry and interactions, with Admetos products.
venture=(R/'references/pwilms-layout/ventures.html').read_text()
panel_template=re.search(r'<article class="stacked-scroll-panel">.*?</article>',venture,re.S).group()
def panel(p):
 b=re.sub(r'<h2>.*?</h2>',f'<h2><span>{e(p["name"])}</span></h2>',panel_template,flags=re.S)
 b=re.sub(r'<p class="project-category">.*?</p>',f'<p class="project-category">{e(p["category"])}</p>',b,flags=re.S)
 b=re.sub(r'(<div class="stacked-scroll-panel__description">).*?</div>',lambda m:m[1]+f'<p>{e(p["description"])}</p>'+button('Explore '+p['name'],'/products/'+p['slug']+'/')+'</div>',b,flags=re.S)
 b=re.sub(r'src="/admetos-glass.png"',f'src="/editorial/{p.get("visual","scene-1")}.jpg"',b)
 return b
featured=products[:3]
product_body=intro('Products','What we’re<br>'+reveal('building.'),'Independent products. A shared ambition to expand what people and intelligent systems can do.')+'<div class="stacked-scroll-preview" data-theme="dark" id="work"><section class="stacked-scroll-panels" data-stacked-scroll-panels aria-label="Featured products">'+''.join(panel(p) for p in featured)+'</section></div>'
product_body+='<section class="editorial-page content-width product-directory"><p class="section-label">The ecosystem</p><h2>Find your<br>'+reveal('starting point.')+'</h2><div class="writing-destinations">'+''.join(f'<article><p class="section-label">{e(p["category"])}</p><h2>{e(p["name"])}</h2><p>{e(p["tagline"])}</p>{button("Explore "+p["name"],"/products/"+p["slug"]+"/")}</article>' for p in products)+'</div></section>'
write('/products/','Products','Explore the Admetos ecosystem.',product_body)
for p in products:
 body=f'<section class="story-section content-width"><div><p class="section-label">{e(p["category"])}</p><h1>{reveal(e(p["name"]))}</h1></div><div class="story-copy"><p class="lead">{e(p["tagline"])}</p><p>{e(p["description"])}</p><div class="capability-list">'+''.join(f'<p>{e(c)}</p>' for c in p['capabilities'])+f'</div><div class="cta-row">{button("Visit "+p["name"],p["url"])}</div></div></section><section class="page-next content-width">{button("All products","/products/")}</section>'
 write('/products/'+p['slug']+'/',p['name'],p['description'],body)
focus=[('Context','Make knowledge available across tools and sessions.'),('Authority','Define what an agent can do, and keep a record of its actions.'),('Execution','Give agents a reliable place to use tools and complete work.'),('Coordination','Carry goals and state across teams, products, and time.')]
research='<section class="editorial-page content-width"><p class="section-label">Research</p><h1>Intelligence<br>'+reveal('in context.')+'</h1><p class="lead">We study the foundations that turn intelligence into dependable work: memory, authority, execution, and coordination.</p><div class="writing-destinations">'+''.join(f'<article><p class="section-label">{e(s["role"])}</p><h2>{e(s["name"])}</h2><p>{e(s["description"])}</p>{button("Explore "+s["name"],"/research/"+s["slug"]+"/")}</article>' for s in systems)+'</div><div class="research-focus"><h2>Areas of focus.</h2><div class="accordion">'+''.join(f'<article class="item"><input class="toggle" type="checkbox" id="focus-{i}"><label class="question" for="focus-{i}"><span>{n}</span><span class="icon" aria-hidden="true"><span class="icon-mark"></span></span></label><div class="answer"><div class="answer-inner"><p>{d}</p></div></div></article>' for i,(n,d) in enumerate(focus))+'</div></div></section>'
write('/research/','Research','Context, authority, execution, and coordination for AI agents.',research)
for s in systems:
 body=f'<section class="story-section content-width"><div><p class="section-label">{e(s["role"])}</p><h1>{reveal(e(s["name"]))}</h1></div><div class="story-copy"><p class="lead">{e(s["description"])}</p>'+''.join(f'<p>{e(c)}</p>' for c in s['capabilities'])+'<p>This describes our research direction, not a public product release.</p><div class="cta-row">'+button('Research inquiries','mailto:hello@admetos.org?subject=Research%20inquiry')+'</div></div></section>'
 write('/research/'+s['slug']+'/',s['name'],s['description'],body)
def editorial(label,title,lead,items):
 return f'<section class="editorial-page content-width"><p class="section-label">{label}</p><h1>{title}</h1><p class="lead">{lead}</p><div class="writing-destinations">'+''.join(f'<article><p class="section-label">{e(tag)}</p><h2>{e(name)}</h2><p>{e(copy)}</p>{button(cta,url)}</article>' for tag,name,copy,cta,url in items)+'</div></section>'
write('/developers/','Developers','Build with Admetos products.',editorial('Developers','Build with<br>'+reveal('the ecosystem.'),'Choose the product that fits your work, then use its own documentation to connect your tools and agents.',[(p['category'],p['name'],p['description'],'Explore '+p['name'],p['url']) for p in products if p['slug'] in ['stored','govern','clusters']]))
write('/news/','News & insights','News and research notes from Admetos.',editorial('News & insights','From<br>'+reveal('the lab.'),'Articles, product updates, research notes, and ideas from across Admetos.', [('Updates','Follow the work.','No articles have been published yet. Follow the feed for future updates.','Follow via RSS','/feed.xml')]))
for slug,label,title,lead,copy,cta in [('careers','Careers','Build something<br>'+reveal('that matters.'),'We value clear thinking, thoughtful execution, and products that help people do more.','Areas of work include applied systems, product engineering, infrastructure and security, design, and company building. No open roles are listed yet; you can still introduce yourself.','Introduce yourself'),('investors','Investors','A long view.<br>'+reveal('Lasting value.'),'Focused software companies, supported by shared engineering and company-building resources.','For information about Admetos and its operating model, contact us directly.','Investor inquiries')]:
 body=f'<section class="contact-page content-width"><p class="section-label">{label}</p><h1>{title}</h1><div class="contact-columns"><div><p class="lead">{lead}</p></div><div><p>{copy}</p>{button(cta,"mailto:hello@admetos.org?subject="+label)}</div></div></section>'
 write('/'+slug+'/',label,lead,body)
contact=f'<section class="contact-page content-width"><p class="section-label">Contact</p><h1>Let’s build<br>{reveal("what comes next.")}</h1><div class="contact-columns"><div><p class="lead">Have something worth building?</p><p>For research, product, partnership, or company inquiries, contact Admetos.</p><div class="cta-row">{button("hello@admetos.org","mailto:hello@admetos.org")}</div></div><div><p class="lead">Explore the work.</p><p>Find the product that fits your needs, or learn about the systems we’re researching.</p><div class="cta-row">{button("Our products","/products/")}{button("Our research","/research/")}</div></div></div><div class="social-row">{links(secondary)}</div></section>'
write('/contact/','Contact','Get in touch with Admetos.',contact)
for alias,target in [('/projects/','/products/'),('/portfolio/','/products/'),('/lab/','/research/'),('/mission/','/company/'),('/systems/','/research/')]:write(alias,*bodies[target])
(R/'content/routes.json').write_text(json.dumps(routes,indent=2)+'\n')
(R/'public/sitemap.xml').write_text('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>https://admetos.org/'+p.replace('index.html','')+'</loc></url>' for p in routes)+'</urlset>')
print(f'Generated {len(routes)} pages using P Wilms compositions.')
