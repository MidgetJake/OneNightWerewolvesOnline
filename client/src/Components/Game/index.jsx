import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import style from './style';

import Blindfold from './Blindfold';
import GameCard from 'Components/Game/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.socket = this.props.socket;
        this.countdownTime = setInterval(() => {
            if (this.state.countdown < 1) return;
            console.log(this.state.countdown);
            this.setState({ countdown: this.state.countdown - 1000 });
        }, 1000);

        /* !!!!! HACKY METHOD ALERT !!!!!
           We don't want a reference for this... and this is the only way I could get to work
           Please feel free to ridicule me for this until a better method is here */
        let players = JSON.parse(JSON.stringify(this.props.players));

        this.socket.onmessage = rawmsg => {
            const message = JSON.parse(rawmsg.data);
            console.log(message);

            switch (message.type) {
                case 'wake-up':
                    for (let player of message.data.othersAwake) {
                        if (player === null) continue;
                        for (let i = 0; i < players.length; i++) {
                            players[i].blocked = players[i].id === message.data.blockedPlayer;
                            if (players[i].id !== player.id.toString()) continue;
                            players[i].cardName = player.type;
                            players[i].username = player.username;
                        }
                    }

                    this.setState({
                        blinded: false,
                        awakeMessage: message.data.othersAwake.length > 1 ? (
                            'Others awake: ' + message.data.othersAwake.reduce((accumulator, currentVal) => (
                                currentVal !== null ? accumulator + ' ' + currentVal.type + '(' + currentVal.username + ')' : accumulator
                            ), '')
                        ) : (
                            'You are alone!'
                        ),
                        turnInstructions: message.data.turnInstructions,
                        canInteract: message.data.canInteract,
                        players,
                        countdown: (message.data.turnTime * 1000),
                        timer: (message.data.turnTime * 1000),
                    });
                    break;
                case 'stay-asleep':
                    this.setState({ blinded: true, turnText: message.data.turnInstructions });
                    break;
                case 'go-sleep':
                    this.setState({
                        blinded: true,
                        centreCards: [null, null, null, null],
                        players: JSON.parse(JSON.stringify(this.props.players)),
                    });
                    break;
                case 'get-info':
                    this.setState({ info: message.data });
                    break;
                case 'turn-text':
                    this.setState({ turnText: message.data.text });
                    break;
                case 'card-assign':
                    this.setState({ turnText: message.data.card, ownID: message.data.id.toString() });
                    break;
                case 'show-card':
                    this.setState(state => {
                        if (message.data.centre) {
                            state.centreCards[message.data.id] = message.data.cardName;
                        } else {
                            state.players[message.data.id.toString()].cardName = message.data.cardName;
                        }

                        return state;
                    });
                    break;
                case 'end-night':
                    const playerVotes = { centre: 0 };

                    this.props.players.map(player => {
                        playerVotes[player.id] = 0;
                    });

                    this.setState({
                        blinded: false,
                        night: false,
                        centreCards: [null, null, null, null],
                        players: this.props.players.map(player => {
                            if (player.id === message.data.blockedPlayer) {
                                return { ...player, blocked: true };
                            } else {
                                return player;
                            }
                        }),
                        votes: playerVotes,
                        timer: (message.data.discussionTime),
                        countdown: (message.data.discussionTime),
                    });
                    break;
                case 'failed-vote':
                    this.setState({
                        timer: (message.data.tiedCooldown * 1000),
                        countdown: (message.data.tiedCooldown * 1000),
                    });
                    break;
                case 'show-blocked':
                    this.setState({
                        players: this.state.players.map(player => {
                            if (player.id === message.data.blockedPlayer) {
                                return { ...player, blocked: true, username: this.state.ownID === player.id ? player.username + ' (You)' : player.username };
                            } else {
                                return { ...player,username: this.state.ownID === player.id ? player.username + ' (You)' : player.username };
                            }
                        }),
                    });
                    break;
                case 'vote-update':
                    this.setState({ votes: message.data.votes });
                    break;
                case 'game-complete':
                    console.log(message.data);
                    for (let player in message.data.playerCards) {
                        if (!message.data.playerCards.hasOwnProperty(player)) continue;
                        for (let i = 0; i < players.length; i++) {
                            if (players[i].id !== player.toString()) continue;
                            console.log(players[i].id, message.data.killed);
                            if (players[i].id === message.data.killed) {
                                console.log('DED');
                                players[i].killed = true;
                            }
                            players[i].cardName = message.data.playerCards[player];
                        }
                    }

                    this.setState({
                        killed: message.data.killed,
                        players,
                        centreCards: message.data.centreCards,
                        winner: true,
                        winningTeam: message.data.winningTeam,
                        winnerDialog: true,
                    });
                    break;
            }
        };

        this.state = {
            ownID: -1,
            players: this.props.players,
            selfPlayer: 0,
            middleVotes: 0,
            blinded: true,
            info: null,
            turnText: 'Wait to be assigned a card',
            awakeMessage: '',
            turnInstructions: '',
            night: true,
            centreCards: [null, null, null, null],
            canInteract: 'none',
            lastVoteID: null,
            votes: {},
            winner: false,
            killed: null,
            winnerDialog: false,
            countdown: 7000,
            timer: 7000,
        };
    }

    checkCard = (centreCard, id) => {
        if (this.state.killed !== null) return;
        if (this.state.night) {
            this.socket.send(JSON.stringify({type: 'check-card', data: {centre: centreCard, id}}));
        } else {
            this.socket.send(JSON.stringify({ type: 'vote-player', data: { id, removeVote: this.state.lastVoteID } }));
            this.setState({ lastVoteID: id });
        }
    };

    handleClose = () => {
        this.setState({ winnerDialog: false });
    };

    componentWillUnmount() {
        clearInterval(this.countdownTime);
    }

    render() {
        const { classes, fullScreen } = this.props;

        return (
            <div className={classes.root}>
                {this.state.blinded ? <Blindfold text={this.state.turnText}/> : (
                    <div className={classes.containerContainer}>
                        <div className={classes.progressContainer}>
                            <LinearProgress className={classes.progressBar} color={'secondary'} variant='determinate' value={Math.min(((this.state.countdown - 100) / this.state.timer) * 100)} />
                        </div>
                        {this.state.night ? (
                            <div>
                                <Typography>{this.state.turnInstructions}</Typography>
                                <Typography>{this.state.awakeMessage}</Typography>
                            </div>
                        ) : (
                            null
                        )}
                        <div className={classes.cardContainer}>
                            <Typography className={classes.containerText}>Centre Cards</Typography>
                            <div className={classes.centreCards}>
                                {this.state.centreCards.map((cardName, index) => (
                                    <GameCard
                                        key={index}
                                        votes={this.state.votes['centre']}
                                        isGame={!this.state.night}
                                        centre
                                        canInteract={this.state.canInteract}
                                        cardText={cardName}
                                        id={index}
                                        onClick={this.checkCard}
                                        killed={this.state.killed === 'centre'}
                                    />
                                ))}
                            </div>
                            {this.state.night ? ( null ) : (
                                <Button className={classes.voteButton} onClick={() => {this.checkCard(true, 'centre')}}>
                                    <Typography>Vote Centre | {this.state.votes['centre']} Votes</Typography>
                                </Button>
                            )}
                        </div>
                        <div className={classes.cardContainer}>
                            <Typography className={classes.containerText}>Player Cards</Typography>
                            <div className={classes.playerCards}>
                                {this.state.players.map((player, index) => (
                                    <GameCard
                                        key={index}
                                        isSelf={this.state.ownID === player.id}
                                        votes={this.state.votes[player.id]}
                                        isGame={!this.state.night}
                                        blocked={player.blocked}
                                        canInteract={this.state.canInteract}
                                        cardText={player.cardName}
                                        username={player.username}
                                        id={player.id}
                                        killed={player.killed}
                                        onClick={this.checkCard}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.winnerDialog}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Winning team</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The {this.state.winningTeam} team is the winner!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close Dialog
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(style)(withMobileDialog()(Game));