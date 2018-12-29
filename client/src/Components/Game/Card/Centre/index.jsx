import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

class CentreCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardText: 'Centre Card #' + this.props.cardNum,
            canInteract: 'none',
        };
    }

    handleClick = () => {
        if (this.state.canInteract === 'centre' || this.state.canInteract === 'both') {
            this.props.onClick(true, this.props.cardNum);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        return { cardText: nextProps.cardName, canInteract: nextProps.canInteract };
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.root}>
                <ButtonBase focusRipple className={classes.cardButton} onClick={this.handleClick}>
                    <Typography>{this.state.cardText}</Typography>
                </ButtonBase>
            </Card>
        );
    }
}

export default withStyles(style)(CentreCard);