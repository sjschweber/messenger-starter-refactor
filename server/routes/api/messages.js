const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});
// expects { conversationId, messageId } in body
router.put("/read", async(req, res, next) => {
  try{
    if (!req.user) {
      return res.sendStatus(401);
    }
    const readerId = req.user.id;
    const { conversationId, messageId } = req.body;
    const message = await Message.update({ isRead: true }, {
      where: {
        [Op.and]: {
          id:{
            [Op.lte]: messageId,
          },
          senderId: {
            [Op.ne]: readerId,
          },
          conversationId: {
            [Op.eq]: conversationId,
          }
        }
      }
    })
    const lastRead = await Message.update({ isMostRecentRead: true }, {
      where: {
        id: {
          [Op.eq]: messageId,
        }
      }
    })
    const prevLastRead = await Message.update({ isMostRecentRead: false }, {
      where: {
        [Op.and]: {
          id: {
            [Op.ne]: messageId,
          },
          senderId: {
            [Op.ne]: readerId,
          },
          conversationId: {
            [Op.eq]: conversationId,
          }
        }
      }
    })
    res.json({ messageId, conversationId, readerId });
  } catch (error) {
    next(error)
  }
})
module.exports = router;
