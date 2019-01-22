import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import NumberFormat from 'react-number-format';
import style from './style';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

class ControlBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomPassword: this.props.password || '',
            isHost: this.props.isHost || false,
            phaseTime: 3,
            discussionTime: 180,
            tieCooldown: 10,
            unsavedChanges: false,
            maxPlayers: 14,
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
            unsavedChanges: true,
        });
    };

    setChanges = () => {
        if (!this.state.isHost) return;
        this.setState({ unsavedChanges: false });
        this.props.socket.send(JSON.stringify({
            type: 'set-changes',
            data: {
                password: this.state.roomPassword,
                turnTime: this.state.phaseTime,
                discussionTime: this.state.discussionTime / 60,
                tiedCooldown: this.state.tieCooldown,
            },
        }));
    };

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.root}>
                <Button variant='contained' color={'primary'} onClick={this.props.onStart}>Start Game</Button>
                <div className={classes.section}>
                    <TextField
                        className={classes.textBox}
                        label={'Room password'}
                        value={this.state.password}
                        onChange={this.handleChange('roomPassword')}
                        margin="normal"
                        type={'password'}
                        variant="outlined"
                    />
                    <TextField
                        className={classes.textBox}
                        label={'Max players'}
                        value={this.state.maxPlayers}
                        onChange={this.handleChange('maxPlayers')}
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            inputComponent: NumberFormatCustomPlayers,
                        }}
                    />
                    <TextField
                        className={classes.textBox}
                        label={'Phase time'}
                        value={this.state.phaseTime}
                        onChange={this.handleChange('phaseTime')}
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                        }}
                    />
                    <TextField
                        className={classes.textBox}
                        label={'Discussion time'}
                        value={this.state.discussionTime}
                        onChange={this.handleChange('discussionTime')}
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                        }}
                    />
                    <TextField
                        className={classes.textBox}
                        label={'Tied vote cooldown'}
                        value={this.state.tieCooldown}
                        onChange={this.handleChange('tieCooldown')}
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                        }}
                    />
                    <Button color={this.state.unsavedChanges ? 'secondary' : 'primary'} variant='contained' onClick={this.setChanges}>Apply</Button>
                </div>
            </Card>
        );
    }
}

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            suffix=" Seconds"
            isAllowed={values => values.floatValue >= 1}
        />
    );
}

function NumberFormatCustomPlayers(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            suffix=" Seconds"
            isAllowed={values => values.floatValue > 2 && values.floatValue < 15}
        />
    );
}

export default withStyles(style)(ControlBar);