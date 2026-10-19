/**
 * 3nglizy - English Cafe Conversations
 * Interactive JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- AOS INIT ---------- */
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });
    }

    /* ---------- PRELOADER ---------- */
    var preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            setTimeout(function () { preloader.classList.add('hide'); }, 400);
        });
        // fallback in case load already fired
        setTimeout(function () { preloader.classList.add('hide'); }, 2200);
    }

    /* ---------- SCROLL TO TOP + PROGRESS RING ---------- */
    var scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        var progressCircle = scrollTopBtn.querySelector('.progress');
        var radius = 23;
        var circumference = 2 * Math.PI * radius;
        if (progressCircle) {
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = circumference;
        }

        function updateScrollProgress() {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var pct = docHeight > 0 ? scrollTop / docHeight : 0;
            if (progressCircle) {
                progressCircle.style.strokeDashoffset = circumference - pct * circumference;
            }
            if (scrollTop > 350) scrollTopBtn.classList.add('show');
            else scrollTopBtn.classList.remove('show');
        }

        function scrollToTopHandler() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
        scrollTopBtn.addEventListener('click', scrollToTopHandler);
        scrollTopBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToTopHandler(); }
        });
    }

    /* ---------- NAVBAR SCROLL STATE ---------- */
    var nav = document.getElementById('mainNav');
    function onScroll() {
        if (nav) {
            if (window.scrollY > 40) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }
        if (scrollTopBtn) {
            updateScrollProgress();
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Collapse mobile menu after clicking a link */
    document.querySelectorAll('#navMenu .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            var collapseEl = document.getElementById('navMenu');
            if (typeof bootstrap !== 'undefined' && collapseEl) {
                var bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    /* ---------- ANIMATED COUNTERS ---------- */
    var counters = document.querySelectorAll('.counter');
    var counted = new WeakSet();
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 1800;
        var startTime = null;
        function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.floor(eased * target);
            el.textContent = value.toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !counted.has(entry.target)) {
                    counted.add(entry.target);
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (c) { counterObserver.observe(c); });
    } else {
        counters.forEach(function (c) { animateCounter(c); });
    }

    /* ---------- SESSION SEAT PROGRESS BARS ---------- */
    var progressBars = document.querySelectorAll('.cause-progress-fill');
    if ('IntersectionObserver' in window) {
        var progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    el.style.width = el.getAttribute('data-progress') + '%';
                    progressObserver.unobserve(el);
                }
            });
        }, { threshold: 0.25 });
        progressBars.forEach(function (bar) { progressObserver.observe(bar); });
    } else {
        progressBars.forEach(function (bar) {
            bar.style.width = bar.getAttribute('data-progress') + '%';
        });
    }

    /* ---------- MOUSE-FOLLOW GLOW IN HERO ---------- */
    var heroGlow = document.querySelector('.hero-glow');
    var heroSection = document.querySelector('.hero');
    if (heroSection && heroGlow && window.matchMedia('(pointer:fine)').matches) {
        heroSection.addEventListener('mousemove', function (e) {
            var rect = heroSection.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            heroGlow.style.transform = 'translate(' + (x - 260) * 0.12 + 'px,' + (y - 260) * 0.12 + 'px)';
        });
    }

    /* ---------- BRAND CONFETTI BURST (3nglizy Colors) ---------- */
    function burstConfetti(originEl) {
        var colors = ['#024478', '#02B8BC', '#FFFFFF', '#013157', '#019ea2', '#67e8f9'];
        var rect = originEl.getBoundingClientRect();
        for (var i = 0; i < 28; i++) {
            var piece = document.createElement('span');
            piece.className = 'confetti-piece';
            var size = 6 + Math.random() * 7;
            piece.style.width = size + 'px';
            piece.style.height = (size * 0.45) + 'px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.left = (rect.left + rect.width / 2) + 'px';
            piece.style.top = (rect.top) + 'px';
            var angle = Math.random() * Math.PI - Math.PI / 2;
            var velocity = 4 + Math.random() * 5;
            var vx = Math.cos(angle) * velocity * 18;
            var vy = -Math.abs(Math.sin(angle) * velocity) * 22 - 40;
            var rotation = Math.random() * 720 - 360;
            document.body.appendChild(piece);
            piece.animate([
                { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
                { transform: 'translate(' + vx + 'px,' + (vy + 260) + 'px) rotate(' + rotation + 'deg)', opacity: 0 }
            ], { duration: 1100 + Math.random() * 400, easing: 'cubic-bezier(.22,.61,.36,1)' });
            (function (p) { setTimeout(function () { p.remove(); }, 1600); })(piece);
        }
    }

    /* Confetti trigger on booking buttons */
    document.querySelectorAll('.session-book-btn, #heroBookBtn, #ctaBookBtn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            burstConfetti(btn);
        });
    });

    /* ---------- BOOKING MODAL & PREFILL LOGIC ---------- */
    var bookingModalEl = document.getElementById('bookingModal');
    var bookingModal = (bookingModalEl && typeof bootstrap !== 'undefined') ? new bootstrap.Modal(bookingModalEl) : null;
    var sessionSelect = document.getElementById('modalSessionSelect');

    document.querySelectorAll('.session-book-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var sessionName = btn.getAttribute('data-session');
            if (sessionSelect && sessionName) {
                for (var i = 0; i < sessionSelect.options.length; i++) {
                    if (sessionSelect.options[i].value === sessionName || sessionSelect.options[i].text.indexOf(sessionName) !== -1) {
                        sessionSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            if (bookingModal) {
                bookingModal.show();
            } else {
                var contactSec = document.getElementById('contact');
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                    var cfSession = document.getElementById('cf-session');
                    if (cfSession && sessionName) cfSession.value = sessionName;
                }
            }
        });
    });

    /* Quick booking modal form submission */
    var modalBookingForm = document.getElementById('modalBookingForm');
    var modalStatus = document.getElementById('modalBookingStatus');
    if (modalBookingForm) {
        modalBookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!modalBookingForm.checkValidity()) {
                modalBookingForm.classList.add('was-validated');
                return;
            }
            if (modalStatus) {
                modalStatus.innerHTML = '<div class="alert alert-success mt-3 mb-0" style="border-radius:12px;background:#e3fafb;color:#024478;border:1px solid #02B8BC;"><i class="bi bi-check-circle-fill text-info me-2"></i><strong>Seat Reserved!</strong> We will message you on WhatsApp with cafe meeting details!</div>';
            }
            modalBookingForm.reset();
            modalBookingForm.classList.remove('was-validated');
            setTimeout(function () {
                if (bookingModal) bookingModal.hide();
                if (modalStatus) modalStatus.innerHTML = '';
            }, 3000);
        });
    }

    /* ---------- MAIN CONTACT FORM SUBMISSION ---------- */
    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            if (status) {
                status.innerHTML = '<div class="alert alert-success mt-3 mb-0" style="border-radius:12px;background:#e3fafb;color:#024478;border:1px solid #02B8BC;"><i class="bi bi-cup-hot-fill me-2" style="color:#02B8BC;"></i><strong>Thank you!</strong> Your message has been sent. Our team will get back to you within 24 hours.</div>';
            }
            form.reset();
            form.classList.remove('was-validated');
        });
    }

});
