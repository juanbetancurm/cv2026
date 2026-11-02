'use strict';
(() => {
 const root=document.documentElement;
 const read=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
 const save=(key,value)=>{try{localStorage.setItem(key,value);}catch{/* Preferences remain usable for this visit. */}};
 let lang=read('preferredLanguage','es'); if(!['es','en'].includes(lang))lang='es';
 let theme=read('preferredTheme','light'); if(!['light','dark'].includes(theme))theme='light';
 let filter='all';
 const langButton=document.getElementById('lang-toggle');
 const themeButton=document.getElementById('theme-toggle');
 const projects=[...document.querySelectorAll('.project')];
 function announce(){const n=projects.filter(p=>!p.hidden).length;document.getElementById('filter-status').textContent=lang==='es'?n+' proyectos visibles':n+' projects shown';}
 function applyTheme(){
  root.dataset.theme=theme;
  themeButton.textContent=theme==='dark'?'☀':'◐';
  themeButton.setAttribute('aria-label',lang==='es'?(theme==='dark'?'Activar tema claro':'Activar tema oscuro'):(theme==='dark'?'Switch to light theme':'Switch to dark theme'));
  document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#10131b':'#f5f7fb';
 }
 function applyLanguage(){
  root.lang=lang;
  document.querySelectorAll('[data-es][data-en]').forEach(el=>{el.textContent=el.dataset[lang];});
  langButton.textContent=lang==='es'?'EN':'ES';
  langButton.setAttribute('aria-label',lang==='es'?'Switch to English':'Cambiar a español');
  document.querySelector('nav').setAttribute('aria-label',lang==='es'?'Navegación principal':'Main navigation');
  document.querySelector('.filters').setAttribute('aria-label',lang==='es'?'Filtrar proyectos':'Filter projects');
  document.querySelector('.footer>a').setAttribute('aria-label',lang==='es'?'Volver arriba':'Back to top');
  document.title=lang==='es'?'Juan Betancur | Software, agentes de IA y automatización':'Juan Betancur | Software, AI agents & automation';
  document.querySelector('meta[name="description"]').content=lang==='es'?'Portafolio de Juan Betancur: desarrollo de software, agentes de IA, infraestructura Azure y automatización. Proyectos, experiencia y formación.':'Juan Betancur’s portfolio: software development, AI agents, Azure infrastructure and automation. Projects, experience and education.';
  applyTheme();announce();document.dispatchEvent(new Event("portfolio-language-change"));
 }
 langButton.addEventListener('click',()=>{lang=lang==='es'?'en':'es';save('preferredLanguage',lang);applyLanguage();});
 themeButton.addEventListener('click',()=>{theme=theme==='light'?'dark':'light';save('preferredTheme',theme);applyTheme();});
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  projects.forEach(p=>{p.hidden=filter!=='all'&&!p.dataset.category.split(' ').includes(filter);});
  announce();
 }));
 document.getElementById('pdf-btn').addEventListener('click',()=>window.print());
 applyLanguage();
})();
