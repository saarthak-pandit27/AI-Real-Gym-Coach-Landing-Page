/* ==========================================================================
   AI GYM COACH — MASTER INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------------------------------------------------
       1. SCROLL PROGRESS & NAVBAR ACTIVE STATES
       -------------------------------------------------------------------------- */
    const scrollProgress = document.getElementById("scroll-progress");
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll("section[id]");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navLinksContainer = document.getElementById("nav-links");
    const backToTop = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = `${scrollPercent}%`;

        // Navbar shadow / blur effect on scroll
        if (scrollTop > 50) {
            navbar.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.7)";
        } else {
            navbar.style.boxShadow = "none";
        }

        // Active link highlighting
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    // Mobile toggle
    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            navLinksContainer.classList.toggle("active");
        });
    }

    // Close mobile nav when clicking link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navLinksContainer.classList.contains("active")) {
                navLinksContainer.classList.remove("active");
            }
        });
    });

    // Back to top
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* --------------------------------------------------------------------------
       2. SCROLL REVEAL & COUNTER ANIMATIONS
       -------------------------------------------------------------------------- */
    const observerOptions = { threshold: 0.15 };
    const revealElements = document.querySelectorAll(".feature-card, .journey-card, .stat-card, .tech-card, .faq-item");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        revealObserver.observe(el);
    });

    // Number Counter Animation
    const counters = document.querySelectorAll(".counter");
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute("data-target"));
                let count = 0;
                const speed = target / 40;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        counter.innerText = `${Math.ceil(count)}%`;
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = `${target}%`;
                    }
                };
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));


    /* --------------------------------------------------------------------------
       3. HERO AI POSE SIMULATOR ENGINE (CANVAS 1)
       -------------------------------------------------------------------------- */
    const heroCanvas = document.getElementById("hero-pose-canvas");
    const heroSimToggleBtn = document.getElementById("hero-sim-toggle");
    const heroSimIcon = document.getElementById("hero-sim-icon");
    const heroSimBtnText = document.getElementById("hero-sim-btn-text");
    const heroRepCounter = document.getElementById("hero-rep-counter");
    const heroAngleTag = document.getElementById("hero-angle-tag");
    const heroFeedbackText = document.getElementById("hero-feedback-text");

    if (heroCanvas) {
        const ctx = heroCanvas.getContext("2d");
        let animationFrameId;
        let isHeroSimRunning = true;
        let squatPhase = 0; // 0 to Math.PI * 2
        let heroReps = 12;
        let lastInSquat = false;

        function drawHeroPose() {
            const width = heroCanvas.width;
            const height = heroCanvas.height;

            ctx.clearRect(0, 0, width, height);

            // Draw dark background grid lines
            ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = 0; y < height; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            }

            if (isHeroSimRunning) {
                squatPhase += 0.035;
            }

            // Squat calculation: sin wave determines depth
            const normSin = (Math.sin(squatPhase) + 1) / 2; // 0 (standing) to 1 (squatting)
            const squatDepth = normSin * 65; // vertical offset

            // Joint coordinates
            const headX = width / 2;
            const headY = 70 + squatDepth;

            const shoulderX = width / 2;
            const shoulderY = 110 + squatDepth;

            const lShoulderX = shoulderX - 35;
            const rShoulderX = shoulderX + 35;

            const lElbowX = lShoulderX - 25;
            const lElbowY = shoulderY + 40;
            const rElbowX = rShoulderX + 25;
            const rElbowY = shoulderY + 40;

            const lWristX = lElbowX + 15;
            const lWristY = lElbowY - 20;
            const rWristX = rElbowX - 15;
            const rWristY = rElbowY - 20;

            const hipX = width / 2;
            const hipY = 190 + squatDepth;

            const lHipX = hipX - 25;
            const rHipX = hipX + 25;

            // Knees bend outward as squat deepens
            const lKneeX = lHipX - 20 - normSin * 25;
            const lKneeY = 245 + squatDepth * 0.4;

            const rKneeX = rHipX + 20 + normSin * 25;
            const rKneeY = 245 + squatDepth * 0.4;

            const lAnkleX = lHipX - 15;
            const lAnkleY = 295;
            const rAnkleX = rHipX + 15;
            const rAnkleY = 295;

            // Knee angle calculation for display
            const kneeAngle = Math.round(175 - normSin * 85); // 175deg standing down to 90deg squat
            if (heroAngleTag) heroAngleTag.innerText = `${kneeAngle}°`;

            // Rep counter increment on full squat completion
            const inDeepSquat = normSin > 0.85;
            if (inDeepSquat && !lastInSquat) {
                heroReps++;
                if (heroRepCounter) heroRepCounter.innerText = heroReps;
                if (heroFeedbackText) heroFeedbackText.innerText = "Form Perfect — Full Depth Reached";
                lastInSquat = true;
            } else if (normSin < 0.2) {
                lastInSquat = false;
            }

            // Draw Skeleton Connections
            const connections = [
                // Torso
                [lShoulderX, shoulderY, rShoulderX, shoulderY],
                [lShoulderX, shoulderY, lHipX, hipY],
                [rShoulderX, shoulderY, rHipX, hipY],
                [lHipX, hipY, rHipX, hipY],
                // Arms
                [lShoulderX, shoulderY, lElbowX, lElbowY],
                [lElbowX, lElbowY, lWristX, lWristY],
                [rShoulderX, shoulderY, rElbowX, rElbowY],
                [rElbowX, rElbowY, rWristX, rWristY],
                // Legs
                [lHipX, hipY, lKneeX, lKneeY],
                [lKneeX, lKneeY, lAnkleX, lAnkleY],
                [rHipX, hipY, rKneeX, rKneeY],
                [rKneeX, rKneeY, rAnkleX, rAnkleY]
            ];

            ctx.lineWidth = 4;
            ctx.strokeStyle = "#00F2FE";
            ctx.shadowColor = "#00F2FE";
            ctx.shadowBlur = 10;

            connections.forEach(([x1, y1, x2, y2]) => {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            });

            // Draw Head
            ctx.beginPath();
            ctx.arc(headX, headY, 20, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 242, 254, 0.2)";
            ctx.fill();
            ctx.strokeStyle = "#00F2FE";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw Glowing Joint Points
            const joints = [
                [headX, headY], [lShoulderX, shoulderY], [rShoulderX, shoulderY],
                [lElbowX, lElbowY], [rElbowX, rElbowY], [lWristX, lWristY], [rWristX, rWristY],
                [lHipX, hipY], [rHipX, hipY], [lKneeX, lKneeY], [rKneeX, rKneeY],
                [lAnkleX, lAnkleY], [rAnkleX, rAnkleY]
            ];

            joints.forEach(([jx, jy]) => {
                ctx.beginPath();
                ctx.arc(jx, jy, 6, 0, Math.PI * 2);
                ctx.fillStyle = "#8B5CF6";
                ctx.shadowColor = "#8B5CF6";
                ctx.shadowBlur = 12;
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            // Draw Angle Measurement Arc on Left Knee
            ctx.beginPath();
            ctx.arc(lKneeX, lKneeY, 22, -Math.PI / 2, -Math.PI / 2 + (kneeAngle * Math.PI / 180));
            ctx.strokeStyle = "#10B981";
            ctx.lineWidth = 3;
            ctx.stroke();

            animationFrameId = requestAnimationFrame(drawHeroPose);
        }

        drawHeroPose();

        if (heroSimToggleBtn) {
            heroSimToggleBtn.addEventListener("click", () => {
                isHeroSimRunning = !isHeroSimRunning;
                if (isHeroSimRunning) {
                    heroSimIcon.innerText = "⏸";
                    heroSimBtnText.innerText = "Pause";
                } else {
                    heroSimIcon.innerText = "▶";
                    heroSimBtnText.innerText = "Resume";
                }
            });
        }
    }


    /* --------------------------------------------------------------------------
       4. INTERACTIVE SIMULATOR (CANVAS 2) & EXERCISE ENGINE
       -------------------------------------------------------------------------- */
    const simCanvas = document.getElementById("interactive-sim-canvas");
    const simWorkoutBtns = document.querySelectorAll(".sim-workout-btn");
    const simStartBtn = document.getElementById("sim-start-btn");
    const simResetBtn = document.getElementById("sim-reset-btn");

    const simAngleValue = document.getElementById("sim-angle-value");
    const simAngleBar = document.getElementById("sim-angle-bar");
    const simAccuracyValue = document.getElementById("sim-accuracy-value");
    const simAccuracyBar = document.getElementById("sim-accuracy-bar");
    const simRepCount = document.getElementById("sim-rep-count");
    const simCaloriesCount = document.getElementById("sim-calories-count");
    const simVoiceMsg = document.getElementById("sim-voice-msg");
    const simStateVal = document.getElementById("sim-state-val");
    const simJointName = document.getElementById("sim-joint-name");

    if (simCanvas) {
        const sctx = simCanvas.getContext("2d");
        let activeWorkout = "squat";
        let isSimRunning = true;
        let simPhase = 0;
        let simReps = 0;
        let simCalories = 0.0;
        let simLastBottom = false;

        const voiceFeedbacks = {
            squat: [
                "Great depth! Keep chest up and push through your heels.",
                "Excellent hip hinge. Maintain core stability.",
                "Perfect 90° knee angle! Drive upwards cleanly."
            ],
            pushup: [
                "Keep core tight and elbow angle at 45 degrees.",
                "Full chest touch! Push up explosively.",
                "Great spine alignment. Don't let your hips sag."
            ],
            curl: [
                "Keep your elbows pinned to your torso.",
                "Peak biceps contraction! Control the lowering phase.",
                "Smooth eccentric motion. Avoid swinging momentum."
            ]
        };

        // Workout Selection
        simWorkoutBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                simWorkoutBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                activeWorkout = btn.getAttribute("data-workout");

                if (simJointName) {
                    if (activeWorkout === "squat") simJointName.innerText = "KNEE FLEXION";
                    else if (activeWorkout === "pushup") simJointName.innerText = "ELBOW ANGLE";
                    else if (activeWorkout === "curl") simJointName.innerText = "BICEP FLEXION";
                }
            });
        });

        // Start/Pause Button
        if (simStartBtn) {
            simStartBtn.addEventListener("click", () => {
                isSimRunning = !isSimRunning;
                if (isSimRunning) {
                    simStartBtn.querySelector("span").innerText = "Pause Simulation";
                } else {
                    simStartBtn.querySelector("span").innerText = "Resume Simulation";
                }
            });
        }

        // Reset Button
        if (simResetBtn) {
            simResetBtn.addEventListener("click", () => {
                simReps = 0;
                simCalories = 0.0;
                if (simRepCount) simRepCount.innerText = "0";
                if (simCaloriesCount) simCaloriesCount.innerText = "0.0";
            });
        }

        function drawInteractiveSim() {
            const w = simCanvas.width;
            const h = simCanvas.height;

            sctx.clearRect(0, 0, w, h);

            // Dark grid background
            sctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
            sctx.lineWidth = 1;
            for (let x = 0; x < w; x += 30) {
                sctx.beginPath(); sctx.moveTo(x, 0); sctx.lineTo(x, h); sctx.stroke();
            }

            if (isSimRunning) {
                simPhase += 0.04;
            }

            const normSin = (Math.sin(simPhase) + 1) / 2; // 0 to 1

            let currentAngle = 170;
            let joints = [];
            let connections = [];

            if (activeWorkout === "squat") {
                const depth = normSin * 60;
                currentAngle = Math.round(175 - normSin * 85);

                if (simStateVal) simStateVal.innerText = normSin > 0.5 ? "ECCENTRIC (DOWN)" : "CONCENTRIC (UP)";

                const head = [w / 2, 80 + depth];
                const shoulderL = [w / 2 - 30, 120 + depth];
                const shoulderR = [w / 2 + 30, 120 + depth];
                const hipL = [w / 2 - 25, 200 + depth];
                const hipR = [w / 2 + 25, 200 + depth];

                const kneeL = [w / 2 - 45 - normSin * 20, 260 + depth * 0.4];
                const kneeR = [w / 2 + 45 + normSin * 20, 260 + depth * 0.4];
                const ankleL = [w / 2 - 35, 320];
                const ankleR = [w / 2 + 35, 320];

                joints = [head, shoulderL, shoulderR, hipL, hipR, kneeL, kneeR, ankleL, ankleR];
                connections = [
                    [shoulderL, shoulderR], [shoulderL, hipL], [shoulderR, hipR], [hipL, hipR],
                    [hipL, kneeL], [kneeL, ankleL], [hipR, kneeR], [kneeR, ankleR]
                ];
            } else if (activeWorkout === "pushup") {
                const pushDepth = normSin * 45;
                currentAngle = Math.round(165 - normSin * 75);

                if (simStateVal) simStateVal.innerText = normSin > 0.5 ? "LOWERING CHEST" : "PUSHING UP";

                const head = [120, 200 + pushDepth];
                const shoulder = [170, 210 + pushDepth];
                const elbow = [170 + normSin * 30, 260 + pushDepth * 0.5];
                const wrist = [170, 310];

                const hip = [310, 205 + pushDepth];
                const knee = [410, 210 + pushDepth * 0.8];
                const ankle = [500, 215 + pushDepth * 0.6];

                joints = [head, shoulder, elbow, wrist, hip, knee, ankle];
                connections = [
                    [head, shoulder], [shoulder, elbow], [elbow, wrist],
                    [shoulder, hip], [hip, knee], [knee, ankle]
                ];
            } else if (activeWorkout === "curl") {
                currentAngle = Math.round(160 - normSin * 115);

                if (simStateVal) simStateVal.innerText = normSin > 0.5 ? "LIFTING WEIGHT" : "LOWERING ARM";

                const head = [w / 2, 70];
                const shoulder = [w / 2, 110];
                const elbow = [w / 2 - 30, 180];

                // Hand curls up toward shoulder
                const handX = w / 2 - 30 + (1 - normSin) * 20 - normSin * 25;
                const handY = 270 - normSin * 100;
                const hand = [handX, handY];

                const hip = [w / 2, 210];
                const knee = [w / 2, 290];
                const ankle = [w / 2, 350];

                joints = [head, shoulder, elbow, hand, hip, knee, ankle];
                connections = [
                    [head, shoulder], [shoulder, elbow], [elbow, hand],
                    [shoulder, hip], [hip, knee], [knee, ankle]
                ];
            }

            // Draw connections
            sctx.lineWidth = 5;
            sctx.strokeStyle = "#00F2FE";
            sctx.shadowColor = "#00F2FE";
            sctx.shadowBlur = 12;

            connections.forEach(([p1, p2]) => {
                sctx.beginPath();
                sctx.moveTo(p1[0], p1[1]);
                sctx.lineTo(p2[0], p2[1]);
                sctx.stroke();
            });

            // Draw Joints
            joints.forEach(([jx, jy]) => {
                sctx.beginPath();
                sctx.arc(jx, jy, 7, 0, Math.PI * 2);
                sctx.fillStyle = "#8B5CF6";
                sctx.shadowColor = "#8B5CF6";
                sctx.shadowBlur = 10;
                sctx.fill();
                sctx.strokeStyle = "#FFFFFF";
                sctx.lineWidth = 2;
                sctx.stroke();
            });

            // Update Telemetry Panel
            if (simAngleValue) simAngleValue.innerText = `${currentAngle}°`;
            if (simAngleBar) simAngleBar.style.width = `${Math.min(100, (currentAngle / 180) * 100)}%`;

            // Calculate reps & calories
            const isBottom = normSin > 0.85;
            if (isBottom && !simLastBottom) {
                simReps++;
                simCalories += (activeWorkout === "squats" ? 0.35 : 0.28);
                if (simRepCount) simRepCount.innerText = simReps;
                if (simCaloriesCount) simCaloriesCount.innerText = simCalories.toFixed(1);

                // Update voice message
                const msgList = voiceFeedbacks[activeWorkout] || voiceFeedbacks.squat;
                const randomMsg = msgList[Math.floor(Math.random() * msgList.length)];
                if (simVoiceMsg) simVoiceMsg.innerText = `"${randomMsg}"`;

                simLastBottom = true;
            } else if (normSin < 0.2) {
                simLastBottom = false;
            }

            requestAnimationFrame(drawInteractiveSim);
        }

        drawInteractiveSim();
    }


    /* --------------------------------------------------------------------------
       5. FEATURE CATEGORY FILTER TABS
       -------------------------------------------------------------------------- */
    const filterTabs = document.querySelectorAll(".filter-tab");
    const featureCards = document.querySelectorAll(".feature-card");

    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const filter = tab.getAttribute("data-filter");

            featureCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    card.style.display = "flex";
                    setTimeout(() => { card.style.opacity = "1"; card.style.transform = "translateY(0)"; }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(20px)";
                    setTimeout(() => { card.style.display = "none"; }, 300);
                }
            });
        });
    });


    /* --------------------------------------------------------------------------
       6. DASHBOARD SHOWCASE TABS
       -------------------------------------------------------------------------- */
    const dashTabs = document.querySelectorAll(".dash-tab");
    const dashPanes = document.querySelectorAll(".dash-pane");

    dashTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            dashTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const targetTab = tab.getAttribute("data-tab");
            dashPanes.forEach(pane => {
                if (pane.getAttribute("id") === targetTab) {
                    pane.classList.add("active");
                } else {
                    pane.classList.remove("active");
                }
            });
        });
    });


    /* --------------------------------------------------------------------------
       7. FAQ ACCORDION TOGGLES
       -------------------------------------------------------------------------- */
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        if (questionBtn) {
            questionBtn.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach(i => i.classList.remove("active"));
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });


    /* --------------------------------------------------------------------------
       8. NEWSLETTER FORM HANDLER
       -------------------------------------------------------------------------- */
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector("input");
            if (input && input.value) {
                alert(`Thank you for subscribing, ${input.value}! You'll receive AI Gym Coach updates.`);
                input.value = "";
            }
        });
    }

});