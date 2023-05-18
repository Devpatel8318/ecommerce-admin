import mongoose,{Schema,model, models } from "mongoose";

const AdminSchema = new Schema({
   admins:[{type:String}],
})


const AdminModel = models?.AdminModel || model('AdminModel',AdminSchema);
module.exports = AdminModel;