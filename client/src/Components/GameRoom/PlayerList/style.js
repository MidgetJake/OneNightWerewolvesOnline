export default theme => ({
    root: {
        padding: 0,
        alignSelf: 'stretch',
        width: 400,
        marginLeft: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column',
    },
    list: {
        padding: 0,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    titleItem: {
        background: theme.palette.titleback,
        padding: theme.spacing.unit,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
});