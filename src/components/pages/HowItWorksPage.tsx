import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Scan, 
  Scale, 
  GitBranch, 
  Lock, 
  FileCheck, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Clock, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Eye,
  Server,
  Layers,
  FileText
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { useLanguage } from '../../lib/i18n';

interface HowItWorksPageProps {
  onNavigate: (screen: string) => void;
  currentRole: string;
}

export function HowItWorksPage({ onNavigate, currentRole }: HowItWorksPageProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'ocr' | 'provenance' | 'policy' | 'lifecycle' | 'dag' | 'vault'>('all');

  const domains = [
    {
      id: 'ocr',
      num: '01',
      titleEn: 'Zero-Dependency In-Browser OCR & Intake',
      titleHi: 'शून्य-निर्भरता इन-ब्राउज़र OCR एवं प्रविष्टि',
      tagEn: 'Client-Side AI & Computer Vision',
      tagHi: 'क्लाइंट-साइड एआई एवं कंप्यूटर विज़न',
      summaryEn: 'Instant extraction of 9 certificate fields in the browser with zero backend latency or failure risk.',
      summaryHi: 'बिना बैकएंड निर्भरता के ब्राउज़र में ही 9 प्रमाण-पत्र प्रविष्टियों का तात्कालिक निष्कर्षण।',
      targetScreen: 'wizard',
      deepDiveEn: [
        {
          heading: 'Hybrid Dual-Engine Architecture',
          text: 'When a college registrar uploads an FDR receipt (PDF, JPG, or PNG), SURAKSHA first inspects the digital PDF stream via pdfjs-dist. If a valid embedded text layer exists, it extracts clean typography in under 50 milliseconds. If the file is a scanned physical document or mobile photo, the system seamlessly boots Tesseract.js directly inside a Web Worker.',
        },
        {
          heading: 'Pre-Processing & Contrast Enhancement',
          text: 'Mobile photos frequently suffer from shadows, skew, and low DPI. SURAKSHA scales the canvas 3×, normalizes grayscale contrast, and applies Otsu binarization to separate watermark guilloche patterns from high-stakes text.',
        },
        {
          heading: 'Regex Pattern Matching on 9 Mandatory Fields',
          text: 'The extracted text is parsed across 9 key attributes: FDR Receipt Number, Principal Amount, Date of Issue, Date of Maturity, Issuing Bank, Branch Name, IFSC Code, Depositor/Trust Name, and the mandatory "Lien in favor of AICTE" clause.',
        },
        {
          heading: 'Instant SHA-256 Fingerprinting',
          text: 'Before any transmission, the browser calculates a cryptographic SHA-256 hash using the Web Crypto API. This immutable hash permanently identifies the file and anchors it to the AICTE ledger.',
        },
      ],
      deepDiveHi: [
        {
          heading: 'हाइब्रिड दोहरी-इंजन वास्तुकला',
          text: 'जब कॉलेज कुलसचिव FDR रसीद अपलोड करते हैं, तो सुरक्षा सर्वप्रथम pdfjs-dist से डिजिटल टेक्स्ट लेयर जांचती है। यदि डिजिटल टेक्स्ट हो, तो 50 मिलीसेकंड में परिणाम मिलता है। यदि स्कैन या मोबाइल फोटो हो, तो वेब वर्कर में Tesseract.js स्वतः सक्रिय हो जाता है।',
        },
        {
          heading: 'पूर्व-प्रसंस्करण एवं कंट्रास्ट सुधार',
          text: 'मोबाइल फोटो में छाया और कम रेजोल्यूशन की समस्या होती है। प्रणाली कैनवास को 3 गुना स्केल कर, ग्रेस्केल कंट्रास्ट को सामान्य करती है और बैकग्राउंड वॉटरमार्क से पाठ को अलग करती है।',
        },
        {
          heading: '9 अनिवार्य प्रविष्टियों का स्वतः निष्कर्षण',
          text: 'निष्कर्षित पाठ में से 9 महत्वपूर्ण तथ्य पहचाने जाते हैं: FDR रसीद संख्या, मूल राशि, जारी व परिपक्वता तिथि, बैंक, शाखा, IFSC, जमाकर्ता ट्रस्ट का नाम और AICTE के पक्ष में अनिवार्य लियन।',
        },
        {
          heading: 'तात्कालिक SHA-256 फिंगरप्रिंट',
          text: 'दस्तावेज़ की ब्राउज़र में ही Web Crypto API से SHA-256 हैश बनाई जाती है, जो दस्तावेज़ की स्थायी व छेड़छाड़-रहित पहचान सुनिश्चित करती है।',
        },
      ],
    },
    {
      id: 'provenance',
      num: '02',
      titleEn: 'Three-Way Provenance Reconciliation',
      titleHi: 'त्रिपक्षीय सत्यता सत्यापन एवं मिलान',
      tagEn: 'Triangulated Truth Verification',
      tagHi: 'त्रिकोणीय सत्यता पुष्टि प्रणाली',
      summaryEn: 'Cross-checks Declared Data vs. Document OCR vs. Bank Confirmation Token to eliminate fraudulent FDRs.',
      summaryHi: 'घोषित विवरण, दस्तावेज़ OCR और बैंक पुष्टि टोकन का त्रिकोणीय मिलान कर जाली FDR पर रोक।',
      targetScreen: 'provenance',
      deepDiveEn: [
        {
          heading: 'The Triangle of Truth',
          text: 'Historically, fraud occurred when an applicant declared ₹35 Lakhs in the portal, but uploaded a Photoshop-edited receipt or pledged the same deposit to two different government bodies. SURAKSHA triangulates 3 independent data streams: Column A (Institution Declaration), Column B (Document OCR Output), and Column C (Bank Branch API Confirmation Token).',
        },
        {
          heading: 'Interactive Digital Loupe',
          text: 'Dealing Officers can hover the interactive Loupe over physical FDR certificates with 2.5× optical zoom to inspect bank branch stamps, authorized signatures, and security guilloche micro-borders.',
        },
        {
          heading: 'Automated Discrepancy Detection & Locking',
          text: 'If any column diverges (e.g. ₹35,00,000 declared vs ₹3,50,000 on certificate), the system flags a CRITICAL_DISCREPANCY, instantly locking the instrument. Only a Regional Director has statutory authority to record an authenticated waiver.',
        },
      ],
      deepDiveHi: [
        {
          heading: 'सत्य का त्रिकोणीय सिद्धांत',
          text: 'पूर्व में धोखाधड़ी तब होती थी जब पोर्टल पर ₹35 लाख घोषित कर जाली रसीद लगा दी जाती थी। सुरक्षा 3 स्वतंत्र स्रोतों का मिलान करती है: कॉलम A (संस्थान की घोषणा), कॉलम B (दस्तावेज़ OCR), और कॉलम C (बैंक शाखा का पुष्टि टोकन)।',
        },
        {
          heading: 'इंटरैक्टिव डिजिटल आवर्धक लेंस (Loupe)',
          text: 'समीक्षा अधिकारी 2.5 गुना ज़ूम वाले लेंस से भौतिक रसीद की सील, हस्ताक्षर और सुरक्षा बॉर्डर की गहन जांच कर सकते हैं।',
        },
        {
          heading: 'स्वचालित विसंगति पहचान व लॉकिंग',
          text: 'यदि किसी भी कॉलम में अंतर पाया जाता है (जैसे घोषित ₹35 लाख बनाम रसीद पर ₹3.5 लाख), तो प्रणाली तत्काल विसंगति ध्वज लगाकर फ़ाइल को लॉक कर देती है। केवल क्षेत्रीय निदेशक ही कारण सहित विधिक समाधान दे सकते हैं।',
        },
      ],
    },
    {
      id: 'policy',
      num: '03',
      titleEn: 'AICTE Table 1.4 Dynamic Policy Engine',
      titleHi: 'AICTE तालिका 1.4 गतिशील नीति इंजन',
      tagEn: 'Statutory Capital Norms & Concessions',
      tagHi: 'वैधानिक पूंजी मानदंड एवं रियायतें',
      summaryEn: 'Encodes exact APH 2024–27 baseline capital norms, 50% regional/social concessions, and leased land rules.',
      summaryHi: 'APH 2024–27 आधारभूत मानदंड, 50% क्षेत्रीय/सामाजिक रियायतें और पट्टा भूमि नियमों का सटीक गणितीय अनुपालन।',
      targetScreen: 'policy',
      deepDiveEn: [
        {
          heading: 'Statutory Baseline Program Calculation',
          text: 'Different technical education programs require distinct baseline security deposits under AICTE APH Chapter 1 Table 1.4: Engineering UG (₹35 Lakhs), Management MBA (₹15 Lakhs), MCA / Computer Applications (₹15 Lakhs), Pharmacy (₹20 Lakhs), and Architecture (₹15 Lakhs).',
        },
        {
          heading: '50% Regional & Social Concession Engine',
          text: 'SURAKSHA programmatically applies the statutory 50% concession for institutions situated in the North Eastern Region (NER), Jammu & Kashmir, Ladakh, 112 Aspirational Districts, Andaman & Nicobar, Lakshadweep, as well as exclusively Women-only or PwD-only institutions.',
        },
        {
          heading: 'Leased Land Clause (2× Multiplier)',
          text: 'If an institution operates on leased land or leased building rather than freehold ownership, the statutory security deposit requirement automatically doubles to protect student interests against landlord eviction.',
        },
      ],
      deepDiveHi: [
        {
          heading: 'कार्यक्रमवार वैधानिक आधारभूत गणना',
          text: 'AICTE APH अध्याय 1 तालिका 1.4 के तहत विभिन्न पाठ्यक्रमों हेतु अलग सुरक्षा निक्षेप अनिवार्य है: बी.टेक इंजीनियरिंग (₹35 लाख), एमबीए प्रबंधन (₹15 लाख), एमसीए (₹15 लाख), फार्मेसी (₹20 लाख)।',
        },
        {
          heading: '50% क्षेत्रीय एवं सामाजिक रियायत इंजन',
          text: 'पूर्वोत्तर (NER), जम्मू-कश्मीर, लद्दाख, 112 आकांक्षी जिले, अंडमान-निकोबार, लक्षद्वीप तथा महिला/दिव्यांग संस्थानों हेतु 50% वैधानिक रियायत स्वतः लागू होती है।',
        },
        {
          heading: 'पट्टा भूमि नियम (2 गुना गुणक)',
          text: 'यदि संस्थान पट्टे की भूमि या भवन पर संचालित है, तो छात्रों के हितों की रक्षा हेतु आवश्यक सुरक्षा जमा स्वतः दोगुनी हो जाती है।',
        },
      ],
    },
    {
      id: 'lifecycle',
      num: '04',
      titleEn: 'Lifecycle Watchtower & Escalation Ladder',
      titleHi: 'जीवन-चक्र निगरानी एवं चेतावनी सीढ़ी',
      tagEn: 'Automated Maturity Sentinel',
      tagHi: 'स्वचालित परिपक्वता प्रहरी',
      summaryEn: 'Continuous ledger scans with automated countdown notices (T-90, T-60, T-30, T-15, T-7, T-0) to prevent unauthorized encashment.',
      summaryHi: 'अनधिकृत निकासी रोकने हेतु T-90 से T-0 तक स्वचालित बहु-स्तरीय सूचना प्रणाली।',
      targetScreen: 'portfolio',
      deepDiveEn: [
        {
          heading: 'Automated 10-Year Chronometer',
          text: 'Security deposits must remain in lock-in for 8 to 10 years. SURAKSHA tracks every deposit on a sub-millisecond timeline, preventing premature maturity triggers.',
        },
        {
          heading: 'Tiered Escalation Ladder',
          text: 'At T-90 days: First alert to College Registrar and Dealing Officer. At T-60 days: Reminder with renewal forms. At T-30 days: Formal notice copied to Bank Branch Manager. At T-7 days: Red-flag alert to Regional Director. At T-0 days: Automatic freeze preventing bank liquidation without AICTE sanction.',
        },
        {
          heading: 'Encashment Freeze Notice',
          text: 'If an FDR matures and the college has not initiated renewal or formal release, SURAKSHA automatically generates a legal Hold Notice to the bank, preventing the institution from withdrawing funds unmonitored.',
        },
      ],
      deepDiveHi: [
        {
          heading: '10-वर्षीय स्वचालित समय-मापक',
          text: 'सुरक्षा जमा 8 से 10 वर्ष तक अनिवार्य रूप से आबद्ध रहती है। सुरक्षा प्रणाली प्रत्येक जमा की सटीक समय-सीमा की निगरानी करती है।',
        },
        {
          heading: 'चरणबद्ध चेतावनी सीढ़ी',
          text: 'T-90 दिन: कुलसचिव व संवीक्षक को प्रथम अलर्ट। T-60 दिन: नवीनीकरण प्रपत्र सहित स्मरण। T-30 दिन: बैंक शाखा प्रबंधक को प्रतिलिपि सहित नोटिस। T-7 दिन: क्षेत्रीय निदेशक को उच्च-प्राथमिकता अलर्ट। T-0 दिन: AICTE स्वीकृति के बिना बैंक निकासी पर स्वतः रोक।',
        },
        {
          heading: 'निकासी पर रोक (Hold Notice)',
          text: 'यदि सावधि जमा परिपक्व हो जाए और नवीनीकरण न हो, तो बैंक को स्वतः रोक नोटिस प्रेषित होता है ताकि कोई अनधिकृत निकासी न हो सके।',
        },
      ],
    },
    {
      id: 'dag',
      num: '05',
      titleEn: 'APH Clause 6.46 Multi-Bureau Release DAG',
      titleHi: 'APH धारा 6.46 बहु-विभागीय विमुक्ति DAG',
      tagEn: 'Directed Acyclic Graph & Separation of Duties',
      tagHi: 'दिशाबद्ध अचक्रीय लेखाचित्र एवं कर्तव्य पृथक्करण',
      summaryEn: 'Mandatory 4-gate clearance DAG ensuring PGRC, CVO, Audit, and Regional Director sign off before release.',
      summaryHi: 'विमुक्ति से पूर्व छात्र शिकायत (PGRC), सतर्कता (CVO) एवं ऑडिट अनापत्ति सुनिश्चित करने वाला 4-द्वार DAG।',
      targetScreen: 'release',
      deepDiveEn: [
        {
          heading: 'Statutory 4-Gate Pipeline',
          text: 'Under APH Clause 6.46, release of security deposit is never a single-officer decision. The release petition flows through a strict Directed Acyclic Graph (DAG): Gate 1: Public Grievance Redressal Cell (PGRC) clearance confirming zero unpaid student dues or capitation fee complaints. Gate 2: Chief Vigilance Officer (CVO) clearance certifying zero active CBI/police or financial embezzlement inquiries. Gate 3: Statutory Audit reconciliation. Gate 4: Regional Director formal recommendation.',
        },
        {
          heading: 'Separation of Duties (SoD) Enforcement',
          text: 'The backend cryptographically verifies that the officer who verified the FDR cannot act as the Approving Authority or the Accounts disburser for the same institution.',
        },
        {
          heading: 'Cryptographic Release Sanction & Bank NOC',
          text: 'Only when all 4 clearance nodes evaluate to true can the Competent Authority sign off. This generates a SHA-256 release sanction token, enabling the Accounts department to issue the formal NOC to the bank.',
        },
      ],
      deepDiveHi: [
        {
          heading: 'वैधानिक 4-स्तरीय पाइपलाइन',
          text: 'धारा 6.46 के अंतर्गत विमुक्ति किसी एक अधिकारी का निर्णय नहीं हो सकती। यह एक सख्त DAG में आगे बढ़ती है: द्वार 1: छात्र शिकायत सेल (PGRC) अनापत्ति। द्वार 2: मुख्य सतर्कता अधिकारी (CVO) की वित्तीय गबन मुक्त अनापत्ति। द्वार 3: वैधानिक ऑडिट समाधान। द्वार 4: क्षेत्रीय निदेशक संस्तुति।',
        },
        {
          heading: 'कर्तव्यों के पृथक्करण (SoD) का अनुपालन',
          text: 'प्रणाली सुनिश्चित करती है कि जिस अधिकारी ने संवीक्षा की है, वह स्वयं अंतिम विमुक्ति आदेश या बैंक NOC जारी नहीं कर सकता।',
        },
        {
          heading: 'क्रिप्टोग्राफिक विमुक्ति स्वीकृति एवं बैंक NOC',
          text: 'सभी 4 द्वारों की स्वीकृति पर ही सक्षम प्राधिकारी हस्ताक्षर कर सकते हैं, जिससे उत्पन्न क्रिप्टोग्राफिक टोकन के आधार पर बैंक को अंतिम NOC जारी होता है।',
        },
      ],
    },
    {
      id: 'vault',
      num: '06',
      titleEn: 'Encrypted Sovereign Vault & Hash-Chain Audit',
      titleHi: 'एन्क्रिप्टेड संप्रभु वॉल्ट एवं हैश-चेन ऑडिट',
      tagEn: 'Zero-Trust Non-Repudiation',
      tagHi: 'शून्य-विश्वास गैर-अस्वीकृति लेज़र',
      summaryEn: 'AES-256-GCM encrypted document blobs and immutable SHA-256 event chaining for zero-trust CAG inspection.',
      summaryHi: 'PostgreSQL में AES-256-GCM एन्क्रिप्शन और CAG ऑडिट हेतु अपरिवर्तनीय SHA-256 मर्केल-लिंक्ड लेज़र।',
      targetScreen: 'audit',
      deepDiveEn: [
        {
          heading: 'PostgreSQL AES-256-GCM Sovereign Storage',
          text: 'Uploaded FDR certificates are never stored as plain public URLs on third-party buckets. They are encrypted with AES-256 in Galois/Counter Mode (GCM) using unique cryptographic nonces and stored inside the PostgreSQL sovereign database.',
        },
        {
          heading: 'Merkle-Style Hash-Chain Ledger',
          text: 'Every operational action (submission, OCR extraction, discrepancy flag, waiver, clearance, and sanction) produces an immutable audit block. Each block computes its SHA-256 hash across [event_id + timestamp + actor_role + payload + previous_block_hash].',
        },
        {
          heading: 'One-Click Zero-Trust CAG Audit Tool',
          text: 'Statutory auditors (CAG) can click "Verify Entire Chain" on the Audit page to recalculate all cryptographic hashes in the browser. Any alteration of past records immediately breaks the chain and displays a red tamper alert.',
        },
      ],
      deepDiveHi: [
        {
          heading: 'PostgreSQL AES-256-GCM संप्रभु वॉल्ट',
          text: 'अपलोड किए गए प्रमाण-पत्र किसी सार्वजनिक बकेट में नहीं रखे जाते। वे AES-256-GCM एन्क्रिप्शन के साथ पोस्टग्रेएसक्यूएल डेटाबेस में पूर्णतः सुरक्षित रहते हैं।',
        },
        {
          heading: 'मर्केल-शैली हैश-श्रृंखला लेज़र',
          text: 'प्रत्येक परिचालन (प्रविष्टि, OCR, विसंगति, समाधान, अनापत्ति, विमुक्ति) एक अपरिवर्तनीय ऑडिट ब्लॉक उत्पन्न करता है। प्रत्येक ब्लॉक पिछले ब्लॉक के हैश से जुड़ा होता है।',
        },
        {
          heading: 'एक-क्लिक शून्य-विश्वास CAG ऑडिट उपकरण',
          text: 'केंद्रीय लेखापरीक्षक (CAG) किसी भी समय संपूर्ण श्रृंखला का पुनः सत्यापन कर सकते हैं। डेटाबेस में किसी भी अनाधिकृत फेरबदल पर श्रृंखला टूट जाती है और तत्काल चेतावनी प्रकट होती है।',
        },
      ],
    },
  ];

  const filteredDomains = activeTab === 'all' 
    ? domains 
    : domains.filter((d) => d.id === activeTab);

  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-12 px-4 sm:px-8 max-w-[1400px] mx-auto text-left font-sans">
      {/* Top Banner */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3 shadow-xs">
          <Cpu className="w-3.5 h-3.5 text-[#444C3D]" />
          {language === 'hi' ? 'समग्र प्रणाली वास्तुकला एवं तकनीकी प्रारूप' : 'Full Architecture & Regulatory Engineering Blueprint'}
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          {`( *${language === 'hi' ? 'सुरक्षा कैसे कार्य करता है' : 'How SURAKSHA Works'}* )`}
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-3 max-w-3xl leading-relaxed">
          {t('how.subtitle')}
        </p>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#706E66] mb-3 font-semibold">
          {language === 'hi' ? 'डोमेन चुनें:' : 'Filter by Architectural Domain:'}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#444C3D] text-white border-[#444C3D] shadow-sm'
                : 'bg-white border-[#E5DFD5] text-[#55544E] hover:bg-[#FAF8F5]'
            }`}
          >
            {language === 'hi' ? 'सभी 6 डोमेन' : 'All 6 Core Domains'}
          </button>
          {domains.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveTab(d.id as any)}
              className={`px-4 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                activeTab === d.id
                  ? 'bg-[#444C3D] text-white border-[#444C3D] shadow-sm'
                  : 'bg-white border-[#E5DFD5] text-[#55544E] hover:bg-[#FAF8F5]'
              }`}
            >
              <span>{d.num}. {language === 'hi' ? d.titleHi : d.titleEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Domain Cards */}
      <div className="space-y-10">
        {filteredDomains.map((domain) => (
          <article 
            key={domain.id} 
            className="rounded-3xl border border-[#E5DFD5] bg-white p-6 sm:p-10 shadow-sm relative overflow-hidden"
          >
            {/* Top Row */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D] text-xs font-mono font-medium">
                  <span className="font-bold">{domain.num}</span> · {language === 'hi' ? domain.tagHi : domain.tagEn}
                </div>
                <h2 className="text-2xl sm:text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  {language === 'hi' ? domain.titleHi : domain.titleEn}
                </h2>
                <p className="text-xs sm:text-sm text-[#706E66]">
                  {language === 'hi' ? domain.summaryHi : domain.summaryEn}
                </p>
              </div>

              {/* Try this live in the portal */}
              <button
                onClick={() => onNavigate(domain.targetScreen)}
                className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:bg-[#EFEAE1] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-2 transition cursor-pointer"
              >
                <span>{language === 'hi' ? 'लाइव स्क्रीन देखें' : 'Try in Live System'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#444C3D]" />
              </button>
            </div>

            {/* Deep Dive Pillars */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {(language === 'hi' ? domain.deepDiveHi : domain.deepDiveEn).map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#444C3D]" />
                    <h3 className="font-semibold text-xs sm:text-sm text-[#1C1D1A]">{item.heading}</h3>
                  </div>
                  <p className="text-xs text-[#55544E] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Zero Overclaim Notice */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#EFEAE1]/70 border border-[#DDD6C9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-[#444C3D] uppercase tracking-wider">
            {language === 'hi' ? 'शून्य-अतिरंजना वैधानिक प्रमाणिकता (Zero-Overclaim Defensibility)' : 'Zero-Overclaim Statutory Defensibility'}
          </div>
          <p className="text-xs text-[#55544E] max-w-2xl leading-relaxed">
            {language === 'hi'
              ? 'सुरक्षा किसी अवास्तविक सार्वजनिक ब्लॉकचेन या असत्यापित लाइव कोर-बैंकिंग एपीआई का झूठा दावा नहीं करता। यह वास्तविक भारतीय आईटी मानकों (NIC / CERT-In) के अनुसार AES-256-GCM और SHA-256 क्रिप्टोग्राफी पर आधारित है।'
              : 'SURAKSHA strictly avoids unrealistic public blockchain claims or unverified core-banking API promises. It is built to genuine Indian government IT standards (NIC/CERT-In): in-browser OCR, AES-256-GCM encrypted sovereign database vaulting, and exact APH Clause 6.46 multi-bureau DAG governance.'}
          </p>
        </div>
        <button
          onClick={() => onNavigate('guide')}
          className="px-6 py-3 rounded-xl bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium shrink-0 transition shadow-sm cursor-pointer"
        >
          {language === 'hi' ? '7 भूमिकाओं का दिशानिर्देश देखें →' : 'Read Persona Guide (7 Roles) →'}
        </button>
      </div>
    </main>
  );
}
