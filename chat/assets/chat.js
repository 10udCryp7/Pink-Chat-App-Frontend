var currentGroup = "";
var currentUserId = "";
var accessToken = getCookie("accessToken");
var users = {};

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
})();
//---LAY CAI BEN TRAI---
getNavigation();
function getNavigation() {
  const accessToken = getCookie("accessToken");
  console.log(accessToken);
  (async () => {
    //CHƯA CÓ
    const rawResponse = await fetch("http://127.0.0.1:5500/api/v1/group/list", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        accessToken: accessToken,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const mydata = await rawResponse.json();

    console.log(mydata.list[0]);

    const ul = document.querySelector("#list-message");
    for (let i = 0; i < mydata.list.length; i++) {
      await Promise.all([getLastMessage(mydata.list[i]._id), getGroupInfo(mydata.list[i]._id)]).then(([data, mydata_1]) => {
        var groupName = mydata_1.name;
        if (data.list.length === 0) {
          const div = AddSemiMessageNav(
            mydata.list[i]._id,
            groupName,
            "Empty",
            "Empty"
          );
          ul.insertBefore(div, ul.firstChild);
        }
        else {
          const text = data.list[0].text;
          const datetime = new Date(Date.parse(data.list[0].datetime));
          const div = AddSemiMessageNav(
            mydata.list[i]._id,
            groupName,
            text,
            datetime
          );
          ul.insertBefore(div, ul.firstChild);
        }
      });
    }
    // for (let i = 0; i < data.length; i++) {
    //   const div = AddMessageNav(
    //     mydata[i].group_id,
    //     mydata[i].group_name,
    //     mydata[i].last_message,
    //     mydata[i].last_message_time
    //   );
    //   ul.insertBefore(div, ul.firstChild);
    // }
  })();
}

//---LAY COOKIE---
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

//---THEM GROUP VAO NAV---
function AddSemiMessageNav(group_id, group_name, last_message, last_message_time) {
  const li = document.createElement("li");

  li.style.cursor = "pointer";
  li.id = group_id;
  console.log(group_id);
  li.addEventListener("click", () => {
    ChangeGroup(group_id)()
  });

  const div = document.createElement("div");
  div.classList.add("card", "border-0");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const span = document.createElement("span");
  span.classList.add(
    "text-nowrap",
    "text-truncate",
    "text-uppercase",
    "text-white",
    "float-end",
    "p-1",
    "text-center"
  );
  span.style.width = "2rem";
  span.style.height = "2rem";
  span.style.borderRadius = "15px";
  span.style.background = "#00db5f";
  span.textContent = "0";
  span.style.display = "none";

  const h4 = document.createElement("h4");
  h4.classList.add("text-nowrap", "text-truncate", "card-title");
  h4.textContent = group_name;

  const h6_1 = document.createElement("h6");
  h6_1.classList.add(
    "text-nowrap",
    "text-truncate",
    "text-muted",
    "card-subtitle",
    "mb-2"
  );
  h6_1.style.fontSize = "0.5rem";
  h6_1.textContent = last_message_time;

  const h6_2 = document.createElement("h6");
  h6_2.classList.add(
    "text-nowrap",
    "text-truncate",
    "text-muted",
    "card-subtitle",
    "mb-2"
  );
  h6_2.textContent = last_message;
  cardBody.appendChild(span);
  cardBody.appendChild(h4);
  cardBody.appendChild(h6_1);
  cardBody.appendChild(h6_2);

  div.appendChild(cardBody);

  li.appendChild(div);

  return li;
}

function ChangeGroup(group_id) {
  return function () {
    currentGroup = group_id;
    document.getElementById("chat-space").innerHTML = "";
    document
      .getElementById(group_id)
      .getElementsByTagName("span")[0].style.display = "none";
    (async () => {
      const rawResponse = await fetch(
        "http://127.0.0.1:5500/api/v1/message/list_all",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ groupId: group_id }),
        }
      );
      let mydata = await rawResponse.json();
      console.log(mydata);
      mydata = mydata.list.reverse()
      var groupName = "";
      await getGroupInfo(group_id).then(mydata_1 => {
        groupName = mydata_1.name
      })
      document.getElementById("friendName").innerHTML = groupName;
      const ul = document.getElementById("chat-space");
      for (let i = 0; i < mydata.length; i++) {
        let senderID = mydata[i].senderUserId
        if (users[senderID] == undefined) {
          await getUserInfo(senderID).then(data => {
            users[senderID] = data.fullName
          });
        }
        const li2 = AppendMessage(
          mydata[i]._id,
          mydata[i].senderUserId,
          mydata[i].text,
          mydata[i].mediaID,
          new Date(Date.parse(mydata[i].datetime)),
        );
        ul.appendChild(li2);
        var elem = document.getElementById("chat-space");
        elem.scrollTop = elem.scrollHeight;
      }
    })();
  };
}
//---THEM TIN NHAN---
function AppendMessage(MessageID, UserID, Message, MediaID, DateTime) {
  if (UserID != currentUserId) {
    const li = document.createElement("li");
    li.classList.add(
      "d-flex",
      "justify-content-start",
      "my-2",
      "align-items-end"
    );
    li.style.height = "fit-content";
    const div = document.createElement("div");
    div.classList.add("card", "border", "border-muted");
    div.style.width = "65%";
    div.style.borderTopLeftRadius = "0px";
    div.style.borderTopRightRadius = "20px";
    div.style.borderBottomRightRadius = "20px";
    div.style.borderBottomLeftRadius = "20px";
    div.style.background = "rgba(52, 58, 64, 0.05)";

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body", "text-center", "p-2");

    const p = document.createElement("p");
    p.classList.add("text-start", "card-text");
    p.style.fontSize = "1rem";
    //message
    p.textContent = Message;
    const h6 = document.createElement("h6");
    h6.classList.add("text-muted", "card-subtitle", "text-end");
    h6.style.fontSize = "0.75rem";
    h6.textContent = DateTime

    const h62 = document.createElement("h6");
    h62.classList.add("text-muted", "card-subtitle", "text-start");
    h62.style.fontSize = "0.75rem";
    h62.textContent = users[UserID]

    cardBodyDiv.appendChild(h62);
    cardBodyDiv.appendChild(p);
    cardBodyDiv.appendChild(h6);
    div.appendChild(cardBodyDiv);
    li.appendChild(div);
    return li;
  }
  // //const img = document.createElement("img");
  // //img.classList.add("img-fluid", "mb-2");
  // //img
  // // img.src = "assets/img/333580.jpg";
  // // img.style.maxHeight = "30rem";
  // // img.style.height = "auto";
  // // img.style.minHeight = "10rem";

  // //cardBody.appendChild(img);
  else {
    const li = document.createElement("li");
    li.classList.add(
      "d-flex",
      "justify-content-end",
      "my-2",
      "align-items-end"
    );
    li.style.height = "fit-content";
    const div = document.createElement("div");
    div.classList.add("card", "border", "border-muted");
    div.style.width = "65%";
    div.style.borderTopLeftRadius = "20px";
    div.style.borderTopRightRadius = "0px";
    div.style.borderBottomRightRadius = "20px";
    div.style.borderBottomLeftRadius = "20px";
    div.style.background = "rgba(52, 58, 64, 0.05)";

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body", "text-center", "p-2");

    const cardTextP = document.createElement("p");
    cardTextP.classList.add("text-start", "card-text");
    cardTextP.style.fontSize = "1rem";
    cardTextP.textContent = Message;

    const cardSubtitleH6 = document.createElement("h6");
    cardSubtitleH6.classList.add("text-muted", "card-subtitle", "text-end");
    cardSubtitleH6.style.fontSize = "0.75rem";
    cardSubtitleH6.textContent = DateTime;

    cardBodyDiv.appendChild(cardTextP);
    cardBodyDiv.appendChild(cardSubtitleH6);

    div.appendChild(cardBodyDiv);

    li.appendChild(div);
    return li;
  }
}
//---TRA VE KET QUA TIM KIEM---
function GetSearch() {
  const search_detail = document.getElementById("searchInput").value;
  (async () => {
    //CHƯA CÓ
    const rawResponse = await fetch(
      "http://127.0.0.1:5500/api/v1/user/list_all",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ fullNameContains: search_detail }),
      }
    );
    const content = await rawResponse.json();
    console.log(content);
    const data = content.list;
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id != currentUserId) {
        const li = AddSearch(data[i].fullName);
        const ul = document.getElementById("myUL");
        const div = document.createElement("div");

        let li2 = document.createElement("li");
        li2.setAttribute("class", "col-2");
        li2.setAttribute("style", "display: inline-block");

        let img = document.createElement("img");
        img.setAttribute("src", "assets/img/add.png");
        img.setAttribute("width", "15");
        img.setAttribute("height", "15");
        img.setAttribute("title", "add to group");
        img.setAttribute("style", "float: right");

        li2.appendChild(img);
        li2.onclick = await InviteToCurrentGroup(data[i]._id);

        div.appendChild(li);
        div.appendChild(li2)
        div.appendChild(AddIcon(data[i]._id));

        const firstLi = ul.firstChild;
        div.addEventListener("mouseover", function () {
          this.style.backgroundColor = "white";
        });

        // Remove the class from the div when not hovering
        div.addEventListener("mouseout", function () {
          this.style.backgroundColor = "lightgray";
        });
        ul.insertBefore(div, firstLi);
        // ul.insertBefore(li, firstLi);
        // ul.insertBefore(AddIcon(data[i].userID), firstLi);
      }
    }
  })();
}
//---THEM USERNAME VAO KET QUA TIM KIEM---
function AddSearch(name) {
  const li1 = document.createElement("li");
  li1.classList.add("col-6");
  li1.style.display = "inline-block";
  li1.style.paddingLeft = "1vw";
  const a1 = document.createElement("a");
  a1.href = "#";
  a1.textContent = name;
  li1.appendChild(a1);
  return li1;
}

