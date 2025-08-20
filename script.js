// --- Pomocné funkce ---
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Funkce pro změnu jazyka
function setLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('latex-builder-language', lang);
  
  // Aktualizace všech elementů s data-i18n atributem
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
  
  // Aktualizace placeholderů
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) {
      element.setAttribute('placeholder', translations[lang][key]);
    }
  });
  
  // Aktualizace textu tlačítka pro přepnutí jazyka
  document.getElementById('languageToggle').textContent = lang === 'cs' ? 'EN' : 'CZ';
  
  // Aktualizace option elementů v selectu
  const displayModeSelect = document.getElementById('displayMode');
  if (displayModeSelect) {
    for (let i = 0; i < displayModeSelect.options.length; i++) {
      const option = displayModeSelect.options[i];
      if (option.hasAttribute('data-i18n')) {
        const key = option.getAttribute('data-i18n');
        if (translations[lang][key]) {
          option.textContent = translations[lang][key];
        }
      }
    }
  }
}

function insertAtCursor(textarea, snippet){
  const m = '◻';
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const posMark = snippet.indexOf(m);
  const clean = snippet.replace(m, '');
  textarea.value = before + clean + after;
  const caret = start + (posMark >= 0 ? posMark : clean.length);
  textarea.selectionStart = textarea.selectionEnd = caret;
  textarea.focus();
  textarea.dispatchEvent(new Event('input', {bubbles:true}));
}

// --- Paleta & toolbar ---
const PALETTE = [
  { label: 'zlomek', s: '\\frac{◻}{ }' },
  { label: 'odmocnina', s: '\\sqrt{◻}' },
  { label: 'n-tá odm.', s: '\\sqrt[◻]{ }' },
  { label: 'mocnina', s: '^{◻}' },
  { label: 'index', s: '_{◻}' },
  { label: 'součet', s: '\\sum_{i=◻}^{n} ' },
  { label: 'součin', s: '\\prod_{i=◻}^{n} ' },
  { label: 'integrál', s: '\\int_{a}^{b} ◻\\, dx' },
  { label: 'limita', s: '\\lim_{x \\to ◻} ' },
  { label: 'matice 2×2', s: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}' },
  { label: '(', s: '\\left( ◻ \\right)' },
  { label: '[', s: '\\left[ ◻ \\right]' },
  { label: '| |', s: '\\left| ◻ \\right|' },
  { label: '≈', s: '\\approx ' },
  { label: '≠', s: '\\neq ' },
  { label: '≤', s: '\\leq ' },
  { label: '≥', s: '\\geq ' },
  { label: '⋅', s: '\\cdot ' },
  { label: '×', s: '\\times ' },
  { label: '→', s: '\\to ' },
  { label: 'ℝ', s: '\\mathbb{R} ' },
  { label: 'ℕ', s: '\\mathbb{N} ' },
  { label: 'α', s: '\\alpha ' },
  { label: 'β', s: '\\beta ' },
  { label: 'γ', s: '\\gamma ' },
  { label: 'θ', s: '\\theta ' },
  { label: 'λ', s: '\\lambda ' },
  { label: 'π', s: '\\pi ' },
  { label: 'sin', s: '\\sin ' },
  { label: 'cos', s: '\\cos ' },
  { label: 'tan', s: '\\tan ' },
];

function buildPalette(){
  const pal = $('#palette');
  pal.innerHTML = '';
  PALETTE.forEach(({label, s}) => {
    const el = document.createElement('div');
    el.className = 'token';
    el.textContent = label;
    el.setAttribute('draggable', 'true');
    el.title = s;
    el.addEventListener('dragstart', ev => {
      ev.dataTransfer.setData('text/plain', s);
    });
    el.addEventListener('click', () => insertAtCursor($('#latex'), s));
    pal.appendChild(el);
  });
}

