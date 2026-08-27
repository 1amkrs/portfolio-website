export const projects = [
  {
    id: 'kaira-os',
    title: 'Kaira',
    subtitle: 'A Controller-First 10-Foot Living Room Media Shell',
    year: '2026',
    category: 'Personal R&D · In Progress',
    themeColor: '#DFFCA1',
    textColor: '#094020',
    tagBg: '#094020',
    tagText: '#DFFCA1',
    description: 'A calm, dark-glass living room shell with 0 ads designed to aggregate local 4K movies, FLAC music, and future game libraries under one unified gamepad-driven interface.',
    image: '/KairaOS/img/tv mockup.png',
    video: '/KairaOS/img/vintage_tv_mockup_y.mp4',
    logo: '/KairaOS/img/kaira-logo.png',
    role: 'Lead Product Designer & Creative Developer',
    timeline: '2026 · Active R&D',
    platform: '10-Foot UI / Gamepad Focus Engine',
    deliverables: 'Design System, D-Pad Physics, Frontend Prototype',
    friction: 'Modern Smart TVs are cluttered, sluggish with a gamepad, and treat your personal media and games like second-class citizens. Jumping between multiple launchers just to check your watchlist ruins the couch vibe.',
    approach: 'Deep OLED blacks, strict 0-ad sanctuary, snappy controller focus snaps with analog stick easing, ambient backlight sync, and a single calm shelf for movies, music, and your game library.',
    features: [
      'Strict 0-ad sanctuary with offline-first indexing',
      'Analog stick inertia and D-Pad focus spring physics',
      'Unified launcher for local 4K cinema, FLAC tracks, and game emulation',
      'Dynamic ambient lighting bleed matching active media art'
    ],
    artifacts: [
      {
        tag: 'ARTIFACT_01 // ARCHITECTURAL_ANALYSIS',
        caption: 'Information architecture, D-pad matrix grid, and spatial shell ergonomics',
        image: '/KairaOS/img/1.png'
      },
      {
        tag: 'ARTIFACT_02 // SYSTEM_COMPONENTS & TOKENS',
        caption: 'Design system components, focus elevation states, and spatial shell typography',
        image: '/KairaOS/img/2.png'
      },
      {
        tag: 'ARTIFACT_03 // FINAL_PRODUCTION_DEPLOYMENT',
        caption: 'High-fidelity living room living code experience with gamepad focus snaps',
        image: '/KairaOS/img/3.png'
      }
    ],
    gallery: [
      {
        title: 'Media Hub & Library Architecture',
        caption: 'Unified shelf hierarchy aggregating local movies, FLAC tracks, and retro emulation',
        image: '/KairaOS/img/4.png'
      },
      {
        title: 'Player Overlay & Ambient Glow Bleed',
        caption: 'Dynamic background backlight synchronization sampling album art palette tokens',
        image: '/KairaOS/img/5.png'
      },
      {
        title: 'Hardware & TV Frame Perspective',
        caption: '10-foot viewing angle validation on OLED displays with high-contrast typography',
        image: '/KairaOS/img/Apple TV Mockup.png'
      }
    ],
    nextProjectId: 'draun'
  },
  {
    id: 'draun',
    title: 'DRAUN',
    subtitle: 'A Tactile, E-Ink & Dark-Mode Windows Music Player',
    year: '2026',
    category: 'Physical UI · Personal Project',
    themeColor: '#094020',
    textColor: '#EDEBE4',
    tagBg: '#DFFCA1',
    tagText: '#094020',
    description: 'A local-first music player built for people who care about their FLAC collections. Inspired by Braun minimalism, vintage click-wheels, parametric EQ, and zero-algorithm listening.',
    image: '/DRAUN/img/1.png',
    role: 'Product & Brand Designer',
    timeline: '2026 · Personal Project',
    platform: 'Windows 11 Desktop Application',
    deliverables: 'Physical UI, Parametric EQ, Audio Shell, Audio Physics',
    friction: 'Listening to your own offline FLAC collection shouldn\'t feel like piloting an enterprise spreadsheet or dealing with recommendation algorithms designed to keep you scrolling.',
    approach: 'Physical-feeling tactile knobs, mechanical click-wheel inertia, high-contrast monochrome E-Ink mode for zero-distraction listening, and a master parametric EQ.',
    features: [
      'Tactile rotary knobs with fluid mouse-drag physics',
      'Instant toggle between OLED dark mode and high-contrast E-Ink layout',
      '10-band parametric equalizer with real-time waveform rendering',
      'Lossless Bit-perfect audio playback engine'
    ],
    artifacts: [
      {
        tag: 'ARTIFACT_01 // TACTILE_INTERFACE_ANATOMY',
        caption: 'Tactile rotary potentiometer dials, mechanical click-wheel inertia, and transport controls',
        image: '/DRAUN/img/Artboard 1@2x.png'
      },
      {
        tag: 'ARTIFACT_02 // PARAMETRIC_EQ_ENGINE',
        caption: '10-band parametric equalizer curves with live frequency response and gain dials',
        image: '/DRAUN/img/Artboard 2@2x.png'
      },
      {
        tag: 'ARTIFACT_03 // E-INK_MONOCHROME_MODE',
        caption: 'Distraction-free high contrast e-paper mode for pure, ambient album listening',
        image: '/DRAUN/img/Artboard 3@2x.png'
      }
    ],
    gallery: [
      {
        title: 'Full Hardware Shell Anatomy',
        caption: 'Precision aluminum casing aesthetics, knurled knobs, and tactile visual details',
        image: '/DRAUN/img/Artboard 4@2x.png'
      },
      {
        title: 'Lossless Playlist Queue & Curation',
        caption: 'Minimalist offline FLAC crate management with typography-first tracks indexing',
        image: '/DRAUN/img/draun-playlist.png'
      },
      {
        title: 'Synchronized Typographic Lyrics View',
        caption: 'Real-time word-by-word lyric scroll with high-legibility monochrome typography',
        image: '/DRAUN/img/draun-lyrics.png'
      },
      {
        title: 'Audio Hardware Engine Settings',
        caption: 'Direct ASIO / WASAPI exclusive mode configuration for zero resampling audio',
        image: '/DRAUN/img/draun-settings.png'
      }
    ],
    nextProjectId: 'vw-tracking'
  },
  {
    id: 'vw-tracking',
    title: 'VW Track My Vehicle',
    subtitle: 'Live Shipment Tracking for Volkswagen Australia',
    year: '2025',
    category: 'Client Project · Enterprise',
    themeColor: '#1A5336',
    textColor: '#EDEBE4',
    tagBg: '#DFFCA1',
    tagText: '#094020',
    description: 'A live vessel-tracking experience designed for Volkswagen Australia that replaces the usual post-purchase silence with real-time position, voyage data, and delivery milestones for a customer\'s new car.',
    image: '/VW/img/cover-hero.jpg',
    role: 'Lead Product Designer',
    timeline: '2025 · Volkswagen Australia',
    platform: 'Responsive Web & Customer Portal',
    deliverables: 'Live Vessel Maps, Voyage Milestones, Telemetry UI',
    friction: 'Buying a new vehicle often results in weeks of radio silence while the car is shipped across international waters, causing buyer anxiety and repetitive support inquiries.',
    approach: 'Transforming shipping logistics into an exciting milestone tracker with live satellite vessel telemetry, port docking estimates, and personalized vehicle reveal moments.',
    features: [
      'Interactive satellite vessel map with real-time oceanic tracking',
      'Step-by-step assembly to delivery milestone timeline',
      'Customized VIN-specific spec card and digital user manual preview',
      'Direct contact module connecting buyers with their local dealership'
    ],
    artifacts: [
      {
        tag: 'ARTIFACT_01 // LIVE_SATELLITE_OCEAN_TELEMETRY',
        caption: 'Global satellite vessel telemetry with coordinates, nautical speed, and maritime route',
        image: '/VW/img/screen-route-overview.png'
      },
      {
        tag: 'ARTIFACT_02 // HARBOR_WAYPOINT_NAVIGATION',
        caption: 'Port passage tracking with zoomed canal navigation and estimated docking windows',
        image: '/VW/img/screen-route-zoomed.png'
      },
      {
        tag: 'ARTIFACT_03 // VEHICLE_DELIVERY_MILESTONES',
        caption: 'Comprehensive post-purchase delivery pipeline from factory production to dealership keys',
        image: '/VW/img/screen-tracking-detail.png'
      }
    ],
    gallery: [
      {
        title: 'Order Status Live Customer Hero',
        caption: 'Personalized customer landing interface with countdown and vehicle specifications',
        image: '/VW/img/hero-order-status.jpg'
      },
      {
        title: 'Port ETA & Next Harbor Waypoint',
        caption: 'Transshipment schedules and intermediate customs clearance timeline cards',
        image: '/VW/img/screen-next-stop.png'
      },
      {
        title: 'Vessel Marine Telemetry & Heading',
        caption: 'Detailed vessel dimensions, gross tonnage, and real-time maritime compass direction',
        image: '/VW/img/screen-voyage-data.png'
      }
    ],
    nextProjectId: 'vitacore-nexus'
  },
  {
    id: 'vitacore-nexus',
    title: 'VitacoreNexus HMS',
    subtitle: 'One Patient Record, Five Role-Built Healthcare Portals',
    year: '2025',
    category: 'Client Project · Healthcare',
    themeColor: '#FAF9F5',
    textColor: '#17191C',
    tagBg: '#094020',
    tagText: '#FAF9F5',
    description: 'A hospital and clinic management system: reception, nurse, doctor, admin, and a patient app sharing one consent-audited record, built offline-first and aligned with India\'s ABDM/ABHA health-ID standards.',
    image: '/VitaCoreNexus/img/cover-hero.jpg',
    role: 'Lead Product Designer',
    timeline: '2025 · Enterprise Healthcare',
    platform: 'Multi-Role Web App & Patient Mobile App',
    deliverables: '5 Dedicated Role Portals, Design System, ABDM Integration',
    friction: 'Healthcare workers suffer from fragmented software where doctors, nurses, and billing staff use disconnected tools, leading to medical errors and slow patient intake.',
    approach: 'A unified clinical record with five purpose-built lenses tailored specifically to the speed requirements of each hospital role (3-click triage for nurses, quick prescription for doctors).',
    features: [
      'ABDM & ABHA compliant digital patient record vault',
      'Role-specialized interfaces with zero visual noise',
      'Emergency room fast-track check-in with offline synchronization',
      'Automated pharmacy and inventory prescription routing'
    ],
    artifacts: [
      {
        tag: 'ARTIFACT_01 // DOCTOR_CLINICAL_PORTAL',
        caption: 'High-speed diagnostic interface with unified patient history, lab values, and e-prescription',
        image: '/VitaCoreNexus/img/screen-doctor.jpg'
      },
      {
        tag: 'ARTIFACT_02 // NURSE_TRIAGE_STATION',
        caption: '3-click emergency triage vitals logging with automated bed occupancy telemetry',
        image: '/VitaCoreNexus/img/screen-nurse.jpg'
      },
      {
        tag: 'ARTIFACT_03 // PATIENT_HEALTH_VAULT',
        caption: 'Patient mobile app with ABDM/ABHA health locker integration and appointment bookings',
        image: '/VitaCoreNexus/img/screen-patient.jpg'
      }
    ],
    gallery: [
      {
        title: 'Hospital Operations & ABDM Admin Console',
        caption: 'Hospital-wide telemetry, billing analytics, staff scheduling, and regulatory reporting',
        image: '/VitaCoreNexus/img/screen-admin.jpg'
      },
      {
        title: 'Fast-Track Reception & Billing Check-In',
        caption: 'Instant QR code patient lookup, insurance verification, and automated token queue',
        image: '/VitaCoreNexus/img/screen-reception.jpg'
      }
    ],
    nextProjectId: 'que-workspace'
  },
  {
    id: 'que-workspace',
    title: 'QueWorkspace',
    subtitle: 'The Platform Behind a Bengaluru Coworking Floor',
    year: '2024',
    category: 'Client Project · PropTech',
    themeColor: '#242424',
    textColor: '#EDEBE4',
    tagBg: '#DFFCA1',
    tagText: '#094020',
    description: 'End-to-end product design for a coworking space in Bengaluru: a marketing site that books tours, a member dashboard for daily bookings and billing, and the admin console the floor team runs it from.',
    image: '/QueWorkspace/app/floor-1.jpg',
    role: 'End-to-End Product Designer',
    timeline: '2024 · Client Platform',
    platform: 'Public Web, Member App & Staff Admin Console',
    deliverables: 'Tour Booking Engine, Floor Map Interactive UI, Billing',
    friction: 'Coworking space operators struggle with no-show tour bookings, clunky desk allocation, and disconnected meeting room access controls.',
    approach: 'A cohesive digital experience connecting public marketing with real-time floor plan bookings, instant Stripe billing, and IoT door access triggers.',
    features: [
      'Interactive 3D floor map with live desk and room occupancy',
      '1-click instant tour scheduler with calendar sync',
      'Member credit wallet and automated recurring invoicing',
      'Admin floor manager with member access telemetry'
    ],
    artifacts: [
      {
        tag: 'ARTIFACT_01 // INTERACTIVE_DESK_ALLOCATION',
        caption: 'Live floor plan showing hot desks, meeting pods, and private soundproof cubicles',
        image: '/QueWorkspace/app/desks-1.jpg'
      },
      {
        tag: 'ARTIFACT_02 // PRIVATE_CABIN_SCHEDULER',
        caption: 'Enterprise private suite reservation with automated access card credentialing',
        image: '/QueWorkspace/app/cabin-2.jpg'
      },
      {
        tag: 'ARTIFACT_03 // MAIN_COWORKING_FLOOR_EXPERIENCE',
        caption: 'Open collaborative work zones with natural lighting and ergonomic standing stations',
        image: '/QueWorkspace/app/floor-2.jpg'
      }
    ],
    gallery: [
      {
        title: 'Dedicated Fixed Desks Layout',
        caption: 'Personalized workstation setup with dedicated storage lockers and power conduits',
        image: '/QueWorkspace/app/desks-2.jpg'
      },
      {
        title: 'Community Amenities & Refreshment Bar',
        caption: 'Artisanal coffee lounge and communal event amphitheater for community mixers',
        image: '/QueWorkspace/app/pantry.jpg'
      },
      {
        title: 'Floor Architecture & Spatial Identity',
        caption: 'Architectural overview showcasing clean acoustics and natural timber finishes',
        image: '/QueWorkspace/img/floor-photo.jpg'
      }
    ],
    nextProjectId: 'funnelfox'
  },
  {
    id: 'funnelfox',
    title: 'FunnelFox 360',
    subtitle: 'Next-Gen Multi-Dashboard CRM & Sales Management',
    year: '2024',
    category: 'Client Project · Enterprise CRM',
    themeColor: '#DFFCA1',
    textColor: '#094020',
    tagBg: '#094020',
    tagText: '#DFFCA1',
    description: 'A comprehensive multi-dashboard CRM designed to streamline lead tracking, visual pipeline reporting, and automated sales workflows for high-velocity teams.',
    image: '/FunnelFox 360/img/dashboard-overview.png',
    role: 'Senior UI/UX Designer',
    timeline: '2024 · SaaS Platform',
    platform: 'Enterprise Web Application',
    deliverables: 'Kanban Pipelines, Custom Dashboard Builder, Analytics',
    friction: 'Traditional CRMs are overloaded with complex forms, slow page reloads, and rigid reporting tables that sales reps avoid using.',
    approach: 'High-density, lightning-fast Kanban boards with keyboard shortcuts, drag-and-drop pipeline stages, and configurable visual KPI widgets.',
    features: [
      'Multi-pipeline Kanban with real-time deal stage calculations',
      'Automated email trigger sequences and call logging',
      'Custom KPI widget builder with exportable charts',
      'Role-based permission matrix for tiered sales orgs'
    ],
    artifacts: [
      {
        tag: 'ARTIFACT_01 // MULTI_PIPELINE_LEAD_KANBAN',
        caption: 'High-velocity visual deal pipeline with instant stage dragging and deal velocity metrics',
        image: '/FunnelFox 360/img/dashboard-all-leads.png'
      },
      {
        tag: 'ARTIFACT_02 // PAID_CAMPAIGNS_AUTOMATION',
        caption: 'Meta & Google Ads sync dashboard with real-time CAC and ROAS conversion attribution',
        image: '/FunnelFox 360/img/dashboard-facebook-campaigns.png'
      },
      {
        tag: 'ARTIFACT_03 // PERFORMANCE_MARKETING_ANALYTICS',
        caption: 'Executive revenue forecasting and rep performance metrics with customizable charts',
        image: '/FunnelFox 360/img/dashboard-performance-marketing.png'
      }
    ],
    gallery: [
      {
        title: 'Lead De-duplication & AI Hygiene Engine',
        caption: 'Automated contact merging, email deliverability validation, and enrichment telemetry',
        image: '/FunnelFox 360/img/dashboard-duplicates.png'
      }
    ],
    nextProjectId: 'luna'
  },
  {
    id: 'luna',
    title: 'Luna',
    subtitle: 'Calmer, Conversational Period & Wellness Tracker',
    year: '2024',
    category: 'Client Project · Mobile',
    themeColor: '#1F1B24',
    textColor: '#EDEBE4',
    tagBg: '#DFFCA1',
    tagText: '#094020',
    description: 'A period and wellness tracking app built around a 25-step onboarding flow designed to feel like a conversation, not a medical intake form.',
    image: '/Luna/img/cover-hero.jpg',
    role: 'Product Designer',
    timeline: '2024 · Mobile App Shell',
    platform: 'iOS & Android Mobile App',
    deliverables: '25-Step Conversational Onboarding, Daily Cycle Tracker',
    friction: 'Most health apps open with cold medical surveys and sterile form inputs, making users feel uncomfortable before they even see value.',
    approach: 'A conversational, empathetic onboarding story with progressive disclosure, soothing motion transitions, and customizable privacy safeguards.',
    features: [
      '25-step conversational onboarding with adaptive question branching',
      'Predictive cycle calendar with symptom correlation charts',
      'Private on-device data encryption with biometric lock',
      'Mindful daily check-in widgets and wellness insights'
    ],
    artifacts: [
      {
        tag: 'ARTIFACT_01 // CONVERSATIONAL_ONBOARDING_FLOW',
        caption: 'Warm, human-centric intake flow with progressive disclosure and zero medical intimidation',
        image: '/Luna/img/screen-welcome.png'
      },
      {
        tag: 'ARTIFACT_02 // MINDFUL_SYMPTOM_TRACKER',
        caption: 'Tactile daily mood, energy, and symptom correlation dial with gentle micro-interactions',
        image: '/Luna/img/screen-mood.png'
      },
      {
        tag: 'ARTIFACT_03 // PREDICTIVE_CYCLE_DASHBOARD',
        caption: 'Phase-based daily wellness forecast with hormonal energy suggestions and health tips',
        image: '/Luna/img/screen-dashboard.png'
      }
    ],
    gallery: [
      {
        title: 'Monthly Cycle View & Ovulation Forecast',
        caption: 'Clean chronological calendar showing fertile windows, period predictions, and history',
        image: '/Luna/img/screen-calendar.png'
      },
      {
        title: 'Personalized Wellness Habits & Goals',
        caption: 'Custom water intake, sleep quality, and fitness tracking tailored to menstrual phases',
        image: '/Luna/img/screen-goals.png'
      },
      {
        title: 'Adaptive Physical Intake Metric',
        caption: 'Interactive height/weight sliders with smooth physics and instant body metric feedback',
        image: '/Luna/img/screen-height.png'
      },
      {
        title: 'Luna Plus Premium Insights & Health Reports',
        caption: 'Exportable clinical summaries and specialized nutritional guidance for gynecologist visits',
        image: '/Luna/img/screen-premium.png'
      }
    ],
    nextProjectId: 'kaira-os'
  }
];
