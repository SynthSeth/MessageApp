const db = require("./models");
const graphql = require("graphql");

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    _id: { type: graphql.GraphQLID },
    username: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
    password: { type: graphql.GraphQLString },
    createdAt: { type: graphql.GraphQLString }
  }
});

const MessageType = new graphql.GraphQLObjectType({
  name: "Message",
  fields: {
    _id: { type: graphql.GraphQLID },
    content: { type: graphql.GraphQLString },
    author: { type: UserType },
    createdAt: { type: graphql.GraphQLString }
  }
});

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: graphql.GraphQLList(UserType),
        args: { sortByCreatedAt: { type: graphql.GraphQLString } },
        resolve: async (root, args, context, info) => {
          if (args.sortByCreatedAt) {
            return await db.models.User.find()
              .sort({ createdAt: args.sortByCreatedAt })
              .exec();
          } else {
            return await db.models.User.find().exec();
          }
        }
      },
      user: {
        type: UserType,
        args: {
          _id: { type: graphql.GraphQLNonNull(graphql.GraphQLID) }
        },
        resolve: async (root, args, context, info) => {
          try {
            const foundUser = await db.models.User.findById(args._id).exec();
            if (foundUser) {
              return foundUser;
            } else {
              const err = new Error("User not found");
              throw err;
            }
          } catch (err) {
            return err;
          }
        }
      },
      messages: {
        type: graphql.GraphQLList(MessageType),
        args: { sortByCreatedAt: { type: graphql.GraphQLString } },
        resolve: async (root, args, context, info) => {
          if (args.sortByCreatedAt) {
            return db.models.Message.find()
              .sort({ createdAt: args.sortByCreatedAt })
              .exec();
          } else {
            return await db.models.Message.find()
              .populate("author")
              .exec();
          }
        }
      },
      message: {
        type: MessageType,
        args: {_id: {type: graphql.GraphQLNonNull(graphql.GraphQLID)} },
        resolve: async (root, args, context, info) => {
          try {
            const foundMessage = await db.models.Message.findById(args._id).populate("author").exec();
            return foundMessage;
          } catch(err) {
            return err;
          }
        }
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
          email: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          password: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
        },
        resolve: async (root, args, context, info) => {
          try {
            const newUser = new db.models.User(args);
            return await newUser.save();
          } catch (err) {
            if (err.code === 11000) {
              const err = new Error("That username/email is unavailable");
              return err;
            }
          }
        }
      },
      createMessage: {
        type: MessageType,
        args: {
          content: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          author: { type: graphql.GraphQLNonNull(graphql.GraphQLID) }
        },
        resolve: async (root, args, context, info) => {
          const newMessage = new db.models.Message(args);
          return await newMessage.save();
        }
      }
    }
  })
});

module.exports = schema;
