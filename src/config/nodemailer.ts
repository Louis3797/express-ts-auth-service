import nodemailer from 'nodemailer';
// import config from './config';

// let mailConfig;

// if (config.node_env === 'production') {
//   // all emails are delivered to destination
//   mailConfig = {
//     host: 'smtp.example.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'your_username',
//       pass: 'your_password',
//     },
//   };
// } else {
//   // all emails are catched by ethereal.email
//   nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//   mailConfig = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: account.user, // generated ethereal user
//       pass: account.pass, // generated ethereal password
//     },
//   });
// });
// }

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'i5w45aectlp3hdta@ethereal.email', // generated ethereal user
    pass: 'wkb7KbnCWKxBu2ktvR', // generated ethereal password
  },
});
export default transporter;
