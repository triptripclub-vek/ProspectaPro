import { createClient } from "@supabase/supabase-js";
import heroImg from "../assets/hero.jpg";
import retirementImg from "../assets/retirement.jpg";
import educationImg from "../assets/education.jpg";
import keymanImg from "../assets/keyman.jpg";
import investmentImg from "../assets/investment.jpg";

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
:root{--ink:#101828;--muted:#667085;--line:#e6e8ec;--pink:#ec008c;--green:#25d366;--soft:#f7f8fa;--shadow:0 12px 34px rgba(16,24,40,.08);--radius:20px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#fff;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}a{text-decoration:none;color:inherit}button,input{font:inherit}.page{min-height:100vh;background:#fff}.container{width:min(1180px,calc(100% - 32px));margin:0 auto}
.topbar{padding:18px 0 12px;background:#fff}.topbarInner{display:flex;align-items:center;justify-content:space-between}.brand{font-weight:950;font-size:25px;letter-spacing:-.05em}.brand span{color:var(--pink)}.campaignTag{font-size:12px;color:#667085;border:1px solid var(--line);border-radius:999px;padding:8px 13px}
.topGrid{display:grid;grid-template-columns:1.02fr 1.02fr .92fr;gap:16px;padding:8px 0 26px;align-items:stretch}.card{border:1px solid #e7e9ee;border-radius:var(--radius);overflow:hidden;background:#fff;box-shadow:0 2px 10px rgba(16,24,40,.035)}
.adviceCard{min-height:545px;position:relative;background-image:linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.7)),url('${heroImg}');background-size:cover;background-position:center}.adviceContent{position:absolute;inset:0;padding:32px 28px;color:#fff;display:flex;flex-direction:column;justify-content:flex-start}.adviceContent h1{font-size:clamp(34px,3.4vw,49px);line-height:1.01;letter-spacing:-.055em;margin:0 0 13px;max-width:450px}.adviceContent h2{font-size:23px;line-height:1.15;margin:0 0 22px}.adviceContent p{font-size:16px;line-height:1.52;margin:0 0 12px;max-width:430px}.smallWhite{font-size:13px!important;opacity:.9}
.regCard{min-height:545px;padding:36px 26px;display:flex;flex-direction:column;align-items:center;text-align:center;justify-content:flex-start}.regLead{font-size:17px;line-height:1.45;color:#6b7280;max-width:350px;margin:0 auto 26px}.regLogo{width:100%;max-width:300px;margin:12px auto;color:#858b92}.regLogo strong{display:block;font-size:29px;letter-spacing:-.04em}.regLogo .mark{font-size:34px;font-weight:950;line-height:1}.regLogo small{font-size:8px;letter-spacing:.035em;font-weight:800}.regFoot{margin-top:auto;color:#777f89;font-size:11px;line-height:1.45;max-width:290px}
.calcHub{min-height:545px;padding:22px;background:#fff}.calcHub h2{font-size:25px;letter-spacing:-.035em;margin:0 0 6px}.calcHubIntro{color:#667085;font-size:13px;line-height:1.45;margin:0 0 17px}.calcTiles{display:grid;grid-template-columns:1fr 1fr;gap:9px}.calcTile{position:relative;min-height:128px;border-radius:11px;overflow:hidden;cursor:pointer;background:#ddd;box-shadow:0 3px 12px rgba(16,24,40,.08);transition:transform .18s,box-shadow .18s}.calcTile:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(16,24,40,.14)}.calcTile img{width:100%;height:100%;min-height:128px;object-fit:cover;display:block;filter:brightness(.72)}.calcTile:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.67))}.calcTile span.title{position:absolute;z-index:2;left:10px;right:10px;bottom:11px;color:#fff;font-weight:950;font-size:15px;line-height:1.08;text-shadow:0 2px 8px rgba(0,0,0,.5)}
.waMini{position:absolute;z-index:4;right:8px;top:8px;width:29px;height:29px;border-radius:50%;background:var(--green);display:grid;place-items:center;box-shadow:0 2px 7px rgba(0,0,0,.2)}.waSvg{width:18px;height:18px;display:block}
.scenarioArea{padding:0 0 32px;scroll-margin-top:12px}.scenarioPanel{border:1px solid #e2e5ea;border-radius:24px;background:#fff;box-shadow:var(--shadow);overflow:hidden}.scenarioTop{display:grid;grid-template-columns:.9fr 1.1fr;min-height:360px}.scenarioImage{position:relative;min-height:360px;background:#ddd}.scenarioImage img{width:100%;height:100%;object-fit:cover;display:block}.scenarioImage:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.48))}.scenarioImage .imageTitle{position:absolute;z-index:2;left:26px;right:26px;bottom:25px;color:#fff;font-weight:950;font-size:32px;line-height:1.03;letter-spacing:-.04em;text-shadow:0 2px 10px rgba(0,0,0,.5)}.scenarioCopy{padding:30px 30px 26px;display:flex;flex-direction:column;justify-content:center}.eyebrow{font-size:10px;letter-spacing:.12em;text-transform:uppercase;font-weight:950;color:#7b8490}.scenarioCopy h2{font-size:32px;letter-spacing:-.045em;line-height:1.05;margin:7px 0 14px}.scenarioCopy p{font-size:15px;line-height:1.6;color:#667085;margin:0 0 12px}.scenarioCopy .scenarioCta{margin-top:10px;font-size:13px;font-weight:900;color:#101828}
.calculatorForm{border-top:1px solid var(--line);padding:28px 30px 30px}.calcFormHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.calcFormHeader h3{font-size:23px;margin:4px 0 5px;letter-spacing:-.035em}.calcFormHeader p{color:#667085;font-size:13px;margin:0;line-height:1.45}.formGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:21px}.field label{display:block;font-size:12px;font-weight:900;color:#344054;margin-bottom:7px}.field input,.field select{width:100%;border:1px solid #d0d5dd;border-radius:11px;padding:12px 13px;background:#fff;color:var(--ink);outline:none}.field input:focus,.field select:focus{border-color:#98b7ff;box-shadow:0 0 0 4px #eef4ff}.leadBox{margin-top:24px;padding-top:23px;border-top:1px solid var(--line)}.leadBox h4{margin:0 0 5px;font-size:17px}.leadBox p{margin:0;color:var(--muted);font-size:13px}.btnRow{display:flex;gap:10px;flex-wrap:wrap;margin-top:21px}.btn{border:0;border-radius:11px;padding:12px 17px;font-weight:900;cursor:pointer}.btnPink{background:var(--pink);color:#fff}.btnDark{background:#111827;color:#fff}.btnGhost{background:#f0f2f5;color:#344054}.btn:disabled{opacity:.55;cursor:not-allowed}.result{margin-top:20px;border-radius:17px;padding:20px;background:#f6f9ff;border:1px solid #dce8ff}.resultGrid{display:grid;grid-template-columns:1.15fr 1fr;gap:18px}.resultValue{font-size:46px;font-weight:950;letter-spacing:-.055em;color:#183b7a;margin:4px 0}.metricList{display:grid;gap:8px}.metric{background:#fff;border:1px solid #e5eaf4;border-radius:10px;padding:10px 12px;display:flex;justify-content:space-between;gap:10px;font-size:12px}.metric b{font-size:13px}.err{margin-top:13px;background:#fff1f2;border:1px solid #ffcdd2;color:#9f1239;border-radius:10px;padding:11px 13px;font-size:13px}.ok{margin-top:13px;background:#ecfdf3;border:1px solid #bbf7d0;color:#166534;border-radius:10px;padding:11px 13px;font-size:13px}
.disclaimer{font-size:11px;color:#7a818a;line-height:1.5;text-align:center;padding:0 0 25px}.footer{border-top:1px solid var(--line);padding:20px 0 28px;text-align:center;color:#7a818a;font-size:11px}.waFloat{position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;background:var(--green);display:grid;place-items:center;z-index:60;box-shadow:0 7px 22px rgba(37,211,102,.35)}.waFloat .waSvg{width:33px;height:33px}.waLabel{position:fixed;right:92px;bottom:37px;background:#111827;color:#fff;padding:8px 11px;border-radius:8px;font-size:11px;font-weight:900;z-index:60}
@media(max-width:900px){.topGrid{grid-template-columns:1fr 1fr}.calcHub{grid-column:1/-1;min-height:auto}.adviceCard,.regCard{min-height:500px}.scenarioTop{grid-template-columns:1fr}.scenarioImage{min-height:310px}.scenarioCopy{padding:27px}.scenarioImage .imageTitle{font-size:29px}}
@media(max-width:620px){.container{width:calc(100% - 20px)}.topbar{padding-top:12px}.campaignTag{display:none}.topGrid{grid-template-columns:1fr;gap:12px}.adviceCard{min-height:500px}.adviceContent{padding:28px 22px}.adviceContent h1{font-size:37px}.regCard{min-height:420px;padding:28px 20px}.calcHub{padding:18px}.calcTiles{gap:8px}.calcTile{min-height:135px}.calcTile img{min-height:135px}.calcTile span.title{font-size:14px}.scenarioArea{padding-bottom:22px}.scenarioPanel{border-radius:18px}.scenarioImage{min-height:255px}.scenarioImage .imageTitle{left:20px;right:20px;bottom:20px;font-size:27px}.scenarioCopy{padding:22px 20px}.scenarioCopy h2{font-size:27px}.calculatorForm{padding:23px 20px 25px}.calcFormHeader{display:block}.calcFormHeader .btn{margin-top:14px}.formGrid,.resultGrid{grid-template-columns:1fr}.resultValue{font-size:38px}.waFloat{right:14px;bottom:14px;width:56px;height:56px}.waLabel{display:none}}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

const WA_SVG = `<svg class="waSvg" viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" d="M19.11 17.34c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.76.95-.93 1.15-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.43-.85-.76-1.42-1.7-1.59-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.58-.9-2.16-.24-.57-.48-.5-.66-.51h-.56c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.49s1.06 2.89 1.21 3.09c.15.2 2.08 3.18 5.04 4.46.7.3 1.25.48 1.68.61.71.23 1.35.2 1.86.12.57-.09 1.72-.7 1.97-1.38.24-.68.24-1.27.17-1.38-.07-.12-.27-.19-.56-.34Z"/><path fill="#fff" d="M16.03 3.2c-7.08 0-12.83 5.75-12.83 12.83 0 2.26.59 4.47 1.72 6.42L3.09 28.8l6.5-1.7a12.77 12.77 0 0 0 6.44 1.73h.01c7.08 0 12.83-5.75 12.83-12.83S23.11 3.2 16.03 3.2Zm0 23.4h-.01a10.54 10.54 0 0 1-5.37-1.47l-.39-.23-3.86 1.01 1.03-3.76-.25-.39a10.58 10.58 0 1 1 8.85 4.84Z"/></svg>`;

function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function money(value){return new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(Math.max(0,Number(value)||0));}
function number(value,fallback=0){const n=Number(value);return Number.isFinite(n)?n:fallback;}

async function load(){
  if(!slug)return showError("Landing no disponible","El enlace de la campaña no es válido.");
  const landingResponse=await supabase.from("agent_landing_pages").select("*").eq("slug",slug).eq("active",true).single();
  if(landingResponse.error||!landingResponse.data)return showError("Landing no disponible",landingResponse.error?.message||"No encontramos esta página.");
  lp=landingResponse.data;
  const calculatorResponse=await supabase.from("calculator_configs").select("*").eq("active",true).order("sort_order");
  if(calculatorResponse.error)return showError("No pudimos cargar los escenarios",calculatorResponse.error.message);
  calculators=calculatorResponse.data||[];
  if(campaignId){
    const campaignResponse=await supabase.from("agent_campaigns").select("*, campaigns(*)").eq("id",campaignId).eq("active",true).single();
    if(!campaignResponse.error&&campaignResponse.data&&campaignResponse.data.user_id===lp.user_id){agentCampaign=campaignResponse.data;campaign=campaignResponse.data.campaigns;}
  }
  render();
}

function showError(title,message){root.innerHTML=`<main class="page"><div class="container" style="padding:70px 0"><div class="card" style="padding:30px"><div class="eyebrow">ProspectaPro</div><h1 style="font-size:40px;margin:8px 0 10px">${esc(title)}</h1><p style="color:#667085;line-height:1.6">${esc(message)}</p></div></div></main>`;}

function getScenarioMeta(calculator){
  const map={
    "Estudios Universitarios":{badge:"Educación y patrimonio",accent:"Construye desde hoy un escenario para el futuro educativo de tu familia.",title:"Educación Universitaria",image:educationImg,text:["La educación de tus hijos requiere algo más que ahorro: se construye con estrategia.","Existen esquemas que combinan inversión, beneficios fiscales, liquidez y crecimiento a largo plazo para lograr un resultado más eficiente.","Diseñamos un escenario que ayude a respaldar su futuro con una visión de largo plazo."]},
    "Retiro":{badge:"Patrimonio y futuro",accent:"Convierte tu meta de retiro en un escenario concreto.",title:"Plan para el Retiro",image:retirementImg,text:["Un plan de retiro bien estructurado combina ahorro, inversión y beneficios fiscales en una misma estrategia.","Te ayudamos a construir un escenario alineado a tus objetivos y dentro del marco fiscal vigente.","Explora cuánto podrías necesitar y cuál sería la brecha aproximada frente a tu ahorro actual."]},
    "Hombre Clave":{badge:"Continuidad empresarial",accent:"Protege el valor que una persona clave aporta al negocio.",title:"Hombre Clave",image:keymanImg,text:["Proteger el talento clave de tu empresa es una parte fundamental de tu estrategia financiera.","Analiza un escenario aproximado del impacto económico que puede representar una persona clave para la continuidad del negocio.","Utiliza el resultado como punto de partida para conversar con un asesor."]},
    "Fondo de Inversión":{badge:"Crecimiento patrimonial",accent:"Visualiza el potencial de tus aportaciones a largo plazo.",title:"Fondo de Inversión",image:investmentImg,text:["Explora cómo podrían crecer tus aportaciones con un horizonte de largo plazo.","El escenario considera una aportación inicial, aportaciones periódicas y una tasa anual estimada.","El resultado es ilustrativo y sirve como punto de partida para analizar alternativas reales."]}
  };
  return map[calculator.engine]||{badge:"Escenario financiero",accent:"Explora una estimación personalizada.",title:calculator.title,image:retirementImg,text:["Explora este escenario financiero y recibe una estimación ilustrativa."]};
}

function findCalc(engine){return calculators.find(c=>c.engine===engine)||calculators.find(c=>String(c.title||"").toLowerCase().includes(engine.toLowerCase()));}

function render(){
  const wa=(lp.whatsapp_number||"").replace(/\D/g,"");
  const waLink=wa?`https://wa.me/${wa}?text=${encodeURIComponent("Hola, quiero recibir orientación sobre los escenarios financieros.")}`:"";
  const heroTitle=lp.headline||"Asesorías personalizadas";
  const heroSub=lp.subheadline||"Para personas como tú";
  const welcome=lp.welcome_text||"Entendemos tu visión de éxito y analizamos tus necesidades financieras actuales y futuras según tu estilo de vida.";
  const calcDefs=[{engine:"Retiro",label:"Plan para el Retiro"},{engine:"Estudios Universitarios",label:"Educación universitaria"},{engine:"Hombre Clave",label:"Hombre Clave"},{engine:"Fondo de Inversión",label:"Fondo de inversión"}];
  const tiles=calcDefs.map(def=>{const c=findCalc(def.engine);if(!c)return "";const meta=getScenarioMeta(c);return `<article class="calcTile" data-id="${esc(c.id)}" role="button" tabindex="0"><img src="${meta.image}" alt="${esc(def.label)}"><span class="title">${esc(def.label)}</span><span class="waMini">${WA_SVG}</span></article>`;}).join("");

  root.innerHTML=`<div class="page">
    <header class="topbar"><div class="container topbarInner"><div class="brand">Prospecta<span>Pro</span></div><div class="campaignTag">${esc(campaign?.title||"Asesoría financiera personalizada")}</div></div></header>
    <main>
      <section class="container topGrid">
        <article class="card adviceCard"><div class="adviceContent"><h1>${esc(heroTitle)}</h1><h2>${esc(heroSub)}</h2><p>Entendemos tu visión de éxito.</p><p>${esc(welcome)}</p><p>Analizamos tus necesidades actuales y futuras para ayudarte a construir un plan realista con visión de largo plazo.</p>${campaign?.publication_text?`<p class="smallWhite">${esc(campaign.publication_text)}</p>`:""}</div></article>
        <article class="card regCard"><p class="regLead">Las estrategias que implementamos utilizan instrumentos autorizados y regulados por:</p><div class="regLogo"><div class="mark">◈</div><strong>CNBV</strong><small>COMISIÓN NACIONAL BANCARIA Y DE VALORES</small></div><div class="regLogo"><div class="mark">◫</div><strong>CNSF</strong><small>COMISIÓN NACIONAL DE SEGUROS Y FIANZAS</small></div><div class="regLogo"><strong style="font-size:31px">CONDUSEF</strong><small>COMISIÓN NACIONAL PARA LA PROTECCIÓN Y DEFENSA DE LOS USUARIOS DE SERVICIOS FINANCIEROS</small></div><div class="regFoot">La información de esta página es orientativa. La asesoría y contratación final dependen del análisis individual de cada persona.</div></article>
        <article class="card calcHub"><h2>Explora nuestros escenarios</h2><p class="calcHubIntro">Elige una alternativa para conocer su calculadora y recibir una estimación rápida.</p><div class="calcTiles">${tiles||`<div>No hay calculadoras publicadas.</div>`}</div></article>
      </section>
      <section class="container scenarioArea" id="calculatorArea"></section>
      <div class="container disclaimer">Los resultados de las calculadoras son estimaciones ilustrativas y no constituyen una cotización, oferta, recomendación ni asesoría financiera personalizada.</div>
    </main>
    <footer class="footer"><div class="container">ProspectaPro · Escenarios financieros · Información exclusivamente ilustrativa.</div></footer>
    ${waLink?`<a class="waLabel" href="${esc(waLink)}" target="_blank" rel="noopener">Habla por WhatsApp</a><a class="waFloat" href="${esc(waLink)}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA_SVG}</a>`:""}
  </div>`;

  document.querySelectorAll(".calcTile").forEach(card=>{card.addEventListener("click",()=>openCalc(card.dataset.id));card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openCalc(card.dataset.id);}});});
}

function openCalc(id){
  const calculator=calculators.find(c=>c.id===id);if(!calculator)return;
  const fields=Array.isArray(calculator.fields)?calculator.fields:[];const meta=getScenarioMeta(calculator);const area=document.getElementById("calculatorArea");
  const paragraphs=meta.text.map(t=>`<p>${esc(t)}</p>`).join("");
  area.innerHTML=`<div class="scenarioPanel" id="calculatorPanel">
    <div class="scenarioTop"><div class="scenarioImage"><img src="${meta.image}" alt="${esc(meta.title)}"><div class="imageTitle">${esc(meta.title)}</div></div><div class="scenarioCopy"><div class="eyebrow">${esc(meta.badge)}</div><h2>${esc(meta.title)}</h2>${paragraphs}<div class="scenarioCta">${esc(meta.accent)}</div></div></div>
    <div class="calculatorForm"><div class="calcFormHeader"><div><div class="eyebrow">CALCULADORA DE ESCENARIO</div><h3>Conoce tu estimación</h3><p>Captura algunos datos y obtén un resultado ilustrativo.</p></div><button class="btn btnGhost" id="closeCalc">Cerrar</button></div>
      <div class="formGrid">${fields.map(f=>`<div class="field"><label>${esc(f[0])}</label><input id="${esc(f[1])}" type="${esc(f[2]||"text")}" value="${esc(f[3]??"")}" placeholder="${esc(f[0])}" ${f[2]==="number"?'inputmode="decimal"':''}></div>`).join("")}</div>
      <div class="leadBox"><h4>Recibe tu escenario y orientación</h4><p>Déjanos tus datos para guardar el resultado y permitir que el asesor dé seguimiento.</p><div class="formGrid"><div class="field"><label>Nombre *</label><input id="p_name" placeholder="Tu nombre"></div><div class="field"><label>WhatsApp / teléfono *</label><input id="p_phone" inputmode="tel" placeholder="10 dígitos o con clave de país"></div><div class="field"><label>Correo</label><input id="p_email" type="email" placeholder="tu@correo.com"></div><div class="field"><label>Empresa (opcional)</label><input id="p_company" placeholder="Empresa"></div></div></div>
      <div class="btnRow"><button class="btn btnPink" id="calculate">Calcular mi escenario</button></div><div id="calcResult"></div>
    </div>
  </div>`;
  document.getElementById("closeCalc").onclick=()=>{area.innerHTML="";window.scrollTo({top:0,behavior:"smooth"});};
  document.getElementById("calculate").onclick=()=>calculate(calculator);
  area.scrollIntoView({behavior:"smooth",block:"start"});
}

function readFields(calculator){const output={};(Array.isArray(calculator.fields)?calculator.fields:[]).forEach(field=>{const el=document.getElementById(field[1]);output[field[1]]=el?el.value:null;});return output;}

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
  resultBox.innerHTML=`<div class="result"><div class="resultGrid"><div><div class="eyebrow">ESCENARIO ESTIMADO</div><div class="resultValue">${money(result.display)}</div><div style="color:#667085;font-size:12px;line-height:1.5">${esc(getScenarioMeta(calculator).accent)} El cálculo es ilustrativo.</div></div><div class="metricList">${(result.metrics||[]).map(([label,value])=>`<div class="metric"><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join("")}</div></div><div class="btnRow"><button class="btn btnDark" id="saveScenario">Guardar escenario y solicitar orientación</button></div></div>`;
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
