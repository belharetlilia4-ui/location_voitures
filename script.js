document.addEventListener('DOMContentLoaded', function() {
    // ===================== MOBILE MENU TOGGLE =====================
    const nav = document.querySelector('nav');
    const menu = document.querySelector('.menu');
    if (nav && menu) {
        const menuToggle = nav.querySelector('.menu-toggle') || document.createElement('button');
        menuToggle.type = 'button';
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        if (!menuToggle.parentElement) nav.appendChild(menuToggle);

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash || '#home';
        document.querySelectorAll('.menu a').forEach(link => {
            const href = link.getAttribute('href') || '';
            const linkPage = href.split('#')[0] || 'index.html';
            const linkHash = href.includes('#') ? `#${href.split('#')[1]}` : '';
            if (
                (linkPage === currentPage && (!linkHash || linkHash === currentHash)) ||
                (currentPage === 'index.html' && href.startsWith('#') && href === currentHash)
            ) {
                link.classList.add('active');
            }
        });

        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            this.setAttribute('aria-label', menu.classList.contains('active') ? 'Fermer le menu' : 'Ouvrir le menu');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
                menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
            });
        });
    }
    
    // ===================== SEARCH FORM VALIDATION =====================
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        // Set minimum dates for search form
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pickupDate').min = today;
        document.getElementById('returnDate').min = today;
        
        // Update return date min when pickup date changes
        document.getElementById('pickupDate').addEventListener('change', function() {
            document.getElementById('returnDate').min = this.value;
        });
        
        // Search form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pickupLocation = this.querySelector('input[type="text"]').value.trim();
            const pickupDate = document.getElementById('pickupDate').value;
            const returnDate = document.getElementById('returnDate').value;
            
            if (!pickupLocation || !pickupDate || !returnDate) {
                alert('Veuillez remplir le lieu et les dates.');
                return;
            }
            
            if (new Date(returnDate) <= new Date(pickupDate)) {
                alert('La date de retour doit etre apres la date de prise en charge.');
                return;
            }

            const query = new URLSearchParams({
                cat: 'citadine',
                lieu: pickupLocation,
                debut: pickupDate,
                fin: returnDate
            });
            window.location.href = `vehicules.html?${query.toString()}`;
        });
    }
    
    //  SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's the services link (handled separately)
            if (this.getAttribute('href') === '#services') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
    
    // Handle anchor links from other pages
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            setTimeout(() => {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            alert(`Thank you for subscribing with ${email}!`);
            this.reset();
        });
    });

    // ===================== SERVICE DETAILS =====================
    const serviceDetails = document.getElementById('serviceDetails');
    const serviceButtons = document.querySelectorAll('.service-card-btn');
    const serviceContent = {
        airport: {
            kicker: 'Accueil aeroport',
            title: "Prise en charge a l'aeroport",
            badge: 'Service prioritaire',
            visualIcon: 'fa-plane-arrival',
            ideal: 'Voyageurs, familles, clients business et arrivees tardives',
            description: "Un service pense pour commencer ou terminer votre trajet sans stress. Notre equipe organise le point de rendez-vous, suit votre heure d'arrivee et vous remet le vehicule rapidement avec une assistance claire.",
            stats: [
                { value: '24/7', label: 'arrivees possibles' },
                { value: '15 min', label: 'remise express' },
                { value: '0 stress', label: 'vol suivi' }
            ],
            steps: [
                'Vous indiquez votre vol et votre terminal.',
                'Nous preparons le vehicule avant votre atterrissage.',
                'Vous recuperez les cles et partez directement.'
            ],
            options: [
                { icon: 'fa-location-dot', title: 'Rendez-vous terminal', text: "Accueil au terminal indique avec confirmation du lieu exact avant l'arrivee." },
                { icon: 'fa-suitcase-rolling', title: 'Assistance bagages', text: 'Aide pour charger vos valises et installer les passagers confortablement.' },
                { icon: 'fa-clock', title: 'Suivi du vol', text: "Adaptation de l'horaire en cas de retard ou d'avance de votre avion." },
                { icon: 'fa-key', title: 'Remise express', text: 'Controle rapide du vehicule, signature simplifiee et depart en quelques minutes.' },
                { icon: 'fa-child-reaching', title: 'Equipements famille', text: 'Siege enfant, rehausseur ou espace bagages prepare sur demande.' },
                { icon: 'fa-right-left', title: 'Retour aeroport', text: "Depot du vehicule directement a l'aeroport a la fin de votre location." }
            ]
        },
        longue: {
            kicker: 'Formule flexible',
            title: 'Location Longue Duree',
            badge: 'Budget maitrise',
            visualIcon: 'fa-route',
            ideal: 'Etudiants, familles, missions longues et besoins temporaires',
            description: "Une solution pratique pour disposer d'une voiture plusieurs semaines ou plusieurs mois, avec un budget maitrise et des conditions adaptees a votre rythme.",
            stats: [
                { value: '-20%', label: 'sur longues durees' },
                { value: '1-12', label: 'mois flexibles' },
                { value: '100%', label: 'entretien suivi' }
            ],
            steps: [
                'Vous choisissez la categorie et la duree souhaitee.',
                'Nous proposons une formule claire avec options.',
                'Vous roulez longtemps avec un suivi regulier.'
            ],
            options: [
                { icon: 'fa-calendar-days', title: 'Contrats mensuels', text: 'Choisissez une duree de 1, 3, 6 ou 12 mois selon votre besoin.' },
                { icon: 'fa-tags', title: 'Tarifs degressifs', text: 'Prix plus avantageux lorsque la duree de location augmente.' },
                { icon: 'fa-screwdriver-wrench', title: 'Entretien inclus', text: 'Maintenance periodique organisee pour garder le vehicule en excellent etat.' },
                { icon: 'fa-shield-halved', title: 'Assurance adaptee', text: 'Couverture claire avec options de protection selon votre usage.' },
                { icon: 'fa-repeat', title: 'Changement possible', text: 'Possibilite de changer de categorie si vos besoins evoluent.' },
                { icon: 'fa-file-invoice', title: 'Paiement simple', text: 'Facturation reguliere et lisible pour mieux suivre votre budget.' }
            ]
        },
        entreprise: {
            kicker: 'Mobilite professionnelle',
            title: 'Programme Entreprise',
            badge: 'Solution pro',
            visualIcon: 'fa-briefcase',
            ideal: 'PME, agences, commerciaux, equipes terrain et dirigeants',
            description: "Un accompagnement dedie aux societes, independants et equipes en mission. Vous gagnez du temps avec des reservations prioritaires, une gestion centralisee et une facturation professionnelle.",
            stats: [
                { value: '1', label: 'facture globale' },
                { value: 'VIP', label: 'support prioritaire' },
                { value: '4', label: 'categories flotte' }
            ],
            steps: [
                'Creation du compte entreprise et des conducteurs.',
                'Reservation rapide selon les missions prevues.',
                'Suivi des locations avec facture centralisee.'
            ],
            options: [
                { icon: 'fa-building', title: 'Compte societe', text: 'Un profil entreprise pour centraliser les reservations et les contacts.' },
                { icon: 'fa-users', title: 'Conducteurs multiples', text: 'Ajoutez plusieurs collaborateurs autorises a utiliser les vehicules.' },
                { icon: 'fa-receipt', title: 'Facture mensuelle', text: 'Regroupement des locations sur une facture claire et facile a traiter.' },
                { icon: 'fa-headset', title: 'Support prioritaire', text: 'Reponses plus rapides pour les demandes urgentes et les missions importantes.' },
                { icon: 'fa-car-side', title: 'Flotte sur mesure', text: 'Citadines, SUV, berlines ou utilitaires selon les besoins de vos equipes.' },
                { icon: 'fa-chart-line', title: 'Suivi des depenses', text: 'Vision plus precise des couts de mobilite par mission ou par equipe.' }
            ]
        },
        cadeaux: {
            kicker: 'Experience a offrir',
            title: 'Cheques Cadeaux',
            badge: 'Cadeau premium',
            visualIcon: 'fa-gift',
            ideal: 'Anniversaires, mariages, surprises, recompenses et passionnes auto',
            description: "Une idee cadeau elegante pour offrir une journee de conduite, un week-end premium ou une experience automobile memorable, avec une reservation simple pour le beneficiaire.",
            stats: [
                { value: '100%', label: 'personnalisable' },
                { value: '12 mois', label: 'validite possible' },
                { value: '1 clic', label: 'a offrir' }
            ],
            steps: [
                'Vous choisissez le montant ou le type d experience.',
                'Nous preparons une carte cadeau personnalisee.',
                'Le beneficiaire reserve le vehicule qui lui plait.'
            ],
            options: [
                { icon: 'fa-gift', title: 'Montant au choix', text: 'Selectionnez une valeur adaptee a votre budget et au type de vehicule vise.' },
                { icon: 'fa-envelope-open-text', title: 'Carte personnalisee', text: 'Ajoutez un message personnel pour rendre le cadeau plus special.' },
                { icon: 'fa-calendar-check', title: 'Date flexible', text: 'Le beneficiaire choisit lui-meme le moment ideal pour reserver.' },
                { icon: 'fa-gauge-high', title: 'Vehicules premium', text: 'Acces possible aux berlines, SUV ou modeles prestige selon le montant.' },
                { icon: 'fa-user-check', title: 'Reservation accompagnee', text: 'Notre equipe guide le beneficiaire jusqu a la confirmation finale.' },
                { icon: 'fa-hourglass-half', title: 'Validite etendue', text: 'Une periode d utilisation confortable pour profiter du cadeau sans pression.' }
            ]
        }
    };

    function renderServiceDetails(serviceKey) {
        if (!serviceDetails || !serviceContent[serviceKey]) return;
        const item = serviceContent[serviceKey];
        serviceDetails.style.display = 'block';
        serviceDetails.innerHTML = `
            <div class="service-spotlight">
                <div class="service-visual" aria-hidden="true">
                    <span class="service-visual-ring"></span>
                    <i class="fas ${item.visualIcon}"></i>
                </div>
                <div class="service-details-header">
                    <span class="service-details-kicker"><i class="fas fa-circle-info"></i>${item.kicker}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="service-ideal">
                        <i class="fas fa-bullseye"></i>
                        <span>Ideal pour : ${item.ideal}</span>
                    </div>
                </div>
                <div class="service-badge-card">
                    <span>${item.badge}</span>
                    <strong>Prime Ride</strong>
                    <small>Service organise avec confirmation avant depart</small>
                </div>
            </div>
            <div class="service-stats">
                ${item.stats.map(stat => `
                    <div class="service-stat">
                        <strong>${stat.value}</strong>
                        <span>${stat.label}</span>
                    </div>
                `).join('')}
            </div>
            <div class="service-flow">
                <h4>Comment ca marche ?</h4>
                <div class="service-flow-grid">
                    ${item.steps.map((step, index) => `
                        <div class="service-step">
                            <span>${index + 1}</span>
                            <p>${step}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="service-options-grid">
                ${item.options.map(option => `
                    <div class="service-option">
                        <i class="fas ${option.icon}"></i>
                        <h4>${option.title}</h4>
                        <p>${option.text}</p>
                    </div>
                `).join('')}
            </div>
            <div class="service-cta-row">
                <a class="service-cta-main" href="vehicules.html">Voir les vehicules</a>
                <a class="service-cta-secondary" href="contact.html">Demander ce service</a>
            </div>
        `;
    }

    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            serviceButtons.forEach(item => {
                item.classList.remove('active');
                item.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            renderServiceDetails(this.dataset.service);
        });
    });

    if (serviceDetails) {
        serviceDetails.style.display = 'none';
    }
});

