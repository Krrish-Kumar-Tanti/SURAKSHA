import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Common
    'nav.brand': 'SURAKSHA',
    'nav.subtitle': 'AICTE Sovereign Deposit Vault',
    'nav.overview': 'Overview',
    'nav.guide': 'Guide',
    'nav.howItWorks': 'How It Works',
    'nav.contact': 'Contact Us',
    'nav.portfolio': 'Portfolio',
    'nav.wizard': 'FDR Submission',
    'nav.provenance': 'Provenance',
    'nav.policy': 'Policy Trace',
    'nav.release': 'Release Graph',
    'nav.releaseLetters': 'Release Letters',
    'nav.audit': 'Audit Chain',
    'nav.admin': 'Administration',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    'nav.switchRole': 'Switch Demo Role',
    'nav.language': 'Language',
    'common.back': '← Back',
    'common.next': 'Next →',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.refresh': 'Refresh',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.view': 'View',
    'common.download': 'Download',
    'common.verified': 'Verified',
    'common.pending': 'Pending',
    'common.discrepancy': 'Discrepancy',
    'common.active': 'Active',

    // Roles
    'role.INSTITUTION_USER': 'College Registrar',
    'role.INSTITUTION_USER.desc': 'Own FDR submission & institutional portfolio',
    'role.DEALING_OFFICER': 'Dealing Officer',
    'role.DEALING_OFFICER.desc': 'Review and process regional FDR records',
    'role.DIRECTOR_RB': 'Regional Director',
    'role.DIRECTOR_RB.desc': 'Regional oversight & discrepancy waiver',
    'role.COMPETENT_AUTHORITY': 'Approving Authority',
    'role.COMPETENT_AUTHORITY.desc': 'Final Clause 6.46 release sanction',
    'role.ACCOUNTS': 'Accounts Officer',
    'role.ACCOUNTS.desc': 'Release letters & financial disbursement',
    'role.AUDITOR': 'Central Auditor (CAG)',
    'role.AUDITOR.desc': 'Cryptographic ledger & zero-trust inspection',
    'role.ADMIN': 'System Administrator',
    'role.ADMIN.desc': 'System availability & service health monitoring',

    // Overview Hero
    'hero.badge': 'SIH26265 · AICTE Approval Process Handbook (APH 2024–27)',
    'hero.title': '( AICTE Security Deposit *Control Tower* )',
    'hero.subtitle': 'Autonomous custodial lifecycle management for institutional Fixed Deposit Receipts (FDRs) pledged to AICTE. Cryptographic non-repudiation, in-browser OCR, and multi-bureau release governance.',
    'hero.signInBtn': 'Sign In to Control Tower',
    'hero.exploreBtn': 'Explore Regulatory Pillars',
    'hero.howItWorksBtn': 'See How It Works',
    'hero.guideBtn': 'Persona Guide (7 Roles)',
    'hero.banksHeader': 'Simulated Banking & Statutory Desk Adapters',

    // Logged In Cockpit
    'cockpit.signedInAs': 'Signed in as',
    'cockpit.workspaceTitle': 'Your SURAKSHA Workspace',
    'cockpit.region': 'Region',
    'cockpit.quickActions': 'Quick Actions',
    'cockpit.portfolioTable': 'Portfolio Table',
    'cockpit.submitFdr': 'Submit FDR',
    'cockpit.threeWayProv': '3-Way Provenance',
    'cockpit.simulatePolicy': 'Simulate APH Calculation',
    'cockpit.releaseGraph': 'Release Graph DAG',
    'cockpit.auditChain': 'Audit Chain Ledger',

    // Guide Page
    'guide.title': 'SURAKSHA Persona Operational Guide',
    'guide.subtitle': 'Detailed operational guide for the 7 authorized roles. Understand statutory mandates, access boundaries, everyday workflows, and approval ladders under APH 2024–27 Clause 6.46.',
    'guide.roleHeader': 'Role Specification & Governance Matrix',
    'guide.authorityLevel': 'Authority Level',
    'guide.statutoryMandate': 'Statutory Mandate',
    'guide.keyWorkflows': 'Step-by-Step Daily Workflows',
    'guide.allowedScreens': 'Permitted Operational Screens',
    'guide.switchAndTest': 'Test As This Role',
    'guide.guidelines': 'Statutory Rules & Integrity Protocols',

    // How It Works Page
    'how.title': 'How SURAKSHA Operates: Architectural & Domain Blueprint',
    'how.subtitle': 'A deep-dive walkthrough of the entire SURAKSHA architecture across all 6 core domains: from browser-side OCR extraction to cryptographic hash-chained audit ledgers and APH Clause 6.46 multi-bureau clearance DAGs.',
    'how.p1.title': '1. Ingestion & Zero-Dependency Browser OCR',
    'how.p1.desc': 'Institutions upload fixed deposit certificates. Using in-browser pdfjs-dist and Tesseract.js, 9 statutory fields are extracted locally without backend dependency, generating SHA-256 cryptographic fingerprints.',
    'how.p2.title': '2. Three-Way Provenance Reconciliation',
    'how.p2.desc': 'Automated cross-matching across Declared Details, Document OCR, and Bank Confirmation Token. Flags discrepancies with an interactive loupe view before any officer review.',
    'how.p3.title': '3. AICTE Table 1.4 Regulatory Policy Matrix',
    'how.p3.desc': 'Calculates mandatory security deposit requirements across engineering, management, pharmacy, and design programs with exact 50% statutory concessions for NER, J&K, Ladakh, Aspirational districts, and women/PwD institutions.',
    'how.p4.title': '4. 90/60/30-Day Watchtower & Maturity Escalations',
    'how.p4.desc': 'Autonomous scheduler continuously scans the FDR ledger, dispatching multi-tiered notices at T-90, T-60, T-30, T-15, T-7, and T-0 to prevent unauthorized encashments.',
    'how.p5.title': '5. APH Clause 6.46 Multi-Bureau Release DAG',
    'how.p5.desc': 'Enforces mandatory separation-of-duties: PGRC student grievance clearance + CVO Vigilance integrity check + CAG audit verification + Regional Director recommendation before Competent Authority sanction.',
    'how.p6.title': '6. Encrypted Sovereign Vault & Hash-Chain Audit',
    'how.p6.desc': 'Documents are secured with AES-256-GCM encryption. Every event produces a SHA-256 merkle-linked audit block with tamper-evident chain verification.',

    // Footer
    'footer.disclaimer': 'SURAKSHA is an AICTE Security Deposit Control Tower engineered for Smart India Hackathon 2026 (Problem Statement 26265). Strictly adheres to APH 2024–27 regulatory guidelines.',
    'footer.copyright': 'All India Council for Technical Education (AICTE) · Ministry of Education, Govt. of India',
  },
  hi: {
    // Nav & Common
    'nav.brand': 'सुरक्षा (SURAKSHA)',
    'nav.subtitle': 'अखिल भारतीय तकनीकी शिक्षा परिषद सार्वभौम निक्षेप कोष',
    'nav.overview': 'अवलोकन',
    'nav.guide': 'दिशानिर्देश (गाइड)',
    'nav.howItWorks': 'यह कैसे कार्य करता है',
    'nav.contact': 'संपर्क करें',
    'nav.portfolio': 'संस्थागत संविभाग',
    'nav.wizard': 'सावधि जमा (FDR) पंजीकरण',
    'nav.provenance': 'त्रिपक्षीय सत्यापन',
    'nav.policy': 'नीति अनुकरण',
    'nav.release': 'विमुक्ति लेखाचित्र (DAG)',
    'nav.releaseLetters': 'विमुक्ति पत्र',
    'nav.audit': 'लेखापरीक्षा श्रृंखला',
    'nav.admin': 'प्रशासन',
    'nav.signIn': 'साइन इन करें',
    'nav.signOut': 'लॉगआउट',
    'nav.switchRole': 'डेमो भूमिका बदलें',
    'nav.language': 'भाषा',
    'common.back': '← पीछे जाएं',
    'common.next': 'आगे बढ़ें →',
    'common.submit': 'प्रस्तुत करें',
    'common.cancel': 'रद्द करें',
    'common.refresh': 'ताज़ा करें',
    'common.status': 'स्थिति',
    'common.actions': 'कार्यवाही',
    'common.view': 'देखें',
    'common.download': 'डाउनलोड करें',
    'common.verified': 'सत्यापित',
    'common.pending': 'लंबित',
    'common.discrepancy': 'विसंगति',
    'common.active': 'सक्रिय',

    // Roles
    'role.INSTITUTION_USER': 'कॉलेज कुलसचिव (रजिस्ट्रार)',
    'role.INSTITUTION_USER.desc': 'संस्थागत सावधि जमा रसीद प्रस्तुति एवं संविभाग प्रबंधन',
    'role.DEALING_OFFICER': 'व्यवहार अधिकारी (AICTE WRO)',
    'role.DEALING_OFFICER.desc': 'क्षेत्रीय अभिलेखों की प्राथमिक समीक्षा व प्रसंस्करण',
    'role.DIRECTOR_RB': 'क्षेत्रीय निदेशक (AICTE WRO)',
    'role.DIRECTOR_RB.desc': 'क्षेत्रीय पर्यवेक्षण व विसंगति समाधान निर्णय',
    'role.COMPETENT_AUTHORITY': 'सक्षम अनुमोदन प्राधिकारी',
    'role.COMPETENT_AUTHORITY.desc': 'धारा 6.46 के अंतर्गत अंतिम विमुक्ति आदेश स्वीकृति',
    'role.ACCOUNTS': 'लेखा एवं वित्त अधिकारी',
    'role.ACCOUNTS.desc': 'विमुक्ति पत्र निर्गमन एवं बैंक संवितरण समन्वय',
    'role.AUDITOR': 'केंद्रीय लेखापरीक्षक (CAG)',
    'role.AUDITOR.desc': 'क्रिप्टोग्राफिक बहीखाता व शून्य-विश्वास निष्पक्ष समीक्षा',
    'role.ADMIN': 'प्रणाली प्रशासक (HQ)',
    'role.ADMIN.desc': 'सेवा उपलब्धता, स्वास्थ्य जांच व प्रणाली संचालन',

    // Overview Hero
    'hero.badge': 'SIH26265 · AICTE अनुमोदन प्रक्रिया हस्तपुस्तिका (APH 2024–27)',
    'hero.title': '( AICTE सुरक्षा निक्षेप *नियंत्रण कक्ष* )',
    'hero.subtitle': 'अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE) के समक्ष गिरवी रखी गई संस्थागत सावधि जमा रसीदों (FDRs) का स्वचालित, सुरक्षित व पारदर्शी जीवन-चक्र प्रबंधन। शून्य-त्रुटि इन-ब्राउज़र ओसीआर, क्रिप्टोग्राफिक गैर-अस्वीकृति और बहु-विभागीय विमुक्ति प्रणाली।',
    'hero.signInBtn': 'नियंत्रण कक्ष में साइन इन करें',
    'hero.exploreBtn': 'नियामक स्तंभों का अन्वेषण करें',
    'hero.howItWorksBtn': 'कार्यप्रणाली देखें',
    'hero.guideBtn': '7 भूमिकाओं हेतु दिशानिर्देश',
    'hero.banksHeader': 'संबद्ध बैंक एवं वैधानिक डेस्क अनुकूलक',

    // Logged In Cockpit
    'cockpit.signedInAs': 'के रूप में साइन इन हैं',
    'cockpit.workspaceTitle': 'आपका सुरक्षा कार्यक्षेत्र',
    'cockpit.region': 'क्षेत्र',
    'cockpit.quickActions': 'त्वरित संचालन',
    'cockpit.portfolioTable': 'संविभाग तालिका',
    'cockpit.submitFdr': 'FDR जमा करें',
    'cockpit.threeWayProv': 'त्रिपक्षीय सत्यापन',
    'cockpit.simulatePolicy': 'APH गणना सिम्युलेट करें',
    'cockpit.releaseGraph': 'विमुक्ति DAG ग्राफ',
    'cockpit.auditChain': 'लेखापरीक्षा बहीखाता',

    // Guide Page
    'guide.title': 'सुरक्षा संचालन दिशानिर्देश (7 अधिकृत भूमिकाएं)',
    'guide.subtitle': 'अखिल भारतीय तकनीकी शिक्षा परिषद के 7 अधिकृत उपयोगकर्ता संवर्गों हेतु विस्तृत परिचालन नियमावली। APH 2024–27 धारा 6.46 के अनुसार वैधानिक दायित्व, स्वीकृति स्तर एवं चरणबद्ध कार्यप्रणाली।',
    'guide.roleHeader': 'भूमिका विवरण एवं अभिशासन तालिका',
    'guide.authorityLevel': 'प्राधिकार स्तर',
    'guide.statutoryMandate': 'वैधानिक अधिदेश',
    'guide.keyWorkflows': 'दैनिक चरणबद्ध कार्यप्रवाह',
    'guide.allowedScreens': 'अनुमति प्राप्त कार्यक्षेत्र स्क्रीन्स',
    'guide.switchAndTest': 'इस भूमिका के रूप में जांचें',
    'guide.guidelines': 'वैधानिक नियम एवं सत्यनिष्ठा प्रोटोकॉल',

    // How It Works Page
    'how.title': 'सुरक्षा की कार्यप्रणाली: वास्तुकला एवं तकनीकी प्रारूप',
    'how.subtitle': 'सभी 6 प्रमुख क्षेत्रों में सुरक्षा प्रणाली का गहन तकनीकी विश्लेषण: ब्राउज़र आधारित ओसीआर से लेकर क्रिप्टोग्राफिक हैश-श्रृंखला और धारा 6.46 बहु-विभागीय विमुक्ति लेखाचित्र तक।',
    'how.p1.title': '1. रसीद प्रविष्टि एवं शून्य-निर्भरता ब्राउज़र OCR',
    'how.p1.desc': 'संस्थान सावधि जमा प्रमाण-पत्र अपलोड करते हैं। इन-ब्राउज़र pdfjs-dist और Tesseract.js की सहायता से बिना बैकएंड निर्भरता के 9 वैधानिक प्रविष्टियों का स्वतः निष्कर्षण किया जाता है और SHA-256 फिंगरप्रिंट बनता है।',
    'how.p2.title': '2. त्रिपक्षीय उत्पत्ति मिलान (3-Way Reconciliation)',
    'how.p2.desc': 'संस्थान द्वारा घोषित विवरण, दस्तावेज ओसीआर और बैंक टोकन का स्वचालित मिलान होता है। किसी भी विसंगति को अधिकारी समीक्षा से पूर्व आवर्धक लेंस (Loupe) से चिन्हित किया जाता है।',
    'how.p3.title': '3. AICTE तालिका 1.4 नियामक नीति मैट्रिक्स',
    'how.p3.desc': 'इंजीनियरिंग, प्रबंधन, फार्मेसी और डिजाइन हेतु अनिवार्य सुरक्षा निक्षेप की सटीक गणना। पूर्वोत्तर, जम्मू-कश्मीर, लद्दाख, आकांक्षी जिले एवं महिला/दिव्यांग संस्थानों हेतु 50% वैधानिक रियायत तथा पट्टा भूमि हेतु 2 गुना निक्षेप नियम।',
    'how.p4.title': '4. 90/60/30-दिवसीय निगरानी व परिपक्वता चेतावनी सीढ़ी',
    'how.p4.desc': 'स्वचालित शेड्यूलर निरंतर FDR लेज़र की जांच करता है। T-90, T-60, T-30, T-15, T-7 और T-0 पर बहु-स्तरीय नोटिस प्रेषित किए जाते हैं ताकि अनधिकृत निकासी रोकी जा सके।',
    'how.p5.title': '5. APH धारा 6.46 बहु-विभागीय विमुक्ति DAG लेखाचित्र',
    'how.p5.desc': 'कर्तव्यों के पृथक्करण का सख्त पालन: छात्र शिकायत सेल (PGRC) अनापत्ति + मुख्य सतर्कता अधिकारी (CVO) सत्यनिष्ठा जांच + CAG लेखापरीक्षा सत्यापन + क्षेत्रीय निदेशक संस्तुति के बाद ही सक्षम प्राधिकारी स्वीकृति देते हैं।',
    'how.p6.title': '6. एन्क्रिप्टेड संप्रभु वॉल्ट एवं हैश-चेन ऑडिट',
    'how.p6.desc': 'दस्तावेज़ AES-256-GCM एन्क्रिप्शन के साथ पोस्टग्रेएसक्यूएल वॉल्ट में सुरक्षित रहते हैं। प्रत्येक घटना से SHA-256 मर्केल-लिंक्ड ऑडिट ब्लॉक बनता है, जिसे केंद्रीय लेखापरीक्षक किसी भी समय सत्यापित कर सकते हैं।',

    // Footer
    'footer.disclaimer': 'सुरक्षा अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE) हेतु विकसित एक अत्याधुनिक सावधि जमा नियंत्रण टॉवर है। यह स्मार्ट इंडिया हैकाथॉन 2026 (समस्या कथन 26265) के अंतर्गत APH 2024–27 नियमों के शत-प्रतिशत अनुपालन में निर्मित है।',
    'footer.copyright': 'अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE) · शिक्षा मंत्रालय, भारत सरकार',
  },
};

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('suraksha_language');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('suraksha_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || translations.en?.[key] || fallback || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  return useContext(I18nContext);
}
