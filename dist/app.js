"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _apolloServerExpress = require("apollo-server-express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _schema = _interopRequireDefault(require("../graphql/schema"));

var _resolvers = _interopRequireDefault(require("../graphql/resolvers"));

const app = (0, _express.default)();
app.use(_bodyParser.default.json());
app.use((0, _cors.default)({
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['POST']
}));
const server = new _apolloServerExpress.ApolloServer({
  typeDefs: _schema.default,
  resolvers: _resolvers.default,
  tracing: true
});

_mongoose.default.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: true
}, err => {
  if (err) {
    console.log(err);
    throw err;
  }

  console.log('mongoDB is connected');
  server.applyMiddleware({
    app
  });
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}${server.graphqlPath}`);
  });
});