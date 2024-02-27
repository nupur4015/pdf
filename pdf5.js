const fs = require('fs');
const { createCanvas } = require('canvas');

async function convertPdfPagesToImages(pdfPath, outputDir) {
    try {
        pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const pdfDocument = await pdfjsLib.getDocument(data).promise;
        const numPages = pdfDocument.numPages;

        for (let i = 0; i < numPages; i++) {
            const page = await pdfDocument.getPage(i + 1); // getPage is 1-indexed

            // Render the page on a canvas
            const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
            const canvas = createCanvas(viewport.width, viewport.height);
            const canvasContext = canvas.getContext('2d');
            await page.render({ canvasContext, viewport }).promise;

            // Convert the canvas to an image and save it
            const imageData = canvas.toBuffer();
            fs.writeFileSync(`${outputDir}/page_${i + 1}.png`, imageData);

            console.log(`Page ${i + 1} converted to image.`);
        }

        console.log('All pages converted to images.');
    } catch (error) {
        console.error('Error converting PDF to images:', error);
    }
}
// Usage example:
const pdfPath = 'C:/Users/nuprs/Downloads/190107044 (1).pdf'; // Replace with the path to your input PDF file
const outputDir = 'C:/Users/nuprs/Downloads'; // Output directory for images

convertPdfPagesToImages(pdfPath, outputDir)
    .then(() => console.log('PDF pages converted to images successfully.'))
    .catch(error => console.error('Error:', error));
