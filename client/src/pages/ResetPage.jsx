import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const ResetPage = () => {
  const message = useMessage();
  const history = useHistory();

  const [resetForm, setResetForm] = useState({ email: '' });
  const { loading, error, request, clearError } = useHttp();

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setResetForm({ ...resetForm, [event.target.name]: event.target.value });
  };

  const resetHandler = async () => {
    try {
      const data = await request('/api/auth/reset', 'POST', { ...resetForm });
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
            <span className="card-title">Забыли пароль?</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  className="yellow-input"
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn gray lighten-1 black-text"
              onClick={resetHandler}
              disabled={loading}>
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
