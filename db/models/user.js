'use strict';

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validates: {
        len: [1, 255],
      },
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validates: {
        len: [1, 255],
      },
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      validates: {
        len: [1, 255],
      },
    },
    status: DataTypes.STRING,
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validates: {
        isEmail: true,
        len: [3, 255],
      }
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY,
      validates: {
        len: [60, 60],
      },
    },
    tokenId: {
      type: DataTypes.STRING
    }
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
    User.hasMany(models.PrivateChatMessage, {foreignKey: 'userId'})
  };

  User.prototype.isValid = () => true

  User.prototype.setPassword = function(password) {
    this.hashedPassword = bcrypt.hashSync(password);
    return this;

  };

  User.prototype.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());

  }

  User.prototype.toSafeObject = function () {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.userName,
      status: this.status,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
  return User;
};
