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
    if (content.status == 404)
    {
      alert('Bạn nhập sai email hoặc chưa nhập đầy đủ thông tin đăng nhập, mời bạn nhập lại')
    }
    else if (content.status == 401)
    {
      alert('Bạn đã nhập sai mật khẩu, mời bạn nhập lại')
    }
    else
    {
      location.replace("../chat/index.html");
    }
  })();
}

function ForgotPassword() {
  const email = prompt("Hãy nhập email của bạn: ");
  (async () => {
    const rawResponse = await fetch(
      "http://127.0.0.1:5500/api/v1//user/forgot_password",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      }
    );
    const content = await rawResponse.json();
    console.log(content);
    if (content.status == 404) {
      alert("Tài khoản không tồn tại");
    } else {
      alert(
        "Mật khẩu mới của bạn mặc định là: " +
          content.newPassword +
          ", vùi lòng thay đổi mật khẩu ngay"
      );
    }
  })();
}