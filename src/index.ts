/* import { ApolloServer } from 'apollo-server' */
import { ApolloServer } from 'apollo-server-express'
import { createContext } from './context'
import { schema } from './schema'
const bodyParser = require('body-parser')

const express = require('express')
/* const server = new ApolloServer({
  schema,
  context: createContext
}) */

async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    context: createContext
  })
  await server.start()

  const app = express()
  app.use(bodyParser.json())
  server.applyMiddleware({ app })

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server readys at http://localhost:4000${server.graphqlPath}`)
  return { server, app }
}
startApolloServer()
/* 
server.listen().then(({ url, subscriptionsPath }) => {
  console.log(
    `\
🚀 Server ready at: ${url.substring(0, url.length - 1)}${subscriptionsPath}
`
  )
}) */
