'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateChatUser = sequelize.define('PrivateChatUser', {
    userId: DataTypes.INTEGER,
    privateChatId: DataTypes.INTEGER
  }, {});
  PrivateChatUser.associate = function(models) {
    PrivateChatUser.belongsTo(models.PrivateChat, {foreignKey: 'privateChatId'});
    PrivateChatUser.belongsTo(models.User, {foreignKey: 'userId'});
  };
  return PrivateChatUser;
};
