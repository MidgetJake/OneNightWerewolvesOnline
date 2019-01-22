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
    codeBox: {
        display: 'flex',
    },
    copyButton: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
    },
    codeTextBox: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        paddingLeft: theme.spacing.unit,
    },
    hostSect: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    textBox: {
        marginTop: theme.spacing.unit,
    },
});