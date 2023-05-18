import Layout from '@/components/Layout'
import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function DeleteProductPage() {

    const router = useRouter();
    const [productInfo,setProductInfo] = useState();

    const {id} = router.query;

    useEffect(()=>{
        if(!id){
            return;
        }else{
            axios.get('/api/products?id=' + id).then(response => {
                setProductInfo(response.data);
              })
        }
    },[id])

    function goBack(){
        router.push('/products');
    }
    async function deleteProduct(){
        await axios.delete('/api/products?id='+id);
        goBack();
    }



  return (
    <Layout>
        <h1 className='title text-center text-9xl'>Do you Really Want to delete product 
        &nbsp; "{productInfo?.title}"?</h1>

        <div className="flex gap-2 justify-center mt-3">
        <button className='btn-red' onClick={deleteProduct} >Yes</button>
        <button  className='btn-default' onClick={goBack}>No</button>
        </div>
    </Layout>
  )
}

export default DeleteProductPage