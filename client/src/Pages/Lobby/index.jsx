import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import style from './style';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import RoomItem from 'Components/RoomItem';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomname: '',
            roomPassword: '',
            privateChecked: false,
            roomList: [],
        };

        this.getRooms();
    }

    getRooms = () => {
        axios.get('/room/getall').then(response => {
            this.setState({ roomList: response.data.roomList });
        })
    };

    handleCheckedChange = name => event => {
        this.setState({
            [name]: event.target.checked,
        });
    };

    createRoom = () => {
        axios.post('/room/create', {
            roomname: this.state.roomname,
            password: this.state.roomPassword,
            data: {
                public: !this.state.privateChecked,
            },
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
                <Card className={classes.createLobby}>
                    <Card className={classes.createTitle}>
                        <Typography>Create a room</Typography>
                    </Card>
                    <TextField
                        className={classes.textBox}
                        name={'room-name'}
                        label='Room Name'
                        value={this.state.roomname}
                        onChange={this.handleChange('roomname')}
                        margin='normal'
                        variant="outlined"
                        autoComplete={'room-name'}
                    />
                    <TextField
                        className={classes.textBox}
                        name={'room-pass'}
                        label='Room Password'
                        value={this.state.roomPassword}
                        onChange={this.handleChange('roomPassword')}
                        margin='normal'
                        type={'password'}
                        variant="outlined"
                        autoComplete={'room-password'}
                    />
                    <div className={classes.selectSection}>
                        <Checkbox
                            checked={this.state.privateChecked}
                            onChange={this.handleCheckedChange('privateChecked')}
                        />
                        <Typography>Private Lobby</Typography>
                    </div>
                    <Button variant='contained' color='primary' onClick={this.createRoom}>Create Room</Button>
                </Card>
                <div className={classes.lobbyList}>
                    <Card className={classes.lobbyBar}><Button onClick={this.getRooms}>Refresh List</Button></Card>
                    {this.state.roomList.map(room => <RoomItem room={room} />)}
                </div>
            </div>
        );
    }
}

export default withStyles(style)(withMobileDialog()(Game));