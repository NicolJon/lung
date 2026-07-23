/**
 * LUNG ARTS — AUDIOVISUAL PORTFOLIO
 * Interatividade, Carrossel Mobile & Animações 60fps (Apple Aesthetic)
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHoverVideos();
  initProjectModal();
  initHeroVideo();
  initMobileCarousel();
  initGridParallax();
});

/**
 * 01. Scroll Reveal Observer 60fps Ultra-Suave
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll:not(.project-card)');
  const mosaicWrapper = document.querySelector('.mosaic-wrapper');
  const projectCards = document.querySelectorAll('.project-card');

  // Observador para elementos individuais (textos, sections, etc)
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add('is-visible');
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // Observador específico para o bloco do Mosaico (dispara tudo em cascata quando o container aparece)
  if (mosaicWrapper && projectCards.length > 0) {
    
    // Função que aplica a cascata de revelação nos cards
    const triggerMosaicReveal = () => {
      projectCards.forEach((card) => {
        requestAnimationFrame(() => {
          card.classList.add('is-visible');
        });
      });
    };

    if (window.innerWidth <= 768) {
      // No Mobile: Iniciar a cascata imediatamente após a página carregar
      setTimeout(() => {
        triggerMosaicReveal();
      }, 300); // pequeno delay para a página renderizar primeiro
    } else {
      // No Desktop: Esperar o scroll chegar no bloco do portfólio
      const mosaicObserver = new IntersectionObserver(
        (entries, observer) => {
          if (entries[0].isIntersecting) {
            triggerMosaicReveal();
            observer.unobserve(mosaicWrapper);
          }
        },
        // Mudei rootMargin de -100px para 50px, fazendo disparar mais cedo, logo após o subtítulo
        { root: null, threshold: 0.1, rootMargin: '0px 0px 50px 0px' }
      );
      mosaicObserver.observe(mosaicWrapper);
    }
  }
}

/**
 * 02. Interactive Hover Video Playback em Cards do Mosaico
 */
function initHoverVideos() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    const video = card.querySelector('.card-video');
    if (!video) return;

    let playPromise = null;

    card.addEventListener('mouseenter', () => {
      if (video.readyState >= 2) {
        playPromise = video.play();
      } else {
        video.load();
        playPromise = video.play();
      }
    });

    card.addEventListener('mouseleave', () => {
      if (playPromise !== undefined && playPromise !== null) {
        playPromise
          .then(() => {
            video.pause();
            video.currentTime = 0;
          })
          .catch(() => {
            video.pause();
          });
      } else {
        video.pause();
      }
    });
  });
}

/**
 * 03. Modal / Lightbox de Visualização de Projetos
 */
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const closeBtn = document.getElementById('modalCloseBtn');
  const cards = document.querySelectorAll('.project-card');

  if (!modal) return;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.dataset.title || 'PROJETO LUNG ARTS';
      const category = card.dataset.category || 'CINEMATIC';
      const year = card.dataset.year || '2026';
      const videoSrc = card.dataset.video;

      modalTitle.textContent = title;
      modalMeta.textContent = `${category} — ${year}`;

      if (videoSrc) {
        modalVideo.src = videoSrc;
        modalVideo.play().catch(() => {});
      }

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = '';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/**
 * 04. Hero Video Resilience
 */
function initHeroVideo() {
  const heroVideo = document.getElementById('heroVideo');
  const toggleBtn = document.getElementById('heroMuteToggle');

  if (heroVideo) {
    heroVideo.play().catch(() => {
      document.addEventListener('click', () => {
        heroVideo.play().catch(() => {});
      }, { once: true });
    });

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        
        if (heroVideo.muted) {
          // Ícone Mudo
          toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-volume"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        } else {
          // Ícone Áudio Ativo
          toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon-volume"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
          // Garantir que o video toque caso o autoplay tenha falhado inicialmente
          heroVideo.play().catch(() => {});
        }
      });
    }
  }
}

/**
 * 05. Carrossel Automático e Manual dos Blocos Institucionais no Mobile
 */
function initMobileCarousel() {
  const container = document.getElementById('instCarousel');
  if (!container) return;

  const grid = container.querySelector('.institutional-grid');
  const slides = container.querySelectorAll('.inst-slide');
  const dots = container.querySelectorAll('.dot');
  
  if (!grid || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const slideIntervalTime = 3000; // 3 segundos

  function goToSlide(index) {
    currentIndex = index;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;

    const slideWidth = slides[0].offsetWidth;
    grid.scrollTo({
      left: slideWidth * currentIndex,
      behavior: 'smooth'
    });

    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      // Avança para o próximo slide apenas em telas mobile (<768px)
      if (window.innerWidth <= 768) {
        goToSlide(currentIndex + 1);
      }
    }, slideIntervalTime);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // Eventos nos Dots
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      goToSlide(index);
      startAutoSlide(); // Reinicia o timer ao interagir
    });
  });

  // Atualiza os dots se o usuário deslizar manualmente no touch
  grid.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) {
      const slideWidth = slides[0].offsetWidth;
      if (slideWidth > 0) {
        const newIndex = Math.round(grid.scrollLeft / slideWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
          currentIndex = newIndex;
          updateDots();
        }
      }
    }
  });

  // Pausa ao interagir no touch e retoma depois
  grid.addEventListener('touchstart', stopAutoSlide, { passive: true });
  grid.addEventListener('touchend', startAutoSlide, { passive: true });

  // Inicia o carrossel automático
  startAutoSlide();
}

/**
 * 07. Grid Parallax (Efeito Camadas de Hambúrguer sincronizado com o scroll)
 */
function initGridParallax() {
  const cards = document.querySelectorAll('.project-card');
  if (cards.length === 0) return;
  
  let ticking = false;
  
  function updateGrid() {
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const cardCenter = rect.top + (rect.height / 2);
      const screenCenter = windowHeight / 2;
      
      // Distância do centro da tela
      const distance = cardCenter - screenCenter;
      
      // Velocidades variadas por coluna simulando o hambúrguer
      const colIndex = index % 4;
      let speed = 0;
      
      if (colIndex === 0) speed = 0.15;
      else if (colIndex === 1) speed = 0.04;
      else if (colIndex === 2) speed = 0.10;
      else if (colIndex === 3) speed = 0.22;
      
      const yPos = distance * speed;
      
      card.style.setProperty('--scroll-y', `${yPos}px`);
    });
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateGrid);
      ticking = true;
    }
  }, { passive: true });
  
  // Set initial state
  updateGrid();
}


