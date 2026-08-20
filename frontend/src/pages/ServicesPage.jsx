import React, { useState, useEffect } from 'react';
import { 
  FileCheck, Droplets, Truck, Lightbulb, Clock, Download,
  ArrowLeft, ChevronRight, PlusCircle, ArrowRight, Info, Search, Send, Upload, ShieldCheck, FileText, AlertTriangle, Eye, X, CheckCircle,
  Building2, Phone, Mail, Layers, Filter, Sparkles, CheckCircle2, Calendar, MapPin, Recycle, Trash2
} from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { EvidenceUploadInput } from '../components/EvidenceUploadInput';
import { downloadMunicipalDocument } from '../utils/documentDownloader';

export const ServicesPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast, submitCitizenServiceRequest, getDepartmentForService, getCitizenOwnRequests } = useMunicipalData();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all'); // Department filter
  const [searchQuery, setSearchQuery] = useState('');

  // Service 1 State
  const [roadLocation, setRoadLocation] = useState('');
  const [roadIssueType, setRoadIssueType] = useState('Pothole / Road Surface Damage');
  const [roadEvidence, setRoadEvidence] = useState(null);
  const [roadSubmitted, setRoadSubmitted] = useState(null);

  // Handle hash navigation & tab switching when dropdown links are clicked
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== 'step-2-services') {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handlers invoking central backend service-to-department routing
  const handleRoadSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please Login or Register to log your complaint.", "info");
      onNavigate('/login');
      return;
    }
    if (!roadLocation.trim()) {
      showToast("Please enter a valid complaint location.", "warning");
      return;
    }
    const req = submitCitizenServiceRequest('road-streetlights', {
      issue: roadIssueType,
      location: roadLocation,
      evidence: roadEvidence // SECURELY ATTACHED EVIDENCE PAYLOAD
    }, user);

    if (req) {
      setRoadSubmitted({
        ticketId: req.id,
        issue: roadIssueType,
        location: roadLocation,
        department: req.department,
        status: req.status,
        hasEvidence: !!roadEvidence
      });
    }
  };

  const handleBdAppSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please Login or Register to submit a certificate application.", "info");
      onNavigate('/login');
      return;
    }
    if (!bdForm.fullName.trim()) {
      showToast("Please enter child/applicant full name.", "warning");
      return;
    }
    const req = submitCitizenServiceRequest('birth-death', {
      certType: bdForm.certType,
      name: bdForm.fullName,
      date: bdForm.eventDate,
      hospital: bdForm.hospitalName
    }, user);

    if (req) {
      setBdAppSubmitted({
        appNo: req.id,
        certType: bdForm.certType,
        name: bdForm.fullName,
        date: bdForm.eventDate,
        hospital: bdForm.hospitalName,
        department: req.department,
        status: req.status
      });
    }
  };

  // ==========================================
  // 2. BIRTH & DEATH CERTIFICATES STATE
  // ==========================================
  const [bdMode, setBdMode] = useState('apply'); // 'apply' or 'search'
  const [bdStep, setBdStep] = useState(1);
  const [bdForm, setBdForm] = useState({
    certType: 'Birth Certificate',
    fullName: '',
    gender: 'Male',
    eventDate: '2026-08-01',
    hospitalName: 'BBMP High-Tech Referral Hospital, Malleshwaram',
    fatherName: '',
    fatherAadhaar: '',
    motherName: '',
    motherAadhaar: '',
    mobile: '',
    address: ''
  });
  const [bdAppSubmitted, setBdAppSubmitted] = useState(null);
  const [bdRegNo, setBdRegNo] = useState('');
  const [bdResult, setBdResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // ==========================================
  // 3. WATER & SEWERAGE STATE
  // ==========================================
  const [waterMode, setWaterMode] = useState('pay'); // 'pay' or 'new-connection'
  const [waterRrNo, setWaterRrNo] = useState('');
  const [waterResult, setWaterResult] = useState(null);
  const [registeredWaterConns, setRegisteredWaterConns] = useState([
    { rrNo: 'S-481920-W', consumer: 'K. Vigneshwar', address: '14th Cross, Malleshwaram, Bengaluru', amountDue: '₹685.00', dueDate: '2026-08-30' },
    { rrNo: 'S-991204-W', consumer: 'Smt. Lakshmi R.', address: '8th Main, Jayanagar, Bengaluru', amountDue: '₹420.00', dueDate: '2026-08-30' }
  ]);
  const [waterConnForm, setWaterConnForm] = useState({
    applicantName: '',
    address: '',
    connType: 'Domestic 0.5 inch Pipeline',
    mobile: ''
  });
  const [waterDoc, setWaterDoc] = useState(null);
  const [waterSitePhoto, setWaterSitePhoto] = useState(null);
  const [waterConnSubmitted, setWaterConnSubmitted] = useState(null);

  // ==========================================
  // 4. WASTE MANAGEMENT & SANITATION STATE
  // ==========================================
  const [wasteTab, setWasteTab] = useState('schedule'); // 'schedule' | 'bulk' | 'report'
  const [selectedWardKey, setSelectedWardKey] = useState('112');
  
  const wardSanitationDatabase = {
    '112': {
      wardNo: '112',
      wardName: 'Malleshwaram',
      zone: 'West Zone',
      tipperRoute: '1st Cross to 18th Cross, Margosa & Sampige Roads',
      wetTiming: '07:00 AM – 09:30 AM Daily (Door-to-Door Auto-Tipper)',
      dryTiming: 'Wednesdays & Saturdays (10:00 AM – 01:00 PM)',
      sanitaryTiming: 'Daily in Separate Marked Red Bag',
      dwccAddress: 'BBMP DWCC Unit, 14th Cross, Margosa Road, Malleshwaram, Bengaluru - 560003',
      inspector: 'Sri. K. Ramesh (Junior Health Inspector)',
      phone: '+91 94806 85211',
      vehicle: 'Auto-Tipper KA-04-G-4421 (Driver: Suresh M. / +91 98451 22341)'
    },
    '174': {
      wardNo: '174',
      wardName: 'HSR Layout',
      zone: 'South Zone',
      tipperRoute: 'Sectors 1 to 7, 27th Main & 19th Main Service Roads',
      wetTiming: '06:45 AM – 09:15 AM Daily (Door-to-Door Auto-Tipper)',
      dryTiming: 'Tuesdays & Fridays (09:30 AM – 12:30 PM)',
      sanitaryTiming: 'Daily in Separate Marked Red Bag',
      dwccAddress: 'HSR Dry Waste Collection Center, Sector 2, 19th Main, Bengaluru - 560102',
      inspector: 'Smt. Anitha Swamy (Senior Health Inspector)',
      phone: '+91 94806 85274',
      vehicle: 'Auto-Tipper KA-05-G-8812 (Driver: Manjunath G. / +91 98455 66782)'
    },
    '150': {
      wardNo: '150',
      wardName: 'Bellandur',
      zone: 'Mahadevapura Zone',
      tipperRoute: 'Green Glen Layout, Outer Ring Road, Haralur & Kasavanahalli Roads',
      wetTiming: '07:15 AM – 10:00 AM Daily (Door-to-Door Auto-Tipper)',
      dryTiming: 'Mondays & Thursdays (10:00 AM – 01:30 PM)',
      sanitaryTiming: 'Daily in Separate Marked Red Bag',
      dwccAddress: 'Bellandur DWCC, Outer Ring Road, Near EcoSpace, Bengaluru - 560103',
      inspector: 'Sri. Venkatesh Murthy (Health Inspector)',
      phone: '+91 94806 85250',
      vehicle: 'Auto-Tipper KA-53-G-9934 (Driver: Raghavendra / +91 97412 33451)'
    },
    '84': {
      wardNo: '84',
      wardName: 'Rajajinagar',
      zone: 'West Zone',
      tipperRoute: '1st Block to 6th Block, Dr. Rajkumar Road & ESI Hospital Area',
      wetTiming: '07:00 AM – 09:30 AM Daily (Door-to-Door Auto-Tipper)',
      dryTiming: 'Wednesdays & Saturdays (09:30 AM – 12:30 PM)',
      sanitaryTiming: 'Daily in Separate Marked Red Bag',
      dwccAddress: 'Rajajinagar DWCC Unit, 1st Block, 10th Main, Bengaluru - 560010',
      inspector: 'Sri. N. Prakash (Junior Health Inspector)',
      phone: '+91 94806 85284',
      vehicle: 'Auto-Tipper KA-02-G-1109 (Driver: Anand Kumar / +91 99001 44521)'
    },
    '198': {
      wardNo: '198',
      wardName: 'Hemmigepura',
      zone: 'Rajarajeshwari Nagar Zone',
      tipperRoute: 'BEML Layout, Double Road, Channasandra & Nice Road Junction',
      wetTiming: '07:30 AM – 10:00 AM Daily (Door-to-Door Auto-Tipper)',
      dryTiming: 'Tuesdays & Saturdays (10:00 AM – 01:00 PM)',
      sanitaryTiming: 'Daily in Separate Marked Red Bag',
      dwccAddress: 'RR Nagar Zone DWCC Center, Ideal Homes, Bengaluru - 560098',
      inspector: 'Sri. Shivanna Gowda (Health Inspector)',
      phone: '+91 94806 85298',
      vehicle: 'Auto-Tipper KA-41-G-7721 (Driver: Somesh / +91 98800 23114)'
    }
  };

  const [bulkForm, setBulkForm] = useState({
    applicantName: '',
    mobile: '',
    address: '',
    ward: 'Ward 112 (Malleshwaram)',
    wasteType: 'Garden / Tree Pruning Waste',
    pickupDate: '',
    quantity: '1-2 Large Bags / Medium Household Load'
  });
  const [bulkEvidence, setBulkEvidence] = useState(null);
  const [bulkSubmitted, setBulkSubmitted] = useState(null);

  const [garbageReportForm, setGarbageReportForm] = useState({
    issueType: 'Missed Morning Auto-Tipper Collection',
    ward: 'Ward 112 (Malleshwaram)',
    location: '',
    description: ''
  });
  const [garbageEvidence, setGarbageEvidence] = useState(null);
  const [garbageSubmitted, setGarbageSubmitted] = useState(null);

  // Municipal Departments Registry (Civil & Medical Departments)
  const municipalDepartments = [
    {
      id: 'civil-dept',
      name: 'Civil Department',
      fullName: 'Civil & Public Works Infrastructure Department',
      code: 'CIVIL-DEPT',
      icon: Building2,
      desc: 'Road repairs, potholes, streetlights, footpaths, water supply connections, and solid waste sanitation.',
      head: 'Er. Rajesh Kumar (Chief Engineer)',
      sla: '24 - 48 Hours',
      serviceIds: ['road-streetlights', 'water-sewerage', 'waste-sanitation'],
      serviceNames: [
        'Road & Streetlight Complaints',
        'Water & Sewerage Services',
        'Waste Management & Sanitation'
      ]
    },
    {
      id: 'medical-dept',
      name: 'Medical Department',
      fullName: 'Medical & Public Health Registration Department',
      code: 'MEDICAL-DEPT',
      icon: FileCheck,
      desc: 'Institutional & home Birth and Death e-Certificates, vital statistics registration, and hospital records.',
      head: 'Dr. Ananya Sharma (Chief Medical Officer & Registrar)',
      sla: '3 - 5 Working Days',
      serviceIds: ['birth-death'],
      serviceNames: [
        'Birth & Death Certificates'
      ]
    }
  ];

  // 4 Core Citizen Services with Department Mapping
  const citizenServicePoints = [
    { id: 'all', label: 'All Services', icon: ShieldCheck, desc: 'Master portal for Civil & Medical services.', deptKey: 'all' },
    { id: 'road-streetlights', label: '1. Road & Streetlight Complaints', icon: Lightbulb, desc: 'Report potholes (FixMyCity), broken streetlights, and damaged Tender SURE footpaths.', deptKey: 'civil-dept', deptName: 'Civil Department', deptCode: 'CIVIL-DEPT', sla: '24-48 Hours' },
    { id: 'water-sewerage', label: '2. Water & Sewerage Services', icon: Droplets, desc: 'Pay BWSSB monthly water bills online or apply step-by-step for a new water connection.', deptKey: 'civil-dept', deptName: 'Civil Department', deptCode: 'CIVIL-DEPT', sla: '2-4 Days' },
    { id: 'waste-sanitation', label: '3. Waste Management & Sanitation', icon: Truck, desc: 'Door-to-door auto-tipper garbage schedules, dry waste centers, and bulk waste pickup.', deptKey: 'civil-dept', deptName: 'Civil Department', deptCode: 'CIVIL-DEPT', sla: 'Daily Morning SLA' },
    { id: 'birth-death', label: '4. Birth & Death Certificates', icon: FileCheck, desc: 'Apply step-by-step for new Birth/Death certificates or search & download existing records.', deptKey: 'medical-dept', deptName: 'Medical Department', deptCode: 'MEDICAL-DEPT', sla: '3-5 Days' }
  ];

  const matchesSearch = (id, label, desc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return id.toLowerCase().includes(q) || label.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  };

  const isCategoryVisible = (id) => {
    if (id === 'all') return false;

    // 1. Department filter
    if (selectedDept !== 'all') {
      const currentDept = municipalDepartments.find(d => d.id === selectedDept);
      if (currentDept && currentDept.serviceIds && !currentDept.serviceIds.includes(id)) {
        return false;
      }
    }

    // 2. Active Tab check
    if (activeTab !== 'all' && activeTab !== id) return false;

    // 3. Search Query check
    const point = citizenServicePoints.find(p => p.id === id);
    return point ? matchesSearch(id, point.label, point.desc) : true;
  };

  // Handlers are defined above using submitCitizenServiceRequest

  const handleBdSearch = (e) => {
    e.preventDefault();
    const q = bdRegNo.trim().toUpperCase();
    if (q === 'BBMP-BD-2026-9921' || (bdAppSubmitted && bdAppSubmitted.appNo.toUpperCase() === q)) {
      setBdResult({
        found: true,
        regNo: q,
        name: bdAppSubmitted ? bdAppSubmitted.name : "Aarav Kumar",
        dob: bdAppSubmitted ? bdAppSubmitted.date : "2026-02-14",
        hospital: bdAppSubmitted ? bdAppSubmitted.hospital : "BBMP High-Tech Hospital, Malleshwaram",
        status: "VERIFIED & ISSUED"
      });
      showToast(`e-Certificate found for ${q}`);
    } else {
      setBdResult({
        found: false,
        regNo: q
      });
      showToast(`No certificate record found for ${q}`, 'warning');
    }
  };

  const handleWaterConnSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please Login or Register to apply for a water connection.", "info");
      onNavigate('/login');
      return;
    }
    if (!waterConnForm.applicantName.trim() || !waterConnForm.address.trim()) {
      showToast("Please enter applicant name and installation address.", "warning");
      return;
    }

    const rrGenerated = `S-${Math.floor(100000 + Math.random() * 900000)}-W`;
    const initialFee = waterConnForm.connType?.includes('Commercial') ? '₹2,500.00' : '₹1,250.00';

    const req = submitCitizenServiceRequest('water-sewerage', {
      applicant: waterConnForm.applicantName,
      address: waterConnForm.address,
      rrNo: rrGenerated,
      connType: waterConnForm.connType,
      evidence: waterDoc || waterSitePhoto,
      attachedDoc: waterDoc,
      attachedSitePhoto: waterSitePhoto
    }, user);

    if (req) {
      const newConn = {
        rrNo: rrGenerated,
        consumer: waterConnForm.applicantName,
        address: waterConnForm.address,
        amountDue: initialFee,
        feePaid: false,
        connType: waterConnForm.connType,
        dueDate: '2026-09-15',
        appNo: req.id,
        department: req.department
      };

      setRegisteredWaterConns(prev => [newConn, ...prev]);
      setWaterConnSubmitted({
        appNo: req.id,
        rrNo: rrGenerated,
        applicant: waterConnForm.applicantName,
        type: waterConnForm.connType,
        amountDue: initialFee,
        department: req.department,
        status: req.status
      });
    }
  };

  const handleWaterSearch = (e) => {
    e.preventDefault();
    const q = waterRrNo.trim().toUpperCase();
    if (!q) return;

    const matched = registeredWaterConns.find(
      w => w.rrNo.toUpperCase() === q || (w.appNo && w.appNo.toUpperCase() === q)
    );

    if (matched) {
      // Ensure amountDue is never ₹0.00 unless explicitly paid
      const displayedAmount = (matched.amountDue && !matched.amountDue.includes('0.00')) 
        ? matched.amountDue 
        : (matched.feePaid ? '₹0.00 (All Dues Cleared)' : '₹1,250.00');

      setWaterResult({
        found: true,
        rrNo: matched.rrNo,
        consumer: matched.consumer,
        address: matched.address,
        connType: matched.connType || 'Domestic 0.5 inch Pipeline',
        amountDue: displayedAmount,
        feePaid: matched.feePaid || false,
        dueDate: matched.dueDate || '2026-09-15',
        appNo: matched.appNo,
        receiptNo: matched.receiptNo
      });
      showToast(`Water Utility Bill found for RR No: ${matched.rrNo}`);
    } else {
      // If user searched for an RR number or application number that was just typed:
      const generatedRR = q.startsWith('S-') ? q : `S-${Math.floor(100000 + Math.random() * 900000)}-W`;
      const fallbackBill = {
        rrNo: generatedRR,
        consumer: user?.fullName || 'Registered Citizen Consumer',
        address: user?.address || '14th Cross, Malleshwaram, Bengaluru',
        connType: 'Domestic 0.5 inch Pipeline',
        amountDue: '₹1,250.00',
        feePaid: false,
        dueDate: '2026-09-15',
        appNo: q.startsWith('MUN-') ? q : `MUN-2026-${Math.floor(100000 + Math.random() * 900000)}`
      };
      
      setRegisteredWaterConns(prev => [fallbackBill, ...prev]);
      setWaterResult({
        found: true,
        ...fallbackBill
      });
      showToast(`Active Water Utility Account found for ${q}`);
    }
  };

  const handlePayWaterBill = (rrNo) => {
    const generatedReceipt = `RCP-BWSSB-${Math.floor(100000 + Math.random() * 900000)}`;

    setRegisteredWaterConns(prev => prev.map(c => {
      if (c.rrNo === rrNo || (c.appNo && c.appNo === rrNo)) {
        return {
          ...c,
          amountDue: '₹0.00 (All Dues Cleared)',
          feePaid: true,
          receiptNo: generatedReceipt
        };
      }
      return c;
    }));

    setWaterResult(prev => prev ? {
      ...prev,
      amountDue: '₹0.00 (All Dues Cleared)',
      feePaid: true,
      receiptNo: generatedReceipt
    } : null);

    showToast(`✅ Payment Successful! Official BWSSB Receipt #${generatedReceipt} Generated.`, 'success');
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please Login or Register to book bulk waste pickup.", "info");
      onNavigate('/login');
      return;
    }
    if (!bulkForm.applicantName.trim() || !bulkForm.address.trim() || !bulkForm.pickupDate) {
      showToast("Please enter name, address, and select a preferred pickup date.", "warning");
      return;
    }

    const req = submitCitizenServiceRequest('waste-sanitation', {
      issue: `Special Bulk Waste Pickup: ${bulkForm.wasteType} (${bulkForm.quantity})`,
      applicant: bulkForm.applicantName,
      address: bulkForm.address,
      pickupDate: bulkForm.pickupDate,
      location: `${bulkForm.address}, ${bulkForm.ward}`,
      evidence: bulkEvidence
    }, user);

    if (req) {
      setBulkSubmitted({
        bookingId: req.id,
        applicant: bulkForm.applicantName,
        wasteType: bulkForm.wasteType,
        pickupDate: bulkForm.pickupDate,
        ward: bulkForm.ward,
        status: 'DISPATCH SCHEDULED'
      });
      showToast(`✅ Special Bulk Waste Pickup booked for ${bulkForm.pickupDate}! Ref: ${req.id}`, 'success');
    }
  };

  const handleGarbageReportSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please Login or Register to report sanitation issues.", "info");
      onNavigate('/login');
      return;
    }
    if (!garbageReportForm.location.trim()) {
      showToast("Please enter the exact street location / landmark.", "warning");
      return;
    }

    const req = submitCitizenServiceRequest('waste-sanitation', {
      issue: garbageReportForm.issueType,
      location: `${garbageReportForm.location}, ${garbageReportForm.ward}`,
      description: garbageReportForm.description,
      evidence: garbageEvidence
    }, user);

    if (req) {
      setGarbageSubmitted({
        ticketId: req.id,
        issue: garbageReportForm.issueType,
        location: garbageReportForm.location,
        ward: garbageReportForm.ward,
        status: 'SUBMITTED (SLA: 24h Clean-up)'
      });
      showToast(`✅ Sanitation complaint lodged! Assigned to Ward Health Inspector. Ref: ${req.id}`, 'success');
    }
  };

  const handleTrackSearch = (e) => {
    e.preventDefault();
    const q = trackRefNo.trim().toUpperCase();
    if (q) {
      setTrackResult({
        refNo: q,
        service: q.includes('FIX') ? "Road Pothole & Streetlight Complaint" : q.includes('BWSSB') ? "New Water Connection Request" : "Birth & Death Certificate Application",
        applicant: "Citizen Applicant",
        currentStage: "Field Engineer / Officer Inspection (Stage 3 of 4)",
        estimatedCompletion: "2026-08-22",
        status: "IN PROGRESS"
      });
      showToast(`Status progress loaded for ${q}`);
    }
  };

  return (
    <div id="main-content">
      {/* Page Header */}
      <div style={{ background: '#f8fafc', padding: '2.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.9rem', color: '#64748b' }}>
            <button 
              onClick={() => onNavigate('/')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'white', border: '1px solid #cbd5e1', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} style={{ color: '#008b95', textDecoration: 'none', fontWeight: 600 }}>Home</a>
            <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            <span style={{ color: '#1e293b', fontWeight: 700 }}>Citizen Public Services Portal</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', margin: '0 0 0.75rem 0', fontWeight: 800 }}>
            Citizen Public Services Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '850px', margin: 0, lineHeight: '1.6' }}>
            Access all 5 core citizen public services: Report road & streetlight issues, apply step-by-step for birth & death certificates, manage water & sewerage connections, check waste tipper schedules, and track application status.
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'white' }}>
        <div className="container">
          
          {/* Search Bar */}
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text"
                placeholder="Search the 5 Citizen Services (e.g. Road, Pothole, Birth Certificate, Water, Waste, Status)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#f8fafc' }}
              />
            </div>
          </div>

          {/* STEP 1: CHOOSE DEPARTMENT FIRST */}
          <div style={{ marginBottom: '2.5rem', background: '#f8fafc', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={22} style={{ color: '#008b95' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                    Step 1: Select Department First
                  </h3>
                </div>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                  Choose your department first (Civil, Medical, Water, Sanitation, or Admin). The services under that department will appear below.
                </p>
              </div>

              {selectedDept !== 'all' && (
                <button
                  onClick={() => {
                    setSelectedDept('all');
                    setActiveTab('all');
                    window.location.hash = '';
                  }}
                  style={{
                    background: 'white',
                    border: '1px solid #008b95',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#008b95',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 6px rgba(0, 139, 149, 0.1)'
                  }}
                >
                  <X size={14} /> 🔄 Show All Departments
                </button>
              )}
            </div>

            {/* Visual Department Selection Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.15rem' }}>
              {municipalDepartments.map(dept => {
                const Icon = dept.icon;
                const isSelected = selectedDept === dept.id;
                return (
                  <div
                    key={dept.id}
                    onClick={() => {
                      setSelectedDept(dept.id);
                      if (dept.serviceIds && dept.serviceIds.length > 0) {
                        setActiveTab(dept.serviceIds[0]);
                      }
                      setTimeout(() => {
                        const step2El = document.getElementById('step-2-services');
                        if (step2El) {
                          const yOffset = -90;
                          const y = step2El.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }, 80);
                    }}
                    style={{
                      border: isSelected ? '2px solid #008b95' : '1px solid #cbd5e1',
                      borderRadius: '12px',
                      background: isSelected ? '#f0fdfa' : 'white',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 6px 20px rgba(0, 139, 149, 0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <span style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '12px',
                        background: '#008b95',
                        color: 'white',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <CheckCircle2 size={12} /> ACTIVE DEPT
                      </span>
                    )}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{
                          background: isSelected ? '#008b95' : '#f1f5f9',
                          color: isSelected ? 'white' : '#008b95',
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={22} />
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          background: isSelected ? '#ccfbf1' : '#e2e8f0',
                          color: isSelected ? '#0f766e' : '#475569',
                          fontWeight: 800
                        }}>
                          {dept.code}
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--color-primary)', fontSize: '1.05rem', fontWeight: 800 }}>
                        {dept.name}
                      </h4>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.45' }}>
                        {dept.desc}
                      </p>

                      <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#008b95', fontWeight: 700 }}>
                        Includes Service: {dept.serviceNames.join(', ')}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>⏱️ SLA: <strong>{dept.sla}</strong></span>
                        <span>👤 <strong>{dept.head?.split('(')[0]}</strong></span>
                      </div>
                      <button
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: isSelected ? '#008b95' : '#0b2f45',
                          color: 'white',
                          fontSize: '0.825rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {isSelected ? '✓ Department Selected (View Services Below)' : 'Choose This Department ➔'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: CHOOSE SPECIFIC SERVICE UNDER SELECTED DEPARTMENT */}
          <div id="step-2-services" style={{ marginBottom: '2.5rem', scrollMarginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Sparkles size={20} style={{ color: '#008b95' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                Step 2: Choose Service under {selectedDept === 'all' ? 'All Departments' : municipalDepartments.find(d => d.id === selectedDept)?.name}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', scrollbarWidth: 'thin' }}>
              {citizenServicePoints
                .filter(pt => {
                  if (pt.id === 'all') return true;
                  if (selectedDept === 'all') return true;
                  const dept = municipalDepartments.find(d => d.id === selectedDept);
                  return dept && dept.serviceIds && dept.serviceIds.includes(pt.id);
                })
                .map((pt) => {
                  const isActive = activeTab === pt.id;
                  return (
                    <button
                      key={pt.id}
                      onClick={() => {
                        setActiveTab(pt.id);
                      }}
                      style={{
                        padding: '0.75rem 1.35rem',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 800 : 600,
                        whiteSpace: 'nowrap',
                        border: isActive ? '2px solid #008b95' : '1px solid #cbd5e1',
                        background: isActive ? '#008b95' : 'white',
                        color: isActive ? 'white' : '#334155',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 14px rgba(0, 139, 149, 0.25)' : 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>{pt.label}</span>
                      {pt.sla && (
                        <span style={{
                          fontSize: '0.72rem',
                          background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                          color: isActive ? 'white' : '#64748b',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          fontWeight: 700
                        }}>
                          {pt.sla}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* 5 Services Cards Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* SERVICE 1: ROAD & STREETLIGHT COMPLAINTS */}
            {isCategoryVisible('road-streetlights') && (
              <div id="road-streetlights" style={{ background: 'white', padding: '2.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '0.3rem 0.75rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
                  <Building2 size={14} style={{ color: '#0f766e' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f766e' }}>
                    Department: Public Works / Electrical Department (PWD-ELEC) | ⏱️ SLA: 24-48h | 📞 (080) 2297 5511
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Lightbulb size={28} style={{ color: '#008b95' }} />
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>1. Road & Streetlight Complaints</h2>
                </div>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.975rem' }}>
                  Report road potholes (FixMyCity), broken streetlights, fallen tree branches, and damaged Tender SURE footpaths.
                </p>

                {roadSubmitted ? (
                  <div style={{ background: '#f0fff4', border: '1px solid #86efac', padding: '1.25rem', borderRadius: '8px', maxWidth: '600px' }}>
                    <h4 style={{ color: '#166534', margin: '0 0 0.35rem 0' }}>✅ Complaint Registered! Ticket Ref: {roadSubmitted.ticketId}</h4>
                    <p style={{ color: '#15803d', margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>Issue: <strong>{roadSubmitted.issue}</strong></p>
                    <p style={{ color: '#15803d', margin: 0, fontSize: '0.9rem' }}>Location: <strong>{roadSubmitted.location}</strong></p>
                    <button onClick={() => setRoadSubmitted(null)} className="btn btn-primary" style={{ marginTop: '0.75rem', background: '#008b95', borderColor: '#008b95' }}>Report Another Issue</button>
                  </div>
                ) : (
                  <form onSubmit={handleRoadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Issue Type *</label>
                        <select 
                          value={roadIssueType} 
                          onChange={(e) => setRoadIssueType(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}
                        >
                          <option value="Pothole / Road Surface Damage">Pothole / Road Surface Damage</option>
                          <option value="Streetlight Outage / Dark Area">Streetlight Outage / Dark Area</option>
                          <option value="Damaged Footpath">Damaged Footpath</option>
                          <option value="Fallen Tree Branch Hazard">Fallen Tree Branch Hazard</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Location / Landmark *</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 10th Main Road, Jayanagar"
                          value={roadLocation}
                          onChange={(e) => setRoadLocation(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                    </div>

                    {/* Evidence Upload Section (Photo or Video for Pothole/Streetlight) */}
                    <EvidenceUploadInput 
                      label="Upload Road Hazard Photo / Video Evidence"
                      onEvidenceSelected={(evidence) => setRoadEvidence(evidence)}
                      currentEvidence={roadEvidence}
                    />

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', background: '#008b95', borderColor: '#008b95', fontWeight: 800 }}>Log Complaint</button>
                  </form>
                )}
              </div>
            )}

            {/* SERVICE 2: BIRTH & DEATH CERTIFICATES */}
            {isCategoryVisible('birth-death') && (
              <div id="birth-death" style={{ background: 'white', padding: '2.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '0.3rem 0.75rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
                  <Building2 size={14} style={{ color: '#0f766e' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f766e' }}>
                    Department: Birth & Death Registration Department (REG-VITAL) | ⏱️ SLA: 3-5 Days | 📞 (080) 2297 5522
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <FileCheck size={28} style={{ color: '#008b95' }} />
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>2. Birth & Death Certificates</h2>
                </div>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.975rem' }}>
                  Apply step-by-step for a new Birth or Death Certificate, or search & download an existing issued e-Certificate.
                </p>

                {/* Sub-Mode Toggle Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setBdMode('apply')}
                    style={{
                      padding: '0.6rem 1.15rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: bdMode === 'apply' ? '2px solid #008b95' : '1px solid #cbd5e1',
                      background: bdMode === 'apply' ? '#008b95' : '#f8fafc',
                      color: bdMode === 'apply' ? 'white' : '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <PlusCircle size={16} /> 1. Apply New Certificate (Step-by-Step)
                  </button>

                  <button 
                    onClick={() => setBdMode('search')}
                    style={{
                      padding: '0.6rem 1.15rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: bdMode === 'search' ? '2px solid #008b95' : '1px solid #cbd5e1',
                      background: bdMode === 'search' ? '#008b95' : '#f8fafc',
                      color: bdMode === 'search' ? 'white' : '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Search size={16} /> 2. Search / Download Existing Certificate
                  </button>
                </div>

                {/* MODE 1: APPLY NEW CERTIFICATE */}
                {bdMode === 'apply' && (
                  <div style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '720px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.75rem' }}>
                      <h4 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                        Step-by-Step New Certificate Application Form
                      </h4>
                      <span style={{ fontSize: '0.8rem', background: '#008b95', color: 'white', padding: '0.2rem 0.65rem', borderRadius: '12px', fontWeight: 700 }}>
                        Step {bdStep} of 4
                      </span>
                    </div>

                    {bdAppSubmitted ? (
                      <div style={{ background: '#f0fff4', border: '1px solid #86efac', padding: '1.5rem', borderRadius: '8px' }}>
                        <h4 style={{ color: '#166534', margin: '0 0 0.5rem 0' }}>✅ Application Successfully Logged!</h4>
                        <p style={{ fontSize: '0.9rem', margin: '0 0 0.35rem 0' }}>Application Reference No: <strong style={{ color: '#008b95' }}>{bdAppSubmitted.appNo}</strong></p>
                        <p style={{ fontSize: '0.9rem', margin: '0 0 0.35rem 0' }}>Applicant Name: <strong>{bdAppSubmitted.name}</strong> ({bdAppSubmitted.certType})</p>
                        <p style={{ fontSize: '0.9rem', margin: '0 0 0.75rem 0' }}>Current Progress: <span style={{ color: '#008b95', fontWeight: 700 }}>{bdAppSubmitted.status}</span></p>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                          <button onClick={() => { setBdAppSubmitted(null); setBdStep(1); }} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95' }}>Apply Another Certificate</button>
                          <button onClick={() => { setActiveTab('status-tracking'); setTrackRefNo(bdAppSubmitted.appNo); }} className="btn btn-outline-light" style={{ borderColor: '#008b95', color: '#008b95' }}>Track Application Status</button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleBdAppSubmit}>
                        {bdStep === 1 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>1. Certificate Type *</label>
                                <select 
                                  value={bdForm.certType}
                                  onChange={(e) => setBdForm({ ...bdForm, certType: e.target.value })}
                                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}
                                >
                                  <option value="Birth Certificate">Birth Certificate</option>
                                  <option value="Death Certificate">Death Certificate</option>
                                </select>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>2. Full Name of Child / Deceased *</label>
                                <input 
                                  type="text" required
                                  placeholder="Enter Full Legal Name"
                                  value={bdForm.fullName}
                                  onChange={(e) => setBdForm({ ...bdForm, fullName: e.target.value })}
                                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>3. Gender *</label>
                                <select 
                                  value={bdForm.gender}
                                  onChange={(e) => setBdForm({ ...bdForm, gender: e.target.value })}
                                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>4. Date of Event *</label>
                                <input 
                                  type="date" required
                                  value={bdForm.eventDate}
                                  onChange={(e) => setBdForm({ ...bdForm, eventDate: e.target.value })}
                                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                              </div>
                            </div>

                            <button type="button" onClick={() => setBdStep(2)} className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: '0.5rem', background: '#008b95', borderColor: '#008b95' }}>
                              Next: Hospital Details <ArrowRight size={15} />
                            </button>
                          </div>
                        )}

                        {bdStep === 2 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>5. Hospital / Event Location *</label>
                              <input 
                                type="text" required
                                placeholder="Hospital Name / Address (e.g. BBMP Referral Hospital, Malleshwaram)"
                                value={bdForm.hospitalName}
                                onChange={(e) => setBdForm({ ...bdForm, hospitalName: e.target.value })}
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>6. Residential Address in Bengaluru *</label>
                              <textarea 
                                rows={2} required
                                placeholder="Enter House No, Street, Ward & Pincode..."
                                value={bdForm.address}
                                onChange={(e) => setBdForm({ ...bdForm, address: e.target.value })}
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                              ></textarea>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                              <button type="button" onClick={() => setBdStep(1)} className="btn btn-outline-light">Back</button>
                              <button type="button" onClick={() => setBdStep(3)} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95' }}>
                                Next: Parent/Aadhaar Info <ArrowRight size={15} />
                              </button>
                            </div>
                          </div>
                        )}

                        {bdStep === 3 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>7. Father's Name *</label>
                                <input 
                                  type="text" required
                                  placeholder="Father's Full Name"
                                  value={bdForm.fatherName}
                                  onChange={(e) => setBdForm({ ...bdForm, fatherName: e.target.value })}
                                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>8. Father's Aadhaar No</label>
                                <input 
                                  type="text"
                                  placeholder="12-Digit Aadhaar No"
                                  value={bdForm.fatherAadhaar}
                                  onChange={(e) => setBdForm({ ...bdForm, fatherAadhaar: e.target.value })}
                                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>9. Mother's Name *</label>
                                <input 
                                  type="text" required
                                  placeholder="Mother's Full Name"
                                  value={bdForm.motherName}
                                  onChange={(e) => setBdForm({ ...bdForm, motherName: e.target.value })}
                                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>10. Mobile Number *</label>
                                <input 
                                  type="tel" required
                                  placeholder="10-Digit Mobile No for Status SMS"
                                  value={bdForm.mobile}
                                  onChange={(e) => setBdForm({ ...bdForm, mobile: e.target.value })}
                                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                              <button type="button" onClick={() => setBdStep(2)} className="btn btn-outline-light">Back</button>
                              <button type="button" onClick={() => setBdStep(4)} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95' }}>
                                Next: Upload Proof & Submit <ArrowRight size={15} />
                              </button>
                            </div>
                          </div>
                        )}

                        {bdStep === 4 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ display: 'block', cursor: 'pointer' }}>
                              <input 
                                type="file" 
                                accept="image/*,.pdf" 
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setUploadedFile({
                                      name: file.name,
                                      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
                                    });
                                    showToast(`Selected file: ${file.name}`);
                                  }
                                }}
                              />
                              <div style={{ border: uploadedFile ? '2px solid #008b95' : '2px dashed #cbd5e1', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', background: uploadedFile ? '#f0fdf4' : 'white' }}>
                                <Upload size={28} style={{ color: uploadedFile ? '#059669' : '#008b95', marginBottom: '0.3rem' }} />
                                {uploadedFile ? (
                                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#166534' }}>
                                    ✅ File Uploaded: {uploadedFile.name} ({uploadedFile.size})
                                  </p>
                                ) : (
                                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                    Click here to Choose & Upload Hospital Slip (PDF/JPG)
                                  </p>
                                )}
                              </div>
                            </label>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                              <button type="button" onClick={() => setBdStep(3)} className="btn btn-outline-light">Back</button>
                              <button type="submit" className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95' }}>
                                Submit Application <Send size={15} />
                              </button>
                            </div>
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                )}

                {/* MODE 2: SEARCH CERTIFICATE */}
                {bdMode === 'search' && (
                  <div style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '650px' }}>
                    <h4 style={{ color: 'var(--color-primary)', margin: '0 0 0.85rem 0' }}>Search Registered e-Certificate</h4>
                    <form onSubmit={handleBdSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                      <input 
                        type="text" required
                        placeholder="Enter Hospital Reg No / Child Name (e.g. BBMP-BD-2026-9921)"
                        value={bdRegNo}
                        onChange={(e) => setBdRegNo(e.target.value)}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95' }}>Search Certificate</button>
                    </form>

                    {bdResult && (
                      bdResult.found ? (
                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <h4 style={{ color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>✅ Official Record Found</h4>
                          <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Registration No: <strong>{bdResult.regNo}</strong></p>
                          <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Name Record: <strong style={{ color: '#008b95' }}>{bdResult.name}</strong></p>
                          <p style={{ fontSize: '0.9rem', margin: '0 0 0.75rem 0' }}>Hospital: <strong>{bdResult.hospital}</strong></p>
                          <button onClick={() => showToast(`Downloaded Certificate PDF for ${bdResult.regNo}`)} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Download size={15} /> Download PDF Certificate
                          </button>
                        </div>
                      ) : (
                        <div style={{ background: '#fffbe5', border: '1px solid #fde047', padding: '1.25rem', borderRadius: '8px' }}>
                          <h4 style={{ color: '#854d0e', margin: '0 0 0.35rem 0' }}>⚠️ No Certificate Found: {bdResult.regNo}</h4>
                          <p style={{ fontSize: '0.875rem', color: '#713f12', marginBottom: '1rem' }}>No registered birth/death certificate was found for this reference.</p>
                          <button onClick={() => setBdMode('apply')} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95' }}>
                            ➕ Apply for New Certificate (Step-by-Step)
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SERVICE 3: WATER & SEWERAGE SERVICES */}
            {isCategoryVisible('water-sewerage') && (
              <div id="water-sewerage" style={{ background: 'white', padding: '2.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '0.3rem 0.75rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
                  <Building2 size={14} style={{ color: '#0f766e' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f766e' }}>
                    Department: Civil Department (CIVIL-DEPT - Water Supply & Sewerage Wing) | ⏱️ SLA: 2-4 Days | 📞 (080) 2297 5533
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Droplets size={28} style={{ color: '#008b95' }} />
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>3. Water & Sewerage Services</h2>
                </div>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.975rem' }}>
                  Pay monthly BWSSB water bills online or apply step-by-step for a new domestic/commercial water connection.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <button onClick={() => setWaterMode('pay')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, border: waterMode === 'pay' ? '2px solid #008b95' : '1px solid #cbd5e1', background: waterMode === 'pay' ? '#008b95' : '#f8fafc', color: waterMode === 'pay' ? 'white' : '#475569', cursor: 'pointer' }}>
                    💧 Pay Water Bill
                  </button>
                  <button onClick={() => setWaterMode('new-connection')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, border: waterMode === 'new-connection' ? '2px solid #008b95' : '1px solid #cbd5e1', background: waterMode === 'new-connection' ? '#008b95' : '#f8fafc', color: waterMode === 'new-connection' ? 'white' : '#475569', cursor: 'pointer' }}>
                    ➕ Apply New Water Connection
                  </button>
                </div>

                {waterMode === 'pay' ? (
                  <div>
                    <form onSubmit={handleWaterSearch} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', marginBottom: '1.25rem' }}>
                      <input 
                        type="text" required
                        placeholder="Enter BWSSB RR Number (e.g. S-481920-W)"
                        value={waterRrNo}
                        onChange={(e) => setWaterRrNo(e.target.value)}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95' }}>Lookup Bill</button>
                    </form>

                    {waterResult && (
                      waterResult.found ? (
                        <div style={{ background: '#f8fafc', padding: '1.35rem', borderRadius: '10px', border: '1px solid #cbd5e1', maxWidth: '600px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h4 style={{ color: 'var(--color-primary)', margin: 0 }}>✅ BWSSB Water Utility Account</h4>
                            <span style={{ fontSize: '0.75rem', background: waterResult.feePaid ? '#dcfce7' : '#fef3c7', color: waterResult.feePaid ? '#15803d' : '#b45309', padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 800 }}>
                              {waterResult.feePaid ? '● Dues Cleared' : '● Due for Payment'}
                            </span>
                          </div>
                          
                          <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>RR No: <strong>{waterResult.rrNo}</strong></p>
                          <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Consumer Name: <strong style={{ color: '#008b95' }}>{waterResult.consumer}</strong></p>
                          <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Installation Address: <strong>{waterResult.address}</strong></p>
                          {waterResult.connType && (
                            <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Connection Category: <strong>{waterResult.connType}</strong></p>
                          )}
                          <p style={{ fontSize: '1.15rem', fontWeight: 800, color: waterResult.feePaid ? '#166534' : '#ea580c', margin: '0.65rem 0 0.85rem 0' }}>
                            Amount Due: {waterResult.amountDue}
                          </p>

                          {!waterResult.feePaid && waterResult.amountDue !== '₹0.00' ? (
                            <button 
                              onClick={() => handlePayWaterBill(waterResult.rrNo)} 
                              className="btn btn-primary" 
                              style={{ background: '#008b95', borderColor: '#008b95', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                            >
                              💳 Pay Water Bill Online ({waterResult.amountDue})
                            </button>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button 
                                onClick={() => downloadMunicipalDocument({
                                  title: `BWSSB Water Fee Receipt - ${waterResult.rrNo}`,
                                  category: 'Water Utility Payment Receipt',
                                  fileSize: '180 KB',
                                  fileType: 'PDF',
                                  description: `Official BBMP/BWSSB payment receipt for Consumer ${waterResult.consumer} (RR: ${waterResult.rrNo}).`
                                })} 
                                className="btn btn-primary" 
                                style={{ background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                              >
                                <Download size={15} /> Download Official Payment Receipt
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ background: '#fffbe5', border: '1px solid #fde047', padding: '1.25rem', borderRadius: '8px', maxWidth: '600px' }}>
                          <h4 style={{ color: '#854d0e', margin: '0 0 0.35rem 0' }}>⚠️ No Connection Found for RR No: {waterResult.rrNo}</h4>
                          <p style={{ fontSize: '0.875rem', color: '#713f12', marginBottom: '1rem' }}>No active water meter connection was found for this RR number.</p>
                          <button onClick={() => setWaterMode('new-connection')} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95' }}>
                            ➕ Apply New Water Connection for RR {waterResult.rrNo}
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleWaterConnSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '650px' }}>
                    <h4 style={{ color: 'var(--color-primary)', margin: '0 0 1rem 0' }}>New Water & Sewerage Connection Application</h4>
                    {waterConnSubmitted ? (
                      <div style={{ background: '#f0fff4', padding: '1.25rem', borderRadius: '8px', border: '1px solid #86efac' }}>
                        <h5 style={{ color: '#166534', margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800 }}>✅ Application Registered: {waterConnSubmitted.appNo}</h5>
                        <p style={{ fontSize: '0.9rem', color: '#15803d', margin: '0 0 0.25rem 0' }}>Generated RR No: <strong>{waterConnSubmitted.rrNo}</strong></p>
                        <p style={{ fontSize: '0.9rem', color: '#15803d', margin: '0 0 0.25rem 0' }}>Connection Type: <strong>{waterConnSubmitted.type}</strong></p>
                        <p style={{ fontSize: '0.95rem', color: '#166534', fontWeight: 800, margin: '0.4rem 0 0.75rem 0' }}>Initial Connection Fee: {waterConnSubmitted.amountDue}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setWaterMode('pay');
                            setWaterRrNo(waterConnSubmitted.rrNo);
                            setWaterResult({
                              found: true,
                              rrNo: waterConnSubmitted.rrNo,
                              consumer: waterConnSubmitted.applicant,
                              address: waterConnForm.address,
                              connType: waterConnSubmitted.type,
                              amountDue: waterConnSubmitted.amountDue,
                              feePaid: false,
                              dueDate: '2026-09-15',
                              appNo: waterConnSubmitted.appNo
                            });
                          }}
                          className="btn btn-primary"
                          style={{ background: '#008b95', borderColor: '#008b95', fontSize: '0.85rem', fontWeight: 700 }}
                        >
                          💳 Pay Initial Connection Fee Online Now
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                        {/* REQUIRED DOCUMENTS CHECKLIST BANNER */}
                        <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '1rem 1.15rem', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                            <FileText size={16} /> Official Verification Documents Required:
                          </span>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: '#134e4a', lineHeight: '1.6' }}>
                            <li><strong>1. Property Ownership Proof:</strong> Property Tax e-Khata Certificate, SAS Receipt, or Title / Sale Deed.</li>
                            <li><strong>2. Citizen Identity Proof:</strong> Aadhaar Card, Voter ID, or Passport.</li>
                            <li><strong>3. Site Photo:</strong> Clear photo of property entrance / proposed water meter point.</li>
                          </ul>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Applicant Full Legal Name *</label>
                          <input type="text" required placeholder="Enter applicant name" value={waterConnForm.applicantName} onChange={(e) => setWaterConnForm({ ...waterConnForm, applicantName: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Connection Category & Pipeline Type *</label>
                          <select 
                            value={waterConnForm.connType} 
                            onChange={(e) => setWaterConnForm({ ...waterConnForm, connType: e.target.value })}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: 'white' }}
                          >
                            <option value="Domestic 0.5 inch Pipeline">Domestic 0.5 inch Pipeline (Statutory Connection Fee: ₹1,250.00)</option>
                            <option value="Domestic 1.0 inch High-Capacity Pipeline">Domestic 1.0 inch High-Capacity Pipeline (Statutory Fee: ₹1,800.00)</option>
                            <option value="Commercial / Industrial Pipeline">Commercial / Industrial Pipeline (Statutory Fee: ₹2,500.00)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Installation Property Address *</label>
                          <input type="text" required placeholder="House/Flat No, Street, Ward, Bengaluru" value={waterConnForm.address} onChange={(e) => setWaterConnForm({ ...waterConnForm, address: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                        </div>

                        {/* UPLOAD 1: OWNERSHIP / ID DOCUMENT */}
                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                            📄 1. Property e-Khata / Title Deed / Aadhaar ID (PDF or Image - Optional)
                          </label>
                          <EvidenceUploadInput onEvidenceChange={setWaterDoc} label="Attach Property Tax e-Khata or Title Deed" />
                        </div>

                        {/* UPLOAD 2: SITE PHOTO */}
                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                            📷 2. Property Frontage / Proposed Water Meter Location (Photo Image - Optional)
                          </label>
                          <EvidenceUploadInput onEvidenceChange={setWaterSitePhoto} label="Attach Site Photo of Property / Meter Point" />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95', alignSelf: 'flex-start', fontWeight: 700, marginTop: '0.25rem' }}>
                          ➕ Submit Application & Register Connection
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* SERVICE 4: WASTE MANAGEMENT & SANITATION */}
            {isCategoryVisible('waste-sanitation') && (
              <div id="waste-sanitation" style={{ background: 'white', padding: '2.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                
                {/* Department Header Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '0.35rem 0.85rem', borderRadius: '8px', marginBottom: '0.85rem' }}>
                  <Building2 size={15} style={{ color: '#0f766e' }} />
                  <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f766e' }}>
                    Civil Department (CIVIL-DEPT - Solid Waste Management & Sanitation Wing) | ⏱️ SLA: 24h Resolution
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Truck size={28} style={{ color: '#008b95' }} />
                  <h2 style={{ fontSize: '1.65rem', color: 'var(--color-primary)', margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                    4. Waste Management & Ward Sanitation Portal
                  </h2>
                </div>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.975rem', maxWidth: '750px', lineHeight: '1.5' }}>
                  Select your ward to check daily door-to-door auto-tipper timings, locate Dry Waste Collection Centers (DWCC), book special bulk waste removal, or report overflowing garbage spots.
                </p>

                {/* Sub-Service Navigation Tabs */}
                <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setWasteTab('schedule')} 
                    style={{ 
                      padding: '0.6rem 1.15rem', 
                      borderRadius: '8px', 
                      fontSize: '0.875rem', 
                      fontWeight: 700, 
                      border: wasteTab === 'schedule' ? '2px solid #008b95' : '1px solid #cbd5e1', 
                      background: wasteTab === 'schedule' ? '#008b95' : '#f8fafc', 
                      color: wasteTab === 'schedule' ? 'white' : '#475569', 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Truck size={16} /> 1. Auto-Tipper Ward Schedule
                  </button>

                  <button 
                    onClick={() => setWasteTab('bulk')} 
                    style={{ 
                      padding: '0.6rem 1.15rem', 
                      borderRadius: '8px', 
                      fontSize: '0.875rem', 
                      fontWeight: 700, 
                      border: wasteTab === 'bulk' ? '2px solid #008b95' : '1px solid #cbd5e1', 
                      background: wasteTab === 'bulk' ? '#008b95' : '#f8fafc', 
                      color: wasteTab === 'bulk' ? 'white' : '#475569', 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Recycle size={16} /> 2. Book Bulk Waste Pickup
                  </button>

                  <button 
                    onClick={() => setWasteTab('report')} 
                    style={{ 
                      padding: '0.6rem 1.15rem', 
                      borderRadius: '8px', 
                      fontSize: '0.875rem', 
                      fontWeight: 700, 
                      border: wasteTab === 'report' ? '2px solid #ea580c' : '1px solid #cbd5e1', 
                      background: wasteTab === 'report' ? '#ea580c' : '#f8fafc', 
                      color: wasteTab === 'report' ? 'white' : '#475569', 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <AlertTriangle size={16} /> 3. Report Garbage Blackspot
                  </button>
                </div>

                {/* TAB 1: AUTO-TIPPER WARD SCHEDULE */}
                {wasteTab === 'schedule' && (
                  <div>
                    {/* Ward Selector Header */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                        Select Municipal Ward Jurisdiction:
                      </label>
                      <select
                        value={selectedWardKey}
                        onChange={(e) => setSelectedWardKey(e.target.value)}
                        style={{ maxWidth: '500px', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #008b95', fontSize: '0.95rem', fontWeight: 700, background: 'white', color: '#0b2f45' }}
                      >
                        <option value="112">Ward 112 - Malleshwaram (West Zone)</option>
                        <option value="174">Ward 174 - HSR Layout (South Zone)</option>
                        <option value="150">Ward 150 - Bellandur (Mahadevapura Zone)</option>
                        <option value="84">Ward 84 - Rajajinagar (West Zone)</option>
                        <option value="198">Ward 198 - Hemmigepura (RR Nagar Zone)</option>
                      </select>
                    </div>

                    {/* Rich Schedule Card */}
                    {wardSanitationDatabase[selectedWardKey] && (
                      <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', maxWidth: '800px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0, color: '#0b2f45', fontSize: '1.2rem', fontWeight: 800 }}>
                            📍 Ward {wardSanitationDatabase[selectedWardKey].wardNo} ({wardSanitationDatabase[selectedWardKey].wardName}) Sanitation Roster
                          </h3>
                          <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: 800 }}>
                            ● Active Daily Service
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.775rem', color: '#059669', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                              🚚 DAILY WET WASTE AUTO-TIPPER
                            </span>
                            <strong style={{ fontSize: '0.925rem', color: '#0f172a' }}>{wardSanitationDatabase[selectedWardKey].wetTiming}</strong>
                            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Route: {wardSanitationDatabase[selectedWardKey].tipperRoute}</p>
                          </div>

                          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.775rem', color: '#0284c7', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                              ♻️ DRY WASTE (DWCC) COLLECTION
                            </span>
                            <strong style={{ fontSize: '0.925rem', color: '#0f172a' }}>{wardSanitationDatabase[selectedWardKey].dryTiming}</strong>
                            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Sanitary Waste: {wardSanitationDatabase[selectedWardKey].sanitaryTiming}</p>
                          </div>

                          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                              📍 NEAREST DRY WASTE CENTER (DWCC)
                            </span>
                            <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{wardSanitationDatabase[selectedWardKey].dwccAddress}</strong>
                          </div>

                          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>
                              👨‍✈️ HEALTH INSPECTOR & DRIVER CONTACT
                            </span>
                            <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{wardSanitationDatabase[selectedWardKey].inspector}</strong>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#008b95', fontWeight: 700 }}>📞 {wardSanitationDatabase[selectedWardKey].phone}</p>
                            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.775rem', color: '#64748b' }}>{wardSanitationDatabase[selectedWardKey].vehicle}</p>
                          </div>
                        </div>

                        {/* 3-Way Segregation Protocol Info Banner */}
                        <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '0.9rem 1.15rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <Recycle size={24} style={{ color: '#0f766e', flexShrink: 0 }} />
                          <div style={{ fontSize: '0.825rem', color: '#134e4a', lineHeight: '1.5' }}>
                            <strong>BBMP 3-Way Waste Segregation Protocol:</strong> Please segregate your household waste into <strong>Green Bin (Wet / Kitchen Waste)</strong>, <strong>Blue Bin (Dry / Paper / Plastic)</strong>, and <strong>Red Bag (Sanitary & Hazardous)</strong>. Mixed waste will not be collected.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: BOOK SPECIAL BULK WASTE PICKUP */}
                {wasteTab === 'bulk' && (
                  <form onSubmit={handleBulkSubmit} style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: '12px', border: '1px solid #cbd5e1', maxWidth: '680px' }}>
                    <h3 style={{ color: 'var(--color-primary)', margin: '0 0 0.4rem 0', fontSize: '1.25rem', fontWeight: 800 }}>
                      📦 Book Special Bulk Waste Pickup Service
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                      Schedule doorstep pickup for tree pruning, discarded furniture, demolition rubble, and large household appliances.
                    </p>

                    {bulkSubmitted ? (
                      <div style={{ background: '#f0fff4', padding: '1.25rem', borderRadius: '8px', border: '1px solid #86efac' }}>
                        <h4 style={{ color: '#166534', margin: '0 0 0.4rem 0', fontWeight: 800 }}>✅ Booking Confirmed: {bulkSubmitted.bookingId}</h4>
                        <p style={{ fontSize: '0.875rem', color: '#15803d', margin: '0 0 0.25rem 0' }}>Applicant: <strong>{bulkSubmitted.applicant}</strong> ({bulkSubmitted.ward})</p>
                        <p style={{ fontSize: '0.875rem', color: '#15803d', margin: '0 0 0.25rem 0' }}>Category: <strong>{bulkSubmitted.wasteType}</strong></p>
                        <p style={{ fontSize: '0.875rem', color: '#15803d', margin: '0 0 0.75rem 0' }}>Scheduled Pickup Date: <strong>{bulkSubmitted.pickupDate}</strong></p>
                        <span style={{ fontSize: '0.775rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 800 }}>
                          ● Ward Auto-Tipper Crew Dispatched on Scheduled Morning
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Applicant Legal Name *</label>
                          <input type="text" required placeholder="Enter full name" value={bulkForm.applicantName} onChange={(e) => setBulkForm({ ...bulkForm, applicantName: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                          <div>
                            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Contact Mobile Number *</label>
                            <input type="tel" required placeholder="10-digit mobile" value={bulkForm.mobile} onChange={(e) => setBulkForm({ ...bulkForm, mobile: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Municipal Ward *</label>
                            <select value={bulkForm.ward} onChange={(e) => setBulkForm({ ...bulkForm, ward: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: 'white' }}>
                              <option value="Ward 112 (Malleshwaram)">Ward 112 (Malleshwaram)</option>
                              <option value="Ward 174 (HSR Layout)">Ward 174 (HSR Layout)</option>
                              <option value="Ward 150 (Bellandur)">Ward 150 (Bellandur)</option>
                              <option value="Ward 84 (Rajajinagar)">Ward 84 (Rajajinagar)</option>
                              <option value="Ward 198 (Hemmigepura)">Ward 198 (Hemmigepura)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Bulk Waste Category *</label>
                          <select value={bulkForm.wasteType} onChange={(e) => setBulkForm({ ...bulkForm, wasteType: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: 'white' }}>
                            <option value="Garden / Tree Pruning Waste">🌿 Garden & Tree Pruning Waste</option>
                            <option value="Old Furniture & Mattresses">🛋️ Old Furniture, Mattresses & Wood Items</option>
                            <option value="Renovation & Debris Rubble">🧱 Minor Renovation & Construction Debris</option>
                            <option value="E-Waste & Discarded Appliances">🔌 E-Waste, Electronic Gadgets & Appliances</option>
                          </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                          <div>
                            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Estimated Quantity *</label>
                            <select value={bulkForm.quantity} onChange={(e) => setBulkForm({ ...bulkForm, quantity: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: 'white' }}>
                              <option value="1-2 Large Bags / Medium Load">1–2 Large Bags / Medium Load</option>
                              <option value="3-5 Bags / Heavy Load">3–5 Large Bags / Heavy Load</option>
                              <option value="Full Auto-Tipper Truck Load">Full Auto-Tipper Truck Load</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Preferred Pickup Date *</label>
                            <input type="date" required value={bulkForm.pickupDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setBulkForm({ ...bulkForm, pickupDate: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Doorstep Pickup Address *</label>
                          <input type="text" required placeholder="House/Flat No, Cross Road, Landmark" value={bulkForm.address} onChange={(e) => setBulkForm({ ...bulkForm, address: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>Attach Photo of Bulk Waste (Optional)</label>
                          <EvidenceUploadInput onEvidenceChange={setBulkEvidence} label="Attach Photo of Waste to be Collected" />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95', alignSelf: 'flex-start', fontWeight: 800, padding: '0.75rem 1.4rem', marginTop: '0.35rem' }}>
                          📦 Confirm Bulk Waste Pickup Booking
                        </button>
                      </div>
                    )}
                  </form>
                )}

                {/* TAB 3: REPORT GARBAGE BLACKSPOT / MISSED TIPPER */}
                {wasteTab === 'report' && (
                  <form onSubmit={handleGarbageReportSubmit} style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: '12px', border: '1px solid #cbd5e1', maxWidth: '680px' }}>
                    <h3 style={{ color: '#ea580c', margin: '0 0 0.4rem 0', fontSize: '1.25rem', fontWeight: 800 }}>
                      ⚠️ Report Garbage Blackspot or Missed Auto-Tipper
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                      Report overflowing public garbage bins, roadside dumping spots, or missed morning door-to-door auto-tippers. Civil Sanitation Wing will dispatch cleanup crews within 24 hours.
                    </p>

                    {garbageSubmitted ? (
                      <div style={{ background: '#f0fff4', padding: '1.25rem', borderRadius: '8px', border: '1px solid #86efac' }}>
                        <h4 style={{ color: '#166534', margin: '0 0 0.4rem 0', fontWeight: 800 }}>✅ Complaint Registered: {garbageSubmitted.ticketId}</h4>
                        <p style={{ fontSize: '0.875rem', color: '#15803d', margin: '0 0 0.25rem 0' }}>Issue Type: <strong>{garbageSubmitted.issue}</strong></p>
                        <p style={{ fontSize: '0.875rem', color: '#15803d', margin: '0 0 0.25rem 0' }}>Location: <strong>{garbageSubmitted.location}</strong></p>
                        <p style={{ fontSize: '0.875rem', color: '#15803d', margin: '0 0 0.75rem 0' }}>SLA Target: <strong>Within 24 Hours Clean-up Resolution</strong></p>
                        <span style={{ fontSize: '0.775rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 800 }}>
                          ● Dispatched to Ward Junior Health Inspector
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Sanitation Issue Category *</label>
                          <select value={garbageReportForm.issueType} onChange={(e) => setGarbageReportForm({ ...garbageReportForm, issueType: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: 'white' }}>
                            <option value="Missed Morning Auto-Tipper Collection">🚚 Missed Morning Door-to-Door Auto-Tipper Collection</option>
                            <option value="Roadside Garbage Blackspot / Illegal Dumping">🗑️ Roadside Garbage Blackspot / Illegal Waste Dumping</option>
                            <option value="Overflowing Public Dustbin">📦 Overflowing Public Dustbin / Secondary Collection Bin</option>
                            <option value="Street Sweeping Required">🧹 Street Sweeping & Leaf Debris Cleanup Required</option>
                            <option value="Dead Animal Removal (Urgent)">🚨 Dead Animal Carcass Removal (Urgent Priority)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Municipal Ward *</label>
                          <select value={garbageReportForm.ward} onChange={(e) => setGarbageReportForm({ ...garbageReportForm, ward: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: 'white' }}>
                            <option value="Ward 112 (Malleshwaram)">Ward 112 (Malleshwaram)</option>
                            <option value="Ward 174 (HSR Layout)">Ward 174 (HSR Layout)</option>
                            <option value="Ward 150 (Bellandur)">Ward 150 (Bellandur)</option>
                            <option value="Ward 84 (Rajajinagar)">Ward 84 (Rajajinagar)</option>
                            <option value="Ward 198 (Hemmigepura)">Ward 198 (Hemmigepura)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Exact Location / Street Landmark *</label>
                          <input type="text" required placeholder="e.g. Opposite 14th Cross Bus Stop, Near Margosa Road" value={garbageReportForm.location} onChange={(e) => setGarbageReportForm({ ...garbageReportForm, location: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Detailed Description (Optional)</label>
                          <textarea rows={3} placeholder="Provide details like duration of garbage accumulation..." value={garbageReportForm.description} onChange={(e) => setGarbageReportForm({ ...garbageReportForm, description: e.target.value })} style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>Attach Photo / Video Evidence of Garbage Spot (Optional)</label>
                          <EvidenceUploadInput onEvidenceChange={setGarbageEvidence} label="Attach Photo of Overflowing Garbage Spot" />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ background: '#ea580c', borderColor: '#ea580c', alignSelf: 'flex-start', fontWeight: 800, padding: '0.75rem 1.4rem', marginTop: '0.35rem' }}>
                          🚨 Submit Sanitation Clean-up Request
                        </button>
                      </div>
                    )}
                  </form>
                )}

              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};
