/* OLS S1 Unit 1 platform bridge.
 * The S1 Unit 1 Revision app (an Apps Script page) shows these activities in a frame and keeps each pupil's score.
 * This file tells that page when an activity is finished and what it scored. It does nothing at all when the page is
 * opened on its own: it only speaks when the page sits inside a frame that was opened with ?embed=1.
 *
 *   OLSBridge.finish(score, max)  the activity is over; score out of max (whole numbers, max > 0)
 *   OLSBridge.done()              the activity is over and has no score
 *   OLSBridge.framed              true when the platform is listening
 *
 * Inside the app the topic page is the HQ: a link (or a script) that goes to a set's index page sends the pupil back to
 * the app's topic page instead of opening the old HQ inside the frame.
 */
(function () {
  var framed = false, last = 0;
  try {
    var inFrame = window.parent && window.parent !== window;
    var asked = /[?&]embed=1(&|#|$)/.test(location.search);
    if (inFrame && asked) { try { sessionStorage.setItem('olsEmbed', '1'); } catch (e) { /* storage blocked */ } }
    var kept = false; try { kept = sessionStorage.getItem('olsEmbed') === '1'; } catch (e) { kept = false; }
    framed = !!(inFrame && (asked || kept));
  } catch (e) { framed = false; }
  function post(kind, extra) {
    if (!framed) return;
    var m = { t: 's1act', v: 1, kind: kind, path: location.pathname };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) m[k] = extra[k];
    try { window.parent.postMessage(m, '*'); } catch (e) { /* nothing to tell */ }
  }
  function home(u) { return /\/(index\.html?)?$/i.test(u.pathname); }
  function once() { var now = Date.now(); if (now - last < 3000) return false; last = now; return true; }
  function finish(score, max) {
    score = Math.round(Number(score)); max = Math.round(Number(max));
    if (!isFinite(score) || !isFinite(max) || max <= 0) return;
    if (score < 0) score = 0; if (score > max) score = max;
    if (once()) post('finish', { score: score, max: max });
  }
  function done() { if (once()) post('finish', { score: 0, max: 0 }); }
  if (framed) {
    // links to other pages of the set stay inside the platform's frame and keep reporting
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a) return;
      var raw = a.getAttribute('href') || '';
      if (!raw || raw.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(raw)) return;
      var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
      if (u.origin !== location.origin) return;
      if (home(u)) { e.preventDefault(); post('back'); return; }
      if (!/\.html?$/i.test(u.pathname) && !/\/$/.test(u.pathname)) return;
      u.searchParams.set('embed', '1'); a.href = u.toString();
      if (a.target === '_blank' || a.target === '_top') a.removeAttribute('target');
    }, true);
    if (home(location)) post('back');
    else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { post('ready'); });
    else post('ready');
  }
  window.OLSBridge = { framed: framed, finish: finish, done: done };
})();
