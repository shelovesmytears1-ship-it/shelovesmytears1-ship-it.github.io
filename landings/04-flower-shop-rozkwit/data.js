/* ============================================================
   Rozkwit — product catalog + procedural bouquet illustrations
   ------------------------------------------------------------
   Visuals are handcrafted vector illustrations (an honest, modern
   florist choice — NOT stock photos, NOT abstract blobs).
   To swap for real photography later: replace bouquetSVG(p) usage
   with <picture> pointing at /images/<p.id>.webp (4:5 ratio).
   ============================================================ */

/* ---- seeded PRNG so each bouquet is stable across renders ---- */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- a single flower head ---- */
function flowerHead(cx, cy, r, spec, rnd) {
  const { petal, petalDark, center, type } = spec;
  let s = "";
  if (type === "ray") {
    // daisy / sunflower: thin radiating petals + round center
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.1;
      const px = cx + Math.cos(a) * r * 0.55;
      const py = cy + Math.sin(a) * r * 0.55;
      s += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r*0.5).toFixed(1)}" ry="${(r*0.16).toFixed(1)}" fill="${petal}" transform="rotate(${(a*180/Math.PI).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${(r*0.42).toFixed(1)}" fill="${center}"/>`;
  } else if (type === "tulip") {
    // three cupped petals
    s += `<path d="M${cx-r*0.7},${cy+r*0.4} Q${cx-r*0.8},${cy-r*0.9} ${cx},${cy-r} Q${cx+r*0.8},${cy-r*0.9} ${cx+r*0.7},${cy+r*0.4} Q${cx},${cy+r*0.9} ${cx-r*0.7},${cy+r*0.4}Z" fill="${petal}"/>`;
    s += `<path d="M${cx-r*0.5},${cy+r*0.2} Q${cx-r*0.55},${cy-r*0.7} ${cx},${cy-r*0.85} Q${cx+r*0.1},${cy-r*0.2} ${cx},${cy+r*0.4}Z" fill="${petalDark}" opacity=".5"/>`;
  } else {
    // bloom: layered rounded petals (rose / peony)
    const layers = [ [8, r], [7, r*0.72], [6, r*0.46] ];
    layers.forEach((L, li) => {
      const [count, rr] = L;
      const col = li === 0 ? petalDark : petal;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + li * 0.5;
        const px = cx + Math.cos(a) * rr * 0.5;
        const py = cy + Math.sin(a) * rr * 0.5;
        s += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(rr*0.42).toFixed(1)}" ry="${(rr*0.34).toFixed(1)}" fill="${col}" transform="rotate(${(a*180/Math.PI+90).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
      }
    });
    s += `<circle cx="${cx}" cy="${cy}" r="${(r*0.2).toFixed(1)}" fill="${center}"/>`;
  }
  return s;
}

/* ---- a leaf / greenery sprig ---- */
function leaf(cx, cy, len, ang, color) {
  return `<g transform="rotate(${ang} ${cx} ${cy})"><path d="M${cx},${cy} Q${cx-len*0.28},${cy-len*0.5} ${cx},${cy-len} Q${cx+len*0.28},${cy-len*0.5} ${cx},${cy}Z" fill="${color}"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-len}" stroke="${color}" stroke-width="1.4" opacity=".5"/></g>`;
}

