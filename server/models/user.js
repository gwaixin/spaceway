'use strict';
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {isEmail: true}
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      comparePassword: function(user, password) {
       return (decrypt(user.password) == password);
      }
    }
  }, { 
    validate: {
      bothCoordsOrNone: function() {
        if ((this.latitude === null) !== (this.longitude === null)) {
          throw new Error('Require either both latitude and longitude or neither')
        }
      }
    }
  });

  User.beforeCreate(function(user, options) {
    user.password = encrypt(user.password);
    user.status = true;
    return user;
  });

  function encrypt(text) {
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }

  return User;
};