// ============ SUPABASE CONFIGURATION ============
// Replace these with your actual Supabase credentials!
const SUPABASE_URL = 'https://llluxktkpputnyrqltwp.supabase.co';  // Your Project URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbHV4a3RrcHB1dG55cnFsdHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjYwNTEsImV4cCI6MjA4NTcwMjA1MX0.c4TfxOAYg1NxYm4cTrtYj_9lsZTbXHhjTQUupM8vUFk';  // Your anon/public key

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
    
    // Save message to Supabase
    async function saveToSupabase(name, message) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/valentine_messages`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    to: name,
                    message: message || 'You are special! Happy Valentine\'s Day! 💝'
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Saved to Supabase:', data);
            
            // Generate TWO links:
            const messageId = data[0].id;
            
            return {
                viewLink: `${baseUrl}/view.html?id=${messageId}`,
                proposalLink: `${baseUrl}/proposal.html?to=${encodeURIComponent(name)}`
            };
            
        } catch (error) {
            console.error('Error saving to Supabase:', error);
            throw error;
        }
    }
    
    // Generate link button click handler
    generateBtn.addEventListener('click', async function() {
        const name = recipientName.value.trim();
        
        if (!name) {
            alert('Please enter a name for the recipient!');
            recipientName.focus();
            return;
        }
        
        const customMsg = customMessage.value.trim();
        
        // Change button to loading state
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        try {
            // Save to Supabase and get both links
            const links = await saveToSupabase(name, customMsg);
            
            // Create HTML for both links
            const resultHTML = `
                <h3>Here are your magical links! ✨</h3>
                
                <div class="link-group">
                    <h4>1. Direct Message Link:</h4>
                    <div class="link-container">
                        <input type="text" value="${links.viewLink}" readonly class="link-display" id="viewLinkInput">
                        <button class="btn-secondary copy-btn" data-link="${links.viewLink}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <p class="link-description">Send this for a direct Valentine message</p>
                    <a href="${links.viewLink}" target="_blank" class="btn-tertiary">
                        <i class="fas fa-external-link-alt"></i> Test Message Link →
                    </a>
                </div>
                
                <div class="link-group">
                    <h4>2. Interactive Proposal Link:</h4>
                    <div class="link-container">
                        <input type="text" value="${links.proposalLink}" readonly class="link-display" id="proposalLinkInput">
                        <button class="btn-secondary copy-btn" data-link="${links.proposalLink}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <p class="link-description">Send this for a fun "Will you be my Valentine?" proposal</p>
                    <a href="${links.proposalLink}" target="_blank" class="btn-tertiary">
                        <i class="fas fa-external-link-alt"></i> Test Proposal Link →
                    </a>
                </div>
                
                <div class="usage-tips">
                    <h4>💡 How to use:</h4>
                    <ul>
                        <li><strong>Direct Message Link:</strong> Perfect for a sweet, straightforward Valentine's message</li>
                        <li><strong>Proposal Link:</strong> Fun interactive page where they have to say "YES" to be your Valentine!</li>
                    </ul>
                </div>
            `;
            
            // Display the result section
            resultSection.innerHTML = resultHTML;
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
            // Add event listeners to new copy buttons
            document.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const link = this.getAttribute('data-link');
                    copyToClipboard(link, this);
                });
            });
            
        } catch (error) {
            console.error('Failed to generate link:', error);
            
            // Fallback with just proposal link (no database needed)
            const proposalLink = `${baseUrl}/proposal.html?to=${encodeURIComponent(name)}`;
            const viewLink = `${baseUrl}/view.html?to=${encodeURIComponent(name)}&msg=${encodeURIComponent(customMsg || 'You are special! 💝')}`;
            
            const fallbackHTML = `
                <h3>Here are your magical links! ✨</h3>
                <p class="fallback-warning"><i class="fas fa-exclamation-triangle"></i> Using fallback mode (no database)</p>
                
                <div class="link-group">
                    <h4>1. Direct Message Link:</h4>
                    <div class="link-container">
                        <input type="text" value="${viewLink}" readonly class="link-display">
                        <button class="btn-secondary copy-btn" data-link="${viewLink}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <p class="link-description">Works in any browser</p>
                    <a href="${viewLink}" target="_blank" class="btn-tertiary">
                        <i class="fas fa-external-link-alt"></i> Test Message Link →
                    </a>
                </div>
                
                <div class="link-group">
                    <h4>2. Interactive Proposal Link:</h4>
                    <div class="link-container">
                        <input type="text" value="${proposalLink}" readonly class="link-display">
                        <button class="btn-secondary copy-btn" data-link="${proposalLink}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <p class="link-description">Fun interactive proposal (works everywhere!)</p>
                    <a href="${proposalLink}" target="_blank" class="btn-tertiary">
                        <i class="fas fa-external-link-alt"></i> Test Proposal Link →
                    </a>
                </div>
            `;
            
            resultSection.innerHTML = fallbackHTML;
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
            // Add event listeners to fallback copy buttons
            document.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const link = this.getAttribute('data-link');
                    copyToClipboard(link, this);
                });
            });
            
        } finally {
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }
    });
    
    // Copy to clipboard function
    function copyToClipboard(text, button) {
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            // Try using the modern clipboard API first
            navigator.clipboard.writeText(text).then(() => {
                showCopyFeedback(button);
            }).catch(err => {
                // Fallback for older browsers
                document.execCommand('copy');
                showCopyFeedback(button);
            });
        } catch (err) {
            // Final fallback
            document.execCommand('copy');
            showCopyFeedback(button);
        } finally {
            // Clean up
            document.body.removeChild(tempInput);
        }
    }
    
    // Show copy feedback
    function showCopyFeedback(button) {
        const originalText = button.innerHTML;
        const originalBg = button.style.background;
        
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = '#2E7D32';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBg;
            button.disabled = false;
        }, 2000);
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
    
    // Optional: Auto-focus on name input
    recipientName.focus();
    
    // Optional: Display saved messages count (for testing)
    async function displayStats() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/valentine_messages?select=count`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`Total messages in database: ${data.length}`);
                
                // Optional: Display count somewhere on page
                // const statsElement = document.createElement('div');
                // statsElement.className = 'stats';
                // statsElement.innerHTML = `🎉 ${data.length} Valentine messages created so far!`;
                // document.querySelector('.container').appendChild(statsElement);
            }
        } catch (error) {
            console.log('Could not fetch stats:', error);
        }
    }
    
    // Uncomment to show stats on page load
    // displayStats();
});

