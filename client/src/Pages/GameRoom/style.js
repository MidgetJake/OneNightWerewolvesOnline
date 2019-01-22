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
        // background: '#666',
        width: '100vw',
        display: 'flex',
        flexGrow: 1,
        height: '100%',
        alignItems: 'flex-start',
        maxHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.up('lg')]: {
            overflow: 'hidden',
            width: '75vw',
            flexGrow: 'unset',
        },
        [theme.breakpoints.up('xl')]: {
            height: '75vh',
        }
    },
    leftBar: {
        paddingLeft: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column',
        width: 300,
    },
    controlSector: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        flexGrow: 1,
        height: '100vh',
        width: 'calc(100vw - 201px)',
        [theme.breakpoints.up('lg')]: {
            width: 'calc(75vw - 201px)',
        },
    },
    cardContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    scrollArea: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
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