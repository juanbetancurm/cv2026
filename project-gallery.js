'use strict';
(() => {
  const slides = [
    {title:'LabOlavs',image:'labolavs.jpg',url:'https://www.labolavs.com/',
      es:'Aplicaciones y recursos educativos',en:'Educational applications and resources',
      altEs:'Portal LabOlavs con juegos, educación y aplicaciones.',altEn:'LabOlavs portal with games, education and applications.'},
    {title:'AngleMaze',image:'anglemaze-current.png?v=c6744da063a2',url:'https://anglemaze.labolavs.com/',
      es:'Geometría y programación en un laberinto interactivo',en:'Geometry and programming in an interactive maze',
      altEs:'Nivel 2 de AngleMaze con muros de madera, obstáculos de roca, puntos de control y salida.',altEn:'AngleMaze level 2 with wooden walls, rock obstacles, checkpoints and an exit.'},
    {title:'Math Exam Grader',image:'grader.jpg?v=11ca2c30cdf8',url:'https://grader.labolavs.com/',
      es:'Examen, criterios de calificación y revisión de respuestas',en:'Exam, marking criteria and answer review',
      altEs:'Ejemplo de revisión: un estudiante cuenta una tapa en el área de una caja abierta y recibe una explicación.',altEn:'Illustrative review: a student includes a lid in an open box area and receives an explanation.',
      noteEs:'Ejemplo ilustrativo de retroalimentación',noteEn:'Illustrative feedback example'},
    {title:'FASTQ → Variants',image:'variants-run.png',url:'https://variantsm.labolavs.com/',
      es:'Análisis completado: calidad de lecturas y variantes detectadas',en:'Completed analysis: read quality and detected variants',
      altEs:'Ejecución completada con resumen de calidad, gráfica y tabla de variantes del caso beta-demo.',altEn:'Completed run with quality summary, chart and variant table for the beta-demo case.',
      noteEs:'Caso de demostración · datos sintéticos',noteEn:'Demonstration case · synthetic data'},
    {title:'mRNA Simulator',image:'mrna.jpg',url:'https://translation.labolavs.com/walkthrough',
      es:'Traducción paso a paso: codones, ribosoma y aminoácidos',en:'Step-by-step translation: codons, ribosome and amino acids',
      altEs:'Simulador de traducción en la fase de elongación, con ribosoma y cadena de aminoácidos.',altEn:'Translation simulator during elongation, with a ribosome and amino acid chain.'},
    {titleEs:'Interés compuesto',titleEn:'Compound interest',image:'compound-interest.jpg',url:'https://finantial.labolavs.com/m/interes/compuesto-conceptos',
      es:'Comparación visual del interés simple y compuesto',en:'Visual comparison of simple and compound interest',
      altEs:'Simulación en el período ocho, con gráficas y cálculo de intereses sobre intereses.',altEn:'Simulation at period eight, with charts and interest-on-interest calculations.'},
    {title:'Physics Lab',image:'physics-lab.jpg',url:'https://physicslab.labolavs.com/',
      es:'Mapa interactivo para explorar la distribución del laboratorio',en:'Interactive map for exploring the laboratory layout',
      altEs:'Mapa del laboratorio con estantes, estaciones de trabajo y ubicaciones seleccionables.',altEn:'Laboratory map with shelves, workstations and selectable locations.'}
  ];
  const $ = id => document.getElementById(id);
  const gallery = document.querySelector('.project-preview');
  const dialog = $('preview-dialog');
  let index = 0;
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'es';
  function render(announce = false) {
    const s = slides[index], es = language() === 'es';
    const title = s.title || (es ? s.titleEs : s.titleEn);
    const description = es ? s.es : s.en;
    const alt = es ? s.altEs : s.altEn;
    const note = (es ? s.noteEs : s.noteEn) || (es ? 'Vista del proyecto' : 'Project preview');
    for (const id of ['preview-image','preview-large-image']) {
      $(id).src = 'assets/' + s.image;
      $(id).alt = alt;
    }
    $('preview-title').textContent = title;
    $('preview-dialog-title').textContent = title;
    $('preview-description').textContent = description;
    $('preview-link').href = s.url;
    $('preview-count').textContent = (index + 1) + ' / ' + slides.length;
    $('preview-note').textContent = note;
    $('preview-large-caption').textContent = (index + 1) + ' / ' + slides.length + ' · ' + description + ' — ' + note;
    $('preview-expand').setAttribute('aria-label',(es ? 'Ampliar vista de ' : 'Enlarge preview of ') + title);
    gallery.setAttribute('aria-label',es ? 'Proyectos de LabOlavs' : 'LabOlavs projects');
    gallery.setAttribute('aria-roledescription',es ? 'carrusel' : 'carousel');
    gallery.querySelector('.gallery-controls').setAttribute('aria-label',es ? 'Controles de la presentación' : 'Slideshow controls');
    if (announce) $('preview-status').textContent = (index + 1) + ' / ' + slides.length + ': ' + title;
    const preload = new Image(); preload.src = 'assets/' + slides[(index + 1) % slides.length].image;
  }
  function step(delta) {index = (index + delta + slides.length) % slides.length; render(true);}
  ['preview-prev','dialog-prev'].forEach(id => $(id).addEventListener('click',() => step(-1)));
  ['preview-next','dialog-next'].forEach(id => $(id).addEventListener('click',() => step(1)));
  $('preview-expand').addEventListener('click',() => dialog.showModal());
  $('preview-close').addEventListener('click',() => dialog.close());
  dialog.addEventListener('close',() => $('preview-expand').focus({preventScroll:true}));
  dialog.addEventListener('click',event => {if(event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close();});
  [gallery,dialog].forEach(el => el.addEventListener('keydown',event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault();step(event.key === 'ArrowRight' ? 1 : -1);}
  }));
  document.addEventListener('portfolio-language-change',() => render());
  render();
})();
