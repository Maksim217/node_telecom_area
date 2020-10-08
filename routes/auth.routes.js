const { Router } = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const confEmail = require('../emails/emailConfirmation');
const resetEmail = require('../emails/resetPassword');
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { randomBalance, toCurrency, randomTariffPlan } = require('../shared/shared');
const router = Router();

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: { api_key: config.get('sendGridApiKey') },
  }),
);

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        });
      }
      const { email, password } = req.body;

      const condidate = await User.findOne({ email });

      if (condidate) {
        return res.status(400).json('Пользователь с таким email уже существует!');
      }

      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          return res
            .status(400)
            .json({ message: 'Что-то пошло не так повторите попытку позже...' });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);
        const token = buffer.toString('hex');
        const tokenExp = Date.now() + 3600 * 1000;

        const user = new User({
          email,
          password: hashedPassword,
          confirmToken: token,
          confirmTokenExp: tokenExp,
          emailConfirm: false,
        });

        await user.save();
        await transporter.sendMail(confEmail(user.email, user.confirmToken));
        res.status(201).json({
          message: 'Для активации Вашего аккаунта на указанный email было отправлено письмо',
        });
      });
    } catch (e) {
      res.status(500).json('Что-то пошло не так, повторите позже...');
    }
  },
);

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему',
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const passwordValid = await bcryptjs.compare(password, user.password);

      if (!passwordValid) {
        return res.status(400).json({ message: 'Неверный пароль попробуйте снова' });
      }

      if (!user.emailConfirm) {
        return res.status(400).json({ message: 'Для авторизации активируйте Вашу учетную запись' });
      }

      const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'), { expiresIn: '1h' });

      res.json({ token, userId: user._id });
    } catch (e) {
      res.status(500).json('Что-то пошло не так, повторите позже...');
    }
  },
);

// /api/auth/reset
router.post(
  '/reset',
  [check('email', 'Введите корректный email').normalizeEmail().isEmail()],
  (req, res) => {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return res.status(400).json({ message: 'Что-то пошло не так повторите попытку позже...' });
      }

      const token = buffer.toString('hex');
      const condidate = await User.findOne({ email: req.body.email });

      if (condidate) {
        condidate.resetToken = token;
        condidate.resetTokenExp = Date.now() + 3600 * 1000;
        await condidate.save();
        await transporter.sendMail(resetEmail(condidate.email, token));
        return res
          .status(201)
          .json({ message: 'На указанный email было отправлено письмо для смены пароля' });
      } else {
        return res.status(400).json({ message: 'Указанный email не существует' });
      }
    });
  },
);

// /api/auth/password
router.post(
  '/password',
  [check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })],
  async (req, res) => {
    const { password, token } = req.body;

    try {
      const user = await User.findOne({ resetToken: token, resetTokenExp: { $gt: Date.now() } });

      if (!user) {
        return res.status(400).json({ message: 'Время жизни ссылки истекло, попробуйте еще раз' });
      } else {
        const hashedPassword = await bcryptjs.hash(password, 12);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExp = undefined;

        await user.save();

        res.status(201).json({ message: 'Пароль успешно изменен' });
      }
    } catch (e) {
      console.log(e);
    }
  },
);

// /api/auth/confirm
router.post('/confirm', async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ confirmToken: token, confirmTokenExp: { $gt: Date.now() } });

    if (user.emailConfirm) {
      return res.status(200);
    }

    if (!user) {
      return res.status(400).json({ message: 'Время жизни ссылки истекло, попробуйте еще раз' });
    } else {
      user.confirmToken = undefined;
      user.confirmTokenExp = undefined;
      user.emailConfirm = true;

      await user.save();
    }
  } catch (e) {}
});

module.exports = router;
