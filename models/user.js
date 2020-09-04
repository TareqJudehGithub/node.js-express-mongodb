//imports
const getDB = require("../util/database").db;
const ObjectId = require("mongodb").ObjectId;

class User {
     constructor(username, email, cart, id){
          this.name = username;
          this.email = email;
          this.cart = cart;
          this._id = id;    
     }
     save() {
         const db = getDB();
         return db.collection("users")
         .insertOne(this)
         .then((result) => {
          console.log(this.name + " was successfully added to DB.");
         }).catch((err) => {
              console.log(err);
         });
     };
    
     addtoCart(product) {
          const cartProductIndex = this.cart.items.findIndex(cp => {
               //Checking if the item exists:
               return cp.productId.toString() === product._id.toString();
          });
          //if the product did not exist in the cart:
          let newQuantity = 1;
           //creating a new array in order to update the cart:
          const updatedCartItems = [...this.cart.items];
          //if the product exists: (not in negative value)
          if(cartProductIndex >= 0){
               //update the existing product quantity in cart:
               newQuantity = this.cart.items[cartProductIndex].quantity +1;
               updatedCartItems[cartProductIndex].quantity = newQuantity;
          }
          //Or add a new product to the cart:
          else {
               updatedCartItems.push({
                    productId: ObjectId(product._id), 
                         title: product.title,
                         price: product.price,
                         quantity: newQuantity
               })
          }
          const updatedCart = {
               items: updatedCartItems
          };
          //Updating the user db documents cart with added products (check Compass):
          const db = getDB();
          return db
          .collection("users")      
          .updateOne({ _id: ObjectId(this._id) },
          { $set: {cart: updatedCart} } )
     };
     getCart() {
          const productIds = this.cart.items.map(id => {
               return id.productId;
          });
          const db = getDB()
          return db
          .collection("products")
          .find({_id: {$in: productIds}})
          .toArray()
          //we have an array of products fetched from the mongodb database:
          .then(products => {
               return products.map(product => {
                    return {...product, quantity: this.cart.items.find(i => {
                         //to identify the one product(from .find()) in all cart items, matches
                         //the id of the product we fetched from the database.
                         return i.productId.toString() === product._id.toString();
                    })
                    .quantity
               };
               })
          })
          .catch(err => {console.log(err)});
     }

     deleteItemFromCart(productID) {
          const updatedCartItems = this.cart.items.filter(item => {
     //We will filter (remove) the item which is removed from the cart,
     //and return the rest of the cart items:
               return item.productId.toString() !== productID.toString()
          });
          const deletedItem = this.cart.items.map(item => {
               return item.title;
          })
          console.log(" Item title: " + deletedItem);
          const db = getDB();
          return db
          .collection("users")
     //and that updates the cart with all items except the one we deleted.
          .updateOne(
               { _id: ObjectId(this._id) },
               {$set: {cart: {items: updatedCartItems}}}
               )
     };
     //fetching orders on Orders page:
    
     //Adding/moving cart from cart to orders:
     addOrder() {
          const db = getDB();
          //1. fetching products array details which are already in the cart:
          return this.getCart()
          //2. creating order based on the products details coming from 1:
          .then(products => {
               const order = {
                    items: products,
                    user: {
                         _id: new ObjectId(this._id),
                         name: this.name,             
                    }                            
          };
          //3. insert the created order in 2, in the "orders" collection:
          console.log("thank you for your Order!")
          return db
          .collection("orders")
          .insertOne(order)
          })
          //4. if step 3 was a success, then we clear the cart: 
          .then(result => {
               this.cart = {items: [] };
               console.log("Cart now is empty: "+ this.cart.items)
               //5. finally, we remove all cart products from "users" db:
               return db
               .collection("users")
               .updateOne(
                    { _id: new ObjectId(this._id)},
                    { $set: { cart: { items: [] } } }
               );
          });
     };
     getOrders() {
          const db = getDB();
          return db
          .collection("orders")
          .find({ "user._id": new ObjectId(this._id) })
          .toArray();
     }

     static findById(userId) {
          const db = getDB();
          return db
          .collection("users")
          .findOne({ _id: new ObjectId(userId) })
          .then(user => { 
               return user;
          })
          .catch(err => {
               console.log(err);
          });
     }

}
module.exports = User;