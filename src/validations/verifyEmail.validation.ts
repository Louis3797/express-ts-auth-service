import Joi from 'joi';
import type { EmailRequestBody } from '../types/types';

export const sendVerifyEmailSchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const verifyEmailSchema = {
  params: Joi.object().keys({
    token: Joi.string().required().min(1)
  })
};
