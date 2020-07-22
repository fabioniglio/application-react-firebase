import React, { useState, useEffect, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
// import DatePicker from '../../../components/DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import fromUnixTime from 'date-fns/fromUnixTime';
import getTime from 'date-fns/getTime';
import { format, getUnixTime } from 'date-fns';
import { Form } from '@unform/web';
import api from '../../../services/api';
import firebase from '../../../firebase';
import 'firebase/firestore';

import { FiPower } from 'react-icons/fi';
import {
  Container,
  Header,
  HeaderContent,
  Content,
  ContentTitle,
  ContentInput,
} from './styles';

import Input from '../../../components/Input';
import Button from '../../../components/Button';

interface OrderParams {
  order: string;
}

interface orderData {
  uid: string;
  title: string;
  bookingDate: number;
  dateFormatted?: string;
  address: {
    city: string;
    country: string;
    street: string | undefined;
    zip: string;
  };
  customer: {
    email: string;
    name: string | undefined;
    phone: string;
  };
}

const OrderDetail = () => {
  const [order, setOrder] = useState<orderData | undefined>();

  const [startDate, setStartDate] = useState<Date | null>();

  const [newDate, setNewDate] = useState<Date>();
  const { params } = useRouteMatch<OrderParams>();
  const history = useHistory();

  useEffect(() => {
    console.log(params.order);

    function fetchData() {
      api
        .get<orderData>(`orders/${params.order}`)
        .then(response => {
          console.log('test ' + response.data.bookingDate);

          const order = response.data;
          const dateFormatted = fromUnixTime(order.bookingDate);

          console.log(dateFormatted);

          setNewDate(dateFormatted);
          setStartDate(dateFormatted);
          const orderFormatted = {
            ...order,
            dateFormatted: format(
              fromUnixTime(order.bookingDate),
              'dd/MM/yyyy',
            ),
          };

          setOrder(orderFormatted);
        })
        .catch(error => {
          console.log(error.message);
          alert(error.message);
        });
    }

    fetchData();
  }, [setOrder, params.order]);

  const handleSignOut = (event: any) => {
    event.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(res => {
        history.push('/auth/login');
      });
  };

  const handleUpdateOrder = useCallback(async (data: orderData) => {
    const id = params.order;
    console.log(data.bookingDate);
    const { title, bookingDate } = data;
    try {
      console.log('uid ' + id);
      console.log(startDate);
      let newDate: Date;
      if (startDate) {
        newDate = new Date(startDate);
      } else {
        newDate = new Date();
      }

      const bodyData = {
        title,
        bookingDate: getUnixTime(newDate),
      };
      console.log(bodyData);
      await api.put(`/orders/${id}`, bodyData);

      history.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <h1>Order detail</h1>
          <button onClick={handleSignOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Form
          initialData={{
            title: order?.title,
            booking: order?.dateFormatted,
            city: order?.address.city,
            country: order?.address.country,
            street: order?.address.street,
            zip: order?.address.zip,
            name: order?.customer.name,
            email: order?.customer.email,
            phone: order?.customer.phone,
          }}
          onSubmit={handleUpdateOrder}
        >
          <ContentInput>
            <h1>Order Title</h1>
            <ContentTitle>
              <Input name="title" placeholder="Title" />
            </ContentTitle>
          </ContentInput>

          <ContentInput>
            <h1>Booking Date</h1>
            <ContentTitle>
              <Input name="booking" placeholder="Date"></Input>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </ContentTitle>
          </ContentInput>

          <ContentInput></ContentInput>

          <ContentInput>
            <h1>Adress</h1>
            <ContentTitle>
              <Input name="city" placeholder="City" disabled={true} />
              <Input name="country" placeholder="Country" disabled={true} />
              <Input name="street" placeholder="Street" disabled={true} />
              <Input name="zip" placeholder="Postal Code" disabled={true} />
            </ContentTitle>
          </ContentInput>

          <ContentInput>
            <h1>Customer</h1>
            <ContentTitle>
              <Input name="name" placeholder="Customer Name" disabled={true} />
              <Input
                name="email"
                placeholder="Customer E-mail"
                disabled={true}
              />
              <Input
                name="phone"
                placeholder="Customer Phone"
                disabled={true}
              />
            </ContentTitle>
          </ContentInput>

          <Button type="submit">Confirm Changes</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default OrderDetail;
