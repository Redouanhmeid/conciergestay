module.exports = (db, type) => {
  return db.define('guest', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: type.STRING,
      allowNull : false,
      unique: true
    },
    password: {
      type: type.STRING,
      allowNull : false
    },
    firstname: {
      type: type.STRING,
      allowNull : false
    },
    lastname: {
      type: type.STRING,
      allowNull : false
    },
    phone: {
      type: type.STRING
    }
  })
}