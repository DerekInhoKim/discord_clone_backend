const { Channel, User, Message } = require("../db/models");

// A helper function to add messages to the channel itself.
const addMessageToChannel = async (userName, channelId, messageContent) => {
  console.log(channelId, messageContent);
  try {
    const channel = await Channel.findByPk(channelId);
    const user = await User.findOne({
      where: {
        userName: userName
      }
    })
    const userId = user.id
    const message = await Message.create({
      message: messageContent,
      userId,
      channelId,
    });
    message.setChannel(channel);
    await message.save();

    // console.log('MESSAGEHERE',message)
    return message
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  addMessageToChannel
}
