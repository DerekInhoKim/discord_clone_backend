'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    channelName: DataTypes.STRING,
    serverId: DataTypes.INTEGER
  }, {});
  Channel.associate = function(models) {
    Channel.hasMany(models.Message, {foreignKey: 'channelId'})
    Channel.belongsTo(models.Server, {foreignKey: 'serverId'})
  };
  return Channel;
};
