import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const params = new URLSearchParams(location.search);
const slug = params.get("slug");
const campaignId = params.get("campaign");
const root = document.getElementById("landing");

let lp = null;
let agentCampaign = null;
let campaign = null;
let calculators = [];

const css = `
:root{
  --navy:#101828;--navy2:#172554;--blue:#2563eb;--blue2:#1d4ed8;--magenta:#e6007e;
  --cyan:#06b6d4;--gold:#f59e0b;--green:#16a34a;--bg:#f5f7fb;--white:#fff;
  --muted:#667085;--line:#e4e7ec;--shadow:0 22px 60px rgba(16,24,40,.10)
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:linear-gradient(180deg,#f8faff 0%,#f5f7fb 48%,#eef3fb 100%);color:var(--navy);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
a{color:inherit}
.page{min-height:100vh;overflow:hidden}
.container{width:min(1160px,calc(100% - 36px));margin:auto}
.topbar{padding:18px 0;position:relative;z-index:5}.topbarInner{display:flex;align-items:center;justify-content:space-between;gap:20px}
.brand{display:flex;align-items:center;gap:10px;font-weight:950;letter-spacing:-.04em;font-size:22px}.brandMark{width:40px;height:40px;border-radius:13px;background:linear-gradient(135deg,var(--blue),var(--magenta));display:grid;place-items:center;color:#fff;box-shadow:0 10px 25px rgba(37,99,235,.25)}
.agentTag{font-size:12px;font-weight:800;color:#475467;background:#fff;border:1px solid var(--line);padding:9px 13px;border-radius:999px}
.hero{position:relative;padding:30px 0 54px}.heroShell{position:relative;background:linear-gradient(135deg,#0b1735 0%,#152b63 58%,#143d9b 100%);border-radius:34px;color:#fff;box-shadow:var(--shadow);overflow:hidden}.heroShell:before{content:"";position:absolute;width:430px;height:430px;border-radius:50%;background:rgba(230,0,126,.24);filter:blur(4px);right:-140px;top:-190px}.heroShell:after{content:"";position:absolute;width:350px;height:350px;border-radius:50%;background:rgba(6,182,212,.15);left:-160px;bottom:-230px}.heroContent{position:relative;z-index:1;padding:56px 58px;display:grid;grid-template-columns:1.25fr .75fr;gap:42px;align-items:center}
.badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.badge{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.14);font-size:12px;font-weight:850}.badgeAccent{background:rgba(230,0,126,.20);border-color:rgba(255,255,255,.16)}
h1{font-size:clamp(36px,5vw,64px);line-height:1.02;letter-spacing:-.055em;margin:0 0 18px;max-width:760px}.heroLead{font-size:20px;line-height:1.55;color:#dbe7ff;max-width:680px;margin:0 0 26px}.heroActions{display:flex;gap:12px;flex-wrap:wrap}.btn{border:0;border-radius:13px;padding:13px 18px;font:inherit;font-weight:900;cursor:pointer;transition:transform .15s,box-shadow .15s,background .15s}.btn:hover{transform:translateY(-1px)}.btnPrimary{background:linear-gradient(135deg,#fff,#e8efff);color:#12316f;box-shadow:0 10px 25px rgba(0,0,0,.16)}.btnPink{background:linear-gradient(135deg,#ff1995,#df006f);color:#fff;box-shadow:0 10px 25px rgba(230,0,126,.25)}.btnGhost{background:#eef2f6;color:#24324a}.btnDark{background:#101828;color:#fff}.heroAside{background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.15);border-radius:24px;padding:24px;backdrop-filter:blur(10px)}.heroAside .eyebrow{color:#b9cbff}.eyebrow{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:950;color:#475467}.heroAside h3{font-size:24px;margin:8px 0 10px;letter-spacing:-.03em}.heroAside p{color:#dbe7ff;line-height:1.55;margin:0}.campaignBox{margin-top:18px;background:#fff;color:var(--navy);border-radius:18px;padding:18px}.campaignBox strong{display:block;font-size:14px}.campaignText{font-size:14px;line-height:1.55;color:#475467;white-space:pre-wrap;margin:8px 0}.hashtags{color:#175cd3;font-weight:850;font-size:13px;white-space:pre-wrap}
.trust{padding:0 0 18px}.trustGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.trustItem{background:#fff;border:1px solid var(--line);border-radius:18px;padding:17px 18px;display:flex;gap:12px;align-items:center;box-shadow:0 8px 25px rgba(16,24,40,.04)}.trustIcon{width:38px;height:38px;border-radius:12px;background:#edf4ff;display:grid;place-items:center;font-size:18px}.trustItem b{font-size:14px}.trustItem span{display:block;color:var(--muted);font-size:12px;margin-top:3px}
.section{padding:42px 0}.sectionHead{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}.sectionHead h2{font-size:34px;letter-spacing:-.045em;margin:5px 0 0}.sectionHead p{color:var(--muted);max-width:650px;line-height:1.55;margin:8px 0 0}.scenarios{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.scenario{position:relative;background:#fff;border:1px solid var(--line);border-radius:24px;padding:26px;box-shadow:0 12px 35px rgba(16,24,40,.05);cursor:pointer;transition:transform .18s,box-shadow .18s,border-color .18s;overflow:hidden}.scenario:hover{transform:translateY(-4px);box-shadow:0 20px 45px rgba(16,24,40,.10);border-color:#c8d7f8}.scenarioTop{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.scenarioIcon{width:54px;height:54px;border-radius:17px;background:linear-gradient(135deg,#eff6ff,#e0e7ff);display:grid;place-items:center;font-size:25px}.scenarioArrow{width:36px;height:36px;border-radius:12px;background:#f2f4f7;display:grid;place-items:center;color:#344054;font-weight:900}.scenario h3{font-size:21px;letter-spacing:-.025em;margin:18px 0 8px}.scenario p{color:var(--muted);line-height:1.55;margin:0 0 17px}.scenarioCta{font-size:13px;font-weight:900;color:var(--blue2)}
.notice{margin-top:20px;padding:13px 15px;border-radius:14px;background:#fff8e7;border:1px solid #f9df9a;color:#7a4d00;font-size:12px;line-height:1.5}
.calcSection{padding:18px 0 60px}.calculatorPanel{background:#fff;border:1px solid var(--line);border-radius:28px;box-shadow:var(--shadow);padding:28px;scroll-margin-top:20px}.calcHeader{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.calcTitle{display:flex;gap:14px;align-items:center}.calcTitleIcon{width:52px;height:52px;border-radius:16px;background:#eef4ff;display:grid;place-items:center;font-size:24px}.calcTitle h2{margin:0;font-size:28px;letter-spacing:-.04em}.calcTitle p{margin:5px 0 0;color:var(--muted);line-height:1.45}.formGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:22px}.field label{display:block;font-size:12px;font-weight:900;margin-bottom:7px;color:#344054}.field input,.field select{width:100%;padding:13px 14px;border:1px solid #d0d5dd;border-radius:12px;background:#fff;color:var(--navy);font:inherit;outline:none}.field input:focus,.field select:focus{border-color:#84adff;box-shadow:0 0 0 4px #edf4ff}.leadBox{margin-top:24px;padding-top:24px;border-top:1px solid var(--line)}.leadBox h3{margin:0 0 5px;font-size:19px}.leadBox p{margin:0;color:var(--muted);font-size:13px}.result{margin-top:20px;border-radius:20px;padding:22px;background:linear-gradient(135deg,#eff6ff,#f8fbff);border:1px solid #cfe0ff}.resultGrid{display:grid;grid-template-columns:1.2fr 1fr;gap:18px;align-items:center}.resultMain small{color:#475467;font-weight:800}.resultValue{font-size:clamp(32px,5vw,52px);font-weight:950;letter-spacing:-.055em;color:#12316f;margin-top:3px}.metricList{display:grid;gap:9px}.metric{background:#fff;border:1px solid #e4ebf8;border-radius:12px;padding:10px 12px;display:flex;justify-content:space-between;gap:12px;font-size:12px}.metric b{font-size:13px}.err{background:#fff0f1;border:1px solid #ffc8cc;color:#a61b2b;padding:12px 14px;border-radius:12px;margin-top:14px}.ok{background:#ecfdf3;border:1px solid #b7ebcc;color:#11653a;padding:12px 14px;border-radius:12px;margin-top:14px}
.cta{padding:0 0 60px}.ctaBox{background:linear-gradient(135deg,#111827,#243b78);color:#fff;border-radius:28px;padding:36px;display:flex;justify-content:space-between;gap:25px;align-items:center;box-shadow:var(--shadow)}.ctaBox h2{font-size:30px;letter-spacing:-.04em;margin:0 0 8px}.ctaBox p{color:#cbd5e1;margin:0;line-height:1.5}.footer{padding:0 0 35px;color:#667085;font-size:12px;text-align:center}
.waFloat{position:fixed;right:24px;bottom:24px;width:62px;height:62px;border-radius:50%;background:#19b957;color:#fff;display:grid;place-items:center;text-decoration:none;font-size:27px;font-weight:950;box-shadow:0 14px 32px rgba(25,185,87,.28);z-index:50}.waLabel{position:fixed;right:96px;bottom:38px;background:#101828;color:#fff;padding:9px 12px;border-radius:10px;font-size:12px;font-weight:900;z-index:50;box-shadow:0 8px 20px rgba(16,24,40,.18)}
.empty{background:#fff;border:1px dashed #cfd6e4;border-radius:18px;padding:24px;color:var(--muted)}.hide{display:none!important}
@media(max-width:850px){.heroContent{grid-template-columns:1fr;padding:38px 28px}.heroAside{display:none}.trustGrid{grid-template-columns:1fr}.scenarios{grid-template-columns:1fr}.sectionHead{display:block}.ctaBox{display:block}.ctaBox .btn{margin-top:18px}}
@media(max-width:620px){.container{width:min(100% - 22px,1160px)}.topbar{padding:12px 0}.agentTag{display:none}.hero{padding:18px 0 32px}.heroShell{border-radius:25px}.heroContent{padding:30px 22px}h1{font-size:38px}.heroLead{font-size:17px}.section{padding:28px 0}.sectionHead h2{font-size:28px}.scenario{padding:21px}.calculatorPanel{padding:20px;border-radius:22px}.formGrid,.resultGrid{grid-template-columns:1fr}.calcHeader{display:block}.calcHeader .btn{margin-top:15px}.ctaBox{padding:27px 22px;border-radius:22px}.ctaBox h2{font-size:25px}.waFloat{right:15px;bottom:15px}.waLabel{display:none}}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function money(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", maximumFractionDigits: 0
  }).format(Math.max(0, Number(value) || 0));
}

function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function load() {
  if (!slug) return showError("Landing no disponible", "El enlace de la campaña no es válido.");

  const landingResponse = await supabase
    .from("agent_landing_pages")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (landingResponse.error || !landingResponse.data) {
    return showError("Landing no disponible", landingResponse.error?.message || "No encontramos esta página.");
  }

  lp = landingResponse.data;

  const calculatorResponse = await supabase
    .from("calculator_configs")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  if (calculatorResponse.error) {
    return showError("No pudimos cargar los escenarios", calculatorResponse.error.message);
  }

  calculators = calculatorResponse.data || [];

  if (campaignId) {
    const campaignResponse = await supabase
      .from("agent_campaigns")
      .select("*, campaigns(*)")
      .eq("id", campaignId)
      .eq("active", true)
      .single();

    if (!campaignResponse.error && campaignResponse.data && campaignResponse.data.user_id === lp.user_id) {
      agentCampaign = campaignResponse.data;
      campaign = campaignResponse.data.campaigns;
    }
  }

  render();
}

function showError(title, message) {
  root.innerHTML = `<main class="page"><div class="container" style="padding:80px 0"><div class="calculatorPanel"><div class="eyebrow">ProspectaPro</div><h1 style="font-size:42px;margin:8px 0 12px">${esc(title)}</h1><p style="color:var(--muted);line-height:1.6">${esc(message)}</p></div></div></main>`;
}

function getScenarioMeta(calculator) {
  const engine = calculator.engine;
  const map = {
    "Estudios Universitarios": { badge: "Planificación familiar", accent: "Preparar hoy cambia el mañana." },
    "Retiro": { badge: "Patrimonio y futuro", accent: "Convierte una meta futura en un escenario concreto." },
    "Hombre Clave": { badge: "Continuidad empresarial", accent: "Protege el valor que una persona clave aporta al negocio." },
    "Fondo de Inversión": { badge: "Crecimiento patrimonial", accent: "Visualiza el potencial de tus aportaciones a largo plazo." }
  };
  return map[engine] || { badge: "Escenario financiero", accent: "Explora una estimación personalizada." };
}

function render() {
  const wa = (lp.whatsapp_number || "").replace(/\D/g, "");
  const waLink = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent("Hola, quiero recibir orientación sobre los escenarios financieros.")}`
    : "";

  const campaignTitle = campaign?.title || "Tu diagnóstico financiero";
  const heroTitle = lp.headline || "Descubre un escenario financiero para tu futuro";
  const heroSub = lp.subheadline || "Explora alternativas, captura algunos datos y recibe una estimación rápida para conversar con un asesor.";
  const welcome = lp.welcome_text || "Conoce diferentes escenarios y descubre qué información necesitas para dar el siguiente paso.";

  root.innerHTML = `
    <div class="page">
      <header class="topbar">
        <div class="container topbarInner">
          <div class="brand"><div class="brandMark">P</div><span>Prospecta<span style="color:var(--magenta)">Pro</span></span></div>
          <div class="agentTag">Experiencia personalizada · ${esc(campaignTitle)}</div>
        </div>
      </header>

      <main>
        <section class="hero">
          <div class="container">
            <div class="heroShell">
              <div class="heroContent">
                <div>
                  <div class="badges">
                    <span class="badge badgeAccent">✦ ProspectaPro</span>
                    ${campaign ? `<span class="badge">${esc(campaign.platform)}</span><span class="badge">${esc(campaign.ramo)}</span>` : ""}
                  </div>
                  <h1>${esc(heroTitle)}</h1>
                  <p class="heroLead">${esc(heroSub)}</p>
                  <div class="heroActions">
                    <button class="btn btnPrimary" id="startBtn">Explorar mis escenarios ↓</button>
                    ${waLink ? `<a class="btn btnPink" href="${esc(waLink)}" target="_blank" rel="noopener">Hablar con un asesor</a>` : ""}
                  </div>
                  <div style="margin-top:18px;color:#aebedc;font-size:12px">${esc(welcome)}</div>
                </div>
                <aside class="heroAside">
                  <div class="eyebrow">Campaña seleccionada</div>
                  <h3>${esc(campaign?.title || "Escenarios financieros")}</h3>
                  <p>Una experiencia breve para entender tus prioridades y llegar mejor preparado a una conversación con un profesional.</p>
                  ${campaign ? `<div class="campaignBox"><strong>Mensaje de la campaña</strong><div class="campaignText">${esc(campaign.publication_text)}</div><div class="hashtags">${esc(campaign.hashtags)}</div></div>` : ""}
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section class="trust">
          <div class="container trustGrid">
            <div class="trustItem"><div class="trustIcon">⚡</div><div><b>Resultado en minutos</b><span>Captura tus datos y explora un escenario.</span></div></div>
            <div class="trustItem"><div class="trustIcon">🔒</div><div><b>Información orientativa</b><span>El resultado no es una cotización.</span></div></div>
            <div class="trustItem"><div class="trustIcon">💬</div><div><b>Acompañamiento personal</b><span>Continúa la conversación por WhatsApp.</span></div></div>
          </div>
        </section>

        <section class="section" id="scenarios">
          <div class="container">
            <div class="sectionHead">
              <div><div class="eyebrow">Elige tu prioridad</div><h2>¿Qué quieres planear hoy?</h2></div>
              <p>Selecciona uno de los cuatro escenarios. Te mostraremos los datos necesarios, una estimación y los siguientes pasos para recibir orientación.</p>
            </div>
            <div class="scenarios">
              ${calculators.map((c) => {
                const meta = getScenarioMeta(c);
                return `<article class="scenario" data-id="${esc(c.id)}"><div class="scenarioTop"><div class="scenarioIcon">${esc(c.icon || "📊")}</div><div class="scenarioArrow">→</div></div><div class="eyebrow" style="margin-top:18px">${esc(meta.badge)}</div><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><div class="scenarioCta">${esc(meta.accent)} &nbsp;→</div></article>`;
              }).join("") || `<div class="empty">No hay calculadoras publicadas en este momento.</div>`}
            </div>
            <div class="notice">Los resultados son estimaciones ilustrativas elaboradas con los datos que captures. No constituyen una cotización, oferta ni recomendación financiera.</div>
          </div>
        </section>

        <section class="calcSection" id="calculatorArea"></section>

        <section class="cta">
          <div class="container">
            <div class="ctaBox">
              <div><div class="eyebrow" style="color:#aebedc">Siguiente paso</div><h2>¿Quieres convertir el escenario en un plan?</h2><p>Habla con un asesor y revisa qué alternativas pueden adaptarse a tus objetivos.</p></div>
              ${waLink ? `<a class="btn btnPink" href="${esc(waLink)}" target="_blank" rel="noopener">Hablar por WhatsApp →</a>` : ""}
            </div>
          </div>
        </section>
      </main>

      <footer class="footer"><div class="container">ProspectaPro · Escenarios financieros · Información exclusivamente ilustrativa.</div></footer>
      ${waLink ? `<a class="waLabel" href="${esc(waLink)}" target="_blank" rel="noopener">Habla por WhatsApp</a><a class="waFloat" href="${esc(waLink)}" target="_blank" rel="noopener" aria-label="WhatsApp">◔</a>` : ""}
    </div>
  `;

  document.getElementById("startBtn")?.addEventListener("click", () => document.getElementById("scenarios")?.scrollIntoView({ behavior: "smooth" }));
  document.querySelectorAll(".scenario").forEach((card) => card.addEventListener("click", () => openCalc(card.dataset.id)));
}

