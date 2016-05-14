import axios from 'axios';
import endpoints from './endpoints';

import elasticsearch from 'elasticsearch';
const client = new elasticsearch.Client({
  host: endpoints.elasticsearch,
  log: 'trace'
});

export const addCardAction = (url) => {
  console.log('addCardAction is triggered');

  const request = axios.post(endpoints.cards, {
    "card": {
      "url": url,
      "title": "title",
      "code": "var hello = function() {};",
      "text": "This is my text",
      "note": "This is a note about my content",
      "domain": "american.com"
    },
    "username": "public",
     "tags": [
      "React",
      "Backbone"
     ]
  });
  console.log('checking middle logs')
  return {
    type: 'ADD_CARD',
    payload: request,
  };
};

export const removeCardAction = (id) => {
  return {
    type: 'REMOVE_CARD',
    id: id,
  };
};

export const fetchCardsAction = () => {
  const request = axios.get(endpoints.cards);
  return {
    type: 'FETCH_CARDS',
    payload: request,
  };
};

export const filterCardsAction = (tag) => {
  return {
    type: 'FILTER_CARDS',
    tag: tag,
  }
};

export const searchCardsAction = (keywords) => {

  const query = {
    index: 'library',
    body: {
      "query": {
        "query_string": {
          "query": keywords
        }
      }
    }
  };

  const request = client.search(query);
    // .then((response) => {
    //   console.log('RESPONSE: ', response);
    // })
    // .catch((error) => {
    //   console.log(error);
    // });

  // const request = axios.get(endpoints.cards, {params: query})
  return {
    type: 'SEARCH_CARDS',
    payload: request,
  }

};
