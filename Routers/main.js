'use strict';
let WebSocket = null;
const ws = require('ws');

module.exports = function() {
    return {
        setRouting: function(router) {
            router.get('*', this.indexPage);

            router.post('/room/create', this.createRoom);
            router.post('/room/exists/:roomhash', this.roomExists);
            router.post('/room/players/:roomhash', this.roomPlayers);
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
                return res.json({
                    success: true, players: WebSocket.rooms[req.params.roomhash].players.map(player => {
                        return player.username;
                    }),
                });
            } else {
                return res.json({ success: false, errorMsg: 'Room does not exist' });
            }
        },
    };
};