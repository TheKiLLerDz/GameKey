 function getsteambdd() {
 	Dexie.exists('GameKey_BDD').then(function (exists) {
 		if (exists) {
 			new Dexie('GameKey_BDD').open()
 				.then(function (db) {
 					db.tables[0].toArray().then(el => {
 							store.state.steam = el;
 							store.state.steamkey = store.state.steam.filter((el) => {
 								return el.cles !== undefined;
 							});


 						}

 					);
 				}).catch('NoSuchDatabaseError', function (e) {
 					// Database with that name did not exist
 					console.error("Database not found");
 				}).catch(function (e) {
 					console.error("Oh uh: " + e);
 				});

 		}
 	})
 }

 function addkey(t, id, cle) {

 	new Dexie('GameKey_BDD').open()
 		.then(function (db) {

 			db.tables[t].where("appid").equals(id).modify(jeux => {
 				if (jeux.cles == undefined) {
 					jeux.cles = [{
 						'cle': cle
 					}];
 				} else {
 					jeux.cles[length + 1] = {
 						'cle': cle
 					};

 				}
 			});

 		}).catch('NoSuchDatabaseError', function (e) {
 			// Database with that name did not exist
 			console.error("Database not found");
 		}).catch(function (e) {
 			console.error("Oh uh: " + e);
 		});

 }


 function delkey(t, id, cle) {

 	new Dexie('GameKey_BDD').open()
 		.then(function (db) {

 			db.tables[t].where("appid").equals(id).modify(jeux => {

 				jeux.cles = jeux.cles.filter((el) => {
 					return el.cle !== cle;
 				});

 			});

 		}).catch('NoSuchDatabaseError', function (e) {
 			// Database with that name did not exist
 			console.error("Database not found");
 		}).catch(function (e) {
 			console.error("Oh uh: " + e);
 		});

 }