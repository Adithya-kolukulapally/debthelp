// Third-party analytics/pixel bootstrapping for debthelp.dacl.ca.
// Loaded synchronously from <head> (non-module <script src>) so it runs
// before React mounts and before fbevents.js loads - order matters here,
// see the comments on each block below. Kept as a plain external file
// instead of inline <script> tags in index.html so it doesn't hit HTML
// parsing edge cases (e.g. <noscript> nesting rules) and is easier to read/
// diff than JS embedded in markup.

// ── 0. Quiet known-harmless third-party console noise in production ──────
// The Meta Pixel SDK logs its own "Duplicate Pixel ID" console.warn whenever
// fbq('init', ...) is called more than once for the same pixel - which we do
// deliberately, to progressively enrich Advanced Matching before each event
// (see pageview.ts / ApplyForm.tsx). It's expected noise, not a bug. Keep it
// visible in dev (useful when debugging the re-init pattern locally), filter
// it out in production so it doesn't clutter real users' consoles / error
// monitoring.
(function () {
  var isDev = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (isDev) return;
  var origWarn = console.warn;
  console.warn = function () {
    if (typeof arguments[0] === "string" && arguments[0].indexOf("Duplicate Pixel ID") !== -1) {
      return;
    }
    return origWarn.apply(console, arguments);
  };
})();

