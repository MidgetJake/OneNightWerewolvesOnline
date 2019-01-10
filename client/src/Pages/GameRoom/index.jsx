import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

import PlayerList from 'Components/GameRoom/PlayerList';
import SelectorCard from 'Components/GameRoom/SelectorCard';
import ControlBar from 'Components/GameRoom/ControlBar';
import Game from 'Components/Game';

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

        this.state = {
            playername: this.cookies.username || '',
            loading: true,
            roomExists: false,
            nameDialog: false,
            connected: false,
            usernames: [],
            roomPassword: false,
            password: '',
            isHost: false,
            game: false,
            players: [],
            cards: [
                { card: 'Werewolf', name: 'Werewolf1', active: false },
                { card: 'Werewolf', name: 'Werewolf2', active: false },
                { card: 'Dream Wolf', name: 'DreamWolf', active: false },
                { card: 'Mystic Wolf', name: 'MysticWolf', active: false },
                { card: 'Minion', name: 'Minion', active: false },
                { card: 'Villager', name: 'Villager1', active: false },
                { card: 'Villager', name: 'Villager2', active: false },
                { card: 'Villager', name: 'Villager3', active: false },
                { card: 'Mason', name: 'Mason1', active: false },
                { card: 'Mason', name: 'Mason2', active: false },
                { card: 'Seer', name: 'Seer', active: false },
                { card: 'Apprentice Seer', name: 'ApprenticeSeer', active: false },
                { card: 'Sentinel', name: 'Sentinel', active: false },
                { card: 'Tanner', name: 'Tanner', active: false },
                { card: 'Robber', name: 'Robber', active: false },
                { card: 'Witch', name: 'Witch', active: false },
                { card: 'Drunk', name: 'Drunk', active: false },
                { card: 'Insomniac', name: 'Insomniac', active: false },
            ],
            dialogShow: false,
            dialogText: '',
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
                roomHash: this.props.match.params.roomcode,
                username: this.state.playername,
                password: this.state.password,
            },
        })));
    };

    getPlayers = () => {
        axios.post('/room/players/' + this.props.match.params.roomcode).then(response => {
            if (response.data.success) {
                this.setState({ loading: false, connected: true, usernames: response.data.players });
            }
        });
    };

    getCards = () => {
        axios.post('/room/getcards/' + this.props.match.params.roomcode).then(response => {
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
        axios.post('/room/exists/' + this.props.match.params.roomcode).then(response => {
            if (response.data.exists) {
                this.setState({ roomExists: true, nameDialog: true, loading: false, roomPassword: response.data.password });
                this.connection = new WebSocket('ws://localhost', [this.props.match.params.roomcode]);

                this.connection.onmessage = rawmsg => {
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
                            this.setState({
                                usernames: [
                                    ...this.state.usernames, {
                                        username: message.data.username,
                                        host: false,
                                    },
                                ],
                            });
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
                        case 'game-start':
                            this.setState({ game: true, players: message.data.players });
                            break;
                        case 'invalid-password':
                            this.setState({ dialogShow: true, dialogText: 'Invalid Password' });
                            break;
                    }
                };
            } else {
                this.setState({ loading: false, roomExists: false });
            }
        });
    }

    startGame = () => {
        if (!this.state.isHost) return;
        this.sendMessage(JSON.stringify({ type: 'start-game' }));
    };

    handleDialogClose = () => {
        this.setState({ dialogShow: false, loading: false, nameDialog: true });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.back}>
                <Dialog
                    open={this.state.dialogShow}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    {this.state.dialogText}
                    <Button onClick={this.handleDialogClose}>Dismiss</Button>
                </Dialog>
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
                        {this.state.roomPassword ? (
                            <TextField
                                id="standard-name"
                                label={'Room password'}
                                className={classes.usernameField}
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                margin="normal"
                                type={'password'}
                            />
                        ) : ( null )}
                        <Button onClick={this.connectToRoom} className={classes.nameButton}>Join Game</Button>
                    </Card>
                ) : !this.state.roomExists ? (
                    <Typography>Room does not exist!</Typography>
                ) : this.state.game ? (
                    <Game players={this.state.players} socket={this.connection}/>
                ) : (
                    <Card className={classes.gameBack}>
                        <PlayerList players={this.state.usernames}/>
                        <div className={classes.controlSector}>
                            {this.state.isHost ? (
                                <ControlBar onStart={this.startGame}/>
                            ) : (
                                null
                            )}
                            <div className={classes.cardContainter}>
                                {this.state.cards.map((card, index) => (
                                    <SelectorCard key={index} card={card} host={this.state.isHost} sendMessage={this.sendMessage}/>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        );
    }
}

export default withStyles(style)(GameRoom);