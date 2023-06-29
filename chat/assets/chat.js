function getNavigation() {
  const accessToken = getCookie("accessToken");
  console.log(accessToken);
  (async () => {
    const rawResponse = await fetch(
      "http://42.112.154.30:4000/msg/navigation",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          accessToken: accessToken,
        },
        //body: JSON.stringify({email: email, password: password})
      }
    );
    const content = await rawResponse.json();
    let mydata = JSON.parse(content);

    const data = mydata.data;
    console.log(data);

    const ul = document.querySelector("#list-message");
    for (let i = 0; i < data.length; i++) {
      const div = AddMessageNav(
        data[i].group_id,
        data[i].group_name,
        data[i].last_message,
        data[i].last_message_time
      );
      ul.insertBefore(div, ul.firstChild);
    }
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

// function getGroupID(id) {
//   console.log(id);
// }
function ChangeGroup() {
  document.getElementById("chat-space").innerHTML = "";

  (async () => {
    // const rawResponse = await fetch(
    //   "http://42.112.154.30:4000/msg/" + li.id,
    //   {
    //     method: "GET",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       //accessToken: accessToken,
    //     },
    //     //body: JSON.stringify({email: email, password: password})
    //   }
    // );
    // const content = await rawResponse.json();
    // let mydata = JSON.parse(content);
    mydata = {
      group_name: "Project Isekai !",
      messages: [
        {
          id: "12345678",
          sender: "12345678",
          text: "Hello World !!!",
          mediaID: "",
          datetime: "9/9/2030",
        },
        {
          id: "15465611",
          sender: "12345679",
          text: "Gaming Time !!!",
          mediaID: "",
          datetime: "10/10/2030",
        },
        {
          id: "14543653",
          sender: "12345670",
          text: "Anime Time !!!!",
          mediaID: "",
          datetime: "11/11/2030",
        },
        {
          id: "15681346",
          sender: "12345671",
          text: "Festival Time !!!",
          mediaID: "",
          datetime: "12/12/2030",
        },
      ],
    };

    console.log(mydata);
    console.log(mydata.group_name);
    document.getElementById("friendName").innerHTML = mydata.group_name;
    for (let i = 0; i < mydata.messages.length; i++) {
      console.log(mydata.messages[i]);
    }
    const ul = document.getElementById("chat-space");
    const li2 = AppendMessage(1, "12345678", 3, 4, 5);
    ul.appendChild(li2);
  })();
}
function AddMessageNav(group_id, group_name, last_message, last_message_time) {
  const li = document.createElement("li");

  li.style.cursor = "pointer";
  li.id = group_id;
  li.addEventListener("click", ChangeGroup());

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
function AppendMessage(MessageID, UserID, Message, MediaID, DateTime) {
  const userId = getCookie("userId");
  if (UserID != userId) {
    const li = document.createElement("li");
    li.classList.add("my-2");

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
  // const li = document.createElement("li");
  // li.classList.add("d-flex", "justify-content-end", "my-2");

  // const div = document.createElement("div");
  // div.classList.add("card", "border", "border-muted");
  // div.style.width = "65%";
  // div.style.borderTopLeftRadius = "20px";
  // div.style.borderTopRightRadius = "0px";
  // div.style.borderBottomRightRadius = "20px";
  // div.style.borderBottomLeftRadius = "20px";
  // div.style.background = "rgba(52, 58, 64, 0.05)";

  // const cardBody = document.createElement("div");
  // cardBody.classList.add("card-body", "text-center", "p-2");

  // //const img = document.createElement("img");
  // //img.classList.add("img-fluid", "mb-2");
  // //img
  // // img.src = "assets/img/333580.jpg";
  // // img.style.maxHeight = "30rem";
  // // img.style.height = "auto";
  // // img.style.minHeight = "10rem";

  // const p = document.createElement("p");
  // p.classList.add("text-start", "card-text");
  // //message
  // p.style.fontSize = "1rem";
  // p.textContent = Message;

  // const h6 = document.createElement("h6");
  // h6.classList.add("text-muted", "card-subtitle", "text-end");
  // h6.style.fontSize = "0.75rem";
  // //datetime
  // h6.textContent = DateTime;

  // //cardBody.appendChild(img);
  // cardBody.appendChild(p);
  // cardBody.appendChild(h6);

  // div.appendChild(cardBody);

  // li.appendChild(div);
  // return li;
  const li = document.createElement("li");
  li.classList.add("d-flex", "justify-content-end", "my-2");

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
  cardTextP.textContent =
    "Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus.";

  const cardSubtitleH6 = document.createElement("h6");
  cardSubtitleH6.classList.add("text-muted", "card-subtitle", "text-end");
  cardSubtitleH6.style.fontSize = "0.75rem";
  cardSubtitleH6.textContent = "Julio 22, 2021. 12:33 P.M.";

  cardBodyDiv.appendChild(cardTextP);
  cardBodyDiv.appendChild(cardSubtitleH6);

  div.appendChild(cardBodyDiv);

  li.appendChild(div);
  return li;
}
getNavigation();

function GetSearch() {
  const search_detail = document.getElementById("searchInput").value;
  (async () => {
    const rawResponse = await fetch(
      "http://42.112.154.30:4000/msg/find/" + search_detail,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        //body: JSON.stringify({ search_detail: search_detail }),
      }
    );
    const content = await rawResponse.json();

    console.log(content);
    let mydata = JSON.parse(content);
    const data = mydata.data;
    //console.log(data);
    for (let i = 0; i < data.length; i++) {
      const li = AddSearch(data[i].userName);
      const ul = document.getElementById("myUL");
      const firstLi = ul.firstChild;
      ul.insertBefore(li, firstLi);
      ul.insertBefore(AddIcon(data[i].userID), firstLi);
    }
  })();
}

function AddSearch(name) {
  const li1 = document.createElement("li");
  li1.classList.add("col-6");
  li1.style.display = "inline-block";
  const a1 = document.createElement("a");
  a1.href = "#";
  a1.textContent = name;
  li1.appendChild(a1);
  return li1;
}
function AddIcon(userID) {
  const li2 = document.createElement("li");
  li2.classList.add("col-4");
  li2.style.display = "inline-block";
  const i2 = document.createElement("i");
  i2.id = userID;
  i2.classList.add("fab", "fa-telegram-plane");
  i2.style.float = "right";
  li2.appendChild(i2);
  return li2;
}

function getMessage(group_id) {
  (async () => {
    const rawResponse = await fetch("http://42.112.154.30:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: group_id }),
    });
    const content = await rawResponse.json();

    console.log(content);
    let mydata = JSON.parse(content);

    const data = mydata.messages;
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      console.log(data.id);
      console.log(data.sender);
      console.log(data.text);
      console.log(data.mediaID);
      console.log(data.datetime);
    }
  })();
}

function getUserName(userID) {
  (async () => {
    const rawResponse = await fetch("http://42.112.154.30:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userID }),
    });
    const content = await rawResponse.json();

    console.log(content);
    let mydata = JSON.parse(content);
    console.log(mydata.displayName);
  })();
}

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
    let myDiv = document.getElementById("myUL");
    myDiv.style.display = "";
    GetSearch();
    // Alert the user
    // alert("search");
  }
});
