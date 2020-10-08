const { Router } = require('express');
const Detailing = require('../models/Detailing');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const detailing = await Detailing.getAll();
    res.json({ detailing });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

module.exports = router;
