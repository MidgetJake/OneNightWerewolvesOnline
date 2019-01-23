export default {
    Teams: {
        Werewolf: 'werewolf',
        Village: 'village',
        Tanner: 'tanner',
    },
    url: process.env.SYSENV === 'PROD' ? 'https://werewolves.jakebarter.co.uk' : 'http://localhost',
    wsURL: process.env.SYSENV === 'PROD' ? 'wss://werewolves.jakebarter.co.uk' : 'ws://localhost',
};