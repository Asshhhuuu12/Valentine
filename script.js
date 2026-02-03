// Base URL for your GitHub Pages site
let baseUrl = window.location.origin;
if (window.location.hostname.includes('github.io')) {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1]) {
        baseUrl = `${window.location.origin}/${pathParts[1]}`;
    }
}

// ============ MAIN CODE ============
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const resultSection = document.getElementById('resultSection');
    const recipientName = document.getElementById('recipientName');
    const customMessage = document.getElementById('customMessage');
    const copyBtn = document.getElementById('copyBtn');
    const testLink = document.getElementById('testLink');
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    // Generate proposal link
    function generateProposalLink(name, message) {
        const params = new URLSearchParams();
        params.append('to', encodeURIComponent(name));
        
        if (message && message.trim()) {
            params.append('msg', encodeURIComponent(message.trim()));
        }
        
        return `${baseUrl}/proposal.html?${params.toString()}`;
    }
    
    // Generate link button click handler
    generateBtn.addEventListener('click', function() {
        const name = recipientName.value.trim();
        
        if (!name) {
            showAlert('Please enter a name for your Valentine! 💝', 'warning');
            recipientName.focus();
            return;
        }
        
        const customMsg = customMessage.value.trim();
        
        // Change button to loading state
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Magic...';
        generateBtn.disabled = true;
        
        // Generate the proposal link
        const proposalLink = generateProposalLink(name, customMsg);
        
        // Display the generated link
        const generatedLink = document.getElementById('generatedLink');
        generatedLink.value = proposalLink;
        testLink.href = proposalLink;
        
        // Setup WhatsApp share button
        if (whatsappBtn) {
            whatsappBtn.onclick = function() {
                const whatsappText = `Will you be my Valentine? 💝\n\n${proposalLink}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
                window.open(whatsappUrl, '_blank');
            };
        }
        
        // Show the result section with animation
        resultSection.classList.remove('hidden');
        
        // Animate the result section
        resultSection.style.opacity = '0';
        resultSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultSection.style.transition = 'all 0.5s ease-out';
            resultSection.style.opacity = '1';
            resultSection.style.transform = 'translateY(0)';
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        // Show success message
        showAlert('Link created successfully! Copy and share it with your Valentine! 💖', 'success');
        
        // Restore button
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    });
    
    // Copy link button click handler
    copyBtn.addEventListener('click', function() {
        const generatedLink = document.getElementById('generatedLink');
        generatedLink.select();
        generatedLink.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(generatedLink.value).then(() => {
            showCopyFeedback();
        }).catch(err => {
            // Fallback for older browsers
            document.execCommand('copy');
            showCopyFeedback();
        });
        
        function showCopyFeedback() {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#2E7D32';
            copyBtn.disabled = true;
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
                copyBtn.disabled = false;
            }, 2000);
        }
    });
    
    // Alert notification function
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert-notification');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert-notification alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="alert-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to page
        document.querySelector('.container').appendChild(alert);
        
        // Show alert
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        // Close button
        alert.querySelector('.alert-close').addEventListener('click', function() {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode && alert.classList.contains('show')) {
                alert.classList.remove('show');
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Enter key support
    recipientName.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            generateBtn.click();
        }
    });
    
    customMessage.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            generateBtn.click();
        }
    });
    
    // Auto-focus on name input
    recipientName.focus();
    
    // Add alert styles
    const alertStyles = `
        .alert-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 15px;
            transform: translateX(150%);
            transition: transform 0.3s ease-out;
            border-left: 5px solid #e91e63;
        }
        
        .alert-notification.show {
            transform: translateX(0);
        }
        
        .alert-success {
            border-left-color: #4CAF50;
            background: linear-gradient(135deg, #e8f5e9, #ffffff);
        }
        
        .alert-warning {
            border-left-color: #ff9800;
            background: linear-gradient(135deg, #fff3e0, #ffffff);
        }
        
        .alert-notification i:first-child {
            font-size: 1.5rem;
        }
        
        .alert-success i:first-child {
            color: #4CAF50;
        }
        
        .alert-warning i:first-child {
            color: #ff9800;
        }
        
        .alert-notification span {
            flex: 1;
            color: #333;
            font-size: 0.95rem;
        }
        
        .alert-close {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 1rem;
            padding: 5px;
            transition: color 0.3s;
        }
        
        .alert-close:hover {
            color: #333;
        }
        
        @media (max-width: 768px) {
            .alert-notification {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    
    // Add styles to page
    const styleSheet = document.createElement('style');
    styleSheet.textContent = alertStyles;
    document.head.appendChild(styleSheet);
});