const geocoder= require('node-geocoder')
const options={
 
    apiKey:'AIzaSyB1MhfDz7x85UyTWQEqtAnKy_4aUwt2HDI'
}
const geo=geocoder(options)
const getLocation=async(location)=>{
    //{"status":200,"address": "R. Baraúnas, 351 - Universitário, Campina Grande - PB, 58429-500, Brazil","latitude":-7.2088005,"longitude":-35.9173583,"neighborhood":"Universitário","country":'Brazil',"zipcode":'58429-501'};
        /*{
          formattedAddress: 'R. Baraúnas, 351 - Universitário, Campina Grande - PB, 58429-500, Brazil',
          latitude: ,
          longitude: ,
          extra: {
            googlePlaceId: 'ChIJzfZ2CFIerAcRhHQxnLSzUeg',
            confidence: 1,
            premise: null,
            subpremise: null,
            neighborhood: ,
            establishment: null
          },
          administrativeLevels: {
            level2long: 'Campina Grande',
            level2short: 'Campina Grande',
            level1long: 'Paraíba',
            level1short: 'PB'
          },
          streetNumber: '351',
          streetName: 'Rua Baraúnas',
          country: 'Brazil',
          countryCode: 'BR',
          zipcode: ,
          provider: 'google'
        }
      ]/**/
      return await geo.geocode(location).then(res=>{
        if(res.length==0){
            return {"status":400};
        }else{
            console.log(res);
            return {"status":200,"streetName": res[0]['streetName'],"streetNumber":res[0]['streetNumber'],"city":res[0]['administrativeLevels']['level2long'],"state":res[0]['administrativeLevels']['level1short'],"latitude":res[0]['latitude'],"longitude":res[0]['longitude'],"neighborhood":res[0]['extra']['neighborhood'],"country":res[0]['countryCode'],"zipcode":res[0]['zipcode']};
        }
        
    })
}

module.exports={getLocation}