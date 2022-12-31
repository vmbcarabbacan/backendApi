const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  country: {
    type: String,
    lowercase: true,
    required: [true, "Country is required"],
    default: null,
  },
  state: {
    type: String,
    lowercase: true,
    required: [true, "State is required"],
    default: null,
  },
  city: {
    type: String,
    lowercase: true,
    required: [true, "City is required"],
    default: null,
  },
  street: {
    type: String,
    lowercase: true,
    required: [true, "Street is required"],
    default: null,
  },
  buildingName: {
    type: String,
    lowercase: true,
    default: null,
  },
  landmark: {
    type: String,
    lowercase: true,
    default: null,
  },
  coordinates: {
    type: [Number],
    default: [],
    required: false
  },
});

addressSchema.query.mySelectRemove = function () {
  return this.select(['-__v', '-address', '-user', '-_id'])
};

addressSchema.plugin(AutoIncrement, {
  inc_field: "address",
  id: "addressId",
  start_seq: 1,
});

module.exports = mongoose.model("Address", addressSchema);
