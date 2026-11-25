/* Story pages: only the first three sentences of the opening paragraph are the lead (serif, larger; css/satr-text.css styles the
   first paragraph of the column). The rest of that paragraph moves into a paragraph of its own, in the running text.
   A paragraph of three sentences or fewer stays as it is. Without the script the whole opening paragraph is the lead. */
(function () {
  var LEAD_SENTENCES = 3;
  var cols = document.querySelectorAll('.story .col-md-9');
  var col = cols[1] || cols[0];
  if (!col) return;
  var p = col.firstElementChild;
  if (p && p.tagName === 'H2') p = p.nextElementSibling;
  if (!p || p.tagName !== 'P' || !(p.classList.contains('paragraph') || p.classList.contains('story-lead'))) return;

  /* the text nodes of the paragraph with the offset of each in the whole text */
  var nodes = [], text = '', w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), n;
  while ((n = w.nextNode())) { nodes.push({ node: n, start: text.length }); text += n.nodeValue; }

  var ABBR = /(?:^|[\s(])(?:[A-ZА-ЯІЇЄҐ]|Dr|Mr|Mrs|Ms|Prof|St|No|vs|etc|e\.g|i\.e|Fig|т|р|рр|ім|див|напр|проф|доц|вул|ст|м|с)$/;
  var re = /[.!?…]+["'”’»)\]]*(?=\s+["“«(]?[A-ZА-ЯІЇЄҐ0-9])/g, m, count = 0, end = -1;
  while ((m = re.exec(text))) {
    var before = text.slice(0, m.index);
    if (m[0].charAt(0) === '.' && m[0].length === 1 && ABBR.test(before)) continue;
    if (++count === LEAD_SENTENCES) { end = m.index + m[0].length; break; }
  }
  if (end < 0 || !text.slice(end).trim()) return;

  function at(offset) {
    for (var i = nodes.length - 1; i >= 0; i--) if (nodes[i].start <= offset) return { node: nodes[i].node, offset: offset - nodes[i].start };
    return null;
  }
  var skip = end; while (/\s/.test(text.charAt(skip))) skip++;
  var from = at(skip), to = at(end);
  if (!from || !to) return;
  var range = document.createRange();
  range.setStart(from.node, from.offset);
  range.setEndAfter(p.lastChild);
  var rest = document.createElement('p');
  rest.className = 'paragraph';
  rest.appendChild(range.extractContents());
  if (!rest.textContent.trim()) return;
  p.parentNode.insertBefore(rest, p.nextSibling);
  p.classList.remove('mt-0');
})();
