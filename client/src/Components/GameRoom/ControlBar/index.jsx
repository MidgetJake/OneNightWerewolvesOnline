import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

class ControlBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.root}>
                <Button variant='outlined' onClick={this.props.onStart}>Start Game</Button>
            </Card>
        );
    }
}

export default withStyles(style)(ControlBar);