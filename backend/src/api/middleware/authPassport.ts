import * as dotenv from 'dotenv';
dotenv.config();
import { compare } from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../../services/user.service';
import { AccountService } from '../../services/account.service';
import { AccountRepository } from '../../repositories/account.repository';
import { RateService } from 'services/rate.service';
import { RateRepository } from 'repositories/rate.repository';

const rateService = new RateService(new RateRepository());
const accountsService = new AccountService(new AccountRepository(), new UserRepository(), rateService);
const usersService = new UserService(new UserRepository(), accountsService);

const SECRET_KEY = process.env.SECRET_KEY as string;

const signupOpts = {
  usernameField: 'email',
};
const signupStrategy = new LocalStrategy(signupOpts, async (email, password, done) => {
  try {
    const user = await usersService.create({ email, password });
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
    const user = await usersService.getByEmail(email);
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
  const user = await usersService.getByID(token.id);
  if (user) {
    return done(null, user);
  }
  return done(new Error('Not authorized'));
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
