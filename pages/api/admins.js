import { mongooseConnect } from "@/lib/mongoose";
import AdminModel from '@/models/Admins'

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    if (method === 'POST') {
        try{

            const {admins} = req.body;
            await AdminModel.findByIdAndUpdate("6466267fd5714d7098e12352",{
                admins:admins
            })
            res.status(200).json('ok');
        
        }catch(e){
            res.status(400).json(e);
        }
        
    }
    if (method === 'GET') {
        const response = await AdminModel.find({});
        res.json(response[0].admins);
    }
}
