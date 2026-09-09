document.addEventListener('DOMContentLoaded', () => {
            const carousel = document.querySelector('.profile-carousel-container');
            if (!carousel) return;
            const track = carousel.querySelector('.profile-carousel-track');
            const dots = carousel.querySelectorAll('.profile-dot');
            const totalProfiles = 2;
            let currentIndex = 0;
            let startX = 0;
            let isDragging = false;
            let autoplayTimer;

            function updateCarousel(index) {
              if (index < 0) index = totalProfiles - 1;
              if (index >= totalProfiles) index = 0;
              currentIndex = index;
              track.style.transform = `translateX(-${currentIndex * 50}%)`;
              dots.forEach((dot, i) => {
                if (i === currentIndex) {
                  dot.style.background = 'var(--primary)';
                  dot.style.width = '32px';
                  dot.style.borderRadius = '4px';
                } else {
                  dot.style.background = '#ccc';
                  dot.style.width = '8px';
                  dot.style.borderRadius = '50%';
                }
              });
            }

            function getDisplayDuration(index) {
              return index === 0 ? 10000 : 1000;
            }
            function startAutoplay() {
              stopAutoplay();
              autoplayTimer = setTimeout(() => {
                updateCarousel(currentIndex + 1);
                startAutoplay();
              }, getDisplayDuration(currentIndex));
            }
            function stopAutoplay() {
              if (autoplayTimer) clearTimeout(autoplayTimer);
            }

            dots.forEach(dot => {
              dot.addEventListener('click', () => {
                updateCarousel(parseInt(dot.getAttribute('data-index')));
                startAutoplay();
              });
            });

            // Swipe support
            track.addEventListener('touchstart', (e) => {
              startX = e.touches[0].clientX;
              isDragging = true;
              stopAutoplay();
            }, {passive: true});

            track.addEventListener('touchmove', (e) => {
              if (!isDragging) return;
              const currentX = e.touches[0].clientX;
              const diff = startX - currentX;
              track.style.transition = 'none';
              track.style.transform = `translateX(calc(-${currentIndex * 50}% - ${diff / 4}px))`;
            }, {passive: true});

            track.addEventListener('touchend', (e) => {
              if (!isDragging) return;
              isDragging = false;
              track.style.transition = 'transform 0.4s ease';
              const endX = e.changedTouches[0].clientX;
              const diff = startX - endX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) updateCarousel(currentIndex + 1);
                else updateCarousel(currentIndex - 1);
              } else {
                updateCarousel(currentIndex);
              }
              startAutoplay();
            });

            // Start autoplay
            startAutoplay();
          });


      document.addEventListener('DOMContentLoaded', () => {
        const carousel = document.querySelector('.services-carousel-container');
        if (!carousel) return;
        const track = carousel.querySelector('.services-carousel-track');
        const dots = carousel.querySelectorAll('.services-dot');
        const label = carousel.querySelector('.services-label');
        const slideNames = ['Judicial Appraisal', 'Open-Market Valuation', 'Bank Valuation & Mortgage Guarantee', 'Estate Appraisal', 'Rental Valuation'];
        const totalSlides = 5;
        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;
        let autoplayTimer;

        function updateCarousel(index) {
          if (index < 0) index = totalSlides - 1;
          if (index >= totalSlides) index = 0;
          currentIndex = index;
          track.style.transform = `translateX(-${currentIndex * 20}%)`;
          label.style.opacity = '0';
          setTimeout(() => { label.textContent = slideNames[currentIndex]; label.style.opacity = '1'; }, 200);

          dots.forEach((dot, i) => {
            if (i === currentIndex) {
              dot.style.background = 'var(--primary)';
              dot.style.width = '32px';
              dot.style.borderRadius = '4px';
            } else {
              dot.style.background = '#ccc';
              dot.style.width = '8px';
              dot.style.borderRadius = '50%';
            }
          });
        }

        function startAutoplay() {
          stopAutoplay();
          autoplayTimer = setInterval(() => {
            updateCarousel(currentIndex + 1);
          }, 5000);
        }
        function stopAutoplay() {
          if (autoplayTimer) clearInterval(autoplayTimer);
        }

        dots.forEach(dot => {
          dot.addEventListener('click', () => {
            updateCarousel(parseInt(dot.getAttribute('data-index')));
            startAutoplay();
          });
        });

        // Swipe support
        track.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          isDragging = true;
          track.style.transition = 'none';
          stopAutoplay();
        }, {passive: true});

        track.addEventListener('touchmove', (e) => {
          if (!isDragging) return;
          const currentX = e.touches[0].clientX;
          const diff = startX - currentX;
          track.style.transform = `translateX(calc(-${currentIndex * 20}% - ${diff / 5}px))`;
        }, {passive: true});

        track.addEventListener('touchend', (e) => {
          if (!isDragging) return;
          isDragging = false;
          track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
          const endX = e.changedTouches[0].clientX;
          const diff = startX - endX;
          if (Math.abs(diff) > 50) {
            if (diff > 0) updateCarousel(currentIndex + 1);
            else updateCarousel(currentIndex - 1);
          } else {
            updateCarousel(currentIndex);
          }
          startAutoplay();
        });

        // Start autoplay
        startAutoplay();
      });


        function updateStepper(id, change) {
          const input = document.getElementById(id);
          let val = parseInt(input.value) || 0;
          val += change;
          const max = id === 'rooms' ? 30 : 50;
          if (val < 0) val = 0;
          if (val > max) val = max;
          input.value = val;
        }




      (function () {
        if (typeof MADAGASCAR_LOCATIONS === 'undefined') return;

        /**
         * Initialise un dropdown autocomplete sur un input texte.
         * @param {string} inputId   - ID de l'input visible (texte)
         * @param {string} hiddenId  - ID de l'input hidden (valeur réelle)
         * @param {string} listId    - ID du div listbox
         * @param {string[]} items   - Tableau des options
         * @param {object} opts      - { onSelect, customInputId }
         */
        function initAutocomplete(inputId, hiddenId, listId, items, opts) {
          var input = document.getElementById(inputId);
          var hidden = document.getElementById(hiddenId);
          var list = document.getElementById(listId);
          var customInput = opts.customInputId ? document.getElementById(opts.customInputId) : null;
          var activeIndex = -1;
          var filteredItems = [];

          function renderList(filter) {
            list.innerHTML = '';
            activeIndex = -1;
            var query = (filter || '').toLowerCase();
            filteredItems = items.filter(function (item) {
              return item.toLowerCase().indexOf(query) !== -1;
            });
            // Toujours ajouter « Autre » en fin de liste
            var hasAutre = filteredItems.indexOf('Autre') !== -1;
            if (hasAutre) {
              filteredItems = filteredItems.filter(function (i) { return i !== 'Autre'; });
            }
            filteredItems.forEach(function (item, i) {
              var div = document.createElement('div');
              div.className = 'autocomplete-item';
              div.setAttribute('role', 'option');
              div.setAttribute('id', listId + '-opt-' + i);
              div.textContent = item;
              div.addEventListener('mousedown', function (e) {
                e.preventDefault();
                selectItem(item);
              });
              list.appendChild(div);
            });
            // Ajouter « Autre »
            var autreDiv = document.createElement('div');
            autreDiv.className = 'autocomplete-item separator';
            autreDiv.setAttribute('role', 'option');
            autreDiv.setAttribute('id', listId + '-opt-autre');
            autreDiv.textContent = 'Other';
            autreDiv.addEventListener('mousedown', function (e) {
              e.preventDefault();
              selectItem('Autre');
            });
            list.appendChild(autreDiv);
            filteredItems.push('Autre');

            if (filteredItems.length > 0) {
              list.classList.add('open');
              input.setAttribute('aria-expanded', 'true');
            } else {
              list.classList.remove('open');
              input.setAttribute('aria-expanded', 'false');
            }
          }

          function selectItem(value) {
            hidden.value = value;
            input.value = value === 'Autre' ? '' : value;
            input.setCustomValidity('');
            list.classList.remove('open');
            input.setAttribute('aria-expanded', 'false');

            if (customInput) {
              customInput.style.display = 'none';
              customInput.required = false;
              customInput.value = '';
            }
            if (value === 'Autre') {
              input.focus();
              setTimeout(function() { renderList(''); }, 50);
            }
            if (opts.onSelect) opts.onSelect(value);
          }

          function setActive(index) {
            var items = list.querySelectorAll('.autocomplete-item');
            items.forEach(function (el) { el.classList.remove('active'); });
            if (index >= 0 && index < items.length) {
              items[index].classList.add('active');
              items[index].scrollIntoView({ block: 'nearest' });
              input.setAttribute('aria-activedescendant', items[index].id);
              activeIndex = index;
            } else {
              input.removeAttribute('aria-activedescendant');
              activeIndex = -1;
            }
          }

          input.addEventListener('focus', function () {
            if (!input.disabled) renderList(input.value);
          });

          input.addEventListener('input', function () {
            hidden.value = '';
            if (customInput) {
              customInput.style.display = 'none';
              customInput.required = false;
              customInput.value = '';
            }
            renderList(input.value);
          });

          input.addEventListener('keydown', function (e) {
            var total = filteredItems.length;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive(activeIndex < total - 1 ? activeIndex + 1 : 0);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive(activeIndex > 0 ? activeIndex - 1 : total - 1);
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (activeIndex >= 0 && activeIndex < total) {
                selectItem(filteredItems[activeIndex]);
              }
            } else if (e.key === 'Escape') {
              list.classList.remove('open');
              input.setAttribute('aria-expanded', 'false');
            }
          });

          input.addEventListener('blur', function () {
            // Petit délai pour permettre le clic sur un item
            setTimeout(function () {
              list.classList.remove('open');
              input.setAttribute('aria-expanded', 'false');
            }, 150);
          });

          // Exposer une méthode pour mettre à jour les items
          return {
            setItems: function (newItems) {
              items = newItems;
            },
            reset: function () {
              input.value = '';
              hidden.value = '';
              if (customInput) {
                customInput.style.display = 'none';
                customInput.required = false;
                customInput.value = '';
              }
              list.classList.remove('open');
            }
          };
        }

        // ─── Init Ville ───
        var cityNames = Object.keys(MADAGASCAR_LOCATIONS).filter(function (k) { return k !== 'Autre'; }).sort(function(a, b) { return a.localeCompare(b); });
        var quartierAc;

        var cityAc = initAutocomplete('city-input', 'city', 'city-list', cityNames, {
          customInputId: 'city-custom',
          onSelect: function (selectedCity) {
            // Reset quartier
            if (quartierAc) quartierAc.reset();
            var qInput = document.getElementById('quartier-input');
            var qCustom = document.getElementById('quartier-custom');
            qCustom.style.display = 'none';
            qCustom.required = false;
            qCustom.value = '';

            if (selectedCity === 'Autre') {
              qInput.disabled = true;
              qInput.placeholder = 'Please select a city first...';
              qInput.value = '';
              document.getElementById('quartier').value = '';
              if (quartierAc) {
                quartierAc.setItems([]);
              }
            } else {
              var quartiers = (MADAGASCAR_LOCATIONS[selectedCity] || []).slice().sort(function(a, b) { return a.localeCompare(b); });
              qInput.disabled = false;
              qInput.placeholder = 'Search for a district...';
              if (quartierAc) {
                quartierAc.setItems(quartiers);
              }
            }
          }
        });

        document.getElementById('city-input').addEventListener('input', function(e) {
          var val = e.target.value.trim();
          var qInput = document.getElementById('quartier-input');
          if (val !== '' && !MADAGASCAR_LOCATIONS[val]) {
             qInput.disabled = false;
             qInput.placeholder = 'Please type the district...';
             if (quartierAc) quartierAc.setItems([]);
          } else if (val === '') {
             qInput.disabled = true;
             qInput.placeholder = 'Please select a city first...';
             qInput.value = '';
             document.getElementById('quartier').value = '';
             if (quartierAc) quartierAc.setItems([]);
          }
        });

        // ─── Init Quartier ───
        quartierAc = initAutocomplete('quartier-input', 'quartier', 'quartier-list', [], {
          customInputId: 'quartier-custom',
          onSelect: null
        });

        // ─── Sélection par défaut : Antananarivo ───
        document.getElementById('city-input').value = 'Antananarivo';
        document.getElementById('city').value = 'Antananarivo';
        var qInputDef = document.getElementById('quartier-input');
        qInputDef.disabled = false;
        qInputDef.placeholder = 'Search for a district...';
        quartierAc.setItems((MADAGASCAR_LOCATIONS['Antananarivo'] || []).slice().sort(function(a, b) { return a.localeCompare(b); }));

        // Fermer les dropdowns au clic en dehors
        document.addEventListener('click', function (e) {
          var lists = document.querySelectorAll('.autocomplete-list');
          lists.forEach(function (l) {
            if (!l.parentElement.contains(e.target)) {
              l.classList.remove('open');
            }
          });
        });
      })();


