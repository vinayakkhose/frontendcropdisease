'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Globe, Leaf, Bot, User, ChevronDown, Sparkles } from 'lucide-react'
import { chatbotAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

/* ── types ──────────────────────────────────────────────── */
interface Message {
    id: string
    role: 'user' | 'bot'
    text: string
    time: string
    typing?: boolean   // bot still streaming
}

/* ── static data ─────────────────────────────────────────── */
const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
]

const GREETINGS: Record<string, string> = {
    en: "Hello! I'm your CropGuard AI assistant 🌱 I can help you with crop diseases, watering, fertilizers, pests, harvest tips and soil health. What would you like to know?",
    hi: "नमस्ते! मैं आपका CropGuard AI सहायक हूँ 🌱 फसल रोग, सिंचाई, उर्वरक, कीट, कटाई और मिट्टी स्वास्थ्य में मदद कर सकता हूँ। आप क्या जानना चाहते हैं?",
    mr: "नमस्कार! मी तुमचा CropGuard AI सहायक आहे 🌱 पीक रोग, पाणी, खते, कीड, काढणी आणि माती आरोग्यावर मदत करतो. काय जाणून घ्यायचे?",
    pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ CropGuard AI ਸਹਾਇਕ ਹਾਂ 🌱 ਫਸਲ ਰੋਗ, ਸਿੰਚਾਈ, ਖਾਦ ਅਤੇ ਕੀੜੇ ਬਾਰੇ ਦੱਸ ਸਕਦਾ ਹਾਂ। ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    te: "నమస్కారం! నేను మీ CropGuard AI సహాయకుడిని 🌱 పంట వ్యాధులు, నీరు, ఎరువులు, తెగుళ్లు మరియు మట్టి ఆరోగ్యంపై సహాయపడగలను. ఏమి తెలుసుకోవాలి?",
    ta: "வணக்கம்! நான் உங்கள் CropGuard AI உதவியாளர் 🌱 பயிர் நோய்கள், நீர்ப்பாசனம், உரங்கள், பூச்சிகள் மற்றும் மண் ஆரோக்கியத்தில் உதவுவேன். என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?",
    kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ CropGuard AI ಸಹಾಯಕ 🌱 ಬೆಳೆ ರೋಗಗಳು, ನೀರಾವರಿ, ಗೊಬ್ಬರ, ಕೀಟಗಳು ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.",
    gu: "નમસ્તે! હું તમારો CropGuard AI સહાયક છું 🌱 પાક રોગ, સિંચાઈ, ખાતર, જીવાત અને જમીન સ્વાસ્થ્ય વિશે માર્ગદર્શન આપીશ. શું જાણવું છે?",
}

const SUGGESTIONS: Record<string, string[]> = {
    en: ['How to prevent crop diseases?', 'Best fertilizer for tomatoes?', 'How often to water crops?', 'Natural pest control tips?'],
    hi: ['फसल रोग कैसे रोकें?', 'टमाटर के लिए उर्वरक?', 'कितनी बार पानी दें?', 'प्राकृतिक कीट नियंत्रण?'],
    mr: ['पीक रोग कसे टाळावे?', 'टोमॅटोसाठी खत कोणते?', 'पाणी किती वेळा द्यावे?', 'नैसर्गिक कीड नियंत्रण?'],
    pa: ['ਫਸਲ ਰੋਗ ਕਿਵੇਂ ਰੋਕੀਏ?', 'ਟਮਾਟਰ ਲਈ ਖਾਦ?', 'ਕਿੰਨਾ ਪਾਣੀ ਦੇਈਏ?', 'ਕੁਦਰਤੀ ਕੀੜਾ ਨਿਯੰਤਰਣ?'],
    te: ['వ్యాధులు నివారించడం?', 'టొమాటోకు ఎరువు ఏది?', 'ఎంత తరచు నీరు?', 'సేంద్రీయ తెగులు నియంత్రణ?'],
    ta: ['நோய் தடுப்பு எப்படி?', 'தக்காளிக்கு உரம்?', 'எப்போது நீர்?', 'இயற்கை பூச்சி கட்டுப்பாடு?'],
    kn: ['ರೋಗ ತಡೆಯುವುದು ಹೇಗೆ?', 'ಟೊಮೆಟೊಗೆ ಗೊಬ್ಬರ?', 'ಎಷ್ಟು ಬಾರಿ ನೀರು?', 'ಸೇಂದ್ರಿಯ ಕೀಟ ನಿಯಂತ್ರಣ?'],
    gu: ['રોગ કેવી રીતે અટકાવવો?', 'ટામેટા માટે ખાતર?', 'કેટલી વખત પાણી?', 'કુદરતી જીવાત નિયંત્રણ?'],
}

