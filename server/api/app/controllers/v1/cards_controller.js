module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const PromiseMaker = require('bluebird').promisify;
  const Card = Nodal.require('app/models/card.js');
  const User = Nodal.require('app/models/user.js');
  const Tag = Nodal.require('app/models/tag.js');
  const UserTag = Nodal.require('app/models/user_tag.js');
  const CardTag = Nodal.require('app/models/card_tag.js');

  const findOrCreateUser = PromiseMaker(User.findOrCreate, {context: User});
  const findOrCreateTag = PromiseMaker(Tag.findOrCreate, {context: Tag});
  const findOrCreateUserTag = PromiseMaker(UserTag.findOrCreate, {context: UserTag});
  const findOrCreateCardTag = PromiseMaker(CardTag.findOrCreate, {context: CardTag});
  const createCard = PromiseMaker(Card.create, {context: Card});

  const AuthController = Nodal.require('app/controllers/auth_controller.js'); 

  /* ElasticSearch */
  const elasticsearch = require('elasticsearch');
  const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });

  class V1CardsController extends AuthController {

    index() {
      this.authorize((err, accessToken, user) => {
        if (err) {
          return this.respond(err);
        }
        const user_id = user.get('id');
        Card.query()
          .join('cardTags__tag')
          .join('user')
          .where({user_id})
          .where(this.params.query)
          .end((err, cards) => {
            this.respond( err || cards, ['id', 'user_id', 'title', 'url', 'icon', 'domain', 'code', 'text', 'note', {user: ['id', 'username', 'created_at']}, {cardTags: ['id', {tag: ['id', 'name']}]}]);
          });
      })
    }

    show() {

      Card.find(this.params.route.id, (err, model) => {

        this.respond(err || model);

      });

    }

    /* Sample POST Request
       {
        "card": {
          "url": "http://american.com",
          "title": "about USA",
          "code": "var hello = function() {};",
          "text": "This is my text",
          "note": "This is a note about my content",
          "icon": "Icon url",
          "domain": "american.com"
        },
        "username": "public",
         "tags": [
          "React",
          "Backbone",
          "Angular"
         ]
        }
      */ 
    create() {
      this.authorize((err, accessToken, user) => {
        if (err) {
          return this.respond(err);
        }
        let username = this.params.body.username || '';
        let tags = this.params.body.tags || [];
        let card = this.params.body.card || {};
        let user_id;
        let card_id;
        let tag_id;

        const userAndTagPromises = [];
        const userTagPromises = [];
        const cardTagPromises = [];
        const cardTagAndUserTagPromises = [];
        const tagIds = [];


        // Create card
        createCard(card).then((aCard) => {
          card_id = aCard.get('id');

          // Add findOrCreateUser promise
          userAndTagPromises.push(findOrCreateUser({username}));

          // For each tag in tags, add a promise with name bound as first arg
          tags.forEach((tag) => {
            let name = tag;
            userAndTagPromises.push(findOrCreateTag({name}));
          });

          // Resolve User and Tag promises
          Promise.all(userAndTagPromises).then((values) => {
            user_id = values[0].get('id'); // get user id
            aCard.set('user_id', user_id);
            aCard.save();

            let tagModels = values.slice(1);

            // console.log('===========>TAGMODELS!!!!', tagModels);

            tagModels.forEach((tagModel) => {
              tag_id = tagModel.get('id');
              userTagPromises.push(findOrCreateUserTag({tag_id, user_id}));
              cardTagPromises.push(findOrCreateCardTag({tag_id, card_id}));
            });

            // Resolve UserTag Promises
            Promise.all(userTagPromises).then((userTags) => {
              userTags.forEach((user_tag) => {
                if (user_tag.get('card_count') === null) {
                  user_tag.set('card_count', 1); // initialize to 1
                  user_tag.save();
                } else if (user_tag.get('card_count')) {
                  user_tag.set('card_count', user_tag.get('card_count') + 1)
                  user_tag.save();
                }
              });

              // Resolve CardTag Promises
              Promise.all(cardTagPromises).then((cardTags) => {
                this.respond(aCard, ['id', 'user_id', 'title', 'url', 'icon', 'domain', 'code', 'text', 'note']);
                // this.respond([aCard, tags]);

                console.log("ARE WE HERE????????????");

                const cardTagsFormatted = [];
                tagModels.forEach(tagModel =>
                  cardTagsFormatted.push({
                    tag: {
                      id: tagModel._data.id,
                      name: tagModel._data.name,
                    }
                  })
                )

                console.log('==========> cardTagFormat', cardTagsFormatted)

                // const cardTagFormat = [
                //   {
                //     tag: {
                //       id: tag_id,
                //       name: tag_name,
                //     }
                //   }
                // ];

                const cardData = aCard._data;
                const tagData = tags;
                const esPost = {
                  index: 'library',
                  type: 'cards',
                  body: {
                    id: cardData.id,
                    icon: cardData.icon,
                    url: cardData.url,
                    title: cardData.title,
                    user_id: cardData.user_id,
                    code: cardData.code,
                    text: cardData.text,
                    note: cardData.note,
                    domain: cardData.domain,
                    cardTags: cardTagsFormatted,
                  },
                };

                client.create(esPost)
                  .then((response) => 
                    console.log('=====> response: ', response),
                    (error) => 
                    console.log('=====> error: ', error)
                  );
              });
            });
          });            
        });
      })

    }

    /* Sample PUT request body
    -    URI- http://localhost:3000/v1/cards/${card_id}/?access_token=${access_token}
    -
    -    {
    -      "url": "http://liamhatcher.com",
    -      "title": "about liam",
    -      "code": "var liam = function() {};",
    -      "text": "This is liam",
    -      "note": "This is a note about liam not me",
    -      "icon": "An icon about liam",
    -      "domain": "liamhatcher.com"
         }
    -    */
    update() {

      Card.update(this.params.route.id, this.params.body, (err, model) => {

        this.respond(err || model);

      });

    }

    destroy() {

      Card.destroy(this.params.route.id, (err, model) => {

        this.respond(err || model);

      });

    }

  }

  return V1CardsController;

})();
