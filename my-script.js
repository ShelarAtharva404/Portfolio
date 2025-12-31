// Mobile Menu Toggle
var menuBtn = document.getElementById('menu-btn');
var navLinks = document.querySelector('.nav-links');

menuBtn.onclick = function() {
    navLinks.classList.toggle('active');
}

// Close menu when clicking on a link
var links = document.querySelectorAll('.nav-links a');
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
        navLinks.classList.remove('active');
    });
}

// Dark Mode Toggle
var themeBtn = document.getElementById('theme-btn');
var body = document.body;

// Check if user has a saved theme preference
var savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeBtn.textContent = '☀️';
}

themeBtn.onclick = function() {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Smooth Scrolling for Navigation Links
var allLinks = document.querySelectorAll('a[href^="#"]');
for (var i = 0; i < allLinks.length; i++) {
    allLinks[i].addEventListener('click', function(e) {
        var target = this.getAttribute('href');
        
        // Skip if it's just '#' (empty anchor)
        if (target === '#' || target.length <= 1) {
            return;
        }
        
        e.preventDefault();
        var element = document.querySelector(target);
        if (element) {
            var position = element.offsetTop - 70;
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
        }
    });
}

// Skill Bar Animation on Scroll
window.onscroll = function() {
    animateSkills();
    showBackToTop();
}

var skillsAnimated = false;

function animateSkills() {
    var skillsSection = document.getElementById('skills');
    var skillBars = document.querySelectorAll('.skill-fill');
    var sectionPosition = skillsSection.offsetTop;
    var scrollPosition = window.scrollY + window.innerHeight;
    
    if (scrollPosition > sectionPosition && !skillsAnimated) {
        for (var i = 0; i < skillBars.length; i++) {
            var width = skillBars[i].getAttribute('data-width');
            skillBars[i].style.width = width + '%';
        }
        skillsAnimated = true;
    }
}

// Back to Top Button
var backToTopBtn = document.getElementById('back-to-top');

function showBackToTop() {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
}

backToTopBtn.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Contact Form Validation
var contactForm = document.getElementById('contact-form');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var messageInput = document.getElementById('message');

// Auto-save form draft as user types
function saveDraft() {
    var draft = {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
    };
    localStorage.setItem('contactFormDraft', JSON.stringify(draft));
}

// Restore saved draft on page load
function loadDraft() {
    var savedDraft = localStorage.getItem('contactFormDraft');
    if (savedDraft) {
        var draft = JSON.parse(savedDraft);
        nameInput.value = draft.name || '';
        emailInput.value = draft.email || '';
        messageInput.value = draft.message || '';
    }
}

// Load draft when page loads
loadDraft();

// Auto-save as user types (with delay)
var saveTimeout;
nameInput.addEventListener('input', function() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveDraft, 1000);
});

emailInput.addEventListener('input', function() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveDraft, 1000);
});

messageInput.addEventListener('input', function() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveDraft, 1000);
});

contactForm.onsubmit = function(e) {
    e.preventDefault();
    
    var isValid = true;
    
    // Clear previous errors
    document.getElementById('name-error').style.display = 'none';
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('message-error').style.display = 'none';
    
    // Validate Name
    if (nameInput.value.trim() === '') {
        document.getElementById('name-error').textContent = 'Name is required';
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
    }
    
    // Validate Email
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        document.getElementById('email-error').textContent = 'Email is required';
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    } else if (!emailPattern.test(emailInput.value)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email';
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    }
    
    // Validate Message
    if (messageInput.value.trim() === '') {
        document.getElementById('message-error').textContent = 'Message is required';
        document.getElementById('message-error').style.display = 'block';
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
        document.getElementById('message-error').style.display = 'block';
        isValid = false;
    }
    
    // If form is valid, save and show success message
    if (isValid) {
        // Save submission to localStorage
        var submission = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim(),
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        // Get existing submissions
        var submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
        // Clear the draft
        localStorage.removeItem('contactFormDraft');
        
        // Show success message
        document.getElementById('success-msg').style.display = 'block';
        
        // Reset form after 3 seconds
        setTimeout(function() {
            contactForm.reset();
            document.getElementById('success-msg').style.display = 'none';
        }, 3000);
        
        // Log submission count
        console.log('Form submitted! Total submissions: ' + submissions.length);
    }
}

// Simple console message
console.log('Portfolio website loaded successfully!');

