const db = require("./models");
const graphql = require("graphql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    _id: { type: graphql.GraphQLID },
    username: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
    profileImageUrl: { type: graphql.GraphQLString },
    password: { type: graphql.GraphQLString },
    token: { type: graphql.GraphQLString }
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
          if (!context.isAuthenticated) {
            return new graphql.GraphQLError("Unauthenticated request");
          }

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
          if (!context.isAuthenticated) {
            return new graphql.GraphQLError("Unauthenticated request");
          }

          if (args.sortByCreatedAt) {
            return db.models.Message.find()
              .populate("author")
              .sort({ createdAt: args.sortByCreatedAt })
              .exec();
          } else {
            return db.models.Message.find()
              .populate("author")
              .exec();
          }
        }
      },
      message: {
        type: MessageType,
        args: { _id: { type: graphql.GraphQLNonNull(graphql.GraphQLID) } },
        resolve: async (root, args, context, info) => {
          if (!context.isauthenticated) {
            return new graphql.GraphQLError("Unauthenticated request");
          }
          try {
            const foundMessage = await db.models.Message.findById(args._id)
              .populate("author")
              .exec();
            return foundMessage;
          } catch (err) {
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
          profileImageUrl: {
            type: graphql.GraphQLNonNull(graphql.GraphQLString)
          },
          password: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
        },
        resolve: async (root, args, context, info) => {
          try {
            const newUserModel = new db.models.User(args);
            const newUser = await newUserModel.save();

            const token = await jwt.sign(
              {
                username: newUser.username,
                email: newUser.email,
                profileImageUrl: newUser.profileImageUrl,
                _id: newUser._id
              },
              process.env.JWT_SECRET
            );
            newUser.token = token;
            return newUser;
          } catch (err) {
            if (err.code === 11000) {
              return new graphql.GraphQLError(
                "That username/password is unavailable"
              );
            }
          }
        }
      },
      createMessage: {
        type: MessageType,
        args: {
          content: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          createdAt: { type: graphql.GraphQLString, defaultValue: Date.now() }
        },
        resolve: async (root, args, context, info) => {
          try {
            if (!context.isAuthenticated) {
              return new graphql.GraphQLError("Unauthenticated request");
            }

            const newMessageModel = await new db.models.Message({
              content: args.content,
              author: context.decodedToken._id,
              createdAt: args.createdAt
            });

            await newMessageModel.save();
            const newMessage = await db.models.Message.findById(
              newMessageModel._id
            ).populate("author");
            return newMessage;
          } catch (err) {
            throw err;
          }
        }
      },
      login: {
        type: UserType,
        args: {
          email: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          password: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
        },
        resolve: async (root, args, context, info) => {
          try {
            const foundUser = await db.models.User.findOne({
              email: args.email
            });
            if (!foundUser) {
              throw new graphql.GraphQLError(
                "That email is not registered to any user."
              );
            }

            const isCorrectPassword = await bcrypt.compare(
              args.password,
              foundUser.password
            );

            if (isCorrectPassword) {
              const token = jwt.sign(
                {
                  username: foundUser.username,
                  email: foundUser.email,
                  _id: foundUser._id
                },
                process.env.JWT_SECRET
              );
              foundUser.token = token;
              return foundUser;
            } else {
              throw new Error("Password is incorrect");
            }
          } catch (err) {
            return err;
          }
        }
      }
    }
  })
});

module.exports = schema;