// Add these styles to your style.css for the new layout
const additionalStyles = `
    .link-group {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 15px;
        border-left: 5px solid #e91e63;
        transition: transform 0.3s;
    }
    
    .link-group:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    .link-group h4 {
        color: #d32f2f;
        margin-bottom: 15px;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .link-group h4:before {
        content: "🎯";
        font-size: 1.5rem;
    }
    
    .link-description {
        color: #666;
        font-size: 0.9rem;
        margin-top: 10px;
        font-style: italic;
    }
    
    #resultSection h3 {
        margin-bottom: 30px;
        text-align: center;
    }
    
    .usage-tips {
        background: #e8f5e9;
        border-radius: 15px;
        padding: 20px;
        margin-top: 30px;
        border-left: 5px solid #4CAF50;
    }
    
    .usage-tips h4 {
        color: #2E7D32;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .usage-tips ul {
        list-style-type: none;
        padding-left: 0;
    }
    
    .usage-tips li {
        margin-bottom: 10px;
        padding-left: 25px;
        position: relative;
    }
    
    .usage-tips li:before {
        content: "💝";
        position: absolute;
        left: 0;
    }
    
    .fallback-warning {
        background: #fff3e0;
        color: #f57c00;
        padding: 10px 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        text-align: center;
        border-left: 4px solid #ff9800;
    }
    
    .fallback-warning i {
        margin-right: 10px;
    }
    
    /* Animation for new result section */
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    #resultSection {
        animation: slideIn 0.5s ease-out;
    }
    
    /* Responsive adjustments */
    @media (max-width: 650px) {
        .link-group {
            padding: 15px;
        }
        
        .link-container {
            flex-direction: column;
        }
        
        .btn-secondary {
            width: 100%;
            justify-content: center;
        }
    }
`;

// Add the new styles to the page
document.addEventListener('DOMContentLoaded', function() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
});