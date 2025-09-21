// گرفتن پارامترها از URL
const urlParams = new URLSearchParams(window.location.search);
let reservedEmail = urlParams.get('reservedEmail') || 'نامعلوم';
let waitinglist = urlParams.get('waitinglist') || 'نامعلوم';

// افزودن دامنه به ایمیل رزرو شده
if (reservedEmail && reservedEmail !== 'نامعلوم') {
  reservedEmail = `${reservedEmail}@mohammadi.com`;
}

// نمایش داده‌ها در صفحه
document.getElementById('reservedEmail').textContent = reservedEmail;
document.getElementById('waitinglist').textContent = waitinglist;
