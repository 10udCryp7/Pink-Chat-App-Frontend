function Register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rePassword = document.getElementById("rePassword").value;
  console.log("Email: ", email);
  console.log("Password: ", password);
  console.log("rePassword: ", rePassword);
  if (password == rePassword) {
    (async () => {
      const rawResponse = await fetch("http://42.112.154.30:4000/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const content = await rawResponse.json();

      console.log(content);
      if (CheckRegister(content)) {
        alert("dang ki thanh cong, moi dang nhap");
        location.replace("../login/index.html");
      }
    })();
  } else {
    alert("sai me mat khau roi nhap lai di");
  }
}

function CheckRegister(content) {
  return true;
}
