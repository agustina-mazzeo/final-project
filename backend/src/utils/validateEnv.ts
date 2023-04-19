import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    SECRET_KEY: str(),
  });
};

export default validateEnv;
