// UI Controller
const UI = {
    // DOM elements
    elements: {
        conversionCards: document.querySelectorAll('.conversion-card'),
        uploadSection: document.getElementById('upload-section'),
        progressSection: document.getElementById('progress-section'),
        downloadSection: document.getElementById('download-section'),
        conversionTitle: document.getElementById('conversion-title'),
        uploadArea: document.getElementById('upload-area'),
        fileInput: document.getElementById('file-input'),
        fileInfo: document.getElementById('file-info'),
        fileName: document.getElementById('file-name'),
        removeFileBtn: document.getElementById('remove-file'),
        convertBtn: document.getElementById('convert-btn'),
        progressBar: document.getElementById('progress-bar'),
        progressText: document.getElementById('progress-text'),
        downloadBtn: document.getElementById('download-btn'),
        convertAnotherBtn: document.getElementById('convert-another-btn')
    },
    
    // Current state
    state: {
        currentConversion: null,
        selectedFile: null
    },
    
    // Initialize UI
    init() {
        this.bindEvents();
    },
    
    // Bind event listeners
    bindEvents() {
        // Conversion card selection
        this.elements.conversionCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectConversion(card.dataset.conversion);
            });
        });
        
        // File upload events
        this.elements.uploadArea.addEventListener('click', () => {
            this.elements.fileInput.click();
        });
        
        this.elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelection(e.target.files[0]);
            }
        });
        
        // Drag and drop events
        this.elements.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.uploadArea.classList.add('dragover');
        });
        
        this.elements.uploadArea.addEventListener('dragleave', () => {
            this.elements.uploadArea.classList.remove('dragover');
        });
        
        this.elements.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.uploadArea.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileSelection(e.dataTransfer.files[0]);
            }
        });
        
        // Remove file button
        this.elements.removeFileBtn.addEventListener('click', () => {
            this.removeFile();
        });
        
        // Convert button
        this.elements.convertBtn.addEventListener('click', () => {
            this.startConversion();
        });
        
        // Download button
        this.elements.downloadBtn.addEventListener('click', () => {
            Converter.downloadConvertedFile();
        });
        
        // Convert another button
        this.elements.convertAnotherBtn.addEventListener('click', () => {
            this.resetUI();
        });
    },
    
    // Select conversion type
    selectConversion(conversionType) {
        this.state.currentConversion = conversionType;
        
        // Update conversion title
        const titles = {
            'pdf-to-docx': 'Convert PDF to DOCX',
            'pdf-to-odt': 'Convert PDF to ODT',
            'odt-to-pdf': 'Convert ODT to PDF',
            'pdf-to-image': 'Convert PDF to Image',
            'image-to-pdf': 'Convert Image to PDF'
        };
        
        this.elements.conversionTitle.textContent = titles[conversionType];
        
        // Show upload section
        this.elements.uploadSection.style.display = 'block';
        
        // Scroll to upload section
        this.elements.uploadSection.scrollIntoView({ behavior: 'smooth' });
        
        // Reset file selection
        this.removeFile();
        
        // Update accepted file types
        this.updateAcceptedFileTypes(conversionType);
    },
    
    // Update accepted file types based on conversion type
    updateAcceptedFileTypes(conversionType) {
        const fileInput = this.elements.fileInput;
        
        switch (conversionType) {
            case 'pdf-to-docx':
            case 'pdf-to-odt':
            case 'pdf-to-image':
                fileInput.accept = '.pdf';
                break;
            case 'odt-to-pdf':
                fileInput.accept = '.odt';
                break;
            case 'image-to-pdf':
                fileInput.accept = 'image/*';
                break;
        }
    },
    
    // Handle file selection
    handleFileSelection(file) {
        // Validate file type
        if (!this.validateFileType(file)) {
            alert('Please select a valid file for the selected conversion type.');
            return;
        }
        
        this.state.selectedFile = file;
        
        // Update file info
        this.elements.fileName.textContent = file.name;
        this.elements.fileInfo.style.display = 'flex';
        
        // Enable convert button
        this.elements.convertBtn.disabled = false;
    },
    
    // Validate file type based on current conversion
    validateFileType(file) {
        const conversionType = this.state.currentConversion;
        const fileType = file.type;
        
        switch (conversionType) {
            case 'pdf-to-docx':
            case 'pdf-to-odt':
            case 'pdf-to-image':
                return fileType === 'application/pdf';
            case 'odt-to-pdf':
                return fileType === 'application/vnd.oasis.opendocument.text';
            case 'image-to-pdf':
                return fileType.startsWith('image/');
            default:
                return false;
        }
    },
    
    // Remove selected file
    removeFile() {
        this.state.selectedFile = null;
        this.elements.fileInput.value = '';
        this.elements.fileInfo.style.display = 'none';
        this.elements.convertBtn.disabled = true;
    },
    
    // Start conversion process
    startConversion() {
        if (!this.state.selectedFile) return;
        
        // Hide upload section and show progress section
        this.elements.uploadSection.style.display = 'none';
        this.elements.progressSection.style.display = 'block';
        
        // Reset progress bar
        this.updateProgress(0);
        
        // Start conversion
        Converter.convertFile(
            this.state.currentConversion,
            this.state.selectedFile,
            this.updateProgress.bind(this),
            this.conversionComplete.bind(this)
        );
    },
    
    // Update progress bar
    updateProgress(percent) {
        this.elements.progressBar.style.width = `${percent}%`;
        this.elements.progressText.textContent = `${percent}%`;
    },
    
    // Conversion complete
    conversionComplete() {
        // Hide progress section and show download section
        this.elements.progressSection.style.display = 'none';
        this.elements.downloadSection.style.display = 'block';
    },
    
    // Reset UI to initial state
    resetUI() {
        // Hide all sections
        this.elements.uploadSection.style.display = 'none';
        this.elements.progressSection.style.display = 'none';
        this.elements.downloadSection.style.display = 'none';
        
        // Reset state
        this.state.currentConversion = null;
        this.state.selectedFile = null;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};