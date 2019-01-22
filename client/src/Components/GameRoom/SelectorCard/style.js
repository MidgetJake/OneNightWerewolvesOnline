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
    active: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        padding: 1,
    },
    cardButton: {
        flexGrow: 1,
        overflow: 'hidden',
        position: 'relative',
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
    infoButton: {
        padding: 1,
    },
    cardArt: {
        width: '100%',
    }
});