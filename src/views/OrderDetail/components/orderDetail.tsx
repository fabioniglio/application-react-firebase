import React, { useState, useEffect, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import fromUnixTime from 'date-fns/fromUnixTime';

import { format, getUnixTime } from 'date-fns';
import { Form } from '@unform/web';
import api from '../../../services/api';
import firebase from '../../../firebase';
import 'firebase/firestore';

import { FiPower, FiArrowLeft } from 'react-icons/fi';
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
  bookingDate?: number;
  dateFormatted?: string;
  address?: {
    city: string | undefined;
    country: string | undefined;
    street: string | undefined;
    zip: string | undefined;
  };
  customer: {
    email: string | undefined;
    name?: string | undefined;
    phone: string | undefined;
  };
}

const OrderDetail = () => {
  const [order, setOrder] = useState<orderData>();

  const [startDate, setStartDate] = useState<Date | null>();

  const { params } = useRouteMatch<OrderParams>();
  const history = useHistory();

  useEffect(() => {
    function fetchData() {
      api
        .get<orderData>(`orders/${params.order}`)
        .then(response => {
          let dateFormatted: Date | null | undefined;
          let dateString: string;
          const order: orderData = response.data;
          if (order.bookingDate) {
            dateFormatted = fromUnixTime(order.bookingDate);
            dateString = format(fromUnixTime(order.bookingDate), 'dd/MM/yyyy');
          } else {
            dateFormatted = null;
            dateString = '';
          }

          setStartDate(dateFormatted);
          const orderFormatted = {
            ...order,
            dateFormatted: dateString,
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

  const handleUpdateOrder = useCallback(
    async (data: orderData) => {
      const id = params.order;

      const { title } = data;
      try {
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

        await api.put(`/orders/${id}`, bodyData);

        history.push('/dashboard');
      } catch (err) {
        console.log(err);
      }
    },
    [history, params.order, startDate],
  );
  const hanndleChangeDate = useCallback(
    (date: Date | null) => {
      if (date) {
        setStartDate(date);
      }
      console.log(startDate);
    },
    [startDate],
  );

  const handleBackToDashboard = () => {
    history.push('/dashboard');
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <button id="backButton" onClick={handleBackToDashboard}>
            <FiArrowLeft />
          </button>

          <h1>Order detail</h1>
          <button id="signOut" onClick={handleSignOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Form
          initialData={{
            title: order?.title,
            booking: order?.dateFormatted,
            city: order?.address?.city,
            country: order?.address?.country,
            street: order?.address?.street,
            zip: order?.address?.zip,
            name: order?.customer?.name,
            email: order?.customer?.email,
            phone: order?.customer?.phone,
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
            <h1 style={{ marginRight: '-30px' }}>Booking Date</h1>
            <ContentTitle>
              <DatePicker
                name={'date'}
                selected={startDate}
                onChange={date => hanndleChangeDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                minDate={new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                customInput={<Input name="booking" placeholder="Date" />}
              />
            </ContentTitle>
          </ContentInput>

          <ContentInput>
            <h1 style={{ marginRight: '16px' }}>Address</h1>
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
