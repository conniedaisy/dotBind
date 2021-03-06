module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const router = new Nodal.Router();

  /* ElasticSearch used to be here */


  /* Middleware */
  /* executed *before* Controller-specific middleware */

  const CORSMiddleware = Nodal.require('middleware/cors_middleware.js');
  // const CORSAuthorizationMiddleware = Nodal.require('middleware/cors_authorization_middleware.js');
  // const ForceWWWMiddleware = Nodal.require('middleware/force_www_middleware.js');
  // const ForceHTTPSMiddleware = Nodal.require('middleware/force_https_middleware.js');

  router.middleware.use(CORSMiddleware);
  // router.middleware.use(CORSAuthorizationMiddleware);
  // router.middleware.use(ForceWWWMiddleware);
  // router.middleware.use(ForceHTTPSMiddleware);

  /* Renderware */
  /* executed *after* Controller-specific renderware */

  const GzipRenderware = Nodal.require('renderware/gzip_renderware.js')

  router.renderware.use(GzipRenderware);

  /* Routes */

  const IndexController = Nodal.require('app/controllers/index_controller.js');

  /* generator: begin imports */

  const V1CardsController = Nodal.require('app/controllers/v1/cards_controller.js');
  const V1TagsController = Nodal.require('app/controllers/v1/tags_controller.js');
  const V1CardTagsController = Nodal.require('app/controllers/v1/card_tags_controller.js');
  const V1SnippetsController = Nodal.require('app/controllers/v1/snippets_controller.js');
  // const V1UsersController = Nodal.require('app/controllers/v1/users_controller.js');
  const V1UserTagsController = Nodal.require('app/controllers/v1/user_tags_controller.js');
  const V1UsersController = Nodal.require('app/controllers/v1/users_controller.js');
  const V1AccessTokensController = Nodal.require('app/controllers/v1/access_tokens_controller.js');
  const V1MessagesController = Nodal.require('app/controllers/v1/messages_controller.js');
  const V1CardsSearchController = Nodal.require('app/controllers/v1/cards_search_controller.js');
  const V1UsersSearchController = Nodal.require('app/controllers/v1/users_search_controller.js');

  /* generator: end imports */

  router.route('/').use(IndexController);

  /* generator: begin routes */

  router.route('/v1/cards/{id}').use(V1CardsController);
  router.route('/v1/tags/{id}').use(V1TagsController);
  router.route('/v1/card_tags/{id}').use(V1CardTagsController);
  router.route('/v1/snippets/{id}').use(V1SnippetsController);
  // router.route('/v1/users/{id}').use(V1UsersController);
  router.route('/v1/user_tags/{id}').use(V1UserTagsController);
  router.route('/v1/users/{id}').use(V1UsersController);
  router.route('/v1/access_tokens/{id}').use(V1AccessTokensController);
  router.route('/v1/messages/{id}').use(V1MessagesController);

  // Elasticsearch query routes
  router.route('/v1/search').use(V1CardsSearchController);
  router.route('/v1/searchusers').use(V1UsersSearchController);

  /* generator: end routes */

  return router;

})();
