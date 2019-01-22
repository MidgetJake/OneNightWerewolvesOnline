import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const drawerWidth = 240;

const muiLightTheme = createMuiTheme({
    palette: {
        primary: {
            light: '#64B5F6',
            main: '#2196F3',
            dark: '#0D47A1',
            contrastText: '#fff',
            iconColour: '#444',
        },
        secondary: {
            light: '#EF9A9A',
            main: '#EF5350',
            dark: '#C62828',
            contrastText: '#fff',
        },
        discord: {
            light: '#7289DA',
            main: '#7289DA',
            dark: '#7289DA',
            contrastText: '#fff',
        },
        titleback: '#ddd',
        cardColour: '#fff',
        iconColour: 'black',
        pageBackground: '#eee',
    },
    typography: {
        useNextVariants: true,
    },
    shape: {
        borderRadius: 8,
    },
});

const muiDarkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: '#64B5F6',
            main: '#2196F3',
            dark: '#0D47A1',
            contrastText: '#fff',
            iconColour: '#fff',
        },
        secondary: {
            light: '#EF9A9A',
            main: '#EF5350',
            dark: '#C62828',
            contrastText: '#fff',
        },
        danger: {
            main: '#ad4638',
            hover: '#8e3529',
            contrastText: '#fff',
        },
        success: {
            main: '#22a664',
            hover: '#0f8347',
            contrastText: '#fff',
        },
        discord: {
            light: '#7289DA',
            main: '#7289DA',
            dark: '#7289DA',
            contrastText: '#fff',
        },
        titleback: '#555',
        cardColour: '#444',
        iconColour: 'white',
        pageBackground: '#313131',
    },
    typography: {
        useNextVariants: true,
    },
    shape: {
        borderRadius: 8,
    },
});

export {
    //variables
    drawerWidth,
    muiLightTheme,
    muiDarkTheme,
};
