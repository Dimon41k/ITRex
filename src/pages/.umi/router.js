import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import('/home/madi/Рабочий стол/Новый каталог/dva/packages/dva-example-user-dashboard/src/global.css');
import Layout from '/home/madi/Рабочий стол/Новый каталог/dva/packages/dva-example-user-dashboard/src/layouts/index.js';
import { routerRedux } from 'dva/router';


let Router = DefaultRouter;
const { ConnectedRouter } = routerRedux;
Router = ConnectedRouter;


export default function() {
  return (
<Router history={window.g_history}>
  <Layout><Switch>
    <Route exact path="/" component={require('../index.js').default} />
    <Route exact path="/letters" component={require('../letters/page.js').default} />
  </Switch></Layout>
</Router>
  );
}