function buildToolbar(){
  const TB = [
    { t: 'Zlomek', s: '\\frac{◻}{ }' },
    { t: '√', s: '\\sqrt{◻}' },
    { t: 'n√', s: '\\sqrt[◻]{ }' },
    { t: 'a^b', s: '^{◻}' },
    { t: 'a_b', s: '_{◻}' },
    { t: '∑', s: '\\sum_{i=◻}^{n} ' },
    { t: '∏', s: '\\prod_{i=◻}^{n} ' },
    { t: '∫', s: '\\int_{a}^{b} ◻\\, dx' },
    { t: '( )', s: '\\left( ◻ \\right)' },
    { t: '[ ]', s: '\\left[ ◻ \\right]' },
    { t: '| |', s: '\\left| ◻ \\right|' },
    { t: '+', s: '+ ' },
    { t: '−', s: '- ' },
    { t: '⋅', s: '\\cdot ' },
    { t: '×', s: '\\times ' },
    { t: '÷', s: '\\div ' },
    { t: '=', s: '= ' },
    { t: '≈', s: '\\approx ' },
    { t: '≠', s: '\\neq ' },
    { t: '≤', s: '\\leq ' },
    { t: '≥', s: '\\geq ' },        { t: 'sin', s: '\\sin ' },
    { t: 'cos', s: '\\cos ' },
    { t: 'tan', s: '\\tan ' },
    { t: 'VZOR', s: '__VZOR__' },
  ];
  const tb = $('#toolbar');
  TB.forEach(({t,s}) => {
    const b = document.createElement('button');
    b.className = 'btn'; b.type='button'; b.textContent = t; b.title=s;
    b.addEventListener('click', () => {
    if(s === '__VZOR__') insertSample();
    else insertAtCursor($('#latex'), s);
  });
    tb.appendChild(b);
  });
}

// --- Drag&drop do textarea ---
function enableDnd(){
  const ta = $('#latex');
  ta.addEventListener('dragover', ev => ev.preventDefault());
  ta.addEventListener('drop', ev => {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text/plain');
    if (data) insertAtCursor(ta, data);
  });
}

// --- Náhled (MathJax SVG) ---
async function renderPreview(){
  const latex = $('#latex').value;
  const display = $('#displayMode').value === 'true';
  const preview = $('#preview');
  preview.innerHTML = '';
  try{
    await MathJax.startup.promise; // zajistí inicializaci
    const svg = await MathJax.tex2svgPromise(latex, {display});
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
    preview.appendChild(svg);
  }catch(err){
    const pre = document.createElement('pre');
    pre.textContent = 'Chyba při vykreslení: ' + err?.message;
    pre.style.color = 'crimson'; pre.style.whiteSpace='pre-wrap';
    preview.appendChild(pre);
  }
}

// --- Export PNG z SVG náhledu ---
function exportPNG(){
  const preview = $('#preview');
  const svg = preview.querySelector('svg');
  if(!svg){ alert('Nejdřív vygeneruj náhled.'); return; }
  const scale = Math.max(1, Math.min(8, parseInt($('#scale').value || '2', 10)));
  const transparent = $('#transparent').checked;
  const bg = $('#bgColor').value;

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgStr], {type:'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const w = img.width * scale, h = img.height * scale;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if(!transparent){
      ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    } else {
      ctx.clearRect(0,0,w,h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.download = 'vzorec.png';
      a.href = URL.createObjectURL(blob);
      a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
    }, 'image/png');
  };
  img.onerror = () => { URL.revokeObjectURL(url); alert('Export selhal.'); };
  img.src = url;
}

// --- Export HTML (KaTeX + tabulka) ---
function exportHTML(){
  const latex = $('#latex').value;
  let html = '';
  try{
    html = katex.renderToString(latex, { throwOnError:false, displayMode: true, output:'html' });
  }catch(err){
    alert('Chyba při převodu KaTeX: '+ err?.message);
    return;
  }
  const doc = `<!doctype html>
<!-- Version 1.7 · Author PB · Updated: 2025-08-21 -->\n<html lang="cs">\n<head>\n<meta charset="utf-8">
<meta name="version" content="1.7">
<meta name="author" content="PB">\n<title>Vzorový vzorec (jednořádkový)</title>\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">\n<style>body{font:16px/1.4 system-ui,Segoe UI,Roboto; padding:24px} table{border-collapse:collapse} td{padding:8px;white-space:nowrap} .katex{white-space:nowrap} .katex-display{display:inline-block;margin:0;white-space:nowrap}</style>\n</head>\n<body>\n<table><tr><td>${html}</td></tr></table>\n</body></html>`;
  const blob = new Blob([doc], {type:'text/html;charset=utf-8'});
  const a = document.createElement('a');
  a.download = 'vzorec.html';
  a.href = URL.createObjectURL(blob);
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
}

