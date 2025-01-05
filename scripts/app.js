// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9DKwr7qp-QJHCVegItvSDktSuR48yuJI",
    authDomain: "musicalmemoirs-f35ba.firebaseapp.com",
    databaseURL: "https://musicalmemoirs-f35ba-default-rtdb.firebaseio.com",
    projectId: "musicalmemoirs-f35ba",
    storageBucket: "musicalmemoirs-f35ba.appspot.com",
    messagingSenderId: "1008437474417",
    appId: "1:1008437474417:web:05075de89f9a038b8217d0",
    measurementId: "G-PVM7TH88DH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const inqRef = db.ref().child("Inquiries");

// Initialize EmailJS
emailjs.init("WK1jfxvbEvUnYrw7R");

// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const signupModal = document.getElementById('signup');
const signupForm = document.getElementById('inqForm');
const closeModalBtn = document.querySelector('.modal-close');

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Form Submission
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Format date with 2 digits
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours() % 12 || 12).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const period = now.getHours() >= 12 ? 'PM' : 'AM';

        const formattedTime = `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${period}`;

        const formData = {
            time: formattedTime,
            name: document.getElementById('inqFormName').value.trim(),
            email: document.getElementById('inqFormMail').value.trim(),
            phone: document.getElementById('inqFormNum').value.trim()
        };

        // Validation
        if (!formData.name) {
            alert('Please enter your name!');
            return;
        }
        if (!formData.email && !formData.phone) {
            alert('Please enter your phone number and/or email address!');
            return;
        }

        try {
            // Save to Firebase
            await inqRef.push().set(formData);

            // Send email notification
            await emailjs.send(
                'service_ce9wlr6',
                'template_2jsmdte',
                {
                    to_name: 'Jacob and Gabi',
                    from_name: 'Musical Memoirs',
                    from_email: 'noreply@musicalmemoirs.com',
                    message: `New inquiry received at ${formData.time}
\nName: ${formData.name}
\nEmail: ${formData.email || 'No email provided'}
\nPhone: ${formData.phone || 'No phone provided'}`
                }
            );

            signupForm.reset();
            closeModal('signup');
            alert('Thank you for your interest! We will contact you soon.');
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your information. Please try again.');
        }
    });
}

// Admin Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPw').value;

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            document.getElementById('loginContainer').style.display = 'none';
            loadInquiries();
        } catch (error) {
            console.error('Login error:', error);
            alert('Invalid login credentials');
        }
    });
}

// Load Inquiries for Admin
async function loadInquiries() {
    const inquiriesContainer = document.getElementById('inqContainer');
    if (!inquiriesContainer) return;

    inquiriesContainer.style.display = 'block';

    // Custom date sorting function
    $.fn.dataTable.ext.type.order['customDate-pre'] = function (data) {
        try {
            // Convert "MM/DD/YYYY, HH:MM:SS AM/PM" to timestamp
            const [datePart, timePart] = data.split(', ');
            const [month, day, year] = datePart.split('/');
            const [time, period] = timePart.split(' ');
            const [hours, minutes, seconds] = time.split(':');

            // Parse integers, removing leading zeros
            const monthInt = parseInt(month, 10);
            const dayInt = parseInt(day, 10);
            const hourInt = parseInt(hours, 10);
            const minuteInt = parseInt(minutes, 10);
            const secondInt = parseInt(seconds, 10);

            // Convert to 24-hour format
            let hour = hourInt;
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;

            const date = new Date(year, monthInt - 1, dayInt, hour, minuteInt, secondInt);
            return date.getTime();
        } catch (error) {
            return 0; // Return 0 for invalid dates
        }
    };

    // Initialize DataTable
    const table = $('#inquiriesTable').DataTable({
        responsive: true,
        order: [[0, 'desc']], // Sort by time descending
        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        columnDefs: [{
            targets: 0,
            type: 'customDate'
        }],
        columns: [
            { title: 'Time', width: '25%' },
            { title: 'Name', width: '25%' },
            { title: 'Email', width: '25%' },
            { title: 'Phone', width: '25%' }
        ],
        language: {
            search: 'Search:',
            lengthMenu: 'Show _MENU_ entries',
            info: 'Showing _START_ to _END_ of _TOTAL_ entries',
            paginate: {
                first: '«',
                previous: '‹',
                next: '›',
                last: '»'
            }
        }
    });

    // Keep track of loaded entries
    const loadedEntries = new Set();

    // Load data from Firebase
    await inqRef.orderByChild('time').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const entryKey = `${data.time}-${data.name}`;

            if (!loadedEntries.has(entryKey)) {
                loadedEntries.add(entryKey);
                table.row.add([
                    data.time,
                    data.name,
                    data.email || 'N/A',
                    data.phone || 'N/A'
                ]);
            }
        });
        table.draw();
    });

    // Listen for new entries
    inqRef.orderByChild('time').on('child_added', (snapshot) => {
        const data = snapshot.val();
        const entryKey = `${data.time}-${data.name}`;

        if (!loadedEntries.has(entryKey)) {
            loadedEntries.add(entryKey);
            table.row.add([
                data.time,
                data.name,
                data.email || 'N/A',
                data.phone || 'N/A'
            ]).draw();
        }
    });
} 