import axios from 'axios';
import endpoints from './endpoints';

export const addCardAction = (url) => {
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
  const accesstoken = localStorage.getItem('dotBindAccessToken');
  const request = axios.get(`${endpoints.cards}?access_token=${accesstoken}`).catch((err) => console.error('Error fetching cards: ', err));
  return {
    type: 'FETCH_CARDS',
    payload: request,
  };
};

export const searchCardsAction = (keywords) => {
  console.log('searchCardsAction is called: ', keywords)
  const query = {
    params: {
      "query": {
        index: "library",
        type: "cards",
        body: {
          "query": {
            "bool": {
              "should": [{
                "multi_match": {
                  "query": keywords,
                  "type": "most_fields",
                  "fields": ["title", "url", "code", "text", "note", "domain", "cardTags.tag.name"],
                },
              }],
            },
          },
          "highlight": {
            "fields": {
              "title": {},
              "url": {},
              "code": {},
              "text": {},
              "note": {},
              "domain": {},
              "cardTags.tag.name": {},
            },
          },
        },
      },
    },
  };
  const request = axios.get(endpoints.search, query);
  return {
    type: 'SEARCH_CARDS',
    payload: request,
  }
};

export const updateCardAction = (reqBody) => {
  const endpoint = `${endpoints.cards}/${reqBody.id}/?access_token=${reqBody.token}`;
  const request = axios.put(endpoint, {
    code: reqBody.code,
    note: reqBody.note,
  });
  return {
    type: 'UPDATE_CARD',
    payload: request,
  };
};

export const removeTagFromCardAction = (tag) => {
  const request = axios.delete(endpoints.card_tags + '/' + tag.cardTagId);
  return {
    type: 'REMOVE_TAG',
    payload: request,
  };
};

export const addTagToCardAction = (tagName, userId, cardId) => {
  const request = axios.post(endpoints.tags, {
    user_id: userId,
    card_id: cardId,
    tags: [
      tagName
    ],
  });
  return {
    type: 'ADD_CARD_TAG',
    payload: request,
  };
};

export const removeCardFilterAction = (keywords) => {
  // first search
  const query = {
    params: {
      "query": {
        index: "library",
        type: "cards",
        body: {
          "query": {
            "bool": {
              "should": [{
                "multi_match": {
                  "query": keywords,
                  "type": "most_fields",
                  "fields": ["title", "url", "code", "text", "note", "domain", "cardTags.tag.name"],
                },
              }],
            },
          },
          "highlight": {
            "fields": {
              "title": {},
              "url": {},
              "code": {},
              "text": {},
              "note": {},
              "domain": {},
              "cardTags.tag.name": {},
            },
          },
        },
      },
    },
  };
  const request = axios.get(endpoints.search, query);
  return {
    type: 'REMOVE_CARD_FILTER',
    payload: request,
  }
};
