/* Fills in e-mail links that are shipped encoded, so the address is not in the page source.
   <a data-satr-email="HEX">: first byte is the key, the rest is the address XORed with it. */
(function () {
  function decode(h) {
    var k = parseInt(h.substr(0, 2), 16), s = '';
    for (var i = 2; i < h.length; i += 2) s += String.fromCharCode(parseInt(h.substr(i, 2), 16) ^ k);
    return s;
  }
  function run() {
    document.querySelectorAll('[data-satr-email]').forEach(function (a) {
      var m = a.getAttribute('data-satr-email').split(',').map(decode).join(',');
      a.setAttribute('href', 'mailto:' + m);
      if (a.hasAttribute('data-satr-email-text')) a.textContent = m;
      a.removeAttribute('data-satr-email');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
