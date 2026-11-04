import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export const ChromaGrid = ({ 
  items, 
  className = '', 
  radius = 300, 
  columns = 3, 
  damping = 0.45, 
  fadeOut = 0.6, 
  ease = 'power3.out'
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo = [
    { image: '/a.png', title: 'Leadership Meet', subtitle: 'Strategic Networking', borderColor: '#3B82F6', gradient: 'linear-gradient(145deg, #3B82F6, #000)' },
    { image: '/b.png', title: 'Strategic Networking', subtitle: 'Global HR Standards', borderColor: '#10B981', gradient: 'linear-gradient(210deg, #10B981, #000)' },
    { image: '/main-background.jpg', title: 'Community Growth', subtitle: 'Nurturing Potential', borderColor: '#F59E0B', gradient: 'linear-gradient(165deg, #F59E0B, #000)' },
    { image: '/contact-background.jpg', title: 'Inclusive Society', subtitle: 'Diversity & Inclusion', borderColor: '#EF4444', gradient: 'linear-gradient(195deg, #EF4444, #000)' },
    { image: '/membership-background.jpg', title: 'HR Innovation', subtitle: 'Future of Work', borderColor: '#8B5CF6', gradient: 'linear-gradient(225deg, #8B5CF6, #000)' },
    { image: '/digital-hr.jpg', title: 'Digital HR', subtitle: 'Transformation', borderColor: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4, #000)' },
    { image: '/ethics-hr.jpg', title: 'Ethics in HR', subtitle: 'Professional Integrity', borderColor: '#f472b6', gradient: 'linear-gradient(155deg, #f472b6, #000)' }
  ];

  const data = items?.length ? items : demo;
  const rows = Math.ceil(data.length / columns);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, { 
      x, 
      y, 
      duration: damping, 
      ease, 
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      }, 
      overwrite: true 
    });
  };

  const handleMove = e => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
  };

  const handleCardClick = url => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      ref={rootRef} 
      className={`chroma-grid ${className}`} 
      style={{ 
        '--r': `${radius}px`, 
        '--cols': columns, 
        '--rows': rows 
      }} 
      onPointerMove={handleMove} 
      onPointerLeave={handleLeave}
    >
      <div ref={fadeRef} className="chroma-overlay" />
      {data.map((c, i) => {
        const cardRef = useRef(null);
        useEffect(() => {
          if (cardRef.current && rootRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const rootRect = rootRef.current.getBoundingClientRect();
            cardRef.current.style.setProperty('--card-x', `${rect.left - rootRect.left}px`);
            cardRef.current.style.setProperty('--card-y', `${rect.top - rootRect.top}px`);
          }
        }, []);

        return (
          <article 
            key={i} 
            ref={cardRef}
            className="chroma-card" 
            onMouseMove={handleCardMove} 
            onClick={() => handleCardClick(c.url)}
          >
            <div className="chroma-card-inner">
              <div 
                className="chroma-image-grayscale" 
                style={{ backgroundImage: `url(${c.image})` }} 
              />
              <div 
                className="chroma-image-color" 
                style={{ 
                  backgroundImage: `url(${c.image})`,
                }} 
              />
              
              <div className="chroma-card-content">
                <div className="chroma-card-border" style={{ borderLeftColor: c.borderColor }} />
                <div className="chroma-text">
                  <h3 className="chroma-title">{c.title}</h3>
                  <p className="chroma-subtitle">{c.subtitle}</p>
                </div>
              </div>
              
              <div className="chroma-card-glow" />
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ChromaGrid;
