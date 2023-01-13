const Document = require("../models/Document");
const { sendStatus, setUpdateValue, imageUrl } = require("../services/global");
const { updateArrayOfObject, pushArrayOfObject, getUser } = require("../services/users");
const s3Uploadv2 = require('../services/awsS3');
const path = require("path");

/**
 * @desc View documents by :id
 * @route Get /document/:id
 * @access Private
 */
const getDocuments = async (req, res) => {
  const user = await getUser(req);
  const documents = user.documents;

  sendStatus(res, 200, documents);
};

/**
 * @desc Store document
 * @route Put /document/store
 * @access Private
 */
const storeDocument = async (req, res) => {
  try {
    const { category } = req.body;
    const user = await getUser(req);

    const exist = user?.documents?.find((x) => {
      return x.category === category;
    });

    if(!req.file) sendStatus(res, 400, 'Document is missing')

    if (exist)
      return sendStatus(res, 200 ,"Category type already exist. Please select another category");

    const url = await s3Uploadv2(req.file);

    // create object for document
    const documentObj = {
      user,
      imagePath: url.Location,
      ...req.body,
    };
    // console.log(documentObj)
    const document = await Document.create(documentObj);
    
    // update the document inside user object
    await pushArrayOfObject("documents", user._id, document);

    sendStatus(res, 200, "Success");
  } catch (err) {
    sendStatus(res, 400, err.errors);
  }
};

/**
 * @desc Update document
 * @route Post /document/update/:id
 * @access Private
 */
const updateDocument = async (req, res) => {
  const { filter, update, _id } = setUpdateValue(req);
  const { category } = req.body;
  try {
    await Document.updateOne(filter, update);

    const user = await getUser(req);

    const exist = user?.documents?.find((x) => {
      return x.category == category;
    });

    if (exist)
      return sendStatus(
        res,
        200,
        "Category type already exist. Please select another category"
      );

    // find updated document
    const document = await Document.findOne({ _id }).mySelectRemove().exec();

    // update the document inside user object
    await updateArrayOfObject("documents", _id, document);

    res.json({ message: "Success" });
  } catch (err) {
    sendStatus(res, 401, err.message);
  }

};

module.exports = {
  getDocuments,
  storeDocument,
  updateDocument,
};
