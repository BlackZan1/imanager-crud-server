const express = require('express');
const mongoose = require('mongoose');
const ApolloServer = require('apollo-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
// GraphQL
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();

app.use(bodyParser.json());
app.use(cors({ allowedHeaders: ['Content-Type', 'Authorization'] }));

const server = new ApolloServer.ApolloServer({
    typeDefs: schema,
    resolvers,
    tracing: true
})

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: true
}, (err) => {
    if(err) {
        console.log(err);

        throw err;
    }

    console.log('mongoDD has connected');

    server.applyMiddleware({ app });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running at http://localhost:${process.env.PORT}${server.graphqlPath}`)
    })
})