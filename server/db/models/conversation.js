const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// find conversation if sender is a part of

Conversation.validateSender = async function (sender, conversationId) {
  const conversation = await Conversation.findOne({
    where: {
      [Op.and]: {
        id: {
          [Op.eq]: conversationId
        },
        [Op.or]: {
          user1Id: {
            [Op.eq]: sender
          },
          user2Id: {
            [Op.eq]: sender
          }
        }
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
