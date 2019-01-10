export default theme => ({
    root: {
        width: '100vw',
        height: '100vh',
    },
    containerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        display: 'flex',
        height: 20,
        alignSelf: 'stretch',
    },
    progressBar: {
        flexGrow: 1,
    },
    cardContainer: {
        display: 'flex',
        padding: 15,
        border: '1px rgba(255, 255, 255, 0.4) solid',
        borderRadius: 15,
        margin: 15,
        width: 'calc(100vw - 62px)',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        position: 'relative',
    },
    voteButton: {
        padding: 5,
        paddingRight: 25,
        paddingLeft: 25,
        background: '#444',
        alignSelf: 'center',
    },
    containerText: {
        position: 'absolute',
        background: '#888',
        top: 0,
        left: 45,
        transform: 'translate(0, -50%)',
        padding: 5,
    },
    centreCards: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },
    playerCards: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },
});