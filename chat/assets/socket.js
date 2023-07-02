const socket = io('http://127.0.0.1:3000')

var socketConnected = false

socket.emit('authenticate', getCookie("accessToken"))

socket.on('authenticate-done', setSocketStatus())

function setSocketStatus() {
  socketConnected = true;
}

socket.on("error", data => {
  let status = data.status;
  let message = data.message;
  alert("Status: " + status + ",message: " + message)
})

socket.on('new-message', data => {
  //console.log(data)
  appendMessageNavigationChecked(data.groupId, data.message.text, data.message.senderUserId, data.message.datetime)
  if (data.groupId == current_group) {
    AppendMessage("", data.message.senderUserId, data.message.text, "", data.message.datetime)
    AppendMessage()
  }
})

const chat_input = document.getElementById("chat_input")

chat_input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendMessage()
  }
});

function sendMessage() {
  let message = chat_input.value
  let currentdate = new Date()
  let userID = getCookie("userId")
  let formatted_cdate = currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
  socket.emit('send-chat-message', {
    room: current_group,
    message: message,
    time: formatted_cdate
  })
  chat_input.value = ''
  let ul = document.getElementById("chat-space");
  ul.appendChild(AppendMessage("", userID, message, "", formatted_cdate))
    // Alert the user
    //alert("search");
}

function appendMessageNavigationChecked(group_id, message, sender_id, time)
{
  const navigationList = document.getElementById("list-message")
  let listOfli = navigationList.querySelectorAll('li');
  let liIdList = []
  listOfli.forEach(li => {
    liIdList.push(li.id)
  });
  if (liIdList.includes(group_id)) {
    let li = document.getElementById(group_id)
    let h4 = li.querySelector('h4');
    let h6s = li.querySelectorAll('h6');

    h4.textContent = getGroupName(group_id);
    h6s[0].textContent = time;
    h6s[1].textContent = message;
    let span = li.querySelector('span');
    span.textContent = '';
    span.style.display = '';
  } else {
    AddMessageNav(group_id, getGroupName(group_id), message, time)
  }
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


