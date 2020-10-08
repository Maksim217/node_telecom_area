import React, { useEffect } from 'react';
import { useHistory, useParams, NavLink } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const ConfirmPage = () => {
  const history = useHistory();
  const userToken = useParams().id;

  if (!userToken) {
    history.push('/');
  }

  const message = useMessage();
  const { error, request, clearError } = useHttp();

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await request('/api/auth/confirm', 'POST', { token: userToken });
        message(data.message);
      } catch (err) {}
    }

    fetchData();
  }, [message, request, userToken]);

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Личный кабинет</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Ваша учетная запись активирована!</span>
            <p>Теперь Вы сможете авторизоваться, используя свой email и установленный пароль</p>
          </div>
        </div>
        <div className="card-action">
          <p>
            <NavLink to="/">Перейти на страницу авторизации</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};
