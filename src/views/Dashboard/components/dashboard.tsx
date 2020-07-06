import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import fromUnixTime from 'date-fns/fromUnixTime';
import { format, parseISO } from 'date-fns';
import firebase from '../../../firebase';
import 'firebase/firestore';
import api from '../../../services/api';
import { FiPower } from 'react-icons/fi';

import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Container, Header, HeaderContent, Content, Orders } from './styles';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

interface orderData extends firebase.firestore.DocumentData {
  id: string;
  title: string;
  bookingDate: number;
  dateFormatted: string;
  address: {
    city: string;
    country: string;
    street: string | undefined;
    zip: string;
  };
  customer?: {
    email: string;
    name: string | undefined;
    phone: string;
  };
}

const Dashboard = () => {
  const [orders, setOrders] = useState<orderData[]>([]);
  const history = useHistory();

  const classes = useStyles();

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
          const ordersFormatted = response.data.map(order => {
            if (order.bookingDate === null || order.bookingDate === undefined) {
              return {
                ...order,
                dateFormatted: '',
              };
            } else {
              return {
                ...order,
                dateFormatted: format(
                  fromUnixTime(order.bookingDate),
                  'dd/MM/yyyy',
                ),
              };
            }
          });
          console.log(ordersFormatted);
          setOrders(ordersFormatted);
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
      <Header>
        <HeaderContent>
          <h1>Welcome to Dashboard!</h1>
          <button onClick={handleClick}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell align="right">Booking Date</StyledTableCell>
                {/* <StyledTableCell align="right">Address</StyledTableCell> */}
                {/* <StyledTableCell align="right">Customer</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: orderData) => (
                <StyledTableRow key={order.id}>
                  <StyledTableCell component="th" scope="row">
                    {order.title}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {order.dateFormatted}
                  </StyledTableCell>
                  {/* {order.address.street !== undefined && (
                    <StyledTableCell align="right">
                      {order.address.street}
                    </StyledTableCell>
                  )} */}

                  {/* {order.customer.name !== undefined && (
                    <StyledTableCell align="right">
                      {order.customer.name}
                    </StyledTableCell>
                  )} */}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Content>
    </Container>
  );
};
export default Dashboard;
