import { getPayloadClient } from './src/lib/payload.ts'
const payload = await getPayloadClient()
const [media, heroes] = await Promise.all([
  payload.find({ collection:'media', limit:100, overrideAccess:true, depth:0 }),
  payload.find({ collection:'developers', limit:100, overrideAccess:true, depth:1 }),
])
console.log(JSON.stringify({media:media.docs.map(({id,alt,filename,url})=>({id,alt,filename,url})),heroes:heroes.docs.map(({id,name,slug,photo})=>({id,name,slug,photo:typeof photo==='object'&&photo?{id:photo.id,alt:photo.alt,url:photo.url}:photo}))}))
await payload.destroy()
