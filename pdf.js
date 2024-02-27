const fs = require('fs');
const fs1 = require('fs').promises;
const { PDFDocument, StandardFonts } = require('pdf-lib');
const CryptoJS = require('crypto-js');
let pdfjsLib;

async function copyPdfAndEncryptText(inputPdfPath, outputPdfPath, encryptionKey) {
    // Read input PDF
    const inputPdfBytes = fs.readFileSync(inputPdfPath);
    const inputPdfDoc = await PDFDocument.load(inputPdfBytes);
    const inputPdfText = await extractTextFromPdf(inputPdfPath);

    // Encrypt text
    const encryptedText = CryptoJS.AES.encrypt(inputPdfText, encryptionKey).toString();
    console.log(encryptedText);
    // Create a new PDF document
    const outputPdfDoc = await PDFDocument.create();
    const [inputPdfPage] = await outputPdfDoc.copyPages(inputPdfDoc, [0]);
    outputPdfDoc.addPage(inputPdfPage);

    // Add encrypted text as a new page
    const textFont = await outputPdfDoc.embedFont(StandardFonts.Helvetica);
    const textPage = outputPdfDoc.addPage();
    textPage.drawText(encryptedText, { x: 50, y: 500, font: textFont, size: 12 });

    // Save output PDF
    const outputPdfBytes = await outputPdfDoc.save();
    fs.writeFileSync(outputPdfPath, outputPdfBytes);

    console.log('Output PDF with encrypted text generated successfully.');
}

// async function extractTextFromPdf(pdfDoc) {
//     let text = '';
//     const pageCount = pdfDoc.getPageCount();

//     for (let i = 0; i < pageCount; i++) {
//         const page = pdfDoc.getPage(i);
//         const content = await page.getTextContent();
//         text += content.items.map(item => item.str).join(' ');
//     }

//     return text;
// }

async function extractTextFromPdf(filePath) {
    try {
        if (!pdfjsLib) {
            // Dynamically import pdfjs-dist using dynamic import syntax
            pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
        }

        const data = await fs1.readFile(filePath)
        const dataArray = new Uint8Array(data);;
        const loadingTask = pdfjsLib.getDocument(dataArray);
        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;
        let fullText = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const textItems = textContent.items;
            const text = textItems.map(item => item.str).join(' ');
            fullText += text + '\n';
        }

        return fullText;
    } catch (error) {
        throw error;
    }
}

// Usage example:
const inputPdfPath = 'C:/Users/nuprs/Downloads/190107044 (1).pdf'; // Replace with the path to your input PDF file
const outputPdfPath = 'C:/Users/nuprs/Downloads/output.pdf'; // Replace with the path to the output PDF file
const encryptionKey = 'abcdabcdabcdabcdabcdabcdabcdabcd'; // Replace with your secret encryption key

copyPdfAndEncryptText(inputPdfPath, outputPdfPath, encryptionKey).catch(error => {
    console.error('Error:', error);
});
