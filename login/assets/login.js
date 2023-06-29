function Login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // console.log("Email: ", email)
  // console.log("Pass: ", password)

  (async () => {
    const rawResponse = await fetch("http://42.112.154.30:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const content = await rawResponse.json();

    console.log(content);
    var mydata = JSON.parse(content);
    const accessToken = mydata.accessToken;
    console.log(accessToken);
    var cookieName = "accessToken";
    var cookieValue = accessToken;
    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie =
      cookieName +
      "=" +
      cookieValue +
      ";expires=" +
      myDate +
      ";domain=127.0.0.1;path=/";
    if (typeof accessToken != undefined) {
      location.replace("../chat/index.html");
    }
    // if (CheckLogin(content))
    // {
    //   location.replace("../chat/index.html")
    // }
  })();
}

// function CheckLogin(content)
// {

// }
