/**
 * BIOPATH INTERACTIVE LOGIC
 * Features: Mobile sidebar toggle, degree filters, search, tab filtering, and modal drawer.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const searchInput = document.getElementById('searchInput');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const degreeChips = document.querySelectorAll('.degree-chip');
    const careerCards = document.querySelectorAll('.career-card');
    const filterIndicator = document.getElementById('filterIndicator');
    const activeDegreeName = document.getElementById('activeDegreeName');
    const clearDegreeFilter = document.getElementById('clearDegreeFilter');
    const navLinks = document.querySelectorAll('.nav-link');
  
    let activeDegree = 'all';
    let activeTab = 'all';
    let searchQuery = '';
  
    // 1. Mobile Sidebar Toggle
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }
  
    // Close mobile sidebar when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  
    // 2. Degree Filter Chips Logic
    degreeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        degreeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
  
        activeDegree = chip.getAttribute('data-degree');
  
        if (activeDegree !== 'all') {
          filterIndicator.style.display = 'flex';
          activeDegreeName.textContent = activeDegree;
        } else {
          filterIndicator.style.display = 'none';
        }
  
        applyFilters();
      });
    });
  
    // Clear Degree Filter Button
    if (clearDegreeFilter) {
      clearDegreeFilter.addEventListener('click', () => {
        activeDegree = 'all';
        filterIndicator.style.display = 'none';
        degreeChips.forEach(c => c.classList.remove('active'));
        document.querySelector('.degree-chip[data-degree="all"]').classList.add('active');
        applyFilters();
      });
    }
  
    // 3. Tab Filter Buttons Logic (All / High School / Bachelor's)
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
  
        activeTab = btn.getAttribute('data-tab');
        applyFilters();
      });
    });
  
    // 4. Real-time Search Input Logic
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
      });
    }
  
    // Master Filter Calculation Function
    function applyFilters() {
      careerCards.forEach(card => {
        const cardTier = card.getAttribute('data-tier');
        const cardDegrees = card.getAttribute('data-degrees') || '';
        const cardText = card.innerText.toLowerCase();
  
        // Check Tab condition
        const matchesTab = (activeTab === 'all') || (cardTier === activeTab);
  
        // Check Degree condition
        let matchesDegree = false;
        if (activeDegree === 'all') {
          matchesDegree = true;
        } else {
          // High School cards match all degree filters or specific degree requirements
          if (cardDegrees.includes('High School Diploma')) {
            matchesDegree = true;
          } else {
            const degreeList = cardDegrees.split(',').map(d => d.trim());
            matchesDegree = degreeList.includes(activeDegree);
          }
        }
  
        // Check Search Query condition
        const matchesSearch = (searchQuery === '') || cardText.includes(searchQuery);
  
        // Show or Hide card based on all conditions
        if (matchesTab && matchesDegree && matchesSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  
    // 5. Active Link Highlight on Scroll
    window.addEventListener('scroll', () => {
      let currentSection = 'hero';
      const sections = document.querySelectorAll('section');
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
          currentSection = section.getAttribute('id');
        }
      });
  
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    });
  
    // Close Modal on Escape Keypress
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  
    // Close Modal on Overlay Click
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
    }
    
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
  });
  
  // 6. Modal / Slide-over Drawer Functions
  function openModal(title, requirement, description, tier, skillsArray) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalReq = document.getElementById('modalReq');
    const modalDesc = document.getElementById('modalDesc');
    const modalTierBadge = document.getElementById('modalTierBadge');
    const modalSkills = document.getElementById('modalSkills');
  
    modalTitle.textContent = title;
    modalReq.textContent = requirement;
    modalDesc.textContent = description;
    modalTierBadge.textContent = tier;
  
    // Render Skill Pills
    modalSkills.innerHTML = '';
    if (skillsArray && skillsArray.length > 0) {
      skillsArray.forEach(skill => {
        const pill = document.createElement('span');
        pill.className = 'skill-pill';
        pill.textContent = skill;
        modalSkills.appendChild(pill);
      });
    }
  
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
  
  function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }