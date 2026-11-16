import { createServer } from '/Users/ppetri/CascadeProjects/transfer-app/Science at risk/node_modules/vite/dist/node/index.js';
import fs from 'node:fs';
const root='/Users/ppetri/CascadeProjects/transfer-app/Science at risk';
const vite = await createServer({root,appType:'custom',server:{middlewareMode:true},logLevel:'error'});
const a = await vite.ssrLoadModule('/src/components/Auth/authCopy.ts');
const c = await vite.ssrLoadModule('/src/components/Cabinet/cabinetCopy.ts');
const strip=(o)=>JSON.parse(JSON.stringify(o,(k,v)=>typeof v==='function'?undefined:v));
fs.writeFileSync(process.argv[2],JSON.stringify({A:strip(a.authCopy),C:strip(c.cabinetCopy)},null,1));
await vite.close();
