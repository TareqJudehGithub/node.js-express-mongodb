//imports:
const ObjectId = require("mongodb").ObjectId;
//access to mongoDB in this file:
const getDB = require("../util/database").db;

class Product {
     constructor(title, price, imageUrl, description, id, userId) {
          this.title = title;
          this.price = price;
          this.imageUrl = imageUrl;
          this.description = description;
          this._id = id ? new ObjectId(id) : null;
          this.userId = userId;
     } 
    
     //Saving product in MongoDB
     save() {      
          const db = getDB();  //mongodb database access
          let dbOp;
          //if the document is already in the db, then
          //update it in the Update Product action controllers:
          if(this._id) {
               //update the product
               dbOp = db
               .collection("products")
               .updateOne({ _id: this._id}, {$set: this})
               .then(result => {
                    console.log(this.title + " updated successfully!");
               })
               .catch(err => {
                    console.log(err);
               })
          } 
          //else: create this new item (Add product action controller)
          else{
               dbOp = db.collection("products")  //mongodb collection connect/creation
          .insertOne(this)
          .then(result => {
               console.log(this.title + " was successfully added!");
          })
          .catch(err => {
               console.log(err);
          })
          }
          return dbOp
          .then(result => {
          })
          .catch(err => {
               console.log(err);
          });
     };
    
     static fetchAll() {
          const db = getDB()  
          return db
          .collection("products")
          .find()  
          .toArray()
          .then(products => {
               console.log("Loading products page successfully.");
               return products;
          })
          .catch(err => {
               console.log(err);
          })
     }
     static findById(ID) {
          const db = getDB();
          return db
          .collection("products")
          .findOne({_id: new ObjectId(ID) })
          .then(product => {
               console.log(product.title + " found by ID.")
               return product;
          })
          .catch(err => {
               console.log(err);
          }) 
     }
     
     static deleteById(id) {

          const db = getDB();
          return db
          .collection("products")
          .deleteOne({_id: new ObjectId(id)})
          .then(result => {
               console.log("Item was successfully deleted!");        
          })
          .catch(err => {
               console.log(err);
          })
     }
}
module.exports = Product;