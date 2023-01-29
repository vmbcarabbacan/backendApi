const { S3 } = require("aws-sdk")
const { v4: uuid } = require("uuid");

const s3Uploadv2 = async (file, folder = null) => {
	const s3 = new S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	})

	const key = !folder ? `uploads/${uuid()}-${file.originalname}` : `uploads/${folder}/${uuid()}-${file.originalname}`

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
		Body: file.buffer
	}
	return await s3.upload(params).promise()
}

module.exports = s3Uploadv2
