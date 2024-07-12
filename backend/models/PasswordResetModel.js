module.exports = (db, type) => {
 return db.define(
  'password_reset',
  {
   email: {
    type: type.STRING,
    allowNull: false,
   },
   code: {
    type: type.STRING,
    allowNull: false,
   },
   expiresAt: {
    type: type.DATE,
    allowNull: false,
   },
  },
  {
   timestamps: false,
  }
 );
};
