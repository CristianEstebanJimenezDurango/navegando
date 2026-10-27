import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================================
       1. RESPONSIVE VIDEO LOGIC (Intro, Ambient Background, and Outro)
       ========================================================================= */
    const introElement = document.getElementById('introVideo');
    const introSource = document.getElementById('introVideoSource');
    const bgOutroElement = document.getElementById('bgOutroVideo');
    const bgOutroSource = document.getElementById('bgOutroVideoSource');
    const outroElement = document.getElementById('outroVideo');
    const outroSource = document.getElementById('outroVideoSource');

    let activeIntroPath = '';
    let activeOutroPath = '';

    function syncVideoSources() {
        const isMobile = window.innerWidth <= 768;

        const targetIntro = isMobile 
            ? './video/Cabezote_de_Inicio/Cabezote_Inicio_1080_1920.mp4' 
            : './video/Cabezote_de_Inicio/Cabezote_Inicio_1920_1080.mp4';

        if (activeIntroPath !== targetIntro) {
            activeIntroPath = targetIntro;
            introSource.setAttribute('src', targetIntro);
            introElement.load();
            introElement.play().catch(() => {});
        }

        const targetOutro = isMobile 
            ? './video/Cabezote_Final_Leyenda/Final_Leyenda_Navegando_1080_1920.mp4' 
            : './video/Cabezote_Final_Leyenda/Final_Leyenda_Navegando_1920_1080.mp4';

        if (activeOutroPath !== targetOutro) {
            activeOutroPath = targetOutro;
            
            bgOutroSource.setAttribute('src', targetOutro);
            bgOutroElement.load();
            bgOutroElement.play().catch(() => {});

            outroSource.setAttribute('src', targetOutro);
            outroElement.load();
        }
    }

    window.addEventListener('resize', syncVideoSources);
    syncVideoSources();

    /* =========================================================================
       2. RESTRAIN BACKGROUND OUTRO VIDEO TO 0-5 SECOND LOOP
       ========================================================================= */
    bgOutroElement.addEventListener('timeupdate', () => {
        if (bgOutroElement.currentTime >= 6.2) {
            bgOutroElement.currentTime = 0;
        }
    });

    /* =========================================================================
       3. REVEAL SCROLL ARROW ON INTRO END
       ========================================================================= */
    const scrollArrow = document.getElementById('scrollArrow');

    function revealArrow() {
        scrollArrow.classList.remove('hidden');
        gsap.fromTo(scrollArrow, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
        );
    }

    introElement.addEventListener('ended', () => {
        revealArrow();
        introElement.loop = true;
        introElement.play().catch(() => {});
    });

    setTimeout(() => {
        if (scrollArrow.classList.contains('hidden')) revealArrow();
    }, 11000);

 /* =========================================================================
       4. SCROLL ANIMATIONS (INTRO FADE, COMPASS REVEAL & SPIN)
       ========================================================================= */
    // Fades the intro out as you scroll down
    gsap.to("#intro", {
        opacity: 0, ease: "none",
        scrollTrigger: {
            trigger: "#intro",
            start: "top top", end: "+=100%",
            pin: true, scrub: true
        }
    });

    // REVEAL TIMON.SVG ON SCROLL: Triggers right as you begin scrolling past the intro
    ScrollTrigger.create({
        trigger: "#narrative",
        start: "top 90%", // Fires when the top of the narrative section enters near the bottom of the viewport
        onEnter: () => {
            const compassWrapper = document.getElementById('compassWrapper');
            compassWrapper.classList.remove('hidden');

            // Smooth entrance animation
            gsap.fromTo(compassWrapper, 
                { opacity: 0, y: "60%" },
                { opacity: 1, y: "50%", duration: 1.2, ease: "power2.out" }
            );
        },
        onLeaveBack: () => {
            // Hides it again if the user scrolls all the way back up to the top
            const compassWrapper = document.getElementById('compassWrapper');
            gsap.to(compassWrapper, {
                opacity: 0, y: "60%", duration: 0.5,
                onComplete: () => compassWrapper.classList.add('hidden')
            });
        }
    });

    // Continuously rotates Timon.svg based on scroll progress across the site
    gsap.to("#compass", {
        rotation: 720,
        
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top", end: "bottom bottom",
            scrub: 1
        }
    });

    /* =========================================================================
       5. REVEAL CONTENT BLOCKS
       ========================================================================= */
    const brochureBlocks = document.querySelectorAll('.brochure-block');
    brochureBlocks.forEach((block) => {
        gsap.to(block, {
            opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: {
                trigger: block,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    /* =========================================================================
       6. OUTRO VIDEO SEQUENCE (Reversed mirror of the Intro transition)
       ========================================================================= */
    gsap.fromTo("#outro", 
        { opacity: 0 }, 
        {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
                trigger: "#outro",
                start: "top top",
                end: "+=100%", // Pins for 100% scroll height, exactly like the intro
                pin: true,
                scrub: true,
                onEnter: () => {
                    outroElement.currentTime = 0;
                    outroElement.play().catch(() => {});
                },
                onEnterBack: () => {
                    outroElement.play().catch(() => {});
                }
            }
        }
    );
});

/* =========================================================================
       8. AUDIO PLAYER LOGIC & AUTOPLAY WORKAROUND
       ========================================================================= */
    const ambientAudio = document.getElementById('ambientAudio');
    const audioToggle = document.getElementById('audioToggle');
    const iconPlay = document.getElementById('iconPlay');
    const iconPause = document.getElementById('iconPause');

    let isPlaying = false;
    
    // Lower volume slightly so it acts as background ambience
    ambientAudio.volume = 0.4;

    // 1. Function to handle play/pause and swap icons
    function toggleAudio() {
        if (isPlaying) {
            ambientAudio.pause();
            iconPause.classList.add('hidden');
            iconPlay.classList.remove('hidden');
            isPlaying = false;
        } else {
            // Browsers require a promise catch for audio
            ambientAudio.play().then(() => {
                iconPlay.classList.add('hidden');
                iconPause.classList.remove('hidden');
                isPlaying = true;
            }).catch(err => console.warn("Audio playback prevented:", err));
        }
    }

    // 2. Attach toggle to your floating button
    audioToggle.addEventListener('click', toggleAudio);

    // 3. THE AUTOPLAY WORKAROUND: Start music on first interaction
    const startAudioOnInteract = () => {
        if (!isPlaying) {
            ambientAudio.play().then(() => {
                isPlaying = true;
                iconPlay.classList.add('hidden');
                iconPause.classList.remove('hidden');
            }).catch(err => {
                console.log("Browser still strictly preventing audio autoplay.");
            });
        }
        
        // Clean up: Remove these listeners immediately after they fire once
        // so they don't interfere with the rest of the site's performance.
        document.removeEventListener('click', startAudioOnInteract);
        document.removeEventListener('touchstart', startAudioOnInteract);
        document.removeEventListener('scroll', startAudioOnInteract);
    };

    // 4. Listen for the very first click, tap, or scroll anywhere on the document
    document.addEventListener('click', startAudioOnInteract, { once: true });
    document.addEventListener('touchstart', startAudioOnInteract, { once: true });
    document.addEventListener('scroll', startAudioOnInteract, { once: true });

 /* =========================================
   PORT CARD POPUP LOGIC (FAIL-SAFE)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const portCards = document.querySelectorAll('.port-card');
    const portModal = document.getElementById('portModal');
    const portModalOverlay = document.getElementById('portModalOverlay');
    const portModalClose = document.getElementById('portModalClose');
    const portModalBody = document.getElementById('portModalBody');

    // Return early if modal container is missing in HTML
    if (!portModal || !portModalBody) {
        console.warn('Port Modal elements not found in HTML.');
        return;
    }

    function openPortModal(card, index) {
        // Fallback roman numerals array
        const romans = ['Puerto I', 'Puerto II', 'Puerto III', 'Puerto IV', 'Puerto V'];
        
        // Extract content
        const numText = card.querySelector('.port-num')?.textContent.trim() || romans[index] || `Puerto ${index + 1}`;
        const h3Text = card.querySelector('h3')?.textContent.trim() || '';
        const pText = card.querySelector('p')?.textContent.trim() || card.getAttribute('data-desc') || '';

        // Inject cleaned content into modal
        portModalBody.innerHTML = `
            <span class="modal-port-num">${numText}</span>
            <h3 class="modal-port-title">${h3Text}</h3>
            <p class="modal-port-desc">${pText}</p>
        `;

        // Apply port color to title in popup
        const portColor = getComputedStyle(card).getPropertyValue('--port-color') || '#2e5c95';
        const modalTitle = portModalBody.querySelector('.modal-port-title');
        if (modalTitle) modalTitle.style.color = portColor.trim();

        portModal.classList.add('active');
    }

    function closePortModal() {
        portModal.classList.remove('active');
    }

    // Attach click event to each card
    portCards.forEach((card, index) => {
        // Store description before CSS hides it on mobile
        const pEl = card.querySelector('p');
        if (pEl && !card.getAttribute('data-desc')) {
            card.setAttribute('data-desc', pEl.textContent);
        }

        card.addEventListener('click', (e) => {
            e.preventDefault();
            // Opens modal on mobile screens (or all screens if resizing window)
            if (window.innerWidth <= 768) {
                openPortModal(card, index);
            }
        });
    });

    // Close listeners
    if (portModalClose) portModalClose.addEventListener('click', closePortModal);
    if (portModalOverlay) portModalOverlay.addEventListener('click', closePortModal);
});