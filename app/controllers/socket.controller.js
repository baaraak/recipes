import io from '../server';

const VERIFY_USER = 'VERIFY_USER';
const USER_CONNECTED = 'USER_CONNECTED';
const USER_DISCONNECTED = 'USER_DISCONNECTED';
const LOGOUT = 'LOGOUT';
const COMMUNITY_CHAT = 'COMMUNITY_CHAT';
const MESSAGE_RECIEVED = 'MESSAGE_RECIEVED';
const MESSAGE_SENT = 'MESSAGE_SENT';
const TYPING = 'TYPING';

const uuidv4 = () => new Date();

/*
*	createMessage
*	Creates a messages object.
* 	@prop id {string}
* 	@prop time {Date} the time in 24hr format i.e. 14:22
* 	@prop message {string} actual string message
* 	@prop sender {string} sender of the message
*	@param {object}
*		message {string}
*		sender {string}
*/
const createMessage = (message, sender) => ({
  id: uuidv4(),
  time: getTime(new Date(Date.now())),
  message,
  sender,
});

/*
*	createChat
*	Creates a Chat object
* 	@prop id {string}
* 	@prop name {string}
* 	@prop messages {Array.Message}
* 	@prop users {Array.string}
*	@param {object}
*		messages {Array.Message}
*		name {string}
*		users {Array.string}
*
*/
const createChat = ({
  messages = [],
  name = 'Community',
  users = [],
} = {}) => ({
  id: uuidv4(),
  name,
  messages,
  users,
  typingUsers: [],
});

/*
*	@param date {Date}
*	@return a string represented in 24hr time i.e. '11:30', '19:30'
*/
const getTime = date => {
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
};

let connectedProducts = [];

let communityChat = createChat();

module.exports = function (socket) {

  let sendMessageToChatFromUser;

  let sendTypingFromUser;

  // User Connects with username
  socket.on(USER_CONNECTED, productId => {
    connectedProducts = addProduct(connectedProducts, productId);

    sendMessageToChatFromUser = sendMessageToChat(productId);
    sendTypingFromUser = sendTypingToChat(productId);

    io.emit(USER_CONNECTED, connectedProducts)
  });

  // User disconnects
  socket.on('disconnect', () => {
    if ('user' in socket) {
      connectedProducts = removeUser(connectedProducts, socket.user.name);

      io.emit(USER_DISCONNECTED, connectedProducts);
      console.log('Disconnect', connectedProducts);
    }
  });

  // User logsout
  socket.on(LOGOUT, () => {
    connectedProducts = removeUser(connectedProducts, socket.user.name);
    io.emit(USER_DISCONNECTED, connectedProducts);
    console.log('Disconnect', connectedProducts);
  });

  // Get Community Chat
  socket.on(COMMUNITY_CHAT, callback => {
    callback(communityChat);
  });

  socket.on(MESSAGE_SENT, (message) => {
    sendMessageToChatFromUser(message.match, message.body);
  });

  socket.on(TYPING, ({ chatId, isTyping }) => {
    sendTypingFromUser(chatId, isTyping);
  });

  const sendMessageToChat = (productId) => {
    return (chatId, message) => {
      socket.broadcast.emit(
        `${MESSAGE_RECIEVED}-${chatId}`,
        createMessage(message, productId)
      );
    };
  }
};

/*
* Returns a function that will take a chat id and a boolean isTyping
* and then emit a broadcast to the chat id that the sender is typing
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
}

/*
* Returns a function that will take a chat id and message
* and then emit a broadcast to the chat id.
* @param sender {string} username of sender
* @return function(chatId, message)
*/


/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
*/
function addProduct(productIdList, productId) {
  return [...productIdList, productId];

}

/*
* Removes user from the list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {string} name of user to be removed
* @return userList {Object} Object with key value pairs of Users
*/
function removeUser(userList, username) {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}

/*
* Checks if the user is in list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {String}
* @return userList {Object} Object with key value pairs of Users
*/
function isUser(userList, username) {
  return username in userList;
}
