import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../../../firebase';
import 'firebase/firestore';
import api from '../../../services/api';

import { Container } from './styles';

interface orderData extends firebase.firestore.DocumentData {
  id: string;
  title: string;
  bookingDate: string;
  address: {
    city: string;
    country: string;
    street: string;
    zip: string;
  };
  customer: {
    email: string;
    name: string;
    phone: string;
  };
}

const Dashboard = () => {
  const [orders, setOrders] = useState<orderData[]>([]);
  const history = useHistory();

  useEffect(() => {
    // const fetchData = async () => {
    //   const db = firebase.firestore();
    //   const snapshot = await db.collection('orders').get();

    //   setOrders(snapshot.docs.map(doc => doc.data()));
    // };

    const fetchData = () => {
      api
        .get<orderData[]>('/orders')
        .then(response => {
          setOrders(response.data);
        })
        .catch(error => {
          console.log(error.message);
          alert(error.message);
        });
    };

    fetchData();
  }, []);

  const handleClick = (event: any) => {
    event.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(res => {
        history.push('/auth/login');
      });
  };
  return (
    <Container>
      <h1>Dashboard</h1>
      <h2>Welcome to Dashboard!</h2>
      <br />
      <br />
      <button onClick={handleClick}>Logout</button>
      <br />
      {orders.map((order: orderData) => (
        <li key={order.id}>
          <span>{order.title}</span>
        </li>
      ))}
    </Container>
  );
};
export default Dashboard;
