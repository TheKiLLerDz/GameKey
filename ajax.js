var tagsapp;
http = new XMLHttpRequest();

function tags(appid) {
  tagsapp = [];

  var url = 'https://steamspy.com/api.php?request=appdetails&appid=' + appid;
  // var params = "appid="+appid;
  http.open('GET', url);
  http.send()

  http.onload = function () {
    if (http.status == 200) {
      var obj = JSON.parse(http.responseText)
      console.log(obj)
      for (x in obj.tags) {
        tagsapp.push(x);
      }
    }
  }
}

function testAPI(resolve, reject) {
  var url = 'http://127.0.0.1:3000';
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
      // console.log(http.response); 
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
    resolve("success");
  }
}

function getnotification(oldversion) {

  http.open('POST', 'http://localhost:3000/notification', true)
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  http.send(JSON.stringify(oldversion))

  http.onload = function () {
    if (http.status == 200) {
      var obj = JSON.parse(http.response)
      store.state.updatedb = obj
    }
  }
}

function updateDB(oldversion) {
  http.open('POST', 'http://localhost:3000/updatedb', true)
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  http.send(JSON.stringify(oldversion))

  http.onload = function () {
    if (http.status == 200) {
      var obj = JSON.parse(http.response)
      store.state.updatedb = obj
      console.log(obj)
    }
  }
}