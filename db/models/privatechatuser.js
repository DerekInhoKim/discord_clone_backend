'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateChatUser = sequelize.define('PrivateChatUser', {
    userId: DataTypes.INTEGER,
    privateChatId: DataTypes.INTEGER
  }, {});
  PrivateChatUser.associate = function(models) {

  };
  return PrivateChatUser;
};
