import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { muiDarkTheme as darkTheme, muiLightTheme as lightTheme } from 'theme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import cookie from 'react-cookies';

import GameRoom from 'Pages/GameRoom';
import Lobby from 'Pages/Lobby';

import GlobalOptions from 'Components/GlobalOptions';

const hist = createBrowserHistory();

class MainRouter extends React.Component {
    constructor(props) {
        super(props);

        const initialTheme = cookie.load('darkmode') ? cookie.load('darkmode') === 'true' : true;

        this.state = {
            theme: initialTheme ? darkTheme : lightTheme,
            initialTheme,
            generalRoutes: [],
            privateRoutes: [],
        };
    }

    toggleTheme = darkmode => {
        this.setState({
            theme: darkmode ? darkTheme : lightTheme,
        });
        cookie.save('darkmode', darkmode)
    };

    render() {
        return (
            <Router history={hist}>
                <MuiThemeProvider theme={this.state.theme}>
                    <GlobalOptions darkmode={this.state.initialTheme} toggleTheme={this.toggleTheme}/>
                    <Switch>
                        <Route path={'/room/:roomcode'} component={GameRoom}/>
                        <Route path={'/lobby'} component={Lobby}/>
                        <Redirect from={'*'} to={'/lobby'}/>
                    </Switch>
                </MuiThemeProvider>
            </Router>
        );
    }
}

ReactDOM.render(<MainRouter />, document.getElementById('app'));