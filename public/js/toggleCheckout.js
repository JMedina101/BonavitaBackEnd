

// document.getElementById("other").addEventListener("click",function(){
//     
// });

// document.getElementById("street").addEventListener("click",function(){

//     hideContainer();
// })

var others = document.getElementById('other');
var street = document.getElementsByClassName('street');
var province = document.getElementById('province');
var notes = document.getElementById("notes");
var othersAddress = document.getElementById('others-address__container');

var noneValidate = document.getElementsByClassName('display');

function showContainer() {
    document.getElementById('others-address__container').style.display = 'block';
    province.style.display= 'none';
    notes.style.display = 'none';
    for(var i = 0; i < noneValidate.length; i++) {
        noneValidate[i].required =true;
    }
}
function hideContainer() {
    document.getElementById('others-address__container').style.display= 'none';
    province.style.display= 'block';
    notes.style.display = 'block';
    for(var i = 0; i < noneValidate.length; i++) {
        noneValidate[i].required =false;
    }
}


others.addEventListener("click",function(){
    showContainer();
});

for (var i = 0; i < street.length; i++) {
    street[i].addEventListener('click', function(){
        hideContainer();
    });
}
if (window.getComputedStyle(othersAddress)) {
    for(var i = 0; i < noneValidate.length; i++) {
        noneValidate[i].required =false;
    }
}
document.getElementById('others-address__container').style.display= 'none';
