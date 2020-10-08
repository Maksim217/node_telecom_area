const { Router } = require('express');
const Service = require('../models/Service');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const service = await Service.getAll();
    res.json({ service });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

module.exports = router;
