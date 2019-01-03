'use strict';
let WebSocket = null;

module.exports = function() {
    return {
        setRouting: function(router) {
            router.get('*', this.indexPage);

            router.post('/room/create', this.createRoom);
            router.post('/room/exists/:roomhash', this.roomExists);
            router.post('/room/players/:roomhash', this.roomPlayers);
            router.post('/room/getcards/:roomhash', this.getRoomCards);
        },

        setSocket: function(socket) {
            WebSocket = socket;
        },

        indexPage: function(req, res) {
            return res.render('index/index.ejs', { title: 'One Night!' });
        },

        createRoom: function(req, res) {
            const roomhash = WebSocket.createRoom(req.body.hostname, req.body.roomname, req.body.data);

            return res.json({ success: true, roomhash });
        },

        roomExists: function(req, res) {
            return res.json({ exists: WebSocket.rooms.hasOwnProperty(req.params.roomhash) });
        },

        roomPlayers: function(req, res) {
            if (WebSocket.rooms.hasOwnProperty(req.params.roomhash)) {
                const playerList = WebSocket.rooms[req.params.roomhash].playerData.players;
                return res.json({
                    success: true, players: Object.keys(playerList).map(clientID => (
                        { username: playerList[clientID].username, host: playerList[clientID].host })
                    ),
                });
            } else {
                return res.json({ success: false, errorMsg: 'Room does not exist' });
            }
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