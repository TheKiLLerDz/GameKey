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
	getothersbdd()

}

function getsteambdd() {

	db.tables[2].toArray().then(el => {
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

	db.tables[3].toArray().then(el => {
		store.state.uplay = el;
		store.state.uplaykey = store.state.uplay.filter((el) => {
			el.platform = 'Uplay'
			return el.keys !== undefined;
		});


	})
}
function getothersbdd() {

	db.tables[1].toArray().then(el => {

		store.state.others = el
		store.state.others = el.filter((el) => {
			el.platform = 'Other'
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

function addkey(t, appidorname, key) {
	if (t != 1 || typeof appidorname == "number") {
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
	}else {
		game = store.state.others.filter(el => {
			return el.name == appidorname
		})
			if (game.length == 0) {
				addappkey(t,appidorname,key)
			}else {
				addkey(t,game[0].appid,key)
			}
	
		
	}
}
function addappkey(t,appidorname,key) {
	var obj = {name : appidorname, keys : [{key: key}]}
				db.tables[t].put(obj);
}
function addtag(t,appid,tag) {
	db.tables[t].where("appid").equals(appid).modify(game => {
		if (game.tags == undefined) {
			game.tags = [
				tag
			];
		} else {
			game.tags.push(tag);
		}
	});
	
}

var dellapp = false
var appid;

function delkey(t, appid, key) {

	

	db.tables[t].where("appid").equals(appid).modify(game => {

		if (game.keys.length > 1) {
			game.keys = game.keys.filter((el) => {
				return el.key !== key;
			});
		} else {
			if (t != 1) {
			delete game.keys }
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