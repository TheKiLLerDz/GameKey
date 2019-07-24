var info;
Dexie.exists('GameKey_BDD').then(function (exists) {
	if (exists) {
		new Dexie('GameKey_BDD').open()
			.then(function (db) {
				console.log("Database name: " + db.name);
				console.log("Database version: " + db.verno);
				db.tables[1].get(1).then(s => {
						console.log(s.applist)
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