'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateChatMessage = sequelize.define('PrivateChatMessage', {
    message: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    privateChatId: DataTypes.INTEGER
  }, {});
  PrivateChatMessage.associate = function(models) {
    PrivateChatMessage.belongsTo(models.User, {foreignKey: 'userId'})
    PrivateChatMessage.belongsTo(models.PrivateChat, {foreignKey: 'privateChatId'})
  };
  return PrivateChatMessage;
};
