/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
const eventDate = new Date('2024-12-15T18:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;
  
  if (diff <= 0) {
    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMins = document.getElementById('cdMins');
    const cdSecs = document.getElementById('cdSecs');
    
    if (cdDays) cdDays.textContent = '00';
    if (cdHours) cdHours.textContent = '00';
    if (cdMins) cdMins.textContent = '00';
    if (cdSecs) cdSecs.textContent = '00';
    return;
  }
  
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  
  if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
  if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
  if (cdMins) cdMins.textContent = String(minutes).padStart(2, '0');
  if (cdSecs) cdSecs.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    let current = 0;
    const step = target / 60;
    
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 20);
  });
}

/* ============================================================
   SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
   ============================================================ */
const observerOptions = {
  threshold: [0.1, 0.5],
  rootMargin: '-50px 0px -20px 0px'
};

let observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Trigger counters for stats section
      if (entry.target.matches('.stat-item') || entry.target.closest('.stats-section')) {
        animateCounters();
      }
      
      // Ensure guide panel children get visible class for stagger
      if (entry.target.closest('.guide-panel')) {
        entry.target.closest('.guide-panel').classList.add('visible');
      }
    }
  });
}, observerOptions);

window.refreshGuideObserver = function(panel) {
  if (observer && panel) {
    observer.observe(panel);
    panel.querySelectorAll('.step-item, .doc-item, .checklist li, .emergency-card').forEach(item => {
      observer.observe(item);
    });
  }
};

// Initialize observer
document.querySelectorAll('.fade-in, .fade-left, .fade-right').forEach(el => {
  observer.observe(el);
});

// Stats section observer (one-time)
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

/* ============================================================
   HEADER SCROLL EFFECTS & ACTIVE NAVIGATION
   ============================================================ */
window.addEventListener('scroll', () => {
  // Header shrink effect
  const header = document.querySelector('header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Back to top button
  const backTop = document.getElementById('backTop');
  if (backTop) {
    if (window.scrollY > 300) {
      backTop.classList.add('show');
    } else {
      backTop.classList.remove('show');
    }
  }
  
  // Active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link > a');
  let current = '';
  
  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = sec.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ============================================================
   DROPDOWN MENU (Mobile)
   ============================================================ */
const menuToggle = document.getElementById('menu-toggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownClose = document.getElementById('dropdownClose');
const quickPanelMobile = document.getElementById('quickPanelMobile');
const quickSettingsMobile = document.getElementById('quickSettingsMobile');

function openDropdown() {
  if (!dropdownMenu) return;
  dropdownMenu.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDropdown() {
  if (!dropdownMenu) return;
  dropdownMenu.classList.remove('active');
  document.body.style.overflow = '';
  if (quickPanelMobile) quickPanelMobile.classList.remove('show');
}

// Toggle function
function toggleDropdown() {
  if (dropdownMenu && dropdownMenu.classList.contains('active')) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

// Event listeners
if (menuToggle) {
  const toggleHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  };
  menuToggle.addEventListener('click', toggleHandler);
  menuToggle.addEventListener('touchstart', toggleHandler, { passive: false });
}

if (dropdownClose) {
  dropdownClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeDropdown();
  });
}

// Click outside to close
document.addEventListener('click', (e) => {
  if (dropdownMenu && dropdownMenu.classList.contains('active') && 
      !menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
    closeDropdown();
  }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dropdownMenu && dropdownMenu.classList.contains('active')) {
    closeDropdown();
  }
});

// Global closeDropdown function for onclick handlers in HTML
window.closeDropdown = closeDropdown;

// Global closeMenu for backward compatibility
window.closeMenu = closeDropdown;

/* ============================================================
   NOTIFICATIONS PANEL
   ============================================================ */
const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');

if (notifBtn && notifPanel) {
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifPanel.classList.toggle('show');
  });
  
  document.addEventListener('click', (e) => {
    if (!notifPanel.contains(e.target) && e.target !== notifBtn) {
      notifPanel.classList.remove('show');
    }
  });
}