//---THEM ICON KET QUA TIM KIEM---
function AddIcon(userID) {
  const li2 = document.createElement("li");
  li2.classList.add("col-2");
  li2.style.display = "inline-block";
  li2.onclick = connectUser(userID);
  const i2 = document.createElement("i");
  //i2.id = userID;
  i2.classList.add("fab", "fa-telegram-plane");
  i2.style.float = "right";
  li2.appendChild(i2);
  return li2;
}

//---LAY THONG TIN GROUP---
function getGroupInfo(groupId) {
  return new Promise(async (resolve, reject) => {
    const rawResponse = await fetch(
      "http://127.0.0.1:5500/api/v1/group/info/" + groupId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    var mydata = await rawResponse.json();
    var groupName = mydata.name;
    if (groupName.trim().length === 0) {
      for (let i = 0; i < mydata.users.length; i++) {
        if (mydata.users[i].userId != currentUserId) {
          await getUserInfo(mydata.users[i].userId).then(data => {
            groupName += data.fullName + ', ';
          });
        }
      }
      groupName = groupName.slice(0, -2);
      mydata.name = groupName
    }
    resolve(mydata);
  });
  
}

//---AN KET QUA TIM KIEM---
document.addEventListener("click", function (event) {
  let myDiv = document.getElementById("myUL");
  // If the click was outside of the div element
  if (!myDiv.contains(event.target)) {
    // Hide the div element
    myDiv.style.display = "none";
  }
});

// Get the input element
const myInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", function (event) {
  // Prevent the default form submit behavior
  event.preventDefault();
});

