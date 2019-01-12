import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import style from './style';
import classnames from 'classnames';
import axios from 'axios';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Icon from '@mdi/react';
import { mdiInformationOutline, mdiCheckCircleOutline } from '@mdi/js';

import PlaceholdImg from 'Static/Img/CardArt/Placehold.png';

class SelectorCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: this.props.card.active,
            dialogOpen: false,
            cardData: {},
        };

        axios.get('/card/' + this.props.card.card).then(response => {
            this.setState({ cardData: response.data.cardInfo });
        });
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

    handleInfo = () => {
        this.setState({ dialogOpen: true });
    };

    handleClose = () => {
        this.setState({ dialogOpen: false });
    };

    render() {
        const { classes, fullScreen } = this.props;

        return (
            <Card className={classes.root}>

                <ButtonBase focusRipple className={classes.cardButton} onClick={this.handleToggleActive}>
                    <img className={classes.cardArt} src={'/' + PlaceholdImg} />{ this.props.card.active ? (
                    <Icon
                        path={mdiCheckCircleOutline}
                        className={classes.active}
                        size={4}
                        color={'green'}
                    />
                ) : null }
                </ButtonBase>

                <div className={classes.topContainter}>
                    <IconButton className={classes.infoButton} onClick={this.handleInfo}>
                        <Icon path={mdiInformationOutline}
                              size={1}
                              horizontal
                              vertical
                              color="white"/>
                    </IconButton>
                </div>

                <div className={classes.bottomContainter}>
                    <Typography>{this.props.card.card}</Typography>
                </div>

                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.dialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">The {this.props.card.card}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Team: {this.state.cardData.team}
                        </DialogContentText>
                        <Divider/>
                        <DialogContentText>
                            {this.state.cardData.action}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Dismiss
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        );
    }
}

export default withStyles(style)(withMobileDialog()(SelectorCard));