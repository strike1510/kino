const dotenv = require('dotenv');
dotenv.config(); 

const bcrypt = require('bcrypt');
const userRepo = require(__dirname + "\\utils\\users.repository.js");

async function tryBcrypt(){
    let hash = await bcrypt.hash("wololo", 12);
    let first = await bcrypt.compare("wololoX", hash);
    let second = await bcrypt.compare("wololo", hash);
    console.log(hash);
    console.log(first);
    console.log(second);
}

async function setPassword(user, pass){
    let hash = await bcrypt.hash(pass, 13);
    let sql = "UPDATE users SET user_pass=? WHERE user_name=? "; 
    const [okPacket, fields] = await pool.execute(sql, [hash, user]); 
    console.log(`UPDATE ${user}: ` + JSON.stringify(okPacket));
}

tryBcrypt().then(async function(){
    console.log("WOLOLO");
    pool = require(__dirname + "\\utils\\db.include.js");
    await setPassword("bill", "billpass");
    await setPassword("joeuser", "joepass");
    await setPassword("joeadmin", "joepass");
    let sql = "SELECT * FROM users"; 
    const [rows, fields] = await pool.execute(sql);
    console.log(rows);

    let billUser = await userRepo.getOneUser("bill");
    let first = await userRepo.areValidCredentials("bill", "billpass");
    let second = await userRepo.areValidCredentials("bill", "BADPASS");
    console.log(first);
    console.log(second);
    process.exit();
});

