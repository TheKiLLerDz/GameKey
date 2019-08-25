var tagsapp ;
xhr = new XMLHttpRequest();

function tags(appid) {
    tagsapp = [];


    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {

 ele = document.createElement('div')
ele.innerHTML = xhr.responseText
s = ele.getElementsByClassName('btn-tag')
var i = 0
while (i < s.length) {
tagsapp.push(s[i].innerHTML)
i++

}


      }
    }
  
    xhr.open('GET', 'https://steamdb.info/app/'+appid+'/');
    xhr.send('');
}


function sendData(i, callback) {

  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // console.log(xhr.response); 
        filtrer(xhr.responseText, i)
      }
    }
  
    xhr.open('GET', 'https://store.steampowered.com/search/suggest?term=p&f=games&cc=DZ&l=french&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&v=6766867', true);
    xhr.send('');
  
  }