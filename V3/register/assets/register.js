function Register()
{
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const rePassword = document.getElementById('rePassword').value
    console.log("Email: ", email)
    console.log("Password: ", password)
    console.log("rePassword: ", rePassword)
    if (password == rePassword)
    { 
        (async () => {
            const rawResponse = await fetch('https://httpbin.org/post', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({email: email, password: password, rePassword: rePassword})
            });
            const content = await rawResponse.json();
          
            console.log(content);
          })();
    }
    else
    {
        alert('sai me mat khau roi nhap lai di')
    }
}