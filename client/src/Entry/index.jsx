import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { muiDarkTheme as darkTheme, muiLightTheme as lightTheme } from 'theme';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Navbar from 'Components/Navbar';
import GameRoom from 'Pages/GameRoom';

const hist = createBrowserHistory();

class MainRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: darkTheme,
            currTheme: 'dark',
            generalRoutes: [],
            privateRoutes: [],
        };
    }

    handleChangeTheme = () => {
        this.setState({
            theme: this.state.currTheme === 'light' ? darkTheme : lightTheme,
            currTheme: this.state.currTheme === 'light' ? 'dark' : 'light',
        });
    };

    render() {
        return (
            <Router history={hist}>
                <MuiThemeProvider theme={this.state.theme}>
                    <Navbar />
                    <GameRoom />
                    {/*<Switch>
                        <Route path={'/'} />
                        {this.state.privateRoutes}
                        <Redirect from={'*'} to={'/'}/>
                    </Switch>*/}
                </MuiThemeProvider>
            </Router>
        )
    }
}

ReactDOM.render(<MainRouter />, document.getElementById('app'));