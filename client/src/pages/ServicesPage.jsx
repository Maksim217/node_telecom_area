import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

export const ServicesPage = () => {
  const { loading, request } = useHttp();
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await request(`/api/service`, 'GET', null);
      setServiceList([...data.service]);
    }
    fetchData();
  }, [request]);

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
      <h1>Детализация дополнительных услуг</h1>
      {loading ? (
        'Загрузка...'
      ) : (
        <BootstrapTable
          keyField="id"
          data={serviceList}
          columns={columns}
          pagination={paginationFactory(options)}
        />
      )}
    </div>
  );
};
