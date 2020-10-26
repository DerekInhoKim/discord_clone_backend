'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    status: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  }, {});
  User.associate = function(models) {

    const serverUserMapping = {
      through: 'ServerUser',
      otherKey: 'serverId',
      foreignKey: 'userId'
    }

    const privateChatUserMapping = {
      through: 'PrivateChatUser',
      otherKey: 'privateChatId',
      foreignKey: 'userId'
    }

    User.belongsToMany(models.Server, serverUserMapping)
    User.belongsToMany(models.PrivateChat, privateChatUserMapping)
    User.hasMany(models.Message, {foreignKey: 'userId'})
    User.hasMany(models.privateChatMessage, {foreignKey: 'userId'})
  };
  return User;
};
