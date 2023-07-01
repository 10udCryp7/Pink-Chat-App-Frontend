function Login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // console.log("Email: ", email)
  // console.log("Pass: ", password)

  (async () => {
    const rawResponse = await fetch("http://127.0.0.1:5500/api/v1/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const content = await rawResponse.json();

    console.log(content);
    const accessToken = content.accessToken;
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
  })();
}
