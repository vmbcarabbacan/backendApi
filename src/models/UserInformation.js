const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userInformationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
    lowercase: true,
    required: [true, "First name is required"],
  },
  familyName: {
    type: String,
    lowercase: true,
    required: [true, "Family name is required"],
  },
  contactNumber: {
    type: String,
    default: null,
  },
  credits: {
    type: Number,
    default: 0.0,
  },
  profile: {
    type: String,
    default: "/img/profile/default.png",
  },
});

userInformationSchema.plugin(AutoIncrement, {
  inc_field: "userInformation",
  id: "userInformationId",
  start_seq: 1,
});

userInformationSchema.query.mySelectRemove = function () {
  return this.select(['-__v', '-userInformation', '-user'])
};

userInformationSchema
  .virtual("fullName")
  .get(() => {
    return `${this.firstName} ${this.familyName}`;
  })
  .set((v) => {
    this.firstName = v.substr(0, v.indexOf(" "));
    this.familyName = v.substr(v.indexOf(" ") + 1);
  });

userInformationSchema.query.byUser = function (value) {
  return this.where({ user: new RegExp(value, "i") });
};

module.exports = mongoose.model("UserInformation", userInformationSchema);
