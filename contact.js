const modal = document.getElementById('loadingModal');
const form = document.getElementById('contactForm');
const emailInput = document.getElementById('email');
const messageElement = document.getElementById('message');

function showLoadingModal() {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function hideLoadingModal() {
  modal.classList.remove('show');
  document.body.style.overflow = ''; // Restore scrolling
}

function showMessage(text, isError = false) {
  messageElement.textContent = text;
  messageElement.className = `message ${isError ? 'error' : 'success'}`;
  messageElement.style.display = 'block';
}

async function handleSubmit(event) {
  event.preventDefault();
  
  const email = emailInput.value.trim();
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name') || localStorage.getItem('userName');

  console.log('URL Parameters:', {
    name: urlParams.get('name'),
    email: urlParams.get('email'),
    allParams: Object.fromEntries(urlParams.entries())
  });

  if (!email) {
    showMessage('Please enter your email.', true);
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|ir|org|net|edu|gov)$/i;
  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email with an approved domain.', true);
    return;
  }

  if (!name) {
    showMessage('Please enter your name on the main page first.', true);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }

  try {
    showLoadingModal();

    // Log the data being sent
    console.log('Sending data:', { name, email });

    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);

    const response = await fetch('https://n8nstudent.dotavvab.com/webhook/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData.toString()
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const responseText = await response.text();
    console.log('Raw response:', responseText);
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Error processing server response.');
    }

    console.log('Parsed response:', data);

    if (response.ok && data.success) {
      showMessage('Registration successful!', false);
      setTimeout(() => {
        hideLoadingModal();
        window.location.href = 'thank-you.html';
      }, 1500);
    } else {
      throw new Error(data.message || 'Error submitting data.');
    }

  } catch (error) {
    console.error('Error during submission:', error);
    hideLoadingModal();
    showMessage(error.message || 'Error communicating with the server. Please try again.', true);
  }
}

// Add form submit event listener
form.addEventListener('submit', handleSubmit);

// Check for name parameter on page load
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  
  if (!name) {
    console.log('No name parameter found in URL');
    // Optionally redirect to index page if no name is found
    // window.location.href = 'index.html';
  } else {
    console.log('Name parameter found:', name);
  }
});
