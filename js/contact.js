/* contact.js */
function submitContact(e) {
    e.preventDefault();
    const name = document.getElementById('cName').value.trim();
    const phone = document.getElementById('cPhone').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    if (!name) { showToast('Please enter your name', 'warning'); return; }
    if (!phone || phone.length < 10) { showToast('Please enter a valid phone number', 'warning'); return; }
    if (!message) { showToast('Please enter your message', 'warning'); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email', 'warning'); return; }

    showToast('Thank you! Your message has been sent. We will contact you soon.', 'success');
    document.getElementById('contactForm').reset();
}