const modal = document.getElementById('loadingModal');
const statusMessage = document.getElementById('statusMessage');

// نمایش مودال لودینگ
function showLoadingModal() {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function hideLoadingModal() {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// نمایش پیام وضعیت ایمیل
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
        <p>You can join the waiting list and we’ll notify you when it's available.</p>
        <div class="waiting-list-box">
          <input type="email" id="waitingEmail" placeholder="Enter your email" />
          <button onclick="joinWaitingList('${email}')" class="cta-button">Join Waiting List</button>
        </div>
        <button onclick="goHome()" class="secondary-button">Back</button>
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

    default:
      message = `
        <div class="status-icon error">✕</div>
        <h2>Email ${email || "This address"}@mohammadi.com is not available</h2>
        <p>You can join the waiting list and we’ll notify you when it's available.</p>
        <div class="waiting-list-box">
          <input type="email" id="waitingEmail" placeholder="Enter your email" />
          <button onclick="joinWaitingList('${email}')" class="cta-button">Join Waiting List</button>
        </div>
        <button onclick="goHome()" class="secondary-button">Back</button>
      `;
      className = 'error';
  }

  statusMessage.innerHTML = message;
  statusMessage.className = className;
}

// دریافت ایمیل و وضعیت از URL
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const status = urlParams.get('status');

// نمایش لودینگ اولیه
showLoadingModal();

setTimeout(() => {
  hideLoadingModal();
  if (email && status) {
    showMessage(status, email);
  } else {
    showMessage('error');
  }
}, 800);

// برگشت به خانه
function goHome() {
  window.location.href = 'index.html';
}

// رزرو ایمیل
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
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    if (!response.ok) throw new Error("Server connection error");

    const data = await response.json();
    hideLoadingModal();

    if (data.status === "reserved") {
      // رفتن به صفحه نمایش رزرو
      window.location.href = `reserved.html?reservedEmail=${encodeURIComponent(email)}&waitinglist=`;
    } else {
      showMessage('error', email);
    }
  } catch (error) {
    console.error('Error during reservation:', error);
    hideLoadingModal();
    alert("Error reserving email. Please try again.");
  }
}

// اضافه کردن به Waiting List و رفتن به صفحه reserved.html
async function joinWaitingList(reservedEmail) {
  const waitingEmail = document.getElementById('waitingEmail').value.trim();
  if (!waitingEmail) {
    alert("Please enter a valid email.");
    return;
  }

  showLoadingModal();
  try {
    const formData = new URLSearchParams();
    formData.append('reservedEmail', reservedEmail);
    formData.append('waitingEmail', waitingEmail);

    const response = await fetch("https://n8nstudent.dotavvab.com/webhook/waitinglist", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    hideLoadingModal();

    if (response.ok) {
      // بعد از ذخیره شدن، رفتن به صفحه reserved.html با ایمیل‌ها
      window.location.href = `reserved.html?reservedEmail=${encodeURIComponent(reservedEmail)}&waitinglist=${encodeURIComponent(waitingEmail)}`;
    } else {
      alert("Error joining waiting list. Please try again.");
    }
  } catch (error) {
    console.error("Error joining waiting list:", error);
    hideLoadingModal();
    alert("Error joining waiting list. Please try again.");
  }
}
