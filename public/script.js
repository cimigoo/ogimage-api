/**
 * OG Image API - Frontend Script
 * Handles API key generation and UI interactions
 */

// API key form submission
document.getElementById('apiKeyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('emailInput').value.trim();
  const resultDiv = document.getElementById('apiKeyResult');
  const apiKeyDisplay = document.getElementById('apiKeyDisplay');
  const submitButton = e.target.querySelector('button');
  
  // Disable button and show loading
  submitButton.disabled = true;
  submitButton.textContent = 'Generating...';
  
  try {
    const response = await fetch('/api/get-api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate API key');
    }
    
    const data = await response.json();
    
    // Display API key
    apiKeyDisplay.textContent = data.apiKey;
    resultDiv.style.display = 'block';
    
    // Save to localStorage for later use
    localStorage.setItem('ogimage_api_key', data.apiKey);
    localStorage.setItem('ogimage_email', email);
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Get API Key';
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Check if user already has API key on page load
window.addEventListener('DOMContentLoaded', () => {
  const storedKey = localStorage.getItem('ogimage_api_key');
  if (storedKey) {
    // Optionally auto-fill or show a message
    console.log('API key found in localStorage');
  }
});
