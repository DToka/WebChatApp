import React from 'react'
class Login extends React.Component{
    render(){
        let warning;
        if(this.props.userNameExists){
            warning = <label>This username is taken, please select another.</label>
        }else{
            warning = <label>Please select a username</label>
        }
        return(
            <div className="Login">
            <form onSubmit={this.props.handleLogin}>
                Login<br></br>
                <label>Choose a username</label><br></br><input type="text" value={this.props.name} onChange={this.props.setUsername} className="loginText"></input><br></br>
                {this.props.userNameValid && !this.props.userNameExists ? <input type="submit" value="Enter" className="loginButton"></input> : warning }
            </form>
            </div>
        )
    }
}
export default Login