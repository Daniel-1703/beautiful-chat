import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import Join from './components/join';
import Messanger from './components/messanger';
import socket from './socket';
import './app.css';

const reducer = (state, action) => {
	switch (action.type) {
		case 'ENTERED':
			return {
				...state,
				entered: true,
				userName: action.payload.userName,
				room: action.payload.room
			}
		
		case 'SET_USERS':
			return {
				...state,
				users: action.payload
			}

		case 'SET_DATA':
			return {
				...state,
				users: action.payload.users,
				messages: action.payload.messages
			}

		case 'NEW_MESSAGE':
			return {
				...state,
				messages: [...state.messages, action.payload]
			}
			
		default:
			return state;
	}
}

const App = () => {
	const [state, dispatch] = useReducer(reducer, {
		entered: false,
		userName: null,
		room: null,
		users: [],
		messages: []
	});

	const onEnter = async (obj) => {
		dispatch({
			type: 'ENTERED',
			payload: obj
		});
		socket.emit('ROOM:ENTER', obj); //отправка данных на сервер о том, куда хочет подключиться пользователь
		const {data} = await axios.get(`/rooms/${obj.room}`); //запрос о пользователях и сообщениях в комнате
		dispatch({
			type: 'SET_DATA',
			payload: data
		});
	};

	const setUsers = (users) => {
		dispatch({
			type: 'SET_USERS',
			payload: users
		});
	}

	const addMessage = (message) => {
		dispatch({
		  type: 'NEW_MESSAGE',
		  payload: message
		});
	  };

	useEffect(() => {
		socket.on('ROOM:SET_USERS', setUsers);
		socket.on('ROOM:NEW_MESSAGE', addMessage);
	}, []);
	

  	return (
    	<div className="wrapper">
			{!state.entered ? <Join onEnter={onEnter} /> : <Messanger {...state} addMessage={addMessage}/>}
		</div>
  	);
}

export default App;
