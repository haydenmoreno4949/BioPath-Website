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

  //maps
  // 1. Data Definitions from guide
const collegesData = [
  {
    name: "Rutgers New Brunswick",
    location: "New Brunswick, NJ",
    coords: [40.5008, -74.4474],
    acceptanceRate: "58%",
    cost: "$17,929/yr (In-state) | $37,441/yr (Out-of-state)",
    setting: "Large (15k+ students), City setting + Campus housing",
    requirements: "Initial transcripts, Mid-year transcript & test scores (optional)",
    majors: "Psychology, Biology, Exercise Science, Public Health, Bioengineering, etc."
  },
  {
    name: "NJIT",
    location: "Newark, NJ",
    coords: [40.7424, -74.1784],
    acceptanceRate: "67%",
    cost: "$22,426/yr (In-state) | $42,300/yr (Out-of-state)",
    setting: "Medium (up to 15k students), City setting",
    requirements: "Initial transcript, mid-year transcript, Teacher recommendation, Test scores (optional)",
    majors: "Biology, Chemical Engineering, Information Science, Biochemistry, Biophysics, etc."
  },
  {
    name: "Stevens Institute of Technology",
    location: "Hoboken, NJ",
    coords: [40.7448, -74.0256],
    acceptanceRate: "51%",
    cost: "$68,230/year",
    setting: "Medium (up to 15k students), Suburb setting",
    requirements: "Initial transcripts, teacher recommendation(s), mid year transcript",
    majors: "Bioengineering, Chemical Engineering, Biochemistry, Biology, Bioinformatics"
  },
  {
    name: "Princeton University",
    location: "Princeton, NJ",
    coords: [40.3487, -74.6593],
    acceptanceRate: "4%",
    cost: "$68,140/year",
    setting: "Medium (up to 15k students), City setting",
    requirements: "Initial transcripts, teacher recommendation(s) & mid year transcript",
    majors: "Biology, Psychology, Public Health, Bioengineering, Chemistry, Physics"
  }
  // Add remaining colleges from guide...
];

const companiesData = [
  {
    name: "Johnson and Johnson",
    region: "Central Jersey",
    location: "New Brunswick, NJ",
    coords: [40.4965, -74.4431],
    description: "Large biopharmaceutical company that sells prescription drugs and medical technology devices."
  },
  {
    name: "Bristol Myers Squibb (BMS)",
    region: "Central Jersey",
    location: "Lawrenceville, NJ",
    coords: [40.3010, -74.7313],
    description: "Large biopharmaceutical company that discovered, develops, and delivers medicines that treat serious diseases."
  },
  {
    name: "Novartis",
    region: "North Jersey",
    location: "East Hanover, NJ",
    coords: [40.8173, -74.3738],
    description: "Large biopharmaceutical company that researches, develops, manufactures, and markets innovative prescription medicines."
  },
  {
    name: "Bayer",
    region: "North Jersey",
    location: "Whippany, NJ",
    coords: [40.8243, -74.4168],
    description: "Large biotechnology company that focuses on healthcare and agriculture."
  },
  {
    name: "Enalare Therapeutics",
    region: "South Jersey",
    location: "Mullica Hill, NJ",
    coords: [39.7387, -75.2241],
    description: "Small biopharmaceutical company that focuses on developing therapeutics for life threatening respiratory conditions."
  }
  // Add remaining companies from guide...
];

// 2. Leaflet Map Setup
let map;
let markersLayerGroup = L.layerGroup();

function initMap() {
  // Center map on New Jersey coordinates [lat, lng] at zoom level 8
  map = L.map('map').setView([40.0583, -74.4057], 8);

  // Add OpenStreetMap tile layer (from Leaflet Quick Start)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  markersLayerGroup.addTo(map);
}

// 3. Navigation & Screen Switching Logic
function showMap(type) {
  document.getElementById('selection-view').classList.add('hidden');
  document.getElementById('map-view').classList.remove('hidden');

  const titleElem = document.getElementById('page-title');
 
  if (!map) {
    initMap();
  }

  // Clear previous pins
  markersLayerGroup.clearLayers();

  if (type === 'colleges') {
    titleElem.innerText = 'Colleges';
    loadColleges();
  } else if (type === 'companies') {
    titleElem.innerText = 'Companies';
    loadCompanies();
  }

  // Trigger Leaflet resize recalculation when shown
  setTimeout(() => map.invalidateSize(), 100);
}

function showSelection() {
  document.getElementById('map-view').classList.add('hidden');
  document.getElementById('selection-view').classList.remove('hidden');
  document.getElementById('page-title').innerText = 'Map Selection';
}

// 4. Populate Markers
function loadColleges() {
  collegesData.forEach((college, index) => {
    const marker = L.marker(college.coords);
   
    // Tooltip on hover
    marker.bindTooltip(`<b>${college.name}</b>`, { direction: 'top' });

    // Popup on click with "See More Info" button
    const popupContent = `
      <div style="text-align: center;">
        <strong>${college.name}</strong><br/>
        <small>${college.location}</small><br/>
        <button class="more-info-btn" onclick="openCollegeModal(${index})">See More Info</button>
      </div>
    `;
    marker.bindPopup(popupContent);
    markersLayerGroup.addLayer(marker);
  });
}

function loadCompanies() {
  companiesData.forEach((company, index) => {
    const marker = L.marker(company.coords);
   
    marker.bindTooltip(`<b>${company.name}</b>`, { direction: 'top' });

    const popupContent = `
      <div style="text-align: center;">
        <strong>${company.name}</strong><br/>
        <small>${company.region} - ${company.location}</small><br/>
        <button class="more-info-btn" onclick="openCompanyModal(${index})">See More Info</button>
      </div>
    `;
    marker.bindPopup(popupContent);
    markersLayerGroup.addLayer(marker);
  });
}

// 5. Modal Logic for Detailed Info View
function openCollegeModal(index) {
  const college = collegesData[index];
  document.getElementById('modal-title').innerText = college.name;
  document.getElementById('modal-body').innerHTML = `
    <p><strong>Location:</strong> ${college.location}</p>
    <p><strong>Acceptance Rate:</strong> ${college.acceptanceRate}</p>
    <p><strong>Cost:</strong> ${college.cost}</p>
    <p><strong>Campus Setting:</strong> ${college.setting}</p>
    <p><strong>Application Requirements:</strong> ${college.requirements}</p>
    <p><strong>Science Majors Offered:</strong> ${college.majors}</p>
  `;
  document.getElementById('info-modal').classList.remove('hidden');
}

function openCompanyModal(index) {
  const company = companiesData[index];
  document.getElementById('modal-title').innerText = company.name;
  document.getElementById('modal-body').innerHTML = `
    <p><strong>Region:</strong> ${company.region}</p>
    <p><strong>Location:</strong> ${company.location}</p>
    <p><strong>Description:</strong> ${company.description}</p>
  `;
  document.getElementById('info-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('info-modal').classList.add('hidden');
}
        <section id="hero" class="hero-section">
        <div class="hero-content">
          <span class="section-tagline">Navigating Life Sciences</span>
          <h1 class="hero-title">Search Career Paths</h1>
          <p class="hero-description">
            Explore biotechnology career profiles organized into 5 primary industry sectors. Search for specific roles or scroll through the sector columns below.
          </p>
          <div class="hero-actions">
            <a href="#careers" class="btn btn-primary">Explore Careers <i class="fa-solid fa-arrow-right"></i></a>
            <a href="#degrees" class="btn btn-secondary">Filter by Degree</a>
          </div>
        </div>
      </section>