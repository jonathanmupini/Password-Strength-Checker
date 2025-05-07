// Initialize counter animation for security stats
function animateCounters() {
       const counters = document.querySelectorAll('.stat-number');
    
      counters.forEach(counter => {
        const duration = 2000; // total animation duration
        const intervalTime = 100; // change number every 100ms
        const min = 242;
        const max = 12783;
    
        let elapsed = 0;
    
        const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
     counter.textContent = randomNum;
    
      elapsed += intervalTime;
      if (elapsed >= duration) {
        clearInterval(interval);
        // Optionally set final number
        counter.textContent = max;
   }
    }, intervalTime);
     });
    }
    

// Password strength evaluation
function checkPassword() {
    const password = document.getElementById('password').value;
    const strength = document.getElementById('strength');
    const suggestions = document.getElementById('suggestions');
    const scoreBar = document.querySelector('.score') || createScoreBar();
    
    if (password.length === 0) {
        strength.innerHTML = '<p style="color: #e74c3c;">Please enter a password.</p>';
        suggestions.textContent = '';
        scoreBar.innerHTML = '';
        return;
    }
    
    // Calculate password strength
    let score = 0;
    let feedbackText = '';
    let suggestionList = [];
    
    // Length check
    if (password.length < 8) {
        score += 1;
        suggestionList.push('Make your password at least 8 characters long.');
    } else if (password.length >= 12) {
        score += 3;
    } else {
        score += 2;
    }
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    else suggestionList.push('Add uppercase letters (A-Z).');
    
    if (/[a-z]/.test(password)) score += 1;
    else suggestionList.push('Add lowercase letters (a-z).');
    
    if (/[0-9]/.test(password)) score += 1;
    else suggestionList.push('Add numbers (0-9).');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 2;
    else suggestionList.push('Add special characters (like !@#$%^&*).');
    
    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
        score -= 1;
        suggestionList.push('Avoid repeated characters (like "aaa" or "111").');
    }
    
    if (/^(password|123456|qwerty|admin)/i.test(password)) {
        score -= 2;
        suggestionList.push('Avoid commonly used passwords or patterns.');
    }
    
    // Determine strength category
    let strengthClass = '';
    if (score <= 2) {
        feedbackText = 'Very Weak';
        strengthClass = 'very-weak';
    } else if (score <= 4) {
        feedbackText = 'Weak';
        strengthClass = 'weak';
    } else if (score <= 6) {
        feedbackText = 'Medium';
        strengthClass = 'medium';
    } else if (score <= 8) {
        feedbackText = 'Strong';
        strengthClass = 'strong';
    } else {
        feedbackText = 'Very Strong';
        strengthClass = 'very-strong';
    }
    
    // Display results
    const currentLanguage = document.getElementById('language-select').value;
    if (currentLanguage === 'sn-ZW') {
        // Shona translations for password strength
        const strengthTranslations = {
            'Very Weak': 'Haina Kusimba Zvachose',
            'Weak': 'Haina simba',
            'Medium': 'Yakati Simbei',
            'Strong': 'Yakasimba',
            'Very Strong': 'Yakasimba Zvikuru'
        };
        feedbackText = strengthTranslations[feedbackText] || feedbackText;
        
        // Translate suggestions to Shona
        if (suggestionList.length > 0) {
            const shonaIntro = 'Mazano ekusimbisa password yako:';
            const translatedSuggestions = translateSuggestions(suggestionList, 'sn-ZW');
            suggestions.innerHTML = `<p>${shonaIntro}</p><ul>${translatedSuggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
        } else {
            suggestions.innerHTML = '<p>Password yako yakasimba zvakakwana!</p>';
        }
    } else {
        // English display
        if (suggestionList.length > 0) {
            suggestions.innerHTML = `<p>Suggestions to improve your password:</p><ul>${suggestionList.map(s => `<li>${s}</li>`).join('')}</ul>`;
        } else {
            suggestions.innerHTML = '<p>Great job! Your password is sufficiently strong.</p>';
        }
    }
    
    strength.innerHTML = `<p>Password Strength: <strong style="color: ${getColorFromClass(strengthClass)}">${feedbackText}</strong></p>`;
    
    // Update score bar
    updateScoreBar(score, strengthClass);
}

// Helper function to create score bar if it doesn't exist
function createScoreBar() {
    const scoreDiv = document.querySelector('.score');
    if (!scoreDiv) {
        const newScoreDiv = document.createElement('div');
        newScoreDiv.className = 'score';
        
        const scoreBar = document.createElement('div');
        scoreBar.className = 'score-bar';
        newScoreDiv.appendChild(scoreBar);
        
        const suggestionsDiv = document.getElementById('suggestions');
        suggestionsDiv.parentNode.insertBefore(newScoreDiv, suggestionsDiv.nextSibling);
        
        return newScoreDiv;
    }
    return scoreDiv;
}

// Update the score bar based on password strength
function updateScoreBar(score, strengthClass) {
    const scoreBar = document.querySelector('.score-bar') || document.createElement('div');
    scoreBar.className = 'score-bar';
    
    if (!document.querySelector('.score-bar')) {
        document.querySelector('.score').appendChild(scoreBar);
    }
    
    // Normalize score to percentage (max score is 10)
    let percentage = (score / 10) * 100;
    percentage = Math.max(10, Math.min(100, percentage)); // Ensure at least 10% visibility
    
    scoreBar.style.width = percentage + '%';
    scoreBar.className = 'score-bar ' + strengthClass;
}

// Get color based on strength class
function getColorFromClass(strengthClass) {
    const colors = {
        'very-weak': '#e74c3c',
        'weak': '#e67e22',
        'medium': '#f1c40f',
        'strong': '#2ecc71',
        'very-strong': '#27ae60'
    };
    return colors[strengthClass] || '#333';
}

// Translate password suggestions
function translateSuggestions(suggestions, language) {
    if (language !== 'sn-ZW') return suggestions;
    
    const translations = {
        'Make your password at least 8 characters long.': 'Ita kuti password yako ive netsamba dzisiri pasi pe8.',
        'Add uppercase letters (A-Z).': 'Wedzera mavara makuru (A-Z).',
        'Add lowercase letters (a-z).': 'Wedzera mavara madiki (a-z).',
        'Add numbers (0-9).': 'Wedzera nhamba (0-9).',
        'Add special characters (like !@#$%^&*).': 'Wedzera zvimwe zviratidzo (sezvakadai !@#$%^&*).',
        'Avoid repeated characters (like "aaa" or "111").': 'Usashandise mavara akaenzana (sezvakadai "aaa" kana "111").',
        'Avoid commonly used passwords or patterns.': 'Usashandise mapassword anowanzoshandiswa kana zviratidzo zvinowanzozivikanwa.'
    };
    
    return suggestions.map(suggestion => translations[suggestion] || suggestion);
}

// Load blog posts
function loadBlogPosts(offset = 0, limit = 3) {
    const blogPostsContainer = document.getElementById('blog-posts');
    
    // Sample blog posts data
    const posts = [
        {
            title: 'How Banks in Zimbabwe are Improving Cybersecurity',
            date: 'May 5, 2025',
            summary: 'Learn how Zimbabwe\'s financial institutions are implementing new security measures to protect against cyber threats.',
            titleShona: 'Mabhangi muZimbabwe ari kusimudzira kuchengetedzeka kwemakomputa',
            summaryShona: 'Dzidza kuti mabhangi eZimbabwe ari kuita sei kuti achengetedze mari yevanhu kubva kuma hacker.'
        },
        {
            title: 'Latest Mobile Banking Scams to Watch For',
            date: 'April 28, 2025',
            summary: 'Mobile banking users should be aware of these new scam techniques targeting Zimbabwean citizens.',
            titleShona: 'Manyepo matsva ekuba mari kuburikidza nerunhare',
            summaryShona: 'Vashandisi vema banking apps vanofanira kuziva nezvemanyepo matsva aya ari kutarisa vanhu vemuZimbabwe.'
        },
        {
            title: 'Why Two-Factor Authentication is Essential',
            date: 'April 15, 2025',
            summary: 'Two-factor authentication adds an extra layer of security that can prevent most account breaches.',
            titleShona: 'Nei Two-Factor Authentication ichikosha',
            summaryShona: 'Two-factor authentication inowedzera rimwe danho rekuchengetedza account yako kubva kuma hacker.'
        },
        {
            title: 'Protecting Your Business from Ransomware',
            date: 'April 3, 2025',
            summary: 'Small businesses in Zimbabwe are increasingly becoming targets for ransomware attacks. Here\'s how to protect yourself.',
            titleShona: 'Chengetedza bhizinesi rako kubva ku ransomware',
            summaryShona: 'Mabhizinesi madiki muZimbabwe ava kusangana nenjodzi yemapurisa emakompiyuta. Hezvino zvekuita kuti uzvidzivirire.'
        },
        {
            title: 'The Rise of Phishing Attacks in Zimbabwe',
            date: 'March 22, 2025',
            summary: 'Phishing attacks targeting Zimbabwean email accounts have increased by 300% in the last year. Learn how to identify them.',
            titleShona: 'Kukwira kwema phishing attacks muZimbabwe',
            summaryShona: 'Ma phishing attacks anotarisa ma email accounts eZimbabwe vakwira ne300% mugore rapfuura. Dzidza kuti ungaziva sei.'
        }
    ];
    
    if (offset === 0) {
        blogPostsContainer.innerHTML = '';
    }
    
    const language = document.getElementById('language-select').value;
    const isShona = language === 'sn-ZW';
    
    const displayPosts = posts.slice(offset, offset + limit);
    displayPosts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${isShona ? post.titleShona : post.title}</h3>
            <div class="post-meta">${post.date}</div>
            <p>${isShona ? post.summaryShona : post.summary}</p>
        `;
        blogPostsContainer.appendChild(listItem);
    });
    
    // Hide Load More button if no more posts
    const loadMoreButton = document.getElementById('load-more');
    if (offset + limit >= posts.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
        loadMoreButton.onclick = () => loadBlogPosts(offset + limit, limit);
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-visibility');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = document.getElementById('language-select').value === 'sn-ZW' ? 'Viga' : 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = document.getElementById('language-select').value === 'sn-ZW' ? 'Ratidza' : 'Show';
    }
}

