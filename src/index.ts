import { PrismaClient } from '@prisma/client'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { makeExecutableSchema } from '@graphql-tools/schema'
import cors from 'cors'
import { HelloResolver } from './resolvers/hello'
import { json } from 'body-parser'

import express from 'express'

const prisma = new PrismaClient()

const typeDefs = `#graphql

  type Query {
    hello: String
  }
`

const main = async () => {
  const app = express()
  const apolloServer = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers: [HelloResolver] }),
    introspection: true
  })

  await apolloServer.start()

  // app.get('/', (_, res) => {
  //   res.send('Hi')
  // })
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer)
  )
  app.listen(4000, () => {
    console.log('server started at localhost:4000')
  })
  // const post = prisma.post.create({
  //   data: {
  //     title: 'new book'
  //   }
  // })
}

main()
  .then(() => {
    prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