window.markAllRead = function() {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
    item.classList.add('read');
  });
  const badge = document.getElementById('notifBadge');
  if (badge) badge.style.display = 'none';
};

/* ============================================================
   QUICK ACTIONS (compact lang + dark panel)
   ============================================================ */
const quickActionsBtn = document.getElementById('quickActionsBtn');
const quickPanel = document.getElementById('quickPanel');

if (quickActionsBtn && quickPanel) {
  quickActionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    quickPanel.classList.toggle('show');
  });
  
  document.addEventListener('click', (e) => {
    if (!quickPanel.contains(e.target) && e.target !== quickActionsBtn) {
      quickPanel.classList.remove('show');
    }
  });
}

/* Mobile quick settings inside dropdown */
if (quickSettingsMobile && quickPanelMobile) {
  const hideMobileQuick = () => quickPanelMobile.classList.remove('show');
  
  quickSettingsMobile.addEventListener('click', (e) => {
    e.stopPropagation();
    quickPanelMobile.classList.toggle('show');
  });
  
  document.addEventListener('click', (e) => {
    if (quickPanelMobile.classList.contains('show') &&
        !quickPanelMobile.contains(e.target) &&
        e.target !== quickSettingsMobile) {
      hideMobileQuick();
    }
  });
}

/* ============================================================
   DARK MODE
   ============================================================ */
const darkToggle = document.getElementById('darkToggle');
const darkToggleMobile = document.getElementById('darkToggle-mobile');
const darkIcon = document.getElementById('darkIcon');
const darkIconMobile = document.getElementById('darkIcon-mobile');

let dark = localStorage.getItem('darkMode') === 'true';

function applyDark() {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  
  if (darkIcon) darkIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
  if (darkIconMobile) darkIconMobile.className = dark ? 'fas fa-sun' : 'fas fa-moon';
  
  localStorage.setItem('darkMode', dark);
}

applyDark();

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    dark = !dark;
    applyDark();
    if (quickPanel) quickPanel.classList.remove('show');
  });
}

if (darkToggleMobile) {
  darkToggleMobile.addEventListener('click', () => {
    dark = !dark;
    applyDark();
    if (quickPanelMobile) quickPanelMobile.classList.remove('show');
  });
}

/* ============================================================
   LANGUAGE TOGGLE (Arabic/English)
   ============================================================ */
const langBtn = document.getElementById('langBtn');
const langBtnMobile = document.getElementById('langBtn-mobile');
const langLabel = document.getElementById('langLabel');
const langLabelEn = document.getElementById('langLabel-en');
const langLabelMobile = document.getElementById('langLabel-mobile');
const langLabelMobileEn = document.getElementById('langLabel-mobile-en');

let isArabic = localStorage.getItem('lang') !== 'en';

function toggleLanguage() {
  isArabic = !isArabic;
  const lang = isArabic ? 'ar' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  
  // Toggle labels
  if (langLabel && langLabelEn) {
    langLabel.style.display = isArabic ? 'inline' : 'none';
    langLabelEn.style.display = isArabic ? 'none' : 'inline';
  }
  
  if (langLabelMobile && langLabelMobileEn) {
    langLabelMobile.style.display = isArabic ? 'inline' : 'none';
    langLabelMobileEn.style.display = isArabic ? 'none' : 'inline';
  }
  
  // Toggle all elements with lang-ar / lang-en classes
  document.querySelectorAll('.lang-ar, .lang-en').forEach(el => {
    el.style.display = el.classList.contains(`lang-${lang}`) ? 'block' : 'none';
  });
  
  localStorage.setItem('lang', lang);
}

if (langBtn) langBtn.addEventListener('click', () => {
  toggleLanguage();
  if (quickPanel) quickPanel.classList.remove('show');
});
if (langBtnMobile) langBtnMobile.addEventListener('click', () => {
  toggleLanguage();
  if (quickPanelMobile) quickPanelMobile.classList.remove('show');
});

// Apply saved language
const savedLang = localStorage.getItem('lang');
if (savedLang === 'en') {
  toggleLanguage();
}

