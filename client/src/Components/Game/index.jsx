import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Blindfold from './Blindfold';

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
                                currentVal !== null ? accumulator + ' ' + currentVal : accumulator
                            ), '')
                        ) : (
                            'You are alone!'
                        ),
                        turnInstructions: message.data.turnInstructions,
                    });
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
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.turnInstructions}
                {this.state.awakeMessage}
                {this.state.blinded ? <Blindfold text={this.state.turnText}/> : null}
            </div>
        );
    }
}

export default withStyles(style)(Game);