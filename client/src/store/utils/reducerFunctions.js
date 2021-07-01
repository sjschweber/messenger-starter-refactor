export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;

    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadMessages += 1;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      newConvo.unreadMessages += 1;

      return newConvo;
    } else {
      return convo;
    }
  });
};

export const markReadInStore = (state, reader, convoId) => {
  // Find current conversation
  // Use max to find most recent read message and set it to true
  return state.map( convo => {
    if(convo.id === convoId){
      const newConvo = { ...convo };
      let max = {
        id: 0,
        index: 0,
      };

      newConvo.messages = newConvo.messages.map((message, index) => {
        if(message.senderId !== reader.id) {
          const newMessage = { ...message }
          newMessage.isRead = true;

          if(newMessage.id > max.id){
            max.id = newMessage.id;
            max.index = index;
          }
          newMessage.isMostRecentRead = false;
          return newMessage;
        } else {
          return message;
        }
      });

      newConvo.messages[max.index].isMostRecentRead = true;
      newConvo.unreadMessages = 0;
      return newConvo;
    } else {
      return convo;
    }
  })
}

export const sortMessagesForStore = (conversations) => {

  return conversations.map(conversation => {
    const newConvo = { ...conversation };
    newConvo.messages = newConvo.messages.sort((a, b) => {
      if(a.createdAt < b.createdAt){
        return -1;
      }else if(a.createdAt > b.createdAt){
        return 1;
      }else{
        return 0;
      }
    });
    return newConvo;
  });
};
