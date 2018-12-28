import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import classnames from 'classnames';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

class SelectorCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: this.props.card.active,
        };
    }

    handleToggleActive = () => {
        if (!this.props.host) return;

        const socketMessage = {
            type: this.state.active ? 'remove-card' : 'add-card',
            data: {
                cardName: this.props.card.card,
                clientCardName: this.props.card.name,
            },
        };

        console.log('Changing status of', this.props.card.name, 'to', !this.state.active);
        this.setState({ active: !this.state.active });
        this.props.sendMessage(JSON.stringify(socketMessage));
    };

    render() {
        const { classes } = this.props;

        return (
            <Card className={classnames(classes.root, { [classes.inactive]: !this.props.card.active })}>
                <ButtonBase focusRipple className={classes.cardButton} onClick={this.handleToggleActive}>
                    <Typography>{this.props.card.card}</Typography>
                </ButtonBase>
            </Card>
        );
    }
}

export default withStyles(style)(SelectorCard);