Dexie.exists('GameKey_DB').then(async function (exists) {
    if (!exists) {
        var db = new Dexie('GameKey_DB');
        db.version(1).stores({
            steam: 'appid,name',
            origin: 'appid,name',
            uplay: 'appid,name',
            others : 'appid,name',
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
        localStorage.setItem('version',versionstr);
        opendb();
    }

})