import Layout from '@/components/Layout'
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import { withSwal } from 'react-sweetalert2';

function Admins({ swal }) {

    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        axios.get('/api/admins').then(response => {
            setAdmins(response.data);
        })
        // console.log("i am effect");
    }, [])


    function deleteAdmin(admin) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to remove ${admin}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes Remove!',
            reverseButtons: true,
            confirmButtonColor: '#d55'
        }).then(async result => {
            if (result.isConfirmed) {
                // console.log(admins);
                const newList = admins.filter(item => item !== admin)
                setAdmins(newList)
                // console.log(admins);
            }
        })
    }

    function enterNewAdmin(admin) {
        swal.fire({
            title: 'Enter New Admin',
            input: 'text',
            inputLabel: 'email',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value && value === ' ' && value === undefined) {
                    return 'You need to write something!'
                }
            }
        }).then(async result => {
            if (result.value !== " " && result.value !== undefined && result.value !== "") {
                const newList = [...admins, result.value]
                setAdmins(newList)
            }
        })
    }

    async function saveNewAdmins() {
        const response = await axios.post('/api/admins', {
            admins,
        });
        // console.log("Response", response);
        if (response.status === 200) {
            let timerInterval
            swal.fire({
                title: 'Admins Updated!',
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                if (result.dismiss === swal.DismissReason.timer) {
                    // console.log('I was closed by the timer')
                }
            })
        }
    }

    return (
        <Layout>
            <Head>
                <title>Dev Cart|Admin</title>
            </Head>
            <h1 className='text-center text-2xl font-bold'>Admins</h1>

            <div className='flex justify-center'>
                {admins && admins?.length > 0 && (
                    <table className="basic mt-4">
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Remove</td>
                            </tr>
                        </thead>
                        <tbody>
                            {admins && admins.length > 0 && Array.isArray(admins) && admins?.map(admin => (
                                <tr key={admin}>
                                    <td>
                                        {admin}
                                    </td>
                                    <td className='flex justify-center'>
                                        <button onClick={() => deleteAdmin(admin)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className='flex gap-6 mt-5 justify-center'>

                <button className='bg-primary py-2 px-4 text-white  rounded-md' onClick={() => enterNewAdmin()}>Add New Admin</button>
                <button className='bg-green-500 shadow-md py-2 px-4 text-white rounded-md' onClick={saveNewAdmins}>Save</button>
            </div>
        </Layout>
    )
}




export default withSwal(({ swal }, ref) => (
    <Admins swal={swal} />
));