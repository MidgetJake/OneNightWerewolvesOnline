import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import PlayerList from 'Components/GameRoom/PlayerList';
import SelectorCard from 'Components/GameRoom/SelectorCard';

class GameRoom extends React.Component {
    constructor(props) {
        super(props);

        this.cookies = document.cookie.split(';').reduce((res, c) => {
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
            playername: this.cookies.username || '',
            loading: true,
            roomExists: false,
            nameDialog: false,
            connected: false,
            usernames: [],
            isHost: false,
            cards: [
                { card: 'Werewolf', name: 'Werewolf1', active: false },
                { card: 'Werewolf', name: 'Werewolf2', active: false },
                { card: 'Villager', name: 'Villager1', active: false },
                { card: 'Villager', name: 'Villager2', active: false },
                { card: 'Villager', name: 'Villager3', active: false },
                { card: 'Mason', name: 'Mason1', active: false },
                { card: 'Mason', name: 'Mason2', active: false },
            ],
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    connectToRoom = () => {
        this.setState({ loading: true, nameDialog: false });
        document.cookie = 'username=' + this.state.playername;
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

    getCards = () => {
        axios.post('room/getcards/' + this.urlParams.get('roomhash')).then(response => {
            if (response.data.success) {
                this.setState(state => {
                    for (let i = 0; i < state.cards.length; i++) {
                        if (response.data.cards.includes(state.cards[i].name)) {
                            state.cards[i].active = true;
                        }
                    }

                    return state;
                });
            }
        });
    };

    sendMessage = message => {
        this.connection.send(message);
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
                                if (message.data.host) {
                                    this.setState({ isHost: true });
                                }

                                this.getPlayers();
                                this.getCards();
                                break;
                            case 'user-connected':
                                this.setState({ usernames: [...this.state.usernames, { username: message.data.username, host: false }] });
                                break;
                            case 'user-disconnected':
                                this.getPlayers();
                                break;
                            case 'update-card':
                                this.setState(state => {
                                    for (let i = 0; i < state.cards.length; i++) {
                                        if (state.cards[i].name === message.data.card) {
                                            state.cards[i].active = message.data.active;
                                            break;
                                        }
                                    }

                                    return state;
                                });
                                break;
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
                    <div className={classes.gameBack}>
                        <PlayerList players={this.state.usernames}/>
                        <div className={classes.cardContainter}>
                            {this.state.cards.map((card, index) => (
                                <SelectorCard key={index} card={card} host={this.state.isHost} sendMessage={this.sendMessage}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(style)(GameRoom);