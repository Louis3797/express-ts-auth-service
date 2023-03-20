import Joi from 'joi';
import type {
  UserLoginCredentials,
  UserSignUpCredentials
} from '../types/types';

export const signupSchema = {
  body: Joi.object<UserSignUpCredentials>().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    username: Joi.string().required().min(2)
  })
};

export const loginSchema = {
  body: Joi.object<UserLoginCredentials>().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
  })
};