// Add an event listener to the input element
myInput.addEventListener("keyup", function (event) {
  event.preventDefault();
  // If the Enter key was pressed
  if (event.key === "Enter") {
    document.getElementById("myUL").innerHTML = "";
    let myDiv = document.getElementById("myUL");
    myDiv.style.display = "";
    GetSearch();
  }
});

//---SOCKET---
const socket = io("http://127.0.0.1:6600");

var socketConnected = false;

socket.emit("authenticate", {
  accessToken: accessToken,
});

const chat_input = document.getElementById("chat_input");

chat_input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

socket.on("authenticate-done", setSocketStatus());

function setSocketStatus() {
  socketConnected = true;
}

socket.on("error", (data) => {
  let status = data.status;
  let message = data.message;
  alert("Status: " + status + ",message: " + message);
});

socket.on("new-message", async (data) => {
  console.log(data)
  if (data.message.senderUserId != currentUserId) {
    appendMessageNavigationChecked(
      data.groupId,
      data.message.text,
      data.message.senderUserId,
      new Date(Date.parse(data.message.datetime))
    );
    if (data.groupId == currentGroup) {

      let ul = document.getElementById("chat-space");
      let senderID = data.message.senderUserId
      if (users[senderID] == undefined) {
        await getUserInfo(senderID).then(data => {
          users[senderID] = data.fullName
          });
      }
      ul.appendChild(
        AppendMessage(
          "",
          data.message.senderUserId,
          data.message.text,
          "",
          new Date(Date.parse(data.message.datetime))
        )
      );
      var elem = document.getElementById("chat-space");
      elem.scrollTop = elem.scrollHeight;
    }
  }
});

