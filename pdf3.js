const fs = require('fs');
const pdfImage = require('pdf-image');
const Jimp = require('jimp');
const CryptoJS = require('crypto-js');

async function convertPdfToImages(pdfPath) {
    const pdfImageOptions = {
        pdfPath: pdfPath,
        combinedImage: true, // Combine all pages into a single image
    };

    const pdfImages = new pdfImage(pdfImageOptions);
    const imagePaths = await pdfImages.convertFile();
    return imagePaths;
}

async function concatenateImages(images) {
    const firstImage = await Jimp.read(images[0]);
    const imageWidth = firstImage.getWidth();
    const imageHeight = firstImage.getHeight();

    const concatenatedImage = new Jimp(imageWidth, imageHeight * images.length);

    for (let i = 0; i < images.length; i++) {
        const image = await Jimp.read(images[i]);
        concatenatedImage.blit(image, 0, i * imageHeight);
    }

    return concatenatedImage;
}

async function encryptImage(image, encryptionKey) {
    const imageData = await image.getBufferAsync(Jimp.MIME_PNG);
    const encryptedImageData = CryptoJS.AES.encrypt(imageData.toString('base64'), encryptionKey).toString();
    return encryptedImageData;
}

async function processPdfAndEncrypt(pdfPath, encryptionKey) {
    const images = await convertPdfToImages(pdfPath);
    const concatenatedImage = await concatenateImages(images);
    const encryptedImageData = await encryptImage(concatenatedImage, encryptionKey);
    return encryptedImageData;
}

// Usage example:
const pdfPath = 'C:/Users/nuprs/Downloads/output.pdf'; // Replace with the path to your input PDF file
const encryptionKey = 'YourSecretEncryptionKey'; // Replace with your secret encryption key

processPdfAndEncrypt(pdfPath, encryptionKey)
    .then(encryptedImageData => {
        console.log('PDF content encrypted successfully.');
        // Here, you can do whatever you want with the encrypted image data
    })
    .catch(error => {
        console.error('Error:', error);
    });
