import Layout from '@/components/Layout'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { withSwal } from 'react-sweetalert2';



function Categories({ swal }) {

    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    const [properties, setProperties] = useState([]);

    async function saveCategory(ev) {

        ev.preventDefault();
        if (editedCategory) {
            await axios.put('/api/categories', {
                name,
                parentCategory,
                _id: editedCategory._id,
                properties: properties.map(p => ({
                    name: p.name,
                    values: p.values.split(','),
                }))
            });
        } else {
            await axios.post('/api/categories', {
                name,
                parentCategory,
                properties: properties.map(p => ({
                    name: p.name,
                    values: p.values.split(','),
                })),
            });
        }
        setName('');
        setEditedCategory(null);
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('api/categories').then((response) => {
            setCategories(response.data);
        })
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({name,values})=>({
            name,
            values : values.join(','),
        })));
    }


    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes Delete!',
            reverseButtons: true,
            confirmButtonColor: '#d55'
        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete('/api/categories?_id=' + category._id);
                fetchCategories();
            }
        })
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {
                name: '', values: ''
            }]
        })
    }

    function handlePropertyNameChange(index, property, newName) {
        // console.log(index, property, newName);
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
        // console.log(index, property, newValues);
        // console.log(properties);
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <Layout>
            <h1 className="title"> Categories </h1>

            <label>{editedCategory
                ? `Edit Category ${editedCategory.name}`
                : "Create new category"}</label>
            <form onSubmit={saveCategory} className=''>

                <div className="flex gap-1">
                    <input className='' value={name} onChange={(ev) => setName(ev.target.value)} type="text" placeholder={'Category name'} />
                    <select className='' value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                        <option value="">No parent Category</option>
                        {categories.length > 0 &&
                            categories.map(category => (
                                <option value={category._id} key={category.name}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='mb-2'>
                    <label className='block mt-1'>Properties</label>
                    <button
                        onClick={addProperty}
                        type='button'
                        className='btn-default mt-1 text-sm'>Add new property</button>
                </div>

                {properties?.length > 0 && properties.map((p, index) => (
                    <div className='flex gap-1 mb-2'>
                        <input type="text"
                            value={p.name}
                            className='mb-0'
                            onChange={(ev) => handlePropertyNameChange(index, p, ev.target.value)}
                            placeholder='property name (example:color)' />
                        <input type='text'
                            className='mb-0'
                            onChange={ev => handlePropertyValuesChange(index, p, ev.target.value)}
                            value={p.values}
                            placeholder='values, comma separated values' />
                        <button type='button' onClick={() => removeProperty(index)} className="btn-default">Remove</button>
                    </div>
                ))}
                <div className="flex gap-1">
                    {editedCategory && (
                        <button onClick={() => {
                            setEditedCategory(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                        }} type='button' className='btn-default mt-4'>cancel</button>
                    )}
                    <button type='submit' className='btn-primary mt-4'>Save</button>
                </div>
            </form>

            {!editedCategory && (
                <table className='basic mt-4'>
                    <thead>
                        <tr>
                            <td>Category Name</td>
                            <td>Parent Category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 &&
                            categories.map(category => (
                                <tr key={category.name}>
                                    <td> {category.name}</td>
                                    <td>{category.parent?.name}</td>
                                    <td>
                                        <button onClick={() => editCategory(category)}
                                            className='btn-primary mr-1'
                                        >Edit</button>

                                        <button onClick={() => deleteCategory(category)} className='btn-red'>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )}

        </Layout>
    )



}


export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));