const PLACEHOLDERS: Record<string, string> = {
    en: 'Ask about crops, diseases, tips…',
    hi: 'अपना सवाल लिखें…',
    mr: 'तुमचा प्रश्न लिहा…',
    pa: 'ਸਵਾਲ ਲਿਖੋ…',
    te: 'మీ ప్రశ్న రాయండి…',
    ta: 'உங்கள் கேள்வி எழுதுங்கள்…',
    kn: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ…',
    gu: 'તમારો પ્રશ્ન લખો…',
}

const ERROR_MSG: Record<string, string> = {
    en: "Sorry, couldn't connect. Please try again.",
    hi: "क्षमा करें, कनेक्ट नहीं हो सका। पुनः प्रयास करें।",
    mr: "माफ करा, जोडणी होऊ शकली नाही. पुन्हा प्रयत्न करा.",
    pa: "ਮਾਫ਼ ਕਰਨਾ, ਜੁੜ ਨਹੀਂ ਸਕਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    te: "క్షమించండి, కనెక్ట్ కాలేదు. మళ్ళీ ప్రయత్నించండి.",
    ta: "மன்னிக்கவும், இணைக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    kn: "ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕ ಆಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    gu: "માફ કરો, જોડાઈ શકાયું નહીં. ફરી પ્રયત્ન કરો.",
}

const UI_STRINGS: Record<string, { title: string, typing: string, online: string }> = {
    en: { title: 'CropGuard Assistant', typing: 'Typing…', online: 'AI • Always online' },
    hi: { title: 'क्रॉपगार्ड सहायक', typing: 'टाइप कर रहा है…', online: 'एआई • हमेशा ऑनलाइन' },
    mr: { title: 'क्रॉपगार्ड सहाय्यक', typing: 'टाइप करत आहे…', online: 'एआय • नेहमी ऑनलाइन' },
    pa: { title: 'ਕਰੌਪਗਾਰਡ ਸਹਾਇਕ', typing: 'ਟਾਈਪ ਕਰ ਰਿਹਾ ਹੈ…', online: 'ਏਆਈ • ਹਮੇਸ਼ਾ ਔਨਲਾਈਨ' },
    te: { title: 'క్రాప్‌గార్డ్ అసిస్టెంట్', typing: 'టైప్ చేస్తున్నారు…', online: 'AI • ఎల్లప్పుడూ ఆన్‌లైన్' },
    ta: { title: 'கிராப்கார்டு உதவியாளர்', typing: 'தட்டச்சு செய்கிறார்…', online: 'AI • எப்போதும் ஆன்லைனில்' },
    kn: { title: 'ಕ್ರಾಪ್‌ಗಾರ್ಡ್ ಸಹಾಯಕ', typing: 'ಟೈಪ್ ಮಾಡುತ್ತಿದ್ದಾರೆ…', online: 'AI • ಯಾವಾಗಲೂ ಆನ್‌ಲೈನ್' },
    gu: { title: 'ક્રોપગાર્ડ સહાયક', typing: 'ટાઇપ કરી રહ્યું છે…', online: 'AI • હંમેશા ઓનલાઇન' },
}

