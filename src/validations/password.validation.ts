import Joi from 'joi';
import type { EmailRequestBody } from '../types/types';

export const forgotPasswordSchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const resetPasswordSchema = {
  body: Joi.object().keys({
    newPassword: Joi.string().required().min(6)
  }),
  params: Joi.object().keys({
    token: Joi.string().required().min(1)
  })
};
