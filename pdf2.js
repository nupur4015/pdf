const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function copyPdfContent(inputPdfPath, outputPdfPath) {
    try {
        // Read input PDF
        const inputPdfBytes = fs.readFileSync(inputPdfPath);
        const inputPdfDoc = await PDFDocument.load(inputPdfBytes);

        // Create a new PDF document
        const outputPdfDoc = await PDFDocument.create();

        // Copy pages from input PDF to output PDF
        const pages = await outputPdfDoc.copyPages(inputPdfDoc, inputPdfDoc.getPageIndices());
        pages.forEach(page => outputPdfDoc.addPage(page));

        // Save output PDF
        const outputPdfBytes = await outputPdfDoc.save();
        fs.writeFileSync(outputPdfPath, outputPdfBytes);

        console.log('PDF content copied successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage example:
const inputPdfPath = 'C:/Users/nuprs/Downloads/190107044 (1).pdf'; // Replace with the path to your input PDF file
const outputPdfPath = 'C:/Users/nuprs/Downloads/output.pdf'; // Replace with the path to the output PDF file

copyPdfContent(inputPdfPath, outputPdfPath);
