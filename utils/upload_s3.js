const AWS = require("aws-sdk");
const { AWS_AK, AWS_SK, BUCKET_NAME } = require("../private/keys");

const s3 = new AWS.S3({
	accessKeyId: AWS_AK,
	secretAccessKey: AWS_SK,
});

module.exports = async (fileContent, targetKey) => {
	// Read content from local file
	//   const fileContent = fs.readFileSync(fileName);

	// Setting up S3 upload parameters
	const params = {
		Bucket: BUCKET_NAME,
		Key: targetKey, // File name you want to save as in S3
		Body: fileContent,
	};
	// Uploading files to the bucket
	let result = await s3.upload(params).promise();
	return (result);
};
