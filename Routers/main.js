'use strict';
let WebSocket = null;
const { CardData } = require('../helpers/Cards/CardList');

module.exports = function() {
    return {
        setRouting: function(router) {
            router.get('/card/:cardname', this.getCardInfo);
            router.get('/room/getall', this.getRooms);
            // router.get('/static/media/:file', this.getStatic);
            router.get('*', this.indexPage);

            router.post('/room/create', this.createRoom);
            router.post('/room/exists/:roomhash', this.roomExists);
            router.post('/room/players/:roomhash', this.roomPlayers);
            router.post('/room/getcards/:roomhash', this.getRoomCards);
        },

        getStatic: function(req, res) {

        },

        setSocket: function(socket) {
            WebSocket = socket;
        },

        indexPage: function(req, res) {
            return res.render('index/index.ejs', { title: 'One Night!' });
        },

        getRooms: function(req, res) {
            const roomList = [];

            for(let room in WebSocket.rooms) {
                if(!WebSocket.rooms.hasOwnProperty(room)) continue;
                if(WebSocket.rooms[room].public && !WebSocket.rooms[room].inProgress) {
                    roomList.push({
                        name: WebSocket.rooms[room].name,
                        roomhash: WebSocket.rooms[room].roomhash,
                        playerCount: WebSocket.rooms[room].playerData.playerCount,
                        maxPlayers: WebSocket.rooms[room].maxPlayers,
                    });
                }
            }

            res.json({ roomList });
        },

        createRoom: function(req, res) {
            const roomhash = WebSocket.createRoom(req.body.hostname, req.body.roomname, { ...req.body.data, password: req.body.password });

            return res.json({ success: true, roomhash });
        },

        roomExists: function(req, res) {
            return res.json({ exists: WebSocket.rooms.hasOwnProperty(req.params.roomhash), password: WebSocket.rooms[req.params.roomhash].password !== null });
        },

        roomPlayers: function(req, res) {
            if (WebSocket.rooms.hasOwnProperty(req.params.roomhash)) {
                const playerList = WebSocket.rooms[req.params.roomhash].playerData.players;
                return res.json({
                    success: true, players: Object.keys(playerList).map(clientID => (
                        { id: clientID, username: playerList[clientID].username, host: playerList[clientID].host })
                    ),
                });
            } else {
                return res.json({ success: false, errorMsg: 'Room does not exist' });
            }
        },

        getCardInfo: function(req, res) {
            return res.json({ success: true, cardInfo: CardData(req.params.cardname) });
        },

        getRoomCards: function(req, res) {
            if (WebSocket.rooms.hasOwnProperty(req.params.roomhash)) {
                return res.json({
                    success: true,
                    cards: WebSocket.rooms[req.params.roomhash].cardsInPlay.map(card => card.clientName),
                });
            } else {
                return res.json({ success: false, errorMsg: 'Room does not exist' });
            }
        }
    };
};