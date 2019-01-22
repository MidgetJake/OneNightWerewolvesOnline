export default theme => ({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.pageBackground,
    },
    createLobby: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    selectSection: {
        display: 'flex',
        alignItems: 'center',
    },
    textBox: {
        margin: theme.spacing.unit,
        marginBottom: 0,
    },
    createTitle: {
        background: theme.palette.titleback,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.unit,
    },
    createButton: {
        marginTop: theme.spacing.unit,
    },
    lobbyList: {
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        marginLeft: theme.spacing.unit * 2,
    },
    lobbyBar: {
        display: 'flex',
        padding: theme.spacing.unit,
        background: theme.spacing.titl
    },
});