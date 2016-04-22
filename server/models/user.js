'use strict';
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: { 
      type: DataTypes.STRING,
      validate: {len: {args:[6, 30], msg: "Username must be atleast minimum of 6 characters"}}
    },
    password: { 
      type: DataTypes.STRING,
      validate: {len: {args:[6, 30], msg: "Password must be atleast minimum of 6 characters"}}
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {isEmail: { msg: "Invalid email format"}}
    },
    first_name: { 
      type: DataTypes.STRING,
      validate: {len: {args:[2, 30], msg: "First Name must be atleast minimum of 2 characters"}}
    },
    last_name: { 
      type: DataTypes.STRING,
      allowNull: true,
      validate: {len: {args:[6, 30], msg: "Last Name must be atleast minimum of 6 characters"}}
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {isDate: {msg: "Invalid date format"}}
    },
    address: DataTypes.STRING,
    gender: { 
      type: DataTypes.STRING,
      allowNull: true,
      validate: {is:{args:[".*?((?:fe)?male).*"], msg: "Invalid Gender Type"}}
    },
    status: DataTypes.BOOLEAN,
    is_chat: DataTypes.BOOLEAN
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
      // isEmail: function() {
      //   if (this.email == null) {
      //     throw new Error('Require either both latitude and longitude or neither')
      //   }
      // }
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