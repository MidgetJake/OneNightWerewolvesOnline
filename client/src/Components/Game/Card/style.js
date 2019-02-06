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
        flexGrow: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    blocked: {
        background: '#983',
    },
    topContainter: {
        position: 'absolute',
        top: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        background: theme.palette.cardColour,
        width: 'calc(100% - 10px)',
        padding: 5,
        display: 'flex',
        justifyContent: 'flex-end',

    },
    bottomContainter: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        background: theme.palette.cardColour,
        width: '100%',
        padding: 5,
    },
    cardArt: {
        width: '100%',
    },
});