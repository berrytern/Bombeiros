D=(dist,tempo,urg=1)=>{
    if(urg==1 || urg==2){
        return ((dist/27)+(tempo/20))/3
    }else{
        return (tempo/20)/3
    }
}
F=(km,min,ocup=0,urg=1)=>{
    if(urg==1){
        return (D(km,min,urg)*2)+(ocup/9)
    }if(urg==2){
        return (D(km,min,urg)*2)+(ocup/11)
    }if(urg==3){
        return (D(km,min,urg)*2)+(ocup/14)
    }if(urg==4){
        return (D(km,min,urg)*2)
    }
}
console.log(F(13.6,31,0.1,1)<F(13.8,29,0.1,1))