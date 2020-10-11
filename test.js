const teste = 2;
var testevar = 3;
let testelet = 4;

//const teste=4;
//var testevar =  4;
//let testelet = 6;

console.log(`const=${teste}\nvar=${testevar}\nlet=${testelet}\n`);
//------------------------------------------------------
function exemplo() {
    console.log(x);
    for (var x = 0; x < 5; x++) {
        console.log(x);
    };
    console.log(x);
};
function exemplo2() {
    //console.log(x); //daria erro
    for (let x = 0; x < 5; x++ ) {
        console.log(x);
    };
    //console.log(x); //daria erro
}
exemplo();
console.log(" ");
exemplo2();