var accessToken = getCookie("accessToken");

function ProfileSetting() {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("eMail").value;
  const newPassword = document.getElementById("newPassword").value;
  (async () => {
    const rawResponse = await fetch("http://127.0.0.1:5500/api/v1/user/edit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: email,
        password: newPassword,
        fullName: fullName,
      }),
    });
    const content = await rawResponse.json();
    console.log(content);
    alert('THANH CONG');
    GoBack();
  })();
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function GoBack()
{
  location.replace("../chat/index.html");
}

(async () => {
  const rawResponse = await fetch("http://127.0.0.1:5500/api/v1/user/info", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const content = await rawResponse.json();
  currentUserId = content._id;
  console.log(content);
  document.getElementById('user-name').innerHTML = content.fullName;
  document.getElementById('user-email').innerHTML = content.email;
})();



