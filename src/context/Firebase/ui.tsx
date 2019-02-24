import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { Container, Header } from 'semantic-ui-react';

export default function LoginForm({ firebase }) {
  return (
    <Container>
      <Header content="Log Issue" subheader="Please sign-in:" />

      <StyledFirebaseAuth
        uiConfig={firebase.uiConfig()}
        firebaseAuth={firebase.auth}
      />
    </Container>
  );
}
