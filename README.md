# LaTeX Builder v1.7 (PB)

### Změny oproti v1.6 → v1.7
- **Jazykové přepínání**: Nové tlačítko pro přepínání mezi češtinou a angličtinou
- **UI**: Zmenšená tlačítka řecké abecedy (o cca 50%) pro lepší využití prostoru
- **Výchozí režim**: Nastaven světlý režim jako výchozí
- **Verze**: meta `version=1.7`, badge „v1.7 · PB"

### Změny oproti v1.5 → v1.6
- **Přidány dropdowny**: **Fyzikální vzorce** (20 položek) a **Elektrotechnické vzorce** (20 položek)
- **UI**: Větší tlačítka pro chemické, fyzikální a elektrotechnické vzorce
- **Fix**: Oprava zobrazení dlouhých textů v tlačítkách
- **Verze**: meta `version=1.6`, badge „v1.6 · PB"

### Změny oproti v1.4 → v1.5
- **Tmavý/světlý režim**: Přidáno tlačítko pro přepínání mezi režimy
- **UI**: Náhled vzorce respektuje zvolený režim
- **Verze**: meta `version=1.5`, badge „v1.5 · PB"

### Změny oproti v1.3 → v1.4
- **Přesun**: Tlačítka _About_, _Load (.json)_, _Save (.json)_ jsou nyní vedle **Kopírovat LaTeX** v horní liště
- **Dropdowny**: Vedle „Řecká abeceda" přibyla roletka **Chemické vzorce** (H₂O, NaCl, CO₂, H₂SO₄, HNO₃, HCl, NaOH, NH₃, CaCO₃, C₆H₁₂O₆, C₂H₅OH, CH₃COOH) a roletka **Časté** (šipky, ∞, ∠, △, ∂, ∇, …)
- **Verze**: meta `version=1.4`, badge „v1.4 · PB"

### Změny oproti v1.2 → v1.3
- Přidáno **horní menu**: _About_, _Load (.json)_, _Save (.json)_
- **Zarovnání UI**: textové okno a náhled jsou nyní ve stejné rovině (toolbar přesunut nad oba sloupce)
- **Řecká abeceda**: kompletní sada dostupná v **rozbalovacím okně** v horním menu
- Verze UI badge a meta `version=1.3`

### Změny oproti v1.1 → v1.2
- Přidána **rozšířená lišta tlačítek**: základní operace (+, −, ⋅, ×, ÷, =, ≈, ≠, ≤, ≥), závorky, sumy/produky/integrály a **řecká písmena** (α, β, γ, δ, θ, λ, π)
- Nové tlačítko **VZOR**: jedním klikem vloží ukázkový víceradkový vzorec (`align`) s často používanými symboly
- Aktualizována verze UI badge na **v1.2**

**CZ**  
Minimalistický editor a převodník LaTeX vzorců s náhledem (MathJax) a exportem do PNG/HTML/SVG.  
Tato verze řeší problém, kdy se vzorec v exportovaném HTML zalamoval do dvou řádků — nyní je vždy v **jednom řádku** díky CSS `white-space: nowrap` a úpravě `.katex-display` na `inline-block`.

## Použití
1. Otevři `latex_v1.7.html` v prohlížeči (funguje offline)  
2. Napiš LaTeX do textového pole nebo použij paletu/tlačítka  
3. Vpravo se vykreslí náhled (MathJax SVG)  
4. V **Export** panelu zvol formát:
   - **Export PNG** – bitmapa s volitelným měřítkem a průhledností
   - **Export HTML (CSS + tabulka)** – KaTeX HTML se styly, **nezalamuje** vzorec
   - **Export HTML (inline SVG)** – stránka obsahující přímo vygenerované SVG

### Nové funkce ve v1.7
- Přepínání mezi češtinou a angličtinou
- Větší výběr vzorců (fyzikální a elektrotechnické)
- Vylepšené zobrazení řecké abecedy
- Tmavý/světlý režim

### Změny oproti v1.0
- Oprava: vzorec v exportovaném HTML je vždy na jednom řádku (nowrap)
- Doplněno: meta tagy `version=1.1` a `author=PB`
- UI: badge „v1.1 · PB" v hlavičce + informace ve footeru
- Dokumentace: přidán `CHANGELOG.md` a tento `README.md` (CZ/EN)

---

**EN**  
A minimalist LaTeX formula editor with preview (MathJax) and PNG/HTML/SVG export.  
This release fixes an issue where the exported HTML could wrap the formula onto two lines — it is now **always single-line** via `white-space: nowrap` and `.katex-display` set to `inline-block`.

## How to use
1. Open `latex_v1.7.html` in your browser (works offline)  
2. Enter LaTeX into the textarea or use the palette/buttons  
3. The right side shows a live MathJax SVG preview  
4. Use the **Export** panel:
   - **Export PNG** – bitmap with adjustable scale and transparency
   - **Export HTML (CSS + table)** – KaTeX HTML with CSS, **no line wrap**
   - **Export HTML (inline SVG)** – page containing the generated SVG

### New features in v1.7
- Language switching between Czech and English
- Expanded formula selection (physics and electrical)
- Improved Greek alphabet display
- Dark/light mode toggle

### Changes since v1.0
- Fix: exported HTML formula is always single-line (nowrap)
- Added: `version=1.1` and `author=PB` meta tags
- UI: "v1.1 · PB" badge in the header + footer info
- Docs: added `CHANGELOG.md` and this bilingual `README.md`