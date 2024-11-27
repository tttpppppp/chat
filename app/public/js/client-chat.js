const socket = io();
document.getElementById("form-messages").addEventListener("submit" , (e) =>{
    e.preventDefault();
    const value =  document.getElementById("input-messages").value;

    const acKnowlegement  = (error) =>{
        if(error){
            alert("Tin nhắn không hợp lệ!")
        }
        console.log("Sent");
    }
    socket.emit("send message form client to server" , value , acKnowlegement);
})
socket.on("send message server to client", (messageText) => {
    const { createAt, message , username } = messageText;
    const appMessages = document.getElementById("app__messages");
    const messageItem = document.createElement("div");
    messageItem.classList.add("message-item");
    messageItem.innerHTML = `
        <div class="message__row1">
            <p class="message__name">${username}</p>
            <p class="message__date">${createAt}</p>
        </div>
        <div class="message__row2">
            <p class="message__content">${message}</p>
        </div>
    `;
    appMessages.append(messageItem);
    appMessages.scrollTop = appMessages.scrollHeight;
    document.getElementById("input-messages").value = "";
    console.log(messageText)
});


document.getElementById("btn-share-location").addEventListener("click" , () =>{
    navigator.geolocation.getCurrentPosition((position) =>{
        console.log(position);
        const {latitude , longitude} = position.coords;
        socket.emit("share location from client" , {latitude , longitude})
    })
})

const queryString = location.search;
const params = Qs.parse(queryString , {ignoreQueryPrefix : true});
const {room , username} = params;
document.getElementById("app__title").innerHTML = room;


socket.emit("join room client to server" , {room , username})

socket.on("server send list user to client" , (userList) =>{
    console.log(userList);
    let content = "";
    userList.map((user) =>{
        content += ` <li class="app__item-user">${user.username}</li>`;
    })
    document.getElementById("app__list-user--content").innerHTML = content;
})  

