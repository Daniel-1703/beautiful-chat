import React, { useState } from 'react';
import socket from '../socket';
import './messanger.css';

const Messanger = ({userName, room, addMessage, users, messages}) => {
    const [mesValue, setMesValue] = useState('');

    const sendMessage = () => {
        socket.emit('ROOM:NEW_MESSAGE', {
            userName,
            room,
            text: mesValue
        });
        addMessage({userName, text: mesValue});
        setMesValue('');
    }

    const date = new Date().toLocaleString().slice(11, -3);

    return (
        <div className="messanger">
            <div className="messanger-users">
                <h5>Users online({users.length})</h5>
                <ul>
                    {users.map((name) => (<li key={name}>{name}</li>))}
                </ul>
            </div>
            <div className="messanger-messages">
                <div className="messages">
                    {messages.map((message) => (
                        <div className="message">
                            <p>{message.text}</p>
                            <div>
                                <span>{message.userName}{date}</span>
                            </div>
                        </div>))
                    }    
                </div>
                <form>
                    <textarea className="form-control"
                              rows="3"
                              value={mesValue}
                              onChange={(e) => setMesValue(e.target.value)}>
                    </textarea>
                    <button type="button" onClick={sendMessage}>Send</button>
                </form>
            </div>
        </div>
    )
}

export default Messanger;