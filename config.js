import Constants from 'expo-constants';

const ENV = {
    dev: {
        TWILIO_ACCOUNT_SID: 'AC6b343086f68fd3d6f29a2ce22e231a6a',
        TWILIO_AUTH_TOKEN: '80b37efc9fc79b1d61bc28385f515203',
    },
    prod: {
        TWILIO_ACCOUNT_SID: 'AC6b343086f68fd3d6f29a2ce22e231a6a',
        TWILIO_AUTH_TOKEN: '80b37efc9fc79b1d61bc28385f515203',
    }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    if (env === 'production') {
        return ENV.prod;
    }
    return ENV.dev;
};

export default getEnvVars;
