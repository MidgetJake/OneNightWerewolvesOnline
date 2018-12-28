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
                    this.setState({ blinded: false });
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
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.blinded ? <Blindfold text={this.state.turnText}/> : null}
            </div>
        );
    }
}

export default withStyles(style)(Game);