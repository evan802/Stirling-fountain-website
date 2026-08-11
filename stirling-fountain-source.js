/* =============================================================================
   THE STIRLING FOUNTAIN — WEBSITE SOURCE
   Built by TouchBridge Studios · tbsites.com
   =============================================================================

   FILE MAP — this single file contains the full site source, concatenated.
   Each original file starts with a divider like:

       ===== FILE: path/to/file =====

   Files included:
     1. index.html — the public site. Fully self-contained: all CSS, JS AND
                     images (shop + creamery logos) are inlined. No folders
                     or extra assets needed.
     2. admin.html — password-gated admin panel (standalone page) for the
                     flavor board, flavor photos, and opening hours.

   DEPLOYMENT NOTES
   - Deploy index.html + admin.html together at the site root. Vercel /
     GitHub Pages / any static host works with zero build settings; the
     footer "Admin" button links index → admin.
   - The flavor board (names, colors, tags, descriptions AND photos) and the
     weekly opening hours are loaded at runtime from the TouchBridge backend
     and work from ANY domain:
       GET  https://tbstudios-backend.rork.app/sf/flavors        (public)
       GET  https://tbstudios-backend.rork.app/sf/hours          (public)
       POST https://tbstudios-backend.rork.app/sf/login          (admin unlock)
       POST https://tbstudios-backend.rork.app/sf/flavors        (admin save)
       POST https://tbstudios-backend.rork.app/sf/flavors/reset  (admin restore)
       POST https://tbstudios-backend.rork.app/sf/hours          (admin save)
       POST https://tbstudios-backend.rork.app/sf/hours/reset    (admin restore)
     Saves persist in durable storage — every visitor sees the saved board and
     hours on the next page load. If the network is unreachable, index.html
     falls back to the built-in defaults embedded in its script.
   ============================================================================= */

