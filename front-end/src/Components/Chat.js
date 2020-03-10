import React from 'react'
//Where chat messages are displayed
class Chat extends React.Component {
    render(){
        return(
            <div className="messages">
            <label>Chatroom</label>
            <ul >
               {this.props.messages.map(message =>
               <li className="message">{message}</li>)}
            </ul>
            </div>
        )
    }
}
export default Chat