import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const PasswordPage = () => {
  const history = useHistory();
  const userToken = useParams().id;

  if (!userToken) {
    history.push('/');
  }

  const message = useMessage();

  const [passwordForm, setPasswordForm] = useState({ password: '', token: userToken });
  const { loading, error, request, clearError } = useHttp();

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
  };

  const updateHandler = async () => {
    try {
      const data = await request('/api/auth/password', 'POST', { ...passwordForm });
      message(data.message);
      history.push('/');
    } catch (err) {}
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Личный кабинет</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Введите новый пароль</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Введите новый пароль"
                  id="password"
                  type="password"
                  name="password"
                  className="yellow-input"
                  onChange={changeHandler}
                />
                <label htmlFor="password">Новый пароль</label>
              </div>
            </div>
          </div>
        </div>
        <div className="card-action">
          <button
            className="btn gray lighten-1 black-text"
            onClick={updateHandler}
            disabled={loading}>
            Восстановить доступ
          </button>
        </div>
      </div>
    </div>
  );
};
