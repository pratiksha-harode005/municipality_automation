export const initialMunicipalData = {
  info: {
    name: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    tagline: "Namma Bengaluru - Empowering Citizens through Smart Governance, Lake Conservation & World-Class Civic Infrastructure.",
    phone: "(080) 2297 5555 / (080) 2266 0000",
    emergencyPhone: "1533 (BBMP 24/7 Helpline) / 112 (Namma Emergency)",
    email: "contact@bbmp.gov.in / commissioner@bbmp.gov.in",
    address: "Joint Commissioner of Revenue, NR Square, GBA, Bengaluru",
    hours: "Mon - Sat: 10:00 AM - 5:30 PM (2nd & 4th Saturdays Closed)",
    alertMessage: "NOTICE: BBMP Property Tax Online Portal (SAS e-Khata System) 5% Rebate Scheme active for FY 2026-27.",
  },

  heroSlides: [
    {
      id: 'slide-1',
      url: '/bbmp-council-building.png',
      title: 'BBMP Central Council Building',
      location: 'Hudson Circle, Central Bengaluru'
    },
    {
      id: 'slide-2',
      url: '/bbmp-head-office.png',
      title: 'BBMP Head Office Secretariat',
      location: 'Hudson Circle / N.R. Square, Bengaluru'
    },
    {
      id: 'slide-3',
      url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1920&q=80',
      title: 'Vidhana Soudha Secretariat',
      location: 'Dr. Ambedkar Veedhi'
    },
    {
      id: 'slide-4',
      url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80',
      title: 'Bengaluru Town Hall',
      location: 'Hudson Circle'
    },
    {
      id: 'slide-5',
      url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1920&q=80',
      title: 'Cubbon Park Canopy',
      location: 'Kasturba Road'
    }
  ],

  services: [
    {
      id: "srv-1",
      slug: "road-streetlights",
      title: "1. Road & Streetlight Complaints",
      category: "Public Works",
      description: "Report road potholes (FixMyCity), broken streetlights, fallen tree branches, and damaged Tender SURE footpaths.",
      icon: "Wrench",
      link: "/services#road-streetlights"
    },
    {
      id: "srv-2",
      slug: "birth-death",
      title: "2. Birth & Death Certificates",
      category: "Vital Records",
      description: "Apply step-by-step for new Birth/Death certificates or search & download existing issued e-Certificates.",
      icon: "FileCheck",
      link: "/services#birth-death"
    },
    {
      id: "srv-3",
      slug: "water-sewerage",
      title: "3. Water & Sewerage Services",
      category: "Utilities & Water",
      description: "Pay monthly BWSSB water bills online, request new domestic/commercial water meter connections, and report sewage blockages.",
      icon: "Droplets",
      link: "/services#water-sewerage"
    },
    {
      id: "srv-4",
      slug: "waste-sanitation",
      title: "4. Waste Management & Sanitation",
      category: "Public Sanitation",
      description: "Track ward door-to-door auto-tipper garbage pickup schedules, locate dry waste processing centers, and request bulk waste pickup.",
      icon: "Truck",
      link: "/services#waste-sanitation"
    },
  ],

  // Backend Master Registry: Service-to-Department Routing Mapping
  serviceDepartmentRoutingRegistry: {
    'road-streetlights': {
      serviceName: '1. Road & Streetlight Complaints',
      department: 'Civil Department',
      departmentId: 'dept-civil',
      code: 'CIVIL-DEPT',
      isForm: true
    },
    'water-sewerage': {
      serviceName: '2. Water & Sewerage Services',
      department: 'Civil Department',
      departmentId: 'dept-civil',
      code: 'CIVIL-DEPT',
      isForm: true
    },
    'waste-sanitation': {
      serviceName: '3. Waste Management & Sanitation',
      department: 'Civil Department',
      departmentId: 'dept-civil',
      code: 'CIVIL-DEPT',
      isForm: true
    },
    'birth-death': {
      serviceName: '4. Birth & Death Certificates',
      department: 'Medical Department',
      departmentId: 'dept-medical',
      code: 'MEDICAL-DEPT',
      isForm: true
    }
  },

  // Database Collection 1: Department Registry (Civil & Medical Departments)
  departments: [
    { 
      id: 'dept-civil', 
      name: 'Civil Department', 
      slug: 'civil-department',
      code: 'CIVIL-DEPT', 
      head: 'Er. Rajesh Kumar (Chief Engineer)',
      description: 'Executive department responsible for public works, FixMyCity road repairs, streetlights, bridges, water supply pipelines, sewerage utilities, and solid waste sanitation management.',
      email: 'chief.civil@bbmp.gov.in',
      phone: '080-22975500',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      wings: ['Roads & Streetlights Wing', 'Water & Sewerage Utility Wing', 'Solid Waste Sanitation Wing']
    },
    { 
      id: 'dept-medical', 
      name: 'Medical Department', 
      slug: 'medical-department',
      code: 'MEDICAL-DEPT', 
      head: 'Dr. Ananya Sharma (Chief Medical Officer & Registrar)',
      description: 'Public health and registration department responsible for institutional & home Birth and Death e-Certificates, vital statistics registration, and municipal hospital health governance.',
      email: 'chief.medical@bbmp.gov.in',
      phone: '080-22975580',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      wings: ['Vital Statistics & Birth/Death Registration', 'Public Health & Immunization Wing']
    }
  ],

  // Database Collection 2: Ward / Zone Registry
  wards: [
    { id: 'ward-112', code: 'W-112', name: 'Ward 112 (Malleshwaram)', zone: 'West Zone' },
    { id: 'ward-174', code: 'W-174', name: 'Ward 174 (HSR Layout)', zone: 'South Zone' },
    { id: 'ward-84', code: 'W-84', name: 'Ward 84 (Indiranagar)', zone: 'East Zone' },
    { id: 'ward-04', code: 'W-04', name: 'Ward 04 (Yelahanka Town)', zone: 'North Zone' }
  ],

  // Database Collection 3: Authorized Officers & Service Authorizations
  officers: [
    {
      id: 'user-officer-1',
      fullName: 'Er. Rajesh Kumar',
      email: 'officer.ward112@bbmp.gov.in',
      departmentId: 'dept-civil',
      department: 'Civil Department',
      wardId: 'ward-112',
      wardName: 'Ward 112 (Malleshwaram)',
      assignedService: '1. Road & Streetlight Complaints',
      authorizedServiceKeys: ['road-streetlights'],
      role: 'officer',
      status: 'active'
    },
    {
      id: 'user-officer-2',
      fullName: 'Er. Suresh Gowda',
      email: 'officer.water@bbmp.gov.in',
      departmentId: 'dept-civil',
      department: 'Civil Department',
      wardId: 'ward-84',
      wardName: 'Ward 84 (Indiranagar)',
      assignedService: '2. Water & Sewerage Services',
      authorizedServiceKeys: ['water-sewerage'],
      role: 'officer',
      status: 'active'
    },
    {
      id: 'user-officer-3',
      fullName: 'Sri Ramesh Patil',
      email: 'officer.sanitation@bbmp.gov.in',
      departmentId: 'dept-civil',
      department: 'Civil Department',
      wardId: 'ward-174',
      wardName: 'Ward 174 (HSR Layout)',
      assignedService: '3. Waste Management & Sanitation',
      authorizedServiceKeys: ['waste-sanitation'],
      role: 'officer',
      status: 'active'
    },
    {
      id: 'user-officer-4',
      fullName: 'Dr. Ananya Sharma',
      email: 'officer.vital@bbmp.gov.in',
      departmentId: 'dept-medical',
      department: 'Medical Department',
      wardId: 'ward-112',
      wardName: 'Ward 112 (Malleshwaram)',
      assignedService: '4. Birth & Death Certificates',
      authorizedServiceKeys: ['birth-death'],
      role: 'officer',
      status: 'active'
    },
    {
      id: 'user-officer-5',
      fullName: 'Dr. Vikram Hegde',
      email: 'officer.health@bbmp.gov.in',
      departmentId: 'dept-medical',
      department: 'Medical Department',
      wardId: 'ward-150',
      wardName: 'Ward 150 (Bellandur)',
      assignedService: '4. Birth & Death Certificates',
      authorizedServiceKeys: ['birth-death'],
      role: 'officer',
      status: 'active'
    },
    {
      id: 'user-officer-6',
      fullName: 'Er. Manjunath Swamy',
      email: 'officer.civil@bbmp.gov.in',
      departmentId: 'dept-civil',
      department: 'Civil Department',
      wardId: 'ward-all',
      wardName: 'All Wards (Central Headquarter)',
      assignedService: 'All Civil Services',
      authorizedServiceKeys: ['road-streetlights', 'water-sewerage', 'waste-sanitation'],
      role: 'officer',
      status: 'active'
    }
  ],

  // Database Collection 4: Assignments Log
  assignments: [],

  news: [
    {
      id: "news-1",
      slug: "bbmp-launches-namma-sas-e-khata",
      title: "BBMP Launches Digitized Namma SAS e-Khata Auto-Issuance Portal Across 243 Wards",
      category: "Digital Governance",
      date: "2026-08-12",
      author: "Office of the Chief Commissioner",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Bengaluru property owners can now generate and verify digitized e-Khata extracts online within 48 hours without visiting ward offices.",
      content: `BENGALURU – The Bruhat Bengaluru Mahanagara Palike (BBMP) Chief Commissioner officially inaugurated the upgraded Namma e-Khata digital portal today at BBMP Head Office, Hudson Circle.
The new system integrates GIS satellite property mapping with sub-registrar land records across all 243 wards, allowing seamless verification of Property Identification (PID) numbers.`
    },
    {
      id: "news-2",
      slug: "bengaluru-smart-city-lake-rejuvenation",
      title: "BBMP Allocates ₹350 Crore for Ulsoor & Bellandur Lake Wetland Rejuvenation",
      category: "Environment",
      date: "2026-08-01",
      author: "Lakes & Forestry Division",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Comprehensive eco-restoration project includes STP installations, bio-remediation floating islands, and 12km peripheral walking boardwalks.",
      content: `The BBMP Lakes Division has launched Phase II of the Bengaluru Wetland Restoration Project. Ulsoor Lake, Sankey Tank, and Agara Lake will undergo continuous water aeration, desilting, and planting of native aquatic flora.`
    },
    {
      id: "news-3",
      slug: "namma-clinic-expansion-program",
      title: "50 New Namma Health Clinics Opened Across Bengaluru East & South Zones",
      category: "Public Health",
      date: "2026-07-25",
      author: "BBMP Health Department",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Providing free doctor consultations, diagnostic lab tests, and essential medications to urban residents 6 days a week.",
      content: `Expanding primary healthcare access, BBMP has operationalized 50 additional Namma Clinics in Malleshwaram, Indiranagar, Jayanagar, and Whitefield ward sectors.`
    },
    {
      id: "news-4",
      slug: "tender-sure-road-expansion-drive",
      title: "Tender SURE Pedestrian Corridor Expansion Approved for MG Road & Brigade Road",
      category: "Infrastructure",
      date: "2026-07-18",
      author: "Public Works Engineering",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      excerpt: "State-of-the-art underground utility ducts, wide granite footpaths, and bollard-protected cycle tracks scheduled for completion.",
      content: `BBMP Engineering Department has awarded contracts for transforming 18 major arterial corridors under the Tender SURE infrastructure standard. Pedestrians will enjoy seamless granite walking pavements, dedicated bicycle lanes, LED streetlamps, and underground utility conduits.`
    },
    {
      id: "news-5",
      slug: "bbmp-solid-waste-dry-waste-hubs",
      title: "BBMP Installs Automated Dry Waste Collection & Composting Hubs Across 8 Zones",
      category: "Environment",
      date: "2026-07-05",
      author: "Solid Waste Management Division",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Empowering zero-waste neighborhood initiatives with daily segregated waste pickups and organic fertilizer distribution.",
      content: `The Solid Waste Management Division has operationalized 24 new Micro Processing Centers (MPCs) to process 1,200 metric tonnes of wet waste daily. Citizens participating in door-to-door waste segregation receive free organic compost packets for urban home gardening.`
    },
    {
      id: "news-6",
      slug: "bbmp-monsoon-flood-control-room",
      title: "24/7 AI-Enabled Flood Mitigation & Stormwater Drain Sensor Network Live",
      category: "Disaster Management",
      date: "2026-06-28",
      author: "Control Room & Disaster Cell",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Real-time water level telemetry sensors deployed along major SWD canals to dispatch emergency dewatering pumps automatically.",
      content: `BBMP Central Control Room has activated an integrated IoT sensor dashboard across 855 kilometers of primary and secondary stormwater drains (Rajakaluve). The system automatically triggers alert sirens and dispatches mobile dewatering pump trucks whenever water levels cross threshold marks.`
    }
  ],

  events: [
    {
      id: "evt-1",
      slug: "lalbagh-flower-show-2026",
      title: "Annual Lalbagh Independence Day Flower Show & Garden Expo",
      category: "Culture & Horticulture",
      month: "AUG",
      day: "20",
      year: "2026",
      time: "9:00 AM – 7:00 PM",
      location: "Lalbagh Glass House",
      address: "Mavalli, Bengaluru, Karnataka 560004",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Marvel at over 3.5 million floral displays inside the historic Lalbagh Glass House featuring floral replicas of Karnataka heritage monuments.",
      description: "Join BBMP Horticulture Division and the Department of Parks for Bengaluru's grandest floral festival at Lalbagh Glass House."
    },
    {
      id: "evt-2",
      slug: "bbmp-town-hall-citizen-forum",
      title: "BBMP Public Town Hall: Bengaluru Master Traffic & Mobility Plan 2030",
      category: "Government",
      month: "SEP",
      day: "08",
      year: "2026",
      time: "5:30 PM – 8:00 PM",
      location: "Bengaluru Town Hall Auditorium",
      address: "JC Road, Hudson Circle, Bengaluru",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Public interaction session with BBMP Chief Commissioner and traffic experts on Namma Metro integrations and suburban rail.",
      description: "All Bengaluru citizens, RWA representatives, and urban planners are invited to submit feedback on upcoming road grade separators."
    },
    {
      id: "evt-3",
      slug: "cubbon-park-green-marathon",
      title: "Cubbon Park Green Bengaluru 10K Run & Lake Awareness Drive",
      category: "Sports & Fitness",
      month: "SEP",
      day: "22",
      year: "2026",
      time: "6:00 AM – 10:00 AM",
      location: "Cubbon Park Bandstand",
      address: "Kasturba Road, Bengaluru",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
      excerpt: "A eco-friendly morning run through the lush canopy of Cubbon Park promoting urban tree preservation and clean lakes.",
      description: "Run for a greener Bengaluru! Free t-shirts, medals, organic refreshments, and saplings provided to all registered runners."
    },
    {
      id: "evt-4",
      slug: "bbmp-waste-segregation-workshop",
      title: "Zero Waste Neighborhood & Home Composting Demonstration",
      category: "Public Sanitation",
      month: "OCT",
      day: "12",
      year: "2026",
      time: "10:00 AM – 1:00 PM",
      location: "Malleshwaram Community Hall",
      address: "8th Main Road, Malleshwaram, Bengaluru",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Learn practical wet/dry waste segregation techniques and bio-composting methods from BBMP Solid Waste Management experts.",
      description: "Free home composting starter kits distributed to the first 200 resident attendees."
    }
  ],

  directory: [
    {
      id: "dir-1",
      slug: "bbmp-head-office-joint-commissioner-revenue",
      name: "BBMP Head Office (Joint Commissioner of Revenue)",
      category: "Government Offices",
      address: "Joint Commissioner of Revenue, NR Square, GBA, Bengaluru",
      phone: "(080) 2297 5555 / (080) 2266 0000",
      email: "commissioner@bbmp.gov.in",
      hours: "Mon - Sat: 10:00 AM - 5:30 PM (2nd & 4th Saturdays Closed)",
      image: "/bbmp-head-office.png",
      description: "Central administrative headquarters of Bruhat Bengaluru Mahanagara Palike housing the Joint Commissioner of Revenue, Chief Commissioner, and main revenue secretariat."
    },
    {
      id: "dir-2",
      slug: "state-central-library-cubbon-park",
      name: "State Central Library (Seshadri Iyer Memorial)",
      category: "Education & Culture",
      address: "Cubbon Park Campus, Bengaluru, Karnataka 560001",
      phone: "+91 (080) 2221-2402",
      email: "library@bbmp.gov.in",
      hours: "Tue - Sun: 8:30 AM - 7:30 PM (Mondays Closed)",
      image: "/state-central-library.png",
      description: "Historic red brick library building inside Cubbon Park holding over 300,000 reference books, digital archives, and quiet study halls."
    },
    {
      id: "dir-3",
      slug: "bbmp-referral-hospital-malleshwaram",
      name: "BBMP High-Tech Referral Hospital & Maternity Center",
      category: "Health Services",
      address: "18th Cross, Malleshwaram, Bengaluru, Karnataka 560003",
      phone: "+91 (080) 2334-1122",
      email: "health.malleshwaram@bbmp.gov.in",
      hours: "24/7 Emergency & In-Patient Services",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      description: "State-of-the-art municipal hospital providing free outpatient consultations, pediatric care, emergency trauma care, and diagnostic lab testing."
    },
    {
      id: "dir-4",
      slug: "bbmp-public-works-yard",
      name: "BBMP Tender SURE Engineering & Infrastructure Yard",
      category: "Infrastructure",
      address: "Rajajinagar Industrial Area, Bengaluru, Karnataka 560010",
      phone: "+91 (080) 2297-5540",
      email: "engineer@bbmp.gov.in",
      hours: "Mon - Sat: 9:00 AM - 5:00 PM",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      description: "Central machinery hub for road paving, underground utility duct maintenance, stormwater drain clearance, and street repair."
    },
    {
      id: "dir-5",
      slug: "cubbon-park-botanical-sanctuary",
      name: "Cubbon Park Botanical Sanctuary & Heritage Zone",
      category: "Parks & Recreation",
      address: "Kasturba Road, Sampangi Rama Nagar, Bengaluru 560001",
      phone: "+91 (080) 2286-4065",
      email: "parks.cubbon@bbmp.gov.in",
      hours: "Daily: 5:30 AM - 8:00 PM (Vehicle-Free Sundays)",
      image: "/cubbon-park-aerial.png",
      description: "300-acre green lung in the heart of Bengaluru featuring 6,000+ trees, bamboo groves, lotus ponds, and heritage monuments."
    },
    {
      id: "dir-6",
      slug: "bengaluru-town-hall",
      name: "Historic Bengaluru Town Hall (Sir K.P. Puttanna Chetty Hall)",
      category: "Public Safety & Governance",
      address: "JC Road, Hudson Circle, Bengaluru, Karnataka 560002",
      phone: "+91 (080) 2222-3344",
      email: "townhall@bbmp.gov.in",
      hours: "Mon - Sat: 9:00 AM - 6:00 PM",
      image: "/bengaluru-town-hall.png",
      description: "Neoclassical heritage civic building constructed in 1935 hosting municipal council sessions, public forums, and cultural conventions."
    },
    {
      id: "dir-7",
      slug: "lalbagh-botanical-gardens",
      name: "Lalbagh Botanical Garden & Glass House Grounds",
      category: "Parks & Recreation",
      address: "Mavalli, Bengaluru, Karnataka 560004",
      phone: "+91 (080) 2657-1921",
      email: "horticulture@bbmp.gov.in",
      hours: "Daily: 6:00 AM - 7:00 PM",
      image: "/lalbagh-glass-house.png",
      description: "240-acre botanical garden established in 1760 featuring a century-old Glass House, bonsai gardens, and serene lake."
    },
    {
      id: "dir-8",
      slug: "namma-clinic-wellness-hub",
      name: "BBMP Namma Clinic Urban Health Hub (Jayanagar)",
      category: "Health Services",
      address: "4th T Block, Jayanagar, Bengaluru, Karnataka 560041",
      phone: "+91 (080) 2297-5620",
      email: "nammaclinic@bbmp.gov.in",
      hours: "Mon - Sat: 9:00 AM - 4:30 PM",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      description: "Urban primary healthcare center offering free blood sugar testing, wellness counseling, vaccinations, and essential medicines."
    }
  ],

  documents: [
    {
      id: "doc-1",
      slug: "bbmp-fy2026-annual-budget",
      title: "BBMP Approved Annual Budget & Expenditure Allocation FY 2026-27",
      category: "Financial Reports",
      department: "Finance & Revenue",
      date: "2026-08-02",
      fileType: "PDF",
      fileSize: "12.4 MB",
      downloadUrl: "#download-budget",
      summary: "Official itemized municipal budget of ₹11,200 Crore covering Tender SURE roads, storm water drain desilting, and Namma Clinics."
    },
    {
      id: "doc-2",
      slug: "bbmp-e-khata-user-handbook",
      title: "BBMP SAS e-Khata Citizen Application & Verification Guide",
      category: "Citizen Services",
      department: "Revenue & Tax",
      date: "2026-07-20",
      fileType: "PDF",
      fileSize: "2.8 MB",
      downloadUrl: "#download-khata",
      summary: "Step-by-step instructions for property owners applying for digitized final e-Khata extracts online."
    },
    {
      id: "doc-3",
      slug: "bengaluru-master-plan-2030",
      title: "Bengaluru Master Urban Development & Land Use Plan 2030",
      category: "Planning & Zoning",
      department: "Town Planning Division",
      date: "2026-06-15",
      fileType: "PDF",
      fileSize: "18.5 MB",
      downloadUrl: "#download-masterplan",
      summary: "Zoning regulations, lake buffer zones, metro transit corridors, and green space conservation guidelines."
    }
  ],

  galleries: [
    {
      id: "gal-1",
      slug: "vidhana-soudha-heritage",
      title: "Vidhana Soudha & Assembly Complex",
      category: "Bengaluru Landmarks",
      date: "Aug 10, 2026",
      imageCount: 12,
      coverImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80",
      description: "Illuminated evening view of Karnataka's magnificent Neo-Dravidian state secretariat in central Bengaluru.",
      images: [
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "gal-2",
      slug: "cubbon-park-greenery",
      title: "Cubbon Park & Bamboo Sanctuaries",
      category: "Parks & Lakes",
      date: "Jul 28, 2026",
      imageCount: 10,
      coverImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
      description: "Lush morning walks, historic red buildings, and century-old tree canopies in Cubbon Park.",
      images: [
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "gal-3",
      slug: "lalbagh-glass-house-expo",
      title: "Lalbagh Flower Show & Botanical Glass House",
      category: "Horticulture",
      date: "Jan 26, 2026",
      imageCount: 15,
      coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80",
      description: "Vibrant flower sculptures and exotic botanical species inside Lalbagh's historic glass pavilion.",
      images: [
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "gal-4",
      slug: "bengaluru-smart-city-metro",
      title: "Bengaluru Smart City & Metro Corridors",
      category: "Infrastructure",
      date: "Jun 15, 2026",
      imageCount: 14,
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      description: "Modern Tender SURE pedestrian walkways, flyovers, and elevated Namma Metro corridors across Bengaluru.",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "gal-5",
      slug: "bengaluru-town-hall-civic-plaza",
      title: "Bengaluru Town Hall Civic Plaza",
      category: "Architecture",
      date: "May 20, 2026",
      imageCount: 9,
      coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
      description: "Historic Neoclassical town hall architecture and municipal convention grounds at Hudson Circle.",
      images: [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  ],

  people: [
    {
      id: "ppl-1",
      slug: "sri-maheshwar-rao-chief-commissioner",
      name: "Sri Maheshwar Rao M, I.A.S",
      position: "Chief Commissioner - GBA and Administrator - All Bengaluru City Corporations",
      department: "Greater Bengaluru Authority (GBA) & BBMP",
      portrait: "/maheshwar-rao.png",
      phone: "(080) 2297 5555 / (080) 2266 0000",
      email: "comm@bbmp.gov.in",
      bio: "Chief Executive Officer presiding over executive administration, civic infrastructure execution, zone administration, and municipal governance across Greater Bengaluru.",
      responsibilities: "Administrator of all Bengaluru City Corporations and Chief Executive Officer of GBA & BBMP."
    },
    {
      id: "ppl-2",
      slug: "shri-dk-shivakumar-dcm",
      name: "Shri. D.K. Shivakumar",
      position: "Hon'ble Deputy Chief Minister & Minister for Greater Bengaluru Development",
      department: "Government of Karnataka",
      portrait: "/dk-shivakumar.png",
      phone: "(080) 2225 1234",
      email: "dcm@karnataka.gov.in",
      bio: "Hon'ble Deputy Chief Minister guiding state policies, urban development, lake restoration, Metro corridors, and infrastructure growth for Greater Bengaluru.",
      responsibilities: "State leadership and Greater Bengaluru Development Portfolio."
    },
    {
      id: "ppl-3",
      slug: "sri-munish-moudgil-special-commissioner",
      name: "Sri Munish Moudgil, I.A.S",
      position: "Special Commissioner (Revenue & IT)",
      department: "Revenue & Information Technology",
      portrait: "/munish-moudgil.png",
      phone: "+91 (080) 2297-5520",
      email: "spcomm.revenue@bbmp.gov.in",
      bio: "Oversees BBMP property tax SAS e-Khata digital reforms, revenue collection, IT automation, and citizen service portals.",
      responsibilities: "Property tax collection, e-Khata digital verification, and IT governance."
    },
    {
      id: "ppl-4",
      slug: "sri-nitish-k-special-commissioner",
      name: "Sri Nitish K, I.A.S",
      position: "Special Commissioner (Health & Education) & Director of Municipal Administration",
      department: "Welfare, Health & Education",
      portrait: "/nitish-k.png",
      phone: "(080) 2266 0000",
      email: "spcomm.health@bbmp.gov.in",
      bio: "Supervises 243 ward-level Namma Clinics, GBA municipal primary & secondary schools, maternal & child health centers, and urban social welfare schemes.",
      responsibilities: "Namma Clinics execution, municipal education, maternal health, and Pulse Polio campaigns."
    },
    {
      id: "ppl-5",
      slug: "smt-sushama-godbole-special-commissioner",
      name: "Smt. Sushama Godbole, I.A.S",
      position: "Special Commissioner (FECCM, Election, Admin & Disaster Management)",
      department: "Admin & Disaster Management",
      portrait: "/sushama-godbole.jpg",
      phone: "+91 (080) 2297-5540",
      email: "spcomm.admin@bbmp.gov.in",
      bio: "Leads election administration, disaster management control room, public relations, and inter-departmental coordination.",
      responsibilities: "Emergency flood response, public relations, and municipal admin."
    },
    {
      id: "ppl-6",
      slug: "sri-venkatachalapathy-r-special-commissioner",
      name: "Sri Venkatachalapathy R, I.A.S",
      position: "Special Commissioner (Welfare, Health & Education)",
      department: "Welfare, Health & Education",
      portrait: "/venkatachalapathy.png",
      phone: "+91 (080) 2297-5550",
      email: "spcomm.health@bbmp.gov.in",
      bio: "Supervises BBMP Namma Clinics, public health infrastructure, school education programs, and social welfare schemes.",
      responsibilities: "Public health, Namma Clinics execution, and civic welfare."
    }
  ],

  departments: [
    {
      id: "dept-civil",
      slug: "civil-department",
      name: "Civil Department",
      fullName: "Civil & Public Works Infrastructure Department",
      code: "CIVIL-DEPT",
      head: "Er. Rajesh Kumar (Chief Engineer)",
      phone: "080-22975500",
      email: "chief.civil@bbmp.gov.in",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      description: "Executive department responsible for public works, FixMyCity road repairs, streetlights, bridges, water supply pipelines, sewerage utilities, and solid waste sanitation management.",
      wings: ["Roads & Streetlights Wing", "Water & Sewerage Utility Wing", "Solid Waste Sanitation Wing"],
      serviceIds: ["road-streetlights", "water-sewerage", "waste-sanitation"]
    },
    {
      id: "dept-medical",
      slug: "medical-department",
      name: "Medical Department",
      fullName: "Medical & Public Health Registration Department",
      code: "MEDICAL-DEPT",
      head: "Dr. Ananya Sharma (Chief Medical Officer & Registrar)",
      phone: "080-22975580",
      email: "chief.medical@bbmp.gov.in",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
      description: "Public health and vital statistics registration department responsible for institutional & home Birth and Death e-Certificates, health records, and municipal hospital health governance.",
      wings: ["Vital Statistics & Birth/Death Registration", "Public Health & Immunization Wing"],
      serviceIds: ["birth-death"]
    }
  ],

  contactMessages: [
    {
      id: "msg-1",
      date: "2026-08-11",
      name: "Srinivas Rao",
      email: "srao.blr@example.com",
      phone: "+91 98450 12345",
      subject: "Pothole repair request on 100 Feet Road, Indiranagar",
      message: "Respected Sir, there is a deep pothole near 100 Feet Road junction causing traffic congestion. Requesting BBMP FixMyCity team to inspect."
    }
  ],

  cityCorporations: [
    {
      id: "corp-1",
      slug: "bengaluru-central-city-corporation",
      name: "Bengaluru Central City Corporation",
      shortCode: "BCCC",
      headquarters: "Kempegowda Civic Hall, Annex 3, Kalinga Rao Road, Sampangirama Nagara, Bengaluru – 560002",
      wards: 63,
      area: "78 km²",
      voters: "14,25,676",
      constituencies: 6,
      founded: "September 2, 2025 (superseded BBMP)",
      governingLaw: "Greater Bengaluru Governance Act, 2024 (Karnataka Act No. 36 of 2025)",
      administrator: "M. Maheshwar Rao, IAS",
      municipalCommissioner: "Rajendra Cholan P., IAS",
      mayorStatus: "Vacant (since Sept 2, 2025)",
      votingSystem: "First-past-the-post",
      nextElection: "2026",
      zones: "Gandhinagar, Chickpet, Chamarajpet, Shivajinagar, Shantinagar",
      localities: [
        "Shivajinagar", "Tasker Town", "Commercial Street Market", "Sivanchetti Gardens", 
        "Halasuru (Ulsoor)", "Gandhi Nagar", "Vasanth Nagar", "Sampangirama Nagar", 
        "Shantala Nagar", "Chickpet", "Chamarajpet", "K.R. Market area", "Vivek Nagar", 
        "Austin Town", "Langford Town"
      ],
      landmarks: [
        "Vidhana Soudha (Karnataka Legislature)",
        "Cubbon Park (Sri Chamarajendra Park)",
        "UB City",
        "Bangalore Fort & Bangalore Pete (heritage core)",
        "Freedom Park",
        "M. Chinnaswamy Stadium",
        "St. Mark's Cathedral",
        "M.G. Road commercial belt"
      ],
      recentActivities: [
        { date: "Aug 14, 2026", title: "Comprehensive Sanitation & De-silting Drive", desc: "Special cleaning and sanitation drives conducted across K.R. Market area and commercial Pete corridors." },
        { date: "Aug 10, 2026", title: "Monsoon Emergency Response & Tree Clearance", desc: "Rapid tree-fall removal and clearance operations directed by BCCC disaster control cell." },
        { date: "Jul 28, 2026", title: "Civic & Environmental Awareness Assembly", desc: "Public awareness programs held at Lalbagh on civic cleanliness, wet waste segregation, and plastic ban." }
      ],
      phone: "+91 (080) 2297-5555",
      email: "central.corp@bbmp.gov.in",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
      overview: "Administrative jurisdiction overseeing Central Bengaluru's heritage commercial districts, the Vidhana Soudha precinct, and core revenue sectors. Covers the historic urban core of the city, founded by Kempegowda, and includes the city's central business district.",
      description: "Administrative jurisdiction overseeing Central Bengaluru heritage commercial districts, Vidhana Soudha precinct, and core revenue sectors."
    },
    {
      id: "corp-2",
      slug: "bengaluru-north-city-corporation",
      name: "Bengaluru North City Corporation",
      shortCode: "BNCC",
      headquarters: "Yelahanka Zonal Office, Yelahanka Civic Administrative Complex, Yelahanka, Bengaluru",
      wards: 72,
      area: "158 km²",
      constituencies: 7,
      founded: "September 2, 2025 (superseded BBMP)",
      governingLaw: "Greater Bengaluru Governance Act, 2024 (Karnataka Act No. 36 of 2025)",
      administrator: "M. Maheshwar Rao, IAS",
      municipalCommissioner: "Pommala Sunil Kumar, IAS",
      mayorStatus: "Vacant (since Sept 2, 2025)",
      votingSystem: "First-past-the-post",
      nextElection: "2026",
      phoneInProgramme: "Fridays, 11:00 AM – 1:00 PM (Live Commissioner Helpline)",
      zones: "Yelahanka, Malleshwaram, Hebbal, Byatarayanapura, Sarvagna Nagar, Dasarahalli",
      localities: [
        "Yelahanka", "Yelahanka Satellite Town", "Kempegowda", "Chowdeshwari", 
        "Atturu", "Aerocity (Ward No. 2)", "Hebbal", "Jakkur", "Sarvagna Nagar", 
        "Byatarayanapura", "Malleshwaram"
      ],
      landmarks: [
        "Kempegowda International Airport Highway Corridor",
        "Yelahanka Air Force Station",
        "Jakkur Lake & Aerodrome",
        "Malleshwaram Heritage District"
      ],
      recentActivities: [
        { date: "Aug 15, 2026", title: "Commissioner Weekly Citizen Phone-in Programme", desc: "Commissioner Pommala Sunil Kumar, IAS conducts Friday live phone-in (11 am–1 pm) resolving potholes, streetlight repair, garbage clearance, and e-Khata complaints." },
        { date: "Aug 12, 2026", title: "Sarvagna Nagar Waste Transfer & Mustering Inspection", desc: "Field inspections conducted at waste transfer stations and sanitation mustering centres across Sarvagna Nagar constituency." },
        { date: "Aug 02, 2026", title: "Ward No. 2 Renaming Notification: Aerocity", desc: "Ward No. 2 bordering Yelahanka Air Force Station officially designated and renamed as Aerocity ward." }
      ],
      phone: "+91 (080) 2334-1122",
      email: "north.corp@bbmp.gov.in",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
      overview: "Serves Northern Bengaluru's transit corridors, International Airport highway corridors, Malleshwaram heritage zones, and Yelahanka satellite town.",
      description: "Serves Northern Bengaluru transit corridors, International Airport highway corridors, Malleshwaram heritage zones, and Yelahanka satellite town."
    },
    {
      id: "corp-3",
      slug: "bengaluru-south-city-corporation",
      name: "Bengaluru South City Corporation",
      shortCode: "BSCC",
      headquarters: "Jayanagar Zonal Office, Jayanagar 4th Block Municipal Complex, Bengaluru",
      wards: 72,
      area: "147 km²",
      constituencies: 9,
      founded: "September 2, 2025 (superseded BBMP)",
      governingLaw: "Greater Bengaluru Governance Act, 2024 (Karnataka Act No. 36 of 2025)",
      administrator: "M. Maheshwar Rao, IAS",
      municipalCommissioner: "Ramesh K.N., IAS",
      mayorStatus: "Vacant (since Sept 2, 2025)",
      votingSystem: "First-past-the-post",
      nextElection: "2026",
      zones: "Jayanagar, BTM Layout, Padmanabhanagar, Basavanagudi, Bommanahalli, Anekal, Bangalore South",
      localities: [
        "Jayanagar (5th, 8th, 9th Block)", "JP Nagar (1st–4th Phase)", "BTM Layout (1st & 2nd Stage)", 
        "Madiwala", "Koramangala (5th & 8th Block)", "Adugodi", "Basavanagudi", 
        "Electronic City Corridor", "Silk Board Junction Area"
      ],
      landmarks: [
        "Basavanagudi Bull Temple & Bugle Rock Heritage Park",
        "Jayanagar Shopping Complex & 4th Block Civic Centre",
        "Central Silk Board Transit Junction",
        "Koramangala Commercial Hub & BTM Lake"
      ],
      recentActivities: [
        { date: "Aug 11, 2026", title: "Plastic Enforcement Drive & Fine Collection", desc: "BSCC environmental enforcement cell seized 1,300 kg of banned single-use plastic and collected ₹2.95 lakh in fines across Jayanagar and Koramangala commercial markets." },
        { date: "Aug 05, 2026", title: "Public Resident Interaction Assembly", desc: "Commissioner Ramesh K.N., IAS held interactive citizen forum with RWA representatives on SWD desilting, road asphalt repairs, and e-Khata processing." },
        { date: "Jul 22, 2026", title: "Civic Excellence Student Felicitation Event", desc: "BSCC felicitated high-performing municipal school students in a civic recognition event." }
      ],
      phone: "+91 (080) 2297-5530",
      email: "south.corp@bbmp.gov.in",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
      overview: "Governs Southern residential hubs, the Basavanagudi cultural precinct, Silk Board junction corridors, and Electronic City access zones.",
      description: "Governs Southern residential hubs, Basavanagudi cultural precinct, Silk Board junction corridors, and Electronic City access zones."
    },
    {
      id: "corp-4",
      slug: "bengaluru-east-city-corporation",
      name: "Bengaluru East City Corporation",
      shortCode: "BECC",
      headquarters: "Mahadevapura Zonal Office, Mahadevapura, Hoodi, Bengaluru",
      wards: 50,
      area: "168 km² (largest corporation by area)",
      constituencies: 2,
      founded: "September 2, 2025 (superseded BBMP)",
      governingLaw: "Greater Bengaluru Governance Act, 2024 (Karnataka Act No. 36 of 2025)",
      administrator: "M. Maheshwar Rao, IAS",
      municipalCommissioner: "Ramesh D.S., IAS",
      mayorStatus: "Vacant (since Sept 2, 2025)",
      votingSystem: "First-past-the-post",
      nextElection: "2026",
      zones: "Mahadevapura, K.R. Puram, Indiranagar, Whitefield, CV Raman Nagar, HAL, Domlur",
      localities: [
        "Indiranagar", "Whitefield", "Mahadevapura", "K.R. Puram", "HAL", 
        "Domlur", "Kadugodi", "Panathur", "Varthur", "Devarabisanahalli", 
        "Thubarahalli", "Hope Farm Junction"
      ],
      landmarks: [
        "International Tech Park Bengaluru (ITPB Whitefield)",
        "Outer Ring Road IT Business Corridor",
        "Indiranagar 100 Feet Road Commercial Belt",
        "HAL Heritage Aerospace Complex & Varthur Lake"
      ],
      recentActivities: [
        { date: "Aug 13, 2026", title: "Flood Hotspot & SWD Drain Inspection", desc: "Commissioner D.S. Ramesh, IAS inspected flood hotspots across Panathur, Varthur, Devarabisanahalli, Thubarahalli, and Hope Farm Junction, ordering urgent stormwater drain desilting." },
        { date: "Aug 08, 2026", title: "Road Widening via TDR Fast-Tracking", desc: "BECC Engineering Division fast-tracked key IT corridor road widening schemes utilizing Transferable Development Rights (TDR)." },
        { date: "Jul 30, 2026", title: "Fix My Street Pothole Repair Blitz", desc: "Instructed zonal engineers to prioritize pothole complaints logged via the Fix My Street app and traffic police notifications." }
      ],
      phone: "+91 (080) 2297-5540",
      email: "east.corp@bbmp.gov.in",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      overview: "Manages Eastern IT innovation corridors, Whitefield tech parks, Outer Ring Road business zones, and Indiranagar commercial sectors.",
      description: "Manages Eastern IT innovation corridors, Whitefield tech parks, Outer Ring Road business zones, and Indiranagar commercial sectors."
    },
    {
      id: "corp-5",
      slug: "bengaluru-west-city-corporation",
      name: "Bengaluru West City Corporation",
      shortCode: "BWCC",
      headquarters: "Rajajinagar 1st Block Municipal Complex / Dasarahalli Zonal Office, Bengaluru",
      officialPortal: "bengaluruwest.karnataka.gov.in",
      wards: 112,
      area: "164 km²",
      constituencies: 10,
      founded: "September 2, 2025 (superseded BBMP)",
      governingLaw: "Greater Bengaluru Governance Act, 2024 (Karnataka Act No. 36 of 2025)",
      administrator: "M. Maheshwar Rao, IAS",
      municipalCommissioner: "Dr. Rajendra K.V., IAS (Current) / Vasanth Kumar R., IAS (Former)",
      mayorStatus: "Vacant (since Sept 2, 2025)",
      votingSystem: "First-past-the-post",
      nextElection: "2026",
      zones: "Rajajinagar, Govindarajangar, Vijayanagar, Bangalore University, Yeshwanthpur, Dasarahalli, RR Nagar",
      localities: [
        "Rajajinagar", "Malleshwaram", "Basaveshwaranagar", "Kengeri", 
        "Dasarahalli", "Yeshwanthpura", "Vijayanagar", "Tumkur Road Industrial Belt"
      ],
      landmarks: [
        "Rajajinagar Industrial Estate & ISKCON Temple Bengaluru",
        "Bangalore University Jnana Bharathi Campus",
        "Yeshwanthpur APMC Market & Railway Terminal",
        "Kempabudhi Lake & NR Colony Heritage Belt"
      ],
      recentActivities: [
        { date: "Aug 14, 2026", title: "NR Colony & Kempabudhi Lake Inspection Drive", desc: "Commissioner Dr. Rajendra K.V., IAS inspected Basavanagudi mustering point, NR Colony footpaths, maternity hospital, and Kempabudhi Lake restoration." },
        { date: "Aug 06, 2026", title: "Tumkur Road Industrial Estate SWD Inspection", desc: "Engineering division conducted major desilting and stormwater drain clearance along the Tumkur Road industrial corridor." },
        { date: "Jul 25, 2026", title: "Civic Services Drive for 112 Wards", desc: "Special civic services drive organized across all 112 wards for e-Khata verification, building plan sanctions, and trade license renewals." }
      ],
      phone: "+91 (080) 2297-5580",
      email: "west.corp@bbmp.gov.in",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      overview: "Covers Western industrial estates, Rajajinagar residential sectors, Yeshwanthpur market yards, and Bangalore University green campus.",
      description: "Covers Western industrial estates, Rajajinagar residential sectors, Yeshwanthpur market yards, and Bangalore University green campus."
    }
  ],

  citizenServiceRequests: [
    {
      id: "MUN-2026-992014",
      citizenId: "user-citizen-1",
      citizenName: "Smt. Kavitha R.",
      citizenEmail: "citizen@bbmp.gov.in",
      serviceId: "road-streetlights",
      serviceName: "1. Road & Streetlight Complaints",
      departmentId: "dept-pwd",
      department: "Public Works / Electrical Department",
      wardId: "ward-112",
      wardName: "Ward 112 (Malleshwaram)",
      submissionDate: "May 10, 2026",
      status: "In Progress",
      stage: "Stage 3 of 4: In Progress (Work Order Dispatched)",
      assignedOfficerId: "user-officer-1",
      assignedOfficerName: "Er. Rajesh Kumar",
      assignedOfficerEmail: "officer.ward112@bbmp.gov.in",
      evidenceName: "pothole_8th_main.jpg",
      evidenceType: "image",
      evidenceSize: "2.4 MB",
      evidenceDataUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      payload: {
        complaintType: "Pothole & Asphalt Damage",
        location: "8th Main Road, Near Malleshwaram Circle",
        description: "Deep asphalt crater causing traffic bottleneck and accident risk during rains."
      },
      statusHistory: [
        {
          historyId: "HIS-992014-1",
          previousStatus: null,
          newStatus: "Submitted",
          updatedBy: "Smt. Kavitha R.",
          updatedByRole: "citizen",
          updatedAt: "2026-05-10T10:30:00.000Z",
          remarks: "Grievance submitted online via Citizen Portal."
        },
        {
          historyId: "HIS-992014-2",
          previousStatus: "Submitted",
          newStatus: "Under Verification",
          updatedBy: "Er. Rajesh Kumar",
          updatedByRole: "officer",
          updatedAt: "2026-05-11T14:15:00.000Z",
          remarks: "Field inspection completed. Assigned to road contractor team."
        },
        {
          historyId: "HIS-992014-3",
          previousStatus: "Under Verification",
          newStatus: "In Progress",
          updatedBy: "Er. Rajesh Kumar",
          updatedByRole: "officer",
          updatedAt: "2026-05-12T09:00:00.000Z",
          remarks: "Asphalt patch work scheduled tonight at 11:00 PM."
        }
      ]
    },
    {
      id: "MUN-2026-881023",
      citizenId: "user-citizen-pratiksha",
      citizenName: "Pratiksha",
      citizenEmail: "pratiksha@bbmp.gov.in",
      serviceId: "water-sewerage",
      serviceName: "3. Water & Sewerage Services",
      departmentId: "dept-water",
      department: "Water & Sewerage Department",
      wardId: "ward-112",
      wardName: "Ward 112 (Malleshwaram)",
      submissionDate: "Aug 15, 2026",
      status: "Under Verification",
      stage: "Stage 2 of 4: Under Verification (Field Inspection)",
      assignedOfficerId: "user-officer-1",
      assignedOfficerName: "Er. Rajesh Kumar",
      assignedOfficerEmail: "officer.ward112@bbmp.gov.in",
      evidenceName: "water_pipeline_leak.jpg",
      evidenceType: "image",
      evidenceSize: "1.8 MB",
      evidenceDataUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
      payload: {
        complaintType: "Low Water Pressure & Pipeline Leak",
        location: "12th Main Road, Malleshwaram",
        description: "Low water supply pressure reported across 12th Main domestic pipeline."
      },
      statusHistory: [
        {
          historyId: "HIS-881023-1",
          previousStatus: null,
          newStatus: "Submitted",
          updatedBy: "Pratiksha",
          updatedByRole: "citizen",
          updatedAt: "2026-08-15T11:00:00.000Z",
          remarks: "Pipeline grievance lodged via portal."
        },
        {
          historyId: "HIS-881023-2",
          previousStatus: "Submitted",
          newStatus: "Under Verification",
          updatedBy: "Er. Rajesh Kumar",
          updatedByRole: "officer",
          updatedAt: "2026-08-16T10:30:00.000Z",
          remarks: "BWSSB maintenance team scheduled for pressure valve check."
        }
      ]
    },
    {
      id: "MUN-2026-773045",
      citizenId: "user-citizen-prit",
      citizenName: "Prit",
      citizenEmail: "prit@bbmp.gov.in",
      serviceId: "waste-sanitation",
      serviceName: "4. Waste Management & Sanitation",
      departmentId: "dept-sanitation",
      department: "Solid Waste Management / Sanitation Department",
      wardId: "ward-174",
      wardName: "Ward 174 (HSR Layout)",
      submissionDate: "Aug 16, 2026",
      status: "In Progress",
      stage: "Stage 3 of 4: In Progress (Dispatched)",
      assignedOfficerId: "user-officer-1",
      assignedOfficerName: "Er. Rajesh Kumar",
      assignedOfficerEmail: "officer.ward112@bbmp.gov.in",
      evidenceName: "waste_collection_point.jpg",
      evidenceType: "image",
      evidenceSize: "1.2 MB",
      evidenceDataUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
      payload: {
        complaintType: "Door-to-Door Auto Tipper Timing",
        location: "Sector 2, HSR Layout",
        description: "Request for scheduled 7:30 AM morning dry & wet segregated waste pickup."
      },
      statusHistory: [
        {
          historyId: "HIS-773045-1",
          previousStatus: null,
          newStatus: "Submitted",
          updatedBy: "Prit",
          updatedByRole: "citizen",
          updatedAt: "2026-08-16T08:00:00.000Z",
          remarks: "Sanitation schedule request submitted."
        },
        {
          historyId: "HIS-773045-2",
          previousStatus: "Submitted",
          newStatus: "In Progress",
          updatedBy: "Er. Rajesh Kumar",
          updatedByRole: "officer",
          updatedAt: "2026-08-17T09:00:00.000Z",
          remarks: "Ward auto-tipper route revised."
        }
      ]
    },
    {
      id: "MUN-2026-664089",
      citizenId: "user-citizen-poobi",
      citizenName: "Poobi",
      citizenEmail: "poobi@bbmp.gov.in",
      serviceId: "birth-death",
      serviceName: "2. Birth & Death Certificates",
      departmentId: "dept-vital",
      department: "Birth & Death Registration Department",
      wardId: "ward-84",
      wardName: "Ward 84 (Indiranagar)",
      submissionDate: "Aug 17, 2026",
      status: "Approved",
      stage: "Stage 4 of 4: Approved & Digitally Signed",
      assignedOfficerId: "user-officer-2",
      assignedOfficerName: "Dr. Ananya Sharma",
      assignedOfficerEmail: "officer.vital@bbmp.gov.in",
      evidenceName: "hospital_discharge_summary.pdf",
      evidenceType: "document",
      evidenceSize: "950 KB",
      evidenceDataUrl: "",
      payload: {
        certificateType: "Birth Certificate Digital Copy",
        hospitalName: "Manipal Hospital, HAL Airport Road",
        dateOfEvent: "2026-07-20"
      },
      statusHistory: [
        {
          historyId: "HIS-664089-1",
          previousStatus: null,
          newStatus: "Submitted",
          updatedBy: "Poobi",
          updatedByRole: "citizen",
          updatedAt: "2026-08-17T10:00:00.000Z",
          remarks: "Digital certificate request filed."
        },
        {
          historyId: "HIS-664089-2",
          previousStatus: "Submitted",
          newStatus: "Approved",
          updatedBy: "Dr. Ananya Sharma",
          updatedByRole: "officer",
          updatedAt: "2026-08-18T16:00:00.000Z",
          remarks: "Hospital birth records verified. e-Certificate QR code issued."
        }
      ]
    }
  ],

  events: [
    {
      id: "evt-1",
      slug: "town-hall-public-hearing-budget",
      title: "Town Hall Public Hearing: Annual Budget & Civic Review",
      category: "Government",
      month: "AUG",
      day: "29",
      year: "2026",
      date: "Aug 29, 2026",
      time: "10:00 AM – 1:00 PM",
      location: "Historic Bengaluru Town Hall, Hudson Circle",
      address: "Hudson Circle, Bengaluru, Karnataka 560002",
      image: "/bengaluru-town-hall.png",
      organizer: "Chief Commissioner Secretariat & GBA Executive Council",
      hostRole: "Presiding Municipal Authority & City Council Secretariat",
      hostContact: "commissioner-townhall@bbmp.gov.in • Toll-Free Helpline: 1533 / 080-22660000",
      description: "Official public hearing chaired by the Chief Commissioner to review municipal budget allocations, infrastructure works, and citizen petitions.",
      summary: "Public town hall hearing chaired by Chief Commissioner for budget feedback & citizen petitions.",
      excerpt: "Public town hall hearing chaired by Chief Commissioner for budget feedback & citizen petitions.",
      whyHappening: "To uphold democratic municipal transparency, ensure public fiscal accountability on the ₹12,500 Crore annual civic budget, and give citizens a statutory platform to question departmental allocations, propose ward infrastructure priorities, and submit direct petitions to the Chief Commissioner.",
      targetAudience: "Ward Residents, Resident Welfare Associations (RWAs), Civil Engineers, Civic Activists, Business Owners, and Urban Planning Scholars.",
      entryGuidelines: "Free Open Entry for all Bengaluru citizens. Physical & digital petition counters open at 9:30 AM. Government ID (Aadhaar/Voter ID) recommended for petition logging.",
      keyOutcomes: [
        "Direct review of ₹12,500 Cr ward-level capital expenditure & road repair budgets",
        "On-spot submission and barcode tracking of local civic petitions with the Chief Commissioner",
        "Public Q&A with Chief Engineers from Civil, Health, and Solid Waste divisions",
        "Adoption of community-voted ward amenity priorities for Q3/Q4 2026"
      ],
      agenda: [
        { time: "09:30 AM – 10:00 AM", title: "Citizen Registration & Petition Intake", detail: "Collection of formal citizen grievances, ward petitions, and distribution of budget overview summaries." },
        { time: "10:00 AM – 10:45 AM", title: "Chief Commissioner's Civic Address", detail: "Detailed presentation on citywide infrastructure works, stormwater drain desilting, and SAS e-Khata milestones." },
        { time: "10:45 AM – 12:00 PM", title: "Open-Floor Public Hearing & Citizen Testimonials", detail: "Moderated open microphone for RWA representatives and citizens to present local ward concerns." },
        { time: "12:00 PM – 12:45 PM", title: "Departmental Response & Engineering Review", detail: "Chief Engineers and Revenue Officers address raised petitions with concrete SLA timelines." },
        { time: "12:45 PM – 01:00 PM", title: "Formal Council Resolutions & Closing Remarks", detail: "Adoption of action directives and distribution of official hearing records." }
      ]
    },
    {
      id: "evt-2",
      slug: "community-green-cleanup-tree-planting",
      title: "Community Green Clean-Up & Tree Plantation Drive",
      category: "Environment",
      month: "AUG",
      day: "25",
      year: "2026",
      date: "Aug 25, 2026",
      time: "7:30 AM – 11:30 AM",
      location: "Cubbon Park & Bamboo Sanctuaries, Kasturba Road",
      address: "Kasturba Road, Bengaluru, Karnataka 560001",
      image: "/cubbon-park-aerial.png",
      organizer: "GBA Forest Cell & Urban Volunteer Eco-Clubs",
      hostRole: "Urban Forestry Division & Environmental Stewardship Council",
      hostContact: "forestcell@bbmp.gov.in • Volunteer WhatsApp: +91 94806 85210",
      description: "Volunteer-led greening initiative planting 5,000 native shade-giving trees and conducting plastic cleanup across Cubbon Park.",
      summary: "Volunteer-led greening & tree sapling plantation drive across Cubbon Park grounds.",
      excerpt: "Volunteer-led greening & tree sapling plantation drive across Cubbon Park grounds.",
      whyHappening: "To combat urban heat island effects, restore native biodiversity, and eliminate non-biodegradable micro-plastics from Bengaluru's premier ecological lung space while empowering citizens to adopt and nurture native trees.",
      targetAudience: "Students, Youth Clubs, Environmental NGOs, Cyclist/Runner Groups, Families, and Corporate Volunteer Teams.",
      entryGuidelines: "Open to all age groups. Biodegradable cleanup bags, gardening tools, saplings, and refreshments provided free on-site. Wear comfortable walking shoes and bring reusable water bottles.",
      keyOutcomes: [
        "Planting of 5,000 native saplings (Honge, Neem, Mahua, Tabebuia) across 4 designated zones",
        "Segregation and recovery of over 2,000 kg of single-use plastic waste for eco-recycling",
        "Issuance of Digital Eco-Volunteer Certificates signed by the Forest Conservator",
        "Sapling adoption program with geo-tagged tree health tracking via Sahaaya Mobile App"
      ],
      agenda: [
        { time: "07:30 AM – 08:00 AM", title: "Volunteer Assembly & Kit Distribution", detail: "Distribution of eco-gloves, saplings, QR-code tree tags, and orientation by Forest Officers." },
        { time: "08:00 AM – 10:00 AM", title: "Zone-Wise Tree Plantation Blitz", detail: "Coordinated plantation of 5,000 saplings across Bamboo Pavilions and King Edward lawns." },
        { time: "10:00 AM – 11:00 AM", title: "Cubbon Park Plastic Cleanup Drive", detail: "Volunteer sweep along walking trails and water bodies to collect and segregate dry waste." },
        { time: "11:00 AM – 11:30 AM", title: "Eco-Pledge & Certificate Distribution", detail: "Official eco-warrior pledge ceremony and refreshment distribution." }
      ]
    },
    {
      id: "evt-3",
      slug: "heritage-arts-festival-craft-fair",
      title: "Greenfield Heritage Arts Festival & Craft Fair",
      category: "Culture & Arts",
      month: "SEP",
      day: "05",
      year: "2026",
      date: "Sep 05, 2026",
      time: "9:00 AM – 6:00 PM",
      location: "State Central Library Campus, Cubbon Park",
      address: "State Central Library Campus, Cubbon Park, Bengaluru 560001",
      image: "/state-central-library.png",
      organizer: "State Central Library & Municipal Heritage Division",
      hostRole: "Department of Public Libraries & Cultural Heritage Directorate",
      hostContact: "heritage-arts@bbmp.gov.in • Phone: 080-22212133",
      description: "Annual heritage arts & handicraft exhibition displaying Mysore paintings, silk weaving, sandalwood carvings, and local folk crafts.",
      summary: "Annual heritage arts & handicraft exhibition displaying Karnataka folk crafts.",
      excerpt: "Annual heritage arts & handicraft exhibition displaying Karnataka folk crafts.",
      whyHappening: "To celebrate Karnataka's centuries-old traditional artisan craftsmanship, support regional cottage industries and handloom weavers with direct consumer markets, and foster public appreciation for Bengaluru's rich architectural and literary heritage.",
      targetAudience: "Art Lovers, Tourists, Families, School Groups, Handloom Patrons, and History Enthusiasts.",
      entryGuidelines: "Free entry for general public and exhibition stalls. Handicraft sales directly support registered artisan cooperatives.",
      keyOutcomes: [
        "Showcase of 120+ master artisans specializing in Mysore Silk, Channapatna wooden crafts, and Sandalwood carving",
        "Live traditional folk dance performances including Dollu Kunitha and Yakshagana",
        "Direct trade market generating direct income for rural artisan cooperatives without middlemen",
        "Guided heritage architectural tours of the 1915 Seshadri Iyer Memorial Library Hall"
      ],
      agenda: [
        { time: "09:00 AM – 10:00 AM", title: "Grand Inaugural Ribbon Cutting", detail: "Folk music invocation and lighting of traditional lamp by Minister of Culture." },
        { time: "10:00 AM – 01:00 PM", title: "Master Artisan Live Craft Workshops", detail: "Interactive clay pottery, silk weaving, and Mysore gold-leaf painting masterclasses." },
        { time: "01:00 PM – 03:00 PM", title: "Karnataka Folk Performances & Music", detail: "Live Yakshagana puppet show and classical Carnatic instrumental ensemble." },
        { time: "03:00 PM – 06:00 PM", title: "Heritage Bazaar & Artisan Honors", detail: "Public handicraft fair and presentation of State Master Craftsman Awards." }
      ]
    },
    {
      id: "evt-4",
      slug: "lalbagh-flower-show-glass-house-expo",
      title: "Lalbagh Flower Show & Botanical Glass House Expo",
      category: "Culture & Arts",
      month: "AUG",
      day: "22",
      year: "2026",
      date: "Aug 22, 2026",
      time: "8:30 AM – 7:00 PM",
      location: "Lalbagh Botanical Garden Glass House Grounds, Mavalli",
      address: "Mavalli, Bengaluru, Karnataka 560004",
      image: "/lalbagh-glass-house.png",
      organizer: "GBA Horticulture Wing & Mysore Horticultural Society",
      hostRole: "Horticulture Department & Botanical Research Wing",
      hostContact: "lalbagh-show@bbmp.gov.in • Information Kiosk: 080-26570181",
      description: "World-renowned botanical expo featuring illuminated flower sculptures, rare orchid displays, and native horticulture exhibits inside the Glass House.",
      summary: "World-famous flower show featuring exotic floral installations and horticultural displays.",
      excerpt: "World-famous flower show featuring exotic floral installations and horticultural displays.",
      whyHappening: "To showcase Bengaluru's world-famous 'Garden City' horticultural legacy, present botanical biodiversity conservation research, and promote water-smart urban rooftop gardening and terrace composting across urban households.",
      targetAudience: "Tourists, Nature Enthusiasts, Families, Botanists, Photographers, and Urban Gardeners.",
      entryGuidelines: "Public entry via all 4 gates (West, North, South, East Gate). Dedicated fast-track lanes for Metro smart card holders. Free entry for school students in uniform.",
      keyOutcomes: [
        "Over 3.5 million vibrant blooms featuring replicas of historic Karnataka heritage monuments",
        "Public education on indigenous drought-resistant flora and rooftop rainwater harvesting",
        "Distribution of subsidised organic seeds, bonsai starter kits, and eco-friendly soil mixes",
        "Nightly illumination of the historic 1889 cast-iron Victorian Glass House"
      ],
      agenda: [
        { time: "08:30 AM – 10:00 AM", title: "Gates Open & Morning Botanical Walk", detail: "Early morning photography walk and guided orchid pavilion tour." },
        { time: "10:00 AM – 01:00 PM", title: "Urban Gardening & Terrace Farming Clinics", detail: "Free workshops by Horticulture Officers on organic composting and micro-irrigation." },
        { time: "01:00 PM – 05:00 PM", title: "Glass House Floral Exhibition Viewing", detail: "Main exhibition hall showcasing 250+ rare hybrid orchid and chrysanthemum displays." },
        { time: "05:00 PM – 07:00 PM", title: "Evening Glass House Light & Music Showcase", detail: "Architectural illumination of the Glass House accompanied by Carnatic instrumental melodies." }
      ]
    },
    {
      id: "evt-5",
      slug: "fix-my-city-pothole-road-repair-drive",
      title: "FixMyCity Pothole Repair & Road Infra SLA Drive",
      category: "Public Works",
      month: "SEP",
      day: "10",
      year: "2026",
      date: "Sep 10, 2026",
      time: "8:00 AM – 2:00 PM",
      location: "Tender SURE Engineering Yard, Rajajinagar Industrial Area",
      address: "Rajajinagar Industrial Area, Bengaluru 560010",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      organizer: "Public Works & Road Infrastructure Division (Civil Department)",
      hostRole: "Chief Engineer Secretariat & Quality Assurance Cell",
      hostContact: "roads-potholes@bbmp.gov.in • Rapid Response Cell: 080-22660022",
      description: "Engineering division inspection and pothole repair blitz tracked live via the Sahaaya 2.0 app for 48-hour SLA resolution.",
      summary: "Infrastructure quality audit of Tender SURE pedestrian walkways & pothole repairs.",
      excerpt: "Infrastructure quality audit of Tender SURE pedestrian walkways & pothole repairs.",
      whyHappening: "To demonstrate the municipal corporation's rapid asphalt repair machinery, enforce strict contractor road quality SLAs, and show citizens how reported pothole grievances on Sahaaya 2.0 are inspected, patched, and geo-verified within 48 hours.",
      targetAudience: "Civil Engineers, Road Contractors, Traffic Wardens, Citizen Commuters, and Mobility Advocates.",
      entryGuidelines: "Open to citizen observation and civil engineering students. Safety helmets and fluorescent vests provided on-site.",
      keyOutcomes: [
        "Live demonstration of automated infrared asphalt patchers sealing road fissures in under 15 minutes",
        "Audit of 12 critical arterial roads in West Zone with laser surface roughness scanners",
        "Public launch of the 48-Hour Pothole SLA guarantee on Sahaaya 2.0 citizen app",
        "Citizen interactive feedback counter with Chief Engineers"
      ],
      agenda: [
        { time: "08:00 AM – 09:00 AM", title: "Engineering Briefing & Equipment Inspection", detail: "Chief Engineer review of asphalt density testers and road profiling equipment." },
        { time: "09:00 AM – 11:30 AM", title: "Live Rapid Road Resurfacing Blitz", detail: "On-site deployment of infrared road repair crews fixing 25 identified road distress points." },
        { time: "11:30 AM – 01:00 PM", title: "Contractor SLA Audit & Penalties Review", detail: "Public presentation of road contractor performance scorecards and quality compliance audits." },
        { time: "01:00 PM – 02:00 PM", title: "Citizen Grievance Resolution Walkthrough", detail: "Demonstration of automated work-order generation from citizen photo reports." }
      ]
    },
    {
      id: "evt-6",
      slug: "bbmp-central-secretariat-council-forum",
      title: "BBMP Central Secretariat Council Forum",
      category: "Government",
      month: "AUG",
      day: "31",
      year: "2026",
      date: "Aug 31, 2026",
      time: "10:30 AM – 3:30 PM",
      location: "BBMP Head Office Secretariat, NR Square, Bengaluru",
      address: "NR Square, Bengaluru, Karnataka 560002",
      image: "/bbmp-head-office.png",
      organizer: "Joint Commissioner Secretariat & Revenue Division",
      hostRole: "Municipal Secretariat & Digital Governance Taskforce",
      hostContact: "secretariat-council@bbmp.gov.in • Council Office: 080-22221188",
      description: "Joint Secretariat session reviewing ward revenue collection, SAS e-Khata digital verification, and GBA municipal governance.",
      summary: "Joint Secretariat session reviewing ward revenue & SAS e-Khata digital verification.",
      excerpt: "Joint Secretariat session reviewing ward revenue & SAS e-Khata digital verification.",
      whyHappening: "To streamline inter-departmental workflows between Civil, Health, and Revenue divisions, accelerate the 100% digital rollout of SAS e-Khata property records, and ensure zero-backlog citizen service processing across all 8 zones.",
      targetAudience: "Ward Revenue Officers, Assistant Revenue Officers (AROs), Legal Advisors, Citizen Representatives, and Property Owners.",
      entryGuidelines: "Official council chambers with public gallery seating. Registration required at Reception Desk with photo ID.",
      keyOutcomes: [
        "Status review of 1.2 Million digitised SAS e-Khata property certificates",
        "Enactment of simplified trade license approvals for small retail businesses",
        "Implementation of instant digital receipts for ward property tax payments",
        "Publication of the Zonal Citizen Service Efficiency Index"
      ],
      agenda: [
        { time: "10:30 AM – 11:30 AM", title: "SAS e-Khata Digital Processing Audit", detail: "Review of average application turnaround times and document verification backlogs." },
        { time: "11:30 AM – 01:00 PM", title: "Ward Revenue & Property Tax Collection Strategies", detail: "Presentation of zonal revenue targets and citizen digital payment adoption metrics." },
        { time: "01:00 PM – 02:00 PM", title: "Lunch Break & Officer Working Session", detail: "Executive committee working lunch and docket preparations." },
        { time: "02:00 PM – 03:30 PM", title: "Public Gallery Questions & Council Directives", detail: "Answering public gallery questions and issuing binding administrative directives." }
      ]
    }
  ]
};
