'use strict';
var keys = []
var key = [];
var tagname = [];

function impport() {
  const lineByLine = require('./readlines.js');
  const liner = new lineByLine('./text.txt');
  var linestr;
  var index;
  var word;
  let line;
  let lineNumber = 0;

  while (line = liner.next()) {
    linestr = line.toString('ascii');
    word = linestr.split(' ')
    if (validateKey(word[0])) {
      key.push(word[0])
      word = word.filter((el) => {
        return el !== word[0] & el !== '';
      })
      var tag = word.join(' ');
      tagname.push(tag)
    } else {
      index = word["length"] - 1
      key.push(word[index])
      word = word.filter((el) => {
        return el !== word[index] & el !== '';
      })
      var tag = word.join(' ');
      tagname.push(tag)
    }
    lineNumber++;
  }
  baseorxhr()
}

function validateKey(key) {
  // Pour vérifier j'ai utilisé pattern email

  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(key).toLowerCase());
}



function filtrer(tag, i) {
  var el = document.createElement('div');
  el.innerHTML = tag
  var l = el.getElementsByTagName('a').item(0)
  var appid = l.attributes[1].value
  addtokeys(appid, i)


}

function baseorxhr() {
  var i = 0;
  while (i < tagname.length) {
    var j = 0;
    var test = true
    while (j < store.state.steam.length & test) {
      if (tagname[i] == store.state.steam[j].name) {
        addtokeys(store.state.steam[j].appid, i)
        test = false;
      }
      j++
    }
  if (test) { sendData(i)  }

    i++

  }

  addtodb();
}


function addtokeys(appid, i) {
  keys.push({
    'key': key[i],
    'appid': appid
  })


}

function addtodb(){
console.log(keys)

}



// var promise =  