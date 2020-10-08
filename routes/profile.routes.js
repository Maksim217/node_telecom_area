const { Router } = require('express');
const router = Router();
const User = require('../models/User');

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { firstName, lastName, middleName, avatarUrl, email } = user;
    res.json({ firstName, lastName, middleName, avatarUrl, email });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

router.post('/', async (req, res) => {
  const { userId, firstName, lastName, middleName } = req.body;
  try {
    const user = await User.findById(userId);

    user.firstName = firstName;
    user.lastName = lastName;
    user.middleName = middleName;

    await user.save();
    res.status(201).json({ message: 'Изменения сохранены' });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

module.exports = router;
