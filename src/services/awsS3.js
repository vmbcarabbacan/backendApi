const { S3 } = require("aws-sdk")
const { v4: uuid } = require("uuid");

const s3Uploadv2 = async (file) => {
	const s3 = new S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	})

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: `uploads/${uuid()}-${file.originalname}`,
		Body: file.buffer
	}
	return await s3.upload(params).promise()
}

module.exports = s3Uploadv2
