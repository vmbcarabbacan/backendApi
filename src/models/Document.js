const mongoose = require("mongoose");

const documentCategory = [
  "government-id",
  "police-clearance-certificate",
  "medical-fitness-certificate",
  "driver-license",
  "vehicle-registration",
  "vehicle-insurance",
  "driver-photo",
  "car-photo",
  "others",
];
const statuses = ["Pending", "Approved", "Cancelled", "Expired"];
const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: documentCategory,
    required: true,
    default: null,
    validate(val) {
      if (!documentCategory.includes(val)) {
        throw new Error(`Document type: ${val} is not supported`);
      }
    },
  },
  message: {
    type: String,
    default: null,
    required: false,
  },
  expiryDate: {
    type: Date,
    default: null,
    required: false,
  },
  imagePath: {
    type: String,
    required: false,
    default: null
  },
  status: {
    type: String,
    enum: statuses,
    required: true,
    default: "Pending",
    validate(val) {
      if (!statuses.includes(val)) {
        throw new Error(`Status: ${val} is not supported`);
      }
    },
  },
});

documentSchema.query.Pending = function () {
  return this.where({ status: "Pending" });
};

documentSchema.query.Approved = function () {
  return this.where({ status: "Approved" });
};

documentSchema.query.Cancelled = function () {
  return this.where({ status: "Cancelled" });
};

documentSchema.query.Expired = function () {
  return this.where({ status: "Expired" });
};

documentSchema.query.GovernmentId = function () {
  return this.where({ category: "government-id" });
};

documentSchema.query.PoliceCertificate = function () {
  return this.where({ category: "police-clearance-certificate" });
};

documentSchema.query.MedicalCertificate = function () {
  return this.where({ category: "medical-fitness-certificate" });
};

documentSchema.query.DriverLicense = function () {
  return this.where({ category: "driver-license" });
};

documentSchema.query.VehicleRegistration = function () {
  return this.where({ category: "vehicle-registration" });
};

documentSchema.query.VehicleInsurance = function () {
  return this.where({ category: "vehicle-insurance" });
};

documentSchema.query.DriverPhoto = function () {
  return this.where({ category: "driver-photo" });
};

documentSchema.query.CarPhoto = function () {
  return this.where({ category: "car-photo" });
};

documentSchema.query.Others = function () {
  return this.where({ category: "others" });
};

documentSchema.query.mySelectRemove = function () {
  return this.select(["-__v", "-user", "-_id"]);
};

documentSchema.query.byGeneric = function (column, value) {
  return this.where({ [column]: new RegExp(value, "i") });
};

module.exports = mongoose.model("Document", documentSchema);