/* ── helpers ─────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2)
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const greeting = (lang: string): Message => ({
    id: uid(), role: 'bot', text: GREETINGS[lang] ?? GREETINGS.en, time: now(),
})

/* ── component ───────────────────────────────────────────── */
export default function FarmerChatbot() {
    const user = useAuthStore(state => state.user)
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)
    const [lang, setLang] = useState('en')
    const [langMenu, setLangMenu] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([greeting('en')])

    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    /* mount guard — prevents SSR/hydration mismatch */
    useEffect(() => { setMounted(true) }, [])

    /* auto-scroll to bottom on new messages */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    /* focus input when chat opens */
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 200)
    }, [open])

    /* ── language change: reset chat immediately with new greeting ── */
    const changeLang = useCallback((code: string) => {
        setLang(code)
        setLangMenu(false)
        // Instantly clear all messages and show greeting in new language
        setMessages([greeting(code)])
        setInput('')
        setLoading(false)
    }, [])

    /* ── real-time streaming typewriter for bot replies ── */
    const streamBotMessage = useCallback((fullText: string) => {
        const id = uid()
        const time = now()
        // Start with empty text and the typing flag
        setMessages(prev => [...prev, { id, role: 'bot', text: '', time, typing: true }])

        let i = 0
        const CHUNK = 3      // characters revealed per tick
        const DELAY = 18     // ms between ticks  (≈ 166 chars/sec)

        const tick = () => {
            i += CHUNK
            const chunk = fullText.slice(0, i)
            const done = i >= fullText.length

            setMessages(prev => prev.map(m =>
                m.id === id
                    ? { ...m, text: done ? fullText : chunk, typing: !done }
                    : m
            ))
            if (!done) setTimeout(tick, DELAY)
        }
        setTimeout(tick, DELAY)
    }, [])

    /* ── send message ─────────────────────────────────────── */
    const send = useCallback(async (text?: string) => {
        const msg = (text ?? input).trim()
        if (!msg || loading) return
        setInput('')

        const userMsg: Message = { id: uid(), role: 'user', text: msg, time: now() }
        setMessages(prev => [...prev, userMsg])
        setLoading(true)

        try {
            const res = await chatbotAPI.chat(msg, { language: lang })
            streamBotMessage(res.answer)
        } catch {
            streamBotMessage(ERROR_MSG[lang] ?? ERROR_MSG.en)
        } finally {
            setLoading(false)
        }
    }, [input, lang, loading, streamBotMessage])

    if (!mounted || !user) return null

    const selectedLang = LANGUAGES.find(l => l.code === lang)!

    return (
        <>
            {/* ── FAB ───────────────────────────────────────────── */}
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {!open && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setOpen(true)}
                            aria-label="Open farming assistant"
                            className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-shadow"
                        >
                            <Leaf className="w-7 h-7 text-white" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow">
                                <Sparkles className="w-3 h-3 text-white" />
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Chat window ───────────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                        className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                        style={{ height: '570px' }}
                    >
                        {/* header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-white text-sm leading-tight">{(UI_STRINGS[lang] ?? UI_STRINGS.en).title}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                                    <span className="text-green-100 text-xs">
                                        {loading ? (UI_STRINGS[lang] ?? UI_STRINGS.en).typing : (UI_STRINGS[lang] ?? UI_STRINGS.en).online}
                                    </span>
                                </div>
                            </div>

                            {/* language picker */}
                            <div className="relative">
                                <button
                                    onClick={() => setLangMenu(v => !v)}
                                    className="flex items-center gap-1 bg-white/20 hover:bg-white/30 transition rounded-xl px-2.5 py-1.5 text-white text-xs font-semibold"
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>{selectedLang.flag} {selectedLang.label}</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform ${langMenu ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {langMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="absolute right-0 top-full mt-1.5 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 w-44 overflow-hidden z-20"
                                        >
                                            {LANGUAGES.map(l => (
                                                <button
                                                    key={l.code}
                                                    onClick={() => changeLang(l.code)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors
                            ${lang === l.code
                                                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                >
                                                    <span>{l.flag}</span>
                                                    <span>{l.label}</span>
                                                    {lang === l.code && <span className="ml-auto text-green-500 text-xs">✓</span>}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 text-white transition">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* messages */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-4 py-4 space-y-3">
                            <AnimatePresence initial={false}>
                                {messages.map(msg => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                                    >
                                        {msg.role === 'bot' && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user'
                                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-sm'
                                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm'}`}
                                            >
                                                {msg.text}
                                                {msg.typing && (
                                                    <span className="inline-block ml-1 animate-pulse text-green-400 text-xs">▍</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* loading dots while waiting for server */}
                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                        <div className="flex gap-1 items-center">
                                            {[0, 150, 300].map(d => (
                                                <span key={d} className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* suggestion chips — change with language */}
                        <div className="bg-white dark:bg-gray-800 px-3 py-2 flex gap-2 overflow-x-auto border-t border-gray-100 dark:border-gray-700 flex-shrink-0 scrollbar-hide">
                            {(SUGGESTIONS[lang] ?? SUGGESTIONS.en).map(s => (
                                <button
                                    key={s}
                                    onClick={() => send(s)}
                                    disabled={loading}
                                    className="flex-shrink-0 text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-full px-3 py-1.5 hover:bg-green-100 dark:hover:bg-green-900/50 disabled:opacity-50 transition-colors whitespace-nowrap"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* input */}
                        <div className="bg-white dark:bg-gray-800 px-3 pb-3 pt-2 flex gap-2 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !loading && send()}
                                placeholder={PLACEHOLDERS[lang] ?? PLACEHOLDERS.en}
                                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition placeholder-gray-400"
                            />
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => send()}
                                disabled={loading || !input.trim()}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow hover:shadow-md disabled:opacity-40 transition-all"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
