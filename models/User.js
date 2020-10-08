const { Schema, model } = require('mongoose');

const schema = new Schema({
  firstName: String,
  lastName: String,
  middleName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Date,
  confirmToken: String,
  confirmTokenExp: Date,
  emailConfirm: Boolean,
  service: {
    items: [
      {
        serviceId: {
          type: Schema.Types.ObjectId,
          ref: 'Service',
          required: true,
        },
      },
    ],
  },
});

module.exports = model('User', schema);
