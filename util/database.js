//MongoDB import and connection:
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// _ means this var will only be used internally in this file.
let _db;
//storing and connecting to MongoDB:
const mongoConnect = (callback) => {
     MongoClient.connect(
          "mongodb+srv://TJDBuser:D6INl1sR8aBSzvtn@nodemongodb-bm3zf.mongodb.net/express-mongodb?retryWrites=true&w=majority",
          { useUnifiedTopology: true }
          )
          .then(client => {
               console.log("Connection to MongoDB established successfully! ");
               //store connection access to the mongodb in var _db:
               _db = client.db()
               callback();
          })
          .catch(err => {
               console.log("Error connecting to MongoDB! " + err)
               throw err;

          });     
}
//check if connection to mongodb is established:
const getDB = () => {
     if (_db)
     return _db;
     {
          throw "Error! database not found!"
     }
};
exports.mongoConnect = mongoConnect;
exports.getDB = getDB;

// module.exports = {
//      MongoConnect: mongoConnect,
//      getDB: getDB
// };


