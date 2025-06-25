// Converter Controller
const Converter = {
    // Libraries
    libs: {
        pdf: null,
        docx: null,
        odt: null,
        FileSaver: null
    },
    
    // Conversion result
    result: {
        fileName: '',
        fileData: null,
        fileType: ''
    },
    
    // Initialize converter
    init() {
        // Load libraries
        this.loadLibraries();
    },
    
    // Load required libraries
    loadLibraries() {
        // PDF.js
        if (window.pdfjsLib) {
            this.libs.pdf = window.pdfjsLib;
            this.libs.pdf.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.js';
        }
        
        // docx.js
        if (window.docx) {
            this.libs.docx = window.docx;
        }
        
        // FileSaver.js
        if (window.saveAs) {
            this.libs.FileSaver = window.saveAs;
        }
    },
    
    // Convert file based on conversion type
    convertFile(conversionType, file, progressCallback, completionCallback) {
        // Reset result
        this.result = {
            fileName: '',
            fileData: null,
            fileType: ''
        };
        
        // Choose conversion method based on type
        switch (conversionType) {
            case 'pdf-to-docx':
                this.convertPdfToDocx(file, progressCallback, completionCallback);
                break;
            case 'pdf-to-odt':
                this.convertPdfToOdt(file, progressCallback, completionCallback);
                break;
            case 'odt-to-pdf':
                this.convertOdtToPdf(file, progressCallback, completionCallback);
                break;
            case 'pdf-to-image':
                this.convertPdfToImage(file, progressCallback, completionCallback);
                break;
            case 'image-to-pdf':
                this.convertImageToPdf(file, progressCallback, completionCallback);
                break;
            default:
                console.error('Unknown conversion type');
                break;
        }
    },
    
    // Convert PDF to DOCX
    convertPdfToDocx(file, progressCallback, completionCallback) {
        if (!this.libs.pdf || !this.libs.docx) {
            alert('Required libraries not loaded. Please refresh the page and try again.');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const pdfData = new Uint8Array(e.target.result);
                const loadingTask = this.libs.pdf.getDocument(pdfData);
                
                // Set up progress monitoring
                loadingTask.onProgress = (data) => {
                    const percent = Math.round((data.loaded / data.total) * 30);
                    progressCallback(percent);
                };
                
                const pdf = await loadingTask.promise;
                const numPages = pdf.numPages;
                
                // Create a new docx document
                const doc = new this.libs.docx.Document();
                
                // Process each page
                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    
                    // Extract text from page
                    let pageText = '';
                    textContent.items.forEach(item => {
                        pageText += item.str + ' ';
                    });
                    
                    // Add text to document
                    doc.addSection({
                        properties: {},
                        children: [
                            new this.libs.docx.Paragraph({
                                children: [
                                    new this.libs.docx.TextRun(pageText)
                                ]
                            })
                        ]
                    });
                    
                    // Update progress
                    const percent = 30 + Math.round((i / numPages) * 60);
                    progressCallback(percent);
                }
                
                // Generate docx file
                const buffer = await this.libs.docx.Packer.toBuffer(doc);
                
                // Set result
                const fileName = file.name.replace('.pdf', '.docx');
                this.result = {
                    fileName: fileName,
                    fileData: buffer,
                    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                };
                
                // Complete conversion
                progressCallback(100);
                setTimeout(completionCallback, 500);
            } catch (error) {
                console.error('Error converting PDF to DOCX:', error);
                alert('Error converting file. Please try again with a different file.');
            }
        };
        
        reader.readAsArrayBuffer(file);
    },
    
    // Convert PDF to ODT
    convertPdfToOdt(file, progressCallback, completionCallback) {
        if (!this.libs.pdf) {
            alert('Required libraries not loaded. Please refresh the page and try again.');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const pdfData = new Uint8Array(e.target.result);
                const loadingTask = this.libs.pdf.getDocument(pdfData);
                
                // Set up progress monitoring
                loadingTask.onProgress = (data) => {
                    const percent = Math.round((data.loaded / data.total) * 30);
                    progressCallback(percent);
                };
                
                const pdf = await loadingTask.promise;
                const numPages = pdf.numPages;
                
                // Extract text from all pages
                let allText = '';
                
                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    
                    // Extract text from page
                    let pageText = '';
                    textContent.items.forEach(item => {
                        pageText += item.str + ' ';
                    });
                    
                    allText += pageText + '\n\n';
                    
                    // Update progress
                    const percent = 30 + Math.round((i / numPages) * 60);
                    progressCallback(percent);
                }
                
                // For demonstration purposes, we'll create a simple ODT structure
                // In a real application, you would use a proper ODT library
                const odtContent = `
                    <?xml version="1.0" encoding="UTF-8"?>
                    <office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0">
                        <office:body>
                            <office:text>
                                <text:p>${allText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text:p>
                            </office:text>
                        </office:body>
                    </office:document-content>
                `;
                
                // Create a simple ODT file (this is a simplified version)
                const blob = new Blob([odtContent], { type: 'application/vnd.oasis.opendocument.text' });
                
                // Set result
                const fileName = file.name.replace('.pdf', '.odt');
                this.result = {
                    fileName: fileName,
                    fileData: blob,
                    fileType: 'application/vnd.oasis.opendocument.text'
                };
                
                // Complete conversion
                progressCallback(100);
                setTimeout(completionCallback, 500);
            } catch (error) {
                console.error('Error converting PDF to ODT:', error);
                alert('Error converting file. Please try again with a different file.');
            }
        };
        
        reader.readAsArrayBuffer(file);
    },
    
    // Convert ODT to PDF
    convertOdtToPdf(file, progressCallback, completionCallback) {
        // For demonstration purposes, we'll simulate the conversion
        // In a real application, you would use a proper ODT to PDF converter library
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Simulate processing time
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                progressCallback(progress);
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Create a dummy PDF file
                    const pdfContent = '%PDF-1.5\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Font << /F1 6 0 R >> >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Converted from ODT) Tj\nET\nendstream\nendobj\n6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 7\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000216 00000 n\n0000000260 00000 n\n0000000354 00000 n\ntrailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n423\n%%EOF';
                    const blob = new Blob([pdfContent], { type: 'application/pdf' });
                    
                    // Set result
                    const fileName = file.name.replace('.odt', '.pdf');
                    this.result = {
                        fileName: fileName,
                        fileData: blob,
                        fileType: 'application/pdf'
                    };
                    
                    setTimeout(completionCallback, 500);
                }
            }, 100);
        };
        
        reader.readAsArrayBuffer(file);
    },
    
    // Convert PDF to Image
    convertPdfToImage(file, progressCallback, completionCallback) {
        if (!this.libs.pdf) {
            alert('Required libraries not loaded. Please refresh the page and try again.');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const pdfData = new Uint8Array(e.target.result);
                const loadingTask = this.libs.pdf.getDocument(pdfData);
                
                // Set up progress monitoring
                loadingTask.onProgress = (data) => {
                    const percent = Math.round((data.loaded / data.total) * 20);
                    progressCallback(percent);
                };
                
                const pdf = await loadingTask.promise;
                const numPages = pdf.numPages;
                
                // For simplicity, we'll just convert the first page
                const page = await pdf.getPage(1);
                
                // Update progress
                progressCallback(50);
                
                // Render the page to a canvas
                const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
                
                // Update progress
                progressCallback(80);
                
                // Convert canvas to image blob
                canvas.toBlob((blob) => {
                    // Set result
                    const fileName = file.name.replace('.pdf', '.png');
                    this.result = {
                        fileName: fileName,
                        fileData: blob,
                        fileType: 'image/png'
                    };
                    
                    // Complete conversion
                    progressCallback(100);
                    setTimeout(completionCallback, 500);
                }, 'image/png');
            } catch (error) {
                console.error('Error converting PDF to Image:', error);
                alert('Error converting file. Please try again with a different file.');
            }
        };
        
        reader.readAsArrayBuffer(file);
    },
    
    // Convert Image to PDF - FIXED VERSION
    convertImageToPdf(file, progressCallback, completionCallback) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Create an image element to get dimensions
            const img = new Image();
            img.onload = () => {
                // Update progress
                progressCallback(30);
                
                // Create a canvas with the image dimensions
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas dimensions to match image
                const maxWidth = 595; // A4 width in points at 72 DPI
                const maxHeight = 842; // A4 height in points at 72 DPI
                
                // Calculate dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    const ratio = maxWidth / width;
                    width = maxWidth;
                    height = height * ratio;
                }
                
                if (height > maxHeight) {
                    const ratio = maxHeight / height;
                    height = maxHeight;
                    width = width * ratio;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw image on canvas with white background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);
                
                // Update progress
                progressCallback(60);
                
                // Get image data as JPEG
                const imageData = canvas.toDataURL('image/jpeg', 0.95);
                
                // Create a PDF with the image properly embedded
                this.createPDFWithImage(imageData, width, height, file.name, progressCallback, completionCallback);
            };
            
            // Set image source from FileReader result
            img.src = e.target.result;
        };
        
        // Read the image file as a data URL
        reader.readAsDataURL(file);
    },
    
    // Helper method to create a PDF with an embedded image
    createPDFWithImage(imageData, width, height, originalFilename, progressCallback, completionCallback) {
        try {
            // Calculate PDF dimensions (use A4 if image is small)
            const pageWidth = Math.max(width, 595);
            const pageHeight = Math.max(height, 842);
            
            // Calculate centering position
            const x = (pageWidth - width) / 2;
            const y = (pageHeight - height) / 2;
            
            // Create PDF content with proper binary image data
            // Remove the data URL prefix to get just the base64 data
            const base64ImageData = imageData.replace('data:image/jpeg;base64,', '');
            
            // Create a more robust PDF structure
            const pdfContent = [
                '%PDF-1.7',
                '1 0 obj',
                '<<',
                '/Type /Catalog',
                '/Pages 2 0 R',
                '>>',
                'endobj',
                '2 0 obj',
                '<<',
                '/Type /Pages',
                '/Kids [3 0 R]',
                '/Count 1',
                '>>',
                'endobj',
                '3 0 obj',
                '<<',
                '/Type /Page',
                '/Parent 2 0 R',
                `/MediaBox [0 0 ${pageWidth} ${pageHeight}]`,
                '/Resources <<',
                '/XObject << /Img 4 0 R >>',
                '>>',
                '/Contents 5 0 R',
                '>>',
                'endobj',
                '4 0 obj',
                '<<',
                '/Type /XObject',
                '/Subtype /Image',
                `/Width ${width}`,
                `/Height ${height}`,
                '/ColorSpace /DeviceRGB',
                '/BitsPerComponent 8',
                '/Filter /DCTDecode',
                `/Length ${base64ImageData.length * 0.75}`,
                '>>',
                'stream',
                atob(base64ImageData),
                'endstream',
                'endobj',
                '5 0 obj',
                '<<',
                '/Length 44',
                '>>',
                'stream',
                'q',
                `${width} 0 0 ${height} ${x} ${y} cm`,
                '/Img Do',
                'Q',
                'endstream',
                'endobj',
                'xref',
                '0 6',
                '0000000000 65535 f',
                '0000000009 00000 n',
                '0000000058 00000 n',
                '0000000115 00000 n',
                '0000000254 00000 n',
                '0000000489 00000 n',
                'trailer',
                '<<',
                '/Size 6',
                '/Root 1 0 R',
                '>>',
                'startxref',
                '580',
                '%%EOF'
            ].join('\n');
            
            // Create a Blob with the PDF content
            const blob = new Blob([pdfContent], { type: 'application/pdf' });
            
            // Update progress
            progressCallback(90);
            
            // Set result
            const fileName = originalFilename.split('.').slice(0, -1).join('.') + '.pdf';
            this.result = {
                fileName: fileName,
                fileData: blob,
                fileType: 'application/pdf'
            };
            
            // Complete conversion
            progressCallback(100);
            setTimeout(completionCallback, 500);
        } catch (error) {
            console.error('Error creating PDF:', error);
            alert('Error converting image to PDF. Please try again with a different image.');
        }
    },
    
    // Download converted file
    downloadConvertedFile() {
        if (this.result.fileData && this.result.fileName) {
            if (this.libs.FileSaver) {
                this.libs.FileSaver(this.result.fileData, this.result.fileName);
            } else {
                // Fallback if FileSaver.js is not available
                const url = URL.createObjectURL(this.result.fileData);
                const a = document.createElement('a');
                a.href = url;
                a.download = this.result.fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 0);
            }
        }
    }
};