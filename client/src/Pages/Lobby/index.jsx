import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ownID: -1,
        };
    }

    createRoom = () => {
        axios.post('/room/create').then(response => {
            console.log(response.data.roomhash);
            this.props.history.push('/room/' + response.data.roomhash);
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Button variant='contained' color='primary' onClick={this.createRoom}>Create Room</Button>
            </div>
        );
    }
}

export default withStyles(style)(withMobileDialog()(Game));