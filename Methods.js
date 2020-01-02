'use strict';

var keys;
var gamename;
var platform;
var pushplatform;

function PatternKeySteam(string) {
  var result = []
  const virtualkeypattern = /([\dA-Z]{5}\-){2}[\dA-Z]{5}/gi;
  const physicalkeypattern = /([\dA-Z]{5}\-){4}[\dA-Z]{5}/gi;
  result = result.concat(string.match(virtualkeypattern), string.match(physicalkeypattern)).filter(Boolean);
  if (result.length == 0) return null;
  else return result
}

function PatternKeyOrigin(string) {
  var result = []
  const keypattern1 = /MB-([\dA-Z]{16})/gi;
  const keypattern2 = /([\dA-Z]{4}\-){4}[\dA-Z]{4}/gi;
  result = result.concat(string.match(keypattern1), string.match(keypattern2)).filter(Boolean);
  if (result.length == 0) return null;
  else return result
}

function PatternKeyUplay(string) {
  var result = []
  const keypattern1 = /([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
  const keypattern2 = /[\dA-Z]{3}\-([\dA-Z]{4}\-){3}[\dA-Z]{4}/gi;
  result = result.concat(string.match(keypattern1), string.match(keypattern2)).filter(Boolean);
  if (result.length == 0) return null;
  else return result
}

function impport(Platform) {
  ipcRenderer.send('Path-request', Platform);
}

ipcRenderer.on('Path-reply', (event, Paths, Platform) => {
  if (Paths != undefined) {
    var indicSlash = Paths[0].lastIndexOf('\/');
    var extension = Paths[0].substring(indicSlash + 1).split(".");
    console.log(extension)
    extension[1] == 'txt' ? importtxt(Platform, Paths[0]) : extension[1] == 'xlsx' ? importxls(Platform, Paths[0]) : console.log("Format Not Supported")
  }
})

function gettab(platform) {
  switch (platform) {
    case 'Steam':
      return 2
    case 'Uplay':
      return 3
    case 'Origin':
      return 0
    case 'Other':
      return 1
  }
}

function getappid(item) {
  switch (item.platform) {
    case 'Steam':
      return parseInt(item.appid);
    case 'Other':
      return item.name.toLowerCase().replace(/\s/gi, '-');
    default:
      return item.appid;
  }
}

function filtrer(tag, i) {
  var el = document.createElement('div');
  el.innerHTML = tag
  var l = el.getElementsByTagName('a').item(0)
  var appid = l.attributes[1].value
  addtokeys(appid, i)
}

function addtokeys(appid, i) {
  keys.push({
    'key': key[i],
    'appid': appid
  })
}

function getindex(platform, name) {
  return platform.map(el => el.name.toLowerCase().replace(/\s/gi, '')).indexOf(name.toLowerCase().replace(/\s/gi, ''))
}

function importtxt(Platform, path) {
  var linestr;
  let line;
  let lineNumber = 1;
  const lineByLine = require('./readlines.js');
  const liner = new lineByLine(path);

  store.state.waitingdialog = true;
  setTimeout(() => {
    var promise = new Promise(function (resolve) {
      while (line = liner.next()) {
        linestr = line.toString('ascii');
        filters(Platform, linestr, lineNumber);
        lineNumber++;
      }
      resolve("success");
    });
    promise.then(
      function (result) {
        store.state.import = true;
        store.state.waitingdialog = false;
      })
  }, 2000)
}

function filters(Platform, linestr, lineNumber) {
  switch (Platform) {
    case 'Steam':
      keys = PatternKeySteam(linestr);
      platform = store.state.steam;
      pushplatform = store.state.steamkey;
      break;
    case 'Origin':
      keys = PatternKeyOrigin(linestr);
      platform = store.state.origin;
      pushplatform = store.state.originkey;
      break;
    case 'Uplay':
      keys = PatternKeyUplay(linestr);
      platform = store.state.uplay;
      pushplatform = store.state.uplaykey;
      break;
  }
  var obj = {
    line: lineNumber,
    name: '',
    keys: []
  }
  gamename = linestr;
  if (keys !== null) {
    for (var i = 0; i < keys.length; i++) {
      gamename = gamename.replace(keys[i], '');
      obj.keys.push({
        key: keys[i]
      })
    }
    obj.name = gamename.replace(/(\r\n|\n|\r)/gm, '').trim();
    var index = getindex(platform, obj.name)
    if (index != -1) {
      obj.name = platform[index].name;
      obj.appid = platform[index].appid;
      obj.platform = Platform;
      store.state.importedapps.push(obj);
    } else {
      obj.appid = '';
      obj.platform = Platform;
      store.state.importedapps.push(obj);
    }
  }
  lineNumber++;
}

function importxls(Platform, path) {
  const readXlsxFile = require('read-excel-file/node');
  readXlsxFile(path).then((rows) => {
    store.state.waitingdialog = true;
    setTimeout(() => {
      var promise = new Promise(function (resolve) {
        rows.forEach(function (el, index) {
          filters(Platform, el.join(' '), index + 1);
        });
        resolve("success");
      });
      promise.then(
        function (result) {
          store.state.import = true;
          store.state.waitingdialog = false;
        })
    }, 2000)
  })
}

function exportxlxs(platform) {
  ipcRenderer.send('Export-request', platform);
}

ipcRenderer.on('Export-reply', (event, path, platform) => {
  if (path != undefined) {
    var json2xls = require('json2xls');
    var fs = require('fs')
    var appskey = []
    platform.forEach(app => {
      app.keys.forEach(key => {
        appskey.push({
          Name: app.name,
          Key: key.key
        })
      })
    })

    fs.writeFileSync(path, json2xls(appskey, {
      fields: {
        Name: 'string',
        Key: 'string'
      }
    }), 'binary');
  }
})

function copyimg(url, to_url) {
  const fs = require('fs');
  fs.copyFile(url, to_url, (err) => {
    if (err) throw err;
    console.log("success")
  });
}

function deleteimg(path) {
  const fs = require('fs');
  try {
    fs.unlinkSync(path)
    console.log("success")
  } catch (err) {
    console.error(err)
  }
}