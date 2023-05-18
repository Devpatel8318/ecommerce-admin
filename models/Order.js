import mongoose, {Schema,model, models } from "mongoose";

const OrderSchema = new Schema({
    line_items:Object,
    name:String,
    email:String,
    city:String,
    address:String,
    postalCode:String,
    paid:Boolean,
},{
    timestamps:true
});


const Order = models?.Order || model('Order',OrderSchema);
module.exports = Order;