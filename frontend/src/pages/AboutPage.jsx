import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { CTASection } from '../components/CTASection';
import { Building2, Award, Users, Landmark, Target, Compass, ArrowRight, ShieldCheck, TreePine, DollarSign, CheckCircle2, MapPin, Phone, Mail, Sparkles, Clock } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

// Animated Scroll Counter Component
const StatCounter = ({ end, decimals = 0, prefix = '', suffix = '' }) => {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    const increment = (end - start) / steps;
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, end]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};

export const AboutPage = ({ onNavigate }) => {
  const { data } = useMunicipalData();

  // Curated Authentic Bengaluru BBMP Department Photos
  const deptPhotos = [
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80", // Vidhana Soudha & Commissioner
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", // Bengaluru Town Hall
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", // BBMP Revenue & e-Khata Tower
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80", // Tender SURE Public Works
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80", // Town Planning & Building Approvals
    "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80", // Emergency Safety & Solid Waste
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80", // Cubbon Park & Lakes Division
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"  // BBMP Health & Namma Clinics Hub
  ];

  return (
    <div id="main-content">
      {/* 1. Page Hero Banner with Animated Ambient Glow */}
      <div className="about-hero-banner">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Breadcrumb items={[{ label: 'About BBMP Bengaluru' }]} onNavigate={onNavigate} />
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 139, 149, 0.25)', color: '#38bdf8', padding: '0.4rem 1.1rem', borderRadius: '30px', fontWeight: 800, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.35)', boxShadow: '0 4px 14px rgba(0, 139, 149, 0.2)' }}>
            <Sparkles size={15} style={{ color: '#38bdf8' }} />
            Government of Karnataka • Official Municipal Portal
          </div>

          <h1 className="page-hero-title" style={{ marginTop: '0.85rem', fontSize: '2.8rem', color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            About Bruhat Bengaluru Mahanagara Palike (BBMP)
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '750px', lineHeight: '1.7', marginTop: '0.5rem' }}>
            Explore our rich 490+ year heritage, digital SAS e-Khata governance reforms, 243 municipal ward divisions, and transformative urban infrastructure projects across Namma Bengaluru.
          </p>
        </div>
      </div>

      {/* 2. Interactive Sticky Quick-Jump Navigation Bar */}
      <div className="about-hero-pill-nav">
        <div className="container" style={{ display: 'flex', gap: '0.85rem', overflowX: 'auto', flexWrap: 'nowrap', scrollbarWidth: 'none', padding: '0.2rem 0' }}>
          {[
            { label: '🏛️ BBMP Profile', href: '#overview' },
            { label: '🎯 Mission & Vision', href: '#mission' },
            { label: '⚡ 4 Pillars', href: '#pillars' },
            { label: '📜 490+ Yrs History', href: '#history' },
            { label: '📊 Key Statistics', href: '#stats' },
            { label: '🏢 Municipal Divisions', href: '#departments' }
          ].map((nav, idx) => (
            <a key={idx} href={nav.href} className="about-pill-btn">
              {nav.label}
            </a>
          ))}
        </div>
      </div>

      {/* 3. Section Overview */}
      <section id="overview" style={{ padding: '5.5rem 0', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#008b95', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} />
              Welcome to Namma Bengaluru
            </div>

            <h2 style={{ fontSize: '2.5rem', color: '#0b2f45', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)', lineHeight: '1.2', fontWeight: 800 }}>
              Bruhat Bengaluru Mahanagara Palike (BBMP)
            </h2>

            <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
              Founded in 1537 by Kempe Gowda I, Bengaluru has evolved from a historic mud-fort settlement into India's premier IT capital and global megacity. Bruhat Bengaluru Mahanagara Palike (BBMP) is the statutory civic body responsible for administrative governance across 8 zones and 243 municipal wards.
            </p>

            <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
              BBMP administers civic services for over 13.5 million residents—overseeing automated property tax (SAS e-Khata), Tender SURE pedestrian road networks, Namma Clinics, zero-waste processing, and the ecological rejuvenation of heritage lakes like Ulsoor and Sankey Tank.
            </p>

            {/* Achievement Badges with Hover Elevation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="about-pillar-card" style={{ padding: '1.15rem 1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(0, 139, 149, 0.12)', color: '#008b95', padding: '0.75rem', borderRadius: '10px', flexShrink: 0 }}>
                  <Award size={26} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0b2f45', fontWeight: 800 }}>India's #1 Tech Capital</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Silicon Valley of Asia 2026</span>
                </div>
              </div>

              <div className="about-pillar-card" style={{ padding: '1.15rem 1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a', padding: '0.75rem', borderRadius: '10px', flexShrink: 0 }}>
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0b2f45', fontWeight: 800 }}>100% Digital e-Khata</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Automated SAS Verification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Showcase with Ambient Cyan Glow */}
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0, 139, 149, 0.22), 0 10px 20px rgba(11, 47, 69, 0.18)', border: '2px solid rgba(255, 255, 255, 0.8)' }}>
            <img 
              src="/bbmp-head-office.png" 
              alt="BBMP Head Office Secretariat Bengaluru" 
              style={{ width: '100%', height: '460px', objectFit: 'cover', display: 'block', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            />
            
            <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', background: 'rgba(11, 47, 69, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', color: '#ffffff', padding: '1.15rem 1.4rem', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
              <div>
                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>BBMP Head Office Secretariat</h5>
                <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>Hudson Circle / N.R. Square, Central Bengaluru</span>
              </div>
              <div style={{ background: 'rgba(0, 139, 149, 0.35)', color: '#38bdf8', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                <Landmark size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mission & Vision */}
      <section id="mission" style={{ padding: '5.5rem 0', background: 'linear-gradient(180deg, #f8fafc 0%, #f0f7fc 100%)' }}>
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-badge" style={{ background: 'rgba(0, 139, 149, 0.1)', color: '#008b95', borderColor: 'rgba(0, 139, 149, 0.2)' }}>
              <Target size={15} /> Guiding Principles
            </span>
            <h2 className="about-section-title">BBMP Mission & Strategic Vision</h2>
            <p className="about-section-subtitle">Guiding principles driving transparent governance, public safety, and sustainable urban mobility for Bengaluru.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
            {/* Mission Card */}
            <div className="about-card-glass" style={{ borderLeft: '6px solid #0b2f45', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #0b2f45 0%, #00485c 100%)', color: '#ffffff', padding: '0.85rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(11, 47, 69, 0.2)' }}>
                  <Target size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.65rem', color: '#0b2f45', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>Our Core Mission</h3>
                  <span style={{ fontSize: '0.825rem', color: '#008b95', fontWeight: 800, letterSpacing: '0.5px' }}>TRANSPARENT CIVIC SERVICE</span>
                </div>
              </div>

              <p style={{ color: '#475569', lineHeight: '1.85', fontSize: '1.05rem', margin: 0 }}>
                "To deliver responsive, transparent, and digitized municipal public services that strengthen Bengaluru's infrastructure, protect lake ecosystems, upgrade public health via Namma Clinics, and enhance quality of life across all 243 wards."
              </p>
            </div>

            {/* Vision Card */}
            <div className="about-card-glass" style={{ borderLeft: '6px solid #008b95', background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #008b95 0%, #16a34a 100%)', color: '#ffffff', padding: '0.85rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 139, 149, 0.25)' }}>
                  <Compass size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.65rem', color: '#0b2f45', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>Bengaluru 2030 Vision</h3>
                  <span style={{ fontSize: '0.825rem', color: '#16a34a', fontWeight: 800, letterSpacing: '0.5px' }}>SMART & SUSTAINABLE METROPOLIS</span>
                </div>
              </div>

              <p style={{ color: '#475569', lineHeight: '1.85', fontSize: '1.05rem', margin: 0 }}>
                "Namma Bengaluru will stand as a benchmark global Smart City—celebrated for Tender SURE pedestrian walkways, rejuvenated lakes, zero-waste Ward management, and 100% digital e-Khata civic delivery."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Four Pillars of Municipal Governance */}
      <section id="pillars" style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-badge" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', borderColor: 'rgba(22, 163, 74, 0.2)' }}>
              <ShieldCheck size={15} /> Core Pillars
            </span>
            <h2 className="about-section-title">4 Pillars of BBMP Governance</h2>
            <p className="about-section-subtitle">The strategic pillars ensuring transparent, citizen-centric, and green municipal administration.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.75rem' }}>
            {[
              { icon: Sparkles, title: "1. Digital-First Governance", desc: "100% paperless SAS e-Khata, online property tax payments, and automated digital receipts.", color: "#008b95", bg: "#f0fdfa" },
              { icon: TreePine, title: "2. Green Urban Ecology", desc: "Protection of 180+ lakes, urban afforestation drives, and single-use plastic eradication.", color: "#16a34a", bg: "#f0fdf4" },
              { icon: ShieldCheck, title: "3. Rapid 24/7 Redressal", desc: "48-hour SLA resolution for citizen road, drainage, and street lighting grievances via Sahaaya 2.0.", color: "#0284c7", bg: "#f0f9ff" },
              { icon: Building2, title: "4. Modern Infrastructure", desc: "Tender SURE pedestrian walkways, flood-mitigating stormwater drain telemetry, and Namma Clinics.", color: "#d97706", bg: "#fffbeb" }
            ].map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div key={idx} className="about-pillar-card" style={{ background: p.bg, borderColor: 'rgba(0,0,0,0.06)' }}>
                  <div style={{ background: 'white', color: p.color, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.15rem', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <IconComp size={24} />
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#0b2f45', fontSize: '1.15rem', fontWeight: 800 }}>{p.title}</h4>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', flex: 1 }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Animated Interactive History Timeline */}
      <section id="history" style={{ padding: '5.5rem 0', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-badge" style={{ background: 'rgba(11, 47, 69, 0.08)', color: '#0b2f45', borderColor: 'rgba(11, 47, 69, 0.18)' }}>
              <Clock size={15} /> Historical Evolution
            </span>
            <h2 className="about-section-title">490+ Years of Bengaluru Heritage</h2>
            <p className="about-section-subtitle">Key historical milestones defining Bengaluru's transformation from Kempe Gowda's fort to BBMP Metropolis.</p>
          </div>

          <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
            {/* Continuous Timeline Line Accent */}
            <div style={{ position: 'absolute', top: '2rem', bottom: '2rem', left: '38px', width: '4px', background: 'linear-gradient(180deg, #0b2f45 0%, #008b95 50%, #16a34a 100%)', borderRadius: '2px', zIndex: 0 }} />

            {[
              { year: "1537", title: "Founding of Bengaluru Mud Fort", desc: "Feudatory ruler Kempe Gowda I establishes Bengaluru mud fort and constructs 4 iconic boundary watchtowers to guide city growth." },
              { year: "1949", title: "Formation of Bengaluru City Corporation (BCC)", desc: "City of Bangalore Municipal Corporation established by merging the historic City Municipality and Cantonment Civil Station." },
              { year: "2007", title: "Creation of Bruhat Bengaluru Mahanagara Palike (BBMP)", desc: "BBMP incorporated by expanding jurisdiction over 100 existing wards, 7 City Municipal Councils (CMCs), 1 TMC, and 110 surrounding villages." },
              { year: "2026", title: "Namma SAS e-Khata & Smart City Era", desc: "100% digital e-Khata property registry, 243 ward expansion, and real-time IoT stormwater flood mitigation telemetry." }
            ].map((item, idx) => (
              <div key={idx} className="about-timeline-card" style={{ zIndex: 1, paddingLeft: '6rem' }}>
                <div style={{ position: 'absolute', left: '12px', top: '1.5rem', background: 'linear-gradient(135deg, #0b2f45 0%, #008b95 100%)', color: '#ffffff', fontWeight: 800, padding: '0.45rem 0.95rem', borderRadius: '24px', fontSize: '0.95rem', border: '3px solid #ffffff', boxShadow: '0 4px 14px rgba(0, 139, 149, 0.3)' }}>
                  {item.year}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.25rem', color: '#0b2f45', fontWeight: 800 }}>{item.title}</h4>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.975rem', lineHeight: '1.7' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. High-Impact Animated Key Statistics Grid */}
      <section id="stats" style={{ padding: '5.5rem 0', background: 'linear-gradient(135deg, #071f2c 0%, #0b2f45 50%, #003645 100%)', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="about-section-header dark">
            <span className="about-section-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <Sparkles size={15} /> Real-Time Metrics
            </span>
            <h2 className="about-section-title">BBMP By The Numbers</h2>
            <p className="about-section-subtitle">Key metrics reflecting Bengaluru's municipal scale and civic performance.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem' }}>
            {/* Card 1: Citizens */}
            <div className="about-stat-card">
              <Users size={36} style={{ color: '#38bdf8', margin: '0 auto 0.75rem' }} />
              <div className="about-stat-number" style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff', lineHeight: '1', whiteSpace: 'nowrap' }}>
                <StatCounter end={13.5} decimals={1} suffix="M+" />
              </div>
              <div style={{ color: '#38bdf8', fontWeight: 800, marginTop: '0.75rem', fontSize: '0.95rem', letterSpacing: '0.5px' }}>Namma Bengaluru Citizens</div>
            </div>

            {/* Card 2: Wards */}
            <div className="about-stat-card">
              <TreePine size={36} style={{ color: '#38bdf8', margin: '0 auto 0.75rem' }} />
              <div className="about-stat-number" style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff', lineHeight: '1', whiteSpace: 'nowrap' }}>
                <StatCounter end={243} />
              </div>
              <div style={{ color: '#38bdf8', fontWeight: 800, marginTop: '0.75rem', fontSize: '0.95rem', letterSpacing: '0.5px' }}>Municipal Wards</div>
            </div>

            {/* Card 3: Annual Budget */}
            <div className="about-stat-card">
              <DollarSign size={36} style={{ color: '#38bdf8', margin: '0 auto 0.75rem' }} />
              <div className="about-stat-number" style={{ fontSize: '2.3rem', fontWeight: 800, color: '#ffffff', lineHeight: '1', whiteSpace: 'nowrap' }}>
                <StatCounter end={12500} prefix="₹" suffix=" Cr" />
              </div>
              <div style={{ color: '#38bdf8', fontWeight: 800, marginTop: '0.75rem', fontSize: '0.95rem', letterSpacing: '0.5px' }}>Annual BBMP Budget</div>
            </div>

            {/* Card 4: Resolution */}
            <div className="about-stat-card">
              <CheckCircle2 size={36} style={{ color: '#38bdf8', margin: '0 auto 0.75rem' }} />
              <div className="about-stat-number" style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff', lineHeight: '1', whiteSpace: 'nowrap' }}>
                <StatCounter end={99.4} decimals={1} suffix="%" />
              </div>
              <div style={{ color: '#38bdf8', fontWeight: 800, marginTop: '0.75rem', fontSize: '0.95rem', letterSpacing: '0.5px' }}>Digital e-Khata Resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Municipal Departments Grid - Sleek High-Contrast Photo Zoom Cards */}
      <section id="departments" style={{ padding: '5.5rem 0', background: 'linear-gradient(180deg, #f8fafc 0%, #f0f7fc 100%)' }}>
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-badge" style={{ background: 'rgba(0, 139, 149, 0.1)', color: '#008b95', borderColor: 'rgba(0, 139, 149, 0.2)' }}>
              <Building2 size={15} /> Citywide Operations
            </span>
            <h2 className="about-section-title">BBMP Administrative Divisions</h2>
            <p className="about-section-subtitle">Specialized municipal departments serving Bengaluru citizens daily across all 8 zones.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {(data?.departments && data.departments.length >= 8 ? data.departments : [
              { name: "Executive Commissioner's Office", phone: "(080) 2297 5555", email: "commissioner@bbmp.gov.in" },
              { name: "BBMP Council & Town Hall Secretariat", phone: "+91 (080) 2297-5501", email: "council@bbmp.gov.in" },
              { name: "Revenue & Property Tax (SAS e-Khata)", phone: "+91 (080) 2297-5520", email: "revenue@bbmp.gov.in" },
              { name: "Public Works & Tender SURE Roads", phone: "+91 (080) 2297-5540", email: "engineer@bbmp.gov.in" },
              { name: "Town Planning & Building Approvals", phone: "+91 (080) 2297-5560", email: "townplanning@bbmp.gov.in" },
              { name: "Solid Waste Management & Health", phone: "+91 (080) 2297-5580", email: "swm@bbmp.gov.in" },
              { name: "Lakes & Urban Forestry Division", phone: "+91 (080) 2297-5600", email: "forest@bbmp.gov.in" },
              { name: "BBMP Health & Namma Clinics", phone: "+91 (080) 2297-5620", email: "health@bbmp.gov.in" }
            ]).map((dept, idx) => {
              const bgPhoto = deptPhotos[idx % deptPhotos.length];
              return (
                <a
                  key={idx}
                  href="/contact"
                  className="hdir-card group"
                  style={{ animation: 'none', opacity: 1, height: '300px' }}
                  onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}
                >
                  {/* Full cover image with zoom effect */}
                  <img
                    src={bgPhoto}
                    alt={dept.name}
                    className="hdir-card-img"
                    loading="lazy"
                  />

                  {/* High-Contrast Mixed Shadow Gradient Overlay */}
                  <div className="hdir-card-overlay" />

                  {/* Category Pill Top Left */}
                  <span className="hdir-card-category-pill">
                    BBMP DIVISION
                  </span>

                  {/* Text info at bottom with ultra-high contrast shadow */}
                  <div className="hdir-card-info">
                    <h3 className="hdir-card-title">{dept.name}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem' }}>
                      <p className="hdir-card-address" style={{ margin: 0 }}>
                        <Phone size={13} strokeWidth={2.2} />
                        <span>{dept.phone}</span>
                      </p>
                      <p className="hdir-card-address" style={{ margin: 0 }}>
                        <Mail size={13} strokeWidth={2.2} />
                        <span>{dept.email}</span>
                      </p>
                    </div>

                    <span className="hdir-card-action" style={{ marginTop: '0.4rem' }}>
                      <span>Contact Division</span>
                      <ArrowRight size={14} className="action-arrow" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Call to Action Banner */}
      <CTASection onNavigate={onNavigate} />
    </div>
  );
};
