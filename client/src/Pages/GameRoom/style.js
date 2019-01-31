export default theme => ({
    back: {
        background: theme.palette.pageBackground,
        width: 'calc(100vw - ' + theme.spacing.unit * 4 + 'px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        padding: theme.spacing.unit * 2,
    },
    gameBack: {
        // background: '#666',
        width: 'calc(100vw - ' + theme.spacing.unit * 4 + 'px)',
        display: 'flex',
        flexGrow: 1,
        alignItems: 'stretch',
        // height: '100%',
        alignSelf: 'stretch',
        maxHeight: 'calc(100vh - ' + theme.spacing.unit * 4 + 'px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        /*[theme.breakpoints.up('lg')]: {
            overflow: 'hidden',
            width: '75vw',
            flexGrow: 'unset',
        },
        [theme.breakpoints.up('xl')]: {
            height: '75vh',
        }*/
    },
    leftBar: {
        marginRight: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column',
        width: 400,
    },
    controlSector: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        flexGrow: 1,
        width: 'calc(100vw - 201px)',
        /*[theme.breakpoints.up('lg')]: {
            width: 'calc(75vw - 201px)',
        },*/
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