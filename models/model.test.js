const { Op } = require("sequelize");
const db =require('.').sequelize;
const User=require('./user');
const Bomb=require('./bombeiro');
const UserBomb = require("./users_bomb");
const Group=require('./group');
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
  address:'Default',
  latitude:3.442,
  longitude:-7.222,
  neighborhood:'Destrito',
  country:'BR',
  zipcode:'58400-600'
};
let UserId;
let BombId;
let GroupId;
let CallId;
(async()=>{
  await User.destroy({where: {
    email: {[Op.eq]:defaultUser.email}}})
  await Bomb.destroy({where: {
    address: {[Op.eq]:defaultBomb.address}}})
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
  test("Get() Bomb=>User", async done => {
    User.findOne({
      include: Bomb
    }).then((doc)=>{
      //expect(doc.toJSON().Bombs.length>0).toBe(true);
      done()
    }).catch(err=>done(err))
  });
});
describe("Models: UserBomb", () => {
  
  it("Create UserBomb", async done => {
      BombId=await Bomb.findOne({where:{address:{[Op.eq]:defaultBomb.address}}});
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
  })
  },
);
describe("Models: Group", () => {
  
  it("Create Group", async done => {
      BombId=await Bomb.findOne({where:{address:{[Op.eq]:defaultBomb.address}}});
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

describe("Models: Calls", () => {
    
  it("Create Call", async done => {
    GroupId=await Group.findOne({where:{BombId:{[Op.eq]:BombId.id}}});
    const defaultCall={
      problem:"gatinho no telhado",
      type:'fire',
      requirements:11,
      timeToEnd:60*10,
      address:'Catolé, campina grande',
      priority:3,
      GroupId:GroupId.id,
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
    
  it("Create Report", async done => {
    CallId=await Call.findOne({where:{GroupId:{[Op.eq]:GroupId.id}}});
    console.log(CallId.id)
    const defaultReport={
      origem:'Default',
      dest:'Catolé, campina grande',
      wayPoint:'cruzeiro, campina grande',
      time:[Math.floor(Date.now()/1000)-60*15,Math.floor(Date.now()/1000)],
      CallId:CallId.id,
    };
    Report.create(defaultReport).then(i=>{
      done()
    }).catch(err=>done(err))
        
  });
  it("Get_all() Report", async done => {
    Report.findAll().then((doc)=>{
      done()
    }).catch(err=>done(err))
  })
});