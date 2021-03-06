// https://medium.com/@iwozzy/easily-host-images-with-node-and-google-cloud-storage-29fb14e2cdb8
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');
const storage = new Storage({
  projectId: 'credible-cosine-228918',
  keyFilename: '../key.json'
})

const uploadPhotoToStorage = (imgPath, imgName) => {
var BUCKET_NAME = 'comp4513-asg2-bucket'
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket
var myBucket = storage.bucket(BUCKET_NAME)

var file = myBucket.file(imgName)

// upload file to bucket
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket?method=upload
let localFileLocation = imgPath;
myBucket.upload(localFileLocation, { public: true, destination: "photos/large/" + imgName })
  .then(file => {
    // file saved
	console.log("FILE WAS UPLOADED TO GOOGLE STORAGE");
	console.log(imgPath);
	fs.unlinkSync(imgPath);
	console.log("file is deleted from server");
	return getPublicThumbnailUrlForItem(imgName);
  })
   
// get public url for file
getPublicThumbnailUrlForItem = (file_name) => {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${file_name}`
}
}
module.exports = {
	uploadPhotoToStorage
}