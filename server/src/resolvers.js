import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';

const channels = [{
  id: '1',
  name: 'soccer',
  messages: [{
    id: '1',
    text: 'soccer is football',
  }, {
    id: '2',
    text: 'hello soccer world cup',
  }]
}, {
  id: '2',
  name: 'baseball',
  messages: [{
    id: '3',
    text: 'baseball is life',
  }, {
    id: '4',
    text: 'hello baseball world series',
  }]
}];
let nextId = 3;
let nextMessageId = 5;

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    async getMailList(root, {range}, context){
      let result = {};
      result.count = await context.collections.mail.count().exec();
      result.list = await context.collections.mail.find().sort({date:-1}).skip(range.skip).limit(range.limit).exec();
      return result;
    },

    channels: () => {
      return channels;
    },
    channel: (root, { id }) => {
      return channels.find(channel => channel.id === id);
    },
  },
  Mutation: {
    async deleteMail(root, {id}, context){
      let deleted = context.collections.mail.find({_id:id}).remove().exec();
      let status = await deleted;
      return status.ok;
    },
    addChannel: (root, args) => {
      const newChannel = { id: String(nextId++), messages: [], name: args.name };
      channels.push(newChannel);
      return newChannel;
    },
    addMessage: (root, { message }, context) => {
      const channel = channels.find(channel => channel.id === message.channelId);
      if(!channel)
        throw new Error("Channel does not exist");

      const newMessage = { id: String(nextMessageId++), text: message.text };
      channel.messages.push(newMessage);
      console.log(context.req.cookies);
      //context.res.cookie('session_id', "HELLO_FUCKING_WORLD");

      pubsub.publish('messageAdded', { messageAdded: newMessage, channelId: message.channelId });

      return newMessage;
    },
    async sendMail(root, {mail}, context){
      let returnedMail = await context.collections.mail.
      create({email:mail.email,body:mail.body, subject:mail.subject});
      context.transporter.sendMail({
        from: 'madi.nickname@ukr.net', // sender address
        to: mail.email, // list of receivers
        subject: mail.subject, // Subject line
        html: mail.body// plain text body
      }, function (err, info) {
         if(err)
           console.log(err)
         else
           console.log(info);
      });
      return returnedMail;
    },

  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('messageAdded'), (payload, variables) => {
        return payload.channelId === variables.channelId;
      }),
    }
  },
};
