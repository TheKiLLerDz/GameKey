var tagsapp;
http = new XMLHttpRequest();

var App = {
  website: "https://gamekeyapp.com",
  Facebook: "https://www.facebook.com/gamekeyapp",
  Twitter: "https://www.twitter.com/gamekeyapp",
  Instagram: "https://www.instagram.com/gamekeyapp",
  Patreon: "https://www.patreon.com/GameKeyApp",
  OpenCollective: "https://opencollective.com/gamekeyapp",
  Donations: "https://gamekeyapp.com/#donations",
  Paypal: "https://gamekeyapp.com/paypal",
  Steam: "https://steamcommunity.com/groups/GameKeyApp",
};

function tags(appid) {
  tagsapp = [];
  var url = 'https://steamspy.com/api.php?request=appdetails&appid=' + appid;
  http.open('GET', url);
  http.send()

  http.onload = function () {
    if (http.status == 200) {
      var obj = JSON.parse(http.responseText)
      for (x in obj.tags) {
        tagsapp.push(x);
      }
    }
  }
}

function send_data(email, key, resolve, reject) {
  http.open('POST', App.website + '/signup', true)
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  json = {
    "email": email,
    "key": key
  }
  http.send(JSON.stringify(json))

  http.onload = function () {
    resolve(JSON.parse(http.response).emailhash);
  };

  http.onerror = function () {
    reject("error");
  };
}

function GetTerms(resolve, reject) {
  http.open('POST', App.website + '/terms', true);
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  http.send('')

  http.onload = function () {
    resolve(JSON.parse(http.response));
  };

  http.onerror = function () {
    reject("error");
  };
}

function UpdateSvDataPw(email, Key, userid) {
  http.open('POST', App.website + '/updatePw', true)
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  json = {
    "email": email,
    "key": Key,
    "userid": userid
  }
  http.send(JSON.stringify(json));

  http.onload = function () {
    SetnotSynced('');
  };

  http.onerror = function () {
    SetnotSynced('true');
  };
}

function ForgotPwd(email, userid, resolve, reject) {
  http.open('POST', App.website + '/forgotpass', true)
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  json = {
    "email": email,
    "userid": userid
  }
  http.send(JSON.stringify(json))

  http.onload = function () {
    resolve(JSON.parse(http.response));
  };

  http.onerror = function () {
    reject("error");
  };

}

function testAPI(resolve, reject) {
  var url = App.website;
  http.open('GET', url);
  http.send();

  http.onload = function () {
    resolve("success");
  };

  http.onerror = function () {
    reject("error");
  };

  http.onprogress = function (event) {
    console.log(`Received ${event.loaded} of ${event.total}`)
  };
}

function sendData(i, callback) {

  http.onreadystatechange = function () {
    if (http.readyState === 4) {
      filtrer(http.responseText, i)
    }
  }

  http.open('GET', 'https://store.steampowered.com/search/suggest?term=p&f=games&cc=DZ&l=french&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&v=6766867', true);
  http.send('');

}
var infoapp = {
  Developer: 'Undefined',
  Publisher: 'Undefined',
  Genre: '',
  Price: '0'
};

function getinfo(item, resolve, reject) {
  if (item.platform == 'Steam') {
    var url = 'https://steamspy.com/api.php?request=appdetails&appid=' + item.appid;
    http.open('GET', url);
    http.send();
    http.onload = function () {
      if (http.status == 200) {
        var obj = JSON.parse(http.responseText);
        store.state.moreinfo = {
          Developer: obj.developer,
          Publisher: obj.publisher,
          Genre: obj.genre,
          Price: obj.price / 100
        };
        resolve("success");
      } else reject("error");
    }
  } else {
    store.state.moreinfo = {
      Developer: 'Undefined',
      Publisher: 'Undefined',
      Genre: '',
      Price: '0'
    };
    resolve("success");
  }
}

function getnotification(oldversion) {
  http.open('POST', App.website + '/notification', true);
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  http.send(JSON.parse(JSON.stringify(oldversion)));

  http.onload = function () {
    store.state.updatedb = JSON.parse(http.response);
  };

  http.onerror = function () {
    console.log("error");
  };

}

function updateDB(oldversion) {
  http.open('POST', App.website + '/updatedb', true);
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  http.send(JSON.parse(JSON.stringify(oldversion)));

  http.onload = function () {
    var promise = new Promise(function (resolve) {
      obj = JSON.parse(http.response);
      UpdateDB({
        steam: obj.steam.apps,
        origin: obj.origin.apps,
        uplay: obj.uplay.apps
      }, resolve);
    });
    promise.then(
      function (result) {
        DBupdated({
          steam: obj.steam.version.toString(),
          origin: obj.origin.version.toString(),
          uplay: obj.uplay.version.toString()
        });
      }
    )
  }
}