// ── 1. Prime Meta _fbp/_fbc cookies BEFORE fbevents.js loads ──────────────
// fbevents.js is async and adopts any pre-existing _fbp/_fbc cookie instead
// of minting its own - so by writing correctly-formatted values here first
// we (1) kill the race where React reads an empty cookie at mount, and
// (2) guarantee the browser Pixel and the server CAPI send the *same*
// values. _fbc must be `fb.1.<ts>.<fbclid>`; a bare fbclid is invalid and
// Meta drops it. Provenance is written to localStorage["debthelp_fb"],
// which src/lib/fb.ts's getFbData() reads back.
(function () {
  try {
    var host = location.hostname.split(".").slice(-2).join(".");
    function getC(n) {
      var m = document.cookie.match("(^|;)\\s*" + n + "\\s*=\\s*([^;]+)");
      return m ? m.pop() : "";
    }
    function setC(n, v) {
      document.cookie =
        n + "=" + v + ";path=/;max-age=7776000;domain=." + host + ";SameSite=Lax";
    }
    var now = Date.now();
    var iso = new Date(now).toISOString();
    var prov = {};
    try { prov = JSON.parse(localStorage.getItem("debthelp_fb") || "{}"); } catch (e) {}

    // Stable external id for Meta Advanced Matching - minted once per browser
    // BEFORE the Pixel inits so every browser event carries it and the whole
    // funnel (PageView -> Lead) stitches to one person. Same key src/lib/fb.ts's
    // getExternalId() reads/writes.
    try {
      if (!localStorage.getItem("debthelp_xid")) {
        var xid = (window.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : (now + "-" + Math.floor(Math.random() * 1e10));
        localStorage.setItem("debthelp_xid", xid);
      }
    } catch (e) {}

    // ── _fbp ──────────────────────────────────────────────────────────
    if (!getC("_fbp")) {
      setC("_fbp", "fb.1." + now + "." + Math.floor(Math.random() * 1e10));
      prov.fbp_source = "generated";
      prov.fbp_captured_at = iso;
    } else if (!prov.fbp_source) {
      // Cookie pre-existed before we tracked provenance -> pixel/Meta set it.
      prov.fbp_source = "cookie";
      if (!prov.fbp_captured_at) prov.fbp_captured_at = iso;
    }

    // ── _fbc ──────────────────────────────────────────────────────────
    // fbc = fb.1.<creation time in MILLISECONDS>.<fbclid>. Same rules as
    // src/lib/fb.ts getFbc(): a valid same-click cookie keeps its original
    // timestamp; a newly seen fbclid is stamped once with Date.now() and
    // persisted (prov.fbc_created_at_ms); an invalid value is repaired only
    // from a recoverable original time, otherwise removed - never re-stamped
    // with a made-up click time. Runs before fbevents.js can adopt the cookie.
    function plausibleMs(ms) {
      return isFinite(ms) && ms > Date.UTC(2015, 0, 1) && ms < now + 300000;
    }
    function parseFbc(v) {
      var p = (v || "").split(".");
      if (p.length < 4 || p[0] !== "fb" || p[1] !== "1") return null;
      return { ms: Number(p[2]), id: p.slice(3).join(".") };
    }
    function clearC(n) {
      document.cookie = n + "=;path=/;max-age=0;domain=." + host + ";SameSite=Lax";
      document.cookie = n + "=;path=/;max-age=0;SameSite=Lax";
    }
    var fbclid = new URLSearchParams(location.search).get("fbclid");
    var existingFbc = getC("_fbc");
    var ex = parseFbc(existingFbc);
    var unrecoverableSameClick = false;
    if (existingFbc && !(ex && plausibleMs(ex.ms))) {
      var recovered = ex && prov.fbclid === ex.id && plausibleMs(prov.fbc_created_at_ms)
        ? prov.fbc_created_at_ms
        : null;
      if (recovered) {
        existingFbc = "fb.1." + recovered + "." + ex.id;
        setC("_fbc", existingFbc);
        ex = { ms: recovered, id: ex.id };
      } else {
        unrecoverableSameClick = !!ex && ex.id === fbclid;
        clearC("_fbc");
        if (ex && prov.fbclid === ex.id) {
          delete prov.fbc_source;
          delete prov.fbc_created_at_ms;
        }
        existingFbc = "";
        ex = null;
      }
    }
    var embedded = ex ? ex.id : "";
    if (fbclid) {
      if (!existingFbc || embedded !== fbclid) {
        if (!unrecoverableSameClick) {
          setC("_fbc", "fb.1." + now + "." + fbclid);
          prov.fbc_source = "generated";
          prov.fbc_created_at_ms = now;
          prov.fbclid = fbclid;
          prov.fbclid_first_seen_at = iso;
        }
      } else {
        // Same click already stored - keep the cookie and its timestamp.
        if (!prov.fbc_source) prov.fbc_source = "generated";
        if (!prov.fbc_created_at_ms) prov.fbc_created_at_ms = ex.ms;
        prov.fbclid = fbclid;
        if (!prov.fbclid_first_seen_at) prov.fbclid_first_seen_at = iso;
      }
    } else if (existingFbc && !prov.fbc_source) {
      // Pre-existing valid _fbc, no click param, no prior provenance -> Meta set it.
      prov.fbc_source = "cookie";
      if (!prov.fbc_created_at_ms) prov.fbc_created_at_ms = ex.ms;
      if (!prov.fbclid) prov.fbclid = embedded;
      if (!prov.fbclid_first_seen_at) prov.fbclid_first_seen_at = iso;
    }

    try { localStorage.setItem("debthelp_fb", JSON.stringify(prov)); } catch (e) {}
  } catch (e) {
    /* cookie priming must never block the page */
  }
})();

// ── 2. Meta Pixel base code ────────────────────────────────────────────
// Fires PageView in the browser. The Lead/QualifiedRenter events are fired
// server-side via Meta CAPI (mmix-backend) and mirrored here with a
// matching eventID for deduplication (see src/lib/pageview.ts,
// src/components/debt-form/ApplyForm.tsx).
!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = "2.0";
  n.queue = [];
  // Kill the Pixel's automatic SPA PageView. fbevents.js monkey-patches
  // history.pushState and fires its own event-id-less PageView on every
  // route change - react-router's BrowserRouter navigates via pushState, so
  // home -> /thank-you would otherwise produce a "blank" PageView that can
  // never dedupe with the server CAPI event. autoConfig=false does NOT cover
  // this path - this dedicated flag does. Must be set on the stub before
  // fbevents.js loads.
  n.disablePushState = true;
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
  // autoConfig stays on (the default) - lets the Pixel's Automatic Advanced
  // Matching pick up extra signal from the page's forms. PageView/Lead are
  // still fired explicitly (with explicit eventIDs) elsewhere so they can
  // dedupe with the matching server CAPI events.
  fbq("init", "1197699221728126");
})(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

// ── 3. Google Analytics 4 ──────────────────────────────────────────────
// Base snippet only. send_page_view is disabled because react-router's
// BrowserRouter navigates via pushState, which gtag.js's default History
// API listener would otherwise treat as a real page load and double-fire
// page_view on route changes. page_view and generate_lead are instead
// fired manually (src/lib/pageview.ts / ApplyForm.tsx) so GA4 mirrors the
// same events the Meta Pixel sends.
(function () {
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-G2MJFKSJD";
  document.head.appendChild(s);
})();
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "G-G2MJFKSJD", { send_page_view: false });

// ── 4. Microsoft Clarity ───────────────────────────────────────────────
(function (c, l, a, r, i, t, y) {
  c[a] =
    c[a] ||
    function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
  t = l.createElement(r);
  t.async = 1;
  t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "tx8gql9k6m");
