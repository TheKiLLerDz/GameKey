var db;

function opendb() {
	Dexie.exists('GameKey_DB').then(function (exists) {
		if (exists) {
			new Dexie('GameKey_DB').open()
				.then(function (d) {
					db = d;
					getdata();
				}).catch('NoSuchDatabaseError', function (e) {
					// Database with that name did not exist
					console.error("Database not found");
				}).catch(function (e) {
					console.error("Oh uh: " + e);
				});
		}
	})

}

function getdata() {
	getuplaybdd()
	getoriginbdd()
	getsteambdd()
}

function getsteambdd() {

	db.tables[1].toArray().then(el => {
		store.state.steam = el;
		store.state.steamkey = store.state.steam.filter((el) => {
			el.platform = 'Steam'
			return el.keys !== undefined;
		});
		document.getElementById('main').remove()
		v.$mount('#app')
	});

}

function getuplaybdd() {

	db.tables[2].toArray().then(el => {
		store.state.uplay = el;
		store.state.uplaykey = store.state.uplay.filter((el) => {
			el.platform = 'Uplay'
			return el.keys !== undefined;
		});


	})
}

function getoriginbdd() {

	db.tables[0].toArray().then(el => {
		store.state.origin = el;
		store.state.originkey = store.state.origin.filter((el) => {
			el.platform = 'Origin'
			return el.keys !== undefined;
		});



	})
}

function addkey(t, id, key) {


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



}


function delkey(t, id, key) {



	db.tables[t].where("appid").equals(id).modify(game => {

		if (game.keys.length > 1) {
			game.keys = game.keys.filter((el) => {
				return el.key !== key;
			});
		} else {
			delete game.keys
		}

	});


}




function delgamekeys(t, id) {



	db.tables[t].where("appid").equals(id).modify(game => {

		delete game.keys


	})
}


function editkey(t, id, okey, nkey) {



	db.tables[t].where("appid").equals(id).modify(game => {

		for (var i = 0; i < game.keys.length; i++) {
			if (game.keys[i].key == okey) {
				game.keys[i].key = nkey
				i = game.keys.length
			}

		}

	});


}

function getapp(t, idapp) {


	db.tables[t].get(idapp).then(game => {

		store.state.temp = game

	})
}