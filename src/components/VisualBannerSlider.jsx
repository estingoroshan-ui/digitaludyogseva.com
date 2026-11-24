import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Lock, 
  FileCheck, 
  Banknote, 
  Sparkles, 
  Building2, 
  FileSpreadsheet, 
  Rocket, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Zap, 
  Check, 
  Landmark
} from 'lucide-react';
import { useRouter } from '../router/Router';

export const VisualBannerSlider = () => {
  const { navigate } = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = 3;
  const slideTimerRef = useRef(null);

  // Auto-advance slider every 4.5 seconds
  useEffect(() => {
    if (!isPaused) {
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4500);
    }
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isPaused, totalSlides]);

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div 
      className="visual-banner-slider-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto 40px auto',
        padding: '0 16px',
        userSelect: 'none'
      }}
    >
      <div 
        className="visual-slider-card"
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 16px 36px -6px rgba(0, 41, 112, 0.22), 0 0 0 1px rgba(0, 186, 242, 0.15)',
          background: '#001B48',
          height: '240px',
          minHeight: '220px'
        }}
      >
        {/* =========================================================================
            SLIDE 1: GOVERNMENT SCHEMES & SUBSIDIES (PURE VISUAL SHOWCASE)
            ========================================================================= */}
        <div 
          onClick={() => navigate('/loans')}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: currentSlide === 0 ? 1 : 0,
            transform: currentSlide === 0 ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: currentSlide === 0 ? 'auto' : 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #001233 0%, #002970 50%, #0284C7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 44px',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Glow Circles */}
          <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 186, 242, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-50px', right: '15%', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(250, 204, 21, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Left Visual Badge: 35% Gold Subsidy Emblem */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2 }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #78350F 100%)',
              padding: '4px',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #78350F 0%, #451A03 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FCD34D'
              }}>
                <Award size={22} color="#FDE68A" />
                <span style={{ fontSize: '1.45rem', fontWeight: '900', color: '#FDE68A', lineHeight: 1, letterSpacing: '-0.03em' }}>35%</span>
                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                  <Star size={10} color="#FDE68A" fill="#FDE68A" />
                  <Star size={10} color="#FDE68A" fill="#FDE68A" />
                  <Star size={10} color="#FDE68A" fill="#FDE68A" />
                </div>
              </div>
            </div>

            {/* Official Grant Ribbon Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <Landmark size={18} color="#38BDF8" />
                  <ShieldCheck size={18} color="#4ADE80" />
                  <Sparkles size={16} color="#FCD34D" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '6px 14px', borderRadius: '30px' }}>
                  <CheckCircle2 size={16} color="#34D399" />
                  <span style={{ color: '#E0F2FE', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.02em' }}>₹50,00,000</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ height: '8px', width: '38px', borderRadius: '4px', background: '#F59E0B' }} />
                <span style={{ height: '8px', width: '38px', borderRadius: '4px', background: '#FFFFFF' }} />
                <span style={{ height: '8px', width: '38px', borderRadius: '4px', background: '#10B981' }} />
              </div>
            </div>
          </div>

          {/* Center 3-Stage Visual Pipeline */}
          <div className="slider-pipeline-center" style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck size={22} color="#FFFFFF" />
              </div>
              <div style={{ width: '18px', height: '2px', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSpreadsheet size={22} color="#FFFFFF" />
              </div>
              <div style={{ width: '18px', height: '2px', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)' }}>
                <Banknote size={24} color="#FFFFFF" />
              </div>
            </div>
          </div>

          {/* Right Visual Accents: Rupee Graph and Gold Coin Stack */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={24} color="#4ADE80" />
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#000', fontSize: '1.1rem' }}>
                  ₹
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '24px' }}>
                <div style={{ width: '6px', height: '10px', background: '#38BDF8', borderRadius: '2px' }} />
                <div style={{ width: '6px', height: '15px', background: '#38BDF8', borderRadius: '2px' }} />
                <div style={{ width: '6px', height: '20px', background: '#4ADE80', borderRadius: '2px' }} />
                <div style={{ width: '6px', height: '24px', background: '#FACC15', borderRadius: '2px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SLIDE 2: BUSINESS REGISTRATION & LEGAL VAULT (PURE VISUAL SHOWCASE)
            ========================================================================= */}
        <div 
          onClick={() => navigate('/services')}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: currentSlide === 1 ? 1 : 0,
            transform: currentSlide === 1 ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: currentSlide === 1 ? 'auto' : 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #022c54 0%, #0369a1 45%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 44px',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div style={{ position: 'absolute', top: '-60px', right: '30%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Left Visual: MCA Certificate Folio with Golden Seal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', zIndex: 2 }}>
            <div style={{
              width: '88px',
              height: '110px',
              borderRadius: '12px',
              background: '#FFFFFF',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.35)',
              border: '2px solid #E2E8F0',
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              {/* Header gold bar */}
              <div style={{ width: '100%', height: '8px', background: 'linear-gradient(90deg, #F59E0B, #D97706)', borderRadius: '3px' }} />
              
              {/* Abstract document lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ width: '80%', height: '4px', background: '#CBD5E1', borderRadius: '2px' }} />
                <div style={{ width: '100%', height: '4px', background: '#E2E8F0', borderRadius: '2px' }} />
                <div style={{ width: '90%', height: '4px', background: '#CBD5E1', borderRadius: '2px' }} />
              </div>

              {/* Gold Ribbon Stamp */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={14} color="#FFFFFF" />
                </div>
              </div>
            </div>

            {/* Digital USB Token and Key */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
                <Lock size={16} color="#FCD34D" />
                <Zap size={16} color="#38BDF8" />
                <CheckCircle2 size={16} color="#4ADE80" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px #38BDF8' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
              </div>
            </div>
          </div>

          {/* Center: 5 Holographic Floating Badges */}
          <div className="slider-pipeline-center" style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} color="#FFFFFF" />
            </div>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="#38BDF8" />
            </div>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #0284C7, #002970)', border: '2px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(56, 189, 248, 0.4)' }}>
              <Award size={28} color="#FDE68A" />
            </div>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={24} color="#4ADE80" />
            </div>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={24} color="#FBBF24" />
            </div>
          </div>

          {/* Right: 7-Day Rocket Speed and Encrypted Vault */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(234, 88, 12, 0.35)'
            }}>
              <Rocket size={32} color="#FFFFFF" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            SLIDE 3: CA PROJECT REPORTS (DPR) & LOAN UNDERWRITING (PURE VISUAL SHOWCASE)
            ========================================================================= */}
        <div 
          onClick={() => navigate('/loans')}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: currentSlide === 2 ? 1 : 0,
            transform: currentSlide === 2 ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: currentSlide === 2 ? 'auto' : 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #022c22 0%, #064e3b 45%, #002970 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 44px',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Green Ambient Glow */}
          <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(74, 222, 128, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Left Visual: Hardcover DPR Project Report Folio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', zIndex: 2 }}>
            <div style={{
              width: '90px',
              height: '110px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #047857, #065F46)',
              border: '2px solid rgba(74, 222, 128, 0.4)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FileText size={18} color="#A7F3D0" />
                <Check size={14} color="#4ADE80" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ width: '90%', height: '4px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '2px' }} />
                <div style={{ width: '70%', height: '4px', background: 'rgba(255, 255, 255, 0.25)', borderRadius: '2px' }} />
              </div>
              <div style={{
                background: '#10B981',
                borderRadius: '4px',
                padding: '2px 4px',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
              }}>
                <CheckCircle2 size={12} color="#FFFFFF" style={{ margin: '0 auto' }} />
              </div>
            </div>

            {/* CA Signature Seal & Approval */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <ShieldCheck size={18} color="#4ADE80" />
                <TrendingUp size={18} color="#FBBF24" />
                <Banknote size={18} color="#38BDF8" />
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ width: '40px', height: '6px', borderRadius: '3px', background: '#34D399' }} />
                <span style={{ width: '20px', height: '6px', borderRadius: '3px', background: '#38BDF8' }} />
              </div>
            </div>
          </div>

          {/* Center: 750+ CIBIL Score Gauge Graphic */}
          <div className="slider-pipeline-center" style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #064E3B 0%, #022C22 100%)',
              border: '3px solid #34D399',
              boxShadow: '0 0 20px rgba(52, 211, 153, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={22} color="#34D399" />
              <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#6EE7B7', lineHeight: 1 }}>780</span>
              <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              </div>
            </div>
          </div>

          {/* Right: Direct Bank Sanction Pillar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
            }}>
              <Landmark size={34} color="#FFFFFF" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            SLIDER CONTROLS: PREVIOUS / NEXT ARROWS & ELONGATED PILL INDICATORS
            ========================================================================= */}
        {/* Left Arrow */}
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0, 41, 112, 0.65)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0, 41, 112, 0.65)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Bottom 3 Pill Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10
        }}>
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
              style={{
                width: currentSlide === idx ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentSlide === idx ? '#00BAF2' : 'rgba(255, 255, 255, 0.35)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: 0
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
