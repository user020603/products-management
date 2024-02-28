const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // SocketIO
  _io.once("connection", (socket) => {
    // console.log("Successful Connected", socket.id);
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userId,
        content: content,
      });

      // console.log(chat);
      await chat.save();

      // trả data về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: content,
      });
    });
  });
  // End SocketIO

  // Lay data tu database
  const chats = await Chat.find({
    deleted: false,
  });
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.infoUser = infoUser;
    // console.log(chat.infoUser);
  }

  // console.log(chats)

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