// FAQ accordion
    function toggleFaq(btn) {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-question.open').forEach(q => {
        q.classList.remove('open');
        q.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
    }

    // ─── GESTION DE LA SOUMISSION DU FORMULAIRE DE CONTACT ───
    // Flux de soumission :
    // 1. Validation anti-spam (honeypot + délai de 3 secondes).
    // 2. Extraction et formatage des données du formulaire en un corps d'email structuré.
    // 3. Envoi via fetch() POST vers contact.php (endpoint local sur Tranokala).
    // 4. Affichage visuel du feedback (succès bouton + message encadré vert, ou fallback d'erreur).
    (function () {
      const form = document.querySelector('form.contact-form');
      if (!form) return;
      window._formLoadTime = Date.now();
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Anti-spam : honeypot
        const hp = document.getElementById('website_url');
        if (hp && hp.value !== '') return;

        // Anti-spam : soumission trop rapide (< 3 s)
        if (typeof window._formLoadTime === 'number' && (Date.now() - window._formLoadTime) < 3000) return;

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        const originalBg = btn.style.background;

        // Réinitialiser les messages d'état précédents
        const successBox = document.getElementById('contact-success-msg');
        if (successBox) successBox.style.display = 'none';
        const fallback = document.getElementById('form-fallback-msg');
        if (fallback) fallback.style.display = 'none';

        // État : envoi en cours
        btn.disabled = true;
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.7';

        try {
          // Récupération des données du formulaire
          const name = document.getElementById('name').value.trim();
          const email = document.getElementById('email').value.trim();
          const phone = document.getElementById('phone').value.trim();
          const subject = document.getElementById('subject').value;
          const propertyType = document.getElementById('propertyType').value;
          const rooms = document.getElementById('rooms').value;
          const floors = document.getElementById('floors').value;
          const area = document.getElementById('area').value.trim();
          const cityVal = document.getElementById('city').value || document.getElementById('city-input').value;
          const quartierVal = document.getElementById('quartier').value || document.getElementById('quartier-input').value;
          const cityCustom = document.getElementById('city-custom');
          const quartierCustom = document.getElementById('quartier-custom');
          const city = cityVal === 'Autre' && cityCustom && cityCustom.style.display !== 'none' ? cityCustom.value.trim() : cityVal;
          const quartier = quartierVal === 'Autre' && quartierCustom && quartierCustom.style.display !== 'none' ? quartierCustom.value.trim() : quartierVal;
          const location = quartier ? (quartier + ', ' + city) : city;
          const messageVal = document.getElementById('message').value.trim();

          const amenities = [];
          if (document.getElementById('amenity-elevator') && document.getElementById('amenity-elevator').checked) amenities.push('Ascenseur');
          if (document.getElementById('amenity-balcony') && document.getElementById('amenity-balcony').checked) amenities.push('Balcon / Terrasse');
          if (document.getElementById('amenity-garden') && document.getElementById('amenity-garden').checked) amenities.push('Jardin');
          if (document.getElementById('amenity-parking') && document.getElementById('amenity-parking').checked) amenities.push('Garage / Parking');

          // Construction du corps d'email structuré
          const mailSubject = `[Demande d'expertise] — ${subject} — ${name}`;

          let body = `Bonjour,

Une nouvelle demande d'expertise a été soumise. Voici les détails :

--- IDENTIFICATION ---
Nom complet : ${name}
Email : ${email}
Téléphone : ${phone || 'Non renseigné'}

--- MOTIF DE LA DEMANDE ---
Motif : ${subject}

--- CARACTÉRISTIQUES DU BIEN ---
Type de bien : ${propertyType}
Nombre de pièces : ${rooms}
Nombre d'étages : ${floors}
Superficie : ${area || 'Non renseignée'} ${area ? 'm²' : ''}
Commodités : ${amenities.length > 0 ? amenities.join(', ') : 'Aucune précisée'}

--- LOCALISATION ET PRÉCISIONS ---
Localisation : ${location}
Précisions :
${messageVal || 'Aucune précision supplémentaire.'}

---------------------------------
Demande générée depuis le site ExpertImmo.mg`;

          // Préparation des données pour l'endpoint PHP
          const formData = new FormData(form);
          formData.append('_subject', mailSubject);
          formData.append('message', body);
          // Honeypot anti-spam : champ honeypot vide envoyé pour vérification serveur
          const honeypotVal = document.getElementById('website_url');
          if (honeypotVal) formData.append('website_url', honeypotVal.value);

          const res = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (res.ok) {
            // État : succès bouton
            btn.textContent = '✓ Request sent successfully';
            btn.style.background = '#1D9E75';
            btn.style.opacity = '1';

            // Afficher le message d'encadré vert sous le formulaire
            if (successBox) {
              successBox.textContent = `✓ Your request has been sent. The firm will get back to you within 24 business hours at ${email}.`;
              successBox.style.display = 'block';
            }

            form.reset();

            // Reset le stepper à 0 (pièces et étages)
            const roomsInput = document.getElementById('rooms');
            if (roomsInput) roomsInput.value = '0';
            const floorsInput = document.getElementById('floors');
            if (floorsInput) floorsInput.value = '0';

            // Reset les inputs custom s'ils étaient affichés
            if (cityCustom) cityCustom.style.display = 'none';
            if (quartierCustom) quartierCustom.style.display = 'none';

            // Réinitialiser le bouton après un délai
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.background = originalBg;
              btn.disabled = false;
            }, 4000);
          } else {
            throw new Error('Server error');
          }
        } catch (err) {
          // État : erreur
          btn.textContent = '✗ Error — see message below';
          btn.style.background = '#c0392b';
          btn.style.opacity = '1';

          // Afficher le message de secours
          if (fallback) {
            fallback.textContent = 'A technical error occurred. Please contact us directly on +261 32 07 792 63 or by email at contact@expertimmo.mg';
            fallback.style.display = 'block';
          }

          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = originalBg;
            btn.disabled = false;
          }, 6000);
        }
      });
    })();

    // ═══ Normalisation du champ Superficie (virgule/point → virgule + arrondi 2 décimales) ═══
    (function() {
      const areaInput = document.getElementById('area');
      if (!areaInput) return;

      areaInput.addEventListener('blur', function() {
        let value = this.value.trim();
        if (!value) return;

        // Remplacer point par virgule
        value = value.replace('.', ',');

        // Parser et arrondir à 2 décimales
        const num = parseFloat(value.replace(',', '.'));
        if (!isNaN(num) && num > 0) {
          // Format with a decimal point (e.g. 250.50)
          this.value = num.toFixed(2);
        } else {
          // Valeur invalide → vider le champ
          this.value = '';
        }
      });
    })();

    // Staggered card animation
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transition = 'all 0.5s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.service-card, .stat-item, .banque-card').forEach(el => {
      el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
      observer.observe(el);
    });

    // Counter Animation
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const separator = el.getAttribute('data-separator') || '';
        const formatNumber = (num) => {
          if (!separator) return num;
          return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        };

        if (entry.isIntersecting) {
          const duration = 2000;
          const step = 20;
          let current = 0;

          if (el.dataset.timer) clearInterval(Number(el.dataset.timer));

          el.dataset.timer = setInterval(() => {
            current += target / (duration / step);
            if (current >= target) {
              current = target;
              clearInterval(Number(el.dataset.timer));
            }
            el.innerText = prefix + formatNumber(Math.floor(current)) + suffix;
          }, step);
        } else {
          if (el.dataset.timer) clearInterval(Number(el.dataset.timer));
          el.innerText = prefix + '0' + suffix;
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


(function(){
  var navbar=document.getElementById('navbar');
  if(navbar){
    let isScrolling = false;
    window.addEventListener('scroll', function() {
      if (!isScrolling) {
        window.requestAnimationFrame(function() {
          navbar.classList.toggle('scrolled', window.scrollY > 50);
          isScrolling = false;
        });
        isScrolling = true;
      }
    }, {passive: true});
  }
  window.toggleMobile=function(){document.getElementById('mobileMenu').classList.toggle('open');document.getElementById('hamburger').classList.toggle('open');};
  window.closeMobile=function(){document.getElementById('mobileMenu').classList.remove('open');document.getElementById('hamburger').classList.remove('open');};
  document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});});
})();