import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Blindfold from './Blindfold';
import CentreCard from 'Components/Game/Card/Centre';
import Typography from '@material-ui/core/Typography';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.socket = this.props.socket;

        this.socket.onmessage = rawmsg => {
            const message = JSON.parse(rawmsg.data);
            console.log(message);

            switch (message.type) {
                case 'wake-up':
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
                    });
                    break;
                case 'stay-asleep':
                    this.setState({ blinded: true, turnText: message.data.turnInstructions });
                    break;
                case 'go-sleep':
                    this.setState({ blinded: true });
                    break;
                case 'get-info':
                    this.setState({ info: message.data });
                    break;
                case 'turn-text':
                    this.setState({ turnText: message.data.text });
                    break;
                case 'card-assign':
                    this.setState({ turnText: message.data.card });
                    break;
                case 'show-card':
                    this.setState(state => {
                        state.centreCards[message.data.id] = message.data.cardName;
                        return state;
                    });
                    break;
            }
        };

        this.state = {
            players: [],
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
                        {this.state.centreCards.map((cardName, index) => (
                            <CentreCard canInteract={this.state.canInteract} cardName={cardName} cardNum={index} onClick={this.checkCard} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(style)(Game);