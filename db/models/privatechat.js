'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateChat = sequelize.define('PrivateChat', {
  }, {});
  PrivateChat.associate = function(models) {

    const privateChatUserMapping = {
      through: 'PrivateChatUser',
      otherKey: 'userId',
      foreignKey: 'privateChatId'
    }

    PrivateChat.belongsToMany(models.User, privateChatUserMapping)
    PrivateChat.hasMany(models.privateChatMessage, {foreignKey: 'privateChatId'})
  };
  return PrivateChat;
};
