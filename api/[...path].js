// AsierKey API: un solo archivo para /api/ping, /api/create, /api/start, /api/complete, /api/status
const crypto = require('crypto');

const DB_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const DB_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const OWN_WAIT = 15;   // segundos del checkpoint propio de AsierKey
const EXT_WAIT = 10;   // espera mínima al volver de Linkvertise/Lootlabs

const HOSTS = {
  linkvertise: ['linkvertise.com','link-to.net','direct-link.net','up-to-down.net','link-hub.net','link-target.net','link-center.net','link-depot.net','link-spot.net','link-place.net','file-link.net','filemedia.net'],
  lootlabs: ['loot-link.com','loot-links.com','lootlinks.co','lootdest.com','lootdest.org','lootdest.info','lootlabs.gg']
};

async function db(...cmd) {
  const r = await fetch(DB_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + DB_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d.result;
}

const rnd = n => crypto.randomBytes(n).toString('hex');
const okLink = (p, u) => {
  try {
    const x = new URL(u);
    if (x.protocol !== 'https:') return false;
