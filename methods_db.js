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
		} else CreateDB();
	})
}

function getdata() {
	getuplaybdd()
	getoriginbdd()
	getsteambdd()
	getothersbdd()
	getversiondb()
}

function ClearDB(resolve) {
	if (store.state.steamkey.length > 0) {
		store.state.steamkey.forEach(app => {
			delgametagskeys(2, app.appid);
		})
		store.state.steamkey = [];
	}
	if (store.state.uplaykey.length > 0) {
		store.state.uplaykey.forEach(app => {
			delgametagskeys(3, app.appid);
		})
		store.state.uplaykey = [];
	}
	if (store.state.originkey.length > 0) {
		store.state.originkey.forEach(app => {
			delgametagskeys(0, app.appid);
		})
		store.state.originkey = [];
	}
	if (store.state.otherskey.length > 0) {
		store.state.otherskey.forEach(app => {
			delgametagskeys(1, app.appid);
		})
		store.state.otherskey = [];
	}
	resolve("success")
}

function DBupdated(versions) {
	versions.app = JSON.parse(localStorage.getItem('version')).app;
	localStorage.setItem('version', JSON.stringify(versions));
	db.tables[4].where("id").equals(1).modify(d => {
		d.steam = versions.steam;
		d.origin = versions.origin;
		d.uplay = versions.uplay;
	});
	store.state.dbupdated = true;
}

function Appupdated(version) {
	db.tables[4].where("id").equals(1).modify(d => {
		d.app = version;
	});
}

function UpdateDB(Apps, resolve) {
	if (Apps.steam.length > 0)
		Apps.steam.forEach(app => {
			db.tables[2].put(app);
			store.state.steam.push(app);
		});
	if (Apps.origin.length > 0)
		Apps.origin.forEach(app => {
			db.tables[0].put(app);
			store.state.origin.push(app);
		});
	if (Apps.uplay.length > 0)
		Apps.uplay.forEach(app => {
			db.tables[3].put(app);
			store.state.uplay.push(app);
		});
	resolve("Updated")
}

function getversiondb() {

	db.tables[4].toArray().then(el => {
		store.state.updatedb = el[0];
		localStorage.setItem('version', JSON.stringify(el[0]));
		getnotification(el[0]);
	});

}

function getsteambdd() {

	db.tables[2].toArray().then(el => {
		store.state.steam = el;
		store.state.steamkey = el.filter((e) => {
			e.platform = 'Steam'
			return e.keys !== undefined;
		});
		v.Launch = true;
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