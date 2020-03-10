import React from 'react'
class TextEntry extends React.Component{
    render(){
        return (
            <form className="textEntry">
                <label>
                    Enter text:<input type="text" value={this.props.text} onChange={this.props.handleTextChange} />
                </label>
                <input type="submit" value="Send Message" onClick={this.props.sendMessage} />
            </form>
        ) 
    }
}
export default TextEntry