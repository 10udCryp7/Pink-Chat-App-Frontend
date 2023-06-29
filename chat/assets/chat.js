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
      const div = AddMessage(
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
function AddMessage(group_id, group_name, last_message, last_message_time) {
  const li = document.createElement("li");
  li.style.cursor = "pointer";
  li.id = group_id;

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

function getGroupID()
{
  
}