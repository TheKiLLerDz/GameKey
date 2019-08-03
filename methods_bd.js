function getsteambdd() {
	Dexie.exists('GameKey_BDD').then(function (exists) {
		if (exists) {
			new Dexie('GameKey_BDD').open()
				.then(function (db) {
					db.tables[0].toArray().then(el => {
							store.state.steam = el;
							store.state.steamkey = store.state.steam.filter((el) => {
								el.platform = 'steam'
								return el.keys !== undefined;
							});
							v.$mount('#app')
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

function addkey(t, id, key) {

	new Dexie('GameKey_BDD').open()
		.then(function (db) {

			db.tables[t].where("appid").equals(id).modify(game => {
				if (game.keys == undefined) {
					game.keys = [{
						'key': key
					}];
				} else {
					game.keys.push({
						'key': key
					});
				}
			});

		}).catch('NoSuchDatabaseError', function (e) {
			// Database with that name did not exist
			console.error("Database not found");
		}).catch(function (e) {
			console.error("Oh uh: " + e);
		});

}


function delkey(t, id, key) {

	new Dexie('GameKey_BDD').open()
		.then(function (db) {

			db.tables[t].where("appid").equals(id).modify(game => {

				game.keys = game.keys.filter((el) => {
					return el.key !== key;
				});

			});

		}).catch('NoSuchDatabaseError', function (e) {
			// Database with that name did not exist
			console.error("Database not found");
		}).catch(function (e) {
			console.error("Oh uh: " + e);
		})
}
