import Layout from "@/components/Layout";
import { useSession } from "next-auth/react"
import Head from "next/head";



export default function Home() {

  const { data: session } = useSession();

  return (
    <Layout>
      <Head>
        <title>Dev Cart|Admin</title>
    </Head>
      <div className="text-blue-900 flex justify-between">
        <h1>
          Hello, <b>{session?.user.name}</b>
        </h1>
        <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
          <img src={session?.user?.image} className="w-6 h-6" alt="dp" />
          <span className="px-2">{session?.user.name}</span>
        </div>
      </div>
    </Layout>
  )

}
