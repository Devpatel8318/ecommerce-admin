import clientPromise from '@/lib/mongodb'
import NextAuth, { getServerSession } from 'next-auth'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import GoogleProvider from 'next-auth/providers/google'
import AdminModel from '@/models/Admins'
import { mongooseConnect } from '@/lib/mongoose'
// const adminEmails = ['dummy5252acc@gmail.com','chokhawalajiya3110@gmail.com'];



export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: "277156471647-7jgjicd621dqtuihamprlld8g3hot4oa.apps.googleusercontent.com",
            clientSecret:"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"
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks:{
        session:async ({session,token,user})=>{
            

           const adminEmails = await adminsFinder();
            if(adminEmails.includes(session?.user?.email)){
                return session;
            }
            else{

                //ALERT !!!!!! THIS WILL ALLOW ALL TO JOINNN!!!!
                // return false;
                return session;
            }
        },
    },secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);

export async function isAdminRequest(req,res){
    const session = await getServerSession(req,res,authOptions);
    const adminEmails = await adminsFinder();
    if(!adminEmails.includes(session?.user?.email)){
        res.status(401);
        res.end();
        throw 'not an Admin';
    }
}

export async function adminsFinder(){
    mongooseConnect();
    const response =  await AdminModel.find({});
    return response[0].admins;
}