'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User, {foreignKey: 'userId'})
    Message.belongsTo(models.Channel, {foreignKey: 'channelId'})
  };
  return Message;
};
