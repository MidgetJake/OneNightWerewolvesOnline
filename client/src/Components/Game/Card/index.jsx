import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';

class GameCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardName: this.props.centre ? this.props.id : this.props.username,
            cardText: this.props.cardText | '',
            id: this.props.id,
            canInteract: this.props.canInteract,
            centre: this.props.centre | false,
            blocked: this.props.blocked | false,
            cardType: this.props.centre ? 'centre' : 'player',
            votes: this.props.votes | 0,
            isGame: this.props.isGame | false,
            killed: this.props.killed | false,
        };
    }

    handleClick = () => {
        if (!this.state.isGame) {
            if ((this.state.canInteract !== 'none' && this.state.cardType === this.state.canInteract) || this.state.canInteract === 'both') {
                this.props.onClick(this.state.centre, this.props.id);
            }
        } else {
            if(this.state.centre) return;
            this.props.onClick(null, this.state.centre ? 'centre' : this.props.id);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            cardText: nextProps.cardText,
            canInteract: nextProps.canInteract,
            blocked: nextProps.blocked,
            votes: nextProps.votes,
            isGame: nextProps.isGame,
            killed: nextProps.killed,
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classnames(classes.root, { [classes.blocked]: this.state.blocked, [classes.killed]: this.state.killed })}>
                <ButtonBase focusRipple className={classes.cardButton} onClick={this.handleClick}>
                    <Typography>{this.state.cardName}{this.props.isSelf ? ' (You)' : null}</Typography>
                    <Typography>{this.state.cardText}</Typography>
                    {this.state.isGame ?
                        this.state.centre ? null : (<Typography>Votes: {this.state.votes}</Typography>
                    ) : ( null )}
                </ButtonBase>
            </Card>
        );
    }
}

export default withStyles(style)(GameCard);