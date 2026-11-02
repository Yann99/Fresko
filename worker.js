/** Mealora Recipe Import Worker — Cloudflare Workers (no API key required) */
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};
const reply = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});
function safeUrl(raw) {
  const u = new URL(raw);
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Seuls les liens HTTP et HTTPS sont acceptés.');
  const h = u.hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || h === '::1' || /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h)) throw new Error('Adresse privée refusée.');
  return u;
}
function findRecipe(value, seen=new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return null;
  seen.add(value);
  if (Array.isArray(value)) { for (const x of value) { const r=findRecipe(x,seen); if(r)return r; } return null; }
  const types=Array.isArray(value['@type'])?value['@type']:[value['@type']];
  if(types.some(x=>String(x||'').toLowerCase().split('/').pop()==='recipe')) return value;
  for(const k of ['@graph','mainEntity','mainEntityOfPage','itemListElement','hasPart','subjectOf']) { const r=findRecipe(value[k],seen); if(r)return r; }
  return null;
}
function stepsOf(v) {
  if(!v)return [];
  if(typeof v==='string')return v.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  if(Array.isArray(v))return v.flatMap(stepsOf);
  if(typeof v==='object') {
    if(v.text)return stepsOf(v.text);
    if(v.itemListElement)return stepsOf(v.itemListElement);
    if(v.name)return [String(v.name)];
  }
  return [];
}
function imageOf(v) { if(Array.isArray(v))return imageOf(v[0]); if(typeof v==='string')return v; if(v&&typeof v==='object')return v.url||v.contentUrl||''; return ''; }
export default {
 async fetch(request) {
  if(request.method==='OPTIONS')return new Response(null,{headers:cors});
  const here=new URL(request.url);
  if(here.pathname!=='/import')return reply({error:'Utilise le chemin /import?url=https://…'},404);
  const raw=here.searchParams.get('url'); if(!raw)return reply({error:'Paramètre url manquant.'},400);
  let target; try{target=safeUrl(raw)}catch(e){return reply({error:e.message},400)}
  try {
   const upstream=await fetch(target.href,{redirect:'follow',headers:{'User-Agent':'Mozilla/5.0 (compatible; MealoraRecipeImporter/1.0)','Accept':'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8'},cf:{cacheTtl:0}});
   if(!upstream.ok)return reply({error:`Le site source a répondu HTTP ${upstream.status}.`},502);
   const html=await upstream.text(); if(html.length>5_000_000)return reply({error:'La page est trop volumineuse.'},413);
   const scripts=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
   let recipe=null;
   for(const m of scripts){try{recipe=findRecipe(JSON.parse(m[1].replace(/&quot;/g,'"').trim()));if(recipe)break}catch{}}
   if(!recipe)return reply({error:'Aucune fiche recette structurée trouvée sur cette page.',html:html.slice(0,1_500_000)});
   const ingredients=Array.isArray(recipe.recipeIngredient)?recipe.recipeIngredient.map(x=>String(x).trim()).filter(Boolean):[];
   const steps=stepsOf(recipe.recipeInstructions);
   if(!ingredients.length||!steps.length)return reply({error:'La page contient une fiche recette, mais les ingrédients ou les étapes sont incomplets.',recipe:{name:recipe.name||'',ingredients,steps}});
   return reply({recipe:{name:String(recipe.name||''),ingredients,steps,totalTime:recipe.totalTime||recipe.cookTime||recipe.prepTime||'',category:Array.isArray(recipe.recipeCategory)?recipe.recipeCategory.join(', '):(recipe.recipeCategory||recipe.recipeCuisine||''),image:imageOf(recipe.image),yield:recipe.recipeYield||''}});
  } catch(e) { return reply({error:'Impossible de lire cette page : '+String(e.message||e)},502); }
 }
};
