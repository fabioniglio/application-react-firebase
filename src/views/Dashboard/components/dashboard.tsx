import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import fromUnixTime from 'date-fns/fromUnixTime';
import { format } from 'date-fns';
import firebase from '../../../firebase';
import 'firebase/firestore';

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

import { Container, Header, HeaderContent, Content } from './styles';
import { useFetch } from '../../../hooks/useFetch';

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
  uid: string;
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
  const history = useHistory();

  const classes = useStyles();

  const { data } = useFetch<orderData[]>('/orders');

  if (!data) {
    return <p>Loading...</p>;
  }
  console.log(data);

  const ordersFormatted = data.map(order => {
    if (order.bookingDate === null || order.bookingDate === undefined) {
      return {
        ...order,
        dateFormatted: '',
      };
    } else {
      return {
        ...order,
        dateFormatted: format(fromUnixTime(order.bookingDate), 'dd/MM/yyyy'),
      };
    }
  });

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
                <StyledTableCell align="right">Address</StyledTableCell>
                <StyledTableCell align="right">Customer</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersFormatted.map((order: orderData) => (
                <StyledTableRow key={order.uid}>
                  <StyledTableCell component="th" scope="row">
                    <Link to={`/orderdetail/${order.uid}`}>{order.title}</Link>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {order.dateFormatted}
                  </StyledTableCell>
                  {order.address.street !== undefined && (
                    <StyledTableCell align="right">
                      {order.address.street}
                    </StyledTableCell>
                  )}

                  {order.customer?.name !== undefined && (
                    <StyledTableCell align="right">
                      {order.customer?.name}
                    </StyledTableCell>
                  )}
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
