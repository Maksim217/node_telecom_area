import React, { useEffect, useContext, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import avatar from '../images/unnamed.jpg';

export const ProfilePage = () => {
  const { userId } = useContext(AuthContext);
  const { loading, request } = useHttp();
  const message = useMessage();

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    avatarUrl: '',
    image: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await request(`/api/profile/${userId}`, 'GET', null);
        setUserData({
          ...data,
        });
      } catch (err) {}
    }
    fetchData();
  }, [request, userId]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const updateHandler = async (event) => {
    event.preventDefault();
    try {
      const data = await request(`/api/profile`, 'POST', { ...userData, userId });
      message(data.message);
    } catch (e) {}
  };

  return (
    <div>
      <h1>Профиль</h1>
      <div className="row">
        <div className="col s6">
          {userData.avatarUrl || avatar ? (
            <img
              width="300"
              height="300"
              src={avatar || userData.avatarUrl}
              alt={'avatar-' + userData.firstName}
            />
          ) : (
            <p>Аватара нет</p>
          )}
        </div>
        <div className="col s6">
          <p>
            Ваш email: <strong>{userData.email}</strong>
          </p>
          <div className="input-field">
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Ваше имя"
              value={userData.firstName}
              onChange={changeHandler}
            />
            <label htmlFor="firstName">Имя</label>
          </div>
          <div className="input-field">
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Ваша фамилия"
              value={userData.lastName}
              onChange={changeHandler}
            />
            <label htmlFor="lastName">Фамилия</label>
          </div>
          <div className="input-field">
            <input
              id="middleName"
              name="middleName"
              type="text"
              placeholder="Ваше отчество"
              value={userData.middleName}
              onChange={changeHandler}
            />
            <label htmlFor="middleName">Отчество</label>
          </div>

          <div className="card-action">
            <button
              className="btn gray lighten-1 white-text"
              onClick={updateHandler}
              disabled={loading}>
              Обновить данные
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
