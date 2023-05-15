import { cleanEnv, port, str, num } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    SECRET_KEY: str(),
    BASE: str(),
    SYMBOLS: str(),
    APIKEY: str(),
    DATABASE_URL: str(),
    TTL: num(),
  });
};

export default validateEnv;
