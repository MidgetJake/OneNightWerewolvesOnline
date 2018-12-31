import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Blindfold from './Blindfold';
import CentreCard from 'Components/Game/Card/Centre';
import PlayerCard from 'Components/Game/Card/Player';
import Typography from '@material-ui/core/Typography';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.socket = this.props.socket;

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
                            if (players[i].id !== player.id) continue;
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
                    this.setState({ turnText: message.data.card, ownID: message.data.id });
                    break;
                case 'show-card':
                    this.setState(state => {
                        if (message.data.centre) {
                            state.centreCards[message.data.id] = message.data.cardName.name;
                        } else {
                            state.players[message.data.id.toString()].cardName = message.data.cardName;
                        }

                        return state;
                    });
                    break;
                case 'end-night':
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
        };
    }

    checkCard = (centreCard, id) => {
        if (!this.state.night) return;
        this.socket.send(JSON.stringify({ type: 'check-card', data: { centre: centreCard, id } }));
    };

    // ToDo: Merge the PlayerCard and CentreCard into a single Component, should be pretty easy
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.blinded ? <Blindfold text={this.state.turnText}/> : (
                    <div>
                        {this.state.night ? (
                            <div>
                                <Typography>{this.state.turnInstructions}</Typography>
                                <Typography>{this.state.awakeMessage}</Typography>
                            </div>
                        ) : (
                            null
                        )}
                        <div className={classes.centreCards}>
                            {this.state.centreCards.map((cardName, index) => (
                                <CentreCard centre canInteract={this.state.canInteract} cardName={cardName} id={index} onClick={this.checkCard} />
                            ))}
                        </div>
                        <div className={classes.playerCards}>
                            {this.state.players.map(player => (
                                <CentreCard blocked={player.blocked} canInteract={this.state.canInteract} cardName={player.cardName} username={player.username} id={player.id} onClick={this.checkCard} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(style)(Game);