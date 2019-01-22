import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import { Scrollbars } from 'react-custom-scrollbars';

class PlayerList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.root}>
                <List component="nav" className={classes.list}>
                    <Card className={classes.titleItem}>
                        <ListItemText primary='Players' />
                    </Card>
                    <Scrollbars
                        renderView={props => <div {...props} style={{
                            marginBottom: 'unset',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflow: 'auto',
                        }} />}
                    >
                    {this.props.players.map((player, index) => (
                        <div key={index}>
                            {index > 0 ? <Divider light /> : null }
                            <ListItem button>
                                <ListItemText primary={(player.self ? '(You) ' : '') + player.username} secondary={player.host ? 'host' : ''} />
                            </ListItem>
                        </div>
                    ))}
                    </Scrollbars>
                </List>
            </Card>
        );
    }
}

export default withStyles(style)(PlayerList);