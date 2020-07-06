import React, { useState, useContext, useEffect, useCallback } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import firebase from '../../../firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthContext } from '../../../AuthProvider';
import { Form } from '@unform/web';

import { Container, Content, AnimationContainer } from './styles';

import Input from '../../../components/Input';
import Button from '../../../components/Button';

interface UserData {
  email: string;
  password: string;
}

const Login = () => {
  const authContext = useContext(AuthContext);
  const { loadingAuthState } = useContext(AuthContext);
  const history = useHistory();

  const db = firebase.firestore();

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        if (!result || !result.user || !firebase.auth().currentUser) {
          return;
        }

        return setUserProfile().then(() => {
          redirectToTargetPage();
        });
      })
      .catch(error => {
        console.log(error, 'error');
      });
  }, []);

  const setUserProfile = async () => {
    if (await isUserExists()) {
      return;
    }

    const currentUser = firebase.auth().currentUser!;
    db.collection('Users')
      .doc(currentUser.uid)
      .set({
        username: currentUser.displayName,
      })
      .then(() => {
        console.log('Saved');
        return;
      })
      .catch(error => {
        console.log(error.message);
        alert(error.message);
      });
  };

  const isUserExists = async () => {
    const doc = await db
      .collection('users')
      .doc(firebase.auth().currentUser!.uid)
      .get();
    return doc.exists;
  };

  const redirectToTargetPage = () => {
    history.push('/dashboard');
  };

  const handleSubmit = useCallback(async (data: UserData) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(res => {
        authContext.setUser(res);
        console.log(res, 'res');
        history.push('/dashboard');
      })
      .catch(error => {
        console.log(error.message);
        alert(error.message);
      });
  }, []);

  if (loadingAuthState) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <Input
              type="text"
              name="email"
              icon={FiMail}
              placeholder="Enter your Email"
            />

            <Input
              type="password"
              name="password"
              icon={FiLock}
              placeholder="Enter your Password"
            />

            <Button name="Enter" type="submit">
              Login
            </Button>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Login;
