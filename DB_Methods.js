var db, data;

new Dexie('DATA').open().then(function (d) {
	data = d;
})

function setUserData(username, email) {
	data.tables[0].where("id").equals(1).modify(d => {
		d.username = username;
		d.email = email;
	});
}

function setavatar(avatar) {
	data.tables[0].where("id").equals(1).modify(d => {
		d.avatar = avatar;
	});
}

function addUserData(username, email, avatar, password) {
	data.tables[0].put({
		username: username,
		email: email,
		avatar: avatar,
		password: password
	})
}

function UpdatePW(username, password) {
	data.tables[0].where("id").equals(1).modify(d => {
		d.password = password
	});
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
						versions: 'id++,app,origin,steam,uplay'
					});
					db.open();
					const steam = await fetch(
						store.state.App.website + '/steamdb.json');
					const steamjs = await steam.json();
					db.steam.bulkPut(steamjs.applist);

					const origin = await fetch(
						store.state.App.website + '/origindb.json');
					const originjs = await origin.json();
					db.origin.bulkPut(originjs.applist);

					const uplay = await fetch(
						store.state.App.website + '/uplaydb.json');
					const uplayjs = await uplay.json();
					db.uplay.bulkPut(uplayjs.applist);

					const version = await fetch(
						store.state.App.website + '/version.json');
					const versionjs = await version.json();
					versionjs.app = store.state.App.version;
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
	getSteamDB()
	getUplayDB()
	getOriginDB()
	getOthersDB()
	getVersionDB()
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

function getVersionDB() {
	db.tables[4].toArray().then(el => {
		store.state.updatedb = el[0];
		localStorage.setItem('version', JSON.stringify(el[0]));
		getnotification(JSON.stringify(el[0]));
	});

}

function getSteamDB() {
	db.tables[2].toArray().then(el => {
		store.state.steam = el;
		store.state.steamkey = el.filter((e) => {
			e.platform = 'Steam'
			return e.keys !== undefined;
		});
		v.Launch = true;
	});
}

function getUplayDB() {
	db.tables[3].toArray().then(el => {
		store.state.uplay = el;
		store.state.uplaykey = el.filter((e) => {
			e.platform = 'Uplay'
			return e.keys !== undefined;
		});
	})
}

function getOriginDB() {
	db.tables[0].toArray().then(el => {
		store.state.origin = el;
		store.state.originkey = el.filter((e) => {
			e.platform = 'Origin'
			return e.keys !== undefined;
		});
	})
}

function getOthersDB() {
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

function addkey(t, appid, key) {
	if (typeof t != 'string') {
		db.tables[t].where("appid").equals(appid).modify(game => {
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
	} else {
		index = store.state.others.map(e => e.appid).indexOf(appid);
		if (index == -1) {
			db.tables[1].put({
				appid: appid,
				name: t,
				keys: [{
					key: key
				}]
			});
			store.state.others.push({
				appid: appid,
				name: t,
				platform: 'Other'
			})
		} else {
			db.tables[1].where("appid").equals(appid).modify(game => {
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
	}
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