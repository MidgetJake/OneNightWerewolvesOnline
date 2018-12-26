'use strict';
let WebSocket = null;
const ws = require('ws');

module.exports = function() {
    return {
        setRouting: function(router) {
            router.get('*', this.indexPage);

            router.post('/room/create', this.createRoom);
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
    };
};