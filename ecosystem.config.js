module.exports = {
    apps: [
        {
            name: 'web',
            script: './app.js',
            env: {
                NODE_ENV: 'production',
                PORT: 1001,
            
            },
        },
    ],
};