/* ---- full bouquet SVG (viewBox 0 0 400 500) ---- */
function bouquetSVG(p) {
  const rnd = mulberry32(p.seed);
  const pal = p.palette;
  const greens = ["#4E7A4E", "#3E6740", "#628A55"];
  const cx0 = 200, cy0 = 215;

  // soft halo so the frame reads as one composition
  let svg = `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bukiet ${p.name}">`;
  svg += `<defs><radialGradient id="halo${p.seed}" cx="50%" cy="42%" r="60%"><stop offset="0%" stop-color="${pal.halo}"/><stop offset="100%" stop-color="${pal.bg}"/></radialGradient></defs>`;
  svg += `<rect width="400" height="500" fill="url(#halo${p.seed})"/>`;

  // stems gathered to a point (wrap apex)
  const apex = { x: 200, y: 430 };
  svg += `<g stroke-linecap="round">`;
  for (let i = 0; i < 7; i++) {
    const tx = 120 + i * 27 + (rnd() * 10 - 5);
    const ty = 235 + (rnd() * 20 - 10);
    svg += `<path d="M${apex.x},${apex.y} Q${(apex.x+tx)/2 + (rnd()*20-10)},${(apex.y+ty)/2} ${tx},${ty}" stroke="${greens[i%3]}" stroke-width="3.2" fill="none" opacity=".85"/>`;
  }
  svg += `</g>`;

  // greenery behind blooms
  for (let i = 0; i < 6; i++) {
    const a = -140 + i * 48 + rnd() * 20;
    const rad = 92 + rnd() * 18;
    const lx = cx0 + Math.cos(a * Math.PI/180) * rad;
    const ly = cy0 + Math.sin(a * Math.PI/180) * rad * 0.8;
    svg += leaf(lx, ly, 60 + rnd()*24, a + 90, greens[i%3]);
  }

  // blooms clustered in a rounded bunch
  const positions = [
    [200, 150, 1.15], [138, 200, 1.0], [262, 200, 1.0],
    [172, 250, 0.92], [232, 250, 0.92], [200, 210, 1.05],
    [110, 255, 0.72], [290, 255, 0.72],
  ];
  positions.forEach((pos, i) => {
    const [x, y, sc] = pos;
    const spec = pal.flowers[i % pal.flowers.length];
    svg += flowerHead(x, y, 38 * sc, spec, rnd);
  });

  // filler dots (gypsophila)
  for (let i = 0; i < 14; i++) {
    const x = 110 + rnd() * 180, y = 150 + rnd() * 120;
    svg += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3" fill="${pal.filler || '#FCF7EF'}" opacity=".9"/>`;
  }

  // kraft wrap cone
  svg += `<path d="M200,430 L112,470 Q200,452 288,470 Z" fill="${pal.wrap}"/>`;
  svg += `<path d="M200,430 L150,458 Q200,448 250,458 Z" fill="${pal.wrapDark}" opacity=".7"/>`;
  svg += `<path d="M112,470 Q200,452 288,470" stroke="${pal.wrapDark}" stroke-width="2" fill="none" opacity=".6"/>`;
  // ribbon
  svg += `<rect x="176" y="436" width="48" height="12" rx="6" fill="${pal.ribbon}"/>`;

  svg += `</svg>`;
  return svg;
}

