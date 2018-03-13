import * as mailService from '../services/mails';

export default {
  namespace: 'mail',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data:list, total, page } }) {
      console.log("state checker", list, total, page);
      return {  list, total, page };
    },
    removeFromList(state, { payload: { id, page } }) {
      console.log("state from remove list", id);
      let findRem = state.list.find(x=>x._id===id);
      if(findRem){
      state.list = state.list.filter(x=>x._id!==id);
      state.total = state.total - 1;
      state.page = page;
      }
      return { ...state };
    },
    addToList(state, {payload:{newRow}} ){
      let newState = JSON.parse(JSON.stringify(state));
      newState.list.push({_id:newRow._id, body:newRow.body, email:newRow.email, subject:newRow.subject, date:newRow.date});
      newState.total = newState.total+1
      return {...newState}
    }
  },
  effects: {
    *fetch({ payload: { page = 1 } }, { call, put }) {
      let  mailsResp  = yield call(mailService.fetch, { page });
      console.log("from fetch",mailsResp);
      let data = mailsResp.data.getMailList.list;
      let total = mailsResp.data.getMailList.count;
      console.log("from ffetchers",data);
      yield put({
        type: 'save',
        payload: {
          data,
          total,
          page,
        },
      });
    },
    *remove({ payload: id }, { call, put, select }) {
      yield call(mailService.remove, id);
      const page = yield select(state => state.mail.page);
      yield put({ type: 'removeFromList', payload:{page, id} });
      },
    *create({ payload: values }, { call, put }) {
      let result = yield call(mailService.create, values);
      let newRow = result.data.sendMail;
      yield put({ type: 'addToList', payload:{newRow} });
    },
    *reload(action, { put, select }) {
      console.log("from reload");
      const page = yield select(state => state.mail.page);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
};
