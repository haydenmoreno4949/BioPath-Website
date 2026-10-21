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