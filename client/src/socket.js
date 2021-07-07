import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  markRead
} from "./store/conversations";

const token = window.localStorage.getItem('messenger-token');
const socket = io(window.location.origin, {
  query: { token }
});

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
  socket.on("mark-read", (data) => {
    store.dispatch(markRead(data.readerId, data.conversationId))
  })
});

export default socket;
