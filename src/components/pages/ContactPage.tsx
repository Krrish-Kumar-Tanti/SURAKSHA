import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  ArrowRight,
  ExternalLink,
  Bot,
  User,
  Check
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { useLanguage } from '../../lib/i18n';

interface ContactPageProps {
  onNavigate: (screen: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const { language, t } = useLanguage();

  // Contact Form state
  const [formData, setFormData] = useState({
    institutionName: 'Symbiosis Institute of Technology (SIT), Pune',
    contactPerson: 'Dr. Rahul Deshmukh (Registrar)',
    email: 'registrar@sit.example.test',
    category: 'discrepancy',
    message: '',
  });
  const [ticketGenerated, setTicketGenerated] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // WhatsApp Interactive Chat simulation state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: language === 'hi' 
        ? 'नमस्ते! AICTE सुरक्षा सावधि जमा (FDR) सहायता डेस्क में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ?'
        : 'Namaste! Welcome to AICTE SURAKSHA Deposit Helpdesk. How can we assist your institution today?',
      time: 'Just now',
    },
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);

  const quickPrompts = [
    {
      en: 'How to fix OCR discrepancy?',
      hi: 'OCR विसंगति का समाधान कैसे करें?',
      replyEn: 'If OCR extracted details diverge from declared figures, verify the scanned certificate with the interactive Loupe tool. Legitimate bank branch mergers can be resolved with a formal waiver from your Regional Director.',
      replyHi: 'यदि OCR विवरण घोषित आंकड़ों से भिन्न हैं, तो आवर्धक लेंस (Loupe) से जांचें। बैंक शाखा विलय जैसे मामलों में क्षेत्रीय निदेशक द्वारा आधिकारिक समाधान आदेश दिया जा सकता है।',
    },
    {
      en: 'Status of FDR Release Request?',
      hi: 'FDR विमुक्ति आवेदन की स्थिति क्या है?',
      replyEn: 'Release requests follow the APH Clause 6.46 DAG: PGRC clearance → CVO vigilance check → CAG audit review → Regional Director recommendation → Competent Authority sanction.',
      replyHi: 'विमुक्ति आवेदन धारा 6.46 DAG का पालन करते हैं: छात्र शिकायत (PGRC) → सतर्कता (CVO) → ऑडिट → क्षेत्रीय निदेशक संस्तुति → सक्षम प्राधिकारी अंतिम आदेश।',
    },
    {
      en: 'Am I eligible for 50% concession?',
      hi: 'क्या 50% रियायत की पात्रता है?',
      replyEn: 'Technical institutions situated in North Eastern Region (NER), J&K, Ladakh, 112 Aspirational Districts, Andaman & Nicobar, Lakshadweep, or exclusively Women-only / PwD-only institutes receive automatic 50% statutory relief under Table 1.4.',
      replyHi: 'पूर्वोत्तर (NER), जम्मू-कश्मीर, लद्दाख, 112 आकांक्षी जिले, अंडमान-निकोबार, लक्षद्वीप अथवा विशेष रूप से महिला/दिव्यांग संस्थान तालिका 1.4 के तहत 50% वैधानिक रियायत के पात्र हैं।',
    },
  ];

  const handleSendChatMessage = (textToSend?: string) => {
    const text = textToSend || userChatInput;
    if (!text.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text, time: timeNow }]);
    if (!textToSend) setUserChatInput('');
    setBotTyping(true);

    setTimeout(() => {
      // Find matching prompt or default response
      const matched = quickPrompts.find((p) => p.en.toLowerCase().includes(text.toLowerCase()) || p.hi.includes(text));
      const botResponse = matched 
        ? (language === 'hi' ? matched.replyHi : matched.replyEn)
        : (language === 'hi'
            ? 'आपके संदेश हेतु धन्यवाद। आपकी क्वेरी क्षेत्रीय व्यवहार अधिकारी को प्रेषित कर दी गई है। संदर्भ सं.: WRO-2026-FDR-' + Math.floor(1000 + Math.random() * 9000)
            : 'Thank you for contacting the AICTE Desk. Your inquiry has been routed to your Regional Dealing Officer. Reference ID: WRO-2026-FDR-' + Math.floor(1000 + Math.random() * 9000));

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setBotTyping(false);
    }, 900);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setTimeout(() => {
      const ticketId = `AICTE-FDR-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketGenerated(ticketId);
      setFormSubmitting(false);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-12 px-4 sm:px-8 max-w-[1400px] mx-auto text-left font-sans">
      {/* Top Banner */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3 shadow-xs">
          <Phone className="w-3.5 h-3.5 text-[#444C3D]" />
          {language === 'hi' ? 'आधिकारिक AICTE सहायता एवं संपर्क डेस्क' : 'Official AICTE Helpdesk & Nodal Contact'}
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          {`( *${language === 'hi' ? 'सुरक्षा संपर्क एवं सहायता केंद्र' : 'SURAKSHA Help & Nodal Desk'}* )`}
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-3 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'संस्थागत सावधि जमा रसीद, विसंगति समाधान, परिपक्वता नवीनीकरण एवं धारा 6.46 विमुक्ति संबंधी प्रश्नों हेतु AICTE क्षेत्रीय अधिकारियों एवं नोडल डेस्क से संपर्क करें।'
            : 'Direct institutional access to AICTE Regional Dealing Officers, Regulation Bureau desks, and automated WhatsApp advisory for deposit intake, discrepancy waivers, and statutory release clearances.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
        
        {/* Left Column: Official Directory & Institutional Desks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Headquarters Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#706E66] font-bold">
                  {language === 'hi' ? 'केंद्रीय मुख्यालय' : 'Central Regulatory Desk'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                All India Council for Technical Education (AICTE)
              </h2>
              <div className="space-y-3 text-xs text-[#55544E]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#444C3D] shrink-0 mt-0.5" />
                  <span>Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#444C3D] shrink-0" />
                  <span className="font-mono">fdr-suraksha@aicte-india.org</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#444C3D] shrink-0" />
                  <span className="font-mono">1800-11-26265 (Toll Free)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#444C3D] shrink-0" />
                  <span>Monday – Friday: 09:30 AM – 06:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Bureau Nodal Desks */}
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-3 text-left">
            <h3 className="text-sm font-semibold text-[#1C1D1A] flex items-center gap-2 font-mono">
              <Building2 className="w-4 h-4 text-[#444C3D]" />
              {language === 'hi' ? 'क्षेत्रीय नोडल डेस्क (Regional Nodal Desks):' : 'Regional Nodal Desks (AICTE Bureaus):'}
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#E5DFD5]">
                <div className="font-semibold text-[#1C1D1A]">Western Regional Office (WRO Mumbai)</div>
                <div className="text-[11px] text-[#706E66]">Maharashtra, Goa · wro-fdr@aicte-india.org</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E5DFD5]">
                <div className="font-semibold text-[#1C1D1A]">Northern Regional Office (NRO Kanpur / Chandigarh)</div>
                <div className="text-[11px] text-[#706E66]">UP, Uttarakhand, Punjab, Haryana · nro-fdr@aicte-india.org</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E5DFD5]">
                <div className="font-semibold text-[#1C1D1A]">Southern Regional Office (SRO Chennai / Bangalore)</div>
                <div className="text-[11px] text-[#706E66]">Tamil Nadu, Karnataka, Kerala · sro-fdr@aicte-india.org</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive WhatsApp Support Desk + Inquiry Form */}
        <div className="lg:col-span-7 space-y-6">

          {/* Interactive WhatsApp Helpdesk Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F0FDF4] border border-[#BBF7D0] shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#1C1D1A]">AICTE SURAKSHA WhatsApp Desk</span>
                    <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  </div>
                  <span className="text-[11px] text-emerald-800 font-mono">
                    {language === 'hi' ? 'सत्यापित आधिकारिक सहायक · 24/7 सक्रिय' : 'Verified Official Assistant · 24/7 Active'}
                  </span>
                </div>
              </div>

              <a
                href="https://api.whatsapp.com/send?phone=919876543210&text=Hello%20AICTE%20SURAKSHA%20Desk,%20I%20have%20an%20inquiry%20regarding%20FDR%20deposit."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-medium inline-flex items-center gap-1.5 transition shadow-2xs"
              >
                <span>{language === 'hi' ? 'WhatsApp ऐप में खोलें' : 'Open in WhatsApp'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick Query Pills */}
            <div className="pt-4 pb-2">
              <div className="text-[11px] font-mono text-emerald-900 mb-2 font-medium">
                {language === 'hi' ? 'त्वरित प्रश्न चुनें:' : 'Frequently asked inquiries (Click to test):'}
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChatMessage(language === 'hi' ? q.hi : q.en)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 text-[11px] text-emerald-950 transition cursor-pointer shadow-2xs text-left"
                  >
                    💬 {language === 'hi' ? q.hi : q.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Chat Window */}
            <div className="mt-3 p-4 rounded-2xl bg-[#E7F6EC] border border-emerald-200/80 max-h-64 overflow-y-auto space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#25D366] text-white rounded-tr-none'
                        : 'bg-white text-[#1C1D1A] border border-emerald-200 rounded-tl-none shadow-2xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`block text-[9px] mt-1 ${msg.sender === 'user' ? 'text-white/80' : 'text-[#706E66]'}`}>
                      {msg.time}
                    </span>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-[#444C3D] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {botTyping && (
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-mono">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                  <span>AICTE Assistant is typing…</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder={language === 'hi' ? 'यहाँ संदेश लिखें और एंटर दबाएं…' : 'Type inquiry to WhatsApp Assistant and hit Enter…'}
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs text-[#1C1D1A] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleSendChatMessage()}
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Official Inquiry Submission Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm text-left">
            <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] mb-1">
              {language === 'hi' ? 'औपचारिक नोडल समीक्षा अनुरोध' : 'File Formal Nodal Ingestion Ticket'}
            </h3>
            <p className="text-xs text-[#706E66] mb-6">
              {language === 'hi' 
                ? 'अपने संस्थान की FDR रसीद अथवा विमुक्ति संबंधी आधिकारिक ई-टिकट दर्ज करें।' 
                : 'Submit an authenticated query to the Regional Bureau. Generates an official tracking ticket.'}
            </p>

            {ticketGenerated ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'hi' ? 'टिकट सफलतापूर्वक सृजित!' : 'Inquiry Ticket Successfully Dispatched!'}</span>
                </div>
                <div className="text-xs">
                  <span>{language === 'hi' ? 'ट्रैकिंग पहचान संख्या:' : 'Official Tracking Token:'} </span>
                  <strong className="font-mono bg-white px-2 py-0.5 rounded-md border border-emerald-300">{ticketGenerated}</strong>
                </div>
                <p className="text-[11px] text-emerald-800 pt-1">
                  {language === 'hi'
                    ? 'AICTE पश्चिमी क्षेत्रीय कार्यालय (WRO) को आपकी प्रविष्टि प्रेषित कर दी गई है। एक पुष्टिकरण ईमेल भी भेज दिया गया है।'
                    : 'Your formal inquiry has been routed to the AICTE Dealing Officer desk. A confirmation has been mirrored to your registered registrar email.'}
                </p>
                <button
                  type="button"
                  onClick={() => setTicketGenerated(null)}
                  className="mt-2 text-xs text-emerald-900 underline font-medium cursor-pointer"
                >
                  {language === 'hi' ? 'अन्य पूछताछ दर्ज करें' : 'Submit another query'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#706E66] mb-1">
                      {language === 'hi' ? 'संस्थान का नाम' : 'Institution Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.institutionName}
                      onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C9] bg-[#FAF8F5] text-xs font-sans text-[#1C1D1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#706E66] mb-1">
                      {language === 'hi' ? 'कुलसचिव / प्रतिनिधि का नाम' : 'Registrar / Authorized Officer'}
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C9] bg-[#FAF8F5] text-xs font-sans text-[#1C1D1A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#706E66] mb-1">
                      {language === 'hi' ? 'आधिकारिक ईमेल' : 'Official Registered Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C9] bg-[#FAF8F5] text-xs font-sans text-[#1C1D1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#706E66] mb-1">
                      {language === 'hi' ? 'पूछताछ का विषय' : 'Query Domain / Category'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C9] bg-[#FAF8F5] text-xs font-sans text-[#1C1D1A]"
                    >
                      <option value="discrepancy">{language === 'hi' ? 'त्रिपक्षीय OCR विसंगति समाधान' : '3-Way Provenance Discrepancy Resolution'}</option>
                      <option value="release">{language === 'hi' ? 'धारा 6.46 विमुक्ति DAG अनापत्ति' : 'APH Clause 6.46 Release DAG Clearance'}</option>
                      <option value="concession">{language === 'hi' ? 'तालिका 1.4 50% वैधानिक रियायत' : 'Table 1.4 Statutory 50% Concession Audit'}</option>
                      <option value="bank">{language === 'hi' ? 'बैंक लियन एवं शाखा सत्यापन' : 'Bank Lien Confirmation & Branch Verification'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#706E66] mb-1">
                    {language === 'hi' ? 'विस्तृत संदेश / FDR विवरण' : 'Detailed Message / FDR Reference'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === 'hi' ? 'अपनी सावधि जमा रसीद संख्या, बैंक और प्रश्न का विवरण दें…' : 'Provide FDR certificate number, issuing bank, and specific assistance needed…'}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD6C9] bg-[#FAF8F5] text-xs font-sans text-[#1C1D1A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{formSubmitting ? (language === 'hi' ? 'प्रेषित हो रहा है…' : 'Generating Ticket…') : (language === 'hi' ? 'औपचारिक टिकट प्रेषित करें' : 'Dispatch Formal Ticket')}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
