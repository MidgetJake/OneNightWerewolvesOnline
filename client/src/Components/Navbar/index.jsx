import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/Button';
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';

class Navbar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <Icon path={mdiMenu} size={1} color={'white'}/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            A night in hell
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

}

export default withStyles(style)(Navbar);