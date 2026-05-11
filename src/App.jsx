import React, { useState, useEffect } from 'react'
import SimpleParticles from './SimpleParticles-2'
import logo from './assets/logo_2.svg'
import './App.css'

// FIREBASE IMPORTOK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";

const translations = {
  EN: {
    hero: ['Map the fragments', 'of a dream'],
    thinking: 'Think through your last dream carefully...',
    thinkingQuestion: '...where were you exactly?',
    cta: 'get started',
    surveyTitle: <>What was the <span className="hero-italic">last dream</span><br /> you remember?</>,
    surveySub: <>Select <strong>up to two</strong> dream groups</>,
    fragmentsTitle: <>Which <span className="hero-italic">elements </span> appeared<br />in your dream?</>,
    fragmentsSub: <>Select <span className="font-bold">up to three</span> fragments</>,
    emotionsTitle: <>What was the <span className="hero-italic">emotional</span> tone<br />of the dream?</>,
    clarityTitle: <>How <span className="hero-italic">clearly</span> do you<br />remember the dream?</>,
    identityTitle: <>How would you describe <br /> your <span className="hero-italic">gender</span> identity?</>,
    generate: 'generate',
    emotions: { anger: 'Anger', anxiety: 'Anxiety', sadness: 'Sadness', confusion: 'Confusion', happiness: 'Happiness' },
    identities: { male: 'male', female: 'female', nonBinary: 'non-binary', else: 'else', noAnswer: "Prefer not to say" },
    groups: { identityBody: 'Identity & Body Experience', movementSpace: 'Movement & Spatial Experience', anxietyStress: 'Anxiety & Stress', supernatural: 'Supernatural Experiences', threatDanger: 'Threat & Danger', naturalDisasters: 'Natural Disasters', positive: 'Positive Experiences' },
    fragments: { childAgain: 'Being a child again', teethFalling: 'Teeth falling out', oppositeSex: 'Being a member of opposite sex', animal: 'Being an animal', object: 'Being an object', movie: 'Being at a movie', mirror: 'Seeing yourself in a mirror', paralyzed: 'Half awake and paralyzed', deadSelf: 'Seeing yourself as dead', closeFace: 'Seeing a face very close', sexualExperiences: 'Sexual experiences', abortion: 'Someone having an abortion', nude: 'Being nude', flying: 'Flying or soaring through the air', swimming: 'Swimming', falling: 'Falling', vergeFalling: 'Being on the verge of falling', vehicleControl: 'Losing control of a vehicle', school: 'School, teachers, studying', late: 'Arriving too late', exam: 'Failing an examination', dressed: 'Being inappropriately dressed', againAgain: 'Trying something again and again', toilet: 'Being unable to find or embarrassed about using a toilet', presence: 'Vividly sensing a presence', demon: 'Encountering a kind of evil force or demon', magicalPowers: 'Magical powers, not flying', god: 'Encountering God', ufo: 'Seeing a UFO', aliens: 'Seeing extra-terrestrials', creatures: 'Creatures, part animal/human', crash: 'Seeing a flying object crash', angel: 'Seeing an angel', deadAlive: 'A person now dead being alive', aliveDead: 'A person now alive being dead', lunatics: 'Lunatics or insane people', anotherPlanet: 'Traveling to another planet', tied: 'Being tied, unable to breath', chased: 'Being chased or pursued', attacked: 'Being physically attacked', killing: 'Killing someone', killed: 'Being killed', smothered: 'Smothered, unable to breath', locked: 'Being locked up', frozen: 'Being frozen with fright', beasts: 'Wild, violent beasts', snakes: 'Snakes', insects: 'Insects or spiders', floods: 'Floods or tidal waves', tornadoes: 'Tornadoes and strong winds', fire: 'Fire', earthquakes: 'Earthquakes', food: 'Eating delicious food', money: 'Finding money', newRoom: 'Discovering a new room', mentalAbility: 'Superior mental ability' }
  },
  HU: {
    hero: ['Térképezd fel az', 'álmaidat'],
    thinking: 'Gondold végig alaposan a legutolsó álmodat...',
    thinkingQuestion: '...hol voltál pontosan?',
    cta: 'kezdjük',
    surveyTitle: <>Mi volt az <span className="hero-italic">legutolsó álom</span><br /> amire emlékszel?</>,
    surveySub: <>Válassz ki <strong>legfeljebb két</strong> álomcsoportot</>,
    fragmentsTitle: <>Milyen <span className="hero-italic">elemek</span> jelentek meg<br />az álmodban?</>,
    fragmentsSub: <>Válassz ki <span className="font-bold">legfeljebb három</span> álomrészletet</>,
    emotionsTitle: <>Milyen volt az álom <span className="hero-italic">érzelmi</span><br />hangulata?</>,
    clarityTitle: <>Mennyire <span className="hero-italic">tisztán</span><br />emlékszel az álomra?</>,
    identityTitle: <>Hogyan írnád le a <span className="hero-italic">nemi</span> <br />identitásodat?</>,
    generate: 'generálás',
    emotions: { anger: 'Düh', anxiety: 'Szorongás', sadness: 'Szomorúság', confusion: 'Zavarodottság', happiness: 'Boldogság' },
    identities: { male: 'férfi', female: 'nő', nonBinary: 'nem bináris', else: 'egyéb', noAnswer: 'nem szeretnék válaszolni' },
    groups: { identityBody: 'Identitás és testélmény', movementSpace: 'Mozgás és térélmény', anxietyStress: 'Szorongás és stressz', supernatural: 'Természetfeletti élmények', threatDanger: 'Fenyegetés és veszély', naturalDisasters: 'Természeti katasztrófák', positive: 'Pozitív élmények' },
    fragments: { childAgain: 'Újra gyereknek lenni', teethFalling: 'Kihulló fogak', oppositeSex: 'Az ellenkező nemhez tartozni', animal: 'Állatnak lenni', object: 'Tárgynak lenni', movie: 'Moziban lenni', mirror: 'Látni magad a tükörben', paralyzed: 'Félálomban mozdulatlannak lenni', deadSelf: 'Halottként látni magad', closeFace: 'Nagyon közelről látni egy arcot', sexualExperiences: 'Szexuális élmények', abortion: 'Valaki abortuszon esik át', nude: 'Meztelennek lenni', flying: 'Repülés vagy lebegés a levegőben', swimming: 'Úszás', falling: 'Zuhanás', vergeFalling: 'A zuhanás határán lenni', vehicleControl: 'Jármű irányításának elvesztése', school: 'Iskola, tanárok, tanulás', late: 'Túl későn érkezni', exam: 'Vizsgán megbukni', dressed: 'Nem megfelelően öltözködni', againAgain: 'Valamit újra és újra megpróbálni', toilet: 'Nem találni a mosdót vagy szégyellni annak használatát', presence: 'Erőteljes jelenlét érzékelése', demon: 'Gonosz erővel vagy démonnal találkozni', magicalPowers: 'Mágikus képességek, de nem repülés', god: 'Találkozni Istennel', ufo: 'UFO-t látni', aliens: 'Földönkívülieket látni', creatures: 'Félig állati/emberi lények', crash: 'Látni egy repülő objektum lezuhanását', angel: 'Angyalt látni', deadAlive: 'Egy elhunyt személyt élve látni', aliveDead: 'Egy élő személy halottnak látni', lunatics: 'Őrült vagy zavart emberek', anotherPlanet: 'Másik bolygóra utazni', tied: 'Megkötözve lenni, nem kapni levegőt', chased: 'Üldöznek vagy kergetnek', attacked: 'Fizikai támadás', killing: 'Megölni valakit', killed: 'Megölnek', smothered: 'Fulladás, lélegzethez jutás nélkül', locked: 'Bezárva lenni', frozen: 'Megdermedni a félelemtől', beasts: 'Vad, erőszakos állatok', snakes: 'Kígyók', insects: 'Rovarok vagy pókok', floods: 'Árvizek vagy szökőárak', tornadoes: 'Tornádók és erős szelek', fire: 'Tűz', earthquakes: 'Földrengések', food: 'Finom ételt enni', money: 'Pénzt találni', newRoom: 'Egy uj szobát felfedezni', mentalAbility: 'Kiválló szellemi képesség' }
  }
}

