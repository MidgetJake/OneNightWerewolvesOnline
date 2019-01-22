export default theme => ({
    root: {
        padding: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        marginBottom: theme.spacing.unit * 2
    },
    section: {
        // border: '1px solid rgba(255, 255, 255, 0.23)',
        // padding: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingTop: 0,
        borderRadius: 8,
        marginTop: theme.spacing.unit,
    },
    textBox: {
        marginTop: theme.spacing.unit,
    },
});