/* ============================================================
   MEMBERS DATA & RENDERING
   ============================================================ */
const membersData = [
  { name: 'أحمد محمد الصديق', major: 'إدارة الأعمال', year: 'دراسات عليا', sec: 'إدارية', secColor: 'rgba(210,16,52,0.1)', secTextColor: '#D21034', img: 'img/logo.png' },
  { name: 'يوسف إبراهيم حسن', major: 'هندسة الحاسوب', year: 'السنة الرابعة', sec: 'تقنية', secColor: 'rgba(99,102,241,0.1)', secTextColor: '#6366f1', img: 'img/logo.png' },
  { name: 'نجلاء عبدالله محمد', major: 'القانون', year: 'السنة الثالثة', sec: 'إدارية', secColor: 'rgba(210,16,52,0.1)', secTextColor: '#D21034', img: 'img/logo.png' },
  { name: 'منى حسن الأمين', major: 'الطب البشري', year: 'السنة الثالثة', sec: 'أكاديمية', secColor: 'rgba(245,158,11,0.1)', secTextColor: '#d97706', img: 'img/logo.png' },
  { name: 'بكري عبدالرحمن', major: 'التربية البدنية', year: 'السنة الثانية', sec: 'رياضية', secColor: 'rgba(59,130,246,0.1)', secTextColor: '#3b82f6', img: 'img/logo.png' },
  { name: 'ريم عثمان الزاكي', major: 'علم النفس', year: 'السنة الثانية', sec: 'اجتماعية', secColor: 'rgba(0,122,61,0.1)', secTextColor: '#007A3D', img: 'img/logo.png' },
  { name: 'خديجة المهدي', major: 'الآداب العربية', year: 'السنة الأولى', sec: 'ثقافية', secColor: 'rgba(139,92,246,0.1)', secTextColor: '#7c3aed', img: 'img/logo.png' },
  { name: 'إسماعيل حسين طه', major: 'المحاسبة', year: 'السنة الرابعة', sec: 'مالية', secColor: 'rgba(16,185,129,0.1)', secTextColor: '#10b981', img: 'img/logo.png' },
  { name: 'دينا الطيب محمد', major: 'الإعلام والتواصل', year: 'السنة الثالثة', sec: 'إعلامية', secColor: 'rgba(239,68,68,0.1)', secTextColor: '#ef4444', img: 'img/logo.png' },
  { name: 'طارق صلاح أحمد', major: 'العلاقات الدولية', year: 'دراسات عليا', sec: 'خارجية', secColor: 'rgba(245,158,11,0.1)', secTextColor: '#d97706', img: 'img/logo.png' },
  { name: 'سارة أحمد الفاضل', major: 'إدارة الأعمال', year: 'السنة الثالثة', sec: 'خارجية', secColor: 'rgba(245,158,11,0.1)', secTextColor: '#d97706', img: 'img/logo.png' },
  { name: 'حسام الدين موسى', major: 'الاقتصاد', year: 'السنة الرابعة', sec: 'مالية', secColor: 'rgba(16,185,129,0.1)', secTextColor: '#10b981', img: 'img/logo.png' },
];

function renderMembers(filtered) {
  const grid = document.getElementById('membersGrid');
  if (!grid) return;
  
  grid.innerHTML = filtered.map(m => `
    <div class="member-card">
      <div class="member-photo"><img src="${m.img}" alt="${m.name}" loading="lazy"></div>
      <div class="member-info">
        <h4>${m.name}</h4>
        <div class="major">${m.major} | ${m.year}</div>
        <span class="member-sec-badge" style="background:${m.secColor};color:${m.secTextColor}">${m.sec}</span>
      </div>
    </div>
  `).join('');
}

renderMembers(membersData);

window.filterMembers = function() {
  const q = document.getElementById('memberSearch')?.value.toLowerCase() || '';
  const sec = document.getElementById('secFilter')?.value || '';
  const year = document.getElementById('yearFilter')?.value || '';
  
  const filtered = membersData.filter(m => {
    const matchQ = !q || m.name.includes(q) || m.major.includes(q);
    const matchSec = !sec || m.sec.includes(sec);
    const matchYear = !year || m.year.includes(year);
    return matchQ && matchSec && matchYear;
  });
  renderMembers(filtered);
};

