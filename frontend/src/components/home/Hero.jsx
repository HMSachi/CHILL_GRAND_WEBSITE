import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Hero.css';
import { heroVideos } from '../../data/homeData';

const SWITCH_INTERVAL = 4500; // 4.5 seconds smooth luxury showcase

const Hero = () => {
    const videos = heroVideos;
    const currentIndexRef = useRef(0);
    const pendingSlotRef = useRef(null);
    const activeSlotRef = useRef('A');
    const fallbackTimerRef = useRef(null);

    // Dual video slots to achieve seamless crossfade without unmounting/black screen
    const [slotA, setSlotA] = useState(videos[0]);
    const [slotB, setSlotB] = useState(null);
    const [activeSlot, setActiveSlot] = useState('A');

    const videoRefA = useRef(null);
    const videoRefB = useRef(null);

    // Keep activeSlotRef in sync
    useEffect(() => {
        activeSlotRef.current = activeSlot;
    }, [activeSlot]);

    // Force muted on DOM elements to guarantee mobile autoplay (iOS & Android)
    useEffect(() => {
        if (videoRefA.current) {
            videoRefA.current.muted = true;
            videoRefA.current.play().catch(() => {});
        }
        if (videoRefB.current) {
            videoRefB.current.muted = true;
        }
    }, []);

    // Switch video with crossfade
    const performSwitch = (readySlot) => {
        if (pendingSlotRef.current !== readySlot) return;
        pendingSlotRef.current = null;
        if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }

        const incomingVideo = readySlot === 'B' ? videoRefB.current : videoRefA.current;
        const outgoingVideo = readySlot === 'B' ? videoRefA.current : videoRefB.current;

        if (incomingVideo) {
            incomingVideo.currentTime = 0;
            incomingVideo.play().catch(() => {});
        }

        setActiveSlot(readySlot);

        // Pause the outgoing video after crossfade animation (1.2s) to save mobile CPU/battery
        setTimeout(() => {
            if (outgoingVideo && activeSlotRef.current === readySlot) {
                outgoingVideo.pause();
            }
        }, 1200);
    };

    // Cycle videos every SWITCH_INTERVAL
    useEffect(() => {
        if (!videos || videos.length <= 1) return;

        const interval = setInterval(() => {
            const nextIdx = (currentIndexRef.current + 1) % videos.length;
            currentIndexRef.current = nextIdx;
            const nextSrc = videos[nextIdx];

            const currentActive = activeSlotRef.current;
            const targetSlot = currentActive === 'A' ? 'B' : 'A';
            pendingSlotRef.current = targetSlot;

            if (targetSlot === 'B') {
                setSlotB(nextSrc);
            } else {
                setSlotA(nextSrc);
            }

            // Fallback safety: if mobile browser delays onCanPlay event, force switch smoothly
            if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = setTimeout(() => {
                if (pendingSlotRef.current === targetSlot) {
                    performSwitch(targetSlot);
                }
            }, 2500);
        }, SWITCH_INTERVAL);

        return () => {
            clearInterval(interval);
            if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        };
    }, [videos]);

    const handleCanPlay = (slot) => {
        if (pendingSlotRef.current === slot) {
            performSwitch(slot);
        }
    };

    return (
        <section className="hero" id="home">
            {/* Seamless Dual-Buffer Video Background */}
            <video
                ref={videoRefA}
                className={`hero-video-bg ${activeSlot === 'A' ? 'is-active' : 'is-inactive'}`}
                src={slotA || undefined}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
                onCanPlay={() => handleCanPlay('A')}
            />
            <video
                ref={videoRefB}
                className={`hero-video-bg ${activeSlot === 'B' ? 'is-active' : 'is-inactive'}`}
                src={slotB || undefined}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
                onCanPlay={() => handleCanPlay('B')}
            />

            <div className="hero-overlay"></div>

            <div className="hero-content">
                {/* Premium Glass Card */}
                <div className="hero-glass-card fade-up">
                    <div className="hero-top-line"></div>

                    <span className="hero-est">EST. 2024</span>

                    <div className="hero-welcome-text fade-up-delay-1">Welcome to</div>

                    <h1 className="hero-main-title fade-up-delay-2">
                        <span className="title-part-1">CHILL</span>
                        <span className="title-part-2">GRAND</span>
                    </h1>

                    <div className="hero-divider-line fade-up-delay-3">
                        <span className="divider-diamond">◆</span>
                    </div>

                    <div className="hero-subtitle-container fade-up-delay-3">
                        <span className="tagline-text">PUB  &  RESTAURANT</span>
                    </div>

                    <div className="hero-bottom-line"></div>
                </div>

                <div className="hero-actions fade-up-delay-4">
                    <Link to="/table-booking" className="btn-hero-primary">
                        <span className="btn-hero-shine"></span>
                        <span className="btn-hero-text">Reserve Your Table</span>
                    </Link>
                    <Link to="/plan-event" className="btn-hero-secondary">
                        <span className="btn-hero-text">Plan An Event</span>
                    </Link>
                </div>
            </div>

            <div className="hero-scroll-warehouse">
                <div className="hero-scroll-indicator">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
