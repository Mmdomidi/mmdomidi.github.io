const modal = document.getElementById('loadingModal');
const statusMessage = document.getElementById('statusMessage');

function showLoadingModal() {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function hideLoadingModal() {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function showMessage(status, email) {
  let message = '';
  let className = '';

  switch (status) {
    case 'available':
      message = `
        <div class="status-icon success">✓</div>
        <h2>Email ${email}@mohammadi.com is available</h2>
        <p>You can reserve this email address.</p>
        <div class="action-buttons">
          <button onclick="reserveEmail('${email}')" class="cta-button">Reserve</button>
          <button onclick="goHome()" class="secondary-button">Back</button>
        </div>
      `;
      className = 'success';
      break;
    case 'reserved':
      message = `
        <div class="status-icon error">✕</div>
        <h2>Email ${email}@mohammadi.com has already been reserved</h2>
        <p>Please try a different name.</p>
        <button onclick="goHome()" class="cta-button">Try Again</button>
      `;
      className = 'error';
      break;
    case 'pending':
      message = `
        <div class="status-icon pending">⏳</div>
        <h2>Email ${email}@mohammadi.com is under review</h2>
        <p>Please wait...</p>
        <button onclick="goHome()" class="secondary-button">Back</button>
      `;
      className = 'pending';
      break;
    // case 'reserved11':
    //   message = `
    //     <div class="status-icon success">✓</div>
    //     <h2>Email ${email}@mohammadi.com has been successfully reserved</h2>
    //     <p>Please complete your information.</p>
    //     <a href="contact.html?name=${encodeURIComponent(email)}" class="cta-button">Complete Info</a>
    //   `;
    //   className = 'success';
    //   break;
    default:
      message = `
        <div class="status-icon error">✕</div>
        <h2>Email ${email}@mohammdi.com has already been reserved</h2>
        <p>Please try a different name.</p>
        <button onclick="goHome()" class="cta-button">Try Again</button>
      `;
      className = 'error';
  }

  statusMessage.innerHTML = message;
  statusMessage.className = className;
}

// Get email and status from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const status = urlParams.get('status');

// Show loading modal immediately
showLoadingModal();

// Add minimum delay for better UX
setTimeout(() => {
  hideLoadingModal();
  if (email && status) {
    showMessage(status, email);
  } else {
    showMessage('error');
  }
}, 800);

function goHome() {
  window.location.href = 'index.html';
}

async function reserveEmail(email) {
  if (!email) {
    alert("Invalid email.");
    return;
  }

  showLoadingModal();

  try {
    const formData = new URLSearchParams();
    formData.append('name', email);

    const response = await fetch("https://n8nstudent.dotavvab.com/webhook/reserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    if (!response.ok) {
      throw new Error("Server connection error");
    }

    const data = await response.json();

    hideLoadingModal();

    if (data.status === "reserved") {
      console.log('Reservation successful:', data);
      window.location.href = `contact.html?name=${encodeURIComponent(email)}`;
    } else {
      console.error('Reservation failed:', data);
      showMessage('error', email);
    }
  } catch (error) {
    console.error('Error during reservation:', error);
    hideLoadingModal();
    alert("Error reserving email. Please try again.");
  }
}