/* ============================================================
   GALLERY FILTER & LIGHTBOX
   ============================================================ */
const galleryImages = [
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80',
  'https://images.unsplash.com/photo-1507501336603-6e31db2be093?w=1200&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80',
  'https://images.unsplash.com/photo-1468254095679-bbcba94a7066?w=1200&q=80',
];

let currentLightboxIdx = 0;

window.filterGallery = function(cat, btn) {
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
  });
};

window.openLightbox = function(idx) {
  currentLightboxIdx = idx;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    lightboxImg.src = galleryImages[idx];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeLightbox = function() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.closeLightboxBg = function(e) {
  if (e.target === document.getElementById('lightbox')) {
    window.closeLightbox();
  }
};

window.changeLightbox = function(dir) {
  currentLightboxIdx = (currentLightboxIdx + dir + galleryImages.length) % galleryImages.length;
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightboxImg) {
    lightboxImg.src = galleryImages[currentLightboxIdx];
  }
};

// Keyboard navigation for lightbox
document.addEventListener('keydown', e => {
  const lightbox = document.getElementById('lightbox');
  if (lightbox && lightbox.classList.contains('open')) {
    if (e.key === 'ArrowLeft') window.changeLightbox(1);
    if (e.key === 'ArrowRight') window.changeLightbox(-1);
    if (e.key === 'Escape') window.closeLightbox();
  }
});

/* ============================================================
   STRUCTURE & EVENTS FILTER
   ============================================================ */
window.switchStructurePanel = function(panelId, btn) {
  // Remove active from all structure nav links
  document.querySelectorAll('.structure-nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active to clicked button
  if (btn) btn.classList.add('active');
  
  // Hide all structure panels
  document.querySelectorAll('.structure-panel').forEach(panel => {
    panel.style.display = 'none';
  });
  
  // Show target panel
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) {
    targetPanel.style.display = 'block';
  }
};

window.filterEvents = function(type, btn) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  document.querySelectorAll('.event-card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
  });
};

/* ============================================================
   GUIDELINES TABS
   ============================================================ */
window.switchGuidePanel = function(panelId, btn) {
  // Remove active from all guide nav links
  document.querySelectorAll('.guide-nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active to clicked button
  if (btn) btn.classList.add('active');
  
  // Hide all guide panels
  document.querySelectorAll('.guide-panel').forEach(panel => {
    panel.style.display = 'none';
  });
  
  // Show target panel with class toggle for animations
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) {
    targetPanel.style.display = 'block';
    targetPanel.classList.add('active');
    
    // Refresh observer for animations
    setTimeout(() => {
      if (window.refreshGuideObserver) window.refreshGuideObserver(targetPanel);
    }, 100);
  }
};

/* ============================================================
   MINI CALENDAR
   ============================================================ */
function renderMiniCal() {
  const cal = document.getElementById('miniCal');
  if (!cal) return;
  
  const days = ['ح', 'إ', 'ث', 'أر', 'خ', 'ج', 'س'];
  const eventDays = [15, 20, 22];
  let html = days.map(d => `<div class="cal-day-name">${d}</div>`).join('');
  
  const startDay = 0; // Sunday
  const totalDays = 31;
  
  for (let i = 0; i < startDay; i++) html += `<div></div>`;
  
  for (let d = 1; d <= totalDays; d++) {
    const isToday = d === 10;
    const hasEvent = eventDays.includes(d);
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">${d}</div>`;
  }
  
  cal.innerHTML = html;
}

renderMiniCal();

/* ============================================================
   FORM SUBMISSIONS
   ============================================================ */
window.submitReg = function(e) {
  if (e) e.preventDefault();
  alert('✅ تم إرسال طلب الانضمام بنجاح! سيتواصل معك فريق الاتحاد خلال 48 ساعة.');
};