/* ---- palettes ---- */
const P = {
  blushRose: { bg:"#FBF3EF", halo:"#F7E3DA", wrap:"#E8DCC8", wrapDark:"#CDBE9F", ribbon:"#E27D5A", filler:"#FFFDFB",
    flowers:[{type:"bloom",petal:"#F1B9C4",petalDark:"#E39AAB",center:"#E27D5A"},{type:"bloom",petal:"#F7D3D9",petalDark:"#EEB3BE",center:"#D98F6A"}] },
  amberSun: { bg:"#FBF6E9", halo:"#F6EAC6", wrap:"#E7D8BB", wrapDark:"#C9B487", ribbon:"#B9832F", filler:"#FFFBEF",
    flowers:[{type:"ray",petal:"#F2C14E",petalDark:"#E0A83A",center:"#6E4B2A"},{type:"bloom",petal:"#F6D785",petalDark:"#E9BE57",center:"#C58A2E"}] },
  deepRed: { bg:"#F7EEEA", halo:"#F0D9D2", wrap:"#DDCDB6", wrapDark:"#B9A585", ribbon:"#8C2F27", filler:"#FBEFE9",
    flowers:[{type:"bloom",petal:"#C23A34",petalDark:"#9E2A26",center:"#6E1A18"},{type:"bloom",petal:"#D65A50",petalDark:"#B23A32",center:"#7C201C"}] },
  wildMeadow: { bg:"#F5F5EC", halo:"#E7ECD6", wrap:"#DCD4BE", wrapDark:"#BBB08F", ribbon:"#6E8A54", filler:"#FCFBF2",
    flowers:[{type:"ray",petal:"#E8A0B8",petalDark:"#D482A0",center:"#E9C24E"},{type:"ray",petal:"#F0F0F0",petalDark:"#DCE0DA",center:"#E9C24E"},{type:"tulip",petal:"#C79BD6",petalDark:"#A97ABF",center:"#7E5B93"}] },
  whiteCream: { bg:"#FAF8F3", halo:"#F0ECE1", wrap:"#E4DAC4", wrapDark:"#C4B693", ribbon:"#9BAF8E", filler:"#FFFFFF",
    flowers:[{type:"bloom",petal:"#FBFAF6",petalDark:"#ECE8DC",center:"#D9C56E"},{type:"bloom",petal:"#F4F1E8",petalDark:"#E2DCC9",center:"#C9B45E"}] },
  lavender: { bg:"#F6F3F8", halo:"#E9E2F0", wrap:"#DDD6C6", wrapDark:"#BAB097", ribbon:"#7E5B93", filler:"#FCFBFE",
    flowers:[{type:"tulip",petal:"#B79AD6",petalDark:"#9A78BF",center:"#6E4E88"},{type:"bloom",petal:"#CDB6E0",petalDark:"#AF93CE",center:"#7E5B93"}] },
  pinkTulip: { bg:"#FBF2F4", halo:"#F6DEE4", wrap:"#E7DAC6", wrapDark:"#CBBB98", ribbon:"#E27D9A", filler:"#FFFDFE",
    flowers:[{type:"tulip",petal:"#EE9EB6",petalDark:"#DC7C9A",center:"#B8506E"},{type:"tulip",petal:"#F4C0CE",petalDark:"#E89CB0",center:"#C86A86"}] },
  peony: { bg:"#FBF1F1", halo:"#F6DCDE", wrap:"#E7D9C6", wrapDark:"#CBB998", ribbon:"#D06A7A", filler:"#FFFCFC",
    flowers:[{type:"bloom",petal:"#F3AEB8",petalDark:"#E88C9A",center:"#D06A7A"},{type:"bloom",petal:"#F8CDD2",petalDark:"#EFA9B2",center:"#DB8090"}] },
  sunnyMix: { bg:"#FBF7EC", halo:"#F5ECCF", wrap:"#E6D9BC", wrapDark:"#C7B589", ribbon:"#E0A83A", filler:"#FFFDF3",
    flowers:[{type:"ray",petal:"#F4CB55",petalDark:"#E4AF3C",center:"#7A5326"},{type:"bloom",petal:"#F6A65C",petalDark:"#E68843",center:"#B85E28"},{type:"ray",petal:"#FBFBF4",petalDark:"#E7E7DC",center:"#E4AF3C"}] },
  peachSoft: { bg:"#FCF4EE", halo:"#F8E3D5", wrap:"#E9DAC5", wrapDark:"#CDBB97", ribbon:"#E8956A", filler:"#FFFEFB",
    flowers:[{type:"bloom",petal:"#F6C3A2",petalDark:"#EDA47E",center:"#D9805A"},{type:"bloom",petal:"#FAD8C3",petalDark:"#F1B89E",center:"#E39A72"}] },
};

