const pdfParse = require('pdf-parse');

/**
 * Parses binary buffer of a PDF and returns its plaintext content
 * @param {Buffer} fileBuffer 
 * @returns {Promise<string>}
 */
exports.parsePdf = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text || '';
  } catch (error) {
    console.error("PDF Parsing Error: ", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};
