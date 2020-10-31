const { Op } = require("sequelize");
const db =require('.').sequelize;
const User=require('./user');
const Bomb=require('./bombeiro');
const UserBomb = require("./users_bomb");
const Call=require('./call');
const Report=require('./report');
//---------   -------
(async()=>await db.sync())();

const defaultUser = {
  email:"berrytern@gmail.com",
  code:Math.floor(Math.random(0,1)*999999),
  exp:Math.floor(Date.now()/1000+60*30)
};
const defaultBomb = {
  name:'Bombeiro',
  streetName:'Av. Brasil',
  streetNumber:'333',
  state:'Paraiba',
  city:'Campina Grande',
  latitude:3.442,
  longitude:-7.222,
  neighborhood:'Destrito',
  country:'BR',
  zipcode:'58400-600',
  fire:300,
  currentFire:300,
  rescue:300,
  currentRescue:300,
  salvage:300,
  currentSalvage:300,
};
let UserId;
let BombId;
let CallId;
(async()=>{
  await User.destroy({where: {
    email: {[Op.eq]:defaultUser.email}}})
  await Bomb.destroy({where: {
    streetNumber: {[Op.eq]:defaultBomb.streetNumber.toUpperCase()},
    streetName: {[Op.eq]:defaultBomb.streetName.toUpperCase()}
  }})
  //await UserBomb.destroy({where: {
  //  address: {[Op.is]: null}}})
})();

describe("Models: User", () => {
  test("Create User", async done => {
    User.create(defaultUser)
    .then((i)=>{UserId= i.id;done()})
    .catch(err=>done(err))
  });
  test("Get_all() User", async done => {
      User.findAll().then(()=>{
          done()
      }).catch(err=>done(err))
      });
});
describe("Models: Bomb", () => {

  it("Create Bomb", async done => {
    Bomb.create(defaultBomb)
    .then(i=>{BombId= i.id; done()})
    .catch(err=>done(err));
  });
  it("Get_all() Bomb", async done => {
    Bomb.findAll().then((doc)=>{
          done()
    }).catch(err=>done(err))
  });
});
describe("Models: UserBomb", () => {
  
  it("Create UserBomb", async done => {
      BombId=await Bomb.findOne({where:{streetName:{[Op.eq]:defaultBomb.streetName.toUpperCase()},streetNumber:{[Op.eq]:defaultBomb.streetNumber.toUpperCase()}}});
      UserId=await User.findOne({where:{email:{[Op.eq]:defaultUser.email}}});
      const defaultUserBomb={
        BombId:BombId.id,
        UserId:UserId.id,
      };
      UserBomb.create(defaultUserBomb).then(i=>{
        done()
      }).catch(err=>done(err))
  });
  it("Get_all() UserBomb", async done => {
    UserBomb.findAll().then((doc)=>{
      done()
    }).catch(err=>done(err))
  });
  test("Get() Bomb=>User", async done => {
    User.findOne({where: {
      email: {[Op.eq]:defaultUser.email}},
      include: Bomb
    }).then((doc)=>{
      //expect(doc.toJSON().Bombs.length>0).toBe(true);
      console.log(doc.Bombs)
      done()
    }).catch(err=>done(err))
  });
},);

/*describe("Models: Group", () => {
  
  it("Create Group", async done => {
      BombId=await Bomb.findOne({where:{streetName:{[Op.eq]:defaultBomb.streetName.toUpperCase()},streetNumber:{[Op.eq]:defaultBomb.streetNumber.toUpperCase()}}});
      const defaultGroup={
        fire:300,
        currentFire:300,
        rescue:300,
        currentRescue:300,
        salvage:300,
        currentSalvage:300,
        BombId:BombId.id,
    };
      Group.create(defaultGroup).then(i=>{
        done()
      }).catch(err=>done(err))
    
        
  });
  it("Get_all() Group", async done => {
    Group.findAll().then((doc)=>{
      done()
    }).catch(err=>done(err))
  })
});
*/
describe("Models: Calls", () => {
    
  it("Create Call", async done => {
    BombId=await Bomb.findOne({where:{streetName:{[Op.eq]:defaultBomb.streetName.toUpperCase()},streetNumber:{[Op.eq]:defaultBomb.streetNumber.toUpperCase()}}});
    const defaultCall={
      problem:"gatinho no telhado",
      type:'fire',
      latitude:3.442,
      longitude:-7.222,
      requirements:11,
      timeToEnd:60*10,
      streetName:'Manoel Alvez de Oliveira',
      streetNumber:'1027',
      city:'Campina Grande',
      priority:3
    };
    Call.create(defaultCall).then(i=>{
      done()
    }).catch(err=>done(err))
        
  });
  it("Get_all() Call", async done => {
    Call.findAll().then((doc)=>{
      done()
    }).catch(err=>done(err))
  })
});

describe("Models: Report", () => {
    
  /*it("Create Report", async done => {
    CallId=await Call.findOne({where:{status:{[Op.eq]:false}}});
    console.log(CallId.id)
    let defaultReport={
      origem:'2º Batalhão de Bombeiro Militar, Av. Prof. Almeida Barreto, 428 - São José, Campina Grande - PB, 58400-328',
      dest:'Av. Brasil, 152, campina grande',
      wayPoint:'cruzeiro, campina grande',
      time:[Math.floor(Date.now()/1000)-60*15,Math.floor(Date.now()/1000)],
      end:Math.floor(Date.now()/1000),
      CallId:CallId.id,
      BombId:BombId.id
    };
    Report.create(defaultReport).then(i=>{
      done()
    }).catch(err=>done(err))
  });*/
  it("Get_all() Report", async done => {
    Report.findAll({where:{BombId:{[Op.eq]:1}, end:{[Op.gt]:Math.floor(Date.now()/1000)}},raw: true}).then((doc)=>{
      done()
      let x=doc.map(i=>{return {...i,img:''}})
      console.log(Object.keys(x),x)
    }).catch(err=>done(err))
  })
});