import React, { useState, useRef, useMemo, useEffect } from 'react'
import SimpleParticles from './SimpleParticles-2'
import logo from './assets/logo_2.svg'
import './App.css'

const translations = {
  EN: {
    hero: ['Map the fragments', 'of a dream'],
    thinking: 'think through your last dream carefully',
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
    identities: { male: 'male', female: 'female', nonBinary: 'non-binary', else: 'else', noAnswer: "I don't want to answer" },
    groups: { identityBody: 'Identity & Body Experience', movementSpace: 'Movement & Spatial Experience', anxietyStress: 'Anxiety & Stress', supernatural: 'Supernatural Experiences', threatDanger: 'Threat & Danger', naturalDisasters: 'Natural Disasters', positive: 'Positive Experiences' },
    fragments: { childAgain: 'Being a child again', teethFalling: 'Teeth falling out', oppositeSex: 'Being a member of opposite sex', animal: 'Being an animal', object: 'Being an object', movie: 'Being at a movie', mirror: 'Seeing yourself in a mirror', paralyzed: 'Half awake and paralyzed', deadSelf: 'Seeing yourself as dead', closeFace: 'Seeing a face very close', sexualExperiences: 'Sexual experiences', abortion: 'Someone having an abortion', nude: 'Being nude', flying: 'Flying or soaring through the air', swimming: 'Swimming', falling: 'Falling', vergeFalling: 'Being on the verge of falling', vehicleControl: 'Losing control of a vehicle', school: 'School, teachers, studying', late: 'Arriving too late', exam: 'Failing an examination', dressed: 'Being inappropriately dressed', againAgain: 'Trying something again and again', toilet: 'Being unable to find or embarrassed about using a toilet', presence: 'Vividly sensing a presence', demon: 'Encountering a kind of evil force or demon', magicalPowers: 'Magical powers, not flying', god: 'Encountering God', ufo: 'Seeing a UFO', aliens: 'Seeing extra-terrestrials', creatures: 'Creatures, part animal/human', crash: 'Seeing a flying object crash', angel: 'Seeing an angel', deadAlive: 'A person now dead being alive', aliveDead: 'A person now alive being dead', lunatics: 'Lunatics or insane people', anotherPlanet: 'Traveling to another planet', tied: 'Being tied, unable to breath', chased: 'Being chased or pursued', attacked: 'Being physically attacked', killing: 'Killing someone', killed: 'Being killed', smothered: 'Smothered, unable to breath', locked: 'Being locked up', frozen: 'Being frozen with fright', beasts: 'Wild, violent beasts', snakes: 'Snakes', insects: 'Insects or spiders', floods: 'Floods or tidal waves', tornadoes: 'Tornadoes and strong winds', fire: 'Fire', earthquakes: 'Earthquakes', food: 'Eating delicious food', money: 'Finding money', newRoom: 'Discovering a new room', mentalAbility: 'Superior mental ability' }
  },
  HU: {
    hero: ['Térképezd fel az', 'álmaidat'],
    thinking: 'gondold végig alaposan a legutolsó álmodat',
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
    fragments: { childAgain: 'Újra gyereknek lenni', teethFalling: 'Kihulló fogak', oppositeSex: 'Az ellenkező nemhez tartozni', animal: 'Állatnak lenni', object: 'Tárgynak lenni', movie: 'Moziban lenni', mirror: 'Látni magad a tükörben', paralyzed: 'Félálomban mozdulatlannak lenni', deadSelf: 'Halottként látni magad', closeFace: 'Nagyon közelről látni egy arcot', sexualExperiences: 'Szexuális élmények', abortion: 'Valaki abortuszon esik át', nude: 'Meztelennek lenni', flying: 'Repülés vagy lebegés a levegőben', swimming: 'Úszás', falling: 'Zuhanás', vergeFalling: 'A zuhanás határán lenni', vehicleControl: 'Jármű irányításának elvesztése', school: 'Iskola, tanárok, tanulás', late: 'Túl későn érkezni', exam: 'Vizsgán megbukni', dressed: 'Nem megfelelően öltözködni', againAgain: 'Valamit újra és újra megpróbálni', toilet: 'Nem találni mosdót vagy szégyellni a használatát', presence: 'Erőteljes jelenlét érzékelése', demon: 'Gonosz erővel vagy démonnal találkozni', magicalPowers: 'Mágikus képességek, de nem repülés', god: 'Találkozni Istennel', ufo: 'UFO-t látni', aliens: 'Földönkívülieket látni', creatures: 'Félig állati/emberi lények', crash: 'Látni egy repülő tárgy lezuhanását', angel: 'Angyalt látni', deadAlive: 'Egy elhunyt személyt élve látni', aliveDead: 'Egy élő személy halottnak látni', lunatics: 'Őrült vagy zavart emberek', anotherPlanet: 'Másik bolygóra utazni', tied: 'Megkötözve lenni, nem kapni levegőt', chased: 'Üldöznek vagy kergetnek', attacked: 'Fizikai támadás', killing: 'Megölni valakit', killed: 'Megölnek', smothered: 'Fulladás, lélegzethez jutás nélkül', locked: 'Bezárva lenni', frozen: 'Megdermedni a félelemtől', beasts: 'Vad, erőszakos állatok', snakes: 'Kígyók', insects: 'Rovarok vagy pókok', floods: 'Árvizek vagy szökőárak', tornadoes: 'Tornádók és erős szelek', fire: 'Tűz', earthquakes: 'Földrengések', food: 'Finom ételt enni', money: 'Pénzt találni', newRoom: 'Egy uj szobát felfedezni', mentalAbility: 'Kiválló szellemi képesség' }
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

function ThinkingPage({ text, question, onComplete }) {
  // A laggolás elkerülése érdekében useMemo-val bontjuk szavakra
  const words = useMemo(() => text.split(' '), [text]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    // 1. FÁZIS: Szavak megjelenítése egyenként
    // Fontos: a feltétel currentIndex < words.length, így az utolsó szó is látszik
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1200); // Lassú, meditatív tempó
      return () => clearTimeout(timer);
    } else {
      // 2. FÁZIS: Ha a szavak elfogytak, várunk egy kicsit és váltunk a kérdésre
      const timer = setTimeout(() => {
        setShowQuestion(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, words.length]);

  useEffect(() => {
    // 20 másodperc után mindenképpen továbbvisz a Survey-re
    const timer = setTimeout(onComplete, 20000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Speciális dőlt betűs stílus az álom kulcsszavakra
  const getWordClass = (word) => {
    const w = word ? word.toLowerCase() : "";
    return (w.includes('dream') || w.includes('álmodat')) ? "hero-italic" : "";
  };

  const textStyle = { 
    color: '#EEE6E3', 
    fontFamily: 'Sfizia, serif', 
    fontWeight: 200, 
    textAlign: 'center' 
  };

  return (
    <main className="hero">
      <div className="hero-inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {!showQuestion ? (
          /* SZÓ-FÁZIS: Csak az aktuális szót mutatjuk nagyban */
          <h1 
            key={`word-${currentIndex}`} // Új key minden szónál az animáció újraindításához
            className={`stagger-1 ${getWordClass(words[currentIndex])}`}
            style={{ 
              ...textStyle,
              fontSize: 'clamp(40px, 10vw, 120px)', 
              animation: 'smoothPageEnter 1s ease'
            }}
          >
            {words[currentIndex]}
          </h1>
        ) : (
          /* KÉRDÉS-FÁZIS: A végén megjelenő mondat */
          <h1 
            className="hero-title stagger-1"
            style={{ 
              ...textStyle,
              fontSize: 'clamp(32px, 7vw, 80px)', 
              lineHeight: 1.4,
              maxWidth: '1200px',
              animation: 'smoothPageEnter 2s ease' // Lassabb, lágyabb megjelenés
            }}
          >
            {question}
          </h1>
        )}
      </div>
    </main>
  );
}

// FIXÁLT: Ismétlődő Typewriter fix pozícióval
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
            setTyped(prev => {
              const next = [...prev];
              next[i] = lines[i].slice(0, k);
              return next;
            });
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

// Eredeti komponensek (SurveyPage, FragmentPage, stb.) maradnak változatlanul...
function SurveyPage({ t, selected = [], setSelected = () => {}, onNext }) {
  const groups = Object.keys(dreamData);
  const isEnabled = selected.length > 0;
  const toggle = (groupId) => {
    if (selected.includes(groupId)) { setSelected(selected.filter((s) => s !== groupId)); } 
    else if (selected.length < 2) { setSelected([...selected, groupId]); }
  };
  return (
    <div className="survey-page">
      <main className="survey-main">
        <div className="title-block">
          <h2 className="survey-title stagger-1">{t.surveyTitle}</h2>
          <p className="survey-sub stagger-2">{t.surveySub}</p>
        </div>
        <div className="pill-grid stagger-3">
          {groups.map((groupId) => (
            <button key={groupId} type="button" className={`pill ${selected.includes(groupId) ? 'active' : ''}`} onClick={() => toggle(groupId)}>
              {t.groups[groupId]}
            </button>
          ))}
        </div>
      </main>
      <footer className="survey-footer stagger-4">
        <div className="dots">{[...Array(6)].map((_, i) => (<span key={i} className={`dot ${i === 0 ? 'active' : ''}`} />))}</div>
        <div className={`next-arrow visible ${!isEnabled ? 'disabled' : ''}`} onClick={isEnabled ? onNext : undefined}>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12H20M20 12L14 6M20 12L14 18" /></svg>
        </div>
      </footer>
    </div>
  );
}

function FragmentPage({ t, selectedGroups, selectedFragments, setSelectedFragments, onNext, onBack }) {
  const availableFragments = useMemo(() => selectedGroups.flatMap((groupId) => dreamData[groupId] || []), [selectedGroups]);
  const toggleFragment = (fragmentId) => {
    if (selectedFragments.includes(fragmentId)) { setSelectedFragments(selectedFragments.filter((item) => item !== fragmentId)); } 
    else if (selectedFragments.length < 3) { setSelectedFragments([...selectedFragments, fragmentId]); }
  };
  return (
    <div className="survey-page fragment-page">
      <main className="survey-main">
        <div className="title-block">
          <h2 className="survey-title stagger-1">{t.fragmentsTitle}</h2>
          <p className="survey-sub stagger-2">{t.fragmentsSub}</p>
        </div>
        <div className="pill-grid stagger-3">
          {availableFragments.map((fragmentId) => (
            <button key={fragmentId} className={`pill ${selectedFragments.includes(fragmentId) ? 'active' : ''}`} onClick={() => toggleFragment(fragmentId)}>
              {t.fragments[fragmentId]}
            </button>
          ))}
        </div>
      </main>
      <footer className="survey-footer stagger-4">
        <div className="dots">{[...Array(6)].map((_, i) => <span key={i} className={`dot ${i === 1 ? 'active' : ''}`} />)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="back-arrow visible" onClick={onBack}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12H4M4 12L10 6M4 12L10 18" /></svg></div>
          <div className="next-arrow visible" onClick={onNext}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12H20M20 12L14 6M20 12L14 18" /></svg></div>
        </div>
      </footer>
    </div>
  );
}

function EmotionPage({ t, emotions, setEmotions, onNext, onBack }) {
  const hexToRgba = (hex, a = 1) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return `rgba(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, ${a})`;
  };
  const emotionList = [{ id: 'anger', color: '#7F0709' }, { id: 'anxiety', color: '#B1B4D5' }, { id: 'sadness', color: '#12122B' }, { id: 'confusion', color: '#5B4722' }, { id: 'happiness', color: '#E3A3A4' }];
  return (
    <div className="survey-page emotion-page">
      <main className="survey-main">
        <div className="title-block">
          <h2 className="survey-title stagger-1">{t.emotionsTitle}</h2>
          <p className="survey-sub stagger-2" aria-hidden="true">&nbsp;</p>
        </div>
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

function ClarityPage({ t, clarity, setClarity, onNext, onBack }) {
  return (
    <div className="survey-page clarity-page">
      <main className="survey-main">
        <div className="title-block"><h2 className="survey-title stagger-1">{t.clarityTitle}</h2></div>
        <div className="slider-container stagger-3">
          <input type="range" min="0" max="100" value={clarity} onChange={(e) => setClarity(e.target.value)} className="custom-slider" style={{ width: '100%', background: `linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${clarity}%, rgba(255,255,255,0.1) ${clarity}%, rgba(255,255,255,0.1) 100%)` }} />
        </div>
      </main>
      <footer className="survey-footer stagger-4">
        <div className="dots">{[...Array(6)].map((_, i) => <span key={i} className={`dot ${i === 3 ? 'active' : ''}`} />)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="back-arrow visible" onClick={onBack}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12H4M4 12L10 6M4 12L10 18" /></svg></div>
          <div className="next-arrow visible" onClick={onNext}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12H20M20 12L14 6M20 12L14 18" /></svg></div>
        </div>
      </footer>
    </div>
  );
}

function IdentityPage({ t, selectedIdentity, setSelectedIdentity, onNext, onBack }) {
  const identities = ['male', 'female', 'nonBinary', 'else', 'noAnswer'];
  return (
    <div className="survey-page identity-page">
      <main className="survey-main">
        <div className="title-block"><h2 className="survey-title stagger-1">{t.identityTitle}</h2></div>
        <div className="pill-grid vertical stagger-3">
          {identities.map((id) => (
            <button key={id} className={`pill ${selectedIdentity === id ? 'active' : ''}`} onClick={() => setSelectedIdentity(id)}>{t.identities[id]}</button>
          ))}
        </div>
      </main>
      <footer className="survey-footer stagger-4">
        <div className="dots">{[...Array(6)].map((_, i) => <span key={i} className={`dot ${i === 4 ? 'active' : ''}`} />)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="back-arrow visible" onClick={onBack}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12H4M4 12L10 6M4 12L10 18" /></svg></div>
          <div className="next-arrow visible" onClick={onNext}><svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12H20M20 12L14 6M20 12L14 18" /></svg></div>
        </div>
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

function ResultPage() {
  const videoRef = useRef(null);
  return (
    <div className="survey-page result-page">
      <main className="survey-main">
        <video ref={videoRef} src="/prototype_box.mov" controls autoPlay style={{ width: '360px', borderRadius: 8, background: '#000' }} />
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
  const [particlePulse, setParticlePulse] = useState(0);

  const t = translations[lang];

  const navigate = (to) => {
    if (to === page) return;
    setParticlePulse((p) => p + 1);
    window.setTimeout(() => setPage(to), 260);
  }

  const lightModeActive = ['survey', 'fragments', 'emotions', 'clarity', 'identity'].includes(page);
  const particleColor = 0xeee6e3;

  const renderPage = () => {
    switch (page) {
      case 'hero':
        return (
          <main className="hero">
            <div className="hero-inner">
              <Typewriter lines={t.hero} />
            </div>
            <div className="hero-cta stagger-3">
              <button className="pill cta" onClick={() => navigate('thinking')}>
                {t.cta}
              </button>
            </div>
          </main>
        );
      case 'thinking':
  return (
    <ThinkingPage 
      text={t.thinking} 
      question={t.thinkingQuestion} // EZ A SOR KELL, hogy megjelenjen a kérdés!
      onComplete={() => navigate('survey')} 
    />
  );
      case 'survey':
        return <SurveyPage t={t} selected={selectedGroups} setSelected={setSelectedGroups} onNext={() => navigate('fragments')} />;
      case 'fragments':
        return <FragmentPage t={t} selectedGroups={selectedGroups} selectedFragments={selectedFragments} setSelectedFragments={setSelectedFragments} onBack={() => navigate('survey')} onNext={() => navigate('emotions')} />;
      case 'emotions':
        return <EmotionPage t={t} emotions={emotions} setEmotions={setEmotions} onBack={() => navigate('fragments')} onNext={() => navigate('clarity')} />;
      case 'clarity':
        return <ClarityPage t={t} clarity={clarity} setClarity={setClarity} onBack={() => navigate('emotions')} onNext={() => navigate('identity')} />;
      case 'identity':
        return <IdentityPage t={t} selectedIdentity={identity} setSelectedIdentity={setIdentity} onBack={() => navigate('clarity')} onNext={() => navigate('generate')} />;
      case 'generate':
        return <GeneratePage t={t} onGenerate={() => navigate('result')} />;
      case 'result':
        return <ResultPage />;
      default:
        return null;
    }
  }

  return (
    <div className={`app-root ${lightModeActive ? 'light-mode survey-active' : ''}`}>
      <div className="bg-canvas">
        <SimpleParticles pulse={particlePulse} color={particleColor} />
      </div>
      <div className="grain" />
      <header className="site-header">
        <div className="logo" onClick={() => setPage('hero')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="oneira logo" className="logo-img" />
        </div>
        <div className="lang">
          <button className={`lang-item ${lang === 'HU' ? 'active' : ''}`} onClick={() => setLang('HU')}>HU</button>
          <button className={`lang-item ${lang === 'EN' ? 'active' : ''}`} onClick={() => setLang('EN')}>EN</button>
        </div>
      </header>
      <div className="page-container">
        <div key={page} className="page-transition">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default App;