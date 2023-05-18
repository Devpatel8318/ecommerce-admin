import clientPromise from '@/lib/mongodb'
import NextAuth, { getServerSession } from 'next-auth'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['dummy5252acc@gmail.com'];

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: "277156471647-7jgjicd621dqtuihamprlld8g3hot4oa.apps.googleusercontent.com",
            clientSecret:"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"
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks:{
        session:({session,token,user})=>{
            // console.log(session.user);
            if(adminEmails.includes(session?.user?.email)){
                return session;
            }
            else{
                return false;
            }
        },
    },
}

export default NextAuth(authOptions);

export async function isAdminRequest(req,res){
    const session = await getServerSession(req,res,authOptions);
    if(!adminEmails.includes(session?.user?.email)){
        res.status(401);
        res.end();
        throw 'not an Admin';
    }
}