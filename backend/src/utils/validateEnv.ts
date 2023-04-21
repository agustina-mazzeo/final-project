import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    SECRET_KEY: str(),
    BASE: str(),
    SYMBOLS: str(),
    APIKEY: str(),
  });
};

export default validateEnv;
