import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../router/Router';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  PhoneCall, 
  Calculator 
} from 'lucide-react';

export const HeroBannerSlider = ({ onOpenConsultation }) => {
  const { navigate } = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = 3;
  const timerRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: '/assets/banners/banner1.jpg',
      badge: 'CENTRAL & STATE GOVT SCHEMES',
      title: 'Grow Your Business with Government Schemes',
      subtitle: 'Central and State Government Scheme Advisory for Subsidized Loans & Capital Grants.',
      primaryBtnText: 'Explore Government Schemes',
      primaryBtnAction: () => navigate('/schemes'),
      secondaryBtnText: 'Check Eligibility',
      secondaryBtnAction: () => navigate('/eligibility'),
    },
    {
      id: 2,
      image: '/assets/banners/banner2.jpg',
      badge: 'MSME & COLLATERAL-FREE FUNDING',
      title: 'Turn Your Business Dreams into Reality',
      subtitle: 'Business Loan Assistance, MSME Funding, Working Capital and Subsidy Guidance.',
      primaryBtnText: 'Check Your Eligibility',
      primaryBtnAction: () => navigate('/eligibility'),
      secondaryBtnText: 'Loan Schemes',
      secondaryBtnAction: () => navigate('/loans'),
    },
    {
      id: 3,
      image: '/assets/banners/banner3.jpg',
      badge: 'END-TO-END BUSINESS CONSULTANCY',
      title: 'Complete Business Consultancy Under One Roof',
      subtitle: 'Documentation, DPR, Financial Planning and Application Assistance with Licensed CAs.',
      primaryBtnText: 'Book a Consultation',
      primaryBtnAction: () => {
        if (onOpenConsultation) onOpenConsultation();
        else navigate('/contact');
      },
      secondaryBtnText: 'Explore Services',
      secondaryBtnAction: () => navigate('/services'),
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="hero-slider-section" style={{ padding: '16px 0 24px 0', background: '#F4F8FC' }}>
      <div className="container">
        <div 
          className="hero-slider-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 12px 32px -4px rgba(0, 41, 112, 0.16)',
            border: '1px solid #E2E8F0',
            background: '#001B48',
            minHeight: '340px'
          }}
        >
          {slides.map((slide, index) => {
            const isActive = currentSlide === index;

            return (
              <div
                key={slide.id}
                className={`hero-slide-item ${isActive ? 'active' : ''}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1)' : 'scale(1.02)',
                  transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                  backgroundImage: `url(${slide.image})`,
                  backgroundPosition: 'right center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* Left Gradient Overlay ensuring 100% readable text on any screen */}
                <div 
                  className="hero-slide-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(0, 27, 72, 0.95) 0%, rgba(0, 27, 72, 0.88) 42%, rgba(0, 27, 72, 0.25) 75%, transparent 100%)',
                    zIndex: 1
                  }} 
                />

                {/* Left Content Area: Editable HTML Text Overlay */}
                <div 
                  className="hero-slide-content"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '560px',
                    padding: '36px 40px',
                    color: '#FFFFFF'
                  }}
                >
                  {/* Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0, 186, 242, 0.18)',
                    border: '1px solid rgba(0, 186, 242, 0.4)',
                    color: '#38BDF8',
                    padding: '5px 12px',
                    borderRadius: '30px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '14px'
                  }}>
                    <Sparkles size={13} color="#00BAF2" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Main Title */}
                  <h2 
                    className="hero-slide-title"
                    style={{
                      fontSize: '2.15rem',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      lineHeight: '1.2',
                      margin: '0 0 12px 0',
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}
                  >
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p 
                    className="hero-slide-subtitle"
                    style={{
                      fontSize: '1.02rem',
                      color: '#E0F2FE',
                      lineHeight: '1.55',
                      margin: '0 0 24px 0',
                      fontWeight: '400'
                    }}
                  >
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons Row */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={slide.primaryBtnAction}
                      className="btn"
                      style={{
                        background: '#00BAF2',
                        color: '#001B48',
                        padding: '11px 24px',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        fontWeight: '800',
                        border: 'none',
                        boxShadow: '0 4px 14px rgba(0, 186, 242, 0.35)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <span>{slide.primaryBtnText}</span>
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={slide.secondaryBtnAction}
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        backdropFilter: 'blur(6px)',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <span>{slide.secondaryBtnText}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Left Arrow */}
          <button
            type="button"
            className="hero-slider-arrow hero-slider-prev"
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0, 27, 72, 0.65)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            className="hero-slider-arrow hero-slider-next"
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0, 27, 72, 0.65)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Bottom Dot / Pill Indicators */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10
          }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? '34px' : '9px',
                  height: '9px',
                  borderRadius: '5px',
                  background: currentSlide === idx ? '#00BAF2' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
