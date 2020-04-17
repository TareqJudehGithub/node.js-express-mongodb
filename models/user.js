//imports
const getDB = require("../util/database").db;
const ObjectId = require("mongodb").ObjectId;

class User {
     constructor(username, email, id){
          this.name = username;
          this.email = email;
          this._id = id; 
          // ? new ObjectId(id) : null
     }
     save() {
         const db = getDB();
         return db.collection("users")
         .insertOne(this)
         .then((result) => {
              console.log(this.name + " was successfully added to DB.");
          //     console.log("result: " + result);
         }).catch((err) => {
              console.log(err);
         });

     }
     static findById(userId) {
          const db = getDB();
          return db
          .collection("users")
          .findOne({ _id: new ObjectId(userId) })
          //.next() //we call next() to get the 1st and only elements that matters. 
          .then(user => { //next()
               
             
          }).catch(err => {
               console.log(err);
          });
     }
}
module.exports = User;