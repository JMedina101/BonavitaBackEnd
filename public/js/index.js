

var errorMessage = document.getElementById('message');
var orderBtn = document.getElementsByClassName('ordenagainbtn');


var slideIndex = 1;
var myTimer;
var slideshowContainer;

window.addEventListener("load",function() {
    showSlides(slideIndex);
    myTimer = setInterval(function(){plusSlides(1)}, 4000);
})

function plusSlides(n){
  clearInterval(myTimer);
  if (n < 0){
    showSlides(slideIndex -= 1);
  } else {
   showSlides(slideIndex += 1); 
  }  
  if (n === -1){
    myTimer = setInterval(function(){plusSlides(n + 2)}, 4000);
  } else {
    myTimer = setInterval(function(){plusSlides(n + 1)}, 4000);
  }
}

function currentSlide(n){
  clearInterval(myTimer);
  myTimer = setInterval(function(){plusSlides(n + 1)}, 4000);
  showSlides(slideIndex = n);
}

function showSlides(n){
  var i;
  var slides = document.getElementsByClassName("slides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

//for feedback slideshow
var slideIndex = 1;
var slideshowContainer;

window.addEventListener("load",function() {
    showSlidesVid(slideIndex);
})

function plusSlidesVid(n){
  if (n < 0){
    showSlidesVid(slideIndex -= 1);
  } else {
   showSlidesVid(slideIndex += 1); 
  }  
}

function currentSlideVid(n){
  showSlidesVid(slideIndex = n);
}

function showSlidesVid(n){
  var i;
  var slides = document.getElementsByClassName("slides-vid");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}


//modal 
var modalBtns = document.querySelectorAll('.modal-open');
modalBtns.forEach(function(btn){
  btn.onclick = function(){
    var modal = btn.getAttribute('data-modal');

    document.getElementById(modal).style.display = "block";
  };
});

var closeBtns = document.querySelectorAll('.modal-close');

closeBtns.forEach(function(btn){
  btn.onclick = function(){
    var modal = (btn.closest(".modal").style.display = "none");
  };
});

window.onclick = function(e){
  if(e.target.className == 'modal'){
    e.target.style.display = 'none';
  }
};
///////////////
const addCartbtn = document.getElementsByClassName('add-cart');
const products = []
for(var i = 0; i < addCartbtn.length; i++){
  let cartBtn = addCartbtn[i]
  cartBtn.addEventListener('click', () =>{
    let product = {
     
      image: event.target.parentElement.parentElement.parentElement.children[0].children[0].src,
      name: event.target.parentElement.parentElement.parentElement.children[0].children[1].textContent, 
      price: event.target.parentElement.parentElement.parentElement.children[0].children[3].textContent,
      totalPrice: parseFloat(event.target.parentElement.parentElement.parentElement.children[0].children[3].textContent),
      quantity: 1
    }
    addItemToLocal(product)
  })
}

function addItemToLocal(product){
  let cartItem = JSON.parse(localStorage.getItem('productInCart'))
  if(cartItem === null){
    products.push(product)
    localStorage.setItem('productInCart', JSON.stringify(products))
  }
  else{
    cartItem.forEach(item => {
      if(product.name == item.name){
        product.quantity = item.quantity += 1;
        product.totalPrice = item.totalPrice += product.totalPrice;
      }
      else{
        products.push(item)
      }
    });
    products.push(product)
  }
  localStorage.setItem('productInCart', JSON.stringify(products))
  window.location.reload()
}

function cartNumberDisplay(){
  let cartNumbers = 0;
  let cartItem = JSON.parse(localStorage.getItem('productInCart'))
  cartItem.forEach(item =>{
    cartNumbers = item.quantity += cartNumbers;
  });
  document.querySelector('.floating-cart span').textContent = cartNumbers;
}
cartNumberDisplay()

function displayCart(){
  let count = 0;
  let productsCart = document.querySelector(".cart-summary");
  let summation = document.querySelector(".summation");

  let cartItem = JSON.parse(localStorage.getItem('productInCart'))
  
    if(productsCart){
      cartItem.forEach(item =>{
        productsCart.innerHTML += `
        <div class = "row">
        <div class="products"><img class="cart-image"src="${item.image}" alt=""><p>${item.name}</p></div>
        <div class="price"><p>₱${item.price}</p></div>
        <div class="quantity"><p><input class="cart-quantity-input" type="number" name="itemQuantity[val][]" value=${item.quantity}></p> </div>
        <div class="total"> <p>₱${parseFloat(item.totalPrice).toFixed(2)}</p></div>
        <div class="removeItem"><i class="fa fa-trash" style="font-size:x-large"></i></div>
       
       
        </div>`
        summation.innerHTML+=`
          <input type = "hidden" name="product[val][]" value="${item.name}">
        `   
    });
  }  
}
displayCart()
var removeItem = document.getElementsByClassName('removeItem')
for(var i = 0; i < removeItem.length; i++){
  let removeBtn = removeItem[i]
  removeBtn.addEventListener('click', () =>{
    let cartItem = JSON.parse(localStorage.getItem('productInCart'))
    cartItem.forEach(item => {
      if(item.name != (event.target.parentElement.parentElement.children[0].textContent)){
        products.push(item)
      }
    });
    localStorage.setItem('productInCart', JSON.stringify(products))
    window.location.reload()
  })
}
function cartPrice(){
  subTotal = 0;
  let cartItem = JSON.parse(localStorage.getItem('productInCart'))
  cartItem.map(item  =>{
    subTotal = item.totalPrice +=subTotal
  })
  document.querySelector('.org-price').textContent = "₱" + parseFloat(subTotal).toFixed(2)
  document.querySelector('.summary-item-value h3').textContent = "₱" + parseFloat(subTotal).toFixed(2)

}
cartPrice();



var quantityInputs = document.getElementsByClassName('cart-quantity-input')
for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i]
    input.addEventListener('change', quantityChanged)
}

//  document.getElementById('proceedToCheckout').addEventListener("click", function() {
//       localStorage.clear();    
   
//  })


function quantityChanged(event) {
  var input = event.target
  if (isNaN(input.value) || input.value <= 0) {
      input.value = 1
  }
  updateCartTotal()
}
var cartRows=document.getElementsByClassName("row");
function updateCartTotal() {
  var total = 0
  for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i]
      var priceElement = cartRow.getElementsByClassName('price')[0]
      var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
      var linePriceValue = cartRow.getElementsByClassName('total')[0]
      var price = parseFloat(priceElement.innerText.replace('₱', '')).toFixed(2)
      var quantity = quantityElement.value
      var linePrice = parseFloat(price * quantity).toFixed(2);
      total = total + (price * quantity)
      linePriceValue.innerText ='₱' + linePrice;
  }
    

  total = parseFloat(Math.round(total * 100) / 100).toFixed(2)
  document.getElementsByClassName('summary-item-value')[0].innerText = '₱' + total
  document.querySelector('.summary-item-value h3').textContent = '₱' + total
}