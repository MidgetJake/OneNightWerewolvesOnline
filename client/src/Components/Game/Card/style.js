export default theme => ({
    root: {
        width: 125,
        height: 150,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'stretch',
        margin: 15,
    },
    killed: {
        background: '#a55',
    },
    inactive: {
        background: '#555',
    },
    cardButton: {
        padding: 15,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    blocked: {
        background: '#983',
    },
});