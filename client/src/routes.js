import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage.jsx';
import { DetailingPage } from './pages/DetailingPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { ServicesPage } from './pages/ServicesPage.jsx';
import { ResetPage } from './pages/ResetPage.jsx';
import { PasswordPage } from './pages/PasswordPage.jsx';
import { ConfirmPage } from './pages/ConfirmPage.jsx';

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/profile" exact>
          <ProfilePage />
        </Route>
        <Route path="/detailing" exact>
          <DetailingPage />
        </Route>
        <Route path="/services" exact>
          <ServicesPage />
        </Route>
        <Redirect to="/profile" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Route path="/reset" exact>
        <ResetPage />
      </Route>
      <Route path="/password/:id">
        <PasswordPage />
      </Route>
      <Route path="/confirm/:id">
        <ConfirmPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
