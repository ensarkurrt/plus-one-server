import { ApolloServer } from 'apollo-server'
import { createContext } from './context'
import { schema } from './schema'

const server = new ApolloServer({
  schema,
  context: createContext
})

server.listen().then(({ url, subscriptionsPath }) => {
  console.log(
    `\
🚀 Server ready at: ${url.substring(0, url.length - 1)}${subscriptionsPath}
`
  )
})
