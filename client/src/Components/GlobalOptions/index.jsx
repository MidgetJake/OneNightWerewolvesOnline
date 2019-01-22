import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch'
import Icon from '@mdi/react';

import { mdiSettings } from '@mdi/js';

class GlobalOptions extends React.Component {
    constructor(props) {
        super(props);

        console.log('o', this.props.darkmode);

        this.state = {
            darkmode: this.props.darkmode,
            open: false,
        }
    }

    toggleWindow = () => {
        this.setState({ open: !this.state.open });
    };

    toggleTheme = event => {
        this.setState({ darkmode: event.target.checked });
        this.props.toggleTheme(event.target.checked);
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Fab color={'primary'} onClick={this.toggleWindow} aria-label={"Toggle option window"} className={classes.actionButton}>
                    <Icon
                        path={mdiSettings}
                        size={1}
                        color={'white'}
                    />
                </Fab>
                {this.state.open ? (
                    <Card className={classes.optionsWindow}>
                        <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.darkmode}
                                    onChange={this.toggleTheme}
                                    value="darkmode"
                                    color="primary"
                                />
                            }
                            label="Dark mode"
                        />
                    </FormGroup>
                    </Card>
                ) : null }
            </div>
        );
    }
}

export default withStyles(style)(GlobalOptions);