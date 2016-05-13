const cardsReducer = (state = [], action) => {
  switch(action.type) {
    case 'ADD_CARD':
      return [...state, action.payload.data.data];
    case 'FETCH_CARDS':
      return [...state, ...action.payload.data.data];
    case 'FILTER_CARDS':
      const filteredCards = state.slice().filter((card) => {
        for (var i = 0; i < card.cardTags.length; i++) {
          if (card.cardTags[i].tag.name === action.tag) { return true; }
        };
        return false;
      });
      return [...filteredCards];
    case 'SEARCH_CARDS':
      console.log('SEARCH CARDS PAYLOAD: ', action.payload.hits.hits);
      return [...action.payload.hits.hits];
    default:
      return state;
  };
};

export default cardsReducer;


// case 'REMOVE_CARD':
//   return
//     [...state.slice(0, index),
//      ...state.slice(index+1)];