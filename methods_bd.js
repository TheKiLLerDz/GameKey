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
						document.getElementById('main').remove()
						v.$mount('#app')
					});
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

				if (game.keys.length > 1) {
				game.keys = game.keys.filter((el) => {
					return el.key !== key;
				});
				} else{
delete game.keys}

			});

		}).catch('NoSuchDatabaseError', function (e) {
			// Database with that name did not exist
			console.error("Database not found");
		}).catch(function (e) {
			console.error("Oh uh: " + e);
		})
}




function delgamekeys(t, id) {

	new Dexie('GameKey_BDD').open()
		.then(function (db) {

			db.tables[t].where("appid").equals(id).modify(game => {

				delete game.keys

		}).catch('NoSuchDatabaseError', function (e) {
			// Database with that name did not exist
			console.error("Database not found");
		}).catch(function (e) {
			console.error("Oh uh: " + e);
		})
})
}


function editkey(t, id, okey,nkey) {

	new Dexie('GameKey_BDD').open()
		.then(function (db) {

			db.tables[t].where("appid").equals(id).modify(game => {
  
				for (var i = 0; i < game.keys.length; i++) {
               if (game.keys[i].key == okey) {
				   game.keys[i].key = nkey
				   i = game.keys.length
			   }

				}

			});

		}).catch('NoSuchDatabaseError', function (e) {
			// Database with that name did not exist
			console.error("Database not found");
		}).catch(function (e) {
			console.error("Oh uh: " + e);
		})
}