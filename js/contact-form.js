// Contact Form Controller
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const sendAnotherBtn = document.getElementById('send-another-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Initialize form validation and submission
    if (contactForm) {
        initContactForm();
    }
    
    // Initialize FAQ accordion
    if (faqItems.length > 0) {
        initFaqAccordion();
    }
    
    // Initialize contact form validation and submission
    function initContactForm() {
        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Simulate form submission
                simulateFormSubmission();
            }
        });
        
        // Send another message button
        if (sendAnotherBtn) {
            sendAnotherBtn.addEventListener('click', () => {
                resetForm();
                formSuccess.style.display = 'none';
                contactForm.style.display = 'block';
            });
        }
        
        // Input validation on blur
        nameInput.addEventListener('blur', () => validateName());
        emailInput.addEventListener('blur', () => validateEmail());
        subjectInput.addEventListener('blur', () => validateSubject());
        messageInput.addEventListener('blur', () => validateMessage());
    }
    
    // Validate the entire form
    function validateForm() {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();
        
        return isNameValid && isEmailValid && isSubjectValid && isMessageValid;
    }
    
    // Validate name field
    function validateName() {
        const value = nameInput.value.trim();
        
        if (value === '') {
            showError(nameInput, nameError, 'Please enter your name');
            return false;
        } else if (value.length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters');
            return false;
        } else {
            clearError(nameInput, nameError);
            return true;
        }
    }
    
    // Validate email field
    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value === '') {
            showError(emailInput, emailError, 'Please enter your email address');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        } else {
            clearError(emailInput, emailError);
            return true;
        }
    }
    
    // Validate subject field
    function validateSubject() {
        const value = subjectInput.value.trim();
        
        if (value === '') {
            showError(subjectInput, subjectError, 'Please enter a subject');
            return false;
        } else if (value.length < 3) {
            showError(subjectInput, subjectError, 'Subject must be at least 3 characters');
            return false;
        } else {
            clearError(subjectInput, subjectError);
            return true;
        }
    }
    
    // Validate message field
    function validateMessage() {
        const value = messageInput.value.trim();
        
        if (value === '') {
            showError(messageInput, messageError, 'Please enter your message');
            return false;
        } else if (value.length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters');
            return false;
        } else {
            clearError(messageInput, messageError);
            return true;
        }
    }
    
    // Show error message
    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Clear error message
    function clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    // Simulate form submission
    function simulateFormSubmission() {
        const submitBtn = contactForm.querySelector('.submit-btn');
        
        // Disable form and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate API call delay
        setTimeout(() => {
            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Reset form for future use
            resetForm();
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        }, 1500);
    }
    
    // Reset form fields and errors
    function resetForm() {
        contactForm.reset();
        
        // Clear all error messages
        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(subjectInput, subjectError);
        clearError(messageInput, messageError);
    }
    
    // Initialize FAQ accordion functionality
    function initFaqAccordion() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            // Hide all answers initially
            answer.style.display = 'none';
            
            // Add click event to question
            question.addEventListener('click', () => {
                toggleFaqItem(item, answer, toggle);
            });
        });
    }
    
    // Toggle FAQ item open/closed
    function toggleFaqItem(item, answer, toggle) {
        const isOpen = answer.style.display === 'block';
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherToggle = otherItem.querySelector('.faq-toggle');
                
                otherAnswer.style.display = 'none';
                otherToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        if (isOpen) {
            answer.style.display = 'none';
            toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
            item.classList.remove('active');
        } else {
            answer.style.display = 'block';
            toggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
            item.classList.add('active');
        }
    }
});