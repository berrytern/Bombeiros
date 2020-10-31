const fetch = require('node-fetch')
b64toBlob = require('b64-to-blob');
let i=async()=>{
    let base64
    base64=await fetch(convert(`http://127.0.0.1:8000/?origem=${'PRATA, campina grade'}&dest=${'Mirante, campina grande'}`)).then(res => res.json()).then(body=>body[0])
    const blob = b64toBlob(base64);
    console.log(await blob)
}
let convert=(txt)=>encodeURI(txt).split(',').join('%2C')

i().catch(e=>console.log(e))