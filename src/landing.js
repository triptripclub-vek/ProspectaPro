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
  --ink:#101828;--muted:#667085;--line:#e5e7eb;--soft:#f7f8fa;--pink:#ec008c;--green:#25d366;
  --shadow:0 8px 28px rgba(16,24,40,.08);--radius:18px
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:#fff;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
a{text-decoration:none;color:inherit}
button,input{font:inherit}
.page{min-height:100vh;background:#fff}
.container{width:min(1180px,calc(100% - 34px));margin:0 auto}
.topbar{padding:18px 0 10px;background:#fff}.topbarInner{display:flex;align-items:center;justify-content:space-between}.brand{font-weight:950;font-size:23px;letter-spacing:-.045em}.brand span{color:var(--pink)}.campaignTag{font-size:12px;color:#667085;border:1px solid var(--line);border-radius:999px;padding:8px 12px}
.topGrid{display:grid;grid-template-columns:1.02fr 1.02fr .92fr;gap:16px;padding:10px 0 18px;align-items:stretch}
.card{border:1px solid #e7e9ee;border-radius:var(--radius);overflow:hidden;background:#fff;box-shadow:0 2px 10px rgba(16,24,40,.035)}
.adviceCard{min-height:520px;position:relative;background-image:linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.66)),url('/assets/hero.jpg');background-size:cover;background-position:center}.adviceContent{position:absolute;inset:0;padding:30px 28px;color:#fff;display:flex;flex-direction:column;justify-content:flex-start}.adviceContent h1{font-size:clamp(32px,3.4vw,48px);line-height:1.03;letter-spacing:-.05em;margin:0 0 14px;max-width:440px}.adviceContent h2{font-size:23px;line-height:1.15;margin:0 0 22px}.adviceContent p{font-size:16px;line-height:1.52;margin:0 0 11px;max-width:410px}.smallWhite{font-size:14px!important;margin-top:8px!important;opacity:.92}
.regCard{min-height:520px;padding:36px 28px;display:flex;flex-direction:column;align-items:center;text-align:center;justify-content:flex-start}.regLead{font-size:17px;line-height:1.45;color:#6b7280;max-width:350px;margin:0 auto 28px}.regLogo{width:100%;max-width:280px;margin:13px auto;color:#7b8189}.regLogo strong{display:block;font-size:28px;letter-spacing:-.04em}.regLogo .mark{font-size:34px;font-weight:950;line-height:1}.regLogo small{font-size:8px;letter-spacing:.04em;font-weight:800}.regFoot{margin-top:auto;color:#777f89;font-size:11px;line-height:1.45;max-width:290px}
.calcHub{min-height:520px;padding:22px;background:#fff}.calcHub h2{font-size:25px;letter-spacing:-.035em;margin:0 0 6px}.calcHubIntro{color:#667085;font-size:13px;line-height:1.45;margin:0 0 17px}.calcTiles{display:grid;grid-template-columns:1fr 1fr;gap:9px}.calcTile{position:relative;min-height:124px;border-radius:10px;overflow:hidden;cursor:pointer;background:#ddd;box-shadow:0 3px 12px rgba(16,24,40,.08)}.calcTile img{width:100%;height:100%;min-height:124px;object-fit:cover;display:block;filter:brightness(.72)}.calcTile:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.62))}.calcTile span{position:absolute;z-index:2;left:10px;right:10px;bottom:11px;color:#fff;font-weight:950;font-size:15px;line-height:1.08;text-shadow:0 2px 8px rgba(0,0,0,.5)}.calcTile .waMini{position:absolute;z-index:3;right:7px;top:7px;width:27px;height:27px;border-radius:50%;background:var(--green);display:grid;place-items:center;box-shadow:0 2px 7px rgba(0,0,0,.2)}.waSvg{width:17px;height:17px;display:block}
.sectionTitle{text-align:center;padding:34px 0 17px}.sectionTitle h2{font-size:30px;letter-spacing:-.045em;margin:0 0 7px}.sectionTitle p{color:#667085;margin:0;font-size:14px}
.infoGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-bottom:34px}.infoCard{overflow:hidden;border:1px solid #e7e9ee;border-radius:var(--radius);background:#fff;box-shadow:0 2px 10px rgba(16,24,40,.035);display:flex;flex-direction:column}.infoText{padding:22px 22px 20px;min-height:300px}.infoText h3{font-size:22px;line-height:1.12;margin:0 0 17px;letter-spacing:-.03em}.infoText p{color:#667085;font-size:14px;line-height:1.55;margin:0 0 10px}.infoImage{position:relative;height:205px}.infoImage img{width:100%;height:100%;object-fit:cover;display:block}.infoImage:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.25))}.infoImage .waMini{position:absolute;z-index:3;right:12px;bottom:12px;width:44px;height:44px;border-radius:50%;background:var(--green);display:grid;place-items:center;box-shadow:0 5px 15px rgba(0,0,0,.2)}
.calcSection{padding:12px 0 35px;scroll-margin-top:15px}.calculatorPanel{border:1px solid #e2e5ea;border-radius:22px;background:#fff;box-shadow:var(--shadow);padding:28px}.calcHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;border-bottom:1px solid var(--line);padding-bottom:20px}.calcTitle h2{font-size:28px;letter-spacing:-.04em;margin:4px 0 6px}.calcTitle p{color:var(--muted);margin:0;line-height:1.45}.eyebrow{font-size:10px;letter-spacing:.12em;text-transform:uppercase;font-weight:950;color:#7b8490}.btn{border:0;border-radius:10px;padding:12px 16px;font-weight:900;cursor:pointer}.btnPink{background:var(--pink);color:#fff}.btnDark{background:#111827;color:#fff}.btnGhost{background:#f0f2f5;color:#344054}.formGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:22px}.field label{display:block;font-size:12px;font-weight:900;color:#344054;margin-bottom:7px}.field input,.field select{width:100%;border:1px solid #d0d5dd;border-radius:11px;padding:12px 13px;background:#fff;color:var(--ink);outline:none}.field input:focus,.field select:focus{border-color:#98b7ff;box-shadow:0 0 0 4px #eef4ff}.leadBox{margin-top:23px;padding-top:22px;border-top:1px solid var(--line)}.leadBox h3{margin:0 0 5px;font-size:18px}.leadBox p{margin:0;color:var(--muted);font-size:13px}.result{margin-top:20px;border-radius:17px;padding:20px;background:#f6f9ff;border:1px solid #dce8ff}.resultGrid{display:grid;grid-template-columns:1.15fr 1fr;gap:18px}.resultValue{font-size:46px;font-weight:950;letter-spacing:-.055em;color:#183b7a;margin:4px 0}.metricList{display:grid;gap:8px}.metric{background:#fff;border:1px solid #e5eaf4;border-radius:10px;padding:10px 12px;display:flex;justify-content:space-between;gap:10px;font-size:12px}.metric b{font-size:13px}.err{margin-top:13px;background:#fff1f2;border:1px solid #ffcdd2;color:#9f1239;border-radius:10px;padding:11px 13px;font-size:13px}.ok{margin-top:13px;background:#ecfdf3;border:1px solid #bbf7d0;color:#166534;border-radius:10px;padding:11px 13px;font-size:13px}
.disclaimer{font-size:11px;color:#7a818a;line-height:1.5;text-align:center;padding:0 0 25px}.footer{border-top:1px solid var(--line);padding:20px 0 28px;text-align:center;color:#7a818a;font-size:11px}
.waFloat{position:fixed;right:22px;bottom:22px;width:58px;height:58px;border-radius:50%;background:var(--green);display:grid;place-items:center;z-index:60;box-shadow:0 7px 22px rgba(37,211,102,.35)}.waFloat .waSvg{width:31px;height:31px}.waLabel{position:fixed;right:90px;bottom:34px;background:#111827;color:#fff;padding:8px 11px;border-radius:8px;font-size:11px;font-weight:900;z-index:60}
@media(max-width:900px){.topGrid{grid-template-columns:1fr 1fr}.calcHub{grid-column:1/-1;min-height:auto}.adviceCard,.regCard{min-height:500px}.infoGrid{grid-template-columns:1fr}.infoText{min-height:auto}.infoImage{height:260px}}
@media(max-width:620px){.container{width:calc(100% - 20px)}.topbar{padding-top:12px}.campaignTag{display:none}.topGrid{grid-template-columns:1fr;gap:12px}.adviceCard{min-height:500px}.regCard{min-height:430px;padding:30px 20px}.calcHub{grid-column:auto;padding:18px}.calcTiles{gap:8px}.calcTile{min-height:135px}.calcTile img{min-height:135px}.calcTile span{font-size:14px}.sectionTitle{padding:27px 0 15px}.sectionTitle h2{font-size:25px}.infoGrid{gap:12px}.infoText{padding:20px}.infoImage{height:220px}.calculatorPanel{padding:20px;border-radius:18px}.calcHeader{display:block}.calcHeader .btn{margin-top:15px}.formGrid,.resultGrid{grid-template-columns:1fr}.resultValue{font-size:38px}.waFloat{right:14px;bottom:14px;width:55px;height:55px}.waLabel{display:none}}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

const WA_SVG = `<svg class="waSvg" viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" d="M19.11 17.34c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.76.95-.93 1.15-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.43-.85-.76-1.42-1.7-1.59-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.58-.9-2.16-.24-.57-.48-.5-.66-.51h-.56c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.49s1.06 2.89 1.21 3.09c.15.2 2.08 3.18 5.04 4.46.7.3 1.25.48 1.68.61.71.23 1.35.2 1.86.12.57-.09 1.72-.7 1.97-1.38.24-.68.24-1.27.17-1.38-.07-.12-.27-.19-.56-.34Z"/><path fill="#fff" d="M16.03 3.2c-7.08 0-12.83 5.75-12.83 12.83 0 2.26.59 4.47 1.72 6.42L3.09 28.8l6.5-1.7a12.77 12.77 0 0 0 6.44 1.73h.01c7.08 0 12.83-5.75 12.83-12.83S23.11 3.2 16.03 3.2Zm0 23.4h-.01a10.54 10.54 0 0 1-5.37-1.47l-.39-.23-3.86 1.01 1.03-3.76-.25-.39a10.58 10.58 0 1 1 8.85 4.84Z"/></svg>`;

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));
}

function money(value) {
  return new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", maximumFractionDigits:0 }).format(Math.max(0, Number(value)||0));
}
function number(value, fallback=0) { const n=Number(value); return Number.isFinite(n)?n:fallback; }

async function load() {
  if (!slug) return showError("Landing no disponible", "El enlace de la campaña no es válido.");
  const landingResponse = await supabase.from("agent_landing_pages").select("*").eq("slug", slug).eq("active", true).single();
  if (landingResponse.error || !landingResponse.data) return showError("Landing no disponible", landingResponse.error?.message || "No encontramos esta página.");
  lp = landingResponse.data;

  const calculatorResponse = await supabase.from("calculator_configs").select("*").eq("active", true).order("sort_order");
  if (calculatorResponse.error) return showError("No pudimos cargar los escenarios", calculatorResponse.error.message);
  calculators = calculatorResponse.data || [];

  if (campaignId) {
    const campaignResponse = await supabase.from("agent_campaigns").select("*, campaigns(*)").eq("id", campaignId).eq("active", true).single();
    if (!campaignResponse.error && campaignResponse.data && campaignResponse.data.user_id === lp.user_id) {
      agentCampaign = campaignResponse.data;
      campaign = campaignResponse.data.campaigns;
    }
  }
  render();
}

function showError(title,message){
  root.innerHTML=`<main class="page"><div class="container" style="padding:70px 0"><div class="card" style="padding:30px"><div class="eyebrow">ProspectaPro</div><h1 style="font-size:40px;margin:8px 0 10px">${esc(title)}</h1><p style="color:#667085;line-height:1.6">${esc(message)}</p></div></div></main>`;
}

function getScenarioMeta(calculator){
  const map={
    "Estudios Universitarios":{badge:"Planificación familiar",accent:"Prepara hoy el futuro educativo de tu familia."},
    "Retiro":{badge:"Patrimonio y futuro",accent:"Convierte una meta futura en un escenario concreto."},
    "Hombre Clave":{badge:"Continuidad empresarial",accent:"Protege el valor que una persona clave aporta al negocio."},
    "Fondo de Inversión":{badge:"Crecimiento patrimonial",accent:"Visualiza el potencial de tus aportaciones a largo plazo."}
  };
  return map[calculator.engine]||{badge:"Escenario financiero",accent:"Explora una estimación personalizada."};
}

function calculatorAsset(calculator){
  const engine=calculator.engine;
  if(engine==="Retiro") return "/assets/retirement.jpg";
  if(engine==="Estudios Universitarios") return "/assets/education.jpg";
  if(engine==="Hombre Clave") return "/assets/keyman.jpg";
  if(engine==="Fondo de Inversión") return "/assets/investment.jpg";
  return "/assets/retirement.jpg";
}

function findCalc(engine){ return calculators.find(c=>c.engine===engine) || calculators.find(c=>String(c.title||"").toLowerCase().includes(engine.toLowerCase())); }

function render(){
  const wa=(lp.whatsapp_number||"").replace(/\D/g,"");
  const waLink=wa?`https://wa.me/${wa}?text=${encodeURIComponent("Hola, quiero recibir orientación sobre los escenarios financieros.")}`:"";
  const heroTitle=lp.headline||"Asesorías personalizadas";
  const heroSub=lp.subheadline||"Para personas como tú";
  const welcome=lp.welcome_text||"Entendemos tu visión de éxito y analizamos tus necesidades financieras actuales y futuras según tu estilo de vida.";

  const calcDefs=[
    {engine:"Retiro",label:"Plan para el Retiro"},
    {engine:"Estudios Universitarios",label:"Educación universitaria"},
    {engine:"Hombre Clave",label:"Hombre Clave"},
    {engine:"Fondo de Inversión",label:"Fondo de inversión"}
  ];

  const tiles=calcDefs.map(def=>{
    const c=findCalc(def.engine);
    if(!c) return "";
    return `<article class="calcTile" data-id="${esc(c.id)}"><img src="${calculatorAsset(c)}" alt="${esc(def.label)}"><span>${esc(def.label)}</span><span class="waMini">${WA_SVG}</span></article>`;
  }).join("");

  const retirement=findCalc("Retiro");
  const education=findCalc("Estudios Universitarios");
  const keyman=findCalc("Hombre Clave");

  root.innerHTML=`
  <div class="page">
    <header class="topbar"><div class="container topbarInner"><div class="brand">Prospecta<span>Pro</span></div><div class="campaignTag">${esc(campaign?.title||"Asesoría financiera personalizada")}</div></div></header>

    <main>
      <section class="container topGrid">
        <article class="card adviceCard">
          <div class="adviceContent">
            <h1>${esc(heroTitle)}</h1>
            <h2>${esc(heroSub)}</h2>
            <p>Entendemos tu visión de éxito.</p>
            <p>${esc(welcome)}</p>
            <p>Identificamos el perfil de tus necesidades y estructuramos un plan realista con visión de largo plazo.</p>
            ${campaign?.publication_text?`<p class="smallWhite">${esc(campaign.publication_text)}</p>`:""}
          </div>
        </article>

        <article class="card regCard">
          <p class="regLead">Las estrategias que implementamos utilizan instrumentos autorizados y regulados por:</p>
          <div class="regLogo"><div class="mark">◈</div><strong>CNBV</strong><small>COMISIÓN NACIONAL BANCARIA Y DE VALORES</small></div>
          <div class="regLogo"><div class="mark">◫</div><strong>CNSF</strong><small>COMISIÓN NACIONAL DE SEGUROS Y FIANZAS</small></div>
          <div class="regLogo"><strong style="font-size:31px">CONDUSEF</strong><small>COMISIÓN NACIONAL PARA LA PROTECCIÓN Y DEFENSA DE LOS USUARIOS DE SERVICIOS FINANCIEROS</small></div>
          <div class="regFoot">La información de esta página es orientativa. La asesoría y contratación final dependen del análisis individual de cada persona.</div>
        </article>

        <article class="card calcHub">
          <h2>Nuestras calculadoras</h2>
          <p class="calcHubIntro">Explora diferentes escenarios y encuentra una opción adecuada para lo que estás buscando.</p>
          <div class="calcTiles">${tiles || `<div class="empty">No hay calculadoras publicadas.</div>`}</div>
        </article>
      </section>

      <section class="container">
        <div class="sectionTitle"><h2>Escenarios para construir tu estrategia financiera</h2><p>Conoce algunas de las alternativas que puedes explorar con nuestras calculadoras.</p></div>
        <div class="infoGrid">
          ${retirement?`<article class="infoCard"><div class="infoText"><h3>Plan para el Retiro</h3><p>Un plan de retiro bien estructurado combina ahorro, inversión y beneficios fiscales en una misma estrategia.</p><p>Te ayudamos a construirlo con acceso a instrumentos como de renta fija y variable, alineado a tus objetivos y dentro del marco fiscal vigente.</p></div><div class="infoImage"><img src="/assets/retirement.jpg" alt="Plan para el Retiro"><span class="waMini">${WA_SVG}</span></div></article>`:""}
          ${education?`<article class="infoCard"><div class="infoText"><h3>Educación Universitaria</h3><p>La educación de tus hijos requiere algo más que ahorro: se construye con estrategia.</p><p>Existen esquemas que combinan inversión, beneficios fiscales, liquidez y crecimiento a largo plazo para lograr un resultado más eficiente.</p><p>Diseñamos un plan que no solo acumula, sino que hace crecer tu patrimonio para respaldar su futuro.</p></div><div class="infoImage"><img src="/assets/education.jpg" alt="Educación Universitaria"><span class="waMini">${WA_SVG}</span></div></article>`:""}
          ${keyman?`<article class="infoCard"><div class="infoText"><h3>Hombre Clave de una Empresa</h3><p>Proteger el talento clave de tu empresa es una parte fundamental de tu estrategia financiera.</p><p>A través de esquemas alineados al artículo 151 de la LISR, es posible reducir la carga fiscal de forma legal mientras construyes tu patrimonio.</p><p>Integramos deducciones dentro de una estrategia estructurada que combina inversión, protección y largo plazo.</p></div><div class="infoImage"><img src="/assets/keyman.jpg" alt="Hombre Clave de una Empresa"><span class="waMini">${WA_SVG}</span></div></article>`:""}
        </div>
      </section>

      <section class="container calcSection" id="calculatorArea"></section>
      <div class="container disclaimer">Los resultados de las calculadoras son estimaciones ilustrativas y no constituyen una cotización, oferta, recomendación ni asesoría financiera personalizada.</div>
    </main>

    <footer class="footer"><div class="container">ProspectaPro · Escenarios financieros · Información exclusivamente ilustrativa.</div></footer>
    ${waLink?`<a class="waLabel" href="${esc(waLink)}" target="_blank" rel="noopener">Habla por WhatsApp</a><a class="waFloat" href="${esc(waLink)}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA_SVG}</a>`:""}
  </div>`;

  document.querySelectorAll(".calcTile").forEach(card=>card.addEventListener("click",()=>openCalc(card.dataset.id)));
}

function openCalc(id){
  const calculator=calculators.find(c=>c.id===id); if(!calculator) return;
  const fields=Array.isArray(calculator.fields)?calculator.fields:[];
  const area=document.getElementById("calculatorArea"); const meta=getScenarioMeta(calculator);
  area.innerHTML=`<div class="calculatorPanel" id="calculatorPanel">
    <div class="calcHeader"><div class="calcTitle"><div class="eyebrow">${esc(meta.badge)}</div><h2>${esc(calculator.title)}</h2><p>${esc(meta.accent)}</p></div><button class="btn btnGhost" id="closeCalc">Cerrar</button></div>
    <div class="formGrid">${fields.map(f=>`<div class="field"><label>${esc(f[0])}</label><input id="${esc(f[1])}" type="${esc(f[2]||"text")}" value="${esc(f[3]??"")}" placeholder="${esc(f[0])}" ${f[2]==="number"?'inputmode="decimal"':''}></div>`).join("")}</div>
    <div class="leadBox"><h3>Recibe tu escenario y orientación</h3><p>Déjanos tus datos para guardar el resultado y permitir que el asesor dé seguimiento.</p><div class="formGrid"><div class="field"><label>Nombre *</label><input id="p_name" placeholder="Tu nombre"></div><div class="field"><label>WhatsApp / teléfono *</label><input id="p_phone" inputmode="tel" placeholder="10 dígitos o con clave de país"></div><div class="field"><label>Correo</label><input id="p_email" type="email" placeholder="tu@correo.com"></div><div class="field"><label>Empresa (opcional)</label><input id="p_company" placeholder="Empresa"></div></div></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px"><button class="btn btnPink" id="calculate">Calcular mi escenario</button></div><div id="calcResult"></div>
  </div>`;
  document.getElementById("closeCalc").onclick=()=>{area.innerHTML="";document.getElementById("calculatorArea")?.scrollIntoView({behavior:"smooth"})};
  document.getElementById("calculate").onclick=()=>calculate(calculator);
  document.getElementById("calculatorPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
}

function readFields(calculator){const output={};(Array.isArray(calculator.fields)?calculator.fields:[]).forEach(field=>{const el=document.getElementById(field[1]);output[field[1]]=el?el.value:null});return output;}

function calculateValue(engine,values){
  const n=key=>number(values[key]);
  if(engine==="Estudios Universitarios"){
    const yearsToStart=Math.max(n("f_years"),0),currentAnnual=Math.max(n("f_cost"),0),studyYears=Math.max(n("f_study"),1),inflation=Math.max(n("f_inf"),0)/100;let total=0;for(let i=0;i<studyYears;i++)total+=currentAnnual*Math.pow(1+inflation,yearsToStart+i);const firstYear=currentAnnual*Math.pow(1+inflation,yearsToStart);return{costo_anual_futuro:firstYear,total_estimado:total,display:total,metrics:[["Costo anual estimado al iniciar",money(firstYear)],["Años de estudio",studyYears]]};
  }
  if(engine==="Retiro"){
    const age=n("f_age"),retirementAge=Math.max(n("f_ret"),age+1),years=Math.max(retirementAge-age,1),monthlyToday=Math.max(n("f_cost"),0),savings=Math.max(n("f_save"),0),returnRate=Math.max(n("f_rate"),0)/100,inflation=Math.max(n("f_inf"),0)/100,futureMonthly=monthlyToday*Math.pow(1+inflation,years),target=futureMonthly*12*20,futureSavings=savings*Math.pow(1+returnRate,years),gap=Math.max(target-futureSavings,0);return{anos_para_retiro:years,fondo_objetivo_aproximado:target,valor_futuro_ahorro_actual:futureSavings,brecha_aproximada:gap,display:gap,metrics:[["Fondo objetivo aproximado",money(target)],["Ahorro actual proyectado",money(futureSavings)]]};
  }
  if(engine==="Hombre Clave"){
    const annualIncome=Math.max(n("f_income"),0),years=Math.max(n("f_years"),1),impact=Math.min(Math.max(n("f_impact"),0),100)/100,value=annualIncome*years*impact;return{valor_economico_aproximado:value,display:value,metrics:[["Ingreso anual considerado",money(annualIncome)],["Impacto estimado",`${impact*100}%`]]};
  }
  if(engine==="Fondo de Inversión"){
    const initial=Math.max(n("f_initial"),0),monthly=Math.max(n("f_monthly"),0),years=Math.max(n("f_years"),1),annualRate=Math.max(n("f_rate"),0)/100,months=years*12,monthlyRate=annualRate/12,growth=monthlyRate===0?1:Math.pow(1+monthlyRate,months),future=initial*growth+(monthlyRate===0?monthly*months:monthly*((growth-1)/monthlyRate));return{valor_futuro_aproximado:future,total_aportado:initial+monthly*months,display:future,metrics:[["Total aportado",money(initial+monthly*months)],["Plazo",`${years} años`]]};
  }
  const valuesSum=Object.values(values).map(Number).filter(v=>Number.isFinite(v)).reduce((a,b)=>a+b,0);return{valor_aproximado:valuesSum,display:valuesSum,metrics:[]};
}

async function calculate(calculator){
  const getText=id=>document.getElementById(id)?.value?.trim()||"";const name=getText("p_name"),phone=getText("p_phone"),email=getText("p_email"),company=getText("p_company"),resultBox=document.getElementById("calcResult");
  if(!name||!phone){resultBox.innerHTML=`<div class="err">Para generar y guardar tu escenario necesitamos tu nombre y un número de WhatsApp o teléfono.</div>`;return;}
  const inputs=readFields(calculator),result=calculateValue(calculator.engine,inputs);
  resultBox.innerHTML=`<div class="result"><div class="resultGrid"><div><div class="eyebrow">ESCENARIO ESTIMADO</div><div class="resultValue">${money(result.display)}</div><div style="color:#667085;font-size:12px;line-height:1.5">${esc(getScenarioMeta(calculator).accent)} El cálculo es ilustrativo.</div></div><div class="metricList">${(result.metrics||[]).map(([label,value])=>`<div class="metric"><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join("")}</div></div><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button class="btn btnDark" id="saveScenario">Guardar escenario y solicitar orientación</button></div></div>`;
  document.getElementById("saveScenario").onclick=async()=>{
    const button=document.getElementById("saveScenario");button.disabled=true;button.textContent="Guardando…";
    const payload={p_landing_slug:slug,p_agent_user_id:lp.user_id,p_campaign_id:campaign?.id||null,p_agent_campaign_id:agentCampaign?.id||null,p_calculator_type:calculator.title,p_prospect_name:name,p_prospect_email:email,p_prospect_phone:phone,p_company_name:company,p_inputs:{calculator_id:calculator.id,engine:calculator.engine,fields:inputs},p_result:result};
    const {error}=await supabase.rpc("submit_calculator_lead",payload);
    if(error){button.disabled=false;button.textContent="Guardar escenario y solicitar orientación";resultBox.insertAdjacentHTML("beforeend",`<div class="err">No pudimos guardar el escenario: ${esc(error.message)}</div>`);return;}
    resultBox.insertAdjacentHTML("beforeend",`<div class="ok"><b>¡Listo!</b> Tu escenario quedó registrado. El asesor podrá contactarte para revisar una propuesta completa.</div>`);button.textContent="Escenario guardado ✓";
    if(lp.whatsapp_number){const wa=String(lp.whatsapp_number).replace(/\D/g,"");if(wa){const message=`Hola, soy ${name}. Acabo de completar el escenario de ${calculator.title} en ProspectaPro y quiero recibir orientación.`;const waUrl=`https://wa.me/${wa}?text=${encodeURIComponent(message)}`;resultBox.insertAdjacentHTML("beforeend",`<div style="margin-top:12px"><a class="btn btnPink" href="${esc(waUrl)}" target="_blank" rel="noopener">Continuar por WhatsApp →</a></div>`);}}
  };
}

load();
