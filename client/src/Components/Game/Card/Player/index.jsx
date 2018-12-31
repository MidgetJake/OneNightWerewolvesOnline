import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import classnames from 'classnames';

import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

class CentreCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardText: this.props.username,
            id: this.props.id,
            canInteract: 'none',
        };
    }

    handleClick = () => {
        if (this.state.canInteract === 'player' || this.state.canInteract === 'both') {
            this.props.onClick(false, this.props.id);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        return { cardText: nextProps.cardName, canInteract: nextProps.canInteract };
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classnames(classes.root, { [classes.blocked]: this.props.blocked })}>
                <ButtonBase focusRipple className={classes.cardButton} onClick={this.handleClick}>
                    <Typography>{this.props.username}</Typography>
                    <Typography>{this.state.cardText}</Typography>
                </ButtonBase>
            </Card>
        );
    }
}

export default withStyles(style)(CentreCard);