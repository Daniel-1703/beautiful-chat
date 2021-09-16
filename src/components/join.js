import React, { useState } from 'react';
import axios from 'axios';
import './join.css';

const Join = (props) => {
    const [userName, setUserName] = useState('');
    const [room, setRoom] = useState('');
    const [loading, setLoading] = useState(false);

    const enterTheRoom = async () => {
        const obj = {
            userName,
            room
        }
        setLoading(true);
        await axios.post('/rooms', obj);
        props.onEnter(obj);

    }
    
    return (
        <div className="join">
            <input type="text" 
                   placeholder="Name" 
                   value={userName}
                   onChange={(e) => setUserName(e.target.value)}
            />
            <input type="text" 
                   placeholder="Room" 
                   value={room} 
                   onChange={(e) => setRoom(e.target.value)}
            />
            <button onClick={enterTheRoom} disabled={loading}>
                {loading ? 'Loading...' : 'Welcome!'}
            </button>
        </div>
    );
}


export default Join;