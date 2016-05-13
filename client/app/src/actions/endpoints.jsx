const endpoints = {
  cards: 'http://localhost:3000/v1/cards',
  tags: 'http://localhost:3000/v1/tags',
  elasticsearch: {
    root: 'http://localhost:9200',
    cards: 'http://localhost:9200/library/cards',
  }
};

export default endpoints;