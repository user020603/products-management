import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  const inputContent = formSendData.querySelector("input[name='content']");
  formSendData.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = inputContent.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      inputContent.value = "";
    }
  });
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  console.log(data);
  console.log(myId);
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");

  let htmlFullName = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  div.innerHTML = `
      ${htmlFullName}
      <div class="inner-content">${data.content}</div>
      `;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});

// End SERVER_RETURN_MESSAGE

// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll chat to bottom

// emoji-picker
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  })

  // insert icon into input
  const emojiPicker = document.querySelector("emoji-picker");
  if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", (e) => {
      const icon = e.detail.unicode;
      inputChat.value += icon;
    })
  }
}
// End emoji-picker
