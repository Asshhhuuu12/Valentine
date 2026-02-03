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
    const generatedLink = document.getElementById('generatedLink');
    const copyBtn = document.getElementById('copyBtn');
    const testLink = document.getElementById('testLink');
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
            
            // Return the first item's ID (Supabase returns an array)
            return data[0].id;
            
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
            // Save to Supabase
            const messageId = await saveToSupabase(name, customMsg);
            
            // Create the view URL
            const viewUrl = `${baseUrl}/view.html?id=${messageId}`;
            
            // Display the generated link
            generatedLink.value = viewUrl;
            testLink.href = viewUrl;
            
            // Show the result section
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
            // Optional: Clear form after success
            // recipientName.value = '';
            // customMessage.value = '';
            
        } catch (error) {
            console.error('Failed to generate link:', error);
            
            // Fallback method using URL parameters
            alert('Using fallback method (URL parameters)...');
            
            // Create URL with parameters as fallback
            const params = new URLSearchParams();
            params.append('to', encodeURIComponent(name));
            if (customMsg) params.append('msg', encodeURIComponent(customMsg));
            
            const viewUrl = `${baseUrl}/view.html?${params.toString()}`;
            generatedLink.value = viewUrl;
            testLink.href = viewUrl;
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
        } finally {
            // Restore button
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }
    });
    
    // Copy link button click handler
    copyBtn.addEventListener('click', function() {
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
            const originalBg = copyBtn.style.background;
            
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#2E7D32';
            copyBtn.disabled = true;
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = originalBg;
                copyBtn.disabled = false;
            }, 2000);
        }
    });
    
    // Enter key support
    recipientName.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateBtn.click();
    });
    
    customMessage.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) generateBtn.click();
    });
    
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
            }
        } catch (error) {
            console.log('Could not fetch stats:', error);
        }
    }
    
    // Uncomment to show stats on page load
    // displayStats();
});