const dreamData = {
  identityBody: ['childAgain', 'teethFalling', 'oppositeSex', 'animal', 'object', 'movie', 'mirror', 'paralyzed', 'deadSelf', 'closeFace', 'sexualExperiences', 'abortion', 'nude'],
  movementSpace: ['flying', 'swimming', 'falling', 'vergeFalling', 'vehicleControl'],
  anxietyStress: ['school', 'late', 'exam', 'dressed', 'againAgain', 'toilet'],
  supernatural: ['presence', 'demon', 'magicalPowers', 'god', 'ufo', 'aliens', 'creatures', 'crash', 'angel', 'deadAlive', 'aliveDead', 'lunatics', 'anotherPlanet'],
  threatDanger: ['tied', 'chased', 'attacked', 'killing', 'killed', 'smothered', 'locked', 'frozen', 'beasts', 'snakes', 'insects'],
  naturalDisasters: ['floods', 'tornadoes', 'fire', 'earthquakes'],
  positive: ['food', 'money', 'newRoom', 'mentalAbility']
}

const firebaseConfig = {
  apiKey: "AIzaSyA8l3iVa1J0tSYAsFwfQvwqtsznNTlEyD8",
  authDomain: "oneira-cloud.firebaseapp.com",
  databaseURL: "https://oneira-cloud-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oneira-cloud",
  storageBucket: "oneira-cloud.firebasestorage.app",
  messagingSenderId: "587787473490",
  appId: "1:587787473490:web:bcdc3d913945c8b7dfc58b",
  measurementId: "G-9RZZSGCC1F"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// JAVÍTOTT: Mondatonkénti ThinkingPage lassú átúszással
function ThinkingPage({ text, question, onComplete }) {
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    // 10 másodperc után váltunk a második mondatra
    const timer = setTimeout(() => {
      setShowQuestion(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Összesen 20 másodperc után megyünk tovább a Survey-re
    const timer = setTimeout(onComplete, 20000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const textStyle = { 
    color: '#EEE6E3', 
    fontFamily: 'Sfizia, serif', 
    fontWeight: 200, 
    textAlign: 'center',
    fontSize: 'clamp(32px, 7vw, 80px)',
    lineHeight: 1.4,
    maxWidth: '1200px',
    animation: 'smoothPageEnter 3s ease' // Lassú megjelenés
  };

  return (
    <main className="hero">
      <div className="hero-inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {!showQuestion ? (
          <h1 key="first" style={textStyle}>{text}</h1>
        ) : (
          <h1 key="second" style={textStyle}>{question}</h1>
        )}
      </div>
    </main>
  );
}

function Typewriter({ lines = [], speed = 60, repeatDelay = 10000 }) {
  const [typed, setTyped] = useState(() => lines.map(() => ''));
  useEffect(() => {
    let isCancelled = false;
    const run = async () => {
      while (!isCancelled) {
        setTyped(lines.map(() => ''));
        await new Promise(r => setTimeout(r, 500));
        for (let i = 0; i < lines.length; i++) {
          for (let k = 0; k <= lines[i].length; k++) {
            if (isCancelled) return;
            setTyped(prev => { const next = [...prev]; next[i] = lines[i].slice(0, k); return next; });
            await new Promise(r => setTimeout(r, speed));
          }
        }
        await new Promise(r => setTimeout(r, repeatDelay));
      }
    };
    run();
    return () => { isCancelled = true; };
  }, [lines, speed, repeatDelay]);

  return (
    <h1 className="hero-title" style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'block', minHeight: '1.2em' }}>
        <span style={{ visibility: 'hidden' }}>{lines[0]}</span>
        <span style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>{typed[0]}</span>
      </div>
      <div style={{ position: 'relative', display: 'block', minHeight: '1.2em' }}>
        <span className="hero-italic" style={{ visibility: 'hidden' }}>{lines[1]}</span>
        <span className="hero-line hero-italic" style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>{typed[1]}</span>
      </div>
    </h1>
  );
}

function SurveyPage({ t, selected, setSelected, onNext }) {
  const groups = Object.keys(dreamData);
  const toggle = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else if (selected.length < 2) setSelected([...selected, id]);
  };
  return (
    <div className="survey-page">
      <main className="survey-main">
        <div className="title-block"><h2 className="survey-title">{t.surveyTitle}</h2><p className="survey-sub">{t.surveySub}</p></div>
        <div className="pill-grid">
          {groups.map(id => <button key={id} className={`pill ${selected.includes(id) ? 'active' : ''}`} onClick={() => toggle(id)}>{t.groups[id]}</button>)}
        </div>
      </main>
      <footer className="survey-footer">
        <div className={`next-arrow visible ${selected.length === 0 ? 'disabled' : ''}`} onClick={selected.length > 0 ? onNext : undefined}>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 12H20M20 12L14 6M20 12L14 18" /></svg>
        </div>
      </footer>
    </div>
  );
}

