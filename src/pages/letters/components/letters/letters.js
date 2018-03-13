import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './list.css';
import { PAGE_SIZE } from '../../../../constants';
import MailModal from './MailModal';

function Letters({ dispatch, list: dataSource, loading, total, page: current }) {
  function deleteHandler(id) {
    dispatch({
      type: 'mail/remove',
      payload: id,
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/mail',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    dispatch({
      type: 'mail/patch',
      payload: { id, values },
    });
  }

  function createHandler(values) {
    dispatch({
      type: 'mail/create',
      payload: values,
    });
  }


  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: text => <a href="">{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation}>
          <MailModal record={record} onOk={editHandler.bind(null, record._id)}>
            <a>Show</a>
          </MailModal>
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record._id)}>
            <a href="">Delete</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <div className={styles.create}>
          <MailModal record={{}} onOk={createHandler}>
            <Button type="primary">Create mail</Button>
          </MailModal>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => String(record._id)}
          pagination={false}
        />

      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { list, total, page } = state.mail;
  console.log("load state", "current page emails", "total row in db", 'page number');

  return {
    loading: state.loading.models.mail,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Letters);
