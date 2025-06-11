const modal = document.getElementById('loadingModal');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const messageDiv = document.getElementById('message');

function showLoadingModal() {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function hideLoadingModal() {
  modal.classList.remove('show');
  document.body.style.overflow = ''; // Restore scrolling
}

function showMessage(text, type = 'error') {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';

  // Hide message after 5 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

async function handleSubmit(event) {
  event.preventDefault();

  const name = emailInput.value.trim();

  if (!name) {
    showMessage('Please enter your full name');
    emailInput.focus();
    return;
  }

  try {
    showLoadingModal();

    const response = await fetch("https://aland-learning.darkube.app/webhook/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `name=${encodeURIComponent(name)}`
    });

    if (!response.ok) {
      throw new Error("Error connecting to the server");
    }

    const data = await response.json();

    // Add minimum delay for better UX
    setTimeout(() => {
      hideLoadingModal();
      window.location.href = `status.html?status=${encodeURIComponent(data.status)}&email=${encodeURIComponent(name)}`;
    }, 800);

  } catch (error) {
    console.error('Error:', error);
    hideLoadingModal();
    showMessage(error.message || 'Error connecting to the server. Please try again.');
  }
}

// Add form submit event listener
emailForm.addEventListener('submit', handleSubmit);