// Toggle fullscreen mode
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Send email function for contact form
function sendEmail(event) {
    event.preventDefault();
    
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (!subject || !message) {
        alert(document.getElementById('language-select').value === 'sn-ZW' ? 
            'Ndapota nyora musoro uye shoko' : 
            'Please enter both subject and message');
        return;
    }
    
    // This would typically connect to a backend service
    console.log('Email sent with subject:', subject, 'and message:', message);
    
    // Show success message
    alert(document.getElementById('language-select').value === 'sn-ZW' ? 
        'Shoko rako ratumirwa. Tichakudaira nekukurumidza!' : 
        'Your message has been sent. We will respond shortly!');
    
    // Reset form
    document.getElementById('email-form').reset();
}

// WhatsApp contact function
function openWhatsApp() {
    // WhatsApp business number
    const phoneNumber = '+263784140636';
    const message = encodeURIComponent('Hello, I have a question about password security.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// Change language function
function changeLanguage() {
    const language = document.getElementById('language-select').value;
    console.log(`Language changed to ${language}`);
    
    // Define translations
    const translations = {
        'en-US': {
            'main-title': 'Chirindamatura Password Tester',
            'intro-text': 'Enter your password to check its strength and get tips on improving it.',
            'check-button': 'Check Strength',
            'info-title': 'Why Does Password Strength Matter?',
            'products-title': 'Chirindamatura Security Solutions',
            'blog-title': 'Latest Cybersecurity News from Zimbabwe',
            'contact-title': 'Contact Us',
            'toggle-visibility': 'Show',
            'subject-label': 'Subject',
            'message-label': 'Message',
            'submit-btn': 'Send Message'
        },
        'sn-ZW': {
            'main-title': 'Chirindamatura Muongorori WePassword',
            'intro-text': 'Isa password yako kuti uongorore simba rayo uye uwane mazano ekuisimbisa.',
            'check-button': 'Ongorora Simba',
            'info-title': 'Nei Simba RePassword Rakakosha?',
            'products-title': 'Zvishandiso ZveChirindamatura',
            'blog-title': 'Nhau Dzekuchengetedzeka KweComputer MuZimbabwe',
            'contact-title': 'Taurai Nesu',
            'toggle-visibility': 'Ratidza',
            'subject-label': 'Musoro',
            'message-label': 'Shoko',
            'submit-btn': 'Tumira Shoko'
        }
    };
    
    // Apply translations
    if (translations[language]) {
        document.getElementById('main-title').textContent = translations[language]['main-title'];
        document.getElementById('intro-text').textContent = translations[language]['intro-text'];
        document.getElementById('check-button').textContent = translations[language]['check-button'];
        document.getElementById('info-title').textContent = translations[language]['info-title'];
        document.getElementById('products-title').textContent = translations[language]['products-title'];
        document.getElementById('blog-title').textContent = translations[language]['blog-title'];
        document.getElementById('contact-title').textContent = translations[language]['contact-title'];
        document.getElementById('toggle-visibility').textContent = translations[language]['toggle-visibility'];
        
        // Update form labels
        document.querySelector('label[for="subject"]').textContent = translations[language]['subject-label'];
        document.querySelector('label[for="message"]').textContent = translations[language]['message-label'];
        document.querySelector('.submit-btn').textContent = translations[language]['submit-btn'];
        
        // Update toggle buttons text
        updateToggleButtonsText(language);
        
        // Reload blog posts with proper language
        loadBlogPosts();
        
        // Update password strength display if already calculated
        if (document.getElementById('strength').innerHTML !== '') {
            checkPassword();
        }
    }
    
    // Store language preference
    localStorage.setItem('preferredLanguage', language);
}

// Update toggle buttons text
function updateToggleButtonsText(language) {
    const isEnglish = language === 'en-US';
    const sections = {
        'info': isEnglish ? 'Information' : 'Ruzivo',
        'products': isEnglish ? 'Products' : 'Zvigadzirwa',
        'blog': isEnglish ? 'Blog Posts' : 'Nhau',
        'contact': isEnglish ? 'Contact Form' : 'Fomu Yekutaura'
    };
    
    const hideText = isEnglish ? 'Hide' : 'Viga';
    const showText = isEnglish ? 'Show' : 'Ratidza';
    
    Object.keys(sections).forEach(section => {
        const button = document.getElementById(`toggle-${section}`);
        const contentId = `${section}-content`;
        const content = document.getElementById(contentId);
        const isVisible = content.style.display !== 'none';
        const action = isVisible ? hideText : showText;
        button.innerHTML = `<span>${isVisible ? '−' : '+'}</span> ${action} ${sections[section]}`;
    });
}

// Toggle section visibility
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const button = document.getElementById(`toggle-${sectionId}`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
    
    // Update button text
    updateToggleButtonsText(document.getElementById('language-select').value);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load stored language preference
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
        document.getElementById('language-select').value = storedLanguage;
        changeLanguage();
    }
    
    // Initialize blog posts
    loadBlogPosts();
    
    // Attach event listeners
    document.getElementById('password').addEventListener('input', checkPassword);
    document.getElementById('toggle-visibility').addEventListener('click', togglePasswordVisibility);
    document.getElementById('language-select').addEventListener('change', changeLanguage);
    document.getElementById('email-form').addEventListener('submit', sendEmail);
    document.getElementById('whatsapp-btn').addEventListener('click', openWhatsApp);
    
    // Attach toggle section event listeners
    document.getElementById('toggle-info').addEventListener('click', () => toggleSection('info'));
    document.getElementById('toggle-products').addEventListener('click', () => toggleSection('products'));
    document.getElementById('toggle-blog').addEventListener('click', () => toggleSection('blog'));
    document.getElementById('toggle-contact').addEventListener('click', () => toggleSection('contact'));
    
    // Start counter animation
    animateCounters();
});