const modal = document.getElementById('loadingModal');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const messageDiv = document.getElementById('message');

// Login functionality
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close-modal');
const loginForm = document.getElementById('loginForm');

// Header scroll effect
const header = document.querySelector('.main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

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

    const response = await fetch("https://n8nstudent.dotavvab.com/webhook/check-email", {
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

// Show modal when login button is clicked
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

// Close modal when close button is clicked
closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Close modal when clicking outside
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    // Here you can add your login logic
    console.log('Login attempt with email:', email);
    
    // For now, just close the modal
    loginModal.style.display = 'none';
    loginForm.reset();
});

function scrollToEmailForm() {
    const emailFormSection = document.getElementById('emailFormSection');
    if (emailFormSection) {
        emailFormSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        // Focus on the email input after scrolling
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 1000);
    }
}
