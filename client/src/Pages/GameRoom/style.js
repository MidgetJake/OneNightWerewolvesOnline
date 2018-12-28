export default theme => ({
    back: {
        background: '#888',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    gameBack: {
        background: '#888',
        width: '100vw',
        display: 'flex',
        flexGrow: 1,
        height: '100%',
        alignItems: 'flex-start',
    },
    cardContainter: {
        display: 'flex',
        width: 'calc(100vw - 201px)',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingLeft: 15,
        paddingRight: 15,
    },
    nameCard: {
        width: 200,
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
    },
    nameButton: {
        marginTop: 2,
    },
});