// ================================
// VIEW FORM SUBMISSIONS
// ================================

// Function to view all submissions (call from console)
function viewSubmissions() {
    var submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    
    if (submissions.length === 0) {
        console.log('No submissions yet!');
        return;
    }
    
    console.log('=== CONTACT FORM SUBMISSIONS ===' + '\n');
    console.log('Total Submissions: ' + submissions.length + '\n');
    
    for (var i = 0; i < submissions.length; i++) {
        var sub = submissions[i];
        var date = new Date(sub.date);
        console.log('--- Submission #' + (i + 1) + ' ---');
        console.log('Name: ' + sub.name);
        console.log('Email: ' + sub.email);
        console.log('Message: ' + sub.message);
        console.log('Date: ' + date.toLocaleString());
        console.log('');
    }
    
    return submissions;
}

// Function to clear all submissions
function clearSubmissions() {
    localStorage.removeItem('contactSubmissions');
    console.log('All submissions cleared!');
}

// Function to export submissions as JSON
function exportSubmissions() {
    var submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    console.log(JSON.stringify(submissions, null, 2));
    return submissions;
}

// Animated counters for stats section
function animateCounters() {
    var counters = document.querySelectorAll('.counter');
    var section = document.getElementById('stats');
    var hasAnimated = false;
    
    if (!section) return;
    
    var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting && !hasAnimated) {
            counters.forEach(function(counter) {
                var target = parseInt(counter.getAttribute('data-target'));
                var current = 0;
                var increment = target / 100;
                
                var timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        if (target === 4.9) counter.textContent = '4.9';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                        if (target === 4.9) counter.textContent = (Math.floor(current * 10) / 10).toFixed(1);
                    }
                }, 20);
            });
            hasAnimated = true;
            observer.disconnect();
        }
    }, { threshold: 0.5 });
    
    observer.observe(section);
}

// Initialize counters when page loads
animateCounters();

//
// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// Log helpful commands
console.log('%cForm Storage Commands:', 'color: #4a90e2; font-weight: bold; font-size: 14px;');
console.log('viewSubmissions() - View all form submissions');
console.log('clearSubmissions() - Clear all submissions');
console.log('exportSubmissions() - Export submissions as JSON');
console.log('');

// ================================
// GALLERY MODAL FUNCTIONALITY
// ================================

// Gallery images for each project
var galleryData = {
    erp: {
        title: 'ERP System - Project Gallery',
        images: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600'
        ]
    },
    cloud: {
        title: 'Cloud Video Streaming - Project Gallery',
        images: [
            'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600',
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
            'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600'
        ]
    },
    ocr: {
        title: 'OCR Document Scanner - Project Gallery',
        images: [
            'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600',
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
            'https://images.unsplash.com/photo-1568667256549-094345857637?w=600'
        ]
    },
    weather: {
        title: 'Weather Forecast App - Project Gallery',
        images: [
            'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600',
            'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600',
            'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600',
            'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=600'
        ]
    }
};

var currentProject = '';
var currentImageIndex = 0;

// Open gallery modal
function openGallery(projectId) {
    currentProject = projectId;
    currentImageIndex = 0;
    
    var modal = document.getElementById('gallery-modal');
    var title = document.getElementById('gallery-title');
    var imagesContainer = document.getElementById('gallery-images');
    
    // Set title
    title.textContent = galleryData[projectId].title;
    
    // Clear and load images
    imagesContainer.innerHTML = '';
    var images = galleryData[projectId].images;
    
    for (var i = 0; i < images.length; i++) {
        var img = document.createElement('img');
        img.src = images[i];
        img.alt = 'Project Screenshot ' + (i + 1);
        imagesContainer.appendChild(img);
    }
    
    // Update counter
    updateCounter();
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close gallery modal
function closeGallery() {
    var modal = document.getElementById('gallery-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Change image (navigation)
function changeImage(direction) {
    var images = galleryData[currentProject].images;
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }
    
    updateCounter();
}

// Update image counter
function updateCounter() {
    var counter = document.getElementById('gallery-counter');
    var total = galleryData[currentProject].images.length;
    counter.textContent = (currentImageIndex + 1) + ' / ' + total;
}

// Close modal when clicking outside
window.onclick = function(event) {
    var modal = document.getElementById('gallery-modal');
    if (event.target === modal) {
        closeGallery();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    var modal = document.getElementById('gallery-modal');
    if (modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeGallery();
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});
