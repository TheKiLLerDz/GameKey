function getsteambdd() {
	Dexie.exists('GameKey_BDD').then(function (exists) {
		if (exists) {
			new Dexie('GameKey_BDD').open()
				.then(function (db) {
					console.log("Database name: " + db.name);
					console.log("Database version: " + db.verno);
					db.tables[1].get(216938).then(s => {
							store.state.steam = s
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

function addsteamkey(t,id, cle) {

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


function delsteamkey(t,id, cle) {

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


