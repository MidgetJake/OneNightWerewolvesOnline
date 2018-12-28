import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';

class PlayerList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.root}>
                <List component="nav" className={classes.list}>
                    <ListItem className={classes.titleItem}>
                        <ListItemText primary='Players' />
                    </ListItem>
                    {this.props.players.map((player, index) => (
                        <div key={index}>
                            <Divider light />
                            <ListItem button>
                                <ListItemText primary={player.username} secondary={player.host ? 'host' : ''} />
                            </ListItem>
                        </div>
                    ))}
                </List>
            </Card>
        );
    }
}

export default withStyles(style)(PlayerList);