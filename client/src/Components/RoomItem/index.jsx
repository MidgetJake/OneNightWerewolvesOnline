import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class RoomItem extends React.Component {
    constructor(props) {
        super(props);
    }

    connectToRoom = () => {
        this.props.history.push('/room/' + this.props.roomhash);
    };

    render() {
        const { classes, room } = this.props;

        return (
            <Card className={classes.root}>
                <Typography>{room.name}</Typography>
                <Typography>{room.playerCount} / {room.maxPlayers}</Typography>
                <Button variant='contained' onClick={this.connectToRoom}>Join</Button>
            </Card>
        );
    }
}

export default withStyles(style)(RoomItem);