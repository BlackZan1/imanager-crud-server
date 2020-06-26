import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import GraphqlSchema from './graphql/schema';
import GraphqlResolvers from './graphql/resolvers';

const app = express();

app.use(bodyParser.json());
app.use(cors({ allowedHeaders: ['Content-Type', 'Authorization'], methods: ['POST'] }));

// app.use('/api', GraphqlHTTP({
//     schema: GraphqlSchema,
//     rootValue: GraphqlResolvers,
//     graphiql: true
// }))

const server = new ApolloServer({
    typeDefs: GraphqlSchema,
    resolvers: GraphqlResolvers,
    tracing: true
})

mongoose.connect(
    process.env.MONGO_URL, 
    {
        useNewUrlParser: true,
        useFindAndModify: true
    }, 
    (err) => {
    if(err) {
        console.log(err);

        throw err;
    }
    console.log('mongoDB is connected');

    server.applyMiddleware({ app });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running at http://localhost:${process.env.PORT}${server.graphqlPath}`);
    })
})