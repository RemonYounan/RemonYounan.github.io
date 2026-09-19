// =============================================================================
//  PORTFOLIO CONFIG
//  Edit this file to update every piece of content on the site.
//  No HTML knowledge required — all fields are labeled below.
//  Leave any text field as "" (or an array as []) to hide it from the site.
//
//  WRITING RULE: plain English, written for a founder, not a developer.
//  Say what a thing does, not what it's built with. No jargon in any sentence
//  a visitor reads (tool names in the tag lists are the one exception).
// =============================================================================

window.SITE_CONFIG = {
  // ---------------------------------------------------------------------------
  // PERSONAL INFO
  // ---------------------------------------------------------------------------
  name: "Remon Younan",
  title: "I design and build mobile apps",

  // Hero SUB-HEADLINE (shown under the big H1). Two short sentences max.
  // Job: add NEW info the headline doesn't — who it's for + proof.
  tagline:
    "I design your app, build it, and take it all the way into the App Store and Google Play. One of mine passed 100k downloads at a 4.6 rating.",

  location: "",

  // Availability status — surfaced as a live marker in the hero + nav + About.
  // Set to "" to hide the marker entirely.
  availability: "Open to work",

  // One short phrase for the "FOCUS" row of the About status panel.
  // Leave "" to fall back to your first listed strength.
  focus: "I design and build mobile apps",

  // ---------------------------------------------------------------------------
  // PITCH  —  "What you get" bullets on the About card. Keep each to one line.
  // Founder-facing benefits, not a skills list. Set to [] to hide the card.
  // ---------------------------------------------------------------------------
  // A plain string is a normal bullet. Use { text, lead: true } to pull one line
  // out as the headline of the card (bigger type, solid gold check). One lead
  // line only — two competing headlines read as none.
  pitch: [
    {
      text: "Founders bring me apps that have stalled. I find the missing pieces before they cost you a month.",
      lead: true,
    },
    "One build that runs on iPhone and Android, so you pay for one app instead of two.",
    "The same person designs it and builds it, so nothing gets lost between the two.",
  ],

  // ---------------------------------------------------------------------------
  // PROCESS  —  "How we work" steps on the landing page. 3 steps is ideal.
  //   title  the phase
  //   text   one line on what happens
  // Set to [] to hide the section.
  // ---------------------------------------------------------------------------
  process: [
    {
      title: "Plan",
      text: "Send me the idea. Within 24 hours you get what it will take and the first big call I'd make.",
    },
    {
      title: "Build",
      text: "I build it. Every week you get a version you can open and use for yourself.",
    },
    {
      title: "Launch",
      text: "Your app goes live in both stores. Then we watch how people really use it and improve it.",
    },
  ],

  // Short bio for the About section. Keep it direct and specific — recruiters
  // skip fluff. Two or three sentences is enough.
  bio: "I've built apps across food, healthcare, sports, laundry logistics, and anonymous voice support, including the ones that are hard to get right: live voice calls, instant messaging, and apps that keep working when the connection drops. Some of them started as a sketch on a call. Others arrived half-finished with the previous developer already gone. Both end up in the same place, shipped to both stores and holding up once real people are on them.",

  // ---------------------------------------------------------------------------
  // LINKS  —  leave "" to hide
  // ---------------------------------------------------------------------------
  email: "remon.younan.dev@gmail.com",
  github: "https://github.com/remonyounan",
  linkedin: "https://www.linkedin.com/in/remon-younan/",
  // WhatsApp — digits only, incl. country code (no +, spaces, or dashes).
  // Surfaced as a click-to-chat button in the contact section + footer.
  whatsapp: "201011548343",
  twitter: "", // e.g. "https://twitter.com/yourhandle"
  resumeUrl: "", // e.g. "assets/resume.pdf" or a hosted link

  // Where the popup form sends its messages. Paste a form-service URL
  // (Formspree, Getform, Basin, or your own handler) and the form posts
  // there in the background. Leave "" and the form hands the finished
  // message to the visitor's mail app instead. The WhatsApp button in the
  // popup works either way.
  formEndpoint: "",

  // ---------------------------------------------------------------------------
  // CONTACT SECTION
  // ---------------------------------------------------------------------------
  contactHeading: "Let's build something real.",
  contactText:
    "Tell me what you're making. I'll come back with what it will take and the first big decision I'd settle, usually within 24 hours.",

  // ---------------------------------------------------------------------------
  // HERO STRENGTHS  —  small pills under the tagline + the scrolling marquee.
  // Keep these factual and specific, in plain words.
  // ---------------------------------------------------------------------------
  strengths: [
    "Instant messaging",
    "Voice & video calls",
    "Phone alerts",
    "Works without a connection",
    "Custom animations",
    "Live updates",
    "Cloud storage",
    "Apps that stay in sync",
  ],

  // ---------------------------------------------------------------------------
  // STATS  —  animated count-up strip. Keep every number TRUE.
  //   value  the number to count up to
  //   suffix appended after the number, e.g. "+", "%", "k"
  //   label  short description under the number
  //   icon   optional glyph shown beside the number:
  //          "apps" | "download" | "star" | "users". Leave it off for none.
  // Set to [] to hide the whole band.
  // ---------------------------------------------------------------------------
  stats: [
    { value: 12, suffix: "", label: "Apps built", icon: "apps" },
    { value: 100, suffix: "k+", label: "Downloads" },
    { value: 4.6, suffix: "★", label: "Average rating" },
  ],

  // ---------------------------------------------------------------------------
  // EXPERTISE  —  "What I build" cards. This is your strengths made concrete:
  // name the hard thing and say what you actually deliver.
  //   icon   one of: "signal" | "call" | "sync" | "bell" | "code" | "gauge"
  //                 | "link" | "lock" | "wrench"
  //   title  the capability
  //   text   1-2 sentences on what you deliver / how deep you go
  // Set to [] to hide the section.
  // ---------------------------------------------------------------------------
  capabilities: [
    {
      icon: "gauge",
      title: "An app that opens fast",
      text: "People delete apps that make them wait. I go screen by screen and cut the lag, so the app opens straight into content and images are already there when you scroll to them.",
    },
    {
      icon: "link",
      title: "Nobody gets stuck getting in",
      text: "One tap to sign in with Google or Apple, and sessions renew in the background so people aren't thrown back to the login screen halfway through something. Notifications and links land on the exact screen inside the app, never in a browser.",
    },
    {
      icon: "signal",
      title: "The parts that usually break",
      text: "Messages that arrive in the right order, calls that hold when the phone switches from Wi-Fi to mobile data, and an app that keeps working on the metro and lines everything up once the signal is back.",
    },
    {
      icon: "wrench",
      title: "Still handled after launch",
      text: "Every crash reports itself to me with the exact line it happened on. I find the cause and push the fix while the problem is still small, before it turns into a one-star review.",
    },
  ],

  // ---------------------------------------------------------------------------
  // SKILLS  —  grouped tag blocks in About. Keys become the group labels.
  // The tags themselves are tool names (proper nouns), so they stay as they are.
  // ---------------------------------------------------------------------------
  skills: {
    core: ["Flutter", "Dart", "Firebase", "REST APIs", "WebSockets"],
    "app structure": ["BLoC", "Provider", "Riverpod"],
    tools: ["Git", "Figma", "Postman", "Android Studio", "VS Code"],
    platforms: ["Android", "iOS"],
  },

  // ---------------------------------------------------------------------------
  // Master switch for the Experience section. Set to false to drop it from the
  // page without touching the entries below — they stay here, ready to switch
  // back on. Leaving the entries in place and setting this to false is the way
  // to hide the section temporarily; emptying `experience` hides it too, but
  // then the content is gone.
  showExperience: true,

  // EXPERIENCE  —  the roster in the Experience section. One entry per ROLE,
  // newest first; the page groups them by `company`, so two stints at the same
  // employer fold into one block and concurrent roles no longer read as a
  // mistake. Set to [] to hide the whole section.
  // NOTE: this block is kept word-for-word identical to the CV and the LinkedIn
  // profile on purpose, so the three never drift apart. That makes it the one
  // exception to the plain-English writing rule at the top of this file — do not
  // rewrite it here alone; change all three together.
  //   role     your title
  //   company  where (or "Freelance")
  //   period   e.g. "2023 - Present"
  //   text     one line on what you built / owned
  // ---------------------------------------------------------------------------
  experience: [
    {
      role: "Full Stack Mobile Engineer",
      company: "farapi",
      period: "06/2026 — Present",
      text: "Building a new platform after moving from freelance to full-time, covering the backend architecture, web interface, admin dashboard, and mobile app. Manage the release lifecycle of cross-platform Flutter apps into the App Store and Google Play through automated CI/CD, and own post-launch crash triage.",
    },
    {
      role: "Full Stack Flutter Developer",
      company: "Upwork & direct clients",
      period: "06/2023 — Present",
      text: "Delivering client apps from first design through to release on the App Store and Google Play: Flutter front ends on reliable Python systems, with stable architectures, secure authentication, and optimized Firebase and Google Cloud deployments. First shipped product was the INSRC 2024 conference app for an Abu Dhabi client.",
    },
    {
      role: "Flutter Mobile App Developer",
      company: "Aklne",
      period: "09/2024 — 02/2026",
      text: "Took over Aklne after farapi handed the product to the client and handled its development from then on — a food discovery platform merging short-form video, recipes, and restaurants into a single Flutter application. It reached 100k+ downloads at a 4.6 average rating across both stores. Built social login (Google, Apple), deep linking from in-video dishes straight to restaurant profiles and maps, and Firebase push, while optimizing video playback for low-end devices and slow networks.",
    },
    {
      role: "Mobile Application Developer",
      company: "farapi",
      period: "06/2024 — 10/2025",
      text: "Built and deployed mobile apps, handling development, backend wiring, store release, and post-launch maintenance. Built the first release of Aklne and delivered Seen for a soft launch during this engagement.",
    },
  ],

  // ---------------------------------------------------------------------------
  // TESTIMONIALS  —  client quotes for the "What clients say" carousel.
  // ⚠️  REAL QUOTES ONLY. Every quote below is a real Upwork review, tidied for
  //     grammar only, with no claim added, removed, or strengthened. Never add
  //     an invented quote here: publishing a made-up testimonial as genuine
  //     misleads visitors and is regulated (FTC & similar consumer-protection
  //     rules). To add more, copy the client's own words from the job feedback
  //     and edit no further than that.
  //   quote   the testimonial text
  //   name    the client who said it
  //   role    the client's company or product ("" to hide the line)
  //   myRole  what YOU did on that job — shown as a small tag on the card, so a
  //           reader can't mistake it for the client's own job title. "" hides it.
  // Set to [] to hide the whole section.
  // ---------------------------------------------------------------------------
  testimonials: [
    {
      quote:
        "Remon is an amazing developer, and the whole experience of working with him was great. I'd recommend him to anyone, and I'm looking forward to the next project together.",
      name: "Upwork Client",
      role: "",
      myRole: "Full-stack Flutter developer",
    },
    {
      quote:
        "A professional and genuinely friendly Flutter developer. He made sure everything was handled properly and always came back quickly. Thanks a lot, and I'd hire him again without hesitation.",
      name: "Upwork Client",
      role: "",
      myRole: "Mobile developer",
    },
    {
      quote:
        "Great person to work with, and he finished the job ahead of schedule.",
      name: "Upwork Client",
      role: "",
      myRole: "Mobile developer",
    },
    {
      quote: "An experienced developer. I'd happily work with him again.",
      name: "Upwork Client",
      role: "",
      myRole: "Mobile developer",
    },
  ],

  // ---------------------------------------------------------------------------
  // PROJECTS
  // The first project with `featured: true` gets the large layout.
  // All others appear in the grid below it. Every card is clickable and opens
  // its own detail page (project.html?p=<slug>) with the full write-up + gallery.
  //
  //   name         Project name (heading)
  //   slug         URL id for the detail page, e.g. "seen" → project.html?p=seen
  //                Must be unique. Lowercase, no spaces.
  //   tagline      One-line descriptor, shown in accent color
  //   role         What you did on the project, in plain words
  //   year         Year it went live, e.g. "2024" — leave "" to hide
  //   description  1-2 sentences: what the app does and who uses it
  //   challenge    The specific HARD problem you solved, explained plainly
  //   features     Bullet list of what the app does (shown on the detail page)
  //   tech         Array of technology names shown as mono tags
  //   cover        Hero image shown on the card + detail page. Portrait or
  //                landscape both work. Leave "" to fall back to `mockup`.
  //   gallery      Array of screenshot paths shown in the detail-page gallery.
  //   galleryFrame How those gallery shots are presented:
  //                  "iphone" (default) — full iPhone mockup: bezel, Dynamic
  //                                       Island, side buttons. For raw
  //                                       device screenshots.
  //                  "plain"            — flat rounded phone frame, no chrome.
  //                  false              — no frame: the asset runs at its own
  //                                       aspect ratio. Use for shots that are
  //                                       already mockup'd, tablet, or web.
  //   mockup       Designed in-phone scene when `cover` is "".
  //                One of: "chat" | "call" | "tasks" | "feed".
  //   github       GitHub repo URL — leave "" to hide
  //   website      Live product/website URL — leave "" to hide
  //   playStore    Play Store URL — leave "" to hide
  //   appStore     App Store URL — leave "" to hide
  //   metrics      Social-proof stats. Array of { icon, value, label } —
  //                icon is "download" | "star" | "users". Rendered as highlighted
  //                pills on the card + a stat strip on the case study, and a
  //                compact badge on the hero wall. Leave [] to hide.
  //   heroLead     Set true to float this app to the front (top-left) of the
  //                hero app wall. Does not affect Work grid / featured order.
  //   heroWall     Set false to keep this app out of the hero wall entirely.
  //                Defaults to true. The app still appears in the Work grid.
  //   featured     Set true for the first/hero project card only
  // ---------------------------------------------------------------------------
  projects: [
    {
      name: "Aklne",
      slug: "aklne",
      tagline: "Watch it, cook it, or go eat it",
      role: "Built the features, made it fast, and took it to both stores",
      year: "2024",
      description:
        "A food app for Egypt. Watch a short video, then cook the dish yourself or find the restaurant that makes it, call them, get directions, or order through your usual delivery app.",
      challenge:
        "The app had to join four things that normally live in separate apps: a video feed, recipes, restaurant listings, and delivery. Tapping a dish inside a video has to land you on that restaurant's page with its menu, branches, and reviews already there. I built that whole path and kept the video feed scrolling smoothly on cheap Android phones and slow connections.",
      features: [
        "Short food videos: recipes, restaurant reviews, and kitchen tricks",
        "Chef and food blogger profiles, with their videos and recipes",
        "Restaurant pages with the menu, every branch, and directions",
        "Call the restaurant, or order through the delivery app you already use",
        "Restaurants near you across Cairo and Alexandria",
        "Pick a recipe's ingredients and send the shopping list to WhatsApp",
        "Filter recipes by calories",
        "Search by name, area, or type of food",
        "Today's offers and hand-picked restaurants on the home screen",
        "Read and write reviews, or suggest a restaurant that's missing",
      ],
      tech: [
        "Flutter",
        "Firebase",
        "REST APIs",
        "Video playback",
        "Maps & directions",
        "Deep Linking",
        "Analytics",
      ],
      cover: "assets/projects/Aklne/aklne-mockup-cover2.png",
      gallery: [
        "assets/projects/Aklne/1.png",
        "assets/projects/Aklne/2.png",
        "assets/projects/Aklne/3.png",
        "assets/projects/Aklne/4.png",
        "assets/projects/Aklne/5.png",
      ],
      galleryFrame: false,
      mockup: "feed",
      github: "",
      website: "https://aklne.com/",
      playStore: "https://play.google.com/store/apps/details?id=com.aklne.app",
      appStore: "https://apps.apple.com/us/app/id6612032423",
      metrics: [
        { icon: "download", value: "100k+", label: "Downloads" },
        { icon: "star", value: "4.6", label: "Rating" },
      ],
      heroLead: true,
      featured: true,
    },
    {
      name: "Seen: A Safe Space to Talk",
      slug: "seen",
      tagline: "Anonymous voice support, any time",
      role: "App developer",
      year: "2024",
      description:
        "An anonymous place to talk out loud and be heard by trained listeners. Arabic first, live on iPhone and Android.",
      challenge:
        "The phone had to ring like a real call on both iPhone and Android, even with the app closed. The moment it's answered, you're in a live conversation with a real person.",
      features: [
        "Anonymous voice calls with trained listeners",
        "Rings like a normal call on iPhone and Android",
        "Matched with a listener who speaks your dialect",
        "Simple reporting to keep people safe",
      ],
      tech: [
        "Flutter",
        "Agora SDK",
        "Firebase",
        "Push Notifications",
        "Clean Architecture",
      ],
      cover: "assets/projects/Seen/cover.png",
      gallery: [
        "assets/projects/Seen/1.png",
        "assets/projects/Seen/2.png",
        "assets/projects/Seen/3.png",
        "assets/projects/Seen/4.png",
        "assets/projects/Seen/5.png",
        "assets/projects/Seen/6.png",
      ],
      galleryFrame: false,
      mockup: "call",
      github: "",
      website: "https://weseen.framer.website/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.werseen.app",
      appStore:
        "https://apps.apple.com/eg/app/seen-a-safe-space-to-talk/id6752343513",
      featured: false,
    },
    {
      name: "Sehatak",
      slug: "sehatak",
      tagline: "Health services, all in one place",
      role: "App developer",
      year: "",
      description:
        "A platform that makes health care easy to reach. Browse and buy medical services and products from a checked network of providers, right in the app.",
      challenge:
        "Turning a huge network of providers into something you can actually shop: clinic pages with real ratings, offers and vouchers side by side, prices with nothing hidden, and live tracking once you've paid.",
      features: [
        "Browse health services and products from trusted providers",
        "Compare offers and vouchers against your budget",
        "Clinic profiles with ratings and reviews",
        "Buy in the app and follow your order",
      ],
      tech: ["Flutter", "REST APIs", "Payments", "Push Notifications"],
      cover: "assets/projects/Sehatak/cover2.png",
      gallery: [
        "assets/projects/Sehatak/NEW HOMEPAGE.png",
        "assets/projects/Sehatak/New - Clinic Profile - Ratings.png",
        "assets/projects/Sehatak/New - Detailed Voucher.png",
        "assets/projects/Sehatak/New - Active Orders Page.png",
      ],
      galleryFrame: "iphone",
      mockup: "feed",
      github: "",
      website: "https://sehatak.com.sa/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.sehatakclient",
      appStore:
        "https://apps.apple.com/eg/app/%D8%B5%D8%AD%D8%AA%D9%83-sehatak/id6746445350",
      metrics: [],
      featured: false,
    },
    {
      name: "AC Zurex",
      slug: "ac-zurex",
      tagline: "Car parts fitted at your door",
      role: "App developer",
      year: "2024",
      description:
        "Tyres, batteries, oils and filters ordered from your phone and fitted wherever the car is parked. Type in the plate and the app already knows what fits it. On iPhone and Android.",
      challenge:
        "The team was paying for ads on six different platforms with no idea which ones were working. I wired the app so every install, sign-up and sale reports back — now they can see which campaign brought each customer and what that customer cost, and move the budget to what actually sells.",
      features: [
        "Type your plate and see only the parts that fit",
        "Tyres, batteries, oils and filters, all under warranty",
        "Fitted where the car is, around the clock",
        "Pay now or split it over monthly instalments",
        "Every sale traced back to the ad that brought it",
      ],
      tech: [
        "Flutter",
        "Firebase Analytics",
        "Facebook Events",
        "Kochava",
        "TikTok SDK",
        "Snapchat SDK",
        "Twitter SDK",
        "Payments",
      ],
      cover: "assets/projects/Zurex/cover.png",
      gallery: [
        "assets/projects/Zurex/1.png",
        "assets/projects/Zurex/2.png",
        "assets/projects/Zurex/3.png",
        "assets/projects/Zurex/4.png",
        "assets/projects/Zurex/5.png",
        "assets/projects/Zurex/6.png",
      ],
      galleryFrame: "plain",
      mockup: "feed",
      github: "",
      website: "https://zurex.sa",
      playStore:
        "https://play.google.com/store/apps/details?id=com.aczurex.app",
      appStore: "https://apps.apple.com/sa/app/zurex/id6642669628",
      metrics: [],
      featured: false,
    },
    {
      name: "Launderland",
      slug: "launderland",
      tagline: "Laundry, picked up and delivered",
      role: "App developer",
      year: "",
      description:
        "Laundry without leaving home. A driver collects your clothes and brings them back clean — the whole thing handled for you.",
      challenge:
        "Keeping everyone honest from pickup to doorstep: book a pickup, price the order piece by piece so there are no surprises, and follow it live through washing, ready, and delivered — with the driver and the customer looking at the same status.",
      features: [
        "Book a pickup for a time that suits you",
        "A clear price for every item before you pay",
        "Live status from pickup to delivery",
        "The driver and you see the same thing",
      ],
      tech: ["Flutter", "REST APIs", "Push Notifications", "Maps"],
      cover: "assets/projects/Launderland/cover.png",
      gallery: [
        "assets/projects/Launderland/01.png",
        "assets/projects/Launderland/02.png",
        "assets/projects/Launderland/03.png",
        "assets/projects/Launderland/04.png",
      ],
      galleryFrame: false,
      mockup: "tasks",
      github: "",
      website: "https://launderlandeg.com/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.kenrys.launder_land",
      appStore: "https://apps.apple.com/eg/app/launderland/id1638614661",
      metrics: [],
      featured: false,
    },
    {
      name: "FollowOn",
      slug: "followon",
      tagline: "Everything for your sports team",
      role: "Sole developer — first design to launch",
      year: "2024",
      description:
        "One place for a sports team to talk, plan matches, and keep everyone in the loop. It started as a simple design and grew into a full app on iPhone and Android.",
      challenge:
        "Team chat carrying text, photos, video, and voice notes. Coaches add a whole squad at once from a single file instead of typing names one by one. With that much inside, everything still has to be easy to find.",
      features: [
        "Team chat with text, photos, video, and voice notes",
        "Add a whole squad at once from one file",
        "Plan and keep track of matches and events",
        "Easy to move around, even with a lot inside",
      ],
      tech: [
        "Flutter",
        "Firebase",
        "REST APIs",
        "Media Messaging",
        "Push Notifications",
      ],
      cover: "assets/projects/FollowOn/Mockup.jpg",
      gallery: [
        "assets/projects/FollowOn/iPhone 6.7 inches/1.jpg",
        "assets/projects/FollowOn/iPhone 6.7 inches/2.jpg",
        "assets/projects/FollowOn/iPhone 6.7 inches/3.jpg",
        "assets/projects/FollowOn/iPhone 6.7 inches/4.jpg",
        "assets/projects/FollowOn/iPhone 6.7 inches/5.jpg",
        "assets/projects/FollowOn/iPhone 6.7 inches/6.jpg",
      ],
      galleryFrame: false,
      mockup: "chat",
      github: "",
      playStore: "",
      appStore: "",
      featured: false,
    },
    {
      name: "INSRC 2024",
      slug: "insrc",
      tagline: "The official conference app",
      role: "App developer",
      year: "2024",
      description:
        "The official app for the INSRC 2024 conference: the full schedule, who's exhibiting, and maps of the venue.",
      challenge:
        "A proper companion for the day itself: maps you can move around, a schedule that stays current, and an easy way to find the people you came to meet.",
      features: [
        "The full schedule, session by session",
        "Every exhibitor and what they do",
        "Venue maps you can explore",
        "Built for meeting people on site",
      ],
      tech: [
        "Flutter",
        "Firebase",
        "REST APIs",
        "Interactive Maps",
        "Push Notifications",
      ],
      cover: "assets/projects/INSRC/510shots_so.png",
      gallery: [
        "assets/projects/INSRC/01.png",
        "assets/projects/INSRC/02.png",
        "assets/projects/INSRC/03.png",
        "assets/projects/INSRC/04.png",
        "assets/projects/INSRC/05.png",
      ],
      galleryFrame: false,
      mockup: "feed",
      github: "",
      playStore: "",
      appStore: "",
      featured: false,
    },
    {
      name: "Flutter Commerce",
      slug: "flutter-commerce",
      heroWall: false,
      tagline: "An online shop in your pocket",
      role: "App developer",
      year: "2023",
      description:
        "A shopping app built on an existing online store: browse, search, fill a basket, check out, and pay.",
      challenge:
        "Connecting the app to the online store so the whole journey works: catalogue, basket, checkout, payment, and a notification every time the order moves.",
      features: [
        "Browse, search, and filter products",
        "Basket, checkout, and payment",
        "Notifications when your order changes",
        "A smooth, animated storefront",
      ],
      tech: [
        "Flutter",
        "WooCommerce",
        "REST APIs",
        "Firebase Cloud Messaging",
        "Analytics",
      ],
      cover: "assets/projects/E-commerce/image1.png",
      gallery: [
        "assets/projects/E-commerce/1.png",
        "assets/projects/E-commerce/2.png",
        "assets/projects/E-commerce/3.png",
        "assets/projects/E-commerce/4.png",
      ],
      galleryFrame: "iphone",
      mockup: "feed",
      github: "",
      playStore: "",
      appStore: "",
      featured: false,
    },
  ],
};
