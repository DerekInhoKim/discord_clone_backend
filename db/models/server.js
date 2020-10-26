'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    serverName: DataTypes.STRING
  }, {});
  Server.associate = function(models) {
    const serverUserMapping = {
      through: 'ServerUser',
      otherKey: 'userId',
      foreignKey: 'serverId'
    }
    Server.belongsToMany(models.User, serverUserMapping)
    Server.hasMany(models.Channel, {foreignKey: 'serverId'})
  };
  return Server;
};
