import Layout from '@/components/Layout';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function OrdersPage() {

    const [orders, setOrders] = useState([]);


    useEffect(() => {
        axios.get('api/orders').then((response) => {
            setOrders(response.data);
            // console.log(response.data);
        });
    }, []);

    return (
        <Layout>
            <table className="basic">
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>PAID</td>
                        <td>Recipient</td>
                        <td>Products</td>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt)).toLocaleString(undefined, { hour12: true })}</td>
                            <td className={order.paid ? 'text-green-600':'text-red-600'}>{order.paid?'YES':'NO'}</td>
                            <td>{order.name} <span> </span> 
                                {order.email} <br /> <span> </span>
                                {order.address} <span></span>
                                {order.city} <br /> <div /> {order.postalCode}</td>
                            <td>
                                {order.line_items.map(l => (
                                    <div key={l.name}>
                                        {l.price_data.product_data?.name} X {l.quantity}<br />
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </Layout>
    )
}

export default OrdersPage;