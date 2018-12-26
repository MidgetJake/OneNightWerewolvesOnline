import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

class GameRoom extends React.Component {
    constructor(props) {
        super(props);

        this.cookies = document.cookie.split(':').reduce((res, c) => {
            const data = c.trim().split('=').map(decodeURIComponent);
            console.log(data);
            const key = data[0];
            const val = data[1];
            try {
                return Object.assign(res, { [key]: JSON.parse(val) });
            } catch (e) {
                return Object.assign(res, { [key]: val });
            }
        }, {});

        console.log(this.cookies);

        this.state = {
            playername: '',
        };
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        if (this.cookies.hasOwnProperty('uniqueID')) {
            this.connection = new WebSocket('ws://localhost', [this.cookies.uniqueID]);
            this.connection.onopen = () => {
                console.log('Connected');
                this.connection.send(JSON.stringify({
                    type: 'room-connection',
                    data: {
                        roomHash: urlParams.get('roomhash'),
                        userID: this.cookies.uniqueID,
                    },
                }));
            }
        } else {
            this.connection = new WebSocket('ws://localhost', ['new-connection']);
        }

        this.connection.onmessage = rawmsg => {
            console.log(rawmsg);
            const message = JSON.parse(rawmsg.data);

            switch (message.type) {
                case 'connection-id-assign':
                    document.cookie = 'uniqueID=' + message.data.id;
                    this.connection.send(JSON.stringify({
                        type: 'room-connection',
                        data: {
                            roomHash: urlParams.get('roomhash'),
                            userID: this.cookies.uniqueID,
                        },
                    }));
                    break;
            }
        };
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default withStyles(style)(GameRoom);