function FragmentPage({ t, selectedGroups, selected, setSelected, onNext, onBack }) {
  const fragments = selectedGroups.flatMap(id => dreamData[id] || []);
  const toggle = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
  };
  return (
    <div className="survey-page">
      <main className="survey-main">
        <div className="title-block"><h2 className="survey-title">{t.fragmentsTitle}</h2><p className="survey-sub">{t.fragmentsSub}</p></div>
        <div className="pill-grid">
          {fragments.map(id => <button key={id} className={`pill ${selected.includes(id) ? 'active' : ''}`} onClick={() => toggle(id)}>{t.fragments[id]}</button>)}
        </div>
      </main>
      <footer className="survey-footer">
        <div className="back-arrow visible" onClick={onBack}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 12H4M4 12L10 6M4 12L10 18" /></svg></div>
        <div className="next-arrow visible" onClick={onNext}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 12H20M20 12L14 6M20 12L14 18" /></svg></div>
      </footer>
    </div>
  );
}

// JAVÍTOTT: Visszahozott színek az EmotionPage csúszkáinál
function EmotionPage({ t, emotions, setEmotions, onNext, onBack }) {
  const hexToRgba = (hex, a = 1) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return `rgba(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, ${a})`;
  };
  const emotionList = [{ id: 'anger', color: '#7F0709' }, { id: 'anxiety', color: '#B1B4D5' }, { id: 'sadness', color: '#12122B' }, { id: 'confusion', color: '#5B4722' }, { id: 'happiness', color: '#E3A3A4' }];
  return (
    <div className="survey-page emotion-page">
      <main className="survey-main">
        <div className="title-block"><h2 className="survey-title stagger-1">{t.emotionsTitle}</h2></div>
        <div className="slider-container stagger-3">
          {emotionList.map((emo) => {
            const val = emotions[emo.id] || 0;
            return (
              <div key={emo.id} className="slider-row">
                <span className="slider-label">{t.emotions[emo.id]}</span>
                <input type="range" min="0" max="100" value={val} onChange={(e) => setEmotions({ ...emotions, [emo.id]: e.target.value })} className="custom-slider" style={{ background: `linear-gradient(to right, ${hexToRgba(emo.color, 0.12)} 0%, ${hexToRgba(emo.color, 0.95)} ${val}%, rgba(255,255,255,0.1) ${val}%, rgba(255,255,255,0.1) 100%)` }} />
              </div>
            );
          })}
        </div>
      </main>
      <footer className="survey-footer stagger-4">
        <div className="dots">{[...Array(6)].map((_, i) => <span key={i} className={`dot ${i === 2 ? 'active' : ''}`} />)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="back-arrow visible" onClick={onBack}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12H4M4 12L10 6M4 12L10 18" /></svg></div>
          <div className="next-arrow visible" onClick={onNext}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12H20M20 12L14 6M20 12L14 18" /></svg></div>
        </div>
      </footer>
    </div>
  );
}

