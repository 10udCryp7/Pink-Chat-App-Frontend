function Register() {
  const email = document.getElementById("email").value;
  const userName = document.getElementById("userName").value;
  const password = document.getElementById("password").value;
  const rePassword = document.getElementById("rePassword").value;

  console.log("Email: ", email);
  console.log("Password: ", password);
  console.log("rePassword: ", rePassword);
  console.log("userName: ", userName);
  console.log(JSON.stringify({ email: email,password: password, fullName: userName }))
  if (password == rePassword) {
    (async () => {
      const rawResponse = await fetch("http://127.0.0.1:5500/api/v1/user/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email,password: password, fullName: userName }),
      });
      const content = await rawResponse;
      console.log(content);
      if (CheckRegister(content)) {
        alert("dang ki thanh cong, moi dang nhap");
        location.replace("../login/index.html");
      }
    })();
  } else {
    alert("sai mat khau");
  }
}

function CheckRegister(content) {
  if (content.status == 409)
  {
    alert('email da ton tai')
    return false;
  }
  return true;
}
