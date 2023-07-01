function ProfileSetting() {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("eMail").value;
  const password = document.getElementById("password").value;
  const newPassword = document
    .getElementById("newPassword")
    .value(async () => {
      const rawResponse = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          newPassword: newPassword,
        }),
      });
      const content = await rawResponse.json();

      console.log(content);
    })();
}
