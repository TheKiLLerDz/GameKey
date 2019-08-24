'use strict';

function impport() {
const lineByLine = require('./readlines.js');
const liner = new lineByLine('./text.txt');
var linestr;
var index;
var word;
var tagname;
let line;
let lineNumber = 0;

while (line = liner.next()) {
   linestr = line.toString('ascii');
   word = linestr.split(' ')
   if (validateKey(word[0])) {
       console.log('key : ' + word[0])
       word = word.filter((el) => {
        return el !== word[0];})
       console.log('tagname : ' + word.join(' '))
       tagname = word.join(' ')
       sendData(tagname)
   }else {
       index = word["length"] - 1
       console.log('key : ' + word[index])
    word = word.filter((el) => {
        return el !== word[index];})
    console.log('tagname : ' + word.join(' '))

   }
    lineNumber++;
}

console.log('end of line reached');
}

function validateKey(key) {
    // Pour vérifier j'ai utilisé pattern email

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(key).toLowerCase());
}
function sendData(tagname,callback) {
     
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        // console.log(xhr.response); 
        filtrer(xhr.responseText)
      }
    }
  
    xhr.open('GET', 'https://store.steampowered.com/search/suggest?term=p&f=games&cc=DZ&l=french&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&v=6766867', true);
    xhr.send('');
    
  }
  
  function filtrer(tag) {
    var el = document.createElement('div');
    el.innerHTML = tag
   var l = el.getElementsByTagName('a').item(0)
  var appid=  l.attributes[1].value
    console.log(appid)


  }