/* ---- catalog ---- */
const PRODUCTS = [
  { id:"poranna-rosa",    name:"Poranna Rosa",        price:129, seed:11, palette:P.blushRose,  occasions:["milosc","bez-okazji"],     color:"rozowe",     tag:"Bestseller", short:"Pudrowe róże i gipsówka — delikatny gest na dzień dobry." },
  { id:"zlota-godzina",   name:"Złota Godzina",       price:149, seed:22, palette:P.amberSun,   occasions:["urodziny","gratulacje"],   color:"zolte",      tag:"Nowość",     short:"Słoneczniki i bursztynowe kwiaty — ciepło późnego popołudnia." },
  { id:"rozany-zmierzch", name:"Różany Zmierzch",     price:189, seed:33, palette:P.deepRed,    occasions:["milosc"],                  color:"czerwone",   tag:null,         short:"Głęboka czerwień róż — klasyczne wyznanie bez słów." },
  { id:"polna-laka",      name:"Polna Łąka",          price:119, seed:44, palette:P.wildMeadow, occasions:["bez-okazji","urodziny"],    color:"mieszane",   tag:"Bestseller", short:"Polne kwiaty prosto z łąki — lekki, naturalny bukiet." },
  { id:"biala-elegancja", name:"Biała Elegancja",     price:169, seed:55, palette:P.whiteCream, occasions:["gratulacje","przeprosiny"], color:"biale",      tag:null,         short:"Kremowe piwonie i róże — czysta, spokojna elegancja." },
  { id:"lawendowe-pole",  name:"Lawendowe Pole",      price:139, seed:66, palette:P.lavender,   occasions:["bez-okazji","gratulacje"],  color:"fioletowe",  tag:null,         short:"Fiolet i lawenda — nastrój prowansalskiego pola." },
  { id:"wiosenne-tulipany",name:"Wiosenne Tulipany",  price:99,  seed:77, palette:P.pinkTulip,  occasions:["urodziny","milosc"],        color:"rozowe",     tag:"Cena dnia",  short:"Świeże tulipany — najprostszy sposób, by powiedzieć „myślę o Tobie”." },
  { id:"piwonie-marzen",  name:"Piwonie Marzeń",      price:209, seed:88, palette:P.peony,      occasions:["milosc","gratulacje"],      color:"rozowe",     tag:"Premium",    short:"Bujne piwonie — bukiet, który zapiera dech." },
  { id:"sloneczny-bukiet",name:"Słoneczny Bukiet",    price:129, seed:99, palette:P.sunnyMix,   occasions:["urodziny"],                 color:"zolte",      tag:null,         short:"Mix żółci i pomarańczy — dobra energia na urodziny." },
  { id:"delikatny-poranek",name:"Delikatny Poranek",  price:145, seed:12, palette:P.peachSoft,  occasions:["przeprosiny","milosc"],     color:"mieszane",   tag:null,         short:"Brzoskwiniowe róże — miękki, przepraszający ton." },
];

const OCCASIONS = [
  { id:"urodziny",    label:"Urodziny",    note:"Radosne, kolorowe bukiety" },
  { id:"milosc",      label:"Miłość",      note:"Róże, piwonie, czerwień" },
  { id:"gratulacje",  label:"Gratulacje",  note:"Eleganckie i jasne" },
  { id:"przeprosiny", label:"Przeprosiny", note:"Delikatne, szczere gesty" },
  { id:"bez-okazji",  label:"Bez okazji",  note:"Po prostu, żeby sprawić radość" },
];

const COLORS = [
  { id:"rozowe", label:"Różowe" }, { id:"czerwone", label:"Czerwone" },
  { id:"biale", label:"Białe" },   { id:"zolte", label:"Żółte" },
  { id:"fioletowe", label:"Fioletowe" }, { id:"mieszane", label:"Mieszane" },
];

const SIZES = [
  { id:"standardowy", label:"Standardowy", delta:0,  note:"ok. 15 łodyg" },
  { id:"okazaly",     label:"Okazały",     delta:40, note:"ok. 25 łodyg" },
  { id:"wielki",      label:"Wielki",      delta:90, note:"ok. 40 łodyg" },
];

function productById(id) { return PRODUCTS.find(p => p.id === id); }
function occasionLabel(id) { const o = OCCASIONS.find(o => o.id === id); return o ? o.label : id; }
function fmtPrice(zl) { return zl.toLocaleString("pl-PL") + " zł"; }
