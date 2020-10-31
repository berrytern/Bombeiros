
const options=[]
const to=""
const api_key='AIzaSyB1MhfDz7x85UyTWQEqtAnKy_4aUwt2HDI'
const best=async(to)=>{
    to=to.split(' ').join('+');
    options.map(async i=>{
        const alter_i=i.split(' ').join('+');
        const req = new XMLHttpRequest()
        req.open("GET",`https://maps.googleapis.com/maps/api/directions/json?${alter_i}=Toronto&destination=${to}&key=${api_key}`)
        req.setRequestHeader()
    })
    
    return []
}
console.log(best(to))