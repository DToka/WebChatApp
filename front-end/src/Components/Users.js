import React from 'react'
class Users extends React.Component {
    render() {
        return (
            <div className="userList">
                Logged in users
                <ul>
                    {this.props.users.map(user =>
                        <li className="userElement">{user}</li>)}
                </ul>
            </div>
        )
    }
}
export default Users