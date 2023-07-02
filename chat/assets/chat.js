var currentGroup = "";
var currentUserId = "";
var accessToken = getCookie("accessToken");
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
      getLastMessage(mydata.list[i]._id).then((data) => {
        const text = data.list[i].text;
        const datetime = data.list[i].datetime;
        const div = AddMessageNav(
          mydata.list[i]._id,
          mydata.list[i].name,
          text,
          datetime
        );
        ul.insertBefore(div, ul.firstChild);
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
function AddMessageNav(group_id, group_name, last_message, last_message_time) {
  const li = document.createElement("li");

  li.style.cursor = "pointer";
  li.id = group_id;
  console.log(group_id);
  li.addEventListener("click", ChangeGroup(group_id));

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
        "http://127.0.0.1:5500/api/v1/message/list",
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
      const mydata = await rawResponse.json();
      console.log(mydata);
      let groupName = getGroupName(group_id);
      document.getElementById("friendName").innerHTML = groupName;
      for (let i = 0; i < mydata.list.length; i++) {
        console.log(mydata.list[i]);
      }
      const ul = document.getElementById("chat-space");
      for (let i = 0; i < mydata.list.length; i++) {
        const li2 = AppendMessage(
          mydata.list[i]._id,
          mydata.list[i].senderUserId,
          mydata.list[i].text,
          mydata.list[i].mediaID,
          mydata.list[i].datetime
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
    h6.textContent = DateTime;

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
      const li = AddSearch(data[i].fullName);
      const ul = document.getElementById("myUL");
      const div = document.createElement("div");
      div.appendChild(li);
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
  li2.classList.add("col-4");
  li2.style.display = "inline-block";
  li2.onclick = connectUser(userID);
  const i2 = document.createElement("i");
  i2.id = userID;
  i2.classList.add("fab", "fa-telegram-plane");
  i2.style.float = "right";
  li2.appendChild(i2);
  return li2;
}

//---LAY TEN USER CUA USERID---
function getGroupName(userID) {
  return "Group Name Not Finished";
  //(async () => {
  //  //CHƯA CÓ
  //  const rawResponse = await fetch("http://127.0.0.1:5500/login", {
  //    method: "POST",
  //    headers: {
  //      Accept: "application/json",
  //      "Content-Type": "application/json",
  //    },
  //    body: JSON.stringify({ id: userID }),
  //    Authorization: `Bearer ${accessToken}`
  //  });
  //  const content = await rawResponse.json();

  //  console.log(content);
  //  let mydata = JSON.parse(content);
  //  console.log(mydata.displayName);
  //  return mydata.displayName;
  //})();
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

socket.on("new-message", (data) => {
  console.log(data);
  appendMessageNavigationChecked(
    data.groupId,
    data.message.text,
    data.message.senderUserId,
    data.message.datetime
  );
  if (data.groupId == currentGroup) {
    alert("vua them tu socket");
    let ul = document.getElementById("chat-space");
    ul.appendChild(
      AppendMessage(
        "",
        data.message.senderUserId,
        data.message.text,
        "",
        data.message.datetime
      )
    );
    var elem = document.getElementById("chat-space");
    elem.scrollTop = elem.scrollHeight;
  }
});

//---NHAN TIN---
function sendMessage() {
  let message = chat_input.value;
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
            groupId: "649febce22586dbcbe850d02" /*currentGroup*/,
            text: message,
          }),
        }
      );
      const content = await rawResponse.json();
      console.log(content);
    })();
    var elem = document.getElementById("chat-space");
    elem.scrollTop = elem.scrollHeight;
  }
}

//---KIEM TRA SU TON TAI CUA GROUP, SUA THONG TIN, THEM GROUP MOI, KHI TIN NHAN DEN---
function appendMessageNavigationChecked(group_id, message, sender_id, time) {
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

    h4.textContent = getGroupName(group_id);
    h6s[0].textContent = time;
    h6s[1].textContent = message;
    let span = li.querySelector("span");
    span.textContent = "";
    span.style.display = "";
  } else {
    const ul = document.querySelector("#list-message");
    const div = AddMessageNav(group_id, getGroupName(group_id), message, time);
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
    AddMessageNav(group_id, group_name, message, time);
  }
}

function connectUser(userID) {
  return function () {
    let myDiv = document.getElementById("myUL");
    myDiv.style.display = "none";
    //CHƯA CÓ
    (async () => {
      // const rawResponse = await fetch("/msg/connect/"+userID, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      // });
      // const content = await rawResponse.json();
      // console.log(content);
      // let mydata = JSON.parse(content);
      mydata = {
        group_id: "22222222",
        group_name: "hello",
        last_message: "hi",
        last_message_time: "hi",
      };
      MessageCheckExist(
        mydata.group_id,
        mydata.group_name,
        mydata.last_message,
        mydata.last_message_time
      );
      ChangeGroup(mydata.group_id)();
    })();
  };
}

function findUser(userId) {
  (async () => {
    const rawResponse = await fetch(
      "http://127.0.0.1:5500/api/v1/user/info/" + userId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const content = await rawResponse.json();
    console.log(content);
    let mydata = JSON.parse(content);
    return mydata;
  })();
}

function GoSetting() {
  location.replace("../profile_setting/index.html");
}

function getLastMessage(group_id) {
  return new Promise(async (resolve, reject) => {
    const rawResponse = await fetch(
      "http://127.0.0.1:5500/api/v1/message/list",
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
