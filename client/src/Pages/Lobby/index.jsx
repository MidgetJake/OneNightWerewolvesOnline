import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import style from './style';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomname: '',
            password: '',
        };
    }

    createRoom = () => {
        axios.post('/room/create', {
            roomname: this.state.roomname,
            password: this.state.password,
        }).then(response => {
            this.props.history.push('/room/' + response.data.roomhash);
        })
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Card>
                    <TextField
                        label='Room Name'
                        value={this.state.roomname}
                        onChange={this.handleChange('roomname')}
                        margin='normal'
                    />
                    <TextField
                        label='Room Password'
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        margin='normal'
                        type={'password'}
                    />
                    <Button variant='contained' color='primary' onClick={this.createRoom}>Create Room</Button>
                </Card>
            </div>
        );
    }
}

export default withStyles(style)(withMobileDialog()(Game));