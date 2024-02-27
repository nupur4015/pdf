var PDFImage = require("pdf-image").PDFImage;
 
var pdfImage = new PDFImage("C:/Users/nuprs/Downloads/output.pdf");
async function abc(){
await pdfImage.convertFile().then(function (imagePaths) {
  // [ /tmp/slide-0.png, /tmp/slide-1.png ]
  console.log(imagePaths);
});
}
abc();