function openCalc(id) {
  const calculator = calculators.find((c) => c.id === id);
  if (!calculator) return;
  const fields = Array.isArray(calculator.fields) ? calculator.fields : [];
  const area = document.getElementById("calculatorArea");
  const meta = getScenarioMeta(calculator);

  area.innerHTML = `
    <div class="container">
      <div class="calculatorPanel" id="calculatorPanel">
        <div class="calcHeader">
          <div class="calcTitle"><div class="calcTitleIcon">${esc(calculator.icon || "📊")}</div><div><div class="eyebrow">${esc(meta.badge)}</div><h2>${esc(calculator.title)}</h2><p>${esc(meta.accent)}</p></div></div>
          <button class="btn btnGhost" id="closeCalc">Cerrar</button>
        </div>
        <div class="formGrid">
          ${fields.map((f) => `<div class="field"><label>${esc(f[0])}</label><input id="${esc(f[1])}" type="${esc(f[2] || "text")}" value="${esc(f[3] ?? "")}" placeholder="${esc(f[0])}" ${f[2] === "number" ? 'inputmode="decimal"' : ""}></div>`).join("")}
        </div>
        <div class="leadBox">
          <h3>Recibe tu escenario y orientación</h3>
          <p>Déjanos tus datos para guardar el resultado y permitir que el asesor dé seguimiento.</p>
          <div class="formGrid">
            <div class="field"><label>Nombre *</label><input id="p_name" placeholder="Tu nombre"></div>
            <div class="field"><label>WhatsApp / teléfono *</label><input id="p_phone" inputmode="tel" placeholder="10 dígitos o con clave de país"></div>
            <div class="field"><label>Correo</label><input id="p_email" type="email" placeholder="tu@correo.com"></div>
            <div class="field"><label>Empresa (opcional)</label><input id="p_company" placeholder="Empresa"></div>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px"><button class="btn btnPink" id="calculate">Calcular mi escenario</button></div>
        <div id="calcResult"></div>
      </div>
    </div>
  `;

  document.getElementById("closeCalc").onclick = () => { area.innerHTML = ""; document.getElementById("scenarios")?.scrollIntoView({ behavior: "smooth" }); };
  document.getElementById("calculate").onclick = () => calculate(calculator);
  document.getElementById("calculatorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function readFields(calculator) {
  const output = {};
  (Array.isArray(calculator.fields) ? calculator.fields : []).forEach((field) => {
    const element = document.getElementById(field[1]);
    output[field[1]] = element ? element.value : null;
  });
  return output;
}

function calculateValue(engine, values) {
  const n = (key) => number(values[key]);

  if (engine === "Estudios Universitarios") {
    const yearsToStart = Math.max(n("f_years"), 0);
    const currentAnnual = Math.max(n("f_cost"), 0);
    const studyYears = Math.max(n("f_study"), 1);
    const inflation = Math.max(n("f_inf"), 0) / 100;
    let total = 0;
    for (let i = 0; i < studyYears; i += 1) total += currentAnnual * Math.pow(1 + inflation, yearsToStart + i);
    const firstYear = currentAnnual * Math.pow(1 + inflation, yearsToStart);
    return { costo_anual_futuro: firstYear, total_estimado: total, display: total, metrics: [["Costo anual estimado al iniciar", money(firstYear)], ["Años de estudio", studyYears]] };
  }

  if (engine === "Retiro") {
    const age = n("f_age");
    const retirementAge = Math.max(n("f_ret"), age + 1);
    const years = Math.max(retirementAge - age, 1);
    const monthlyToday = Math.max(n("f_cost"), 0);
    const savings = Math.max(n("f_save"), 0);
    const returnRate = Math.max(n("f_rate"), 0) / 100;
    const inflation = Math.max(n("f_inf"), 0) / 100;
    const futureMonthly = monthlyToday * Math.pow(1 + inflation, years);
    const target = futureMonthly * 12 * 20;
    const futureSavings = savings * Math.pow(1 + returnRate, years);
    const gap = Math.max(target - futureSavings, 0);
    return { anos_para_retiro: years, fondo_objetivo_aproximado: target, valor_futuro_ahorro_actual: futureSavings, brecha_aproximada: gap, display: gap, metrics: [["Fondo objetivo aproximado", money(target)], ["Ahorro actual proyectado", money(futureSavings)]] };
  }

  if (engine === "Hombre Clave") {
    const annualIncome = Math.max(n("f_income"), 0);
    const years = Math.max(n("f_years"), 1);
    const impact = Math.min(Math.max(n("f_impact"), 0), 100) / 100;
    const value = annualIncome * years * impact;
    return { valor_economico_aproximado: value, display: value, metrics: [["Ingreso anual considerado", money(annualIncome)], ["Impacto estimado", `${impact * 100}%`]] };
  }

  if (engine === "Fondo de Inversión") {
    const initial = Math.max(n("f_initial"), 0);
    const monthly = Math.max(n("f_monthly"), 0);
    const years = Math.max(n("f_years"), 1);
    const annualRate = Math.max(n("f_rate"), 0) / 100;
    const months = years * 12;
    const monthlyRate = annualRate / 12;
    const growth = monthlyRate === 0 ? 1 : Math.pow(1 + monthlyRate, months);
    const future = initial * growth + (monthlyRate === 0 ? monthly * months : monthly * ((growth - 1) / monthlyRate));
    return { valor_futuro_aproximado: future, total_aportado: initial + monthly * months, display: future, metrics: [["Total aportado", money(initial + monthly * months)], ["Plazo", `${years} años`]] };
  }

  const valuesSum = Object.values(values).map(Number).filter((v) => Number.isFinite(v)).reduce((a, b) => a + b, 0);
  return { valor_aproximado: valuesSum, display: valuesSum, metrics: [] };
}

async function calculate(calculator) {
  const getText = (id) => document.getElementById(id)?.value?.trim() || "";
  const name = getText("p_name");
  const phone = getText("p_phone");
  const email = getText("p_email");
  const company = getText("p_company");
  const resultBox = document.getElementById("calcResult");

  if (!name || !phone) {
    resultBox.innerHTML = `<div class="err">Para generar y guardar tu escenario necesitamos tu nombre y un número de WhatsApp o teléfono.</div>`;
    return;
  }

  const inputs = readFields(calculator);
  const result = calculateValue(calculator.engine, inputs);

  resultBox.innerHTML = `
    <div class="result">
      <div class="resultGrid">
        <div class="resultMain"><small>ESCENARIO ESTIMADO</small><div class="resultValue">${money(result.display)}</div><div style="color:#667085;font-size:12px;line-height:1.5;margin-top:8px">${esc(getScenarioMeta(calculator).accent)} El cálculo es ilustrativo.</div></div>
        <div class="metricList">${(result.metrics || []).map(([label, value]) => `<div class="metric"><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join("")}</div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button class="btn btnDark" id="saveScenario">Guardar escenario y solicitar orientación</button></div>
    </div>
  `;

  document.getElementById("saveScenario").onclick = async () => {
    const button = document.getElementById("saveScenario");
    button.disabled = true;
    button.textContent = "Guardando…";

    const payload = {
      p_landing_slug: slug,
      p_agent_user_id: lp.user_id,
      p_campaign_id: campaign?.id || null,
      p_agent_campaign_id: agentCampaign?.id || null,
      p_calculator_type: calculator.title,
      p_prospect_name: name,
      p_prospect_email: email,
      p_prospect_phone: phone,
      p_company_name: company,
      p_inputs: { calculator_id: calculator.id, engine: calculator.engine, fields: inputs },
      p_result: result
    };

    const { error } = await supabase.rpc("submit_calculator_lead", payload);
    if (error) {
      button.disabled = false;
      button.textContent = "Guardar escenario y solicitar orientación";
      resultBox.insertAdjacentHTML("beforeend", `<div class="err">No pudimos guardar el escenario: ${esc(error.message)}</div>`);
      return;
    }

    resultBox.insertAdjacentHTML("beforeend", `<div class="ok"><b>¡Listo!</b> Tu escenario quedó registrado. El asesor podrá contactarte para revisar una propuesta completa.</div>`);
    button.textContent = "Escenario guardado ✓";

    if (lp.whatsapp_number) {
      const wa = String(lp.whatsapp_number).replace(/\D/g, "");
      if (wa) {
        const message = `Hola, soy ${name}. Acabo de completar el escenario de ${calculator.title} en ProspectaPro y quiero recibir orientación.`;
        const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;
        resultBox.insertAdjacentHTML("beforeend", `<div style="margin-top:12px"><a class="btn btnPink" href="${esc(waUrl)}" target="_blank" rel="noopener">Continuar por WhatsApp →</a></div>`);
      }
    }
  };
}

load();
