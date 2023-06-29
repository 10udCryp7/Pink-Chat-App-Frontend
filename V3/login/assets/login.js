function Login()
{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log("Email: ", email)
    // console.log("Pass: ", password)

    (async () => {
        const rawResponse = await fetch('http://42.112.154.30:4000/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: email, password: password})
        });
        const content = await rawResponse.json();
      
        console.log(content);
        var mydata = JSON.parse(content)
        const accessToken = mydata.accessToken
        console.log(accessToken)

        document.cookie = "accessToken="+accessToken
      })();
}