// --- Export inline SVG HTML ---
function exportSVG(){
  const svg = $('#preview').querySelector('svg');
  if(!svg){ alert('Nejdřív vygeneruj náhled.'); return; }
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const doc = `<!doctype html>
<!-- Version 1.7 · Author PB · Updated: 2025-08-21 -->\n<html lang="cs">\n<head><meta charset=\"utf-8\"><title>Vzorový vzorec (SVG)</title><style>body{display:grid;place-items:center;height:100svh;margin:0;background:#fff}</style></head>\n<body>${svgStr}</body></html>`;
  const blob = new Blob([doc], {type:'text/html;charset=utf-8'});
  const a = document.createElement('a');
  a.download = 'vzorec_svg.html';
  a.href = URL.createObjectURL(blob);
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
}

// --- Ovládání ---
function bindUI(){
  $('#latex').addEventListener('input', renderPreview);
  $('#displayMode').addEventListener('change', renderPreview);
  $('#copyLatex').addEventListener('click', async () => {
    try{ await navigator.clipboard.writeText($('#latex').value); }catch{}
  });
  $('#clear').addEventListener('click', () => { $('#latex').value=''; renderPreview(); });
  $('#exportPNG').addEventListener('click', exportPNG);
  $('#exportHTML').addEventListener('click', exportHTML);
  $('#exportSVG').addEventListener('click', exportSVG);
  $('#transparent').addEventListener('change', (e)=>{
    $('#bgColor').style.display = e.target.checked ? 'none' : 'inline-block';
  });

  // jednoduché uložení do localStorage
  const KEY='latex-builder-last';
  const saved = localStorage.getItem(KEY);
  if(saved){ $('#latex').value = saved; }
  $('#latex').addEventListener('input', ()=> localStorage.setItem(KEY, $('#latex').value));
  
  // přepínání motivu
  $('#themeToggle').addEventListener('click', toggleTheme);
  
  // přepínání jazyka
  $('#languageToggle').addEventListener('click', toggleLanguage);
  
  // inicializace motivu a jazyka
  initTheme();
  initLanguage();
}

