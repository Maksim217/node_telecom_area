const config = require('config');

module.exports = function (email, token) {
  return {
    to: email,
    from: config.get('emailFrom'),
    subject: 'Восстановление доступа',
    html: `
            <h1>Вы забыли пароль ?</h1>
            <p>Если нет, то проигнорируйте данное письмо</p>
            <p>Иначе нажмите на ссылку ниже:</p>
            <p><a href="${config.get('baseUrl')}/password/${token}">Восстановить доступ</a></p>
            <hr />
            <a href="${config.get('baseUrl')}">Вернуться на страницу авторизации</a>
        `,
  };
};
