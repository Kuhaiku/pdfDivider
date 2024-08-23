const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function dividirPDF(pdfPath, numPartes) {
    // Carregar o PDF
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const numPages = pdfDoc.getPageCount();
    const paginasPorParte = Math.ceil(numPages / numPartes);

    for (let i = 0; i < numPartes; i++) {
        const novoPdf = await PDFDocument.create();
        const start = i * paginasPorParte;
        const end = Math.min(start + paginasPorParte, numPages);

        for (let j = start; j < end; j++) {
            const [page] = await novoPdf.copyPages(pdfDoc, [j]);
            novoPdf.addPage(page);
        }

        const novoPdfBytes = await novoPdf.save();
        fs.writeFileSync(`parte_${i + 1}.pdf`, novoPdfBytes);
    }

    console.log(`PDF dividido em ${numPartes} partes.`);
}

// Caminho do arquivo PDF e número de partes desejado
const caminhoPdf = './PDFs/seçao1001.pdf';
const numPartes = 8;  // Mude para o número de partes desejado

dividirPDF(caminhoPdf, numPartes);