// --- Přepínání motivu ---
function initTheme() {
  const savedTheme = localStorage.getItem('latex-builder-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('latex-builder-theme', newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const button = $('#themeToggle');
  button.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// --- Přepínání jazyka ---
function initLanguage() {
  const savedLang = localStorage.getItem('latex-builder-language') || 'cs';
  setLanguage(savedLang);
}

function toggleLanguage() {
  const currentLang = document.documentElement.getAttribute('data-lang') || 'cs';
  const newLang = currentLang === 'cs' ? 'en' : 'cs';
  setLanguage(newLang);
}

function insertSample(){
  const ex = [
    '% Ukázkový vzorec',
    '\\begin{align}',
    '  F(\\alpha,\\beta) \\ &= \\sum_{i=1}^{n} \\frac{ \\alpha_i \\cdot x_i^{2} + \\beta_i \\cdot y_i }{ \\sqrt{ \\delta + x_i^{2} + y_i^{2} } } \\cdot \\sin(\\theta_i) \\\\',
    '  \\text{kde } \\; (x_i,y_i) \\in \\mathbb{R}^2, \\; \\lambda>0, \\; \\theta_i \\in [0,\\pi]',
    '\\end{align}'
  ].join('\n');
  const ta = document.querySelector('#latex');
  ta.value = ex;
  ta.selectionStart = ta.selectionEnd = ta.value.length;
  ta.dispatchEvent(new Event('input', {bubbles:true}));
  ta.focus();
}

function buildGreekDropdown(){
  const letters = [
    // Lowercase
    ['α','\\alpha '], ['β','\\beta '], ['γ','\\gamma '], ['δ','\\delta '], ['ε','\\epsilon '], ['ζ','\\zeta '], ['η','\\eta '], ['θ','\\theta '], ['ι','\\iota '], ['κ','\\kappa '], ['λ','\\lambda '], ['μ','\\mu '], ['ν','\\nu '], ['ξ','\\xi '], ['ο','o'], ['π','\\pi '], ['ρ','\\rho '], ['σ','\\sigma '], ['τ','\\tau '], ['υ','\\upsilon '], ['φ','\\phi '], ['χ','\\chi '], ['ψ','\\psi '], ['ω','\\omega '],
    // Uppercase
    ['Α','A'], ['Β','B'], ['Γ','\\Gamma '], ['Δ','\\Delta '], ['Ε','E'], ['Ζ','Z'], ['Η','H'], ['Θ','\\Theta '], ['Ι','I'], ['Κ','K'], ['Λ','\\Lambda '], ['Μ','M'], ['Ν','N'], ['Ξ','\\Xi '], ['Ο','O'], ['Π','\\Pi '], ['Ρ','P'], ['Σ','\\Sigma '], ['Τ','T'], ['Υ','\\Upsilon '], ['Φ','\\Phi '], ['Χ','X'], ['Ψ','\\Psi '], ['Ω','\\Omega ']
  ];
  const grid = document.querySelector('#greekGrid');
  if(!grid) return;
  grid.innerHTML='';
  letters.forEach(([label, s]) => {
    const el = document.createElement('div');
    el.className='gk';
    el.textContent=label;
    el.title=s;
    el.addEventListener('click', () => insertAtCursor(document.querySelector('#latex'), s));
    grid.appendChild(el);
  });
}

function openAbout(){
  const currentLang = document.documentElement.getAttribute('data-lang') || 'cs';
  let info;
  
  if (currentLang === 'cs') {
    info = [
      'LaTeX Builder — v1.7 (PB)',
      'Funguje offline — náhled (MathJax), export PNG/HTML/SVG.',
      'Novinky v1.7:',
      '- Vylepšené zobrazení řecké abecedy',
      '- Přepínání češtiny/angličtiny',
      '- Výchozí světlý režim',
      '- Přepínání tmavého/světlého režimu'
    ].join('\n');
  } else {
    info = [
      'LaTeX Builder — v1.7 (PB)',
      'Works offline — preview (MathJax), export PNG/HTML/SVG.',
      'New in v1.7:',
      '- Improved Greek alphabet display',
      '- Czech/English language switching',
      '- Default light theme',
      '- Dark/light theme switching'
    ].join('\n');
  }
  
  alert(info);
}
function saveJSON(){
  const data = {
    version: '1.7',
    latex: document.querySelector('#latex').value,
    displayMode: document.querySelector('#displayMode').value === 'true'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'latex_builder_v1.7.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 100);
}
function loadJSON(){
  const inp = document.createElement('input');
  inp.type='file';
  inp.accept='application/json';
  inp.onchange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    try{
      const text = await file.text();
      const obj = JSON.parse(text);
      if(typeof obj.latex === 'string'){
        const ta = document.querySelector('#latex');
        ta.value = obj.latex;
        ta.dispatchEvent(new Event('input', {bubbles:true}));
      }
      if(typeof obj.displayMode === 'boolean'){
        document.querySelector('#displayMode').value = String(obj.displayMode);
        document.querySelector('#displayMode').dispatchEvent(new Event('change', {bubbles:true}));
      }
      alert('Načteno.');
    }catch(err){
      alert('Nepodařilo se načíst JSON: ' + err.message);
    }
  };
  inp.click();
}

function buildChemDropdown(){
  const items = [
    ['H₂O','\\mathrm{H_2O}','voda'],
    ['NaCl','\\mathrm{NaCl}','sůl'],
    ['CO₂','\\mathrm{CO_2}','oxid uhličitý'],
    ['H₂SO₄','\\mathrm{H_2SO_4}','kys. sírová'],
    ['HNO₃','\\mathrm{HNO_3}','kys. dusičná'],
    ['HCl','\\mathrm{HCl}','kys. chlorovodíková'],
    ['NaOH','\\mathrm{NaOH}','hydroxid sodný'],
    ['NH₃','\\mathrm{NH_3}','amoniak'],
    ['CaCO₃','\\mathrm{CaCO_3}','uhličitan vápenatý'],
    ['C₆H₁₂O₆','\\mathrm{C_6H_{12}O_6}','glukóza'],
    ['C₂H₅OH','\\mathrm{C_2H_5OH}','etanol'],
    ['CH₃COOH','\\mathrm{CH_3COOH}','kys. octová']
  ];
  const grid = document.querySelector('#chemGrid');
  if(!grid) return;
  grid.innerHTML='';
  items.forEach(([symbol, s, fullName]) => {
    const el = document.createElement('div');
    el.className='gk';
    
    const symbolDiv = document.createElement('div');
    symbolDiv.className = 'chem-symbol';
    symbolDiv.textContent = symbol;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'chem-name';
    nameDiv.textContent = fullName;
    
    el.appendChild(symbolDiv);
    el.appendChild(nameDiv);
    
    el.title = `${fullName} (${s})`;
    el.addEventListener('click', () => insertAtCursor(document.querySelector('#latex'), s + ' '));
    grid.appendChild(el);
  });
}

function buildPhysicsDropdown() {
  const items = [
    ['F = ma', 'F = m a', '2. Newtonův zákon'],
    ['E = mc²', 'E = m c^2', 'Rovnice energie'],
    ['F = G(m₁m₂)/r²', 'F = G \\frac{m_1 m_2}{r^2}', 'Gravitační zákon'],
    ['p = mv', 'p = m v', 'Hybnost'],
    ['W = Fs', 'W = F s', 'Práce'],
    ['P = W/t', 'P = \\frac{W}{t}', 'Výkon'],
    ['E = ½mv²', 'E = \\frac{1}{2} m v^2', 'Kinetická energie'],
    ['F = kx', 'F = k x', 'Hookův zákon'],
    ['v = λf', 'v = \\lambda f', 'Vlnová rovnice'],
    ['P = IV', 'P = I V', 'Elektrický výkon'],
    ['V = IR', 'V = I R', 'Ohmův zákon'],
    ['F = qE', 'F = q E', 'Elektrická síla'],
    ['F = qvB', 'F = q v B', 'Magnetická síla'],
    ['E = hf', 'E = h f', 'Energie fotonu'],
    ['λ = h/p', '\\lambda = \\frac{h}{p}', 'De Broglie vlna'],
    ['ΔxΔp ≥ ħ/2', '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}', 'Princip neurčitosti'],
    ['S = k ln Ω', 'S = k \\ln \\Omega', 'Boltzmannova entropie'],
    ['PV = nRT', 'P V = n R T', 'Stavová rovnice'],
    ['F = σAΔT⁴', 'P = \\sigma A T^4', 'Stefan-Boltzmannův zákon'],
    ['1/f = 1/u + 1/v', '\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}', 'Zobrazovací rovnice']
  ];
  const grid = document.querySelector('#physicsGrid');
  if(!grid) return;
  grid.innerHTML='';
  items.forEach(([symbol, s, fullName]) => {
    const el = document.createElement('div');
    el.className='gk';
    
    const symbolDiv = document.createElement('div');
    symbolDiv.className = 'chem-symbol';
    symbolDiv.textContent = symbol;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'chem-name';
    nameDiv.textContent = fullName;
    
    el.appendChild(symbolDiv);
    el.appendChild(nameDiv);
    
    el.title = `${fullName} (${s})`;
    el.addEventListener('click', () => insertAtCursor(document.querySelector('#latex'), s + ' '));
    grid.appendChild(el);
  });
}

function buildElectroDropdown() {
  const items = [
    ['U = IR', 'U = I R', 'Ohmův zákon'],
    ['P = UI', 'P = U I', 'Elektrický výkon'],
    ['P = I²R', 'P = I^2 R', 'Jouleův zákon'],
    ['W = UIt', 'W = U I t', 'Práce'],
    ['C = Q/U', 'C = \\frac{Q}{U}', 'Kapacita'],
    ['E = ½CU²', 'E = \\frac{1}{2} C U^2', 'Energie kondenzátoru'],
    ['L = Φ/I', 'L = \\frac{\\Phi}{I}', 'Indukčnost'],
    ['E = ½LI²', 'E = \\frac{1}{2} L I^2', 'Energie cívka'],
    ['τ = RC', '\\tau = R C', 'Časová konstanta RC'],
    ['τ = L/R', '\\tau = \\frac{L}{R}', 'Časová konstanta RL'],
    ['f = 1/T', 'f = \\frac{1}{T}', 'Frekvence'],
    ['ω = 2πf', '\\omega = 2\\pi f', 'Úhlová frekvence'],
    ['X_C = 1/(ωC)', 'X_C = \\frac{1}{\\omega C}', 'Kapacitance'],
    ['X_L = ωL', 'X_L = \\omega L', 'Induktance'],
    ['Z = √(R²+X²)', 'Z = \\sqrt{R^2 + X^2}', 'Impedance'],
    ['I = I₀sin(ωt)', 'I = I_0 \\sin(\\omega t)', 'Střídavý proud'],
    ['U = U₀sin(ωt+φ)', 'U = U_0 \\sin(\\omega t + \\varphi)', 'Střídavé napětí'],
    ['Φ = BAcosθ', '\\Phi = B A \\cos\\theta', 'Magnetický tok'],
    ['F = BIlsinθ', 'F = B I l \\sin\\theta', 'Síla na vodič'],
    ['ε = -dΦ/dt', '\\varepsilon = -\\frac{d\\Phi}{dt}', 'Faradayův zákon']
  ];
  const grid = document.querySelector('#electroGrid');
  if(!grid) return;
  grid.innerHTML='';
  items.forEach(([symbol, s, fullName]) => {
    const el = document.createElement('div');
    el.className='gk';
    
    const symbolDiv = document.createElement('div');
    symbolDiv.className = 'chem-symbol';
    symbolDiv.textContent = symbol;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'chem-name';
    nameDiv.textContent = fullName;
    
    el.appendChild(symbolDiv);
    el.appendChild(nameDiv);
    
    el.title = `${fullName} (${s})`;
    el.addEventListener('click', () => insertAtCursor(document.querySelector('#latex'), s + ' '));
    grid.appendChild(el);
  });
}

function buildCommonDropdown(){
  const items = [
    ['→','\\rightarrow '],
    ['←','\\leftarrow '],
    ['⇒','\\Rightarrow '],
    ['⇐','\\Leftarrow '],
    ['↔','\\leftrightarrow '],
    ['∞','\\infty '],
    ['∠','\\angle '],
    ['△','\\triangle '],
    ['∂','\\partial '],
    ['∇','\\nabla '],
    ['·','\\cdot '],
    ['×','\\times '],
    ['±','\\pm ']
  ];
  const grid = document.querySelector('#commonGrid');
  if(!grid) return;
  grid.innerHTML='';
  items.forEach(([symbol, s]) => {
    const el = document.createElement('div');
    el.className='gk';
    el.textContent = symbol;
    el.title = s;
    el.addEventListener('click', () => insertAtCursor(document.querySelector('#latex'), s));
    grid.appendChild(el);
  });
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  buildPalette();
  buildToolbar();
  enableDnd();
  bindUI();
  renderPreview();

  // menu handlers
  const $ = (s)=>document.querySelector(s);
  $('#btnAbout')?.addEventListener('click', openAbout);
  $('#btnSave')?.addEventListener('click', saveJSON);
  $('#btnLoad')?.addEventListener('click', loadJSON);
  buildGreekDropdown();

  buildChemDropdown();
  buildPhysicsDropdown();
  buildElectroDropdown();
  buildCommonDropdown();
});