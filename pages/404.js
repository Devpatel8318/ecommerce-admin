import Layout from '@/components/Layout'
import Head from 'next/head'
import React from 'react'

function ErrorPage() {
  return (
   <Layout>
    <Head>
        <title>Dev Cart|Admin</title>
    </Head>
    <div className='flex h-screen items-center justify-center'>
       <div className=' text-4xl'> Work In Progress</div> 
    </div>
   </Layout>
  )
}

export default ErrorPage