var data;
var localstorage;

function getUserData() {

}

function setUserData(username, password) {
    data.tables[0].put({
        username: username,
        password: password
    });
}

function CreateData() {
    Dexie.exists('DATA').then(async function (exists) {
        if (!exists) {
            var db = new Dexie('DATA');
            db.version(1).stores({
                Data: 'username,password',
            });
            db.open();
            data = db;
        } else {
            new Dexie('DATA').open().then(function (d) {
                data = d;
                if (!localstorage)
                    data.tables[0].toArray().then(el => {
                        console.log(el)
                        localStorage.username = el[0].username;
                        localStorage.password = el[0].password
                    })
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
                    let versionstr = JSON.stringify(versionjs);
                    localStorage.setItem('version', versionstr);
                    opendb();
                }

            })
        },
        function (error) {
            console.log('Check Your Connection! ')
        }
    )
}