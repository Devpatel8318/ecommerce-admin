import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useState } from 'react'
import axios from "axios";
import { redirects } from '@/next.config';
import { useRouter } from "next/router"
import Spinner from './Spinner';
import { ReactSortable } from "react-sortablejs";

function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});

    useEffect(() => {
        axios.get('/api/categories').then(res => {
            setCategories(res.data);
        })
    }, [])

    async function saveProduct(ev) {
        ev.preventDefault();

        const data = {
            title, description, price, images, category,
            properties: productProperties
        };

        if (_id) {
            // console.log(productProperties);
            await axios.put('/api/products', { ...data, _id })
        } else {
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);

    }

    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('upload_preset', 'my-uploads');

            const promises = Array.from(files).map(async file => {
                const formData = new FormData();
                formData.append('upload_preset', 'my-uploads');
                formData.append('file', file);
                const r = await fetch('https://api.cloudinary.com/v1_1/dwxhnwqw2/image/upload', {
                    method: 'POST',
                    body: formData,
                });
                return await r.json();
            });

            Promise.all(promises)
                .then(results => {
                    const urls = results.map(result => result.secure_url);
                    setImages(prev => [...prev, ...urls]);
                    setIsUploading(false);

                })
                .catch(error => {
                    console.error(error);
                });

        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProp(name, value) {
        setProductProperties(prev => {
            // console.log(prev);
            const newProductProps = { ...prev };
            newProductProps[name] = value;
            return newProductProps;
        })
    }

    return (
        <form onSubmit={saveProduct}>

            <label >Product name</label>
            <input value={title} onChange={ev => setTitle(ev.target.value)} type="text" placeholder='product name' />


            <div className='mt-4'>
                <label>
                    Category
                </label>
            </div>

            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">UnCategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name} </option>
                ))}
            </select>

            {categories?.length > 0 && propertiesToFill.map(p => (
                <div key={p.name} className=''>
                    <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                    <div>
                        <select
                            value={productProperties[p.name]}
                            onChange={(ev) => setProductProp(p.name, ev.target.value)}>
                            {p.values.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}


            <div className='mt-6'>
                <label>
                    Photos
                </label>
            </div>
            <div className='mb-2 flex flex-wrap gap-2'>


                <ReactSortable list={images} setList={updateImagesOrder}
                    className='flex flex-wrap gap-2' >


                    {!!images?.length && (
                        images.map(link => (
                            <div key={link} className='h-24 bg-bgGray p-1 shadow-sm rounded-sm'>
                                <img src={link} alt="image" className='rounded-lg' />
                            </div>
                        ))
                    )}

                </ReactSortable>



                {isUploading && (
                    <div className='h-24  flex items-center'>
                        <Spinner />
                    </div>
                )}
                <label className='w-24 h-24 flex flex-col items-center cursor-pointer justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-sm border border-gray-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Add Image
                    </div>
                    <input type="file" multiple onChange={uploadImages} className='hidden' />
                </label>
            </div>

            <label >Description</label>
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder='description'></textarea>

            <label>Price</label>
            <input value={price} onChange={ev => setPrice(ev.target.value)} type="number" placeholder='price' />

            <button type="submit" className='btn-primary'>Save</button>

        </form>

    )
}

export default ProductForm;