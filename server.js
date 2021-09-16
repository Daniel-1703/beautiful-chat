const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

const rooms = new Map();

app.get('/rooms/:room', (req, res) => {
    const {room} = req.params;
    const obj = rooms.has(room) 
        ?   {
            users: [...rooms.get(room).get('users').values()],
            messages: [...rooms.get(room).get('messages').values()]
            } 
        :   {users: [], messages: []};
    res.json(obj);
});

app.post('/rooms', (req, res) => {
    const {userName, room} = req.body;
    if (!rooms.has(room)) {                     //если комнаты с таким именем не существует, создаём новую с этим именем
        rooms.set(room, new Map([
            ['users', new Map()],
            ['messages', []]
        ]));
    }  
    res.send();    
});

io.on('connection', (socket) => {
    socket.on('ROOM:ENTER', (data) => {
        socket.join(data.room);     //добавление в определённую комнату
        rooms.get(data.room).get('users').set(socket.id, data.userName);  //сохраняем в Map
        const users = [...rooms.get(data.room).get('users').values()];  //получение списка всех пользователей
        socket.broadcast.to(data.room).emit('ROOM:SET_USERS', users); 
    });

    socket.on('ROOM:NEW_MESSAGE', ({room, userName, text}) => {
        const obj = {
            userName,
            text
        }
        rooms.get(room).get('messages').push(obj);
        socket.broadcast.to(room).emit('ROOM:NEW_MESSAGE', obj); 
    });

    socket.on('disconnect', () =>{
        rooms.forEach((value, room) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()]; 
                socket.broadcast.to(room).emit('ROOM:SET_USERS', users);
            }
        });
    });

    console.log('a user connected', socket.id);
});

server.listen(5555, (error) => {
    if (error) {
        throw Error(error);
    }
    console.log('Сервер запущен');
});