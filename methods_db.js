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
	getnotification(JSON.parse(localStorage.getItem("version")))
	getuplaybdd()
	getoriginbdd()
	getsteambdd()
	getothersbdd()

}

function getsteambdd() {

	db.tables[2].toArray().then(el => {
		store.state.steam = el;
		store.state.steamkey = el.filter((e) => {
			e.platform = 'Steam'
			return e.keys !== undefined;
		});
		v.Launch=true;
	});

}

function getuplaybdd() {

	db.tables[3].toArray().then(el => {
		store.state.uplay = el;
		store.state.uplaykey = el.filter((e) => {
			e.platform = 'Uplay'
			return e.keys !== undefined;
		});
	})
}

function getoriginbdd() {

	db.tables[0].toArray().then(el => {
		store.state.origin = el;
		store.state.originkey = el.filter((e) => {
			e.platform = 'Origin'
			return e.keys !== undefined;
		});
	})
}

function getothersbdd() {

	db.tables[1].toArray().then(el => {
		store.state.others = el;
		store.state.otherskey = el.filter((e) => {
			e.platform = 'Other'
			return e.keys !== undefined;
		});
	})
}

function deltradeorbeta(t, appid, key, tradedorbeta) {
	db.tables[t].where('appid').equals(appid).modify(game => {
		for (var i = 0; i < game.keys.length; i++) {
			if (game.keys[i].key == key) {
				tradedorbeta == 'beta' ? delete game.keys[i].beta : delete game.keys[i].trade
			}
		}
	})
}

function addtradeorbeta(t, appid, key, tradedorbeta) {
	db.tables[t].where('appid').equals(appid).modify(game => {
		for (var i = 0; i < game.keys.length; i++) {
			if (game.keys[i].key == key) {
				game.keys[i] = Object.assign(game.keys[i], tradedorbeta);
			}
		}
	})
}

function addkey(t, appidorname, key) {
	if (typeof appidorname != "object") {
		existorno(t, appidorname, key)
		if (!exist) {
			db.tables[t].where("appid").equals(appidorname).modify(game => {

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
	} else {
		game = store.state.others.filter(el => {
			return el.name == appidorname.name
		})
		if (game.length == 0) {
			if (!existorno(t, appidorname, key)) {
				addappkey(t, appidorname, key)

				store.state.others.push({
					appid: appidorname.appid,
					name: appidorname.name,
					platform: 'Other'
				})
			}
		} else {
			addkey(t, game[0].appid, key)
		}


	}
}

function addappkey(t, appidandname, key) {
	var obj = {
		appid: appidandname.appid,
		name: appidandname.name,
		keys: [{
			key: key
		}]
	}
	db.tables[t].put(obj);
}

function updatetags(t, appid, tags) {
	db.tables[t].where("appid").equals(appid).modify(game => {
		game.tags = tags
	});

}



function delkey(t, appid, key) {



	db.tables[t].where("appid").equals(appid).modify(game => {

		if (game.keys.length > 1) {
			game.keys = game.keys.filter((el) => {
				return el.key !== key;
			});
		} else {
			delete game.keys
		}

	});


}




function delgametagskeys(t, appid) {



	db.tables[t].where("appid").equals(appid).modify(game => {

		delete game.keys
		delete game.tags


	})
}


function editkey(t, appid, okey, nkey) {



	db.tables[t].where("appid").equals(appid).modify(game => {

		for (var i = 0; i < game.keys.length; i++) {
			if (game.keys[i].key == okey) {
				game.keys[i].key = nkey
				i = game.keys.length
			}

		}

	});


}

function getappid(t, name) {
	db.tables[t].where('name').equals(name).modify(game => {

		return game.name

	})
}

function getapp(t, idapp) {


	db.tables[t].get(idapp).then(game => {

		store.state.temp = game

	})
}

function testappname(t, i) {

	db.tables[t].where("name").equals(tagname[i]).modify(game => {
		if (game != undefined) {
			addtokeys(game.appid, i)
			tagname = tagname.filter(el => {
				return el != tagname[i]

			})
		}
	})




}
var exist

function existorno(t, appid, key) {

	db.tables[t].where("appid").equals(appid).each(game => {


		var i = 0;
		exist = false;
		while (i < game.keys.length & !exist & game.keys != undefined) {
			if (game.keys[i].key == key) {

				exist = true
			}
			i++
		}

	});

}