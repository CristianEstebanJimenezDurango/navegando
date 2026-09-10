import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. RESPONSIVE VIDEO LOGIC
       ========================================= */
    const videoElement = document.getElementById('introVideo');
    const videoSource = document.getElementById('introVideoSource');
    
    function updateVideoSource() {
        const isMobile = window.innerWidth <= 768;
        const newSrc = isMobile 
            ? '/video/Cabezote_de_Inicio/Cabezote_Inicio_1080_1920.mp4' 
            : '/video/Cabezote_de_Inicio/Cabezote_Inicio_1920_1080.mp4';
            
        if (!videoSource.src.includes(newSrc)) {
            videoSource.src = newSrc;
            videoElement.load();
        }
    }
    
    window.addEventListener('resize', updateVideoSource);
    updateVideoSource();

    /* =========================================
       2. SVG SEA & CLOUD AMBIENT ANIMATIONS
       ========================================= */
    gsap.to(".cloud-1", { x: 120, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".cloud-2", { x: -90, duration: 22, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".cloud-3", { x: 70, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });

    gsap.to("#waveBack", { x: -40, y: 10, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("#waveMid", { x: 50, y: -12, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("#waveFront", { x: -30, y: 8, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

    /* =========================================
       3. REVEAL UI AFTER VIDEO ENDS
       ========================================= */
    const compassWrapper = document.getElementById('compassWrapper');
    const scrollArrow = document.getElementById('scrollArrow');

    videoElement.addEventListener('ended', () => {
        compassWrapper.classList.remove('hidden');
        scrollArrow.classList.remove('hidden');

        gsap.fromTo(compassWrapper, 
            { opacity: 0, y: "60%" },
            { opacity: 1, y: "50%", duration: 1.2, ease: "power2.out" }
        );

        gsap.fromTo(scrollArrow, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: "power2.out" }
        );

        videoElement.loop = true;
        videoElement.play();
    });

    /* =========================================
       4. INTRO VIDEO FADE OUT ON SCROLL
       ========================================= */
    gsap.to("#intro", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: "#intro",
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: true
        }
    });

    /* =========================================
       5. GLOBAL COMPASS ROTATION ON SCROLL
       ========================================= */
    gsap.to("#compass", {
        rotation: 720,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    /* =========================================
       6. STAGGERED REVEAL OF BROCHURE BLOCKS
       ========================================= */
    const brochureBlocks = document.querySelectorAll('.brochure-block');
    
    brochureBlocks.forEach((block) => {
        gsap.to(block, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: block,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });
});