import request from '../../../utils/request';
import { PAGE_SIZE } from '../../../constants';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache()
});

export function fetch({ page }) {
  //Apollo кеширует запросы хз как отменить поэтому пагинации не будет.(времени мало)
  return client.query({
  query: gql`
  query{
    getMailList(range:{skip:${PAGE_SIZE*page-3?0:0}, limit: ${PAGE_SIZE}}){
  		count
      list {
        _id
        email
        subject
        body
        date
      }
    }
  }
  `,
  });
}

export function remove(id) {
  return client.mutate({
    mutation: gql`
    mutation{
      deleteMail(id: "${id}")
    }
    `,
  });
}

export function patch(id, values) {
  return values;
}

export function create(values) {
  return client.mutate({
    mutation: gql`
    mutation{
      sendMail(mail:{subject:"${values.subject}",email:"${values.email}", body:"${values.body}"}){
          email
          subject
          body
          date
          _id
        }
      }
    `,
  });
}