//---NHAN TIN---
function sendMessage() {
  if (currentGroup != "") {
    let message = chat_input.value;
    chat_input.value = ""
    let index = message.lastIndexOf('\n');
    if (index !== -1) {
      message = message.substring(0, index);
    }
    if (message.trim().length === 0) {
      console.log("");
    } else {
      (async () => {
        const rawResponse = await fetch(
          "http://127.0.0.1:5500/api/v1/message/send",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              groupId: currentGroup,
              text: message,
            }),
          }
        );
        const content = await rawResponse.json();
        let ul = document.getElementById("chat-space");
        ul.appendChild(
          AppendMessage(content._id, content.senderUserId, content.text, "", new Date(Date.parse(content.datetime)))
        );
        appendMessageNavigationChecked(currentGroup, content.text, content.senderUserId, new Date(Date.parse(content.datetime)))
        var elem = document.getElementById("chat-space");
        elem.scrollTop = elem.scrollHeight;
      })();


    }
  }
  else {
    alert("Select a chat or start a new conversation")
  }
}

//---KIEM TRA SU TON TAI CUA GROUP, SUA THONG TIN, THEM GROUP MOI, KHI TIN NHAN DEN---
async function appendMessageNavigationChecked(group_id, message, sender_id, time) {
  const navigationList = document.getElementById("list-message");
  let listOfli = navigationList.querySelectorAll("li");
  let liIdList = [];
  listOfli.forEach((li) => {
    liIdList.push(li.id);
  });
  if (liIdList.includes(group_id)) {
    let li = document.getElementById(group_id);
    let h6s = li.querySelectorAll("h6");
    h6s[0].textContent = time;
    h6s[1].textContent = message;
    let span = li.querySelector("span");
    span.textContent = "";
    if (currentGroup != group_id) {
      span.style.display = "";
    }
  } else {
    const ul = document.querySelector("#list-message");
    var groupName = "";
    await getGroupInfo(group_id).then(mydata_1 => {
      groupName = mydata_1.name
    })
    const div = AddSemiMessageNav(
      group_id,
      groupName,
      message,
      time
    );
    ul.insertBefore(div, ul.firstChild);
  }
}
//---KIEM TRA SU TON TAI CUA GROUP, SUA THONG TIN, THEM GROUP MOI, KHI TIN NHAN DI---
function MessageCheckExist(
  group_id,
  group_name,
  last_message,
  last_message_time
) {
  const navigationList = document.getElementById("list-message");
  let listOfli = navigationList.querySelectorAll("li");
  let liIdList = [];
  listOfli.forEach((li) => {
    liIdList.push(li.id);
  });
  if (liIdList.includes(group_id)) {
    let li = document.getElementById(group_id);
    let h4 = li.querySelector("h4");
    let h6s = li.querySelectorAll("h6");

    h4.textContent = group_name;
    h6s[0].textContent = last_message_time;
    h6s[1].textContent = last_message;
    let span = li.querySelector("span");
    span.textContent = "";
    span.style.display = "";
  } else {
    AddSemiMessageNav(group_id, group_name, message, time);
  }
}

