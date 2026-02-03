document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const resultSection = document.getElementById('resultSection');
    const generatedLink = document.getElementById('generatedLink');
    const copyBtn = document.getElementById('copyBtn');
    const testLink = document.getElementById('testLink');
    const recipientName = document.getElementById('recipientName');
    const customMessage = document.getElementById('customMessage');
    
    // Get base URL for GitHub Pages
    function getBaseUrl() {
        // Check if we're on GitHub Pages or local
        if (window.location.hostname.includes('github.io')) {
            // GitHub Pages URL
            const path = window.location.pathname.split('/');
            const repoName = path[1] || '';
            return `${window.location.origin}/${repoName}`;
        } else {
            // Local development
            return window.location.origin;
        }
    }
    
    // Generate a unique ID
    function generateUniqueId() {
        return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    
    // Save data to localStorage
    function saveToLocalStorage(id, data) {
        try {
            const savedMessages = JSON.parse(localStorage.getItem('valentineMessages') || '{}');
            savedMessages[id] = {
                ...data,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('valentineMessages', JSON.stringify(savedMessages));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    }
    
    // Generate link button click handler
    generateBtn.addEventListener('click', function() {
        const name = recipientName.value.trim();
        
        if (!name) {
            alert('Please enter a name for the recipient!');
            recipientName.focus();
            return;
        }
        
        // Generate unique ID
        const uniqueId = generateUniqueId();
        
        // Prepare data to save
        const messageData = {
            to: name,
            message: customMessage.value.trim() || 'You are special! Happy Valentine\'s Day!',
            from: 'Someone who cares'
        };
        
        // Save to localStorage
        if (saveToLocalStorage(uniqueId, messageData)) {
            // Generate the link
            const baseUrl = getBaseUrl();
            const fullUrl = `${baseUrl}/special.html?id=${uniqueId}`;
            
            // Display the generated link
            generatedLink.value = fullUrl;
            
            // Update the test link
            testLink.href = fullUrl;
            
            // Show the result section
            resultSection.classList.remove('hidden');
            
            // Scroll to result section
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Clear form (optional)
            // recipientName.value = '';
            // customMessage.value = '';
        } else {
            alert('Could not generate link. Please try again.');
        }
    });
    
    // Copy link button click handler
    copyBtn.addEventListener('click', function() {
        generatedLink.select();
        generatedLink.setSelectionRange(0, 99999);
        
        try {
            navigator.clipboard.writeText(generatedLink.value).then(function() {
                showCopyFeedback();
            }).catch(function() {
                // Fallback
                document.execCommand('copy');
                showCopyFeedback();
            });
        } catch (err) {
            // Older browsers fallback
            document.execCommand('copy');
            showCopyFeedback();
        }
        
        function showCopyFeedback() {
            const originalText = copyBtn.innerHTML;
            const originalBg = copyBtn.style.background;
            
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#2E7D32';
            copyBtn.disabled = true;
            
            setTimeout(function() {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = originalBg;
                copyBtn.disabled = false;
            }, 2000);
        }
    });
    
    // Enter key support
    recipientName.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
    
    customMessage.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBtn.click();
        }
    });
});