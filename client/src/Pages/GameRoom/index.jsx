import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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

        this.urlParams = new URLSearchParams(window.location.search);

        console.log(this.cookies);

        this.state = {
            playername: this.cookies.uniqueID || '',
            loading: true,
            roomExists: false,
            nameDialog: false,
            connected: false,
            usernames: [],
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    connectToRoom = () => {
        this.setState({ loading: true, nameDialog: false });
        this.connection.send(JSON.stringify(({
            type: 'room-connection',
            data: {
                roomHash: this.urlParams.get('roomhash'),
                username: this.state.playername,
            },
        })));
    };

    getPlayers = () => {
        axios.post('/room/players/' + this.urlParams.get('roomhash')).then(response => {
            if (response.data.success) {
                this.setState({ loading: false, connected: true, usernames: response.data.players });
            }
        });
    };

    componentDidMount() {
        if (this.urlParams.has('roomhash')) {
            axios.post('/room/exists/' + this.urlParams.get('roomhash')).then(response => {
                if (response.data.exists) {
                    this.setState({ roomExists: true, nameDialog: true, loading: false });
                    this.connection = new WebSocket('ws://localhost', [this.urlParams.get('roomhash')]);

                    this.connection.onmessage = rawmsg => {
                        console.log(rawmsg);
                        const message = JSON.parse(rawmsg.data);

                        switch (message.type) {
                            case 'room-connected':
                                this.getPlayers();
                                break;
                            case 'user-connected':
                                this.setState({ usernames: [...this.state.usernames, message.data.username] });
                                break;
                            case 'user-disconnected':
                                this.getPlayers();
                        }
                    };
                } else {
                    this.setState({ roomExists: false, loading: false });
                }
            });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.back}>
                {this.state.loading ? (
                    <CircularProgress/>
                ) : this.state.nameDialog ? (
                    <Card className={classes.nameCard}>
                        <TextField
                            id="standard-name"
                            label="Name"
                            className={classes.usernameField}
                            value={this.state.playername}
                            onChange={this.handleChange('playername')}
                            margin="normal"
                        />
                        <Button onClick={this.connectToRoom} className={classes.nameButton}>Join Game</Button>
                    </Card>
                ) : !this.state.roomExists ? (
                    <Typography>Room does not exist!</Typography>
                ) : (
                    <Typography>{this.state.usernames.join(', ')}</Typography>
                )}
            </div>
        );
    }
}

export default withStyles(style)(GameRoom);