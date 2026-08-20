import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette Constants
    COLOR_NAVY = RGBColor(11, 47, 69)        # #0B2F45
    COLOR_DARK_NAVY = RGBColor(7, 31, 43)   # #071F2B
    COLOR_CYAN = RGBColor(0, 139, 149)       # #008B95
    COLOR_LIGHT_CYAN = RGBColor(56, 189, 248)# #38BDF8
    COLOR_GOLD = RGBColor(217, 119, 6)       # #D97706
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_LIGHT_BG = RGBColor(248, 250, 252) # #F8FAFC
    COLOR_CARD_BG = RGBColor(255, 255, 255)
    COLOR_CARD_BORDER = RGBColor(226, 232, 240)
    COLOR_TEXT_MAIN = RGBColor(15, 23, 42)
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)
    COLOR_EMERALD = RGBColor(16, 185, 129)

    def add_header(slide, title_text, category_text="MUNICIPALITY AUTOMATION SUITE"):
        # Header category pill
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_CYAN

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.733), Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_NAVY

        # Subtle decorative divider line
        line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.45), Inches(11.733), Inches(0.02)
        )
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_CYAN
        line.line.color.rgb = COLOR_CYAN

    def add_card(slide, left, top, width, height, title, items, badge=None, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER, title_color=COLOR_NAVY):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.22)
        tf.margin_bottom = Inches(0.22)

        # Optional Badge
        if badge:
            p_badge = tf.paragraphs[0]
            p_badge.text = badge.upper()
            p_badge.font.size = Pt(9.5)
            p_badge.font.bold = True
            p_badge.font.color.rgb = COLOR_CYAN
            p_title = tf.add_paragraph()
        else:
            p_title = tf.paragraphs[0]

        p_title.text = title
        p_title.font.size = Pt(15)
        p_title.font.bold = True
        p_title.font.color.rgb = title_color
        p_title.space_after = Pt(8)

        for item in items:
            p_item = tf.add_paragraph()
            p_item.text = f"• {item}"
            p_item.font.size = Pt(11)
            p_item.font.color.rgb = COLOR_TEXT_MAIN if bg_color == COLOR_WHITE else COLOR_WHITE
            p_item.space_after = Pt(4)

        return card

    # ==========================================
    # SLIDE 1: TITLE SLIDE (Dark Premium Hero Theme)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_NAVY
    bg1.line.fill.background()

    # Decorative Cyan Accent Strip
    strip = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.35), Inches(7.5))
    strip.fill.solid()
    strip.fill.fore_color.rgb = COLOR_CYAN
    strip.line.fill.background()

    # Title Text Frame
    tb1 = s1.shapes.add_textbox(Inches(1.2), Inches(1.3), Inches(11.0), Inches(4.8))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p1 = tf1.paragraphs[0]
    p1.text = "🏛️ GOVERNMENT & MUNICIPAL CORPORATION AUTOMATION PORTAL"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_LIGHT_CYAN
    p1.space_after = Pt(14)

    p2 = tf1.add_paragraph()
    p2.text = "Comprehensive Digital Governance & Municipal Operations Suite"
    p2.font.size = Pt(32)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE
    p2.space_after = Pt(16)

    p3 = tf1.add_paragraph()
    p3.text = "End-to-End E-Governance Platform for Citizens, Municipal Officers & Administrators with Cloud PostgreSQL, Cloudinary Media CDN, and Multi-Device Responsive Architecture."
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(203, 213, 225)
    p3.space_after = Pt(36)

    # Tech Stack Badges
    p4 = tf1.add_paragraph()
    p4.text = "⚡ TECH STACK:  React 18  |  Vite  |  Django REST Framework  |  Supabase PostgreSQL  |  Cloudinary CDN  |  Vercel"
    p4.font.size = Pt(12)
    p4.font.bold = True
    p4.font.color.rgb = COLOR_GOLD

    # ==========================================
    # SLIDE 2: EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Executive Summary & Problem Statement", "PROJECT BACKGROUND")

    add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "Traditional Municipal Challenges",
             [
                 "Manual paper-based grievance submission with no tracking.",
                 "High turnaround delays for civic approvals (birth/death, permits, water).",
                 "Lack of photo & GPS geotagging evidence for road & streetlight issues.",
                 "Zero transparency into municipal officer review workflows.",
                 "Siloed departmental data leading to bureaucratic bottlenecks.",
                 "Non-responsive legacy portals failing on mobile/tablet viewports."
             ],
             badge="PROBLEM CONTEXT",
             border_color=RGBColor(254, 202, 202))

    add_card(s2, Inches(6.9), Inches(1.8), Inches(5.6), Inches(5.0),
             "Our Digital Automation Solution",
             [
                 "100% Paperless online citizen application & tracking pipeline.",
                 "Real-time dynamic timeline stepper with SLA milestone status.",
                 "Direct camera & GPS geotagged photo evidence upload via Cloudinary.",
                 "Dedicated Officer Review & Verification Action Suite.",
                 "Super Admin & Department CMS with role-based access control.",
                 "Mobile-first, touch-friendly UI optimized across Desktop, Tablet & Phone."
             ],
             badge="PROPOSED SOLUTION",
             border_color=RGBColor(187, 247, 208))

    # ==========================================
    # SLIDE 3: SYSTEM ARCHITECTURE & DATA FLOW
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "High-Level System Architecture & Infrastructure", "ARCHITECTURE & DESIGN")

    add_card(s3, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Frontend Client Suite",
             [
                 "React 18 Single Page App (SPA)",
                 "Vite Lightning Fast Bundler",
                 "Context API State Management",
                 "Lucide Modern Vector Icons",
                 "Responsive Design System (Fluid Typography, Mobile Drawer, Touch Grids)",
                 "Vercel Edge SPA Hosting"
             ],
             badge="PRESENTATION LAYER")

    add_card(s3, Inches(4.85), Inches(1.8), Inches(3.6), Inches(5.0),
             "Backend API & Services",
             [
                 "Django 5.x & REST Framework",
                 "Role-Based Access Control (RBAC)",
                 "JSON REST Endpoints for Services, Users, Grievances, Notices",
                 "Whitenoise Static Asset Serving",
                 "CORS & CSRF Security Policies",
                 "Vercel Serverless Python WSGI"
             ],
             badge="BUSINESS LOGIC LAYER")

    add_card(s3, Inches(8.9), Inches(1.8), Inches(3.6), Inches(5.0),
             "Cloud Data & Media",
             [
                 "Supabase PostgreSQL (Cloud SQL)",
                 "Relational Schema with 19 Migrations",
                 "Cloudinary Media CDN Pipeline",
                 "Direct HTTPS Optimized Media CDN",
                 "Encapsulated .env Secret Security",
                 "Automatic Daily Cloud Backups"
             ],
             badge="DATA & MEDIA LAYER")

    # ==========================================
    # SLIDE 4: CITIZEN EXPERIENCE & CIVIC MODULES
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Citizen Portal & Civic Services Modules", "CITIZEN EXPERIENCE")

    add_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.35),
             "Roads, Potholes & Streetlights",
             [
                 "FixMyCity GPS pinpointing with landmark address tracking.",
                 "Camera / Gallery upload for visual defect evidence.",
                 "Automatic priority classification and ward assignment."
             ],
             badge="CIVIL INFRASTRUCTURE")

    add_card(s4, Inches(6.9), Inches(1.8), Inches(5.6), Inches(2.35),
             "Birth & Death Certificate Registry",
             [
                 "Digital registration with hospital verification references.",
                 "Parent / informant identity uploads and affidavit records.",
                 "Instant official PDF receipt download upon approval."
             ],
             badge="VITAL STATISTICS")

    add_card(s4, Inches(0.8), Inches(4.45), Inches(5.6), Inches(2.35),
             "Water Connection & Sewerage",
             [
                 "New pipeline application with pipeline distance estimations.",
                 "Property Khata certificate verification and bill estimates.",
                 "Connection meter scheduling and inspection tracker."
             ],
             badge="WATER UTILITIES")

    add_card(s4, Inches(6.9), Inches(4.45), Inches(5.6), Inches(2.35),
             "Solid Waste & Tipper Schedules",
             [
                 "Live micro-route tipper timings for all city wards.",
                 "Door-to-door wet / dry waste segregation guides.",
                 "Garbage blackspot reporting with cleanup SLAs."
             ],
             badge="ENVIRONMENT & SANITATION")

    # ==========================================
    # SLIDE 5: OFFICER & SUPER ADMIN DASHBOARDS
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Officer Workflow & Super Admin CMS Portals", "ADMINISTRATION & WORKFLOWS")

    add_card(s5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "Officer Review & Inspection Suite",
             [
                 "Real-time Queue: Filter applications by Ward, Status, or Priority.",
                 "Inspection Tool: Verify citizen evidence, GPS coordinates & timestamps.",
                 "State Machine Workflow: Submitted ➔ Under Review ➔ Action Taken ➔ Resolved.",
                 "Resolution Logging: Attach internal officer notes and resolution remarks.",
                 "Audit Tracking: Officer identity logged with every workflow state change."
             ],
             badge="MUNICIPAL OFFICERS",
             bg_color=COLOR_WHITE)

    add_card(s5, Inches(6.9), Inches(1.8), Inches(5.6), Inches(5.0),
             "Super Admin Master CMS",
             [
                 "Role-Based Access Control: Manage Super Admins, Dept Admins, Officers, Citizens.",
                 "City Corporations CMS: Manage 5 City Corporations and 198 BBMP Wards.",
                 "Department CMS: Add/Edit municipal department directories and contacts.",
                 "Notices & Events CMS: Publish emergency alerts, town hall schedules & gazettes.",
                 "System Analytics: View real-time application throughput & SLA metrics."
             ],
             badge="SUPER ADMINISTRATOR",
             bg_color=COLOR_WHITE)

    # ==========================================
    # SLIDE 6: PUBLIC PORTAL & INTERACTIVE GIS MAPS
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Public Portal, Directory & Interactive GIS Mapping", "PUBLIC SERVICES")

    add_card(s6, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Interactive GIS Landmark Map",
             [
                 "Interactive visual ward map with municipal landmarks.",
                 "Pin Overlay Cards with location details.",
                 "RHS 'Get Directions' route planning button.",
                 "Custom markers for BBMP Head Office, Town Hall, Clinics & Parks."
             ],
             badge="GIS MAPPING")

    add_card(s6, Inches(4.85), Inches(1.8), Inches(3.6), Inches(5.0),
             "Municipal Directory & News",
             [
                 "Comprehensive directory of municipal departments and officials.",
                 "Town hall public hearing schedules & cultural event calendars.",
                 "Categorized official press releases and tender notices.",
                 "Downloadable government forms and bylaws."
             ],
             badge="PUBLIC RECORDS")

    add_card(s6, Inches(8.9), Inches(1.8), Inches(3.6), Inches(5.0),
             "24/7 Citizen Helplines",
             [
                 "Integrated BBMP Sahaya Control Room (1533).",
                 "Quick emergency call buttons on mobile drawer and header.",
                 "Real-time alert marquee for weather and civic advisories.",
                 "Public grievance escalation cell."
             ],
             badge="EMERGENCY CELL")

    # ==========================================
    # SLIDE 7: CLOUD INTEGRATIONS & SECURITY
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Cloud Integrations, Database & Security Architecture", "CLOUD INFRASTRUCTURE")

    add_card(s7, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Supabase PostgreSQL",
             [
                 "Managed Cloud PostgreSQL instance.",
                 "Connected via dj-database-url connection pooling.",
                 "19 Applied migrations for users, services, grievances, CMS.",
                 "Zero local SQLite dependencies.",
                 "ACID compliant transactional safety."
             ],
             badge="DATABASE LAYER")

    add_card(s7, Inches(4.85), Inches(1.8), Inches(3.6), Inches(5.0),
             "Cloudinary Media CDN",
             [
                 "All static images and uploads served via Cloudinary CDN.",
                 "HTTPS global edge media acceleration.",
                 "Zero local storage bloat on server.",
                 "Automatic responsive image optimization and format conversion."
             ],
             badge="MEDIA ASSETS")

    add_card(s7, Inches(8.9), Inches(1.8), Inches(3.6), Inches(5.0),
             "Security & Zero Secret Leakage",
             [
                 "All secret keys encapsulated inside protected .env files.",
                 ".gitignore rules blocking credentials from Git repos.",
                 "CORS & CSRF trusted origin whitelisting on production.",
                 "Hashed user passwords and token authentication."
             ],
             badge="DEVSECOPS")

    # ==========================================
    # SLIDE 8: MULTI-DEVICE RESPONSIVE ENGINEERING
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Multi-Device Responsive Design Architecture", "RESPONSIVE UI/UX")

    add_card(s8, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Desktop (> 1024px)",
             [
                 "Widescreen 4-column card grids.",
                 "Fixed sticky citizen dashboard sidebar navigation.",
                 "Full horizontal navigation bar with dropdown menus.",
                 "Expanded data tables with multi-field filtering."
             ],
             badge="DESKTOP VIEWPORT")

    add_card(s8, Inches(4.85), Inches(1.8), Inches(3.6), Inches(5.0),
             "Tablet (768px – 1024px)",
             [
                 "Adaptive 2-column card layouts.",
                 "Hamburger navigation drawer toggle.",
                 "Horizontally scrollable category filter tabs.",
                 "Compact modal overlays."
             ],
             badge="TABLET VIEWPORT")

    add_card(s8, Inches(8.9), Inches(1.8), Inches(3.6), Inches(5.0),
             "Mobile Phone (< 768px)",
             [
                 "1-Column vertical stacking for easy single-thumb scrolling.",
                 "Full-screen slide-out mobile drawer with active user status.",
                 "17.5px root font scaling for large, readable text.",
                 "Touch-momentum scrollable tables and 48px touch targets."
             ],
             badge="MOBILE VIEWPORT")

    # ==========================================
    # SLIDE 9: PRODUCTION DEPLOYMENTS & LIVE URLS
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Production Deployments & GitHub Repository", "DEPLOYMENT & ACCESS")

    add_card(s9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.35),
             "Frontend Web Application",
             [
                 "Production URL: https://municipality-automation-frontend.vercel.app/",
                 "Hosting Platform: Vercel SPA Edge Network",
                 "Framework: React 18 + Vite (Vercel rewrite routing)"
             ],
             badge="FRONTEND LIVE URL",
             bg_color=RGBColor(240, 253, 250),
             border_color=COLOR_CYAN)

    add_card(s9, Inches(6.9), Inches(1.8), Inches(5.6), Inches(2.35),
             "Backend REST API",
             [
                 "Production URL: https://municipality-automation-backend.vercel.app/",
                 "Hosting Platform: Vercel Python Serverless WSGI",
                 "Framework: Django 5.x REST Framework"
             ],
             badge="BACKEND LIVE API",
             bg_color=RGBColor(240, 253, 250),
             border_color=COLOR_CYAN)

    add_card(s9, Inches(0.8), Inches(4.45), Inches(5.6), Inches(2.35),
             "GitHub Source Code Repository",
             [
                 "Repository: https://github.com/pratiksha-harode005/municipality_automation.git",
                 "Branch: main",
                 "Includes full frontend/ and backend/ monorepo structure."
             ],
             badge="SOURCE CODE",
             bg_color=RGBColor(254, 243, 199),
             border_color=COLOR_GOLD)

    add_card(s9, Inches(6.9), Inches(4.45), Inches(5.6), Inches(2.35),
             "Cloud Database & Media",
             [
                 "Database: Supabase PostgreSQL (db.mkdfnmhizdaqaejmitjy.supabase.co)",
                 "Media CDN: Cloudinary (cloudinary://.../mcizaxyv)"
             ],
             badge="CLOUD STORAGE",
             bg_color=RGBColor(241, 245, 249),
             border_color=COLOR_NAVY)

    # ==========================================
    # SLIDE 10: FUTURE ROADMAP & INNOVATION
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Future Roadmap & Innovation Potential", "FUTURE ENHANCEMENTS")

    add_card(s10, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "AI Pothole & Defect Detection",
             [
                 "Computer Vision model analyzing citizen photo uploads.",
                 "Automatic depth and severity classification.",
                 "Auto-prioritizing critical road hazards for rapid repair."
             ],
             badge="ARTIFICIAL INTELLIGENCE")

    add_card(s10, Inches(4.85), Inches(1.8), Inches(3.6), Inches(5.0),
             "WhatsApp Civic Bot",
             [
                 "File complaints directly via WhatsApp message.",
                 "Instant status lookups by typing grievance tracking ID.",
                 "Automated SMS/WhatsApp broadcast on grievance resolution."
             ],
             badge="CONVERSATIONAL UI")

    add_card(s10, Inches(8.9), Inches(1.8), Inches(3.6), Inches(5.0),
             "IoT Smart Waste Integration",
             [
                 "Smart bin fill-level sensors triggering tipper pickups.",
                 "Real-time GPS tipper tracking on interactive citizen map.",
                 "Carbon footprint & recycling incentive reward points."
             ],
             badge="IOT & SMART CITY")

    # ==========================================
    # SLIDE 11: CONCLUSION & THANK YOU
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    bg11 = s11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg11.fill.solid()
    bg11.fill.fore_color.rgb = COLOR_NAVY
    bg11.line.fill.background()

    strip11 = s11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.35), Inches(7.5))
    strip11.fill.solid()
    strip11.fill.fore_color.rgb = COLOR_CYAN
    strip11.line.fill.background()

    tb11 = s11.shapes.add_textbox(Inches(1.5), Inches(1.8), Inches(10.5), Inches(4.0))
    tf11 = tb11.text_frame
    tf11.word_wrap = True

    p11_1 = tf11.paragraphs[0]
    p11_1.text = "THANK YOU!"
    p11_1.font.size = Pt(40)
    p11_1.font.bold = True
    p11_1.font.color.rgb = COLOR_WHITE
    p11_1.space_after = Pt(14)

    p11_2 = tf11.add_paragraph()
    p11_2.text = "Municipal Corporation Automation Suite — Empowering Smart, Transparent & Accessible E-Governance."
    p11_2.font.size = Pt(18)
    p11_2.font.color.rgb = COLOR_LIGHT_CYAN
    p11_2.space_after = Pt(28)

    p11_3 = tf11.add_paragraph()
    p11_3.text = "🌐 Live App: https://municipality-automation-frontend.vercel.app/\n📦 Repository: https://github.com/pratiksha-harode005/municipality_automation.git"
    p11_3.font.size = Pt(13)
    p11_3.font.color.rgb = RGBColor(226, 232, 240)
    p11_3.space_after = Pt(20)

    p11_4 = tf11.add_paragraph()
    p11_4.text = "Questions & Feedback Welcome!"
    p11_4.font.size = Pt(15)
    p11_4.font.bold = True
    p11_4.font.color.rgb = COLOR_GOLD

    output_path = os.path.abspath("Municipality_Automation_Project_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully at: {output_path}")

if __name__ == "__main__":
    create_deck()
