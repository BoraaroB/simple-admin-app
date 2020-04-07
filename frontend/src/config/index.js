import config from './config.json';

const env = process.env.REACT_APP_ENV || 'dev';
const envConfig = config[env];

export default envConfig;