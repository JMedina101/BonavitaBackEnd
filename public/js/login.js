
const login = async (email,password) => {
   
   try {
        const res = await axios({
            method:'POST',
            url:'localhost:300/user/login',
            data: {
                email,password
            }
        });
        console.log(res);
   }
   catch(er) {
       console.log(er);
   }
}
console.log(document.getElementById('email').value);
console.log(document.getElementById('password').value);
 document.querySelector('.form').addEventListener('submit',e=> {
     e.preventDefault();
     const email = document.getElementById('email').value;
     const password = document.getElementById('password').value;
     login(email,password)
 });