window.submitContact = function(e) {
  if (e) e.preventDefault();
  
  const name = document.getElementById('cName')?.value;
  const email = document.getElementById('cEmail')?.value;
  const msg = document.getElementById('cMsg')?.value;
  
  if (!name || !email || !msg) {
    alert('⚠️ يرجى ملء جميع الحقول المطلوبة');
    return;
  }
  
  const successMsg = document.getElementById('successMsg');
  if (successMsg) {
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 5000);
  }
  
  // Clear form
  const cName = document.getElementById('cName');
  const cEmail = document.getElementById('cEmail');
  const cMsg = document.getElementById('cMsg');
  
  if (cName) cName.value = '';
  if (cEmail) cEmail.value = '';
  if (cMsg) cMsg.value = '';
};

window.subscribeNewsletter = function(e) {
  if (e) e.preventDefault();
  alert('✅ تم اشتراكك بنجاح في النشرة البريدية!');
};

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
      
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    }
  });
});

/* ============================================================
   ARTICLE READER MODAL
   ============================================================ */
const articlesFullText = {
  "study-prep": {
    title: "تجربتي في الحصول على منحة البحث العلمي في",
    body: "عندما قررت التقدم لمنحة CIU للبحث العلمي، كنت أعلم أن الطريق لن يكون سهلاً، لكن مع التنظيم والإصرار تحولت الرحلة إلى تجربة تعليمية قيّمة. في مرحلة الأوراق، كانت الدقة هي مفتاح النجاح، فلم أترك ورقة تنقصني من شهادات أكاديمية وخطابات توصية وسيرة ذاتية محدثة وكشف درجات، ورتبت كل شيء في ملف PDF واحد وراجعت كل متطلب ثلاث مرات. أما الأطروحة (البروبوزال) فكانت قلب المنحة، حيث اخترت موضوعاً يربط بين تخصصي واحتياجات السوق، وكتبت مقدمة قوية وأهدافاً محددة ومنهجية واضحة، والمناطق الذهبية هنا هي أن تجعل مقترحك يحل مشكلة حقيقية وتظهر شغفك بالبحث. بالنسبة للمقابلة الشخصية، حضرت لها وكأنها امتحان، وتدربت على الأسئلة الشائعة مثل سبب اختيار هذا التخصص وكيفية الاستفادة من المنحة وخطة العودة، وكنت صادقاً ومباشراً مع الحرص على ارتداء ملابس مناسبة والتأكد من اتصال الإنترنت إن كانت المقابلة أونلاين. وأخيراً، من المناطق الذهبية التي لم يخبرني بها أحد أن مراسلة أساتذة الجامعة قبل التقديم تزيد فرصك كثيراً، وطلب مراجعة الأطروحة من أستاذ سابق أو زميل متمرس يصنع فرقاً كبيراً، والنتيجة كانت حصولي على المنحة، وإلى اليوم أشكر الله على كل لحظة في هذه الرحلة."
  },
  "culture-identity": {
    title: "الهوية الثقافية في الغربة",
    body: `الاغتراب ليس مجرد تغيير للعنوان بل هو اختبار للهوية، وكم من سوداني في المهجر يشعر بالانتماء لوطنه لكنه يخشى أن تذوب ثقافته في بحر الغربة، لذلك للحفاظ على التراث السوداني وتمريره للأجيال القادمة في بيئة متنوعة نبدأ باللغة حيث العربية السودانية واللهجة الدارجة هما وعاء التراث، فتحدث مع أطفالك باللهجة السودانية في البيت وشاركهم الأغاني الشعبية والأمثال مثل العجلة من الشيطان و"السمك يموت من راسه"، ثم الطعام السوداني فالكبدة والعصيدة والتمية ليست مجرد أكل بل هي ذاكرة، لذا خصص يوماً شهرياً لطهي وجبة سودانية تقليدية ودع الأطفال يشاركون في التحضير، وأيضاً المناسبات والأعياد حيث يمكنك الاحتفال بالاستقلال والمولد النبوي والعيدين بالطريقة السودانية من لحم ورقاص وحناء للبنات وقصة من التراث قبل النوم، ولا تنس القصص والحكايات فالجدات لم يعُدن موجودات في الغربة لكنك تستطيع أن تكون أنت الراوي وتحكي لأطفالك قصص أبو زيد الهلالي والسندباد بطريقة مبسطة، وأخيراً الموسيقى والرقص فدع أطفالك يستمعوا لمحمد وردي وحقي عبد القادر وعلمهم الرقص بالطاقية في الأفراح، والخلاصة أن الهوية ليست شيئاً نرتديه ونخلعه بل هي من نحن، وبجهود بسيطة ومستمرة سنصنع جيلاً سودانياً يحمل تراثه بفخر أينما حل.`
  },
  "research-journey": {
    title: "تجربتي في الحصول على منحة البحث العلمي في CIU",
    body: "عندما قررت التقدم لمنحة CIU للبحث العلمي كنت أعلم أن الطريق لن يكون سهلاً لكن مع التنظيم والإصرار تحولت الرحلة إلى تجربة تعليمية قيّمة، سأشارككم خلاصة تجربتي خطوة بخطوة، ففي مرحلة الأوراق كانت الدقة هي مفتاح النجاح حيث لم أترك ورقة تنقصني من شهادات أكاديمية وخطابات توصية وسيرة ذاتية محدثة وكشف درجات، ونصيحتي أن ترتب أوراقك في ملف واحد بصيغة PDF وتراجع كل متطلب ثلاث مرات، أما الأطروحة فهي قلب المنحة وقد اخترت موضوعاً يربط بين تخصصي واحتياجات السوق وكتبت مقدمة قوية وأهدافاً محددة ومنهجية واضحة، والمناطق الذهبية هنا هي أن تجعل مقترحك يحل مشكلة حقيقية وتظهر شغفك بالبحث، وفي المقابلة الشخصية حضرت لها وكأنها امتحان وتدربت على الأسئلة الشائعة مثل لماذا هذا التخصص وكيف ستستفيد من المنحة وما خطة عودتك، وكنت صادقاً ومباشراً وأهم نصيحة هي ارتداء ملابس مناسبة والتأكد من اتصال الإنترنت إن كانت المقابلة أونلاين، ومن المناطق الذهبية التي لم يخبرني بها أحد أن مراسلة أساتذة الجامعة قبل التقديم تزيد فرصك كثيراً كما أن طلب مراجعة الأطروحة من أستاذ سابق أو زميل متمرس يصنع فرقاً كبيراً، والنتيجة هي أنني حصلت على المنحة وإلى اليوم أشكر الله على كل لحظة في هذه الرحلة."
  }
};

