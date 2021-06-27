import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import { makeSchema, asNexusMethod, enumType, scalarType } from 'nexus'
import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars'

import * as allTypes from './schema/index'

export const JsonScalar = asNexusMethod(JSONObjectResolver, 'json')
export const DateTimeScalar = asNexusMethod(DateTimeResolver, 'date')

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc']
})

const schemaWithoutPermissions = makeSchema({
  types: [JsonScalar, DateTimeScalar, SortOrder, allTypes],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts'
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context'
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma'
      }
    ]
  }
})

export const schema = applyMiddleware(schemaWithoutPermissions, permissions)