// JAVÍTOTT: Clarity csúszka mérete és százalék kijelzése
function ClarityPage({ t, clarity, setClarity, onNext, onBack }) {
  return (
    <div className="survey-page clarity-page">
      <main className="survey-main">
        <div className="title-block">
          <h2 className="survey-title stagger-1">{t.clarityTitle}</h2>
        </div>
        
        <div className="slider-container stagger-3">
          {/* A slider-row adja meg a fix szélességet és a százalék helyét */}
          <div className="slider-row">
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <span className="slider-label">{clarity}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={clarity} 
              onChange={(e) => setClarity(e.target.value)} 
              className="custom-slider" 
              style={{ 
                width: '100%', 
                background: `linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${clarity}%, rgba(255,255,255,0.1) ${clarity}%, rgba(255,255,255,0.1) 100%)` 
              }} 
            />
          </div>
        </div>
      </main>

      <footer className="survey-footer stagger-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="back-arrow visible" onClick={onBack}>
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 12H4M4 12L10 6M4 12L10 18" />
            </svg>
          </div>
          <div className="next-arrow visible" onClick={onNext}>
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 12H20M20 12L14 6M20 12L14 18" />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IdentityPage({ t, selected, setSelected, onNext, onBack }) {
  const ids = ['male', 'female', 'nonBinary', 'else', 'noAnswer'];
  return (
    <div className="survey-page">
      <main className="survey-main">
        <div className="title-block"><h2 className="survey-title">{t.identityTitle}</h2></div>
        <div className="pill-grid vertical">
          {ids.map(id => <button key={id} className={`pill ${selected === id ? 'active' : ''}`} onClick={() => setSelected(id)}>{t.identities[id]}</button>)}
        </div>
      </main>
      <footer className="survey-footer">
        <div className="back-arrow visible" onClick={onBack}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 12H4M4 12L10 6M4 12L10 18" /></svg></div>
        <div className="next-arrow visible" onClick={onNext}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 12H20M20 12L14 6M20 12L14 18" /></svg></div>
      </footer>
    </div>
  );
}

function GeneratePage({ t, onGenerate }) {
  return (
    <div className="survey-page generate-page">
      <main className="survey-main generate-container">
        <button className="pill generate-btn" onClick={onGenerate}>{t.generate}</button>
      </main>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('hero');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedFragments, setSelectedFragments] = useState([]);
  const [lang, setLang] = useState('EN');
  const [emotions, setEmotions] = useState({ anger: 0, anxiety: 0, sadness: 0, confusion: 0, happiness: 0 });
  const [clarity, setClarity] = useState(50);
  const [identity, setIdentity] = useState('');
  const [pulse, setPulse] = useState(0);

  const t = translations[lang];

  const navigate = (to) => {
    setPulse(p => p + 1);
    window.setTimeout(() => setPage(to), 260);
  };

  const handleGenerate = () => {
    const data = {
      timestamp: new Date().getTime(),
      groups: selectedGroups,
      fragments: selectedFragments,
      emotions: emotions,
      clarity: clarity,
      identity: identity
    };
    set(ref(db, 'latestSurvey'), data);
    
const archiveRef = ref(db, 'archive');
    const newEntryRef = push(archiveRef); 
    set(newEntryRef, data);

    // Reset és visszatérés
    setSelectedGroups([]);
    setSelectedFragments([]);
    setEmotions({ anger: 0, anxiety: 0, sadness: 0, confusion: 0, happiness: 0 });
    setIdentity('');
    navigate('hero'); 
  };

  const renderPage = () => {
    switch (page) {
      case 'hero': return <main className="hero"><div className="hero-inner"><Typewriter lines={t.hero} /></div><div className="hero-cta"><button className="pill cta" onClick={() => navigate('thinking')}>{t.cta}</button></div></main>;
      case 'thinking': return <ThinkingPage text={t.thinking} question={t.thinkingQuestion} onComplete={() => navigate('survey')} />;
      case 'survey': return <SurveyPage t={t} selected={selectedGroups} setSelected={setSelectedGroups} onNext={() => navigate('fragments')} />;
      case 'fragments': return <FragmentPage t={t} selectedGroups={selectedGroups} selected={selectedFragments} setSelected={setSelectedFragments} onBack={() => navigate('survey')} onNext={() => navigate('emotions')} />;
      case 'emotions': return <EmotionPage t={t} emotions={emotions} setEmotions={setEmotions} onBack={() => navigate('fragments')} onNext={() => navigate('clarity')} />;
      case 'clarity': return <ClarityPage t={t} clarity={clarity} setClarity={setClarity} onBack={() => navigate('emotions')} onNext={() => navigate('identity')} />;
      case 'identity': return <IdentityPage t={t} selected={identity} setSelected={setIdentity} onBack={() => navigate('clarity')} onNext={() => navigate('generate')} />;
      case 'generate': return <GeneratePage t={t} onGenerate={handleGenerate} />;
      default: return null;
    }
  };

  return (
    <div className={`app-root ${['survey', 'fragments', 'emotions', 'clarity', 'identity'].includes(page) ? 'light-mode survey-active' : ''}`}>
      <div className="bg-canvas"><SimpleParticles pulse={pulse} color={0xeee6e3} /></div>
      <div className="grain" />
      <header className="site-header">
        <div className="logo" onClick={() => navigate('hero')} style={{ cursor: 'pointer' }}><img src={logo} alt="logo" className="logo-img" /></div>
        <div className="lang">
          <button className={`lang-item ${lang === 'HU' ? 'active' : ''}`} onClick={() => setLang('HU')}>HU</button>
          <button className={`lang-item ${lang === 'EN' ? 'active' : ''}`} onClick={() => setLang('EN')}>EN</button>
        </div>
      </header>
      <div className="page-container"><div key={page} className="page-transition">{renderPage()}</div></div>
    </div>
  );
}

export default App;