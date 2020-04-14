//imports:
//access to mongoDB in this file:
const getDB = require("../util/database").getDB;


class Product {
     constructor(title, price, imageUrl, description) {
          this.title = title;
          this.price = price;
          this.imageUrl = imageUrl;
          this.description = description;
     }
     //Saving product in MongoDB
     save() {
          const db = getDB();  //mongodb database name define
          db.collection("products")  //mongodb collection connect/creation
          .insertOne(this)
          .then(result => {
               console.log(result);
          })
          .catch(err => {
               console.log(err);
          })

     }
}

module.exports = Product;