function connectUser(userID) {
  return function () {
    let myDiv = document.getElementById("myUL");
    myDiv.style.display = "none";
    (async () => {
      let test = false;
      const rawResponse = await fetch("http://127.0.0.1:5500/api/v1/group/list", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          accessToken: accessToken,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const mydata = await rawResponse.json();
      for (let i = 0; i < mydata.list.length; i++) {
        let members = mydata.list[i].users
        if (members.length === 2) {
          let arr = []
          arr.push(members[0].userId)
          arr.push(members[1].userId)
          if (arr.includes(userID) && arr.includes(currentUserId)) {
            test = true;
            ChangeGroup(mydata.list[i]._id)()
          }
        }
      }
      if (test == false) {
        (async () => {
          const rawResponse = await fetch("http://127.0.0.1:5500/api/v1/group/create", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              accessToken: accessToken,
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              name: "",
              users: [
                {
                  userId: userID,
                  isAdmin: false
                },
                {
                  userId: currentUserId,
                  isAdmin: false
                }
              ]
            }),
          });
          const mydata = await rawResponse.json();
          MessageCheckExist(
            mydata._id,
            mydata.name,
            "Empty",
            "Empty"
          );
          ChangeGroup(mydata._id)();
        })();
      }
    })();

    //(async () => {
    //  // const rawResponse = await fetch("/msg/connect/"+userID, {
    //  //   method: "GET",
    //  //   headers: {
    //  //     Accept: "application/json",
    //  //     "Content-Type": "application/json",
    //  //   },
    //  // });
    //  // const content = await rawResponse.json();
    //  // console.log(content);
    //  // let mydata = JSON.parse(content);
    //  mydata = {
    //    group_id: "22222222",
    //    group_name: "hello",
    //    last_message: "hi",
    //    last_message_time: "hi",
    //  };
    //  MessageCheckExist(
    //    mydata.group_id,
    //    mydata.group_name,
    //    mydata.last_message,
    //    mydata.last_message_time
    //  );
    //  ChangeGroup(mydata.group_id)();
    //})();
  };
}

function getUserInfo(id) {
  return new Promise(async (resolve, reject) => {
    const rawResponse = await fetch(
      "http://127.0.0.1:5500/api/v1/user/info/" + id,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const mydata = await rawResponse.json();
    console.log(mydata);
    resolve(mydata);
  });
}

function GoSetting() {
  location.replace("../profile_setting/index.html");
}

function getLastMessage(group_id) {
  return new Promise(async (resolve, reject) => {
    const rawResponse = await fetch(
      "http://127.0.0.1:5500/api/v1/message/list_all",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ groupId: group_id, pagination: "1" }),
      }
    );
    const content = await rawResponse.json();
    console.log(content);
    resolve(content);
  });
}

// getLastMessage('649febce22586dbcbe850d02').then(mydata => {
//  //access mydata here
// });

function CreateGroup() {
  var groupName;
  do {
    groupName = prompt("Hay nhap ten group muon tao");
    if (groupName.trim().length === 0) {
      alert('ban chua nhap ten group, hay nhap ten group');
    }
  } while (groupName.trim().length === 0);

  (async () => {
    const rawResponse = await fetch(
      "http://127.0.0.1:5500/api/v1/group/create",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          accessToken: accessToken,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: groupName,
          users: [],
        }),
      }
    );
    const mydata = await rawResponse.json();
    console.log(mydata);
    const ul = document.querySelector("#list-message");
    const div = AddSemiMessageNav(mydata._id, groupName, "Empty", "Empty");
    ul.insertBefore(div, ul.firstChild);

    ChangeGroup(mydata._id);
  })();
}

function InviteToCurrentGroup(userId) {
  return function () {
    if (currentGroup != "") {
      (async () => {
        const rawResponse = await fetch(
          "http://127.0.0.1:5500/api/v1/group/info/" + currentGroup,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              accessToken: accessToken,
            },
          }
        );
        const mydata = await rawResponse.json();
        var groupName = ""
        await getGroupInfo(currentGroup).then((data) => {
          groupName = data.name;
        });
        if (groupName.trim().length === 0) {
          alert("Day khong phai group");
        } else {
          alert("group chuan roi");
        }
      })();
    }
  };
}