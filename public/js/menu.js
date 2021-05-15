
var Menu = document.getElementById("lists");
var MenuIcon = document.getElementById("menuIcon");

Menu.style.maxHeight="0px";

MenuIcon.addEventListener('click',function(){
  if(Menu.style.maxHeight == "0px"){
    Menu.style.maxHeight="1300px";
}
else{
    Menu.style.maxHeight="0px";
}
});

