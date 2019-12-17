var data;

new Dexie('DATA').open().then(function (d) {
    data = d;
})

function setUserData(username, email, avatar) {
    data.tables[0].where("id").equals(1).modify(d => {
        d.username = username;
        d.email = email;
        d.avatar = avatar;
    });
    console.log("account eddited successfully")
}

function addUserData(username, email, avatar, password) {
    data.tables[0].put({
        username: username,
        email: email,
        avatar: avatar,
        password: password
    })
    console.log("account added to db successfully")
}

function UpdatePW(username, password) {
    data.tables[0].where("id").equals(1).modify(d => {
        d.password = password
    });
    console.log("PW Updated Successfully")
}

function getUserData(resolve, reject) {
    Dexie.exists('DATA').then(async function (exists) {
        if (!exists) {
            var db = new Dexie('DATA');
            db.version(1).stores({
                Data: 'id++,username,email,avatar,password',
            });
            db.open();
            data = db;
            reject("DB Was Just Created");
        } else {
            new Dexie('DATA').open().then(function (d) {
                data = d;
                data.tables[0].toArray().then(el => {
                    if (el.length > 0) {
                        localStorage.username = el[0].username;
                        localStorage.email = el[0].email;
                        localStorage.avatar = el[0].avatar;
                        localStorage.password = el[0].password;
                        resolve("success");
                    } else reject("account not created yet")
                });
            });
        }
    })
}

function CreateDB() {
    var promise1 = new Promise(function (resolve, reject) {
        testAPI(resolve, reject);
    });
    promise1.then(
        function (result) {
            Dexie.exists('GameKey_DB').then(async function (exists) {
                if (!exists) {
                    var db = new Dexie('GameKey_DB');
                    db.version(1).stores({
                        steam: 'appid,name',
                        origin: 'appid,name',
                        uplay: 'appid,name',
                        others: 'appid,name',
                        versions: 'app,origin,steam,uplay'
                    });
                    db.open();
                    const steam = await fetch(
                        'http://127.0.0.1:3000/steamdb.json');
                    const steamjs = await steam.json();
                    db.steam.bulkPut(steamjs.applist);

                    const origin = await fetch(
                        'http://127.0.0.1:3000/origindb.json');
                    const originjs = await origin.json();
                    db.origin.bulkPut(originjs.applist);

                    const uplay = await fetch(
                        'http://127.0.0.1:3000/uplaydb.json');
                    const uplayjs = await uplay.json();
                    db.uplay.bulkPut(uplayjs.applist);

                    const version = await fetch(
                        'http://127.0.0.1:3000/version.json');
                    const versionjs = await version.json();
                    console.log(versionjs);
                    db.versions.put(versionjs);
                }
                opendb();
            })
        },
        function (error) {
            console.log('Check Your Connection! ');
            store.state.checkconnection = true;
        }
    )
}