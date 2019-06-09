const db = require("./models");
const graphql = require("graphql");

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: graphql.GraphQLID },
    username: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
    password: { type: graphql.GraphQLString }
  }
});

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: graphql.GraphQLList(UserType),
        resolve: (root, args, context, info) => db.models.User.find().exec()
      },
      user: {
        type: UserType,
        args: {
          id: { type: graphql.GraphQLNonNull(graphql.GraphQLID) }
        },
        resolve: (root, args, context, info) =>
          db.models.User.findById(args.id).exec()
      }
    }
  }),
  mutation: new graphql.GraphQLObjectType({
    name: "Mutation",
    fields: {
      createUser: {
        type: UserType,
        args: {
          username: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          password: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
        },
        resolve: (root, args, context, info) => {
          var newUser = new db.models.User(args);
          return newUser.save();
        }
      }
    }
  })
});

module.exports = schema;
