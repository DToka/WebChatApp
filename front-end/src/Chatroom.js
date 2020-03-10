import React, { useState, useEffect } from 'react';
import TextEntry from './Components/TextEntry';
import Chat from './Components/Chat';
import Login from './Components/Login';
import Users from './Components/Users';
import io from 'socket.io-client';
import './App.css'
//Connect to socketio server called chatServer
let socket = io.connect();
//Change this constant to change how many messages the messages state holds
const maxMessagesInRoom = 20;
class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      messages: ["Welcome! This is a chatroom.", "Just copy the link and send it to your friends for them to join!", "Have fun!"],
      userName: '',
      loggedIn: false,
      users: [],
      userNameExists: false,
      userNameValid: false
    };
    //Event based functions that get passed to other Components
    this.handleTextChange = this.handleTextChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.getAllConnectedUsers = this.getAllConnectedUsers.bind(this);
    socket.on('chat message', (msg) => {
      let chatMessages = [...this.state.messages];
      if (this.state.messages.length > maxMessagesInRoom) {
        chatMessages.splice(0, 1);
      }
      chatMessages.push(msg);
      this.setState({ messages: chatMessages });
    })
    socket.on('addUser', (msg) => {
      this.setState({ users: this.state.users.concat(msg) })
    })
    socket.on('removeUser', (msg) => {
      this.setState({ users: this.state.users.filter(user => user !== msg) })
    })
    //Server to emit 'allUsers' with an array of Usernames logged in
    socket.on('allUsers', (msg) => {
      this.setState({ users: msg });
      if (this.state.userName !== '' && !this.state.users.includes(this.state.userName)) {
        socket.emit('userConnection', `${this.state.userName}`);
      }
    })
    socket.on('connect', () => {
      this.getAllConnectedUsers();
    })
  }
  handleTextChange(event) {
    event.preventDefault();
    this.setState({ inputText: event.target.value });
  }
  sendMessage(event) {
    event.preventDefault();
    socket.emit('chat message', `${this.state.userName}:` + this.state.inputText);
    this.setState({ inputText: '' });
  }
  setUsername(event) {
    event.preventDefault();
    if (this.state.users.includes(event.target.value)) {
      this.setState({ userNameExists: true });
    } else {
      this.setState({ userNameExists: false });
    }
    if (event.target.value.length>0) {
      this.setState({ userNameValid: true });
    } else {
      this.setState({ userNameValid: false });
    }
    this.setState({ userName: event.target.value });
  }
  handleLogin(event) {
    event.preventDefault();
    socket.emit('userConnection', `${this.state.userName}`);
    this.setState({ loggedIn: true });
    socket.emit('chat message', `${this.state.userName} has connected!`);
  }
  addConnectedUsers(userName) {
    this.setState = ({ users: this.state.users.concat(userName) });
  }
  removeConnectedUsers(userName) {
    this.setState = ({ users: this.state.users.filter(user => user !== userName) });
  }
  getAllConnectedUsers() {
    socket.emit('getAllUsers', '');
  }
  render() {
    if (this.state.loggedIn) {
      return (
        <div>
          <Chat messages={this.state.messages} />
          <TextEntry text={this.state.inputText} handleTextChange={this.handleTextChange} sendMessage={this.sendMessage} />
          <Users users={this.state.users} />
        </div>
      );
    } else {
      return (
        <div>
          <Login setUsername={this.setUsername} name={this.state.userName} handleLogin={this.handleLogin} userNameExists={this.state.userNameExists} userNameValid={this.state.userNameValid} />
        </div>
      )
    }
  }
}
export default Chatroom;
