const config = require('config');

module.exports = function (email, token) {
  return {
    to: email,
    from: config.get('emailFrom'),
    subject: 'Подтверждение адреса электронной почты',
    html: `
            <h1>Благодарим за регистрацию на нашем сайте!</h1>
            <p>Для продолжения Вам необходимо перейти по ссылке ниже</p>
            <p><a href="${config.get('baseUrl')}/confirm/${token}">Активировать аккаунт</a></p>
            <hr />
            <a href="${config.get('baseUrl')}">Вернуться на страницу авторизации</a>
        `,
  };
};
