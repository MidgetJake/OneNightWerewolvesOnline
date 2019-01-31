import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import Typography from '@material-ui/core/Typography';

class InfoDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Typography className={classes.text}>{this.props.text}</Typography>
            </div>
        );
    }
}

export default withStyles(style)(InfoDialog);