function openArticle(key) {
  const modal = document.getElementById('articleModal');
  const title = document.getElementById('articleModalTitle');
  const body = document.getElementById('articleModalBody');
  const data = articlesFullText[key];
  if (!modal || !title || !body || !data) return;
  title.textContent = data.title;
  body.textContent = data.body;
  modal.classList.add('show');
  document.body.classList.add('dropdown-open');
}

function closeArticle(e) {
  if (e && e.target && e.currentTarget && e.target !== e.currentTarget && !e.target.classList.contains('article-modal__close')) return;
  const modal = document.getElementById('articleModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.classList.remove('dropdown-open');
}

/* ============================================================
   INITIALIZE ALL ON DOM CONTENT LOADED
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('SSU - CIU Website Loaded Successfully');
  
  // Initialize any additional components
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  
  // Ensure all guide panels are properly observed
  document.querySelectorAll('.guide-panel').forEach(panel => {
    observer.observe(panel);
  });
});
function openDropdownMenu() {
    dropdownMenu.classList.add('active');
    document.body.classList.add('dropdown-open'); // أضف هذا السطر
    document.body.style.overflow = 'hidden';
}
function closeDropdownMenu() {
    dropdownMenu.classList.remove('active');
    document.body.classList.remove('dropdown-open'); // أضف هذا السطر
    document.body.style.overflow = '';
}
