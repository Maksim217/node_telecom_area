import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

export const DetailingPage = () => {
  const { loading, request } = useHttp();
  const [detailingList, setDetailingList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await request(`/api/detailing`, 'GET', null);
      setDetailingList([...data.detailing]);
    }
    fetchData();
  }, [request]);

  const randomBalance = () => {
    const rand = 100 - 0.5 + Math.random() * 1000;
    return Math.round(rand);
  };

  const toCurrency = (balance) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(balance);
  };

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      hidden: true,
    },
    {
      dataField: 'date',
      text: 'Дата',
    },
    {
      dataField: 'amount',
      text: 'Сумма изменения баланса',
    },
    {
      dataField: 'reason',
      text: 'Причина списания',
    },
  ];

  const options = {
    sizePerPage: 10,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: true,
  };

  return (
    <div>
      <h1>Детализация</h1>
      <p>
        <strong>Ваш баланс: {toCurrency(randomBalance())}</strong>
      </p>
      {loading ? (
        'Загрузка...'
      ) : (
        <BootstrapTable
          keyField="id"
          data={detailingList}
          columns={columns}
          pagination={paginationFactory(options)}
        />
      )}
    </div>
  );
};
