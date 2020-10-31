const {api}=require('../connection');
const consign =require('consign')
const {getLocation}=require('./location')
consign()
    .include('./config/parses.js')
    .then('./config/routes.js')
    .into(api)

describe('location',()=>{
    test('getLocation',async done=>{
        const defaultLocation="Prata, campina grande";
        getLocation(defaultLocation).then(res=>{
            expect(typeof(res.address)).toBe('string')
            done()
        }).catch(err=>done(err));
    })
})