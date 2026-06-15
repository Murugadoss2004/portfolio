/**
 * Portfolio Interactivity & Logic (Murugadoss V)
 */

document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------------------
    // 1. Theme Management (Dark / Light Mode Toggle)
    // ---------------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const currentTheme = localStorage.getItem("theme") || "dark";
    htmlElement.setAttribute("data-theme", currentTheme);

    themeToggleBtn.addEventListener("click", () => {
        const activeTheme = htmlElement.getAttribute("data-theme");
        let newTheme = "dark";
        
        if (activeTheme === "dark") {
            newTheme = "light";
        }
        
        htmlElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // ---------------------------------------------------------
    // 2. Navigation Header Shrink & Active Links
    // ---------------------------------------------------------
    const header = document.getElementById("main-header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        // Shrink header background on scroll
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Scroll Progress Bar
        const scrollProgress = document.getElementById("scroll-progress");
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const percentage = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${percentage}%`;
        }

        // Active Link Selection (ScrollSpy)
        let currentActiveSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for header height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentActiveSectionId = section.getAttribute("id");
            }
        });

        if (currentActiveSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });

    // ---------------------------------------------------------
    // 3. Mobile Hamburger Menu Drawer
    // ---------------------------------------------------------
    const mobileNavToggle = document.getElementById("mobile-nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    mobileNavToggle.addEventListener("click", () => {
        mobileNavToggle.classList.toggle("open");
        navMenu.classList.toggle("open");
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileNavToggle.classList.remove("open");
            navMenu.classList.remove("open");
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
            mobileNavToggle.classList.remove("open");
            navMenu.classList.remove("open");
        }
    });

    // ---------------------------------------------------------
    // 4. Hero Section Typing Effect
    // ---------------------------------------------------------
    const typingTextElement = document.getElementById("typing-text");
    const words = ["B.Tech Graduate", "Full Stack Developer", "AI & Data Science Student", "Machine Learning Enthusiast"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // faster deletion
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100; // standard typing speed
        }

        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // wait 1.5s before deletion
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typingSpeed = 500; // wait 0.5s before next word
        }

        setTimeout(type, typingSpeed);
    }

    if (typingTextElement) {
        type();
    }

    // ---------------------------------------------------------
    // 5. Scroll Reveal & Skill Bars Animation
    // ---------------------------------------------------------
    const revealElements = document.querySelectorAll(".scroll-reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                
                // If this is the skills section, animate skill bars
                if (entry.target.id === "skills") {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    function animateSkillBars() {
        const progressBars = document.querySelectorAll(".skill-progress-bar .progress");
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute("data-width");
            bar.style.width = targetWidth;
        });
    }

    // Fallback in case observer fails to trigger immediately
    setTimeout(() => {
        revealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add("revealed");
                if (element.id === "skills") {
                    animateSkillBars();
                }
            }
        });
    }, 1000);

    // ---------------------------------------------------------
    // 6. Skills Category Filter
    // ---------------------------------------------------------
    const filterButtons = document.querySelectorAll(".filter-btn");
    const skillCards = document.querySelectorAll(".skills-category-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Update active button classes
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            skillCards.forEach(card => {
                const categoryType = card.getAttribute("data-skill-type");
                
                if (filterValue === "all" || filterValue === categoryType) {
                    card.classList.remove("hidden");
                    // Apply brief scale effect
                    card.style.transform = "scale(1)";
                    card.style.opacity = "1";
                } else {
                    card.classList.add("hidden");
                    card.style.transform = "scale(0.95)";
                    card.style.opacity = "0";
                }
            });
        });
    });

    // ---------------------------------------------------------
    // 7. Interactive Contact Form Validation & Submission
    // ---------------------------------------------------------
    const contactForm = document.getElementById("contact-form");
    const formFeedback = document.getElementById("form-feedback");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Reset error states
            let hasErrors = false;
            const inputs = contactForm.querySelectorAll("input[required], textarea[required]");

            inputs.forEach(input => {
                const formGroup = input.parentElement;
                
                // Text value check
                if (!input.value.trim()) {
                    formGroup.classList.add("error");
                    hasErrors = true;
                } else {
                    formGroup.classList.remove("error");
                }

                // Email validity check
                if (input.type === "email" && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        formGroup.classList.add("error");
                        hasErrors = true;
                    }
                }
            });

            if (hasErrors) {
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector("button[type='submit']");
            submitBtn.classList.add("loading");
            submitBtn.disabled = true;

            setTimeout(() => {
                // Remove loading states
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;

                // Show success feedback
                formFeedback.textContent = "Thank you! Your message has been sent successfully.";
                formFeedback.className = "form-feedback success";
                formFeedback.classList.remove("hidden");

                // Clear form inputs
                contactForm.reset();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formFeedback.classList.add("hidden");
                }, 5000);

            }, 1500);
        });

        // Clear error classes on focus/input
        const inputs = contactForm.querySelectorAll("input, textarea");
        inputs.forEach(input => {
            input.addEventListener("input", () => {
                const formGroup = input.parentElement;
                formGroup.classList.remove("error");
            });
        });
    }
});
