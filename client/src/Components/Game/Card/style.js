export default theme => ({
    root: {
        width: 175,
        height: 225,
        textAlign: 'center',
        margin: theme.spacing.unit,
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        position: 'relative',
    },
    killed: {
        background: '#a55',
    },
    inactive: {
        background: theme.palette.cardColour,
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
        background: theme.palette.titleback,
        width: 'calc(100% - 10px)',
        padding: 5,
        display: 'flex',
        minHeight: 21,
        alignItems: 'center',
        justifyContent: 'center',

    },
    bottomContainter: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        background: theme.palette.titleback,
        width: '100%',
        padding: 5,
        minHeight: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardArt: {
        width: '100%',
    },
});