/* =============================================================================
   ===== FILE: index.html =====
   ============================================================================= */

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Stirling Fountain — Vintage Ice Cream Parlor · Stirling, NJ</title>
  <meta name="description" content="Hand-scooped hard &amp; soft ice cream, thick shakes, sundaes, and Italian ice on Main Ave in Stirling, NJ." />
  <meta property="og:title" content="The Stirling Fountain — Vintage Ice Cream Parlor" />
  <meta property="og:description" content="Hand-scooped hard &amp; soft ice cream, thick shakes, sundaes, and Italian ice on Main Ave in Stirling, NJ." />
  <meta property="og:type" content="website" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M18 26 L46 26 L40.5 45 Q40 47 38 47 L26 47 Q24 47 23.5 45 Z' fill='%23FAF6F0' stroke='%23231D1A' stroke-width='2.4'/%3E%3Cpath d='M32 47 L32 55 M23 57 L41 57' stroke='%23231D1A' stroke-width='2.4' stroke-linecap='round'/%3E%3Cpath d='M20 26 Q20 12 32 12 Q44 12 44 26 Z' fill='%23D11F34' stroke='%23231D1A' stroke-width='2.4'/%3E%3Ccircle cx='32' cy='9' r='3.4' fill='%23D11F34' stroke='%23231D1A' stroke-width='1.8'/%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Manrope:wght@300..800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --cherry: hsl(353 74% 47%);
      --cherry-deep: hsl(353 68% 38%);
      --cream: hsl(38 48% 96%);
      --ink: hsl(20 16% 12%);
      --secondary: hsl(38 38% 92%);
      --radius: 1.1rem;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: "Manrope", ui-sans-serif, system-ui, sans-serif;
      color: var(--ink);
      background-color: var(--cream);
      background-image: radial-gradient(#ba5e690f 1.4px, transparent 1.4px);
      background-size: 22px 22px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .font-parlor { font-family: "Fraunces", "Times New Roman", serif; }
    img { max-width: 100%; display: block; }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; background: none; border: none; color: inherit; }
    .container { max-width: 72rem; margin: 0 auto; padding-left: 20px; padding-right: 20px; }

    /* ------------------------------------------------ animations */
    @keyframes sf-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes sf-float { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-16px) rotate(2deg); } }
    @keyframes sf-pop { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
    .sf-pop { animation: sf-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .sf-float { animation: sf-float 6s ease-in-out infinite; }
    .card-lift { transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
    .card-lift:hover { transform: translateY(-6px); box-shadow: 0 26px 50px -28px rgba(122, 31, 41, 0.45); }
    .sf-stripes { background-image: repeating-linear-gradient(-45deg, var(--cherry) 0, var(--cherry) 22px, #fff 22px, #fff 44px); }

    /* ------------------------------------------------ header */
    .site-header { position: sticky; top: 0; z-index: 50; }
    .site-header .bar { border-bottom: 1px solid rgba(0,0,0,0.05); background: hsl(38 48% 96% / 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    .site-header nav.main { max-width: 72rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; }
    .wordmark { display: flex; align-items: center; gap: 10px; transition: transform 0.2s ease; }
    a.wordmark:hover { transform: translateY(-2px); }
    .wordmark .mark-box { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 16px; background: #fff; color: var(--ink); box-shadow: 0 4px 10px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05); flex-shrink: 0; }
    .wordmark .mark-box svg { width: 28px; height: 28px; }
    .wordmark .words { line-height: 1.15; }
    .wordmark .words .name { display: block; font-family: "Fraunces", serif; font-weight: 600; letter-spacing: -0.01em; font-size: 18px; color: var(--ink); }
    .wordmark .words .tag { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.24em; color: var(--cherry); }
    .wordmark.light .words .name { color: #fff; }
    .wordmark.light .words .tag { color: rgba(255,255,255,0.55); }
    .wordmark.light .mark-box { width: 48px; height: 48px; }
    .wordmark.light .mark-box svg { width: 32px; height: 32px; }
    .nav-links { display: none; align-items: center; gap: 32px; }
    .nav-links a.link { font-size: 14px; font-weight: 600; color: hsl(20 16% 12% / 0.8); transition: color 0.15s ease; }
    .nav-links a.link:hover { color: var(--cherry); }
    .btn-pill { display: inline-block; border-radius: 999px; background: var(--cherry); color: #fff; padding: 8px 20px; font-size: 14px; font-weight: 700; box-shadow: 0 1px 3px rgba(0,0,0,0.12); transition: transform 0.15s ease; }
    .btn-pill:hover { transform: translateY(-2px); }
    .nav-toggle { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 999px; color: var(--ink); }
    .mobile-menu { display: none; border-top: 1px solid rgba(0,0,0,0.05); padding: 8px 20px 16px; }
    .mobile-menu.open { display: block; }
    .mobile-menu a { display: block; padding: 10px 0; font-size: 16px; font-weight: 600; color: var(--ink); }
    @media (min-width: 768px) {
      .nav-links { display: flex; }
      .nav-toggle { display: none; }
      .mobile-menu { display: none !important; }
    }

    /* ------------------------------------------------ hero */
    .hero { position: relative; overflow: hidden; }
    .hero .glow { pointer-events: none; position: absolute; left: 50%; top: 96px; z-index: -1; height: 320px; width: 46rem; max-width: 92vw; transform: translateX(-50%); border-radius: 999px; background: hsl(353 74% 47% / 0.10); filter: blur(64px); }
    .hero-inner { max-width: 64rem; margin: 0 auto; display: flex; flex-direction: column; align-items: center; padding: 48px 20px 16px; text-align: center; }
    @media (min-width: 768px) { .hero-inner { padding-top: 64px; } }
    .hero-badge { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; border: 1px solid hsl(353 74% 47% / 0.25); background: #fff; padding: 6px 16px 6px 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: var(--cherry); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .hero-badge svg { width: 20px; height: 20px; }
    .hero-logo { margin-top: 24px; width: 100%; max-width: 42rem; filter: drop-shadow(0 10px 30px rgba(120, 20, 20, 0.18)); animation-delay: 0.06s; }
    .hero-lede { margin-top: 24px; max-width: 36rem; font-size: 18px; line-height: 1.65; color: hsl(20 16% 12% / 0.7); }
    .hero-ctas { margin-top: 32px; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    .btn-hero-solid { border-radius: 999px; background: var(--cherry); padding: 14px 28px; font-size: 16px; font-weight: 700; color: #fff; box-shadow: 0 10px 25px -5px hsl(353 74% 47% / 0.25); transition: transform 0.15s ease; }
    .btn-hero-solid:hover { transform: translateY(-2px); }
    .btn-hero-outline { border-radius: 999px; border: 2px solid hsl(20 16% 12% / 0.15); background: #fff; padding: 14px 28px; font-size: 16px; font-weight: 700; color: var(--ink); transition: border-color 0.15s ease; }
    .btn-hero-outline:hover { border-color: var(--cherry); }
    .hero-info { margin-top: 28px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; column-gap: 24px; row-gap: 8px; font-size: 14px; font-weight: 600; color: hsl(20 16% 12% / 0.7); }
    .hero-info span { display: inline-flex; align-items: center; gap: 8px; }
    .hero-info svg { width: 16px; height: 16px; color: var(--cherry); }
    .hero-cones { position: relative; margin-top: 40px; width: 100%; max-width: 28rem; }
    .hero-cones .cone-glow { position: absolute; inset: 0; z-index: -1; margin: auto; height: 224px; width: 224px; border-radius: 999px; background: hsl(353 74% 47% / 0.12); filter: blur(40px); }
    @media (min-width: 768px) { .hero-cones .cone-glow { height: 288px; width: 288px; } }
    .hero-cones .cone-row { display: flex; align-items: flex-end; justify-content: center; gap: 8px; }
    .hero-cones .cone-row > div svg { width: 100%; height: auto; filter: drop-shadow(0 20px 13px rgba(0,0,0,0.09)); }

    /* ------------------------------------------------ marquee */
    .marquee { position: relative; overflow: hidden; border-top: 2px solid hsl(20 16% 12% / 0.1); border-bottom: 2px solid hsl(20 16% 12% / 0.1); background: var(--cherry); padding: 14px 0; }
    .marquee-track { display: flex; width: max-content; white-space: nowrap; animation: sf-marquee 30s linear infinite; }
    .marquee-track span.item { display: flex; align-items: center; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: #fff; }
    .marquee-track span.item i { font-style: normal; margin: 0 24px; color: rgba(255,255,255,0.6); }

    /* ------------------------------------------------ sections shared */
    section { scroll-margin-top: 80px; }
    .section-pad { padding-top: 64px; padding-bottom: 64px; }
    @media (min-width: 768px) { .section-pad { padding-top: 96px; padding-bottom: 96px; } }
    .kicker { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: var(--cherry); }
    .kicker svg { width: 16px; height: 16px; }
    .section-h2 { margin-top: 12px; font-family: "Fraunces", serif; font-size: 36px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink); }
    @media (min-width: 768px) { .section-h2 { font-size: 48px; } }
    .section-sub { margin: 12px auto 0; max-width: 28rem; color: hsl(20 16% 12% / 0.65); }
    .center { text-align: center; }

    /* ------------------------------------------------ menu / flavor board */
    .tabs { margin-top: 32px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
    .tab { border-radius: 999px; padding: 8px 20px; font-size: 14px; font-weight: 700; transition: all 0.15s ease; border: 1px solid hsl(20 16% 12% / 0.12); background: #fff; color: hsl(20 16% 12% / 0.7); }
    .tab:hover { border-color: var(--cherry); }
    .tab.active { background: var(--cherry); color: #fff; border-color: var(--cherry); box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    .flavor-grid { margin-top: 40px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    @media (min-width: 640px) { .flavor-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 1024px) { .flavor-grid { grid-template-columns: repeat(4, 1fr); } }
    .flavor-card { position: relative; display: flex; flex-direction: column; align-items: center; border-radius: 24px; border: 1px solid rgba(0,0,0,0.05); background: #fff; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .flavor-card .scoop-art { margin: 0 auto; width: 112px; }
    @media (min-width: 640px) { .flavor-card .scoop-art { width: 128px; } }
    .flavor-card .scoop-art svg { width: 100%; height: auto; transition: transform 0.3s ease; }
    .flavor-card:hover .scoop-art svg { transform: translateY(-6px); }
    .flavor-card .scoop-art img.flavor-photo { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 50%; border: 3px solid var(--paper); box-shadow: 0 4px 14px rgba(35,29,26,0.14); transition: transform 0.3s ease; }
    .flavor-card:hover .scoop-art img.flavor-photo { transform: translateY(-6px); }
    .flavor-card h3 { margin-top: 8px; font-family: "Fraunces", serif; font-size: 18px; font-weight: 600; line-height: 1.25; color: var(--ink); }
    .flavor-card p { margin-top: 6px; font-size: 13px; line-height: 1.45; color: hsl(20 16% 12% / 0.6); }
    .flavor-card .tags { margin-top: 12px; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
    .flavor-card .tags span { display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; background: var(--secondary); padding: 2px 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: hsl(20 16% 12% / 0.7); }
    .flavor-card .tags svg { width: 10px; height: 10px; }
    .board-empty { margin-top: 56px; text-align: center; color: hsl(20 16% 12% / 0.55); }
    .board-note { margin: 28px auto 0; max-width: 30rem; text-align: center; font-size: 14px; color: hsl(20 16% 12% / 0.6); }
    .board-note strong { color: var(--cherry); }

    /* ------------------------------------------------ specialties */
    .specialties { background: var(--ink); }
    .specialties .section-h2 { color: #fff; }
    .specialties .section-sub { color: rgba(255,255,255,0.6); }
    .special-grid { margin-top: 48px; display: grid; gap: 20px; }
    @media (min-width: 640px) { .special-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .special-grid { grid-template-columns: repeat(3, 1fr); } }
    .special-card { border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #fff; padding: 24px; }
    .special-card.featured { border-color: transparent; background: var(--cherry); }
    @media (min-width: 640px) { .special-card.featured { grid-column: span 2; } }
    @media (min-width: 1024px) { .special-card.featured { grid-column: span 1; } }
    .special-card .icon-box { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 16px; background: var(--cherry); }
    .special-card.featured .icon-box { background: rgba(255,255,255,0.2); }
    .special-card .icon-box svg { width: 24px; height: 24px; color: #fff; }
    .special-card h3 { margin-top: 16px; font-family: "Fraunces", serif; font-size: 24px; font-weight: 600; line-height: 1.2; }
    .special-card p { margin-top: 8px; font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.6); }
    .special-card.featured p { color: rgba(255,255,255,0.85); }

    /* ------------------------------------------------ brands */
    .brands { border-top: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); background: #fff; padding: 56px 0; }
    @media (min-width: 768px) { .brands { padding: 64px 0; } }
    .brand-grid { margin-top: 40px; display: grid; gap: 20px; }
    @media (min-width: 640px) { .brand-grid { grid-template-columns: repeat(2, 1fr); } }
    .brand-card { display: flex; align-items: center; gap: 20px; border-radius: 1.6rem; border: 1px solid rgba(0,0,0,0.05); background: var(--cream); padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    @media (min-width: 640px) { .brand-card { padding: 24px; } }
    .brand-card .logo-box { display: grid; place-items: center; width: 96px; height: 96px; flex-shrink: 0; border-radius: 16px; background: #fff; padding: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05); }
    .brand-card .logo-box img { max-height: 100%; max-width: 100%; object-fit: contain; }
    .brand-card .name { font-family: "Fraunces", serif; font-size: 20px; font-weight: 600; color: var(--ink); }
    .brand-card .blurb { margin-top: 4px; font-size: 14px; color: hsl(20 16% 12% / 0.6); }
    .brand-note { margin-top: 24px; text-align: center; font-size: 12px; color: hsl(20 16% 12% / 0.45); }

    /* ------------------------------------------------ visit */
    .visit-card { margin-top: 40px; overflow: hidden; border-radius: 2rem; border: 1px solid rgba(0,0,0,0.05); background: #fff; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); }
    .visit-grid { display: grid; }
    @media (min-width: 768px) { .visit-grid { grid-template-columns: repeat(2, 1fr); } }
    .visit-map { position: relative; min-height: 320px; border-bottom: 1px solid rgba(0,0,0,0.05); }
    @media (min-width: 768px) { .visit-map { border-bottom: none; border-right: 1px solid rgba(0,0,0,0.05); } }
    .visit-map iframe { position: absolute; inset: 0; height: 100%; width: 100%; border: 0; filter: grayscale(0.15); }
    .visit-map .directions { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; background: var(--cherry); padding: 10px 20px; font-size: 14px; font-weight: 700; color: #fff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); transition: transform 0.15s ease; }
    .visit-map .directions:hover { transform: translate(-50%, -2px); }
    .visit-map .directions svg { width: 16px; height: 16px; }
    .visit-details { padding: 28px; }
    @media (min-width: 768px) { .visit-details { padding: 36px; } }
    .addr-row { display: flex; align-items: flex-start; gap: 12px; }
    .addr-row .pin-box { margin-top: 2px; display: grid; place-items: center; width: 40px; height: 40px; flex-shrink: 0; border-radius: 999px; background: hsl(353 74% 47% / 0.1); color: var(--cherry); }
    .addr-row .pin-box svg { width: 20px; height: 20px; }
    .addr-row .street { font-family: "Fraunces", serif; font-size: 20px; font-weight: 600; color: var(--ink); }
    .addr-row .town { color: hsl(20 16% 12% / 0.6); }
    .visit-divider { margin: 24px 0; height: 1px; background: rgba(0,0,0,0.05); }
    .hours-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
    .hours-label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: var(--cherry); }
    .hours-label svg { width: 16px; height: 16px; }
    .open-pill { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 700; background: hsl(20 16% 12% / 0.08); color: hsl(20 16% 12% / 0.55); }
    .open-pill .dot { width: 8px; height: 8px; border-radius: 999px; background: hsl(20 16% 12% / 0.4); }
    .open-pill.open { background: rgba(16, 185, 129, 0.12); color: #059669; }
    .open-pill.open .dot { background: #10b981; }
    .day-chips { margin-top: 12px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
    .day-chip { display: flex; flex-direction: column; align-items: center; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); background: #fff; padding: 8px 0; text-align: center; color: hsl(20 16% 12% / 0.7); }
    .day-chip.today { border-color: var(--cherry); background: var(--cherry); color: #fff; }
    .day-chip .d { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
    .day-chip .s { margin-top: 4px; height: 6px; width: 6px; border-radius: 999px; background: #10b981; }
    .day-chip.today .s { background: #fff; }
    .day-list { margin-top: 12px; list-style: none; }
    .day-list li { display: flex; align-items: center; justify-content: space-between; border-radius: 12px; padding: 8px 12px; font-size: 14px; color: hsl(20 16% 12% / 0.7); margin-bottom: 6px; }
    .day-list li.today { background: hsl(353 74% 47% / 0.08); font-weight: 700; color: var(--ink); }
    .day-list li .day-name { display: flex; align-items: center; gap: 8px; }
    .day-list li .day-name .cdot { height: 8px; width: 8px; border-radius: 999px; }
    .day-list li.today .day-name .cdot { background: var(--cherry); }
    .call-link { margin-top: 24px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: hsl(20 16% 12% / 0.7); transition: color 0.15s ease; }
    .call-link:hover { color: var(--cherry); }
    .call-link svg { width: 16px; height: 16px; }
    .photo-credit { margin-top: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
    .photo-credit p { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: hsl(20 16% 12% / 0.5); }
    .photo-credit p svg { width: 14px; height: 14px; }
    .photo-credit .links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
    .photo-credit .links a { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; border: 1px solid hsl(20 16% 12% / 0.12); background: #fff; padding: 6px 14px; font-size: 12px; font-weight: 700; color: hsl(20 16% 12% / 0.7); transition: border-color 0.15s ease; }
    .photo-credit .links a:hover { border-color: var(--cherry); color: var(--cherry); }
    .photo-credit .links svg { width: 14px; height: 14px; }

    /* ------------------------------------------------ footer */
    .site-footer { position: relative; background: var(--ink); color: #fff; }
    .site-footer .stripe { height: 10px; width: 100%; opacity: 0.9; }
    .footer-inner { max-width: 72rem; margin: 0 auto; padding: 56px 20px; }
    .footer-grid { display: grid; gap: 40px; }
    @media (min-width: 768px) { .footer-grid { grid-template-columns: 1.2fr 1fr; } }
    .footer-blurb { margin-top: 16px; max-width: 24rem; font-size: 14px; line-height: 1.65; color: rgba(255,255,255,0.6); }
    .footer-addr { margin-top: 20px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.75); }
    .footer-addr:hover { color: #fff; }
    .footer-addr svg { width: 16px; height: 16px; color: var(--cherry); }
    .follow-label { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); }
    .social-cards { margin-top: 16px; display: grid; gap: 12px; }
    .social-card { display: flex; align-items: center; gap: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); padding: 12px; transition: all 0.15s ease; }
    .social-card:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.06); }
    .social-card .icon-box { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; color: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: transform 0.15s ease; }
    .social-card:hover .icon-box { transform: scale(1.05); }
    .social-card .icon-box.ig { background: linear-gradient(135deg, #F58529, #DD2A7B, #8134AF); }
    .social-card .icon-box.fb { background: linear-gradient(135deg, #1877F2, #0A4FB3); }
    .social-card .icon-box svg { width: 20px; height: 20px; }
    .social-card .label { display: block; font-size: 14px; font-weight: 700; color: #fff; }
    .social-card .handle { display: block; font-size: 12px; color: rgba(255,255,255,0.55); }
    .footer-bottom { margin-top: 48px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; font-size: 12px; color: rgba(255,255,255,0.45); }
    @media (min-width: 640px) { .footer-bottom { flex-direction: row; } }
    .footer-bottom .right { display: flex; align-items: center; gap: 16px; }
    .admin-link { display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.4); transition: color 0.15s ease; }
    .admin-link:hover { color: rgba(255,255,255,0.8); }
    .admin-link svg { width: 14px; height: 14px; }
    .admin-link span { font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; }
  </style>
</head>
<body>

  <!-- shared SVG defs -->
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <symbol id="sf-mark" viewBox="0 0 64 64">
        <path d="M18 26 L46 26 L40.5 45 Q40 47 38 47 L26 47 Q24 47 23.5 45 Z" fill="hsl(38 48% 96%)" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M32 47 L32 55" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M23 57 L41 57" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M20 26 Q20 12 32 12 Q44 12 44 26 Z" fill="hsl(353 74% 47%)" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M26 24 Q27 18 32 17" stroke="hsl(38 48% 96%)" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
        <circle cx="32" cy="9" r="3.4" fill="hsl(353 74% 47%)" stroke="currentColor" stroke-width="1.8"/>
        <path d="M32 6 Q34 3 37 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      </symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 2v4M22 4h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="4" cy="20" r="2" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
      <symbol id="i-nav" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-camera" viewBox="0 0 24 24"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
      <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-lock" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
      <symbol id="i-ig" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
      <symbol id="i-fb" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-wind" viewBox="0 0 24 24"><path d="M12.8 19.6A2 2 0 1 0 14 16H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
      <symbol id="i-banana" viewBox="0 0 24 24"><path d="M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
      <symbol id="i-waffle" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
      <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
    </defs>
  </svg>

  <!-- ======================================================= header -->
  <header class="site-header" id="top">
    <div class="bar">
      <nav class="main" aria-label="Main">
        <a class="wordmark" href="#top" aria-label="The Stirling Fountain — home">
          <span class="mark-box"><svg aria-hidden="true"><use href="#sf-mark"/></svg></span>
          <span class="words">
            <span class="name">The Stirling Fountain</span>
            <span class="tag">Ice Cream Parlor</span>
          </span>
        </a>
        <div class="nav-links">
          <a class="link" href="#menu">Flavors</a>
          <a class="link" href="#specialties">Specialties</a>
          <a class="link" href="#visit">Visit</a>
          <a class="btn-pill" href="https://www.google.com/maps/dir/?api=1&amp;destination=225+Main+Ave+Stirling+NJ+07980" target="_blank" rel="noopener noreferrer">Get Directions</a>
        </div>
        <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle menu">
          <svg width="24" height="24" id="nav-icon-open"><use href="#i-menu"/></svg>
          <svg width="24" height="24" id="nav-icon-close" style="display:none"><use href="#i-x"/></svg>
        </button>
      </nav>
      <div class="mobile-menu" id="mobile-menu">
        <a href="#menu">Flavors</a>
        <a href="#specialties">Specialties</a>
        <a href="#visit">Visit</a>
      </div>
    </div>
  </header>

  <main>
    <!-- ===================================================== hero -->
    <section class="hero">
      <div class="glow" aria-hidden="true"></div>
      <div class="hero-inner">
        <span class="hero-badge sf-pop">
          <svg aria-hidden="true"><use href="#sf-mark"/></svg>
          Stirling, New Jersey · Est. on Main Ave
        </span>
        <img class="hero-logo sf-pop" src="data:image/webp;base64,UklGRkChAABXRUJQVlA4IDShAAAQIAKdASogAxACPpFCm0mlo6MhKJPrGLASCWRu8oyX/Hrct9mP6I7OGMGv9b/cf8d/zPAq0H4T+6/5L/bf3z91vnHsD9r/r/+J/0v92/bn7kf7Pcf2J5uPmv7D/xf8X/pf3C+cP+J/6n+p9yH6a/4X5//QJ+rn/J/vX+Y+LP/I/a/3F/u16g/6v/mP2W/5XxGf8H9eP+l8Vf7d/tv2I/4PyBf1L/S//v/h+3H///dQ/z3/Z///uI/0//T//n13/3X/+fyt/2H/lft5/6ver//3+29wD//+17/AP//1o/Uj/E/2r9m/fD32foP7T/lf2N9V/xr5/+//2b/Cf8H/E+4rj39R/s/9/6Kfx/7x/tf7z/of/F8Uv3z/s/4fxP/Mf33/j/438nvkF/Jf6F/mf8L+6/+G9V37Ud0HxH+6/7f+a9gX3F+uf8H/Af579tPh1+T/4/+I9T/3v/Lf8n/IfAD+tf/L/w/5K+2r4N/5v/lfrr8Af84/vv/j/2H+p/eL6dP7L/5/7P/gepj6l/+f+n+BP+ef3f/sf4r8tPng/////+E/72f/////EubwNWedfZCgal2QoGpdkKBqXZCgal2QoGpdkKBqXZCgal2QoGpdkKBqXZCgalqGblwgnbwHMyU48kmrPOvshQNS7IUDUuyFA1Li6Sp/fxdcuNEkqeEHKuJOt0ro9zR+Jg8UEnGU4cI3BAH9q5pCybACjtDvEarOqVKKIh+FGuMpw79Jqzzr7IUDUuyFAx+qWf/MbnVpgIpo0iGjGN096NA85VG03Pc1vaevwAQHyk6fc7NZd93KhuKi1tu2XTsGuBQcxbvRYd0nAjc2DeBjp4284kviiv0/kM0iJszmjsDcmJynQu/xTTIrf8bjvWtpZDtbzQBqXZCgal2QoGW130p1oO+wJ/MTbiaAOY5C2M0bY0hSk4S7wC6Ul0U++qsOInBWODT/uCSg1buDTiOKEoZfDcd9mMBIglQMxcrw9Y89mKbp1jI+Qs7qLhk8D/83hUIEJDdQzhQAI/P5mC3GGX2O3OhbVltfF964qts0yJH/IM+c6hRufOBfvshQMfZe75hjkxsG4rUvQtPP075NQcxqEhOGT9deqD/IO1k44fAnQxgDg2TLcUMeBRPQP+WieNeXkdsOcZkaPZ1ljyDvoduE5ZKGIbWM+RE7DYv+sp1lwmxyCB/CdiiII5+RUqgBr+LifJ8gnZLkwaMlylMxYTJVKVNUIUb4dGLqaN8qnZUHe7/LdkB03G7s0BLqn8cNtLUgE5JWUElwCPpjUjv5DLEl2svS0kLm94Ahn/I5OHj63P0nvSI/JDQW/fZsXe2lcWpBLvFGnYy40HdJR7PrahJLq74k882GCCk8p5aDbJXqSqyc7ZJx0CTK8fl/RF/X7yGfZRlAEMLkFzTyYoceKJKQiQZhW0ZL6XrKNPeg3Bb1u+2v5LBtZmvSkocmSYJdIgCcmzB5z5/e/S1Gqbc7rbk/IhTz4OpKefunuGek2Dgn5iDnDWlZ6dJFQelhXJJqzy3H3Z9nABzkWmyvpv51iN5eGGfJUGu1UvCzk0tiyDChL2zdwDtwdTcIuOzCrfmLFJ6sherYOPTK0ubfv7T/DNOeDIcoTnDWLrdGWT7uMrwXwpvOAa3G04QyhitgHbbr4oUbypoiPmA7XChWaaeBhrvwue7oxgyQ5yiJRWmuOXH0oiCkHNrWIDBxWJIbl7pChxTPOvsfNiB6WoCKWzb1Vov3V6GHRGAmO5fvA9Y7DMCCsFZqLHq7kEL0J9sggKcI93MzlaaMaYv3HLXpYMcidmDqKyM3oTTIuJqM2nCTMKv7NPjBzTco4VRVJodBTnKgI3fwJAt/WbFpkZKwiNCMxQgxEPhNm3kh0xKrTsJuvQJ1dS7IT/mFLWf//uyRlokrwZv45xdJccf49VovtOUPgIVCO6vmL2xkL1wYeGLCMUpP+W2YHyoyaI+R4MKM65TVP+sjE4GniTHc22yqaD/xV/W4seH+mxssriMF1BrW8YUgoP4mD53nhJNXtegio1dA6Hnsi6ie66F1vEkHKxVrgxMPbrvX4Mk279Jqsw3QoXJeZdoTDyhbT+iACo+gdYVuDzVd5vR2i99uf6wBMZU7MwjWwg193wfN9+Vjm6GdinsEhqjPcfUv4162lbgNuzf/PfkFmDhW2X/8ly1ECbaRAyojH9EV9Oov2Z2JElGbkPjH9QYEXmMidKa2CfjNZwRtQzcsLIBgVduvDQl9+60C2VsoiJuheS2adWPuTNy0AlQXwuJdm3w89g2WP9EXQJwHzJuxKRMDVm94PHAF9z4aaGUYBub4lMTJ8cpXSggWgDF2c4CevkJxITtvciTuBOQeTC+4mL2CBSF7CfJF55+KIJft8UaLhCzL0JDQeajs2KEDZ+Bcbv5ZYdnySGOPeV2ILLa0VOqfJb+ZqM6ZvuCFozY9HHq6pEEe1tcX8FFwXqRZdVOmuRybRxoAhFcziQEXryGM4gfeUmNNHuQS24DiHBaOFLr4Q9eQ63b74d6n/7IvHGU4csWYIutLUF+6ayWIAw3OKuMBo2DRvmpAYxKcx+GzueRR/XRMKYr1hQFIRrkz54mocUA/YsqC/7+59wmqK4aQ3XE3eWx2bSx+/7zHXtovDOczEkoflljuS/J9+9tXLMzdKM2v/eb+IGwiLRTBgR0FvyE4SXh55NjvorbOAEUWzy6bS11NsZEsDVnnX3/kDHUZKC29UVFm8YQZiHSiA3xjkPt/CPdRsAJ1G/3GozuPpZEmU/qs2HyebQwphTI3xs9ljs6nVNWdrd+FD6mpaMIs/QMezaC8EOtVWrsGNNHGB2mH06/t3NBmJ60sSl3mLMqtOcBNlLSas86+u+qfA92BvKqfQ0GMrIHr0WKD8aPTYW+AiawK/fNAO/dTpvIN6YeEbdWoiYGq5HfkbP+OhLq14rEfvdv5RlJOavIQjTj3d6FxsxZunRMUd20dRAEzeD/KbrtY2IAdWCRzObYW8ZGZHdJkep63C9Qh4fHnX2QoGVXMwBi/6+/jY02+7gLr7bUqyMwc9uFzlDjtUC3oBn86t3t5YL53VQrk13EQWRp0oRdOolxwiYDfGSZIWl7J565NibmsB0MH5VkScM2WzggJVc7tyzJGziGPwCoG3PVsjNHw+ecNEnIuEiUkjy0/mKC7Yg/c5bVJNS+ehKwZxRE2/GoTygilZPKNJqzgN9S2vUsq5ifMm70iSF/GLX9xgKsgSaZzP6TRKwSC8oIRY7Gu1wk7PqzBP7ecVIxVB0NAMjZ8dZu7+Qtfzge3k5h/+/fNXMv8l6D/n2uJiFbuFad2daBd12Yo/y65GGNFvhj3Onfbqp16q8TlXZqWOW9LLLKHPtLX0k/kRfW159/w0fw3Y+uPv4b9xf/uxr5OnmDmxP+NufljEw5tgdwO7U9xWkn1ImAmVOQvtw9Xy4ErU2R5avi+JRvXw3RizlEkCfi6WqtrHmIho/rbSmgTnUW7Ihxi1cDFrzmP5sxUTL//FycEzHvOffwMuRaZJ6IXcY+nbjYchyHPcMGzM850fEsQ9racb1LD5GD0Pw6GjHILq/6DRPO9771v0U9JDhsOHmOAf3RTMb+uqD9zk2BxKofUNcSvsNdcE8Gk7tuO0izkiZlwh0r9ncQEmRlIrTWEuRHFkhmtp4QLwjNLoELjGL8dJQZ/ivPyJy73VkGvcK/GR8EzMoF9LkZbbYQNNfVH8EvSOu/SIns5XKzlF5K0YsNIX+ythBzeAoov5ad8vhPGPG/zD10Q5IqqgUn5OWAiO0L45nnX2J0Wiy5U2apOXW9oQMoV+GqTTfakgt39RupHaA3+73yUa7eH6280XwKqtjfqiJU+fIgNPv5U6S3huIjuBR2XplTpDCyyT4t7aRahATJYVFDmRfP8vJ3sGk/6zBSGroAaPl9m+k+7TNqWcGJF1fYQ0Mnh7+RzZSV6kl4oP+0D+VXgd2SADaF4RE2yrG+ep7tYj7OqHv7zdTdlS6lN8LhQWEQYclxc711BKPUkRkKBj9fT/1cfAH3cq+SOu2zNtgVYA8gSzocByKXe26Q+PvBhYrEcCtx1PsThJ8KO6yV742Z2ICBP9qW0I0fBqNxuB5+Pg07jP/nYA7I2KUB39m+q4IKgY7OJuJ+H0HSYtDFd9uMgXfEbfBkPCU9FH5MnaSprCfnTdrojsw1zJLy3rGjuubEU7N42SwPt7gKuQnwQBqoXjgtcGSRlZ8f34Wyzw92JmZkbJxqWnCpjCx+b66b66oKS8pxW6um7M64Q/t/55MRQd8si8qCCT2i9prKiuGC1NoOEeN60V5eVTue/r6hldswCSMwxFegkpLbzHmip86j7mm/EhDI/PDtQU6Z0hfm63ItqAxeY8IsA/iyEFWmA1Gv7PX42eSD5u9j2ExCo4pObd9pmVcwcJMiomhZQbo9Kb9vaEfJncdnwotkqBr00lwzh359CxfVumO5LccysX7jZ8u0JkxLQl3QXl9sm5x9ynMKjQAPLnWXe7eeBIoIq4cORmuq893RksZAkObAbU3MbjzgUmOmOpC/2vwYyvq7npzmBd75TocsFaUMGdoP4cZTiUKrMpWoRNr+HykA+uveUuixLtZ517T/fojZl5lWR4j44xZYx21MMp7ppCrBEOu2Q9YkZwTtLbnH1ImN42opvOLRnWzXOZvpZWjLEVtoQ1s2lqjUXdD9TnQU9WHPuU4d+k1Z519kJSV+5U//6uVGpr4jbBhbcA/V/zzr69zJguAso6apyEDpA9zsaG0AS0QtGM+O3TnWbNB/ODQPdytvvTk/ams81oWBhAt3r6MPhYPEaJVyxfiriAwY4ekvEgwrbaD4/cHMTCOc6fEv51ZcvIt6Uc954rSaLG9r1nxJgB2kU/s8WSKIhGT7kH3f7+Vm+d//Z7NilboTf/+Jw79I5k/pivsbOAzg+XSzbzskaN/sC/Pnff30R2y+gKwnoiIsfjSRXMJK8RAsGZw7rB5lgC/sl4YN7XmIq8pQi9OBg8I+EMvad3+IDMwGj3KA0l2lO7B4581lOn5TrLXmRmkZ5r0gOpa0tNXIBcM+WmfjcfZ4Roq8CZH5c/UiXrpva+5JcHf/qkkTa+oJNWcjTL6cNIAmL/jlBSCHEjFxM/O75rO1vYjaWg4jgFup6I1+/1PxNFHDw2k+emwByY11PulaaNk2voHfnUKMVwfGIBG+j3PaUs6gJcpLHKVade/yyRVL9IMZoEgR2h/st3CK7fAkOBLC1aNz4VIQQ5y+2TxqrA7eZhuuxA7gylj886+x9f1Ig/VgpCF5MNrSV9SBwK6Srf2f3/ktQmVlVQn0C2Szc28FgCpUKRzDnH3afbdIlMCnUJwWCkUkcFhu/olXzlEVm/J30FpxXlF06JVXuxZdl3TbJSAFoB2hu8MRqq/tFhjotHaw2QkImBqzzr7IUDUuvYrS/wKIDjWF/bBglvS4xsRe1FmOXoi5W4msJhId0bWONz2fjGBGBHU0SaXQqmhONKZMHo9bAeVkKKGvshQNS7IUDUuyFA1LshRb99w+K6fIXhClyveQvzdqRSORV2yqoyBoi2OHtkMp7JeBvfQQLFXDoIml7WfQbcgIB6QsfnnX2QoGpdkKBqXZCgal2QoGXQ4sjTLTYBadJ+idTS0MCOLtuPiHEGIBWlgOJ6EsuPGb6IEjBQki+pBRWQeyqgal2QoGpdkKBqXZCgal2QoGpdkJ/N/VJVyuv1k8UoNonaVRH3//k5Ls+NhKVpCgal2QoGpdkKBqXZCgal2QoGpdkKBqXZCWKddX7TIe+yFA1LshQNS7IUDUuyFAxQAD+/tYgAAAAAAAAAAAhquWyPCP7DnG9oHSnIGzjbQdPeYPh86sQsMoJJDJh6tMRhxTtpGoPMzony48KQl+OldlsgI14+bEULUjrHbsUKyiCbwEa7ZLsm3dZRKxlmaGAO61UURURLiCC2qwSSsXN5aO+NiwTY4Fpy5mjFpNbjmnKVUGoPgDRLSlVDeZDeW7/ceAAAABe1w87J+Uw+hFjlgkXfG/mT4mFyF/ZVXFsvuizZsBPLjBply8Rj31wy4sAsp4/u/MqV8VHXC3bbNJTAODRu/aQZeLIxXsMdLclc2NUABwjmx8qjb6wsm3PRLV5BAZYXGnjtOMjrMyqWTKIHf5+ZastTHFj/jSwedqkr4c4OFCLkNX4MREBkU+Rx7WUSrhPImzJFZDEkDWBWHUcRJWmK4DL2ielTO/f9hUO1PufxaFILcvAxRji3Zt9z3v7Nf4mYSeP2TXUUsrv7kV1XJ2bF1dNlLs473WPTRGiFy5DZnb0tOZeNN4XSiR08PPb0jZaFkr4nAOiiuH2MMpgfQ9a9ebT/J1WXuyvyUChwjIH5UKsFC1As1pRTIKWnuFCWAgIaE2entvtg4dFe6yIz33eQeX/fyHX9izw2Gq9pdqFLgkK8sMscmRJ8okZQxG/IfK/bSf/XOeNpoCpmjqGBFcxJbncSliwT4nQdLor/o4GbrOfAwkUsqGNaTdaqqYh+NsnDGZ3JPgpdbbaRslGfLUsldmmLpsfl+kYL8jSPnNP894Uu7Wq/S2+FXS1lDuESSBtXoeOPWYPwnan88e2Ee95R8lS8piVpfGbYFfsuM9EQuar37M3dCQT26XXboUVGEzDuItj16i0bA8muHZSTGkNmo9gB0+U4TcE56/Idg2gVNMwd4I4m0nf9OlHEc3XD3KOWvdCsURN2xeaX80AAAAEw8IsKdUTsKOsj6Wrw3AdOvIbg02IP3X9fB4swwd5wW578HXrtLPKLPJviZY0DKLBqkWYCvjjGgzrj72zzIIurVbCeLG1Hd7b1Q0mFYtVXgkGpS8LOmYdxpRwYrra+7ooV32Fs+EZeWLzSEn48Poa2tDPUHj0s4RCSaidvPF52+ID0RJWjtCsXhRxUirVCR1xCwDJYJQdTtO66OSMpRE5yc2jQINIFaFjwzJVlveLpD5aG2N7Ny78uNphInv2P9LI+3tJx8bt4fj8bnGMCHYLQvO4MM+4+sOJ3uvwwRGL2zN0ue4CUB249aFSYAnNjZELvojRNKbYHBISJTw4haWJpgoPciK24bV5FY0R3Hh/eiurI6Nhirq+Vz43DUcsWd9qlRdpje9p1gbFtOSWhsyH7olUTA35dnX6tQvpasyZBpt0MzmMlENBHmRtYdrthMmO1AtZMbhZcuH8vRv+PqBIw15LPbKNLK9KxSbzv+HxSvw+DvJsgqQGec3rm4g/nMXIjySTCWb2N/4qlcg6zqv1vCReETDmvPCMa6+/9ULH4qDARDP9H/65whgxM/7tZ7XK7tMMfBKYBK/sfHVmPPA4U61fGK+sMsAbxWDWGId/9MTldxwaTUs/53AmORfUjuv5sZFM7uNcU2L7o8Zd8CUEZUj01WP9l8JldSzbZrIIFd2AStwK91MaluU9VlY4eb02kgj/1BsX5phNRyqOYPX/r9jN2bU51+Qcs9h0OVwqGZsv2ewUsgkh2bUBCsMvhaiqTwtki0uKT3ak7tsxdr6eXEq5sYofWLVe0lwnzPrg6xBkepsVZq+gITR1Up7pLMM0PelPXPmzrhaO+kkdFiwhWDlEULIqdKQKcOkIxr+QCy2sDFKzrGBN8NNTCxeIA3gRr/26D6wbz2HV6T9RHn47ulrfO9zKCDJFnWCsZsGmegY5PD5uEn9ds+pJ/zIEbK9No5cQQAMfoDO3gEalL5LtUS84ivFfuA3QzkQ9htTaqpujLsM/VBZlGSqYg5Yql3kfWCadEWyqyWQfGZjruJvxvvi7Rw72FXIAI1bwyo9iUwEAwBnj6XFnUvnblQezeBuizbwvYA0tbDjI9GJpl0SSdCE+XSsJHfoK3FLTmSQVxKTZBPhKh7sNczwnkM4yCE2Q/cO6Xwbx6gziphpIvvLEu2Hg/vsjAr/cZ1CSNtaMWQ68sv3TnLtnGLsb6ZRT49cJmJRcHELKoDZ7/iAtJ2OTVr29cOlPhf9IStE/DRuJ7Pd5t8SS5EPpZt4TXeyBXeP+z/YmTZnc3rBIT2Klqyj9ITkJ35soe3oZyDGrp2E5yclEHDcvNE4AmwOzTmGYq2vAwJkfZzndKRUjjmssxypXUXCVYLC32hjObW9pGdo+gXwmfVUYV69n0cd6fHpW2tnZhMkpGYY8O7VhJI40562WLj8A0AZm2XhQhB8yTQVf6zy1p1B+3o2oIKgATS3C58HMezAuk4xvn6Biz13+q+5qRwt9UYGARrjfW31/lvHgGH3v65U6oYleD+hoVcjYh6BjxR9mC4q9tBPRvCXdTCYyciQ3G+Ez+6H/JwGcw2u7sDND+lmMEwLNt+WE3wc2oqWXp5uMnVvFVwOMAOKspVj0UeKhzNwxtjwXRdEKtYGmTY1z1HRSp3WQMM6eRsXDcCFvsPTGZJg+UM+Fa6nAWh5uSg9Af9tI0HDZ6LxAY+XnTV7dfEouGknhjf2BDzVB92+RVLk/STq17zn5oSSG/Qdbc56J2/aAUzv1pS1f1SsG6xOtDb7d9TzaaWCwe0l7euoYSJ19V91857VBjpn2AzFJ0zCkeAGjO4tojEwvN3I60GcNBSpg+Ngk3vCAFdSHW5ctLTaawYjc/Pj3BieNqCGnOe/ENUMRFeT8Y0LKnqyeJiOghI8YokXWWd6JOQxqhptI3NCpscybc3FD5mH87G1luQPUoYZfRoFop1Kq90RsNYBVMud0ZfN0lKh0ZN/tGnI6QLU6CKOh2Foq8cYkjjBnnJiwcCyZc8+l2tYjLsT/gR4htABeCqYOY3jFXY2moujuCv/o/H2sRkIsI7WtZtW/uoUdMidvcPe/Ns0MrlwkNzsImSONZ1iqfbxSWsAR1wwGpP4YGy9CXYxmhaj4hWAnRTJU9QkDJncSK411fgSWLZsLgFl876qbGqMQ6MO0gUyzKv1JfxmsSwhtm3qlbcJqQAr6ZHYkNajcDsaecwsE3K/a2MOdm60MUxw2Ed8O1t23mBFY1cu+gdiDCcqYzRFUoyJRBUmaQs9dlFlUjY/uBkyY3Zopx9r2P/9NClVA2X6im6rfEnug9422zPc/RB+op5Q7PuyrR9wsjJgZ4AUGa5X1rqHRB2TTekvry0tcGYYKJ6WVfu/7YAzp+txuLKlA9MHtiIdrA2euUIuMR38ZCH1ah/6m0AKcT+fUUwP970QWgF8tGsFeEWPKTYaIaY2VB4dxxFa/wbC5vbYkq7lFzdmDe9v7ZwupR6pCrBLlo1/wh2tqQbRgka9NX1r0sD07q6B0Tyk4u3lYMBWGYyHZdor2LPxRm0D8X9dqIrFMjSduiuXT4299XLlAVnEdf0nFO2s30NCJ00mLHVJslcBffCliFbHU2Of4yEBx2zBEZI2WR0ETyQEv+qMxjl7/0EaejQcSnS3Uvq8OA6PZO40YA1muuk4qhMa5TcKPLonOlKOaVlJ9gqC0VpvzAislqS7clYgUL3jQf9UXgsLdF5s49WOXytsWBGItcz/49Ta994qaMVWS/JKgWlT4K8NPfgYMHsw4dktoikvecKBcNl73om84ZX3KPndrDKMn5VFG7jWSksH6ocIMDqU+0u7c/G48On2m6GKMk8EC8LeXjMgfmusfgLLTotQLdhfTWGwxa1LkMTLEop88PjDrZmEbWcI4b2Vjw3mP9LM4DjbODxmXP+8eGiWMHdVvpnT5Vx8pLk9if057FJqoU8lCMb1LhWmkQSade2q4oG3Q1jIHyO+N3oEQp2yhr6Su+9fTo4bapU6Y6cL68uNfmTRxoLtrGtlSVCy8U0Z6v0fcdLd7DnWyce5jPUzZrCAt687g9m3NSh4/2Qwl1yGa8tOJNupkfT0IE4YS4xZFg4ef9vAoiim1YdcAqxAXB7lg8TSsGbkGwEQ/4ld/vaQShV8/J1mHKsxM/eoafOr+rwfQc7nSpbG0X1855pDeYLKio7rjjsO36dJmy6d363fw57XkvJNwca7oE7qDUwIHu0khNm/gfA5kqpEhYiBkcHZsJ8hqD0T8MFszjaEp6aTGE3LA4v0/UKFYg/mfErAU3LJYeQL56rWK5A10XjuxxemHQn5IHJHFMyZpXAUHrnV3Xd6Ijjox0kEATd7AFv350etE1iNn9nD+1Y7R10RRiqiRxk68F1qZCM/dmhI3qXaqibsVjwedgzSz5blE/biprz97i7Rfyy3C2xAKZU0Rh7uoxa/o7+bFCyODAHAnHNMYbXS5l011a2WQQwEPix9pzJUjeZ30CT42Gy+U2VS1W8cdI2iXzdKgja3nq9kEzOajyBnB+KNGWzKIxFq2YaaZAnnaMpfWZM5EXoKk/uhjZxt9kiRVI8OZ234l4+hJNgjirgofhn0bCG1Ckqltg5/UQNf1lXlOGtIfG5ogCLzfWiDieoYSDOgsUq1cmbNcjWaSi1az9W85AZy/+lHmTMxcsTRL+SKoDuvYgOPHZ+WYtxmvWuisvHo8qr4OVg8Z8zACa4V6DCvnUS578T+Obgxl91O53/kpD6kP+/wXpZBhzanTEMKtDJlgH4M1OizWxE2btpjGOTbLt/fn9eTpeYLLdg2oDotaCUm9euH66fc8RajfEjbnZ5y7wnf5K0gZ8hPo1Kw5D1JXEercK2Vppya7ltQmmaBFm2P43ELWg2JC4oHut7EMUGAKVR/akqIbaE+KMt32jxoRfHJbzcm/7W+rFuBUgcR5AIoiUui1ffplmIVv9Im7PgbhfxguEQGwtZ2VUEPqTXnm2F30goET33UFCe1YwaKPYh+/22zxgyoFFJ5dO0Qi0Npj8LZM9FlVFVnDPnCsoQB676rOvlBpnp++Px+Q3IOOV56PwiT7rAQ3bxC7pbTBiZ/ijheaXDGoqfjr+WSYdtVqRrRZsheb3NJiq/YeMzZxZ4tOpKK33oJdHjx9k8nWOE5445OCQGzz9FY2vjInDoXzoBI5Pd1ZVTSYslOtKtZJy6tTFjdBIVmq1I9G6lVMSzXNX4CNrru8dfKQp1p5bNhCQS2mi4jALnhPFqctQ9d6yCLswkIwWhG7G8Fa3bwxhuJzXjlhHiBLobngvrgrnCTO52UDscp6zobPKCa2zYwju1W9abCLBbhchai4U56wfRlxZsU+G52Mc5PbFc/TRpJR4i1L3riTloVsAjrlTA/fXofbqTS5hOmin4nveNi6ymDz+PM66sZT7J7WZ7KaoZaZYYJ0ftgL0vWEPKEVkJVhB4xyKYQPJL9axiLeULOZVLWqQNDlZwHLubL8xrS8HvOUiZ1eZaor5jsAO1xzcEp0FKhOeWqe7Mv8OIBF7Dnyks4ZVFLRKi615bTnnV1Pm30xsMrTQmepqf0kInTlH5sTl3ns0Ixtkzc9Tr2v4LfiQtP+W+MVGkUm/DQc0Yb4CuQQl10hk0ykQnN3CuQlEMAmR15WbOCVvf7+tCF8Sux8LxPMDCef2gFWZ/dWmS7AaybE1c5u+G88/VWfvPsyuzV2rHMjblLQ13OsQADPfiK4lxU3l0yIXvrWzs8XYOmS+Bz5sWv4mGeWQfNd5DYWgLxYQyYt+vsXLb3q6SKdnCtq+qbgZp+xakKatxYGuOqXQ/MwV1UVN3ZwboZVyJV4TkCSAKNub1licK4zm7Lp9A1pgds60iMCYDJvsCY2V2A8Ej4OY3UYJVQhDEO2LGTitmqv8x5zws/XlDjsZej188Uji1WFPEGr8NsNAMT4ZDzL9urjayld4Gg/sQ6zjy2U4gfDMootRNfxOgxjzahBvJYQAGbqtXEXQ66+kqCWOWq+mv6fvpzVd3dmXfXFzvcAF5yLRJedSlM5ygMOesp5nm/5IVYdcYSlfeWwQs360B/N4PetRI1we8+25OYmfANdKoLtM4N1gAUv0n5esaagQXW84MF48WrPvO9u7FWGsp5LjgYhiylZ8Z11/3WXkyeBsM5P7r9N2PBEaDUv1O2TTo7TDxoRmKfVoG6sbuE6qfdL3NHxum9lsr3LGkao/lVorf07CDT0t3hAJXysLNeUDt0aQNqCkg/QhTeCwYSiVRFUNusRliRyC+kUsbxVlGk4riAUFXL4JQ/D6puYne5bCSZknr/xg7lbQ88YYHxFrWkUBKCZvDtwbtRQbEo6y6cU4WaZxHTY4HkWq8vfDOCkf70FBQ83ME89uysy084SbLjVhcE5diHg09qEW49GXJ3kfV48A4bssyccdFJitge8teBQ5C4GG1M+WrZzNVKFwFyDAgxnzy3HXt0qcojKZaTnsY2o6hYsU91/aphfAvWtQ8A0BcEH9o2rvxvTHKP9mrz5I5dEXZ+KFIuUu7P603AW8ts+bwx/x2Ql5XWFdMLAo3ylBr73yYtDUf/OjCmsQtvvFgefulLWj1WoJF+qJjelLa4aoEoTEzvOUFR/CRiuBNBkoz3iZGmy9A9y2Zj12v9a/tLyScYdm7Kf4EmCF4X0dVzt0c2/F65MZBbDOD/t4OiFSK+PuvjUkonl5iYzJH4WEDhtPEayXk641QOh+gkxoRcmmvhFt3fXned0RjNxjiE7spwjbRE/vHngwirWZb+u9gcKwSYuZocL4xot/gyJwyrfKG4qHGQm6SQ/UgriThjT5lA9cI3FveD2L3zyuDXzriBrzvfuexaDcgeOny6XiLv6N4CGrv4h0rcrRhQcJTZfCuo0fmQ4W8nWnr76x2YxooNPyb9M3S9Z07MkQ4uZH7ZJ5jJufxuXZtosfK4nPiS2I+80RslEdfeteRlIOs/ebuidpm1sdww8oQkkbM9Ns0YuzcgjoRnggPSqH0mYS/+Pm9kaxS/Kw5Unjj6ycG6lJpFm11LtlMN3jIa2tLy2yS0DL0mg5pIseseBiI0UdioWexSnofqYp/gBWvT6i7SYFkQ50EObmNyY19QASVZwktOb7ldtTtwlw7wtZAdbGwVsc2UK3B5Q1fQ7jgdNNSorpjSDZ9zUROkRoAWsDshCC9QCxE5clIGGiPrdmKi03BkgIEgGvWbcue73lyPFUFb2roehKRw8EEQki993WeWvmGdw7PlI4NlvZcPQpcB/TJ07PAnztA8WEjeXDyc2JVMA+k1U6Dy3AqUQY2t1DdZb/fzvitZAz8RMw/n9Cg3wVean86fVVJIepOPoUPmMIz+IIhiFaL9I4lNuw4mTGpuvZhUUbqihhY+3VQ99w0JI3HsOrsEJ2ci+KWQHUHchskIDqYMx8kiMeubYbkqOK1K/RpanfYTuei5c+VLnkCF2ufrRYOwEuHVPCqrHH1PhwixZx52MW3mJNseyf6wxhsG8y6YW/NhcobwytBavVReDEs/qvgRuUW2SF3o+TzWR8r1pEry6mrtDx0ODZwqpkrr83WJ7dXlQEKDGUg/nEHYSAHsi+wG6e+uwwtVwFTLKt3dHlb/LNutvprnhBN9acdXFOGtM5Vp0D+gpeoR01GHF/c/0DVtYCQHxyS0qYyZzeKA+0WVINlToNKgQ1tf0vrQTfu017caisUX3Xah36QLWxomdHDy5Oil56wn1gXmDvlT0WL++wymeM2pthpuhMXqG1jYadQYVYwpvhjFZvDeL5tb8Dq0lmFsW0/iwpgo+447VLwzLBnI4flfHWn5zyDRd3UBsvuJYHc/neCSstxFr/Yco7DaBFpLa3ftS80lxzMie5h3Vw9/xd7KLRj4gE6UdYwYiZGzPBbIQHj2uHZFSTpTOyLAraxtJ/BWOC4aSIsSAq2WLwVZStRNg6L1oDi7yvtd6vngRtLGoVvaaT65FO7xJtcRV7D+C2tfp7u1bkjMFj3n0bZ4RAqJSPaSWk+bkKjm+gwYUfKYYGP4QB+tw26JZqDIPFiFyLHCnUOvFcvQHsxjwubnJNHYYb7fAjS8KK8USjdWzecJM2z0e+Aaov7U0ml9HDh1MYqSbr2FDyc2JNlvKV4gLlf6uUhluTSQ8MTJ9okfneHZWB8GOMe+MS3pS4k/dEZYQMhlDHAP6vGC6VH9eodzesi48EmodDfox9xs3io1PQECuI9KkiRUS2AhuEAiqn0KPK55kNtHWfAWyQikMoA+MnBUmSO2qb6Q3CFuvNAa9hnF687gM8mjK4Zk+jGvoWuJWaxTkucrZgQkbkyRg+A2ZokmksnqC7OqLRfyDE7w9Pveh//tmAtpMg+WZBjxyTIZYdOqUbeD1yKXr7zIGyQ2gAjkoRA0FuSKFXG1u3rcned5WQFcivSsvWMdS0tRqIDwdHwKzIl1XW4Q/Nr7ZUKy/1QUSugxwUFe0DnCHoBgOBMMwU/sr9wbEAFnBBLrdelCdBkHhjMCEbLrBP7CG12bBpKAniLu8IHmPP18GN8t5DVwkQJ5VivH2SUXaLDzkYUxpP6wLfKSxKP85UmDvzU5Eou/tOcZ39ZiqADXfNKhsxatFzclwJzOo69LObIL1kmrIwzW/Mxink9pTfvAWCTFAB+V5bRFKVGUUkrvD7AnvfjNdKUazz3XAmsvkFlMQhzHY7mSCyVcr3PLlivx/f/Ed0Sbsg3pOuXjq+y8CXrdA/Cv9N+iBie/E+EA8+Yxz9GknT1o0tfQayRgr+0Bunpjk5Pfnb2mms3pI2NiaurbChXowNDMAA/U4cmTsJSHs9WwwRaeGkPh5dOCBjRfwaaeeCKjgONULLzaYVkxDoIJc80Zy6AltoaAVNsCfnrCeFAnyXUWIf5r3kimjuN8u+AQzBXgQlOUmrqaErz1wI3Rf9fA1+ROE0COy6trK6vrlurFa2Jv3WjVFx4ipkdxZ4nusik3zrBWlbg7nSGIoPPrzSpn/WMFLePGrEVTKmrrFGf292JCvUZ31aCX8xrbGrsTCXOB0gfnrlD2YTsTHhcnjGoKGiozS/fZknpAWmA79mCxTNmaW2qRyDGiia4XR95aaiBz75gxcIVeCbkxty1t5QNuYIXb2XNBFtlSWrjKX68+CkIyPiI6Be4TI4FYT2HcD7fd08pRRuTc1h66BneHn3NiApRRzunqD7xcdYLRdmuSmiNN7f8ijrCL7E9L0rRBBpR8wz0J7oxWWRcBFYcPAsclNs10jkSPc0H36ArIlx069LK3H+EgSuE91RU4xr3q5VVrH2/C8qJojKhmX+5IgX8datmnz8dCkcfs9GOTvhUl7nKiey7BVoUhw4439VwCEGVC3AvDyRfk8sCQFzSP4Wzsyx5LFq/mCxLR83NRytk9mrMlr4FUn3ee9iDGrfvw8msOYrMOAfpkqute5s8srVHEdHvE9loi99OpTXy4TcZXsKKm+H24fH1oe+/zsZYt/B0DT1FmEDQSqrRFJNTrFuFFGkRY9pmWBRZPYVoMaK0CWNGJMZzT3EDZj6d0xwAWaqSt+q0HHnc5YVuOk4mgZKx5sJL5o7YVCHaXZW3+NqBrVKo65cv5LMESTYNUQh71swSeY5qJQXdCKyGG8V3+lEQ9jqgrxfYhs7NQWfVMpk5WX/FYmLl41Nf//oEtHjn0yqleZxQ31H9pU1NClVA7zpVScvNn0j59sIrkYQopFRPffbrEZ0j9XmMUooR4F2NMSuCAfMSdhTdCj9gf/TsxBG+XZNVOb07WkQWQ5wsHTWr6iVljsKU9L8wDKZqO6N6mEdaB9i+DdS0og59N9kNHGjDzhRNiXXg/ADPOmbSV/3e8oOzugDLu7g3nnnUX0AHBUApeE1MmwL4nPJRAn8CHDoiU/IEFnhik1Y74wLrrJH4fBvti8x+0JvW3IqBsScD4Xta4iuZ3XKjLaS7SUjRV1HewrNHB6O2q9o68ckBSJ8DKwQLTn3gu/vg14CBTbZvpSmlH1XqEGxRr/9Zx/ni7m+E141XWYWiZX11KZlGIEm+Km+Ctcyaxm8H3Yf/nA714fPmih/Utm3BBF+JParNyJVN0oPnHWnAXOxhhIMV5ihEHmCamEAhtoRvRfDMjch7ggswVCqLyo22oc4FRQ1GuOJfCpJeR07iRAw+T/Y6LYpSOrohXVH/ujPFNR8uPAAyzE7TJUo32PqYHB62eAA34RTMI6ErNbPeQBRx3rytMUJx12wNXrkjy/rn0LNegjH1aQUNazXY3Ch71ar4jDvRr3GO2AEslnnd5cECSUio934R2se6NvBfFBRK3lN0jcoXEEFCE/INyChfrjqU/vUE1w71M/3K8pEnm3ntExAbg+rOm/jHzxFGq3WFH58KcGwqCDAJETCpW+HxCzPd9F590oDCKa/bCm1sWOfv8iZGTnOKfSOG3y1Y72mb3ipfHkTCVxT+EqK1rRucWHdifqzYmrdPOAV39sC3hYwNdmhMWWBE1wtiwWxXgd8dPM+BZgJb/IIcW1uYFHL/Ot54JyxXNkcv6RXCVdWjNYWF5d1tQDhgFqXjR96kPWFobhriFMWKRGIfoT4JlR1YqTWDonyipfLIY+5aoMFXjWTKzFfPzPJ1qaqU+uDcbYhwm+Ior9tuSnT4c/PhKNBI5cmlyaBP1n01+9K8MgM1QW8SKhnTMv1HIcHM7VftPWcLj1eOezgOt/NjFwegBt3U1sH2VIBb13eawSmNFgoGClPFERATxX+/DW+ITlLycslmWLF35/xXL6iNvk/HN3EV9phT7bDQ2d/s0WsnnLlSEKym1wzFk1E8eNqYJSb14UYB4DrVqcCy7E2/i+umPsCQRs8eQgAJEIBG1z4oOQnE1F7tIuB6BgsndcAOifq/slma6NAGDfIs4pjxXX9LRgMw7wY2HcdSbJqTX5WsIuKtRwYWRR/VQcUsnmZxrpnqRmtXrXFKEu8MECvCjOYQuKJ4iNnDZD1h1tt2bTNlBD3S31OQp+XLo3BsNQFSJmrJp6/6dtZ8Z7D2P0Ck8oTBqc1InwhBxt4ROnkDUKIYTkDsRu5utaYemQBqOeWeib0BNuG/qSCmt1E8H7OMrLAcvzOIh4mYbUe5/qMsYwV/eMic7Iqz7y9i6cFnH/WzdnoSZmIlE08yGA7mGJIV7lIXaUvgimcWiWzMgFeeRLU20xKS6DaK1ndE+CfHFcq6VMd4Iruz4Cn7gsrvl15khGxvJZVkBk0XP6kdh6Rm2u9qPjyM/S1fQoJBlNL0yLKWJPxxok7wH18vAeMmv4bfEafthx2wKIeaKH0QpkgcZdiuorXQOHmI2lxNyp1xB4zM9EZT8xXYjZO8BmlCjdKQVf5FFGjfulyl06tyiLmdlfzrpLNxnLJo6XgFHAlYNxi7RzJXzU25wAUXPNiaHaUy7JCvccm+bZXWcKhaw+8R/ydGMgWsrxIIaHYbZKbIS9aNVywZqCJ0oUGJl1sdZ0/neCyW8FpF/vsFvGn9TPrcyXhT62EMPoa2OYRWOSVM9hZltf4hFcCSF9WBqjQWUG/rjnK4w5WSIZd0KBuUgFQ0LicDeEEmIfjOrejExixJIeX9w8E0+ICHl48mYGltWEgHAZ6D6uPMNRfd6Ts2lTAudimb/wK1w5zAqaQ3mCI353a7/3kdlvglx+KRwZxGryxV7Ybft0x/IvQbroklb3qXGUi8jF6JbYdrkXSXbmtx9RLjscUA+q9rNHBtsDJOPylTxtcNpkGXB+SO+kN9hQS5paVZASrayZYWAEEenOjrzmGYpKBLvQSKeL/ughQ0V3jHAET3wzBVotBAM5pvZJH2trFJV5WZ90SST/jKVimL9Ijhz6cmAYTAchMQfo9dtDv7sChHO+QOsdekW+rIwvU6l3j2VdMi10kKeucgxQg6qq8aqmSA0MqCpod0aSdD0j07QD91xwfHX+ocujIofJ/Do+gtfYCEKtHCR6z6iWMgk5VidvUYmGY4HeILtk5rP2GXOnMzHBPcWNmEZUeNxrk+1jEIzwbc/1Ziu/PfcHxlVi7w3EQ3gw0x5FrjmuaoZb+as7qEnA9byDe05IJ5C90qiwfmFRIHzFHmX5xWn4IkDhttCg1k/6RORlAP6PeUzTid9pHh5tkZT6UAAIzQgBylxxjkcv/1BVTeator7pnnqYI+RPVwaE/FbZtz4Wy63bsXFdEzxA3/TCQenodWA1CeLFht/lpBzJt9gxCnyUhFqpOi3JU5BO3zIdFivbMjIG2a9TfA3hyldncAPgvHkwvGMwxVzDmD7vjWyPa9qrkP0Bwkz1PomNsaCFiMd6NWD1CKrNPJlymkceTGisPSwEzE77yKTV2+fAipdADRbUCcIvP8n/XL51VIO37LadyMcwfyTl7F7tkcZJnOdhhHm1SIhalTrooH+acVOXBCw1T/tGVfvXEhGV5xx6oUiznMjYCxsUGu/izKjbfHZ4lkdOxc3v8I8GSpHjUD/+ynxT0m+6HtYiqUvVy3PXiMRStNAsBSDQdQd70VlJvWqvGbApsz7RrnrGHLieCvxfaSDe2mosuyjmt2+/C/kpQ4olD1Zu3bwHCaO26+0FHz6PIhybx9K9DTSkVAQnbe2CH71RiO6DLaG7BSn8Bq3VZUlFYfpu85aU4e++N3Woyhbq42vL59+N3OuSVG6JKu7reL92GP+uXXtPh3l6AHvl1vYb1/AhS3q0rLJIgqWUF3EpDcCweFgpe2mEx7JrWZCVAWHJQ2NP5WbInSCNtQcCg77yNliUH22LS1qta+5Tb69V4tOnV9mHTcWdO/5P/VE1tOLfLphkrhLObiF2mGk2yXDlEmFgohbQoiaRFxaBO8fQ6YKGqEd7B7f+MvCrTzPz8wj1nBQYv5TgfujWrC419rZmu2WKVVV67FaYIOuFC2mXjkQX2WiuDYN9CVsNSiyZXFSGpp//zFT+uwog8KFZcGA6lXyWVifNFCWvmdJPJb1zXevYRVQyioqTwly6iORDm4pY55Aj3cNaSDMXjeyU4zIf+FnicTupPavmXfx1AwbSRkX6RrZrN/N2OKbxhKRuRwhm+2Snry+BbVi4rZ+D1KAtOfBQnHqUbVBXW5YBxXQPSC2IMmOkZYaUTP6hd/CylaqQUe5U4wbKXmMHkEzQoBzhZBLl4wsC0PpARUPJf23mkIdM5zcENadgfyulASynYscagWJ11v5yyU00rHi17HovusY0xNqxdF9mCEVQ6hSmXo1cx0LtHjJF8vxVMBp70mLaGqvAo6gakJxr/4Lpiqe3qdZhdh/RW7NQluspmmxPI+GxSKysJfvo3GxvIDH1wjUjEmDWZgg5GvE8axRD3gukeKpsIbKNOy84BwxpN2c0ZOX80QLz9S8FQOPHgJEC0WyPXIyVLgVAIkKduiCl+YHn+QoqiMkLH8bsX0zUZ/otdXMJuEf4ryxElrL1qZKks5VgLYTmipg8eJuhf5wmp/tp7BXwjOKimmoT9WN4JE9sfrEpWy9sMn28vm0HDEnDyISXil6t46m+e0zuqBgnzapqjD5JT0+Co6ht6x/9rB3et1T6t2Yq6Ke34MuLFLfOdf64k96ijr/07BpR9QtGAHpw68n3klOik23m0zCU82vX8gc9Xg3sJtQwCBhVdzlWLP/rMPKKJfyNHkf9nTlmWjuBmpFAPEvdPqyalkAArgnxRyB2H7Rk4Hn6f9rmat+oQv8VX2J0nzTz28Af26kRCmkb2QFeVn0Wv+fBEspJB9+ssvfSmmiajH09STXgmxfRAf57Bg8ZfE4q8r1dokKzw5P7QGGim9Dbsnisfc+LIV2LlaVsDL7njmgev+uSq7EKc6nwJeEuF2fNHaMWlqSZybjkhig8z8ZbZ9V6IzX6MM7e8TgMSYMsbHnQS56a6L0fJRLJc8npWQwqfQwAYGt0qvuHHJlH8Kvo9F/yzHC8WVGs3V2Kb3n22dErEcvReZt+cTh7RHbqlHYzSwwnu2VF9ZqRhabYO/dk6OP6+a6GyIpcJnfpovQ2Xe7sTv9fzeJevNKA/G8QQgojgp2yQKmT1LTzcJaB3ToPPJ/c54yV+P4oYc1ln/Pq3rpsaQCwTw/YTl9AKFDD6jKtak6Qnbo/lhjs+nlhQNa6ii+G6ozSV03Ng6h3IHUrdHDy9257VV6jTe7vf6m/YIg6E6gBp0nbDW9h79RyRxALYBp9kz1BHOTdgWU5T1PP2jljCjj6lQlHHhDKTIcLimpb9ubDekVpn5GebW2Yk5IwxrzJw7Qn9ccy++uaHyhTDlRuCwasXz31eCQPmEJMaijNJZgdJwwS7DlWpyA6BLYtR1sSRrvSq2ySwKK4OuPk9WbxS4q2HDdtHqvHpWT3TUhgnAqXKAfnou56qUNAz24hQxQdLNKSDGXheKRQpsLZHJDnyqkBsJ+dSla/+FC92VMhNdcldatHO8LfTfWzYO1lDnVTPdoft+5ypeIcPaT4eJYhF8PwopB4mlZbEuyribYbIACIgq9eqVBfufcBhvCOYKdxxtjhn9NsHtrdflZLE/DK5rXpMYks71Dr+JTByQYF1UqyWh5uImPt1eSCMGvhiMh5f7GNznvj/My+utwY/l9DcraoVpIlIIqHPbVnbdtliSRKQA9CwQAp7+3GxTU5Rs3Na/NqHOs4/PQs5C8OrCpbtaCX+rZ4zrzu/a/CRzSFBPcFrL0h7Ueey5yH10XpeVpafH0iHCoMEIefJ9KF7SZ3UzQfxiEC+fv6OuCEilZyzHq5hGpkJcEjBdYP/wBp8oaVIZVJLJLbJilT+2KUUxoT1HNcDA0iBPxhuz5ro78xBVYbjosUg9trxu7jJLK2DLhAXJJHuLwWXXvv4S0g+94CuJWP7iU6HNrQKFx8dFNYb26mRvQ2dOZ4YRLA4HzvKHJug3gNqHQlxfbwdzZRqUMFsLPUSng+I/9V36D/qjN2T8TEhE8MnAGhrSuckvQ0BO6fNDu0WEOgp/bfuRukfJrl75bBP8UBQiJf4XnZBjOffSO/deYYenj6lP92Gi0iVNBZ+QNYMGuGH9ouzMsM2VhoYp8wvf8a0FQj6hZFzP+NVwMNVSQdzJT8JqozDBNGLiLBRq/UrrTNB4NdHajdQksAreUIAwcBxwNoUTKpB6C5+Zm0LSWjpdmJYbGnKoybx1NUQTQdEAGzrsh7Hz7PAf5lJkKh+3sQOGVuEF5GQ7XVrru82uHp6QLxGA+CwtSGEPWDzUnNra2XTSv+rGAWPWDI21EyCm8Io3D27bagNeGmp5nYC0X+52mHx1zhilvHLhlzSgaBVMAreVGANkJy+dJhETb7h3n0GFVZypN+Gqyvf9JPTaljmwE3bjOnGMgJ/Zj0Eb/3m6fGJ4glSt11s3tQNxFc8+X2lReXXZP0bgrpv/2APdmmevOvutYCdBnbhCxzrm/UVVpfM9x7lRJLC7uwSiAzaQHc/JnirY3aUcBg76r9bIwTT9K1x3xelQiwjJeUiT8gystBtWCFIqwfI2mTI72dFCWlX1gxLiHaSuIOr69aQQwLZ3P4yA4K/+0hztbzF/mt4XNH/fZ3g8OhG/ftuzNgBUOGqcqMmOiixjKTetd5YMX0eoSHXFV6RekGKc0kcfM6GpU8LYBZSOasmJkvG2hyYgMrih/odVSGTlaw1HXATHm4JNN2UlbNM6P8ZYOmzIWZ0mTC4su8yzaGY2PQqpcK0jce0c6cvSMTo9rlY6Vj+diMDkMACbhMPMRIjwO8uAqj1seKs3rgVn/GyVD/W2wHMxzeVkTpY778A78pOQnuiYmfPOpIupp10zsTfWosFJfzyQXg2bsCo6sCX3/F35iFgamqyeALnN1LT2zWR2RDVpTw2ym7sbBk8lIRw9pYfWnYa5NKeOHOcXaocJXz8iSA938N3msX1eWqNKB6WmDAFbQjzxPYFggsRmWiXGt1v1XDoYf9b31ZCBpsa3xW2p4H4WmsMBEjqpoiJsJMganQCK0TJQTGb28kYjPPpEi+XylYDu3zR25DDNfsALYQy4mx75qtCq/C9zRZ2nHxaEClyuuCWXUHMRaSPT7yFm3XYEhOFqGYUHmtnq3G0Blg3xBgqrXYLvvmD6l9J1Pnj06tuUY9fL4wNmkVEKwqUlxPwzIxbMGmSMTKPBbqN8SoE7QlxiPJ2ZjdqV7RuXKdNGf3JPDYFDWWAblAMoVEckHU009amCrcnZ1QlAz/NIqVFRmIBwJ8lsxDrXpijqgkBp+zTagrLxA6eWrbtdUEAZNaScd6v9pWISuc6mPjASt/vvy81g1umLdGwqwc3ANxUnMdP3teTTxTLhzy//rVtYpIv/oYP9PXpAXvfXfyR16HydqoCNRSR30jeZwcD5hNq+s54I+9RnCsyglGjtoL43VQwuJq7HP4rpBJS+y5T/QstWmgszkT60a9IC6G+/TMuUZMqfrpmu7deCfClG6BVktuKKMyPyuv6A6iMPvis6D2RTpRLpi//s01B+8QXEQCuksbRUxaS03Pkc5Yxd2ME1LbLgFML0HRWM1626qnFTmP0otoS9uIkgovomBq1O2a/B10ua/B/m2swy4xGiZJquR2KPvCqqFY00WSuJWjC1+Bn2DLUxx+JWKeREu/0JZrpTlGlMspAAG3QeYzH6a8s4kAX1rnbi/czzOCD6kq0p45wCs9gFCkrhsMmWJEyFlBd6v4OaAFPxdYHSfiuw9MHebWLr2JpnP79M8gmeUjJND4k+4BBYpxlMsn8Ve3V83BOIXE8k6pHe0ccQRkiRHPGnFbzjkZfjIl8QDQX2Zu6BnlYlUqCw/6qHL85RpYX0yI2PpzYZnLMCNNF5j1ubX8vSnqwWD3Cy19vShw9Hc2g9MB4cHm2felDLmBp9xlSULYAI0/Jk6A65mi/Tv5OgLDvrlzSKAFr5bcSzhUb7H+VF2/3vRLixaIMa6WY3V6GILCkMDUOKr1/eUheENaU5z0fxPMUaOVy29pJ0CFnc0MO7n1zm3GWany/1JTcMxc8PLlXcNBMqsLBQHMJRXYyn71MzVuyrNm9AYpk44s75gAx+/NSgKDazSxp/C0fM3gVOej3o7W/Zr4vLMF3CXrsmRUg65XI46hHMrDcmmDN3aBlzHdtxtQuZVS1ictF9hTOTOyHauHCQd3APOrAKXeHHZ/uhj5/8YeP5LhcstQ9kkahSRibc3eR3R/J/SEEnmarXRsxlVmJ7LHN4Rp1DNBvmc9H6O9brsuE8wOA1u4lg/Lau/ccbJpoPN9wBuQuiw04fOFd0LOYYmm72o3R60otSjf5Fuuegl122fAeMPpTN6uWDRx+282HaTx+1CbQmF++h5GNArr/UzuSRqHzEIcK2Dy0eBLcwlD5J33faxXpW7vemDiR6rPAm7l/JYX0lS7rNirRCSuH+khw/w22uj+85MkCQqkNmYzMk9hot8z93qAnmYnT9kY90Ti7BiYkdySJ5Z7z4PSTvltcGD+rfA7bp41QTLCaeeP71S2qu5QiTfoAYgiBJdJpHysE37VAFmdoDJvv5r1JZynUwDJ28224D76JwQ5jHXruixE36qiP9rdOaicfD+1CI0QDXrsgbf1Bwevjox1789Ppxt3FHKvwYDo7Y6ExLp42dYvJp7vKHWWkTGs4fsjdG0Xf7xZZiPZ7b2Jd5LIL7ZsdyhA3lf1/eP1joe/lkkpGsjZE5b8PQQJNlGneSl/94ebFFBxzBzuBB7L0Jdi6gxAwEhu6LC0fw1vlf+Wy8tvxxHNuHyg0KgQreZ1cql0L8ejI9ahFc1dYFEOz0KMwi+Vjz5VTbJyLPp0DOocgKQl8+XeW74VVDudx9uzr8UsIOqgCHpNIb69/dgAoNAEejaQhSBRgmOMqxVX1PYumYNGwlzdmhVnbsO5tRzqyCOOuiqMuXtehbP93y0jPLJ+c0q8nskzS02z8oF3ORrwkoN3VlAnWrHWNx16w4Bp4wpTN9t/jaao71bFrC80R+vIdRKDPiuJSc20IxonVuCmgxw6hCrtLupbgM8XtVoAplOzJHY78JgI6TmwnSPGsZ5FUcLYJ7XJJeKkemH5je3NUzDLGzco89e09YWPhf8NUjgh5jbN2VGFKifdn7XEPQVPFCVMrtjw9tzMwhy9vqFDBb0gi8YHTcEZiktnS5h+0y/9rLsg99boVMPmqyyR4sPaPH2JfcSPd8F0bozANbdY7+nA4xvr3AGuxlqyuKbQHt0oGR5/zboPDqA9q4Gar6/x/lP3XDQY6FPN97ZGRyPcp8yIFRQRWYZjfOSL9dASD4sgFGp50IXeypHbCqBaeYM7oYhIl94TikaEEETCGQMDtVfGhbMQxHu+0N9CccdnPGsGn7iUu9on6eg2YKigplfdp6IHWIS+jc4NgD5idS7U2ru9ooQ/pYem0FU746f//EdTqW63qLv8OCMLnsjJyxNLKhhn81n6/Q1AuafK/uBwIevhzxcG0xf/ZQl1TOKeukzlyNED/vD6EcCIWE5aXvi5ughojwVqUAA1n/o6gMgOxfljCjjr4kC+mw5OUH5coliQMN3PoV6gma/+0ECeV/WdGDAU9Vg3h0voiZm7dJN0oRVactm1tDsilHsQFaw97Rfq/dXyLlIhoP1Y3jP3GVvaVggCQXqftH4s3kPyGIGA0ESAHSpVNcikN1mkF5nnL+zbEiC+4PAmaCNYyj2xG31+C64361rjv9z3wO5NSg7FrwpqPcvWZYydTNijVaVnvIPXe5PEjE93qsQH/1nw9nc9H3b2pLsmrIYq2mwPH3v89UVTz64rwso+G1SMM7DqWPmDowsZq7nQQcjiss5tqUKBwNtbaF6gbbxIhm3nKzMB6Aa5m2li/FVdsmkFxrtFju/UgJqiA8d2ulfKSEqmcD5CP024bJdSE06Zx58NU/02nLyBXO34385+L5ii325h3REbIUZbDcbn0g+EOzO1Rd6WL2JO0+E9H+cLUIocR0nzurum/+fGsBL34omnzuCtRcIotb+q7Z/6xAzF6Vz7Zs6WmSq+DM6idHpiKpMkb1rth0mu7tz6IOL+YNpFmDTOcy4Tx2lisZB7Hclylq7mSk1npGY+SnF6P9k01ALv07dD3g4sBNiG/vNPhWV1GdAg6uWB8durxw981K6Su9c5/gAQU1BWiJIp1a6y1YvwpoBS//cxhpWLc56y0yL5imsQqN2Zwoon0TmtrCKrTdv0lYHmmUdCxXP4alLyBDednNcmYc6cqCwHjZMpUPvzKsEHcexeX5kp1XC+JPSnT6LJwR2jW0XMZnB487AONSfUTSXs8Wuvnqek3Cd2Ewh7usznyHbNffM12YPkcnEgi+2/xs6Hhl2MilDLtdQbNaXOToHAkFHUTRI4KZt1WqSaYBITzjItWb7+BUp0LmozeGWl9rf20tCQCJudjvZCxLlCgIVFsnAkrcS4pn/vDFwRNJYM3878ClVvaTgGTlJwbQNrKFZ2Fn0/1pnvyvKTq64frG2CKejkY+qmFnekXKf185EJqzK2oCpcRzg2jl51+RPiqDOvFLMZOxhMIcKyaiqFZ5jq70bhxsePCyrlDUrio9H2p08pH4e50AL9hwvl6Yv0K09Jkglzyt5djxvyPBBWVTG6hYjxfnb1E10pI+mlmJWyrsIhHZRb5q7rTLVM1rM9YLc1Iv4azkaAW4+Y7iq3kJbkIujfnr7IuVJ6I6QsIGAyGgFUpKtiHOgTmtAv9L1UEBUoDjSiFwemmA09Qou/8mxOID1PMuo72Ht4cee2sz6Xu1Fp9Pb8EU5a41D7/jELWPxWFhpqaxr+wpi5/YbMkLAxali1HvpQTEODmaUNrC9DM2RoqDmni6p81DkikTHmJBUS+uskGmNwkq6ThysdXo+19uQt7cRd23bO60lFvbfoil5rJyZxBZcLlOBNydupPxsdnpyOi6b0hRIBxu1E7s+eULhsKmovoNCCckiY8aAjiybljIqPmTrKWt7WnCgZAa3wqmVKQEukmMw7fo2IkQSsOLlRS5mRoCYZQg1/0NTN01ew9cgOQlBWqxv+Yj5r4GtP602VFj0sf6RGMKFe7Th7phkfV/aug3vvtYMev6t4geezqt7lmFKbDYsmQpO8QVBUFWugUgilsQyIBOUzgzu0b/uNfIgdAoufTyJ6fIAAC3sYCcR+hTEagfrEKW3YUJvv/6iIdaxfnsYRm9180/t8t/xOaZ6/QDBswdIPAssGugP9NB7x6GXwud04FDzKS0GFLj9Vrc8T3s5JLkcGJsSEDcbT9W89cF1gq/XXgrimj7XuP2K/HH2YiMy0S6xswtAnrz80ybBqhjnusC3pE39EZ4oIe3vCfOIISSRO55cu0E9LDBaOZ0c3AwsCceIQy0Te9dRGMW2Lgi/xqVqd541jAwJGcg9Jjy14jUYkggKZvCoIUHJl6MjTWOJVR/YHVxudcH2wlxSZvEmbq9qRwAsC2L29MpOYCbsly7qFKyhxBLrkAdxqP6b1LQX9drDANIgQjqH8r1bDFHEP7zFVAK31zDuuSk4JBBsS7exFld/+SA1Bty3C5DzqwzX0BprNYDdatLcbWoCxhkkJuaIeYBSNSgAFt1wXxmlpszOyaM/QlxPgeAUPwC6DO1039unY2FwBcvYN4ckIkxNzjSolp3CWRe96aQvvyAAmpG6ZxYM7KKFEQn2jS06OYlT3Q+YAXKRQAv+hbgkHT8SqgumvzOmKNbMlrCPRhy26OVob1kN5Y7K34Wt9jdIGUrmURPo6tFATZFQxFgMRdW6oJkNNkkaLTVdZvD19cZpIZ6uS0w0y/BWOqpyzD5AWjfBxrA2FH60of6umglGKRW5FtkTPGKKTZryHUAKT30pDEdHhE3orpq62msvYlJgDXEyHKXiJTiyeT7bMkZ9Tr5XhkMpnAPmwS+Z4BwfB9RzV/vfOlqKq5Z8J5jSO/Xf3L10NoCCJRAUm/fQmSp/qK3FScCpJb56Hk0O3/Z56gNkFcwH9TRFT/MdT5bdy1YNrRdv62SOyeseENTImPAiHjhz1jSVisKZKk/bydTOwpETdQiQ+/zJ8Z/kMxVxhgBOpC0f45v88ywEeYoWGBmhK1FzHVkpPCikxNUkIq7FOtAF36iwW5ub66B6B525uXvsxx6j6rECZDVJWTIZnPx9fgTEV3elbIfYYVCYVRjlIX4Lv7SQyf8cvD6FMxeLz32gEC0k2z7Skhc7ptg3PBdt+KV6PHrY9m2IMZZ1HBSf7/6JZnb+LydZfpmAZAWvnCLX+t9rnZxZH9wTAH9rlEjm8j7zWyvL7SHutJXd2Yadl7nyvi/K1s5CJJsTpiKvu5b7BlrvcZ9u5ZTT3HtTKzhGORKEo8h6avtcEH/sxsLGSAWFMdbLMW2NoLFAFjJxrgQ5EIBVKtGrp8FZquA3kDT4ttZptqCcgSoaBvHf67/OAiFQLXhzXtdVcfeIuysbZ79dCmI62x4UG/5q2CWiQVhwMqTN7mLxi34wjZVRYsIuz/2iyO+fVCdH5a3AAAWyPdDIfmoQwfdeGL4FARJ6+4Ohsgdg3H9QLlyJrM2g4EDUQy+EDhnJRhw48rKdEIHBgGboM+u+0fdCJTPfJvykKMKaeG0EJn8Vr6Zxp14Ofx9BOyc06GNjdBtEu5UYp27dbnaQFE3MXgmYG3d2a5FvI6wF3/zpOID3j6DSogSCaPlsuQT4fWuO6N1WLyqcm5O5d01I9b/gwyJIYLMITnSSmGmQj/p/tKj4qzvhjmnolt9kRccnA5Jil+Tx5sb32gRq6paocPI5tMu4luejRdDvK5AKsmmYxrn50FfuPCqKEvEyEZI8L6x9VpxzHZWwk36F+OUnvz95xSI2ZuEekNmfpirHK4yYUJZfrlfscDSGWZ7OCGhAXWY+pUJRy+CemIjzBJ6a8mJmxZZjZECcDpzD1mDXnxl5/Gpei4ZIIJ8D++HmZr0rXHH9gbDVW5d+RqpD1CrIDTs/uEfuE8IoiEdwIGk2Wtq3Eqgy3qi1kRh1Ahsm1m+xMAPXn2SYQw4UlfceUyIsF1nfX4iKk6MFhmkBxrOc/m1HVoIGUXCmWnHbjM3Ve04JxtIzcL8ZbIcHeBEe7A8a581iXpid0wT9ah0WiaDVzogUdeTI0yoBftXMzLkxjZ4rc/Z/i2zI059osJ6hGBtAoKSOePIR9SmDU1fbQpjZiLB4liUI9E0wGoeOvRE/qBbQPKTGj/iDxdf1WvYkT9Lzr8SV1MgISqx1Q/72PAwlpY3y4RQBlh74NUNTJXmS7JETu8Cur6jltTSrlAoZgtih4P2gU5P/HfkQxP15oAQfhCTnjeJRDllFG7Pq4JepKowTk3raUa9HWmNqRG0P11iIwZr+ld+396asUp/wYWSsaZBHYTNvNFS74CLRW0IQpOBiRIfyPDhPV1m2SpC0uKAdGpFvuGlhSMUAxpeCmeaDjzDmcDaE6sjN2RL0ckdmn/5w7zhPKgVHbO6++a3M//W3gpcse3T3I31iRdAenfFW2FJJ9gqvMG32qtgsh/OqjjFRFBreXp/QwfXkLbfcNLu+rOEy/r9++m67l1T6EAgR8zaRj1GFkTEIp6PVtwMLDi+mv6G8kagWG+M5uem8XnZ3fl5StkeBBgjQkFLx00a9u4ZabqJTEEYghRJag+uAYvv+EQasN1kvT5SFLilfZ64j1qRFt5pa/g7iuHuVwWQ+4byf7kjFiP4pAyXXSOuEh5BH6n+1W5pgz+EadWY+SiDhfuhkcUDOF4RygOiTJyvv27cR/2yc5OKv8e2P2e+/wR2MfISktym7axaZv37kw+tle72YtZjIS9SFcAnfCwZE2VyVwUgfSbvxvb9q5aUOiMDhaCugLBdQzX5Fda9qCAUxRCcpK+HcF7uHq1kjPcvbXCHmplY0olWPnA7hRAXlEMygDNse55qhv/4or5xI2GWTwMhPRNKBqcKjFyLeziXoyBZIo7cuzDmls0mk2ffvDSXbwPmIwogUyNPulkaLxLW2F4q75WyCg/aL6cuhmM9ptMPXjdFoNzeh47K0CLJ2AXjP1qjQ0wViFMu1zObA5UFC5rsDzrLgDWltb3XqX4e/tqY2+/mVjr0n2img9Hqwrbb22rZkb2Oaifk9Ki/gABi68kuqDynu/G/+O2n1JVub1tTGZc3nwO/4NY5XFRDEhtFfAPLTJc2gwht9GAUIfI/dRvB1EsMw9c/ijCYnTh2hxTYLAQr14fXMvvG09YEmEjgaUVZYLYXGcVyRpu2wHy9kftXbwC+UYvHPxH5v17/SuNeHeYtjosyi0NTtLvUEDgXigBEtPSptiNzgIjVHIVdwueff4V4E896TlZfH/y3srmAcpznzacYjhUyCLt0DRiiioEHLqYp1fmb/jZ/Ch6FKnmTzAeF3N8Xv5cRe16ZtrP2pNh2W9t/rnSrCgZkhmTnw5+OyennTqyk7KqGx0PzbqpZip3xDrk01NenGx8ytttBSDOu63vvnPlK3PULzQHtouO5meFpNMLWKvbRHoaxWZQp8qaAKemfHZNCieCerQv0gVybdlX738hT6Yovze4ZlWbCeAqzWCz0BWAM1g+KXzi5FsaFRJ2ce3q1+9CSjaemLZG/Rl3mJXkkAktkm0+sCyGnLv2atjJ02OmcrgMz68gSr2KrvAHBw9wp1hEwgJNV4bPTXDNlJXEja1JOaxmbRfJLTXaz6GlQL2IArbZ2Mv0CYk23wrX3cICfLLMe4XojHrjdUpcFVUO3G9o9NI+OKREcxvscNwpnrMZFZLR1j6KcO3g908ZfChcxP2vxJcxkz6Vtj4bhq+/dsppv46zjapuJDXqHY6jxjszitSyaKIGBgfQ0+XwU6oKAPof+ROnj6vw6B0J5flyvu4R1q7UAUXx+T1wogG3XSXBcRevuJaAL9Mcko9Dopm/r59fy8QY7+rVOxCc3Tu3Dpq/cJ0hFFYNfKM8oyclwPAvi6mo+6+Btr8WRVNAfCqUuCmWZzb3QJiyI0QQv+XFr1G79fJVoFEEfNhCAA09dDdn1t7tEWqY4NVhmyypNrp/h11qtTlVSFF1nTwMjY4wAbjMwcNJxxL7xO5nb1eRSLaURSCsu2PR5bvn+YpLf/bMiKkad5p0ndiI8IoUt3thwrwdpWU6xzgQJcna39ZRQQJRf86sRYpAePcvP+FRQpJW3f6SgRbf07AReNI/1iD3SDnqlePaIymGJSh0Nx3cTC/P+pS0adJgsj71dzRy6cf8zGESKdFopy6b5n82UhStKOCTR0GbDkkvva1AI78omw5uq/qVDNyituUEZQRI2EES3LI5VqUqfHbeDpASETyef9AjktNjY2z7qbWKnqeaBX47pk3Qju+jHnIWguso8/nHT8E49xCcSByHJKNhuaA5aVS8HGFwMkZNPcRDdfn6CNA9hsb/ICNlWSPak8FiZPfm3uAjuqWVS9Hbv2UUysLoHwmGVNKztOJD8vMKQXrmqvup4ZucNHzmeoCwODY0oZvjlXy9CRxl8Qw0JrLOkjQlDxSeImCJbuDmWe3NFM9UoK0Z0ebFTyWcOKDtBicN1Qq+xjx3r0+24kgdfP8sftHd/IyzB9KHICFrUmEZZwwGq8S2uDcbRXpSnXtEOqDzHVrvBB+6ppwbAmLh3FNY9o+xlqBtly0C0ltm8tjMmLyjaMmr/kPmN1rav/k7wbro8A7POFqXOqLGq2FdU3LKMJJ5KTBrigQCNvzYEgt+rnX8IryJ/g3ZMQx1z3SMRa+k3ByO4nyzXZvvRASW7VzMgMMGdIUMnIDJtYEJkNzzPlkJXyyC13o9/MVviUNlmTprA/e88ABtPD/J39uWPimj9Ev2r+meYv1Sf6DZvAHfrTlb5BpsafOo2LJpq/9qJpCYFbHTgkHvmNX7xyzqH4F/n5g+2AE3jadyDG7INi3f9Wr5nKEFK8Da4pTbJVJabUZuT8+BQw+iywPNptiw6dci2Ve/JgDJTbOw9i7OQcAX52X+0zMAkA902ZN7tBvyrG3jdhvHVKF+ZlehDCs5quE1Zuzs0yO+Adp9XC0/GFrN9MVnt6JjeNEWBpVXANv1NjUP042wj/yZ+BbRlBQUGZBwHFniX4PDAMRwZ8UezzivnaoseOjlbFNNu9vYjf8rLVMy5dI1bU+FZVJLtMazuZo1RemaQKpVz/Fam8KkFs6+12q1aUJT+pUaTE6BqB1fusOySB7z9OGGREpvcNe6/sVLkKKrpEPfpH9EeEiGYXMY4rRdlH2VDtketLY/3/BulzGvFkmFJslf5UF4i3g9OOupi2AMtci4fejN9ZwPh76r2ij7j9MSuUC0y1QgeiViSUJGmH3JNC8bImdahRuKlRf+2RM5lR6queQEyJmA0VuLtXMj2pIVu6L/FMhxqT2assZynchT4ZR0+Yh7gLm3B/BFnIqzt/PYMuMGPBCWnowPMCi5xw4R/AlSCWJVesKeUNSJvR5hB6DwaUW5XDVs2SQA+7lOPq052MB9XdXNv/s+KDKHGKpNL+hYF4mhUkTjKmq1Q4XUaxjPgNfjOO1G9YedkczTy7eZPXKghvjWbZCvc0JoRhb/j6xiQ1rO2XZq7f3vNFMVZS1qP2vQ1WcBjxVGrrVQgngMiz9v08rO5Jnb1VVaUG7AVDMQ8NIc/x/lHLUs9XHCYUp+BMVUU9n5YyYGVVb1ptfLEepS0gcUX5F1Cq75paZRux34fQVV7MrsDZCufHbXoe7T9xgQkPt8stIe2mW+6iHH2cWfmipF8eUtVCXMiQ4eECC61yqiznGPZjZdyhICXl6+BmHXZrBcf3nPRCYg+aLX7pb2khcMtr+6wIqqFVCNT9v+ErBh9xeczMlpXDIS2hpyoyC5GE+ZaGTwjvxS8w8+ZaJnMHgr66OWjqmgjHXwQHxDrkEwzrsSLdeP9vVyNy/j31Un37Tb881C/bAytdAW5qKEx5DyNIqIhwluuQH6opU/3Jj78sJlDXTVMs51F2jusnJ1mA9WkGli7Ly48VDo4MSI+Ig8GMrZ8SJ7wjvIP5NFN2oMQ+9ckFMBGd1XdtABhw6EnPs9YL5FwqqNs6j/vNW2tBJOpexExTPQDbCe/09kcFQgDFZkrQp6ssYaxFMTbKMtEenW9ElFHVqJn/fOutBjx1qEcdm+AX6CNPsRmNVBEvGXFpvRlb2vRYHqeUQMMaaSSfgDjJrCymMR3lXZWm7rBv8xJLxptWC3jkQWc5+oB3Y651CsM7nxqyuixyIDc/ZKdIslqZ5FSoy5FtXtam0w8HHZUvmzUPv8Z6N2IFAgvQfkSZA+jKHBjRUZzRVVd5OJ/aHhYGgf9Jx4QFkzkJbpAGbKY3qhekgEZTb58XCdpCDuoXNo7GigSTGzXxmMDBOVnOGWd7uf/WyNe4rKuCfBHBBAo0Q3ZQd64tN9XrCONVLOGwwyNpHQTSIGYz8kKHMwW4hX77i/tknK2FFnQrPLAxtxUtoVQ3cT2wvm6WKg+MnKg60VW1SqyC94jdHbI7PksOetusz+RS7j/gndiJ12upOWpoS4DNvfkCJCd+FZdac5cc9UjS3h9Ut5KJA8DL1RHUp2ajBGyMch2G/ZvXmHdErnknEsWIwsBMwgWKSwlmIzTVswi929MrO5vZ/LScIrGmTcAMWTR8mP8uhmxx8MfqIlNBuPxkhFQs9QFmtoNAT7zJtALCFkoq4jjevzZW54KzmwddUfaf+JD2mJmINUHh+3PrZjOSJsemVqzJNLiJ1fX/UmmUh48NhvlUObyiMc5kFtf2SPHRjYnoyKE6Fo8UAYPhGM2J0vmBgUMf54R6kQXQlMqYDNHST5PkhIFqYO1bs5nfXOJ5czyWEpgOJm3HXsr7ethh4m6IHRTNjF4qhvS5AXooPKslnGkqrRbA+TJgc1B8Q+EZKjIvXm4K1rFXYfsXtL3gjuyqb7tY+fzav9ahw0G9hkVNzzU2WZTOjTHIDp+lUyFJj3+qhE74Dgml881NCRR+RSfHqWamsjNpumtnYJcdHgtptmI1tmjtvblEFaFvgXhn/X161WURR3n3pFdl2m7KO6QrXet7CRRiBDQflDJiJKukUJLzrPJCCcEmkaXEdJ8y0hM0ZOLPS0qBlHNlpwtf04PUv3iSH9j6b+i2EvXSjxRpasLnhUuwlxeVq4EVSWAlnNJ0Jau5GFu0Jnnz0rbsiNr6cGLOv2UEwM+af3BeXDzNgeY1WDJ48flCcwRedecS8iCMXkr7uJ1HKFp2XGNkNmoKUd6M9iVNal7PeH9C/p9u1NWPeBbf6MAb9EnIo1semYNqSezdT9J+GrzP7x8tGRDIFndC3mqYkcAI+jIwTLs5F1ep71K/cIkkmgLIFedrCVQXwRqLxcJNOg2RvGJ+DeHCRgi9HbPZ/dHUdyC7tPiPNKw83KS8PwWXZ3K3WR3m1HgxT1KDU/icHqLUt6e17cEPWDINIOQYd1B2xqrCmG89Ko5LgLIG5I6lE8NQbBQ+SWQJcYbgkzJa/BjLmEepq+9057FzS4HwHiK81cQ8sVqsppvTBBDTj9SUByGuMQp3LZ9lBBafMxWec+hfkI4eWWj+a5nicSImi3MsHsf9nsspnSzBkojsEtcLNxThGKOI8WEpn/zLa1MxTJWljw6cednnkByRD21bo+JfG/nRNqUXwAyyeoUzx7FBurorUAyPm+AXnnVWfLL6zbY4f+ADrxLNtZH+l7l4xGqucD7YrRiAgolGGyTzTdSar5fHolCiAvi9sUggTzysMTDggN32uveoj7iNS1GluYSaGQ8yX77/6F6iGI7aQ+jeAzCDX+bE/wZGMB2UNi7//0FBYtAIH66nM2mnjVBX7txM5gV7S/+I1vG6DyTF7bSUhAACXf+KF0lMjpKUEPyezZz85ZZs/W/2Ei5OracdudCan0DRRVJuok9zDC/jSvARh4H4rYFhz9XQHcf7+tFWNaqQ38hB045zGQ4vFrYnxHgcCdBbOulAOZje5tc2TFIYEy3crqU005hjT4VLrB9rC53kpj7jvHQEIsBMy/Z3ZGgV8WSTfszG01Bq4p4OgMvJ1HHUoukRAI7j+nCwslrVVpgJTHW7+4uTZ6kHp5hX5N9IR9Uaqvio8tbMijFGk26zSBdMTO33maCt21Qqa1+NwwsUwU0pm3ERLdcvZwoSe9A2z3hZRmD0g+G2p9TxVZOYGFVh73/rchkuUK/UavNOt1j/EfoQXJFSaRXxje54SlnSDIViSwxMSvc/aWla30irGbgFJ/2koNZMBb1KP1X8UP2Ae/cEZH4FN1Fp3y6HgYl6RNg+EJ+7UYsN4In3T71MgGa3+NXXlC1D7XYExvrhdclzYQHTc4a+crodZ3E1b8opxa/pLrDvPaM5zct15ViROMRpHOLvwTpE+vyHmNgrGmjW26Jl3YrlqQCXBRd1udNvL9vyjqfxdNbl29byC6pjh1wKLJ1cvc6JxaDAYpS84IUekvnKf+sZKpuzCnoEr4MKLO3ZUXxVQy4gNQW8u9SXaaoJCP8R9NFc1mc5UFfpEIc53nDrgNH7LZbCL02hli7rRJ7Ez11w3BeWWT5UVUexjlwF3E8kKIShyonRub5fhM0UwhtrW3Wqn8GpabUlPPfRI/BS/jEn9/go+bkR8p6xq1OJG7B5sKtnAhzYbFXZM49B45q8fM3j2IsulUkq9uuXQ4tNJA1E8h+6xTBA99Yv+kuen5rGcYpZOhJNiLAIE72MJ/Bbg5HdtK/ywa0QnmSXxMiB/zehoObHck2dlgeVAO9QCmPeJKRl+8daQ0HS1ykkyC3enYcxceqMqYs9u0hViobeokMIOp6jwyfw3B+CKuYhhmU8MJNhdZxsX+aSR8JReohTVP6pljjqe2wYm2f+gqdN/1kaL5NjFldoenOyy6YV4o0e4f9mGAGFbyTlNlRzPFClJKnHW0B0QZV00mpgWa3D53a5jvtB224jhAGykoSMPg+iydpOeVdCOw3xxBsfLbWzfUqOTskXivCTpEBlbofjWQsH9bT68MJbPJU3/CNBaGRay4eaSZwPWp8/oon/daKNHzDEf81J6hleJFwLlSkG0eRUg7FoUcWI1O7kdPIQGW75jhinoeoSpHoN+rHQc+8t0aH92b2JICYXVucJ0URCBfxdP9p6TOWsTw17y1xVwQdlnfY4ls7YcJ1K72ErA3zYZYb5oPNnxKQH9ztLFsrpad1avKh5w7bCrdwDnn4OKnXJCxXjp/aIBVS2peArgOH1Sr13nmhNgET1X8sBl82xO4+6dv24Jbcm+Dbr9sDt7dNQpnizP6o3ocir0YzRakqYTmbeOBKEe/ll4Fgfl5cfvfhWwxezTK/wGLBUJwVKvNkcxU192N1WS1ErSCTe58/sau+YEUPZmigs198ePNQEEBC40p/Sp0BspzvBqhj4TA8wwAWH5J7IfiJBZDICieJvmqub3oAR3ZhIiC5hkQ96lYx1N1H+6Nir9fV/P2BPuZcbjGAAZW1KwV+XoWc0/9siUBwdbFzCAEN/W+lr+XjKrq4fFOmXBw1WOg7rNs1SIkPzOfRgQYvOhZ2eVlAuiBHtxRPS/j8/p+pEyPMGNeejrw/pbJS44oo/I2F/OAWGHhuoS9uneVaBOCfcijDhkL45dzV0L0rVAV3QWXEiY+EMTgxwcRCSnmn00H9I3n1jyvtqzC/nmZtbZYLGcRCl3+OF2gOEsg/L4onpbxjqx3PKU0e40+EzOvnL6is00VZwLsyXk+UysFltRl9YK1D9G9+/Zpg9mJplO2sYEKUok8EXN/qQPDe5Mg9/ewXhj1lG5oprHjWJ+D/rDnWqz8VoMP9T1NvtZP7u9dFLjG58I567dHt0ftGK+7J37YavEGQHZlyEOSspvPw5ByFH149KqWMWpltK246I3VFoL9Q7CoG4z5/Wkvu7OEDwTWtGv4edqo7J8JQyZ21kLq8RRArJ5HlcMLQTP2FC2ozL/M15WDn/hdJ7fyjXuXIYbz32JQ7CB4/o8zbi+0g7QvQJ9ES5HygoYv4QQJxjQm2WBLjd1FrsoQxAwUsK7NH5AAX447BxXOnM0L3BTzLEmNQd98hiNYrB6CismleXX5XvX6YZ++aN6ucLwLuu1S3h6y0CWZjIcah350CghDC7JAXD6wjqGYkwnHeGzleRXHB8Er26P7svxsWEYwywxDu0pywzC/cqOnVuMsTHcRRqHpDz+uHwD5UTSSozvZ/fog3CBLZ/YltGZXaLocayZqI4HfOrxNojHFHrcpubhKKLrxDogqEpwFHkxFHu/TIBsnhYJjqJmTeoStzgfrg/iTR2+OS5weAg23LDfCs/4qS5uc63vniU+se7KeMZ+GNkIpbkmZRmzwuZ7Ztl/bdfRcxzdjAqKrDqR4rqi8dzBjW9zezEIrJXFcgMtIdtMtPkYh8NvFDf3+jG9oSvN2vrfvfSzg2PkCi5h5Zvq0xgVyYthya+2BeuRhsUx2GjI5elderlVk1mxT5cmquOvDOEtXhUVYDnMYf5/9yo1RUzlRa+N9cdhEQhADMQHRcQAHnLkTKSc+p1+p6Y351z0qhRU1vaEBg3DUprs7U6VrZ7CmvmS7qp4TIxkO6AD6mHDZbXYcjvP53EBKHsNpUlFRlArG/r+qUBftQdj+jzxjZU5EIsrrop33GTHfr1aC7pADJQ0EbbvZTj7+hjHRh525GPfhCLcfZcpLkTDTDDnHnw4L0ycQSZa3AS0Uqe/Rdiu9fbpSUgz6dpN8AVwtraS9tuK93Z7O5vhtBPZjtkHH+/rnnpUsOHBtLfz9uCahTYgQSxy6Ydg26Q1TOCkWZF5GwQYcjOZHuW2Vaq3qTWuRQKBU8kWH30eioLpu2nHkP1qVfp277f8c8d4w53NKjyTKRS5qrett2Q0TeMLMbhf1N4dz3ysAfFsbQ9UxGUwHF0BvIC3FH0o128QwzD5+1Jja+zNNjFymQqUCc+v6QBGNbbnMbkTbR5SnF6kOCm+zMhFC5Ig96eNv9iJLUSqqUCCppVYOzvhC/j2iChw7Vi0gyvC73h3aXPSsCJif0lFDaaBXdkTpkAazO84prfEcq6BLeyeMelbCACDJTC82prbVSUUQXc9VJz3epHIlUXsfnxrUBLcrm6AJbtRnUXu9Z4yn1uW8mSwy0ZpewFOjH6atB9nhza7zyuX/hV95Cgow4NLKR+9h8j57ljCeREabDMwfE7ACWrvQA8FQSPDpHhiR8HepKtJwmeNnk9Trcjwg91Ao/CX7iDrSZPegKSszzB6aQesadCvt0T++o0hlAh0v1hHaUCscaFCoujP4ajh17YQZHURH7506dUbWlrzZnilQJqnSgtCq6hAu5oXVo5liONUfjPa8uNFk9V4yIRK7HJSj+yK8UY3bPJpkG8qg2WcmtaNlnissPMiPX1ENBvdwRFjhRfl5+yubUD+mbIxYjjJOwLdSsV/YiY2iAe7klEmZqmd2iVEUKDsaNsyv8FcaalBhzt2njIfKt9OX3mfsaE5y7Tn56Rh9okn/LxnBQcwijQMt0jXgq3uyQRXZLKxDKDSo2jqmQJlexXXV/8FlpYtwKFocBGNROyPFxE37hXLCEIogHPeSBiUawBiiF1u1riaDMg3/I18Kc6bm2jUIYJHOdzwwXXQXJ1Z8edRClnYPW2lX88H5wi7L1zM+q9EvPuOyPFYf1Cb0MovD5FQF20sItTOhna0j8f5qqrpTQn/ScbwlZd16SetnD625kpaoBFbPhmCs/oN6wVIKmycTapqMx3mAqKnAcfBgklL+iOC6uLJr5EjUyf6eI4FlQyGUPM+TMaSXoVvtDhdJNZXwFWVSaohumY6Q89jx/f6n5UA35xbYHBjUGewRVjg/TwBjwHbt6aDqcenrW8vERYmYJNAQJWB/fqdF76Og1CmInuKBlrfq0mILo4zU1Gv4lDGx48kRm3vnLOnZcge1rcJBZZMxDgSlq3Scfj1Zm41Hn8GLhnNOlILhyEFpPNKVZJB0Fss+ZzSYCtw519E6Lk/4K6EDeJbeIm1z/eC2HtMNg0jTmNun9HM9HQFqA+rIy9CBqx3wZgmXae+qLfu4q0IYFxShgTe00/XVXapKyWYzdlB+3Fqv7ucsyNtl2A66du5JFN7i2zOGeFJ+nqaV7C2RkC0DqNhTUnBg0uOHR9T0KSbZ9rP93iIfac6H//hRWdO3P7NUmdvGuo5+NPYxE8kGAaHvJdsGpRW1W0bcONs5igOV+OC9DYc1WDKKAdfE4WSVQD3lKfe+4OHDzAlFH9clvnTh4RuGXJZIDyDTGWEtmOGAusaLK86xzfRGYa/nORD7yK3MsKPS7T/pqpubTJU8IOGIq9+5peqEE9LziuAj44ja7W7npXejVOU/lVleLw7kcovxHc7yjveBabrAHIcE/1TQE2EkG5wfFlWlACBZA28gXPPqc0+leZW0HdXPhvaGj7xiVdRHrDXO+r1hWl9stAThsvLo9WJ6Z+ZLihhULv8wEmBj1J2n9D2pCCiefqWwKCUj8k3hYh+YcHCLcLkL74cDykVtd6UcoN7pTNEE9du3bSAkgDh3mtAl9/pjNCgJg0UAoyz+SxiyZLU4ReBzSqCcDVUl/WgLMfIHly07ocEFOxG+CyOqjtYYPsk3C75dl2DHE/5MjRapWx7jkBxIRHAu3CUxWmcCXpg8QR2DJ0aSWqTxdYBzr5fPeWx8KmEIVobPUKGwSijvUrUaSk4y0Qic4bcsSiTZmYIFToqphzsWQ1PDqDKb8dfZ/lyyfuhnUIgaOxtC1WnNCoWcZgpIQFO7pQdxoZT0JOvtmfjZOkvYmWnnOOj+bcrLyqSRlg/Gf7UJYQJ+TDg1forrjwOxBwzVtJFJODo95FXuIONBlnsdQEFEhx+pGX9BUhYFRWV7uDoN94j1v42F3QVvxitNpHtpSSYriOZilJtXtU8+XPBhm2jFWJWBSzzkoF6Mr7SpZIrc3ArZ76I1tc4p9CNUMruA05go/RNbmfaf659hAsMqrYAKYDMxsZ1WS2hH3/AVgs3uw8WugXTXtU6l66L1DWYz1vKLvwRhoFwqVIkftqs/J+AvXVU3AD6e6mszPEQdz0NfE8BNuFyAHYAoJvzf/sD8A6feGWGnqzqeT1hr3wZ+QWVc+oKyDAZGD/cna/Z/MyQQRs+3Bo1s60Aeh1bPNWVm2z2K7cZ6pCTKXW9wG8QM4gmT242nSjCcWZkBKpjrfv+KR+BxLhXqMlbKqXNoaW6jIBE5Hd5PN6L5RxL09qfJkuHu4fK80rKj9AlfMu7d/n3oqBcTRsfa3YUs27476f+KONs9g14p+4rb4Ow0A6noQmAb/e4Iv43IvGpWIhtj0HbyQD3ydvLtEQB4X95qaE6Hjcxf0epRJQIN4IHrrr4b6rimQebMrjEbtGetwYvGIz6cOZQMDj2Zhs0jqAhSJiupzily8703hj7IHQzv+SqTC+OJeZcXNeT/j7lu1XWaR2Pa0z2Jl0P649j28CyRY3yhTQze5N9mEwsm7BKm1nHBCydvAPZP90zaeR6qal3dKWulzsq2oDmWNtkqyhNhIRmpGEcIo4u1j9HyY9E0oXQUJ5GfV9JCniZrronYPE5LIdeTdFz6P+sVHYf+ae12bkbgWcsIyf08jQY7l4ZMhYKIiktVIVd86wLTLd8Wi4SfX2OkH+2kN5seRgU81NtkrX/q4Uri5bPHx68s3b8ApMsJd6F4d6wAcPO9FLDSA/dkam3O0lLrDaZ/4J44vj6PekZKPavxPMlMr/Vt30nJmkMsqwV4hWM4Nyvei2p9t5SVu/+SsHo/fMifv+68QmA7gKxXGSmAhIQf7JDzK4Eun80s5WFSyXsv1UJaKMMHSW4Fr0SGZ5TQO6zNVMpcc/cEKbLr/Z4gh3ceAr5yAvizfy6QlZ5nKIZKO6ZdVHmck6ukI48/mdgx8qxCv3O98iq70RiIqkW2ozGHHHmurOgzAPnysdy8ruUWjCQ3alaKj/8TU87fmuYHNgDzpQvKMa/4+ED4BxAJYkcXdFy4XdzDrb+DtBIztzV7pasBxx/OlBQUf+ieolLjTwc1RuYx1GYti2ZIdjnpHi8pe0rr00S5mgydeHMjMyrcn1LIfg5gd5Rgfl6KHeBrsDUl2+BPC31ABpXFzm3X7lh4qncyxMk5BDd+GhQZVEGuVazz568vEYVgiPgGzxDUQa6uCJG+Wc/4Wi8/SqDDw+Ak4FUKGI9Tvc0xOfq6Ojf5YSblzKUS/DcX2JyK+1Ymef0SVlY38D/dYZ6/OvhMoA7W0AYbWZDj4xjY9a+mZTDranX4+imWY+6JsbeojBiZKrugi4lYUFTvRa5ZlHyAzd1Rmc7KhFm9G++pUv0auClwAPaJDOjr64P4vDLVkNtftH00qTnbTdVuwExuy2aXWMlvEPZcQRHkdI9JAMuiBM3dAjgi6sDruvdgtBsUyOiKn74NgfcPkFObzwo6TuFEOppbTf7DydOJw+9K2iQdbQ5ZJGPBysnKLfWi50KXc0ijHTgBDvD+f/BtGHA9PiS2tiqwDV1lenI/QDbqDRl/fa6R3v8FYRjc0WmMtoree9pQUAHfwoKlHjojwFJfFm5LelyaaziZV+XYEcmo4WwGHUL6LYCQWE/GghrMWL0G+2gR1CZtyuLtS6GfzcY7j7wSq8/mY+eCY081S5zlkyT1rSnHfk8IMLIRbez7UEcllaCzxu8PrtzzRnba3vdSWpEvA142CUsTI5c9q4XrlrRLbkS7iK6NEM8i03vvK+Tar5sSI63bB48ELq9GXVgu6L2QDaghnIdBm7i56eQk1oWl5JiK3v7GXOGQODOkvckeefTc2v7r18jZPCC+J6JzYjHi3xC++vj5cT3062qq0bigP2JxjvZMKhHavPgFkYzyycUkXpAQEu/o2mVKzQocFXwzuaI+DqJlSooj+xZ6GHPNs4B0Y/bw8++nXmLPpnC2nOFBtstZDK+rPvFy9upy8wA8IYvhKbuLd0wol/plXKqbSS4+OnL/KUqIkUSON5P/TP7pxZEwQkKKLE1DO2MfFyrhm+ei4V+OTEt0RqbTx+8KUi7OgdETfSqMZDd3hz6lW8z2RdnDT6K9JTypjrl+hb18wLZbu7B77jwyGMqyasuDBSaS7/kaexPpnp6VqI1jhFXMxRmHkSanzEs3RY4How/hiTO0dAgU8v1EFtsnWe9XrVCjYHQGeA+mLkY2PbCQ6Iu018ArcxsPc0g/nulYjITn10zdhRsa3I/sWE24V6ZJ3l1Z1YeT1mCwX4+kdLyIK4pCLCUQMIMa2HJ51ZWNie3xKF3b5wN4esKNU+Br1xlHfx0uHcjxwU7kIA60JjxffJZ1VfjLtC/qGPbutWVRzd9naPXCkwbCBSkHB5aYFzNO9beHY+rS7czHSGzZ65zNZhDOuaETvSFDamYmTfvWugbTdi/NbqgOu6hY46c6VQWG2Q5/kpaCVTMKZINHPgL2Lce8+eAANM4DJnAX/jQmEEh1HmXWvjrDLo4o90ROYW+fXuOXhhf2RChZMDwgdwhSs43SW9wuJVGGRsDJUwZvECgjXOUKbPFEWJyZ3JuTYdQJqHaSIQ97pN08W4BtYVo7SUaFBXwm2iGVSM3Eb+L3OwzF94gyCmHp/5GXqNd74o/jyMWwusWi9DVjUUlP8XbgwwWyeSbyQu2oLVNzfTY+yx6wVoP4zkbVFkSv/QQIUsmVKF5t7ocyO58o/ZHRKkln5ssDpwxPAkp+L6rjyo+lrVf3AYuM5nD+vnqHbQNw3OBg7XzSobFqMU6hXgEiMCIscDbvcYgTD/JADY49ZrXGMNFlxlY94dsJE5BoCsHNmfHbn9OAxbnNAOt2NdEY9i7s4foUuOivODfBqALBj0ktnphtAatCdAP45HoZbJoXJl+3HvE8QLaPvRnPqDR0pPgvW6ml6E0eNbACye4eg0LbxFFJnUsr0U3zN/JMsdi9sNERHZLviwkXK+j10VWhJCnZyV2VcxzkFB9xo3y+8P2vQKRoezcRIzLJhJWXFUJKNIrWZk2X4ATOPTSKxH/Dpv9e9JnLJNEg55VZMROUV2zAL2lPqSqz5BL7mjribBqtpSiLsfph+InWku9WcUohEZty+96OczEhTZ13s2ISrvXA4x/JwDPcKEmnF9FvpfSAGRhOSPLNTcbQjJfqbt/3+5VyAKSEd4wdLzKBNNR2RszNpzu5T6g4NlfAwKcAfUt+fej0sncCbpKlIQ9nux/kR6YQF4/dn1rx5Ro8knaGVOsO51t1E6tMMcSb6Pxr/X3vGY2K0XiwXgOXu9j7onCsSEKHxLm+EUNEel5OuYR/KUlxUT1KimPgRyKl/biMThuArqCY1/0L0MHrd6YQbHuZRATNlTJ2qf1h9Yb395MOs61ajMlSbLfQYTuzd1ozsc/OF0E+lTSplTZLEBS+7zOP71c1ZhnIVzSOTjPOVWeMFzTmDQJsTZegnIRPIsNEpcm3qzHxToVNp4upGg53ZjKAcPpBQJol64gt7/8DPDHE6YINJAgfXhAjSXdR87tXUSNTHQw1pOU/QnpeD/hQ+6LhZEkqmxIC6pyHuSdiXV1+A99Yyyu1y3DAMG8QHUdQ6heStj9FDGd5Sw0rqlI1l3NhSY2Fe3aujbZB5wnVRsqTRSLi+fgjFD8iWXhVzjxsL6X+oGl0aYwxyX2jGuv89HonszpGMqCEzp5lOC7sPLDXFpx6BwxuhDJs/Ybn95VTHQlxCti4OGb33NYSUeOjC8jrDuQ/0hOUMotnLIDoLo+HF0cuu5CqiGu4EPsuCIY+5NvUvnpqHMN4W981EiAvDDUCWIlu2qF2RnpxQfFtorPSydUZR/kpwBZ0CthMFP2SilJLDlpoNW1nDzolm+Pl7Po4WtoEAbKOcx8lZTtWOtVcwS0CQ07CIv/gibnSxO1yg+XkohZqlw22X2UfhtJhLPZ4SX6X8SUGF5Rr3q/VFFozMqTt6+oSygLfC8mglEgx+k23h4OnnpGCtqhv1ukQPpgL1dzNjJmM3BSg2hm8LzRi/PtynNSHROLIvDPJbs1GU+iLbcw5cgElBhCSJ/bk15lcUv3Ud/bHVaY66JYEljbZkeB1jcpQgj86BMgaI3ToNFQ4puiGJFFTGbnnA6zdgjNKLg+HpJVGLdCXEvkAPneC7pCNkdyUwHzmxOJhE4yKa+9BiR01AwAAEk8lbK/ji/6m0dZiszE9TznCvtJKjD91o1DoW3JSv8WKb+fa7Jk1GqCxLtoFnkJB4fEEeElhcU3xsBqKavieK8gsg6U6Ybxw0S8jVUnZ27Vs8W3PydVcPgd37memTNZnK3/Jbi5nm83i94/gs/gPPcQ3xNjZmwel1VN0q0Kh3lEH3vTJhVQ0Rwb47ecmoxmvb7GwrLpAAMgrdFIMIAMznGI6mdnI3y0zugzb7NAXg3PmlCTCOYmi/u1E52CTxgb7jUgQJWWoIf4Zr/a3zvivKDGouEjHb9UxW+ppP7s+B85R31wE41iBshuTYpRStXkSUjafQRanmSEYGffk3OeGSYBEwkh+5OMKLZfdznsVOiL0HLHqUPamRkQGmRVC9boH0hehoAHswtUmKyW6jAzNKkJFJ11FoxDsZgT1hPibqUdovZ+XCBHNQFKkpohIq+ZI1sXZ92HJ9vYxuzYf7YF0SOR941d5WT+sE+xz7tPqZ87zPOhNruP3T2oRsRgAB5SkYMVPBJ77g7CbobTkM+Db2p1OCEVEsbeMMS+Hi/Xs9QycPzf37H0C7nmPdvS8dYdOZ8CkYKwCvp0cC9Z+xO/Ktdx44QjjleDqKMegxkYQ9+EG/TnpEyUCwGsJI8yQjxHzx12OVQhUeScRC1h/m/xEOoVhVi/lAie/nE/bkcRtzWGvevSIrEjX7MU5NTdPr2ybN0RWCCNrIlBqUdq/RI+1J8PTUkF4tIylOmiLCXxUjo+4A9g7yu6ovOWKvBVSg6k0mFkJydoCTWvP8lHECC/q+NjNgWxsHTQkWar7RmOpu350VcvxDbVxI++DMVAwTjB+DEmwN6NNheh/b4gttTEtBwOgfP33d73CmtmI3aK+fR4nnbImBD9mBDo106LQOPvg2MVN4pdzWJl7z3kWrlFUXwrDbv12Wvy7ZTAyujSUacFliWhHMwles7+k7Me1mqEDuSpNlSCK2/g1jk7mjIeJlQvHpHDS/tAs0ZAwVidQjZonLCun4ZeKgl8LGNO7wkR+POdmvyYlN/t74jMP3i7EKgc5HtuECWa06lHi6uc52IctaRSTUvRLhcSgwwuuNVWxw8YiChSJDfcj53q41jBU1xO2z29/cwGisooCSQUz4p7nxyuPCcIwJvlaB9l/vRDalCV0Iqn13hm1oIrIyEGHqNnw6FiDsIH0GK6w+e0SjUonyR2Xrmf3E62pdUilnQJ7Jl7mvBrQkobriB5WxEBKPCbDtez88+rLBRCEdRuvWZZFFqK3VqIqyq5EieiG4rQN0u+tq4styWrs/7werFunCAgPgg86aulcB9uMGdoSodEYbwh+ICNo6Qxv4MZOa0R3SdG4HKPmnlIOzbz84dVwBLNeVwcgVpCI24C1I1OTOi0WJ8Jkd+IT+9WDl5W9OsWTJ3CpGOn0yXjcdWgY1mw72rfoWU/ruVzy/7ykXc9j5zS1U2XK2av4YAXac8bEtq6fzMAAAAJJMnLmiepk+7PcPxBHIkM6+O/m6v/ydC9NuRQCQlNAkx47PwdyxID6eSw8nIMpboHYtwin5gcvYlR13kKvM6vY8K9BJ1k/NB4PP4spEon/3NYo8qt91sL6l0MisTEOyKRLL1yWgeSbQL8uSyw07VyeJUBxiVWjWb6sZWl1Z/QQ8U0EZ1Ih+DdHwlD9m5ZeIaurh3CRq95CGtSrF1bJu17PVgjcggHb+jGi8UzZJO7N2kLXKKzYb94KA6L7aT8LpwD+8J75paEDAu60AcPeCNOVmo0c7d8XI/aYfW4e4GaNY3nR8FGVjllMpOgwrWNXWo2nC9H+vidAk9SZceQNb7iRSYpPNL/bhWmhmIp0HylJhYlfuzQBBl29r5HEyDqZSVqYgXLSZ7QorbaRTbr6HJKx7eSEojZ+fQ98c6c4QeultCzeaCqo9o4iQFnvD4U8/YPVzMAW6wd6AVFST2ZQ2rdxuQWd9yRurVTgTKW7mkfkR+gB7TuCwifT39zWiOWQ5Hf/kLwZWf4maqk7hZc8j9kNgxRWvNyI1imnPO/fHZJ+iS+WfeiVQJJOeA+5ylXPigbmFBtdAv8XAohMTtWdlUB69jR86w1EcD6ewkwCcofXRF0yNsxadL2CQ7tE4cykZfVfsHS8kPVw+rfsIJFh7wfdNABgm94YzKZBshcuJgGRKHfMrHK31wwVAqQlz1xSo3/L+ePrzZrefkTkBR7FG/3sDBhH3MAUGRJoVH+ehj6mgSh5zggsprERgYAeJHgS3mtBWP2Mx/oLPA21h+VdkNYdw6izVTLKUVs2kzUPxgczeWyP8wLsIsBBd6I5HNq/TyRw/sBQAjtM0u+1V07q7QiW7OWZW68jBrcXEq1m7I4CvXon84rPUS1QliGLSXeJel4JLbjCSeZbufO7EVRNdi+dMVxOKw7eTfbtoxw3QwMNze/NosaO8wglPnqWZ9mylkjVMzjF22Ty02sRjHn/apuDTCUnRLmHYfRM62cBqO0UT1BmoNcc7L4+BmoHpRG0Pl6hcQVV4fc9SuDRv/fdRSOuCtnnonLlOBkm/6tC5imwGjvXe20D9g/bTr8BOB+WxebUAAENslIdq1XFNq+W0XqyhGDN+FId6Cxli/FtHksWErTlSa84R9NbCRBJs6WhbFGDshRVZlq9oPmy8rDBAihtSIAiLRMQj820Mdra5GXLM4EGZDCzzC6XoTSXiM5nriWnvxUc1saotAErIcWVsCeUQsU37CMRNW3RmGPE7bC4vo5QbLXuEONd4tnSr//PrVMIIppjnJ+QBVD1odjjXs5IZ8Yfr/2Z8VbrOa4CCdVWaUrA+/NwCi4J3eJRIHR9o8xsSct9uP3BaGfmgFCho+A+CHujILOoAj59XTUeibikQlbrMrelSEDkgcDwPBdZDY0B5KRSx6CSZU+ubiYDPE+8MZKEVbvYou/RS2cpk4xfqNfYhKdPRs0vrAtYIgwDwAYegKiD9yJs3GRYXhX/q/PjpaGENMvoKy8Qfg8z1lgOfxNASkV69h4kzuh0zAaQPeetYPFwu4xK+FshzXsyVP3MipvlwAqbU3sxHNHAlh3lqzAEf5OnNl/GFdbq8axgMUBML8DK3+JZsYypvU0Br0LHf02LjJFlvyB5ruzYCCDcABRCX3i819wSxKWMfNLwXymdZENP+uvxllvxqNqSZJohaKrXgVZFkBJ6w4+HqpUzHSI3uF2hwRLCaxIZtYUmQyrxWTzVvSuvJ1rZH3ujcPy/I8cSBJY/Q0h4csjVF3dsHtJut2HQo1VNoxmNUPa1KYQGTkvOK9UJ+XMnNklcQsocAQGOaJwAz2qApdT4J1uKF0piCfcV93gaJWQdo2j3wuhKP805jbZaGqLkQw0QrDmNH65WO/cJktememsxS+N3VygHI8Gnshl9N9szCF9Hs1VprhqqXSSfLTTicLrvdFYD/t7L456ou+OnJZywG7zZc4pyvYCFvAhGfVbPQdWqsiC2PbcpPc0fhXzubr0UUE+wddErPLn7ngdGPyhIPJsburKtSiB/g39qeDG1m9c7xkIwQqD3Xl9OPMqHdv+DZVBiTsEETRocpnciQHr/Ab1s4b96fNbss8yAMIQgyXSUU6eGIdpna0kaCTLB47sEtHET1XVSbTwRcSzuXV3DR8LrQPh47AdPZFRAqCTkH87CLXvBczjmuljCz+URwW7sqON0XGDRzFlNoRLQXpy0hIz9bRRD/tD9e2nHBMSVKKs0Yb62aYKgh2qpbTbq6EZaXnqah29ZiMzcewR43HElGH4mpQK/jW0W55PeMjE4/H64I+IRWi8wHGDHMD4cPTXim/7/hOSZkPVWdzekEsFT95K+SN5WgXwNg27JXV7y6YdeaLzDJuctO828Blih1ff7FaqV/1kA+ZvzawfyxyBxUkGhVFW3o1PvUy9V+5qghy4o+I/LfPDL64HXDJDkkT4EzFau49SPif1p+x5MctFzEmtu4cY3xlzWgFVQBSk8eEH6UtiZuzXMhJ+1kR5fDob42Afo5ib6zNouWx40AmOKzaPbyXV5VvtMZ1NmmlSb2U3A5i7emKYVrG7LSpNmBw5F8E1kwb8aIMath9jGrkcd1hWKGWxUXLWHheszjNTVqjfSUM+8wE5x2bAlGBu9O5O7GgCYPTZpMZroF3zQneFPWF7WvBcxLyj/UX21QUKQeFLywG8xRyfxERNRozAQlXImw4M3hM3mqTLVhvZgaM+w74LfKyqKeVrvmDquoE97SIgNi7SzJ3LzRahajRx+00mjL3Nzf2VVRsLn25wi7eykz3W+FEkRdHh7Yh9M3KO/jsrVuMvGTVerIBIbwDRJX8q7me42FcDlTj8QztGwmNZY+5HLbi8/Yu/dyu1weBO8zL2uqAa/9ajOIiDRhVE6HycP7Edru5eM667I91Egveu9gmtcpOvqJkoVCjDQtYTxllv4kAroKb10t7sy/25LjBIt97YH/xPWfcRMc9YctkwD6Bq4L1SEIz2iqe6L7v2YlPkiUzgzy3JwANHJ0ntJaTyxWkXr8PwEkveive0fOex1mjQV6Z8ai5n1W/6csqVvneSgxaSS4SpA9cISfbry03wmCz9hy9YovowmAf0vlbCCV4nQqIafFyHNU7ewsxR56alL0LUF0hoofRCgKHPJA4edPriizWV+4FSoW3dOu7iz9KtiddqMQSMcmvdjPhA4wd9MuImlqZv6Ex9Kvoy13qv1tcg1BgAgEssKQPkF/XFLryFIxy+x4Yc8+cxTE+g6WSLI5w9X15Sqw9SjmpSh82RB/HaPzqkA05tW03mZH6sZSBaudvu0NRtOt64u7oTACBuPzgAE6A868Ku/gC694pWQbLi6HE//DzJ7MMlzmK8Sbp4JmE6hYeuYD4xKYlH3Cwt0c9u30srUqJpweLfnqT6hzC4oEeBfCm2ZXqYX3GNSma5ItQ7cTdFMH5Txs5sMDuBoI2W+ZsJwkPK4QWVwYG33wWFVWYHnem3+wAIV0xN59gyKytdr6jG80+9WxIe0ihMESi6FXHvUu40QQtzUfTlvwwkUxoUJIfoEXjtDYitk3yMZY2nGHTwfbltQPrvcWiCf5TybKBtrOOLlF8BUy5AW5u7/ajW7mgpBWfwAUIfm8E8QQncj6Iv4N1TnngSsLyex1yPu3GW216mU1SfMlbiF/dJAr8tQPYy/ytPSUfIQH+WNvR3WFEpfAQUM74ZiMed5L4QwLinkqy0/PJzA6DPCAFMhlaOigcNItgKPpYewDMfhfmHy7hX9/zbs/VpdmtrKFbaLyBtsV/p3gdUBQZmCxX6JUkQSzv8ZL+M8L0Jtgnt9OmPCfBykV/BlFWq0ppTd945ITGUxY9lr5RYrTl4R7hQo7sPzOqA3TVPBAdP/3ulvc/F4jzbSuyyoxJ2P9+RVRrYqtk7QpEinsQ9roOpH615NwMnjaZMjW2VufRboFPN7NS6cljWQ1EedqtgJd7SIWOnJz5viQLBVVIK5NVXul9ngg994Yqb7dg4XWBS6Xy3VKKExDrZVtMWm7c/wOYq6Ce7t19FixKxX8OXCSvKwIHH+KknnIE9a81kPO5B/6B7CmJKq1DrRjQktf8bV/EaYlAHHTRJ4Rjc1smd+bC5xRdwNcG8xk8aex0T+4Z+GnAicxUNqydnImZof908Bd4T24onyqoVrYj2j4QLzXAM8k0gzQbonzqoWjWIrwbylYQBVWvN2ND1Xv0gW/nt2iuIJ/TYo3W1JULs0+PoILtLzq+EmTmh8dpcxXOz94BRFbTXMGR5cXU8i0sfp2w07xpvPCLvhcKX3Doguxxol7qaNibGHiod2aaBoY7MmbVw7r+y9/70pWSdrPheyfqYbFljnnWDUnUdFCaZC4x1iJKxD5t63/p94KH4ABqi31D0J5MnriWjkott5mIvWxdLWAwlUjWorNDmFdfTb9lxPM3ictgAEl/+fAtWR3vwRr0h3SUXf+4/abyQDKXGK1+0YJnSFegny2c8buSq+oAbxHBS94DQflZuYA83ib2eceXyn74AhzKBzHDaki3i0GPEdHJU2lsyRW93MeiAAbaJ3GlXAM0bKRdD2ojZb+j5bnnax1rNHV2E2W85XGBG79oNWCjhgDM3wO6KpXV6HJFPrhv9odfLq+jELq102NprKHJmXtRdURdOtrs1prjr1i4H420ZvOZSauWeW288kyCyt6DDwlXrMB5OK0m347Oep1rLwaukZFLWWzZqbwQEzS7VrGi/qJUmjf4icSpG5jyFaqmg/IWxSk0RnfM71anbcuo5vMyjRRwLTezIWH93y/UjKRKIkCMGxqvo+e/9BdE1Q89PdltH4w6cujwmYTkximwWLM4OTJo3ufnmP5wCp+9e9XsRAJmMwyspYtEHF2uHOhuICzYje2uBbhPHNVYQ53VGxxULdiXwAkIiHtEvrBIiqBEZMgiCHIhREBubfjb/aI4clHjI0TRayfrpGCaG6iNkYiDOfEMQlsR8QrN1ER76gZ82K498cJgBLEBFo/76CsJCtYJEV9KDEVQPrXG5viux6K/knKpYOvkM7aWRWv34Ac+V8gV78iDzDgfMsPhfNk5Z7GanFJjmb41PvnskzTAMuiXlsTZBu6SQnbr2RssivQ9Wgo5TLSYYCTKjFYTMP0s+nLT+Z9C+chvodTmh5IUtpSb8H79YLOFfChQnw0Imkvdf9iFnCRIcnIQTPT8Z8fAYczU0qZ/7uUAFgwBZ/UKWQ6I7md104m/oyLYI3rLzFOf8qUwDuOAPQDeNEn5PnakYOaZMOx7n1jQneWkC3SbgMRjAChcTlIgY8XINn0iFQRgTjRnbMaUO//dTyG4HcHnBNnLRJvKpzSg0RSEp5DQIf2OJFs1Kw/dkZng2lZ1X/Ox414lWwQuaksqA/0aDwr5KV1Tx/6CMDwKatgeRp3RcGiFm9M/wRrwhzWFDWNrm45yEV84waV79PkXxZMCTjd6IHSb3rT8A0NyaN4h/X6Uf/0LgteGbI8hiS7JplMRV6EyZbPVji7MmXnqN1s/5Zwh6WeoOXTjkAlOZ1i4Rh+p0HxGzP/f7stm97kLiuhowHOlmqV6wmvetwMHp6rkE5aC3VA7L0IKDW8j4UupZOh282CnM6PQas/mNy0ARauYYyCbBs/g9FRbUrjYjWgCHDQ6EM83lMMhf+NnY95IE+1unBWoB4yifjvGiN4RNTZGP3tPzpTUF6yTCphss+kSokRseg2pXdEHCHsVAnVnd6XZOqxsbBJV6yWUzpdPH46niCLDmUiZp7FgJ9oVIslyslEIoojWZjYTIhOdf8hqQYPFUBkYla+rMKdBIavRUnRdLQITQT2nMBlfYx4wqK6sL9iQsB76F+JR7sjG6mRWy3ARsXkIlVwRWaUWco6kQ0nne173/GAWHtQjCSam85MyJTwdIHaFRGGhn26texJcTTKgpaEsFrXUB1XzTTdIriD2k9SPSQ6Rl/x5ETDUgQTk3g1BOO9pUuln65EkDwX98cE00zkON4wEAdCP8PcimSBdQRywep+urUSM+mUO+ZY3wbJ23tC2waHu/WkCj7hJ6yU9ZRadN85ffs4n6fdE/BM6rArbiyrLEbnLdpzeXn+4Fe9urDnnlbgKqpY81v8XffkcwJOLVE4vghJZDJPT+QrbEklgAikQGSxnguZliL/thRUDmOedjCtuxkwtQPX+0dfZiV4TOX9n6sQup5YoZOFupN+EAxBaGpR+t41VV8L/uLYp5wis2lbeIqoBN3n4uX+goS1qPRl6/Igtqvkk0WxUNjS79/b3+q4EJKSDORTD5Lo7GyqmaXeg63uT8aVPQpZ9NAoptWcXe1wLQa0Pe5HlnVkNdu4N3XDm5OqOl5Y7iHK7sXw1AWEr9QzbikGssQ+tfsdygZyDWzE3YBW2OFbb2pjXqcTeM4X2FowZCHPwTwmFwjUrEm0/o5Lk0+mnhosFUR+1d5jZJFBAEQvMy5hpEGm7k7COQckYq/z0i8CM8KfiurqeasMaC+VoyE08mcw3HiPh42H1856STw/2xguxmL1+BuA1QY8SFedxhZYpo0xmvUA6xy68xqFXGgv3105cvYkgTw1s3IVbm7aqj2gu16ZQUC2z6tc7ftCf944QcgxcfojKrFN3YR0ftx5SmrNH1mzgydPZbO+OachyLcTKOr2Llx7NGns9ZQUpQkBqcGKnVffyBCDtiOdPOnmPFLZgNItOTLg8B4RyUGEcd+25Cvn8RM5K8ORif3BmyqkOBKqxm5soA0zodQTjmljw7Pu0wz7xobJVKOhMtQ/zCBD50MV+6CVpfEE30v/DIr3U2bwvs80aitg4o5Z6DLtA5KsSyj8Ayma3yr0+aVT4BVIlZa0+TRWRrjnU3k81TzdLevTggbAFUxje1Uf77AxousrDQjVH0bG0aqKRdg84Cevp2pnuupevSNI34n+hxVqGko6+qzRP8dD9vzsqWCl8GhXWmULi3hmJWBP2wze73r6jZNsGSePF+/GdoQCRwz58tQtXUlHGrImN2fqvlbSmFrgsY9ZDzwWf68/dxC0+08BufIgaT7+gOL2HTNMhEZQl+I902ppIQvS6AlO7nWGoZnwC9OmlDogiL+jGYSzQS9k/VxEaOsRXTfgVLxyadOx3/yEFdPx02tFpCIKjQJEdMBAfZrKqjVJn707bRg3/YFkBY+PNukAAAAAeogp3hcx8i5/Xcr41TixqsbqNkCCDfpZ9TLzOs0JvZSkgp/5r8qK4/H1p2WnKoAoJq9BRtXRhksypqR0MWR/M98xrFZxINsE6I4zdE3IegZA9fy81Y9O8dP02HzsmEzyocyvECP1wfWh6RdqzvdVr/t89bCJabgbdB0FgYR2tU3fD1qQd8we/netvhUHCmgiy8QstfxRnM642lYXqlJl5f8p7tjR8MbbOPb/GO9hoB/j/hzzTgk1nWP2xe/ohP3pa7q+yDSn61qhTfg/ieBDHuHnH8CFKIPJm2mBAhp2KEfA8k7QKcEkISw3Ut5gcs4cKmWcJf8jov/7Cb8SnrcfZzFPhtwnS6ouliDqHABEuD6FAYpGwKIt9sHNq3uWnR11TZxdZ59kxGfP9khLJvdKcE3HgPsirjyo/42SUZcTd6p81yiPqI94MdJb6euWwr4smDKaVhry6S3qoxbThBhR5+A2paB/LwvEzbMI6cWsAWSwO9jZzFjMoQVUL+L1C3lSpPmD0gddFMw5l4u/8tzwb510Xdl9nLmdcU5/N6pr3/SSqU9GvIo+knom3mXeNiV4+aZURcfopRtMiiErqtVfHXTQPVRBOPRGPFLotya8y7kuSQJvjQmOvYvBdgpuv4AatXBhYQ3Aa0DiTgPAHvUsYimtut/JAXOlQeaVY31ZCBnVuaXWAeRTrdG9Uu1Bp7/n8RFn1rYxmw+i5uEJaBTp2aat1KKMo9iBed4IW3Ltd0abMNYmvvmnJ7wQ/WW+/mjO1gfLmOJUdeE21j7Y+6jFKSIrd2IPPzrmllOq/cfKkeeNy3PI7AtMG4GuMihGt/hTw/rNG9WV3rcOu0UZ8b4p14LZ9JLkD99HII8e1pjqoHJ4Z5ofKW4Ft/Ukd410eL5COsGwEh0T5YH4Q9MEMSLHTpPMytQklq1BtK7S4+Eo02KTWF+VRyzV6XbQdilvkEQCnOevgG6URruOz6eHaT0CQcZc4SbTzcLi0vneL7jb7hjSmK40vvEVlm0lKVW+Rq3GrbGl6jA9RnkOeuZcqBvA9JNzs5xD0qT/71lZ3E+Q5lCCOjh1yMlIONrv403ibQ/zTv8HeotxlXjjBHNuHTECQ693hLW/QgO9LHVnwuShHFG/3anSpBrBGwgH6wGFoHcPEVgE+IaPrzdBhR/1TcSAPscIco/fGRGXR9opmT4svLZacZbiSwZdeZ3jVJPBqBI/UE7//jiVGQIij80AuacJucHRKkMm0gdXLBuxrqgr0yRu8O6EPFYnwJDTGHsISQQ6bXKjsS4AAAxESN39tkaFtT13NnXeEqHUWCVXB810Ii1Rste2VH2xpxb0VeioK24XbE1GpzQ4wpCsA3c7dUw+ydy5NE2GmIP/b5kr2+/eKpHHi/Pr4KKLmnQJy+yC9kAvz2ad9z3QnJ85Ygosn4FD5L636wAgAANn/Tmz0EPBKcQLpi5LLmwg53oxNM6z8MXosKYI8Mmv/KE84+1HFrkojrwNmQZohwbITmPEX9wgw+nqAQI/C1XwaQi6tuOdKTjPh3VmoFwFqfumfb5vCina+DyneCm0D33Y921uvpLcK15+LkCHWGplnizE37cncMcjQHxRzt8RM5PRDkPtzyeTOekDn/6NJcEn7x/OpCSX1EfrZSwQx5BvQgTvdZzaEPkOZCvr+Wv3sAJnrGLRNLNbVfFZ+afZe6vbkJlY5a9aoh1wUNlWii80jYgEqbkh7NIewUZ8tQrwIpuPR0At3/v0F/1mNGKqU9aVKM7gDAQfhCpojZHYvExRSRGu8wU606+GFhvgku9Awirbvr0C5UYU2rMgRPUF+i6j6RUBzFxCScsnnprHrWaIdtWJ/BQhZcnIrlVYKFWRxvrQ7EUWKTdLU0xbkFmw1Q2FZVeU02OjH23YXyxNT5lWVPRD2TEn8Rf15KZLF3pLYB3Yh7HTyOYPRDCAdEihgtWz5xgybraOAIt2J8W5BmYKVTiK3rVb8/kdocJ8WDvLVYN1UiZ+2PWDZr1fupAtwguTf4DSye0j05uQyCihcrWqq3syjtpr8xGunKgDM+KAUrHpM/vq2yjWLEC5yb+LI/bcV7tguFlc70YyxEQ3ZGQNjWXIRCAwFirVVMVVjAQym4AAAAAAYqP7A7ox1gWS55lrfvJ3JJtZfuL/2lbSZ8s+y8I+YxL2Z9Xfal7pU+drHRWJtG/2qx1b1Iv3UzyWvaYV5zjT+TJiCyLnOQ/ZlsLaGLSL5SrMEy26xNlzjiPlQOu2xw5euIw1smOLk/hYprbmREIUc3087cIXMOL2sllp7HmZIvNmn1UJvw/9X/n26OY3QzTvkQSMObl64STgbPKcshxqOLLQ9n3J7GAeLyZmbGK1nHFh+68lUS9yQUBNTTyWbGozr/Qj0PNkzQtFg3CQ98UE0bbf7qQYL6GvwsYpO1y9QymG1VtqP8GBXQrTxhv32ROGy+kmamBCU+syktZ6+3KFDyPnAIKDDFCZAGsHh4k8PNWg9i+PS8aOn+JgoZfoYmBmC1wj50LZEnCH6EVrQ0IWp/6Gj+RbtXldbDMSfVPCYwl2N91OlAWDtujqGKheOCOnLWEH97KBD7K55uP+/WOeZVlPgE0+6wg7QOO0zp604Jv4AfBQ9pcM9mD3vJ5OOLabrssy6KRu2/GPndMDNfitPLPKoaMCVfKlAXGfG2d1TNpDpWC5RhNdjTXm4ENphx8Dhqx8e4FhQ6F7clZ7ZqUH7EnWXCpcAAAAAWy230goZslcexI+tP3kkNz8htSKL8vBIEu77MBNuHVpinklHEIjzYcluuzqm485pPAQxHbikIiqALW+GSzjdPH8YVwcw7HKmhVYo3eo2QYnNbJJ7PbfQuwQYvCrx4ATZGadWUCbRrjL3efSd9OxIFcjHe/1/YlmahBPpBF76Y4lNjnnskJM0B5fVWQIaezq1gJKIGf7y7wBXObDbs3INvGsHDl9DVvuB+mj5MzTRpcea8CpLi1cXIkQAjfPCoq2r6KH87bd3k6V3MHWle4d5Rj3ObIwUxmRO+5D8yzMRRcD0Q+Pbnyuf2ypyO6o03Ginkf7z7xUjjQByLaZTQjV6oYirhjelk2W/SOVpIVgfKaij/sPVwx65czc/6mlAlvYXr9nSYhgSKFelK0gnY+3UVNgzbI5JKk+ANpgN0RHPi0cBcXaegsCQIkheTxwetuqot27NYAYlVnFcaYiWPvo0gv4yem2O+AHakRbQFKGcMB19H/dteOHH/BAy6a4vV69Bl00TcdnAAAAAAH2jlcrOzFeoVPvOwrAWRqCKMiB5tOrcTTiCnGM51IgF1lL3rqO8+rW02AqSsBNbQf2q9p9JUjzokw+6jygjG72KMkrYD1VpBPLv1fKHsWy5CaizwdRqRFl6tlo/zEFsLS2zxvF85W/E+h6JfPZDha0U0V/Ln8CzD+wYhSBkp1qg2kpOUKJTaOOcjgZFE+1f0AE8YRRTDFrXnXmDrVF32Z5mVzCZsXq2oEXvMBazLBaD1J7XedPMY9mv/FTMAi82h7EqWpzC3GpRqOOkuAkv2cwsGSJQTCtEiNf1CLr9Mv9yAqGiJufEc5byTjnqHRRx//EAaNsthrFHBBgTe/hjRlhxFQE5MhMjAAAAAAAU5PXfvvFaU7UEQVwSsypGQTSAKfAAAAAAAAAA=" alt="The Stirling Fountain" />
        <p class="hero-lede">
          A vintage parlor serving hand-scooped hard &amp; soft ice cream, thick shakes,
          sundaes, and Italian ice — made the old-fashioned way.
        </p>
        <div class="hero-ctas">
          <a class="btn-hero-solid" href="#menu">See Today's Flavors</a>
          <a class="btn-hero-outline" href="#visit">Visit the Shop</a>
        </div>
        <div class="hero-info">
          <span><svg aria-hidden="true"><use href="#i-pin"/></svg> 225 Main Ave, Stirling NJ</span>
          <span><svg aria-hidden="true"><use href="#i-clock"/></svg> Open daily · afternoon &amp; evening</span>
        </div>
        <div class="hero-cones" aria-hidden="true">
          <div class="cone-glow"></div>
          <div class="cone-row" id="hero-cones"></div>
        </div>
      </div>
    </section>

    <!-- ===================================================== marquee -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track" id="marquee-track"></div>
    </div>

    <!-- ===================================================== flavor board -->
    <section id="menu" class="section-pad">
      <div class="container center">
        <span class="kicker"><svg aria-hidden="true"><use href="#i-sparkles"/></svg> On the board today</span>
        <h2 class="section-h2">Today's Scoops</h2>
        <p class="section-sub" id="board-count">The lineup rotates — check back for what's fresh.</p>
        <div class="tabs" id="board-tabs" role="tablist" aria-label="Flavor categories"></div>
        <div class="flavor-grid" id="board-grid"></div>
        <p class="board-empty" id="board-empty" hidden>No flavors in this category right now — check back soon!</p>
        <p class="board-note" id="board-note" hidden></p>
      </div>
    </section>

    <!-- ===================================================== specialties -->
    <section id="specialties" class="specialties section-pad">
      <div class="container center">
        <span class="kicker"><svg aria-hidden="true"><use href="#i-sparkles"/></svg> From the fountain</span>
        <h2 class="section-h2">House Specialties</h2>
        <p class="section-sub">The dishes that made us a Main Ave tradition.</p>
        <div class="special-grid">
          <article class="special-card featured card-lift" style="text-align:left">
            <span class="icon-box"><svg aria-hidden="true"><use href="#i-wind"/></svg></span>
            <h3>The Stirling Storm</h3>
            <p>Soft serve blitzed with your favorite candy and toppings mixed right in.</p>
          </article>
          <article class="special-card card-lift" style="text-align:left">
            <span class="icon-box"><svg aria-hidden="true"><use href="#i-banana"/></svg></span>
            <h3>Classic Banana Split</h3>
            <p>Three scoops, banana, three sauces, whipped cream, and a cherry on top.</p>
          </article>
          <article class="special-card card-lift" style="text-align:left">
            <span class="icon-box"><svg aria-hidden="true"><use href="#i-waffle"/></svg></span>
            <h3>Belgian Waffle Sundae</h3>
            <p>Warm Belgian waffle under two scoops, sauce, and whipped cream.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ===================================================== brands -->
    <section id="brands" class="brands">
      <div class="container center">
        <span class="kicker">Scooped from the best</span>
        <h2 class="section-h2" style="font-size:30px">Proudly serving</h2>
        <p class="section-sub" style="max-width:32rem">Every scoop at the Fountain is churned by the creameries we trust — real cream, small batches, and generations of craft.</p>
        <div class="brand-grid">
          <div class="brand-card card-lift" style="text-align:left">
            <span class="logo-box"><img src="data:image/webp;base64,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" alt="Ashby's Sterling Ice Cream logo" loading="lazy" /></span>
            <div>
              <p class="name">Ashby's Sterling Ice Cream</p>
              <p class="blurb">Award-winning Michigan-made hard scoop</p>
            </div>
          </div>
          <div class="brand-card card-lift" style="text-align:left">
            <span class="logo-box"><img src="data:image/png;base64,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" alt="Gifford's Famous Ice Cream logo" loading="lazy" /></span>
            <div>
              <p class="name">Gifford's Famous Ice Cream</p>
              <p class="blurb">Five-generation New England creamery</p>
            </div>
          </div>
        </div>
        <p class="brand-note">Ashby's and Gifford's are trademarks of their respective owners, served with pride at The Stirling Fountain.</p>
      </div>
    </section>

    <!-- ===================================================== visit -->
    <section id="visit" class="section-pad">
      <div class="container">
        <div class="center">
          <span class="kicker"><svg aria-hidden="true"><use href="#i-pin"/></svg> Come say hi</span>
          <h2 class="section-h2">Find the Fountain</h2>
        </div>
        <div class="visit-card">
          <div class="visit-grid">
            <div class="visit-map">
              <iframe title="The Stirling Fountain location" src="https://www.google.com/maps?q=225%20Main%20Ave%2C%20Stirling%2C%20NJ%2007980&z=16&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              <a class="directions" href="https://www.google.com/maps/dir/?api=1&amp;destination=225+Main+Ave+Stirling+NJ+07980" target="_blank" rel="noreferrer">
                <svg aria-hidden="true"><use href="#i-nav"/></svg> Get Directions
              </a>
            </div>
            <div class="visit-details">
              <div class="addr-row">
                <span class="pin-box"><svg aria-hidden="true"><use href="#i-pin"/></svg></span>
                <div>
                  <p class="street">225 Main Ave</p>
                  <p class="town">Stirling, NJ 07980</p>
                </div>
              </div>
              <div class="visit-divider"></div>
              <div class="hours-head">
                <div class="hours-label"><svg aria-hidden="true"><use href="#i-clock"/></svg> Hours</div>
                <span class="open-pill" id="open-pill"><span class="dot"></span><span id="open-pill-text">Checking…</span></span>
              </div>
              <div class="day-chips" id="day-chips"></div>
              <ul class="day-list" id="day-list"></ul>
              <a class="call-link" href="tel:+19086470020"><svg aria-hidden="true"><use href="#i-phone"/></svg> Call the shop</a>
            </div>
          </div>
        </div>
        <div class="photo-credit">
          <p><svg aria-hidden="true"><use href="#i-camera"/></svg> Flavor imagery is illustrated in-house. See the real thing on:</p>
          <div class="links">
            <a href="https://www.instagram.com/stirling_fountain_ice_cream/" target="_blank" rel="noreferrer"><svg aria-hidden="true"><use href="#i-ig"/></svg> Instagram</a>
            <a href="https://www.facebook.com/people/The-Stirling-Fountain/100093483891376/" target="_blank" rel="noreferrer"><svg aria-hidden="true"><use href="#i-fb"/></svg> Facebook</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- ======================================================= footer -->
  <footer class="site-footer">
    <div class="stripe sf-stripes" aria-hidden="true"></div>
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <span class="wordmark light">
            <span class="mark-box"><svg aria-hidden="true"><use href="#sf-mark"/></svg></span>
            <span class="words">
              <span class="name font-parlor">The Stirling Fountain</span>
              <span class="tag">Ice Cream Parlor</span>
            </span>
          </span>
          <p class="footer-blurb">A neighborhood parlor serving hand-scooped ice cream, shakes, and old-fashioned treats on Main Ave in Stirling, New Jersey.</p>
          <a class="footer-addr" href="https://www.google.com/maps/dir/?api=1&amp;destination=225+Main+Ave+Stirling+NJ+07980" target="_blank" rel="noreferrer">
            <svg aria-hidden="true"><use href="#i-pin"/></svg> 225 Main Ave, Stirling, NJ 07980
          </a>
        </div>
        <div>
          <p class="follow-label">Follow the scoop</p>
          <div class="social-cards">
            <a class="social-card" href="https://www.instagram.com/stirling_fountain_ice_cream/" target="_blank" rel="noreferrer">
              <span class="icon-box ig"><svg aria-hidden="true"><use href="#i-ig"/></svg></span>
              <span>
                <span class="label">Instagram</span>
                <span class="handle">@stirling_fountain_ice_cream</span>
              </span>
            </a>
            <a class="social-card" href="https://www.facebook.com/people/The-Stirling-Fountain/100093483891376/" target="_blank" rel="noreferrer">
              <span class="icon-box fb"><svg aria-hidden="true"><use href="#i-fb"/></svg></span>
              <span>
                <span class="label">Facebook</span>
                <span class="handle">The Stirling Fountain</span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© <span id="year"></span> The Stirling Fountain. All rights reserved.</p>
        <div class="right">
          <p>Made with real cream in Stirling, NJ.</p>
          <a class="admin-link" href="admin.html" aria-label="Admin login" title="Admin login">
            <svg aria-hidden="true"><use href="#i-lock"/></svg>
            <span>Admin</span>
          </a>
        </div>
      </div>
    </div>
  </footer>

  <script>
  (function () {
    "use strict";

    /* The flavor board is fetched fresh from the TouchBridge backend on every
       page load, so whatever is saved in the admin panel is what visitors see.
       The embedded default board below is only a fallback if the network fails. */
    var API = "https://tbstudios-backend.rork.app";

    var DEFAULT_BOARD = {
      categories: [
        {
          id: "scoop", label: "Hard Scoop", note: "",
          flavors: [
            { name: "Cotton Confetti", dot: "#F49FB6", small: "", desc: "Pink candy coated chocolate chips in a cotton candy flavor ice cream" },
            { name: "Chocolate", dot: "#6B4226", small: "", desc: "Rich and creamy chocolate ice cream" },
            { name: "Strawberry", dot: "#ED7285", small: "", desc: "Strawberry ice cream made from real northwest strawberries and real strawberry chunks" },
            { name: "Vanilla", dot: "#F6EBD8", small: "", desc: "Creamy vanilla ice cream" },
            { name: "Lemon Bar", dot: "#F2D25C", small: "", desc: "Lemon flavored ice cream with graham pieces and lemon bar chunks" },
            { name: "Cool Mint Cookie", dot: "#7FCFA4", small: "", desc: "Mint ice cream with chocolate covered mint cookie balls, Andes mints, and a chocolate fudge swirl" },
            { name: "Death by Chocolate", dot: "#4C2E1D", small: "", desc: "Thick black fudge in chocolate ice cream with chunks of chocolate pieces" },
            { name: "Amaretto Cherry", dot: "#C2426E", small: "", desc: "Amaretto ice cream loaded with cherries and chocolate flakes" },
            { name: "Peanut Butter Brownie", dot: "#C98A3B", small: "", desc: "Creamy peanut butter ice cream packed with fudgy brownies and drizzled with caramel" },
            { name: "Play Dough", dot: "#F5D848", small: "", desc: "Bright yellow ice cream with chunks of red and blue cookie dough pieces" },
            { name: "Campfire S'mores", dot: "#B77A46", small: "", desc: "Graham cracker ice cream with marshmallow ripples and chocolate chunks" },
            { name: "Blueberry Cheesecake", dot: "#8FA6D9", small: "", desc: "Cheesecake flavored ice cream with ribbons of blueberry" },
            { name: "Sea Salt Caramel Nut", dot: "#D99A4E", small: "", desc: "Creamy vanilla ice cream with a rich swirl of old-fashioned salted caramel and nuts" },
            { name: "Sea Salt Caramel Cold Brew", dot: "#B57F4A", small: "", desc: "Mixed sweet cream and cold brew coffee ice cream with a salty caramel swirl" },
            { name: "Camp Coffee", dot: "#8A5A3B", small: "", desc: "Velvety smooth coffee ice cream" },
            { name: "Cookies and Cream", dot: "#D8D3CC", small: "", desc: "Vanilla ice cream mixed with pieces of cream filled cookies" },
            { name: "Cookie Dough", dot: "#E4C48F", small: "", desc: "Vanilla ice cream with chocolate chip cookie dough chunks and chocolate chips" },
            { name: "Mint Chocolate Chip", dot: "#9ADBB8", small: "", desc: "Pepperminty green ice cream loaded with chocolate morsels" },
            { name: "Rainbow Sherbet", dot: "#F5A05A", small: "", desc: "Mixed orange, lime and raspberry flavored low-fat sherbet" },
            { name: "Rich and Famous", dot: "#D98CA6", small: "", desc: "Vanilla ice cream with chunks of brownies, cookie dough and chocolate cookie swirl" },
            { name: "Coconut Castaway", dot: "#F4EFE6", small: "", desc: "Coconut ice cream with a coconut cream swirl, chocolate chunks, sliced almonds and swirls of caramel" },
            { name: "Black Raspberry Chip", dot: "#A64D8C", small: "", desc: "Raspberry ice cream with chocolate chunks" },
            { name: "White Chocolate Raspberry", dot: "#E0566B", small: "", desc: "Decadent mascarpone cheesecake ice cream with luscious red raspberry swirl, chocolate flakes, and raspberry filled candy" },
            { name: "Dulce De Leche", dot: "#DDA758", small: "", desc: "Sweetened milk flavored ice cream with caramel" },
            { name: "Cherry Vanilla", dot: "#E0788C", small: "", desc: "Black cherry flavored ice cream with black cherry halves" },
            { name: "Pirates Treasure", dot: "#8E3B3B", small: "", desc: "Caramel flavored ice cream with chocolate coated candies and chocolate sandwich cookies" },
            { name: "Tipsy Banana", dot: "#F2D291", small: "", desc: "Banana and brown sugar flavored ice cream with bourbon revel and cinnamon cookie pieces" },
            { name: "Hook Line and Sinker", dot: "#7EC8E3", small: "", desc: "Aqua-colored white chocolate flavored ice cream with a caramel swirl and chocolate flavored pieces" },
            { name: "Cake Pop", dot: "#F3C7E0", small: "", desc: "Vanilla cake batter ice cream and salted-chocolate cake balls with blue and white sprinkle candy coating" },
            { name: "Tennessee Toffee", dot: "#C77E3E", small: "", desc: "Toffee ice cream laced with smooth whiskey sweet sauce and garnished with broken Heath bars" },
            { name: "Sea Turtle", dot: "#66BFAE", small: "", desc: "Sea salt caramel ice cream with a salty caramel swirl and chocolate caramel turtles" },
            { name: "Cow Creek", dot: "#D9913F", small: "", desc: "Vanilla ice cream with a caramel swirl and caramel filled chocolate cups" },
            { name: "Brownie Bake", dot: "#8A5A38", small: "", desc: "Cookie dough ice cream with chocolate chip cookie dough and fresh baked brownie bites with a swirl of chocolate fudge" }
          ]
        },
        {
          id: "soft", label: "Soft Serve", note: "Every soft serve can become a Stirling Storm — just pick your mix-ins.",
          flavors: [
            { name: "Vanilla", dot: "#F6EBD8", small: "", desc: "" },
            { name: "Chocolate", dot: "#6B4226", small: "", desc: "" },
            { name: "The Twist", dot: "#E4C48F", small: "", desc: "" }
          ]
        },
        {
          id: "light", label: "Ices & Lighter", note: "Dairy-free, vegan and no-sugar-added picks — everyone gets a cone here.",
          flavors: [
            { name: "Vegan Black Raspberry", dot: "#7E4E8E", small: "", desc: "" },
            { name: "Rainbow Sherbet", dot: "#F5A05A", small: "", desc: "" },
            { name: "Cherry Vanilla", dot: "#E0788C", small: "No Sugar Added", desc: "" },
            { name: "Nasto's Italian Ice", dot: "#7EC8E3", small: "", desc: "" }
          ]
        }
      ]
    };

    /* ------------------------------------------------ helpers */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    function darken(hex, factor) {
      var m = /^#([0-9a-fA-F]{6})$/.exec(hex || "");
      if (!m) return "#8A5A38";
      var n = parseInt(m[1], 16);
      var r = Math.round(((n >> 16) & 255) * factor);
      var g = Math.round(((n >> 8) & 255) * factor);
      var b = Math.round((n & 255) * factor);
      function h(v) { return ("0" + v.toString(16)).slice(-2); }
      return "#" + h(r) + h(g) + h(b);
    }

    /* Deterministic pseudo-random from a string (for sprinkle placement). */
    function seeded(str) {
      var t = 2166136261;
      for (var i = 0; i < str.length; i++) {
        t ^= str.charCodeAt(i);
        t = Math.imul(t, 16777619);
      }
      return function () {
        t += 1831565813;
        var e = t;
        e = Math.imul(e ^ (e >>> 15), e | 1);
        e ^= e + Math.imul(e ^ (e >>> 7), e | 61);
        return ((e ^ (e >>> 14)) >>> 0) / 4294967296;
      };
    }

    var SPRINKLE_COLORS = ["#E23B4E", "#F5C242", "#3AA8F0", "#4FBE79", "#F27DB0", "#FFFFFF"];
    var SPRINKLE_NAMES = ["cotton confetti", "play dough", "cake pop", "rainbow sherbet"];

    var uid = 0;
    function scoopSVG(flavor, opts) {
      opts = opts || {};
      uid += 1;
      var id = "g" + uid;
      var c0 = flavor.dot || "#F6BFCB";
      var c1 = darken(c0, 0.62);
      var hasSprinkles = SPRINKLE_NAMES.indexOf((flavor.name || "").toLowerCase()) !== -1;
      var s = "";
      s += '<svg viewBox="0 0 192 192" role="img" aria-label="' + escapeHtml(flavor.name || "Flavor") + ' scoop">';
      s += '<defs>';
      s += '<radialGradient id="scoop-' + id + '" cx="38%" cy="32%" r="78%"><stop offset="0%" stop-color="' + c0 + '"/><stop offset="100%" stop-color="' + c1 + '"/></radialGradient>';
      s += '<radialGradient id="hl-' + id + '" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.75"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>';
      s += '<linearGradient id="cone-' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E4B770"/><stop offset="100%" stop-color="#B67E3C"/></linearGradient>';
      s += '</defs>';
      if (opts.cone) {
        s += '<g><path d="M64 118 L96 186 L128 118 Z" fill="url(#cone-' + id + ')"/>';
        s += '<path d="M76 124 L96 150 M92 124 L108 146 M108 124 L120 140 M64 126 L82 150" stroke="#8A5A28" stroke-width="2" opacity="0.5"/></g>';
      }
      s += '<path d="M96 24 C124 24 150 44 150 76 C150 96 140 110 150 122 C132 130 118 126 96 126 C74 126 60 130 42 122 C52 110 42 96 42 76 C42 44 68 24 96 24 Z" fill="url(#scoop-' + id + ')" stroke="rgba(0,0,0,0.06)" stroke-width="1.5"/>';
      s += '<ellipse cx="76" cy="58" rx="30" ry="22" fill="url(#hl-' + id + ')"/>';
      if (hasSprinkles) {
        var rand = seeded(flavor.name || "x");
        for (var i = 0; i < 14; i++) {
          var x = 32 + rand() * 96;
          var y = 34 + rand() * 70;
          var rot = -60 + rand() * 120;
          var col = SPRINKLE_COLORS[i % SPRINKLE_COLORS.length];
          s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="9" height="3.4" rx="1.7" fill="' + col + '" transform="rotate(' + rot.toFixed(1) + ' ' + (x + 4.5).toFixed(1) + ' ' + (y + 1.7).toFixed(1) + ')"/>';
        }
      }
      s += '<circle cx="96" cy="22" r="9" fill="#D62839"/>';
      s += '<circle cx="93" cy="19" r="2.5" fill="#ffffff" opacity="0.6"/>';
      s += '<path d="M96 14 C100 6 106 6 108 2" stroke="#3B7A34" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      s += '</svg>';
      return s;
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, function (ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
      });
    }

    /* ------------------------------------------------ hero cones */
    var heroCones = document.getElementById("hero-cones");
    if (heroCones) {
      var trio = [
        { name: "Strawberry", dot: "#FF9FB1" },
        { name: "Vanilla", dot: "#FFF6DE" },
        { name: "Chocolate", dot: "#8A5836" }
      ];
      trio.forEach(function (fl, i) {
        var wrap = document.createElement("div");
        wrap.className = "sf-float";
        wrap.style.animationDelay = (i * 0.5) + "s";
        wrap.style.width = i === 1 ? "38%" : "30%";
        wrap.innerHTML = scoopSVG(fl, { cone: true });
        heroCones.appendChild(wrap);
      });
    }

    /* ------------------------------------------------ marquee */
    var MARQUEE = ["Hard & Soft Serve", "Hand-Spun Milkshakes", "Classic Sundaes", "Italian Ice", "The Stirling Storm", "Egg Creams", "Banana Splits", "Floats"];
    var track = document.getElementById("marquee-track");
    if (track) {
      MARQUEE.concat(MARQUEE).forEach(function (label) {
        var span = document.createElement("span");
        span.className = "item";
        span.appendChild(document.createTextNode(label));
        var sep = document.createElement("i");
        sep.textContent = "✦";
        span.appendChild(sep);
        track.appendChild(span);
      });
    }

    /* ------------------------------------------------ nav toggle */
    var navToggle = document.getElementById("nav-toggle");
    var mobileMenu = document.getElementById("mobile-menu");
    var iconOpen = document.getElementById("nav-icon-open");
    var iconClose = document.getElementById("nav-icon-close");
    if (navToggle && mobileMenu) {
      navToggle.addEventListener("click", function () {
        var open = mobileMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (iconOpen) iconOpen.style.display = open ? "none" : "";
        if (iconClose) iconClose.style.display = open ? "" : "none";
      });
      mobileMenu.addEventListener("click", function (e) {
        if (e.target && e.target.tagName === "A") {
          mobileMenu.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          if (iconOpen) iconOpen.style.display = "";
          if (iconClose) iconClose.style.display = "none";
        }
      });
    }

    /* ------------------------------------------------ hours */
    /* [openMinutes, closeMinutes] per JS day (0 = Sunday), or null when closed.
       This is only the fallback — the live hours set in the admin panel are
       fetched from the backend below and re-rendered on arrival. */
    var HOURS = [
      [13 * 60, 21 * 60],
      [15 * 60, 21 * 60],
      [15 * 60, 21 * 60],
      [15 * 60, 21 * 60],
      [15 * 60, 21 * 60],
      [15 * 60, 22 * 60],
      [13 * 60, 22 * 60]
    ];
    var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function fmtTime(mins) {
      var h = Math.floor(mins / 60);
      var m = mins % 60;
      var suffix = h >= 12 ? "PM" : "AM";
      var display = h % 12 === 0 ? 12 : h % 12;
      return display + ":" + ("0" + m).slice(-2) + " " + suffix;
    }

    function renderHours() {
      var now = new Date();
      var today = now.getDay();
      var minutesNow = now.getHours() * 60 + now.getMinutes();
      var span = HOURS[today];
      var isOpen = !!(span && minutesNow >= span[0] && minutesNow < span[1]);

      var pill = document.getElementById("open-pill");
      var pillText = document.getElementById("open-pill-text");
      if (pill && pillText) {
        pill.classList.toggle("open", isOpen);
        pillText.textContent = isOpen ? "Open now" : "Closed now";
      }

      var chips = document.getElementById("day-chips");
      if (chips) {
        chips.textContent = "";
        for (var d = 0; d < 7; d++) {
          var chip = document.createElement("div");
          chip.className = "day-chip" + (d === today ? " today" : "");
          var dEl = document.createElement("span");
          dEl.className = "d";
          dEl.textContent = DAY_SHORT[d];
          var sEl = document.createElement("span");
          sEl.className = "s";
          if (HOURS[d] === null) sEl.textContent = "—";
          chip.appendChild(dEl);
          chip.appendChild(sEl);
          chips.appendChild(chip);
        }
      }

      var dayList = document.getElementById("day-list");
      if (dayList) {
        dayList.textContent = "";
        for (var d2 = 0; d2 < 7; d2++) {
          var li = document.createElement("li");
          if (d2 === today) li.className = "today";
          var nameEl = document.createElement("span");
          nameEl.className = "day-name";
          var cdot = document.createElement("span");
          cdot.className = "cdot";
          nameEl.appendChild(cdot);
          nameEl.appendChild(document.createTextNode(DAY_NAMES[d2]));
          var timeEl = document.createElement("span");
          timeEl.textContent = HOURS[d2] === null ? "Closed" : fmtTime(HOURS[d2][0]) + " – " + fmtTime(HOURS[d2][1]);
          li.appendChild(nameEl);
          li.appendChild(timeEl);
          dayList.appendChild(li);
        }
      }
    }

    function validHoursDay(day) {
      return day === null || (Array.isArray(day) && day.length === 2 && typeof day[0] === "number" && typeof day[1] === "number");
    }

    function loadHours() {
      fetch(API + "/sf/hours", { cache: "no-store" })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (!data || !Array.isArray(data.hours) || data.hours.length !== 7) return;
          if (!data.hours.every(validHoursDay)) return;
          HOURS = data.hours;
          renderHours();
        })
        .catch(function () { /* offline — the posted hours stay up */ });
    }

    renderHours();
    loadHours();

    /* ------------------------------------------------ live flavor board */
    var board = DEFAULT_BOARD;
    var activeTab = "all";

    var tabsEl = document.getElementById("board-tabs");
    var gridEl = document.getElementById("board-grid");
    var emptyEl = document.getElementById("board-empty");
    var noteEl = document.getElementById("board-note");
    var countEl = document.getElementById("board-count");

    function totalFlavors(b) {
      var t = 0;
      (b.categories || []).forEach(function (c) { t += (c.flavors || []).length; });
      return t;
    }

    function renderTabs() {
      if (!tabsEl) return;
      tabsEl.textContent = "";
      var items = [{ id: "all", label: "Everything" }];
      (board.categories || []).forEach(function (c) {
        items.push({ id: c.id, label: c.label || c.id });
      });
      items.forEach(function (item) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tab" + (activeTab === item.id ? " active" : "");
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", activeTab === item.id ? "true" : "false");
        btn.textContent = item.label;
        btn.addEventListener("click", function () {
          activeTab = item.id;
          renderTabs();
          renderGrid();
        });
        tabsEl.appendChild(btn);
      });
    }

    function renderGrid() {
      if (!gridEl) return;
      gridEl.textContent = "";
      var shown = [];
      var note = "";
      (board.categories || []).forEach(function (c) {
        if (activeTab === "all" || activeTab === c.id) {
          (c.flavors || []).forEach(function (f) { if (f && f.name) shown.push(f); });
          if (activeTab === c.id && c.note) note = c.note;
        }
      });

      if (emptyEl) emptyEl.hidden = shown.length !== 0;
      if (noteEl) {
        if (note) {
          noteEl.hidden = false;
          noteEl.textContent = "";
          if (note.indexOf("Stirling Storm") !== -1) {
            var parts = note.split("Stirling Storm");
            noteEl.appendChild(document.createTextNode(parts[0]));
            var strong = document.createElement("strong");
            strong.textContent = "Stirling Storm";
            noteEl.appendChild(strong);
            noteEl.appendChild(document.createTextNode(parts.slice(1).join("Stirling Storm")));
          } else {
            noteEl.textContent = note;
          }
        } else {
          noteEl.hidden = true;
        }
      }

      shown.forEach(function (f) {
        var card = document.createElement("article");
        card.className = "flavor-card card-lift";

        var art = document.createElement("div");
        art.className = "scoop-art";
        if (f.img && /^data:image\//.test(f.img)) {
          var photo = document.createElement("img");
          photo.className = "flavor-photo";
          photo.src = f.img;
          photo.alt = f.name || "Flavor photo";
          photo.loading = "lazy";
          art.appendChild(photo);
        } else {
          art.innerHTML = scoopSVG(f, {});
        }
        card.appendChild(art);

        var h3 = document.createElement("h3");
        h3.textContent = f.name;
        card.appendChild(h3);

        if (f.desc) {
          var p = document.createElement("p");
          p.textContent = f.desc;
          card.appendChild(p);
        }

        var tags = [];
        if (f.small) tags.push({ label: f.small, leaf: false });
        if ((f.name || "").toLowerCase().indexOf("vegan") !== -1) tags.push({ label: "Vegan", leaf: true });
        if (tags.length > 0) {
          var tagRow = document.createElement("div");
          tagRow.className = "tags";
          tags.forEach(function (t) {
            var tag = document.createElement("span");
            if (t.leaf) {
              tag.innerHTML = '<svg aria-hidden="true"><use href="#i-leaf"/></svg>';
            }
            tag.appendChild(document.createTextNode(t.label));
            tagRow.appendChild(tag);
          });
          card.appendChild(tagRow);
        }

        gridEl.appendChild(card);
      });

      if (countEl) {
        var t = totalFlavors(board);
        countEl.textContent = t + " flavors churning right now. The lineup rotates — check back for what's fresh.";
      }
    }

    function applyBoard(b) {
      if (!b || !Array.isArray(b.categories) || b.categories.length === 0) return;
      board = b;
      var exists = activeTab === "all" || b.categories.some(function (c) { return c.id === activeTab; });
      if (!exists) activeTab = "all";
      renderTabs();
      renderGrid();
    }

    function loadBoard() {
      fetch(API + "/sf/flavors", { cache: "no-store" })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (b) { if (b) applyBoard(b); })
        .catch(function () { /* offline — the built-in board stays up */ });
    }

    renderTabs();
    renderGrid();
    loadBoard();

    /* Refresh when the tab regains focus so an admin edit shows up without
       even needing a manual reload. */
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        loadBoard();
        loadHours();
      }
    });
  })();
  </script>
</body>
</html>


/* =============================================================================
   ===== FILE: admin.html =====
   ============================================================================= */

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flavor Board Admin — The Stirling Fountain</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M18 26 L46 26 L40.5 45 Q40 47 38 47 L26 47 Q24 47 23.5 45 Z' fill='%23FAF6F0' stroke='%23231D1A' stroke-width='2.4'/%3E%3Cpath d='M32 47 L32 55 M23 57 L41 57' stroke='%23231D1A' stroke-width='2.4' stroke-linecap='round'/%3E%3Cpath d='M20 26 Q20 12 32 12 Q44 12 44 26 Z' fill='%23D11F34' stroke='%23231D1A' stroke-width='2.4'/%3E%3Ccircle cx='32' cy='9' r='3.4' fill='%23D11F34' stroke='%23231D1A' stroke-width='1.8'/%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Manrope:wght@300..800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --cream: hsl(38 48% 96%); --paper: hsl(38 38% 92%); --ink: hsl(20 16% 12%); --red: hsl(353 74% 47%);
      --red-dark: hsl(353 68% 38%); --gold: #E4B770; --mint: #BFE3D4; --pink: #F6BFCB;
      --line: hsl(26 20% 86%); --green: #3E7C4F;
      --shadow: 0 10px 30px rgba(35,29,26,0.10);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Manrope", ui-sans-serif, system-ui, sans-serif; background-color: var(--cream); background-image: radial-gradient(#ba5e690f 1.4px, transparent 1.4px); background-size: 22px 22px; color: var(--ink); line-height: 1.5; padding-bottom: 80px; }
    h1, h2, h3 { font-family: "Fraunces", "Times New Roman", serif; font-weight: 600; letter-spacing: -0.01em; }
    .script { font-family: "Fraunces", serif; font-weight: 600; font-style: italic; }
    button { font-family: inherit; cursor: pointer; }
    input { font-family: inherit; }

    .topbar { position: sticky; top: 0; z-index: 30; background: var(--ink); color: var(--cream); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .topbar-brand { display: flex; align-items: baseline; gap: 8px; }
    .topbar-brand .script { color: #fff; font-size: 19px; }
    .topbar-brand small { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.55); }
    .topbar-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

    .status { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 999px; background: rgba(255,255,255,0.12); }
    .status .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); }
    .status.is-saving .dot { background: var(--gold); animation: blink 0.8s infinite; }
    .status.is-saved .dot { background: #7ee0a3; }
    .status.is-error { background: rgba(209,31,52,0.35); }
    .status.is-error .dot { background: #ff8b8b; }
    @keyframes blink { 50% { opacity: 0.3; } }

    .wrap { max-width: 880px; margin: 0 auto; padding: 28px 16px; }
    .intro { background: #fff; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; padding: 18px 22px; margin-bottom: 22px; box-shadow: var(--shadow); }
    .intro h1 { font-size: 24px; margin-bottom: 6px; }
    .intro p { font-size: 14px; color: hsl(20 16% 12% / 0.7); }
    .intro .live-note { margin-top: 8px; font-size: 13px; font-weight: 700; color: var(--green); }

    .cat { background: #fff; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; margin-bottom: 20px; box-shadow: var(--shadow); overflow: hidden; }
    .cat-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; background: var(--paper); border-bottom: 1px solid rgba(0,0,0,0.06); flex-wrap: wrap; }
    .cat-head h2 { font-size: 19px; }
    .cat-head .count { font-size: 12.5px; font-weight: 700; color: hsl(20 16% 12% / 0.55); background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 3px 12px; }
    .cat-body { padding: 14px 16px 18px; }

    .field-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
    .field { flex: 1 1 220px; }
    .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: hsl(20 16% 12% / 0.55); margin-bottom: 4px; }
    .field input { width: 100%; padding: 9px 12px; border: 2px solid var(--line); border-radius: 10px; font-size: 14px; background: var(--cream); }
    .field input:focus { outline: none; border-color: var(--red); }

    .flavor-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 7px 0; border-bottom: 1px dashed var(--line); }
    .flavor-row:last-of-type { border-bottom: none; }
    .flavor-row .f-desc { flex-basis: 100%; padding: 7px 12px; border: 2px solid transparent; border-radius: 10px; font-size: 13px; background: var(--cream); color: hsl(20 16% 12% / 0.8); }
    .flavor-row input[type="color"] { width: 34px; height: 34px; border: 2px solid var(--line); border-radius: 50%; padding: 2px; background: #fff; cursor: pointer; flex-shrink: 0; }
    .flavor-row .f-name { flex: 2 1 160px; padding: 8px 12px; border: 2px solid transparent; border-radius: 10px; font-size: 15px; font-weight: 600; background: var(--cream); }
    .flavor-row .f-small { flex: 1 1 90px; padding: 8px 10px; border: 2px solid transparent; border-radius: 10px; font-size: 12.5px; background: var(--cream); color: hsl(20 16% 12% / 0.7); }
    .flavor-row input:focus { outline: none; border-color: var(--red); }
    .icon-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--line); background: #fff; font-size: 14px; line-height: 1; color: var(--ink); flex-shrink: 0; transition: all 0.15s ease; }
    .icon-btn:hover { border-color: var(--ink); transform: translateY(-1px); }
    .icon-btn.del:hover { background: var(--red); border-color: var(--red); color: #fff; }

    .photo-btn { width: 34px; height: 34px; border-radius: 10px; border: 2px solid var(--line); background: #fff center/cover no-repeat; font-size: 15px; line-height: 1; flex-shrink: 0; transition: all 0.15s ease; }
    .photo-btn:hover { border-color: var(--red); }
    .photo-btn.has-img { font-size: 0; border-style: solid; }

    .hours-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 8px 0; border-bottom: 1px dashed var(--line); }
    .hours-row:last-of-type { border-bottom: none; }
    .hours-row .day { flex: 0 0 96px; font-weight: 700; font-size: 14px; }
    .hours-row .open-toggle { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: hsl(20 16% 12% / 0.65); cursor: pointer; user-select: none; }
    .hours-row .open-toggle input { width: 16px; height: 16px; accent-color: var(--green); cursor: pointer; }
    .hours-row input[type="time"] { padding: 7px 10px; border: 2px solid var(--line); border-radius: 10px; font-size: 13.5px; background: var(--cream); }
    .hours-row input[type="time"]:focus { outline: none; border-color: var(--red); }
    .hours-row .dash { color: hsl(20 16% 12% / 0.4); font-weight: 700; }
    .hours-row .closed-note { font-size: 12.5px; font-weight: 700; color: var(--red); text-transform: uppercase; letter-spacing: 0.08em; }
    .hours-row.is-closed .day { color: hsl(20 16% 12% / 0.45); }

    .add-btn { margin-top: 12px; width: 100%; padding: 11px; border: 2px dashed var(--line); border-radius: 12px; background: transparent; font-weight: 700; font-size: 14px; color: hsl(20 16% 12% / 0.65); transition: all 0.15s ease; }
    .add-btn:hover { border-color: var(--red); color: var(--red); background: hsl(353 74% 47% / 0.04); }

    .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 999px; border: 2px solid transparent; font-weight: 700; font-size: 13.5px; text-decoration: none; transition: transform 0.15s ease; }
    .btn:hover { transform: translateY(-1px); }
    .btn-solid { background: var(--red); color: #fff; }
    .btn-ghost { background: transparent; border-color: rgba(255,255,255,0.35); color: #fff; }
    .btn-ghost:hover { border-color: #fff; }
    .btn-danger-ghost { background: transparent; border-color: var(--line); color: hsl(20 16% 12% / 0.6); font-size: 12.5px; padding: 7px 14px; }
    .btn-danger-ghost:hover { border-color: var(--red); color: var(--red); }

    .footer-tools { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 6px; }
    .updated { font-size: 12.5px; color: hsl(20 16% 12% / 0.55); }

    /* login gate */
    .gate { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .gate-card { background: #fff; border: 1px solid rgba(0,0,0,0.05); border-radius: 24px; padding: 38px 34px; max-width: 400px; width: 100%; text-align: center; box-shadow: var(--shadow); }
    .gate-card .cone { width: 64px; margin: 0 auto 14px; color: var(--ink); }
    .gate-card h1 { font-size: 24px; margin-bottom: 4px; }
    .gate-card .script { color: var(--red); font-size: 20px; display: block; margin-bottom: 18px; }
    .gate-card input { width: 100%; padding: 12px 14px; border: 2px solid var(--line); border-radius: 12px; font-size: 15px; margin-bottom: 12px; background: var(--cream); }
    .gate-card input:focus { outline: none; border-color: var(--red); }
    .gate-card .btn { width: 100%; justify-content: center; padding: 12px; font-size: 15px; }
    .gate-error { color: var(--red); font-weight: 700; font-size: 13.5px; margin-top: 10px; min-height: 20px; }

    .hidden { display: none !important; }
  </style>
</head>
<body>

  <!-- ============================================== login gate -->
  <div class="gate" id="gate">
    <div class="gate-card">
      <svg class="cone" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 26 L46 26 L40.5 45 Q40 47 38 47 L26 47 Q24 47 23.5 45 Z" fill="hsl(38 48% 96%)" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M32 47 L32 55" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M23 57 L41 57" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M20 26 Q20 12 32 12 Q44 12 44 26 Z" fill="hsl(353 74% 47%)" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M26 24 Q27 18 32 17" stroke="hsl(38 48% 96%)" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
        <circle cx="32" cy="9" r="3.4" fill="hsl(353 74% 47%)" stroke="currentColor" stroke-width="1.8"/>
        <path d="M32 6 Q34 3 37 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      </svg>
      <h1>Flavor Board Admin</h1>
      <span class="script">The Stirling Fountain</span>
      <form id="gate-form">
        <input type="password" id="gate-pass" placeholder="Admin password" autocomplete="current-password" required />
        <button type="submit" class="btn btn-solid">Unlock the board</button>
      </form>
      <p class="gate-error" id="gate-error"></p>
    </div>
  </div>

  <!-- ============================================== editor -->
  <div id="app" class="hidden">
    <div class="topbar">
      <div class="topbar-brand">
        <span class="script">The Stirling Fountain</span>
        <small>Flavor Board Admin</small>
      </div>
      <div class="topbar-actions">
        <span class="status" id="status"><span class="dot"></span><span id="status-text">Loading…</span></span>
        <a class="btn btn-ghost" href="./" target="_blank" rel="noopener">View live site ↗</a>
        <button class="btn btn-ghost" id="logout-btn" type="button">Lock</button>
      </div>
    </div>

    <div class="wrap">
      <div class="intro">
        <h1>Edit the Flavor Board</h1>
        <p>Every change saves automatically and goes live on the website immediately — visitors see the updated board and hours the moment they open or reload the page. Use the 📷 button on any flavor to add its photo.</p>
        <p class="live-note" id="live-note"></p>
      </div>

      <div class="cat" id="hours-card">
        <div class="cat-head">
          <h2>Opening Hours</h2>
          <button class="btn btn-danger-ghost" id="hours-reset-btn" type="button">Restore posted hours</button>
        </div>
        <div class="cat-body">
          <p style="font-size:13px; color:hsl(20 16% 12% / 0.6); margin-bottom:10px;">These are the hours shown on the website's Visit section — the “Open now” badge follows them automatically. Untick a day to show it as closed.</p>
          <div id="hours-rows"></div>
        </div>
      </div>

      <div id="categories"></div>

      <input type="file" id="photo-input" accept="image/*" class="hidden" />

      <div class="footer-tools">
        <span class="updated" id="updated-label"></span>
        <button class="btn btn-danger-ghost" id="reset-btn" type="button">Restore original board</button>
      </div>
    </div>
  </div>

  <script>
    (function () {
      "use strict";

      var API = "https://tbstudios-backend.rork.app";
      var PASS_KEY = "sf_admin_pw";

      var board = null;
      var saveTimer = null;
      var saveSeq = 0;

      var hours = null;
      var hoursSaveTimer = null;
      var hoursSaveSeq = 0;
      var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var LAST_OPEN = {};
      var photoTarget = null;

      var gate = document.getElementById("gate");
      var app = document.getElementById("app");
      var statusEl = document.getElementById("status");
      var statusText = document.getElementById("status-text");
      var updatedLabel = document.getElementById("updated-label");
      var liveNote = document.getElementById("live-note");
      var categoriesEl = document.getElementById("categories");

      function pass() { return sessionStorage.getItem(PASS_KEY) || ""; }

      function setStatus(mode, text) {
        statusEl.className = "status" + (mode ? " is-" + mode : "");
        statusText.textContent = text;
      }

      function fmtTime(ts) {
        if (!ts) return "";
        var d = new Date(ts);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      }

      /* -------------------------------------------------- login */
      document.getElementById("gate-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var pw = document.getElementById("gate-pass").value;
        var errEl = document.getElementById("gate-error");
        errEl.textContent = "";
        fetch(API + "/sf/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pw })
        }).then(function (res) {
          if (res.ok) {
            sessionStorage.setItem(PASS_KEY, pw);
            enter();
          } else if (res.status === 429) {
            errEl.textContent = "Too many attempts — try again in a few minutes.";
          } else {
            errEl.textContent = "Wrong password.";
          }
        }).catch(function () {
          errEl.textContent = "Can't reach the server — check your connection.";
        });
      });

      document.getElementById("logout-btn").addEventListener("click", function () {
        sessionStorage.removeItem(PASS_KEY);
        location.reload();
      });

      function enter() {
        gate.classList.add("hidden");
        app.classList.remove("hidden");
        load();
      }

      /* --------------------------------------------------- load */
      function load() {
        setStatus("saving", "Loading…");
        fetch(API + "/sf/flavors", { cache: "no-store" })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            board = { categories: data.categories || [] };
            render();
            setStatus("saved", data.source === "saved" ? "Loaded saved board" : "Loaded original board");
            updatedLabel.textContent = data.updatedTs ? "Last published: " + fmtTime(data.updatedTs) : "Not customized yet — showing the original board.";
          })
          .catch(function () {
            setStatus("error", "Couldn't load — refresh to retry");
          });
        fetch(API + "/sf/hours", { cache: "no-store" })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            hours = Array.isArray(data.hours) && data.hours.length === 7 ? data.hours : null;
            renderHours();
          })
          .catch(function () { /* hours card stays empty; board still editable */ });
      }

      /* -------------------------------------------------- hours */
      var hoursRowsEl = document.getElementById("hours-rows");

      function minsToTime(mins) {
        var h = Math.floor(mins / 60);
        var m = mins % 60;
        return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2);
      }

      function timeToMins(v) {
        var parts = String(v || "").split(":");
        var h = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10);
        if (isNaN(h) || isNaN(m)) return null;
        return h * 60 + m;
      }

      function renderHours() {
        if (!hoursRowsEl || !hours) return;
        hoursRowsEl.textContent = "";
        hours.forEach(function (day, di) {
          var row = document.createElement("div");
          row.className = "hours-row" + (day === null ? " is-closed" : "");

          var name = document.createElement("span");
          name.className = "day";
          name.textContent = DAY_NAMES[di];
          row.appendChild(name);

          var toggle = document.createElement("label");
          toggle.className = "open-toggle";
          var check = document.createElement("input");
          check.type = "checkbox";
          check.checked = day !== null;
          toggle.appendChild(check);
          toggle.appendChild(document.createTextNode("Open"));
          row.appendChild(toggle);

          if (day !== null) {
            var openInput = document.createElement("input");
            openInput.type = "time";
            openInput.value = minsToTime(day[0]);
            var closeInput = document.createElement("input");
            closeInput.type = "time";
            closeInput.value = minsToTime(day[1]);
            var dash = document.createElement("span");
            dash.className = "dash";
            dash.textContent = "–";
            row.appendChild(openInput);
            row.appendChild(dash);
            row.appendChild(closeInput);

            function onTimeChange() {
              var o = timeToMins(openInput.value);
              var c = timeToMins(closeInput.value);
              if (o === null || c === null || o >= c) return; // wait for a valid range
              hours[di] = [o, c];
              LAST_OPEN[di] = [o, c];
              queueSaveHours();
            }
            openInput.addEventListener("change", onTimeChange);
            closeInput.addEventListener("change", onTimeChange);
          } else {
            var closedNote = document.createElement("span");
            closedNote.className = "closed-note";
            closedNote.textContent = "Closed";
            row.appendChild(closedNote);
          }

          check.addEventListener("change", function () {
            if (check.checked) {
              hours[di] = LAST_OPEN[di] || [15 * 60, 21 * 60];
            } else {
              if (hours[di]) LAST_OPEN[di] = hours[di];
              hours[di] = null;
            }
            renderHours();
            queueSaveHours();
          });

          hoursRowsEl.appendChild(row);
        });
      }

      function queueSaveHours() {
        setStatus("saving", "Saving…");
        if (hoursSaveTimer) clearTimeout(hoursSaveTimer);
        hoursSaveTimer = setTimeout(saveHours, 600);
      }

      function saveHours() {
        var seq = ++hoursSaveSeq;
        fetch(API + "/sf/hours", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": pass()
          },
          body: JSON.stringify({ hours: hours })
        }).then(function (res) {
          if (seq !== hoursSaveSeq) return;
          if (res.ok) {
            return res.json().then(function (data) {
              setStatus("saved", "Saved — live on the site");
              updatedLabel.textContent = "Last published: " + fmtTime(data.updatedTs);
              liveNote.textContent = "✓ Published. The website's hours and “Open now” badge are updated.";
            });
          }
          if (res.status === 401) {
            setStatus("error", "Session expired — reload and log in again");
          } else {
            setStatus("error", "Save failed — change anything to retry");
          }
        }).catch(function () {
          if (seq !== hoursSaveSeq) return;
          setStatus("error", "Offline — change anything to retry");
        });
      }

      document.getElementById("hours-reset-btn").addEventListener("click", function () {
        if (!confirm("Restore the shop's posted hours? Your custom hours will be removed.")) return;
        setStatus("saving", "Restoring…");
        fetch(API + "/sf/hours/reset", {
          method: "POST",
          headers: { "X-Admin-Password": pass() }
        }).then(function (res) {
          if (!res.ok) throw new Error("reset failed");
          return res.json();
        }).then(function (data) {
          hours = data.hours;
          renderHours();
          setStatus("saved", "Posted hours restored");
          liveNote.textContent = "✓ The site shows the shop's posted hours again.";
        }).catch(function () {
          setStatus("error", "Restore failed — try again");
        });
      });

      /* -------------------------------------------------- flavor photos */
      var photoInput = document.getElementById("photo-input");

      photoInput.addEventListener("change", function () {
        var file = photoInput.files && photoInput.files[0];
        photoInput.value = "";
        if (!file || !photoTarget) return;
        var flavor = photoTarget;
        photoTarget = null;
        setStatus("saving", "Processing photo…");
        shrinkImage(file, function (dataUrl) {
          if (!dataUrl) {
            setStatus("error", "Couldn't read that image — try a JPG or PNG");
            return;
          }
          flavor.img = dataUrl;
          render();
          queueSave();
        });
      });

      /* Downscales to a small square-ish thumbnail and compresses until it
         fits the backend's per-photo size cap. */
      function shrinkImage(file, done) {
        var reader = new FileReader();
        reader.onload = function () {
          var img = new Image();
          img.onload = function () {
            var MAX = 480;
            var scale = Math.min(1, MAX / Math.max(img.width, img.height));
            var w = Math.max(1, Math.round(img.width * scale));
            var h = Math.max(1, Math.round(img.height * scale));
            var canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext("2d");
            if (!ctx) { done(null); return; }
            ctx.drawImage(img, 0, 0, w, h);
            var quality = 0.8;
            var out = canvas.toDataURL("image/jpeg", quality);
            while (out.length > 110000 && quality > 0.3) {
              quality -= 0.1;
              out = canvas.toDataURL("image/jpeg", quality);
            }
            done(out.length <= 120000 ? out : null);
          };
          img.onerror = function () { done(null); };
          img.src = String(reader.result);
        };
        reader.onerror = function () { done(null); };
        reader.readAsDataURL(file);
      }

      /* -------------------------------------------------- render */
      function render() {
        categoriesEl.textContent = "";
        board.categories.forEach(function (cat, ci) {
          var box = document.createElement("div");
          box.className = "cat";

          var head = document.createElement("div");
          head.className = "cat-head";
          var h2 = document.createElement("h2");
          h2.textContent = cat.label || cat.id;
          var count = document.createElement("span");
          count.className = "count";
          count.textContent = cat.flavors.length + " flavor" + (cat.flavors.length === 1 ? "" : "s");
          head.appendChild(h2);
          head.appendChild(count);
          box.appendChild(head);

          var body = document.createElement("div");
          body.className = "cat-body";

          // label + note fields
          var fieldRow = document.createElement("div");
          fieldRow.className = "field-row";
          fieldRow.appendChild(makeField("Tab name", cat.label, function (v) { cat.label = v; h2.textContent = v || cat.id; queueSave(); }));
          fieldRow.appendChild(makeField("Note under the list (optional)", cat.note, function (v) { cat.note = v; queueSave(); }));
          body.appendChild(fieldRow);

          // flavor rows
          cat.flavors.forEach(function (flavor, fi) {
            body.appendChild(makeFlavorRow(cat, flavor, fi, count));
          });

          // add button
          var add = document.createElement("button");
          add.type = "button";
          add.className = "add-btn";
          add.textContent = "+ Add a flavor to " + (cat.label || cat.id);
          add.addEventListener("click", function () {
            cat.flavors.push({ name: "", dot: "#F6BFCB", small: "", desc: "", img: "" });
            render();
            queueSave();
            // focus the new name input
            var rows = categoriesEl.querySelectorAll(".cat")[ci].querySelectorAll(".f-name");
            if (rows.length) rows[rows.length - 1].focus();
          });
          body.appendChild(add);

          box.appendChild(body);
          categoriesEl.appendChild(box);
        });
      }

      function makeField(labelText, value, onInput) {
        var wrap = document.createElement("div");
        wrap.className = "field";
        var label = document.createElement("label");
        label.textContent = labelText;
        var input = document.createElement("input");
        input.type = "text";
        input.value = value || "";
        input.addEventListener("input", function () { onInput(input.value); });
        wrap.appendChild(label);
        wrap.appendChild(input);
        return wrap;
      }

      function makeFlavorRow(cat, flavor, fi, countEl) {
        var row = document.createElement("div");
        row.className = "flavor-row";

        var photo = document.createElement("button");
        photo.type = "button";
        photo.className = "photo-btn" + (flavor.img ? " has-img" : "");
        photo.title = flavor.img ? "Change photo" : "Add a photo";
        if (flavor.img) {
          photo.style.backgroundImage = "url(" + flavor.img + ")";
        } else {
          photo.textContent = "📷";
        }
        photo.addEventListener("click", function () {
          photoTarget = flavor;
          photoInput.click();
        });

        var color = document.createElement("input");
        color.type = "color";
        color.value = /^#[0-9a-fA-F]{6}$/.test(flavor.dot) ? flavor.dot : "#F6BFCB";
        color.title = "Dot color";
        color.addEventListener("input", function () { flavor.dot = color.value; queueSave(); });

        var name = document.createElement("input");
        name.type = "text";
        name.className = "f-name";
        name.placeholder = "Flavor name";
        name.value = flavor.name || "";
        name.addEventListener("input", function () { flavor.name = name.value; queueSave(); });

        var small = document.createElement("input");
        small.type = "text";
        small.className = "f-small";
        small.placeholder = "Tag (e.g. No Sugar Added)";
        small.value = flavor.small || "";
        small.addEventListener("input", function () { flavor.small = small.value; queueSave(); });

        var desc = document.createElement("input");
        desc.type = "text";
        desc.className = "f-desc";
        desc.placeholder = "Description shown under the flavor name";
        desc.value = flavor.desc || "";
        desc.addEventListener("input", function () { flavor.desc = desc.value; queueSave(); });

        var up = iconBtn("↑", "Move up", function () {
          if (fi === 0) return;
          var tmp = cat.flavors[fi - 1];
          cat.flavors[fi - 1] = cat.flavors[fi];
          cat.flavors[fi] = tmp;
          render();
          queueSave();
        });
        var down = iconBtn("↓", "Move down", function () {
          if (fi >= cat.flavors.length - 1) return;
          var tmp = cat.flavors[fi + 1];
          cat.flavors[fi + 1] = cat.flavors[fi];
          cat.flavors[fi] = tmp;
          render();
          queueSave();
        });
        var del = iconBtn("✕", "Remove", function () {
          cat.flavors.splice(fi, 1);
          render();
          queueSave();
        });
        del.classList.add("del");

        row.appendChild(photo);
        if (flavor.img) {
          var noPhoto = iconBtn("⊘", "Remove photo", function () {
            flavor.img = "";
            render();
            queueSave();
          });
          row.appendChild(noPhoto);
        }
        row.appendChild(color);
        row.appendChild(name);
        row.appendChild(small);
        row.appendChild(up);
        row.appendChild(down);
        row.appendChild(del);
        row.appendChild(desc);
        return row;
      }

      function iconBtn(glyph, title, onClick) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "icon-btn";
        b.textContent = glyph;
        b.title = title;
        b.addEventListener("click", onClick);
        return b;
      }

      /* ------------------------------------------------ autosave */
      function queueSave() {
        setStatus("saving", "Saving…");
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(save, 600);
      }

      function save() {
        var seq = ++saveSeq;
        fetch(API + "/sf/flavors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": pass()
          },
          body: JSON.stringify({ categories: board.categories })
        }).then(function (res) {
          if (seq !== saveSeq) return; // a newer save is in flight
          if (res.ok) {
            return res.json().then(function (data) {
              setStatus("saved", "Saved — live on the site");
              updatedLabel.textContent = "Last published: " + fmtTime(data.updatedTs);
              liveNote.textContent = "✓ Published. Anyone opening or reloading the site now sees this board.";
            });
          }
          if (res.status === 401) {
            setStatus("error", "Session expired — reload and log in again");
          } else {
            setStatus("error", "Save failed — edit anything to retry");
          }
        }).catch(function () {
          if (seq !== saveSeq) return;
          setStatus("error", "Offline — edit anything to retry");
        });
      }

      /* ------------------------------------------------ reset */
      document.getElementById("reset-btn").addEventListener("click", function () {
        if (!confirm("Restore the original flavor board? Your custom changes will be removed.")) return;
        setStatus("saving", "Restoring…");
        fetch(API + "/sf/flavors/reset", {
          method: "POST",
          headers: { "X-Admin-Password": pass() }
        }).then(function (res) {
          if (!res.ok) throw new Error("reset failed");
          return res.json();
        }).then(function (data) {
          board = { categories: data.categories || [] };
          render();
          setStatus("saved", "Original board restored");
          updatedLabel.textContent = "Showing the original board.";
          liveNote.textContent = "✓ The site is back to the original flavor board.";
        }).catch(function () {
          setStatus("error", "Restore failed — try again");
        });
      });

      /* ------------------------------------------------ boot */
      if (pass()) {
        // Re-verify the stored password quietly; enter on success.
        fetch(API + "/sf/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pass() })
        }).then(function (res) {
          if (res.ok) enter();
          else sessionStorage.removeItem(PASS_KEY);
        }).catch(function () { /* stay on gate */ });
      }
    })();
  </script>
</body>
</html>

