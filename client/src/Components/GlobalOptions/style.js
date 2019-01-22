export default theme => ({
    root: {
        zIndex: 1000,
    },
    actionButton: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        left: theme.spacing.unit * 2,
    },
    optionsWindow: {
        padding: theme.spacing.unit,
        position: 'fixed',
        left: theme.spacing.unit * 2,
        bottom: theme.spacing.unit * 11,
    },
});