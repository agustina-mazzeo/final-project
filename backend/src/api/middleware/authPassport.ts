import * as dotenv from 'dotenv';
dotenv.config();
import { compare } from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { AccountReadService, AccountWriteService, RateReadService, UserReadService, UserWriteService } from '../../services';
import { AccountWriteRepository, AccountReadRepository, UserReadRepository, UserWriteRepository, RateReadRepository } from '../../repositories';

const userReadRepository = new UserReadRepository();
const userWriteRepository = new UserWriteRepository();
const accountReadRepository = new AccountReadRepository();
const accountWriteRepository = new AccountWriteRepository();
const rateReadRepository = new RateReadRepository();
const rateReadService = new RateReadService(rateReadRepository);
const accountReadService = new AccountReadService(accountReadRepository);
const accountWriteService = new AccountWriteService(accountReadService, accountWriteRepository, userReadRepository, rateReadService);
const userWriteService = new UserWriteService(userReadRepository, userWriteRepository, accountWriteService);
const userReadService = new UserReadService(userReadRepository);

const SECRET_KEY = process.env.SECRET_KEY as string;

const signupOpts = {
  usernameField: 'email',
};
const signupStrategy = new LocalStrategy(signupOpts, async (email, password, done) => {
  try {
    const user = await userWriteService.create({ email, password });
    return done(null, user);
  } catch (error) {
    done(error);
  }
});

const loginOpts = {
  usernameField: 'email',
};

const loginStrategy = new LocalStrategy(loginOpts, async (email, password, done) => {
  try {
    const user = await userReadService.getByEmail(email);
    if (!user || !(await compare(password, user.password))) {
      return done(new Error('Incorrect email or password'));
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

const jwtOpts = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (token, done) => {
  try {
    const { id } = await userReadService.getByID(token.id);
    if (id) {
      return done(null, id);
    }
    return done(new Error('Not authorized'));
  } catch (error) {
    return done(error);
  }
});

passport.use('signup', signupStrategy);
passport.use('login', loginStrategy);
passport.use('jwt', jwtStrategy);

export const loginLocal = passport.authenticate('login', {
  session: false,
});
export const signupLocal = passport.authenticate('signup', {
  session: false,
});
export const authJwt = passport.authenticate('jwt', {
  session: false,
});
