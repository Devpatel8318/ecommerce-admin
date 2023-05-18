import { mongooseConnect } from "@/lib/mongoose";
import Products from "../../models/Product";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";


export default async function handler(req, res) {

    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);
    // parentCategory || undefined,
    if (method === 'POST') {
        const { title, description, price,images,category,properties } = req.body;
        const productDoc = await Products.create({
            title, description, price,images,category: category || undefined,properties
        })
        res.json(productDoc);
    }
    if(method === 'GET'){

        if(req.query?.id){
            res.json(await Products.findOne({_id:req.query.id}));
        }else{``
            res.json(await Products.find());;
        }
    }
    if(method === 'PUT'){
        const { title, description, price,_id,images,category,properties } = req.body;
        await Products.updateOne({_id},{title, description,images, price,category: category || undefined,properties});
        res.json(true);
    }

    if(method === 'DELETE'){
        if(req.query?.id){
            res.json(await Products.deleteOne({_id:req.query.id}));
            res.json(true);
        }
    }
}
