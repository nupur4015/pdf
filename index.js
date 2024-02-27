const fs = require('fs').promises;
let pdfjsLib;

async function extractTextFromPDF(filePath) {
    try {
        if (!pdfjsLib) {
            // Dynamically import pdfjs-dist using dynamic import syntax
            pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
        }

        const data = await fs.readFile(filePath)
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
const pdfFilePath = 'C:/Users/nuprs/Downloads/190107044 (1).pdf'; // Replace with the actual path to the PDF file
extractTextFromPDF(pdfFilePath)
    .then(text => {
        console.log('Text extracted from PDF:');
        console.log(text);
    })
    .catch(error => {
        console.error('Error extracting text:', error);
    });
