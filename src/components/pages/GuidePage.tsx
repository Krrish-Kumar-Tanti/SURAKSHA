import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Building2, 
  Scale, 
  FileCheck, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  Lock, 
  Clock, 
  Check, 
  HelpCircle,
  Eye,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { useLanguage } from '../../lib/i18n';

interface GuidePageProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onNavigate: (screen: string) => void;
}

export function GuidePage({ currentRole, onRoleChange, onNavigate }: GuidePageProps) {
  const { language, t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const personas = [
    {
      id: 'INSTITUTION_USER',
      titleEn: 'College Registrar / Principal',
      titleHi: 'कॉलेज कुलसचिव / प्राचार्य',
      badgeEn: 'Institutional Intake & Portfolio',
      badgeHi: 'संस्थागत प्रविष्टि एवं संविभाग',
      levelEn: 'Level 1: Applicant & Custody Holder',
      levelHi: 'स्तर 1: आवेदक एवं निक्षेप धारक',
      descEn: 'Represents the college or sponsoring educational trust. Responsible for registering fixed deposits, uploading verified bank receipt scans, and initiating formal release requests upon course completion.',
      descHi: 'कॉलेज अथवा प्रायोजक शैक्षणिक ट्रस्ट का अधिकृत प्रतिनिधि। सावधि जमा रसीद पंजीकरण, बैंक रसीद स्कैन अपलोड और पाठ्यक्रम समापन पर विमुक्ति आवेदन हेतु उत्तरदायी।',
      screens: ['portfolio', 'wizard', 'provenance', 'policy', 'release'],
      workflowsEn: [
        {
          step: '1. Fixed Deposit Registration & OCR',
          action: 'Navigate to "FDR Submission". Upload the scanned FDR certificate. The in-browser OCR automatically parses the 9 required fields (FDR number, principal amount, issue/maturity dates, issuing bank, IFSC, and lien).',
        },
        {
          step: '2. Regulatory Policy Compliance Check',
          action: 'Select your approved academic programme (e.g. Engineering UG, Management, MCA). Check whether your deposit meets the AICTE APH Table 1.4 baseline and verify applicable 50% concessions (NER, J&K, Ladakh, Women-only).',
        },
        {
          step: '3. Track Portfolio & Maturity Lifecycle',
          action: 'Monitor the institutional dashboard. Receive automated T-90, T-60, and T-30 countdown alerts before deposit maturity to prepare renewal or release documentation.',
        },
        {
          step: '4. Initiate Deposit Release Request',
          action: 'Once the mandatory 8-10 year lock-in period completes and all academic obligations are fulfilled, submit a formal release petition to trigger the APH Clause 6.46 multi-bureau review.',
        },
      ],
      workflowsHi: [
        {
          step: '1. सावधि जमा पंजीकरण एवं OCR',
          action: '"FDR पंजीकरण" में जाएं। बैंक प्रमाण-पत्र अपलोड करें। इन-ब्राउज़र OCR स्वतः 9 अनिवार्य प्रविष्टियों (रसीद संख्या, मूल राशि, तिथियां, बैंक, IFSC एवं लियन) को निष्कर्षित करता है।',
        },
        {
          step: '2. नियामक नीति अनुपालन जांच',
          action: 'स्वीकृत शैक्षणिक कार्यक्रम चुनें। AICTE APH तालिका 1.4 के अनुसार न्यूनतम आवश्यक जमा और 50% वैधानिक रियायतों (पूर्वोत्तर, जम्मू-कश्मीर, लद्दाख, महिला संस्थान) की जांच करें।',
        },
        {
          step: '3. संविभाग एवं परिपक्वता निगरानी',
          action: 'संस्थागत डैशबोर्ड में निगरानी रखें। परिपक्वता से पूर्व T-90, T-60 और T-30 स्वचालित अलर्ट प्राप्त करें ताकि नवीनीकरण अथवा विमुक्ति की तैयारी की जा सके।',
        },
        {
          step: '4. विमुक्ति आवेदन प्रस्तुत करना',
          action: '8-10 वर्ष की अनिवार्य अवधि पूर्ण होने तथा सभी दायित्व समाप्त होने पर धारा 6.46 बहु-विभागीय समीक्षा हेतु आवेदन प्रस्तुत करें।',
        },
      ],
      rulesEn: [
        'FDR must strictly be issued in the joint names of the Trust and the Regional Officer, AICTE.',
        'Tenor must satisfy minimum statutory requirements (typically 10 years).',
        'Lien in favor of AICTE must be explicitly noted by the issuing bank branch.',
      ],
      rulesHi: [
        'सावधि जमा रसीद अनिवार्यतः ट्रस्ट एवं क्षेत्रीय अधिकारी, AICTE के संयुक्त नाम पर होनी चाहिए।',
        'अवधि न्यूनतम वैधानिक मानदंडों (साधारणतः 10 वर्ष) के अनुरूप होनी चाहिए।',
        'जारीकर्ता बैंक शाखा द्वारा AICTE के पक्ष में स्पष्ट लियन अंकित होना अनिवार्य है।',
      ],
    },
    {
      id: 'DEALING_OFFICER',
      titleEn: 'Dealing Officer (AICTE Regional Office)',
      titleHi: 'व्यवहार अधिकारी (AICTE क्षेत्रीय कार्यालय)',
      badgeEn: 'First-Line Scrutiny & 3-Way Reconciliation',
      badgeHi: 'प्रथम-पंक्ति संवीक्षा एवं त्रिपक्षीय मिलान',
      levelEn: 'Level 2: Scrutiny & Field Officer',
      levelHi: 'स्तर 2: संवीक्षा एवं क्षेत्रीय अधिकारी',
      descEn: 'The frontline review officer at the AICTE Regional Bureau (e.g. WRO Mumbai). Verifies uploaded FDRs against physical records, examines 3-way reconciliation discrepancies, and performs initial release stage processing.',
      descHi: 'AICTE क्षेत्रीय कार्यालय (जैसे WRO मुंबई) का प्राथमिक संवीक्षा अधिकारी। अपलोड किए गए FDR की भौतिक अभिलेखों से जांच, त्रिपक्षीय मिलान विसंगति समीक्षा और विमुक्ति प्रक्रिया का संचालन।',
      screens: ['portfolio', 'provenance', 'policy', 'release', 'audit'],
      workflowsEn: [
        {
          step: '1. Scrutinize Incoming FDR Submissions',
          action: 'Review college submissions in the Regional Portfolio. Check document clarity, SHA-256 integrity fingerprints, and bank details.',
        },
        {
          step: '2. Three-Way Provenance Inspection',
          action: 'Open the "Provenance" screen. Inspect the 3 columns (Declared Data vs OCR vs Bank Token). Use the interactive Loupe to verify critical micro-text on the physical certificate.',
        },
        {
          step: '3. Flag Discrepancies & Coordinate Verification',
          action: 'If an IFSC, amount, or depositor name diverges, immediately flag a discrepancy. Contact the issuing bank branch via authenticated channel for confirmation.',
        },
        {
          step: '4. Process Clearance DAG Checklists',
          action: 'In the Release Graph, verify that student grievance (PGRC) and regional audit clearances are in order before forwarding to the Regional Director.',
        },
      ],
      workflowsHi: [
        {
          step: '1. आने वाले FDR आवेदनों की संवीक्षा',
          action: 'क्षेत्रीय संविभाग में कॉलेज प्रविष्टियों की समीक्षा करें। दस्तावेज़ स्पष्टता, SHA-256 हैश और बैंक विवरण की जांच करें।',
        },
        {
          step: '2. त्रिपक्षीय सत्यता सत्यापन',
          action: '"त्रिपक्षीय सत्यापन" स्क्रीन खोलें। घोषित आंकड़े, OCR एवं बैंक टोकन का मिलान करें। भौतिक रसीद के सूक्ष्म पाठ की आवर्धक लेंस से जांच करें।',
        },
        {
          step: '3. विसंगति अंकन एवं बैंक समन्वय',
          action: 'यदि IFSC, राशि या नाम में भिन्नता हो, तो तत्काल विसंगति ध्वज अंकित करें और अधिकृत माध्यम से बैंक शाखा से पुष्टि प्राप्त करें।',
        },
        {
          step: '4. विमुक्ति चेकलिस्ट का प्रसंस्करण',
          action: 'विमुक्ति लेखाचित्र में छात्र शिकायत (PGRC) एवं क्षेत्रीय ऑडिट अनापत्तियों की पुष्टि कर क्षेत्रीय निदेशक को अग्रसारित करें।',
        },
      ],
      rulesEn: [
        'Never waive a discrepancy without written bank branch confirmation on file.',
        'Ensure the institution does not have active court cases or unserved penalties before endorsing release.',
      ],
      rulesHi: [
        'बैंक शाखा की लिखित पुष्टि के बिना किसी भी विसंगति को कभी माफ न करें।',
        'विमुक्ति संस्तुति से पूर्व सुनिश्चित करें कि संस्थान पर कोई सक्रिय अदालती रोक या जुर्माना लंबित न हो।',
      ],
    },
    {
      id: 'DIRECTOR_RB',
      titleEn: 'Regional Director (AICTE Regional Office)',
      titleHi: 'क्षेत्रीय निदेशक (AICTE क्षेत्रीय कार्यालय)',
      badgeEn: 'Regional Governance & Discrepancy Waiver',
      badgeHi: 'क्षेत्रीय अभिशासन एवं विसंगति निर्णय',
      levelEn: 'Level 3: Regional Head & Discrepancy Authority',
      levelHi: 'स्तर 3: क्षेत्रीय प्रमुख एवं निर्णय प्राधिकारी',
      descEn: 'The executive head of the Regional Bureau. Evaluates Dealing Officer reports, resolves or waives legitimate typographical discrepancies, endorses statutory release recommendations, and manages regional risk.',
      descHi: 'क्षेत्रीय कार्यालय का प्रशासनिक प्रमुख। व्यवहार अधिकारी की रिपोर्ट का मूल्यांकन, वैध विसंगतियों का विधिक निस्तारण, विमुक्ति संस्तुति और क्षेत्रीय जोखिम का प्रबंधन।',
      screens: ['portfolio', 'provenance', 'policy', 'release', 'audit'],
      workflowsEn: [
        {
          step: '1. Regional Portfolio Surveillance',
          action: 'Track macro metrics: total locked capital across all regional colleges, maturing portfolios, and high-risk discrepancy clusters.',
        },
        {
          step: '2. Exercise Discrepancy Waiver Authority',
          action: 'On the Provenance screen, evaluate flagged issues (such as minor bank branch mergers). If supported by official bank gazette, execute a formal recorded waiver.',
        },
        {
          step: '3. Endorse Release Clearances',
          action: 'Review the APH Clause 6.46 clearance graph. Ensure PGRC and CVO clearances are authenticated. Endorse the file to the Competent Approving Authority.',
        },
      ],
      workflowsHi: [
        {
          step: '1. क्षेत्रीय संविभाग का समग्र पर्यवेक्षण',
          action: 'क्षेत्र के समस्त कॉलेजों की कुल आबद्ध पूंजी, परिपक्व होने वाली जमाओं और विसंगति मामलों की निगरानी करें।',
        },
        {
          step: '2. विसंगति समाधान प्राधिकार का प्रयोग',
          action: 'त्रिपक्षीय स्क्रीन पर चिन्हित मामलों की समीक्षा करें। यदि बैंक विलय जैसी वैध स्थिति हो, तो विधिवत कारण दर्ज कर समाधान आदेश दें।',
        },
        {
          step: '3. विमुक्ति संस्तुति को अग्रेषित करना',
          action: 'धारा 6.46 विमुक्ति DAG की जांच करें। PGRC और CVO अनापत्तियों की प्रामाणिकता परख कर सक्षम प्राधिकारी को संस्तुति भेजें।',
        },
      ],
      rulesEn: [
        'Discrepancy waivers generate an indelible audit log entry recorded in the SHA-256 chain.',
        'Cannot approve a release sanction alone—must forward to the Competent Authority.',
      ],
      rulesHi: [
        'विसंगति समाधान का प्रत्येक निर्णय SHA-256 ऑडिट श्रृंखला में स्थायी रूप से दर्ज होता है।',
        'अंतिम विमुक्ति आदेश स्वयं जारी नहीं कर सकते—सक्षम प्राधिकारी को अग्रेषित करना अनिवार्य है।',
      ],
    },
    {
      id: 'COMPETENT_AUTHORITY',
      titleEn: 'Competent Authority (Approving Authority)',
      titleHi: 'सक्षम अनुमोदन प्राधिकारी (मुख्यालय)',
      badgeEn: 'Statutory Release Sanctioning Authority',
      badgeHi: 'अंतिम विमुक्ति स्वीकृति प्राधिकार',
      levelEn: 'Level 4: Apex Sanctioning Executive',
      levelHi: 'स्तर 4: शीर्ष स्वीकृति प्राधिकारी',
      descEn: 'The highest approving official authorized under AICTE statutory regulations to sanction the final release of security deposits. Examines the fully satisfied multi-bureau DAG and signs the statutory release order.',
      descHi: 'AICTE अधिनियम के अंतर्गत सुरक्षा निक्षेप की अंतिम विमुक्ति स्वीकृत करने हेतु अधिकृत शीर्ष अधिकारी। सभी 4 अनापत्तियों की पुष्टि के पश्चात विमुक्ति आदेश पर हस्ताक्षर।',
      screens: ['portfolio', 'provenance', 'policy', 'release', 'audit'],
      workflowsEn: [
        {
          step: '1. Review Fully-Satisfied Release Cases',
          action: 'Navigate to the Release Graph DAG. Filter cases where PGRC, CVO, Audit, and Regional Director nodes are 100% green and cleared.',
        },
        {
          step: '2. Verify Chief Vigilance Officer (CVO) Stamp',
          action: 'Under APH Clause 6.46(e), verify zero ongoing embezzlement or CBI/police inquiries involving the trust.',
        },
        {
          step: '3. Execute Digital Release Sanction',
          action: 'Sign off on the digital release sanction. This transitions the instrument status to SANCTIONED and issues a cryptographic release token to Accounts.',
        },
      ],
      workflowsHi: [
        {
          step: '1. पूर्ण रूप से संतुष्ट विमुक्ति मामलों की समीक्षा',
          action: 'विमुक्ति DAG पर जाएं। उन मामलों को देखें जहां PGRC, CVO, ऑडिट और क्षेत्रीय निदेशक के सभी नोड्स पूर्णतः स्वीकृत हैं।',
        },
        {
          step: '2. मुख्य सतर्कता अधिकारी (CVO) अनापत्ति की पुष्टि',
          action: 'APH धारा 6.46(e) के तहत सुनिश्चित करें कि ट्रस्ट के विरुद्ध कोई गबन अथवा सतर्कता जांच लंबित नहीं है।',
        },
        {
          step: '3. डिजिटल विमुक्ति स्वीकृति निष्पादन',
          action: 'विमुक्ति स्वीकृति पर हस्ताक्षर करें। इससे स्थिति SANCTIONED में परिवर्तित होती है और लेखा विभाग को आदेश प्रेषित होता है।',
        },
      ],
      rulesEn: [
        'Separation of Duties (SoD): A Competent Authority cannot act as the initial Dealing Officer or Accounts disburser.',
        'Release cannot be signed if any clearance node remains in PENDING or BLOCKED status.',
      ],
      rulesHi: [
        'कर्तव्यों का पृथक्करण (SoD): सक्षम प्राधिकारी स्वयं संवीक्षक अथवा लेखा संवितरक के रूप में कार्य नहीं कर सकते।',
        'यदि कोई भी अनापत्ति नोड लंबित अथवा बाधित हो, तो विमुक्ति स्वीकृत नहीं की जा सकती।',
      ],
    },
    {
      id: 'ACCOUNTS',
      titleEn: 'Accounts Officer (Finance & Disbursement)',
      titleHi: 'लेखा एवं वित्त अधिकारी',
      badgeEn: 'Financial Execution & NOC Issuance',
      badgeHi: 'वित्तीय निष्पादन एवं NOC निर्गमन',
      levelEn: 'Level 5: Financial Execution Desk',
      levelHi: 'स्तर 5: वित्तीय निष्पादन डेस्क',
      descEn: 'The finance desk responsible for taking sanctioned release orders, generating official No Objection Certificates (NOCs) to the bank, verifying interest calculations, and closing the institutional account in the register.',
      descHi: 'स्वीकृत विमुक्ति आदेशों के आधार पर बैंक हेतु औपचारिक अनापत्ति प्रमाण-पत्र (NOC) तैयार करने, ब्याज गणना जांचने और खाते को पूर्ण रूप से बंद करने हेतु उत्तरदायी।',
      screens: ['home', 'release', 'audit'],
      workflowsEn: [
        {
          step: '1. Ingest Sanctioned Release Orders',
          action: 'Open the Release Letters queue. Filter for instruments sanctioned by the Competent Authority.',
        },
        {
          step: '2. Generate Bank No Objection Certificate (NOC)',
          action: 'Generate the official AICTE NOC PDF to the bank branch manager, releasing the lien in favor of AICTE.',
        },
        {
          step: '3. Log Bank Encashment Confirmation',
          action: 'Receive and upload the final bank liquidation advice. Mark the security deposit record as RELEASED_AND_SETTLED.',
        },
      ],
      workflowsHi: [
        {
          step: '1. स्वीकृत विमुक्ति आदेश प्राप्त करना',
          action: 'विमुक्ति पत्र सूची खोलें। सक्षम प्राधिकारी द्वारा स्वीकृत सावधि जमाओं की सूची देखें।',
        },
        {
          step: '2. बैंक अनापत्ति प्रमाण-पत्र (NOC) सृजन',
          action: 'बैंक शाखा प्रबंधक हेतु AICTE का आधिकारिक NOC पीडीएफ तैयार करें, जिससे AICTE का लियन समाप्त होता है।',
        },
        {
          step: '3. बैंक संवितरण पुष्टि दर्ज करना',
          action: 'बैंक से अंतिम निपटान रसीद प्राप्त करें और प्रणाली में स्थिति को RELEASED_AND_SETTLED के रूप में अद्यतन करें।',
        },
      ],
      rulesEn: [
        'NOC must quote the cryptographic sanction token generated by the Competent Authority.',
        'Retain interest and penalty deductions if mandated by institutional disciplinary directives.',
      ],
      rulesHi: [
        'NOC में सक्षम प्राधिकारी द्वारा जारी क्रिप्टोग्राफिक स्वीकृति टोकन अंकित होना अनिवार्य है।',
        'यदि अनुशासनिक आदेश हो, तो आवश्यक ब्याज व जुर्माना कटौती सुनिश्चित करें।',
      ],
    },
    {
      id: 'AUDITOR',
      titleEn: 'Central Auditor (CAG & Statutory Oversight)',
      titleHi: 'केंद्रीय लेखापरीक्षक (CAG एवं वैधानिक निगरानी)',
      badgeEn: 'Zero-Trust Inspection & Hash-Chain Verification',
      badgeHi: 'शून्य-विश्वास निरीक्षण एवं हैश-चेन सत्यापन',
      levelEn: 'Independent Oversight: Non-Executive',
      levelHi: 'स्वतंत्र निगरानी: गैर-प्रशासनिक',
      descEn: 'Statutory external auditor representing Comptroller & Auditor General (CAG) or AICTE Central Audit Cell. Has read-only zero-trust access to inspect the cryptographic SHA-256 chain, detect tampering, and audit lifecycle trails.',
      descHi: 'नियंत्रक एवं महालेखापरीक्षक (CAG) अथवा AICTE केंद्रीय ऑडिट सेल का अधिकृत लेखापरीक्षक। क्रिप्टोग्राफिक बहीखाते की निष्पक्ष जांच, छेड़छाड़ का पता लगाने और संपूर्ण ऑडिट ट्रेल सत्यापन हेतु पूर्ण अधिकार।',
      screens: ['portfolio', 'provenance', 'policy', 'release', 'audit'],
      workflowsEn: [
        {
          step: '1. Inspect Cryptographic Hash-Chain Ledger',
          action: 'Navigate to "Audit Chain". Execute the one-click cryptographic validator to re-calculate and re-verify SHA-256 hashes from the genesis block to the latest event.',
        },
        {
          step: '2. Sample Random High-Value Instruments',
          action: 'Inspect 3-way reconciliation for deposits exceeding ₹50 Lakhs. Verify that physical certificates, bank verification tokens, and approvals align.',
        },
        {
          step: '3. Verify Separation-of-Duties (SoD) Compliance',
          action: 'Check that no officer signed both Dealing Officer review and Competent Authority release for the same institution.',
        },
      ],
      workflowsHi: [
        {
          step: '1. क्रिप्टोग्राफिक हैश-श्रृंखला लेज़र की जांच',
          action: '"लेखापरीक्षा श्रृंखला" पर जाएं। जेनेसिस ब्लॉक से नवीनतम घटना तक SHA-256 हैश की गणितीय पुनः-सत्यापना हेतु सत्यापन बटन दबाएं।',
        },
        {
          step: '2. उच्च-मूल्य जमाओं का यादृच्छिक नमूना परीक्षण',
          action: '₹50 लाख से अधिक की जमाओं के त्रिपक्षीय मिलान का निरीक्षण करें। भौतिक रसीद, बैंक टोकन और स्वीकृतियों की संगति परखें।',
        },
        {
          step: '3. कर्तव्यों के पृथक्करण (SoD) का सत्यापन',
          action: 'पुष्टि करें कि किसी भी एक अधिकारी ने एक ही संस्थान हेतु संवीक्षक और विमुक्ति प्राधिकारी दोनों के रूप में हस्ताक्षर नहीं किए हैं।',
        },
      ],
      rulesEn: [
        'Auditors have strict zero-write privileges: cannot create, alter, or release deposits.',
        'Any detected hash divergence triggers immediate alert to CVO and IT Directorate.',
      ],
      rulesHi: [
        'लेखापरीक्षकों को केवल पठन (Read-only) अधिकार प्राप्त हैं—वे जमा में परिवर्तन या विमुक्ति नहीं कर सकते।',
        'हैश श्रृंखला में किसी भी विचलन पर तत्काल मुख्य सतर्कता अधिकारी और आईटी सेल को चेतावनी जाती है।',
      ],
    },
    {
      id: 'ADMIN',
      titleEn: 'System Administrator (AICTE HQ IT Bureau)',
      titleHi: 'प्रणाली प्रशासक (AICTE मुख्यालय आईटी सेल)',
      badgeEn: 'Infrastructure & System Availability',
      badgeHi: 'अवसंरचना एवं प्रणाली स्वास्थ्य निगरानी',
      levelEn: 'Technical Infrastructure & Administration',
      levelHi: 'तकनीकी अवसंरचना एवं प्रशासन',
      descEn: 'Responsible for server infrastructure, database connectivity, Render/Vercel synchronization, encryption key rotation, and health checks across microservices.',
      descHi: 'सर्वर अवसंरचना, डेटाबेस कनेक्टिविटी, रेंडर/वर्सेल सिंक्रनाइज़ेशन, एन्क्रिप्शन कुंजी प्रबंधन और प्रणाली स्वास्थ्य निगरानी हेतु उत्तरदायी।',
      screens: ['admin', 'portfolio', 'audit'],
      workflowsEn: [
        {
          step: '1. Service Health & Uptime Diagnostics',
          action: 'Open "Administration". Verify active connection to the live FastAPI / PostgreSQL backend. Check latency and endpoint responses.',
        },
        {
          step: '2. Database Sovereign Storage Monitoring',
          action: 'Verify AES-256-GCM encrypted document blobs in PostgreSQL. Ensure secure key configuration and zero unencrypted leaks.',
        },
        {
          step: '3. Automated Scheduler & Ticker Verification',
          action: 'Ensure the T-90 to T-0 maturity countdown daemon is executing reliably without duplicate notice dispatch.',
        },
      ],
      workflowsHi: [
        {
          step: '1. सेवा स्वास्थ्य एवं अपटाइम निदान',
          action: '"प्रशासन" पृष्ठ खोलें। FastAPI / PostgreSQL बैकएंड से सक्रिय संपर्क की पुष्टि करें। लेटेंसी और एंडपॉइंट्स जांचें।',
        },
        {
          step: '2. डेटाबेस संप्रभु स्टोरेज निगरानी',
          action: 'PostgreSQL में AES-256-GCM एन्क्रिप्टेड दस्तावेज़ ब्लॉब्स की जांच करें। सुरक्षित कुंजी विन्यास सुनिश्चित करें।',
        },
        {
          step: '3. स्वचालित शेड्यूलर एवं अलर्ट सत्यापन',
          action: 'सुनिश्चित करें कि परिपक्वता चेतावनी डेमन सुचारू रूप से चल रहा है और कोई डुप्लिकेट नोटिस नहीं जा रहा।',
        },
      ],
      rulesEn: [
        'Admins cannot alter financial figures or bypass statutory release clearance DAGs.',
        'Master encryption keys must conform to AES-256 standards with regular audit rotation.',
      ],
      rulesHi: [
        'प्रशासक वित्तीय आंकड़ों को बदल नहीं सकते और न ही वैधानिक विमुक्ति DAG को बायपास कर सकते हैं।',
        'मास्टर एन्क्रिप्शन कुंजियां नियमित ऑडिट रोटेशन के साथ AES-256 मानकों के अनुरूप होनी चाहिए।',
      ],
    },
  ];

  const activePersona = personas.find((p) => p.id === selectedRole) || personas[0];

  const handleTestRole = (roleId: string) => {
    onRoleChange(roleId);
    // Find default screen
    const defaultScreen = roleId === 'INSTITUTION_USER' ? 'portfolio' :
      roleId === 'COMPETENT_AUTHORITY' ? 'release' :
      roleId === 'ACCOUNTS' ? 'release' :
      roleId === 'AUDITOR' ? 'audit' :
      roleId === 'ADMIN' ? 'admin' : 'portfolio';
    onNavigate(defaultScreen);
  };

  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-12 px-4 sm:px-8 max-w-[1400px] mx-auto text-left font-sans">
      {/* Top Banner */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-[#444C3D]" />
          {language === 'hi' ? '7 अधिकृत संवर्गों हेतु परिचालन नियमावली' : 'Operational Handbook for 7 Authorized Roles'}
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          {`( *${language === 'hi' ? 'सुरक्षा परिचालन दिशानिर्देश' : 'SURAKSHA Operational Guide'}* )`}
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-3 max-w-3xl leading-relaxed">
          {t('guide.subtitle')}
        </p>
      </div>

      {/* Role Picker Ribbon */}
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#706E66] mb-3 font-semibold">
          {language === 'hi' ? 'भूमिका चुनें और कार्यप्रवाह देखें:' : 'Select an authorized role to inspect operations:'}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {personas.map((p) => {
            const isSelected = selectedRole === p.id;
            const isCurrent = currentRole === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedRole(p.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#444C3D] text-white border-[#444C3D] shadow-sm'
                    : 'bg-white border-[#E5DFD5] text-[#55544E] hover:bg-[#FAF8F5] hover:border-[#DDD6C9]'
                }`}
              >
                <span>{language === 'hi' ? p.titleHi : p.titleEn}</span>
                {isCurrent && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#EFEAE1] text-[#444C3D]'
                  }`}>
                    {language === 'hi' ? 'सक्रिय' : 'Active'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Role Deep-Dive Card */}
      <div className="rounded-3xl border border-[#E5DFD5] bg-white p-6 sm:p-10 shadow-sm relative overflow-hidden mb-12">
        {/* Decorative corner seal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF8F5] rounded-bl-full border-b border-l border-[#E5DFD5] -z-0 opacity-40 pointer-events-none" />

        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-[#E5DFD5]">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D] text-xs font-mono font-medium">
                <UserCheck className="w-3.5 h-3.5" />
                {language === 'hi' ? activePersona.levelHi : activePersona.levelEn}
              </div>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                {language === 'hi' ? activePersona.titleHi : activePersona.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-[#706E66] font-mono">
                {language === 'hi' ? activePersona.badgeHi : activePersona.badgeEn}
              </p>
            </div>

            {/* Test as this role CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTestRole(activePersona.id)}
                className="px-5 py-2.5 rounded-xl bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 transition shadow-sm cursor-pointer hover:scale-[1.02]"
              >
                <span>{language === 'hi' ? 'इस भूमिका में लॉगिन करें एवं जांचें' : 'Switch & Test As This Role'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 text-sm sm:text-base text-[#55544E] leading-relaxed max-w-4xl">
            {language === 'hi' ? activePersona.descHi : activePersona.descEn}
          </p>

          {/* Workflows Grid */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#1C1D1A] mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#444C3D]" />
              {language === 'hi' ? 'दैनिक चरणबद्ध कार्यप्रणाली (Step-by-Step SOP):' : 'Everyday Standard Operating Procedures (SOP):'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(language === 'hi' ? activePersona.workflowsHi : activePersona.workflowsEn).map((wf, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2 text-left">
                  <div className="text-xs font-mono font-bold text-[#444C3D]">{wf.step}</div>
                  <p className="text-xs text-[#55544E] leading-relaxed">{wf.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rules & Boundaries */}
          <div className="mt-8 p-5 rounded-2xl bg-[#F8F5EE] border border-[#DDD6C9]">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#706E66] mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#444C3D]" />
              {language === 'hi' ? 'वैधानिक नियम एवं अखंडता प्रोटोकॉल:' : 'Statutory Integrity Rules & Separation of Duties (SoD):'}
            </h4>
            <ul className="space-y-2 text-xs text-[#55544E]">
              {(language === 'hi' ? activePersona.rulesHi : activePersona.rulesEn).map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#444C3D] shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Matrix of all 7 Roles */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs">
        <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] mb-4">
          {language === 'hi' ? 'समस्त 7 भूमिकाओं की प्राधिकार तुलना तालिका' : 'Comparative Responsibility & Authority Matrix'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E5DFD5] text-[#706E66] font-mono uppercase">
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Primary Domain</th>
                <th className="py-3 px-3">Discrepancy Authority</th>
                <th className="py-3 px-3">Release Power</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]/60">
              {personas.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#1C1D1A]">
                    {language === 'hi' ? p.titleHi : p.titleEn}
                  </td>
                  <td className="py-3 px-3 text-[#55544E]">
                    {language === 'hi' ? p.badgeHi : p.badgeEn}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {p.id === 'DIRECTOR_RB' ? (
                      <span className="text-emerald-700 font-bold">✓ Authorized Waiver</span>
                    ) : (
                      <span className="text-[#706E66]">Flag Only</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {p.id === 'COMPETENT_AUTHORITY' ? (
                      <span className="text-emerald-700 font-bold">✓ Final Sanction</span>
                    ) : p.id === 'ACCOUNTS' ? (
                      <span className="text-blue-700 font-bold">NOC Issuance</span>
                    ) : (
                      <span className="text-[#706E66]">Endorsement Only</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleTestRole(p.id)}
                      className="px-3 py-1 rounded-lg border border-[#DDD6C9] hover:bg-[#EFEAE1] text-[#444C3D] font-mono text-[11px] cursor-pointer"
                    >
                      {language === 'hi' ? 'परीक्षण करें' : 'Switch'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
