// Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add active navigation state
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Back to Top functionality
        const backToTopButton = document.querySelector('.back-to-top');

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Scroll to top function
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Contact Form Handling with Formspree
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const form = this;
            const formData = new FormData(form);
            const submitBtn = form.querySelector('.submit-btn');
            const formStatus = document.getElementById('formStatus');
            const originalText = submitBtn.textContent;
            
            // Basic validation
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit to Formspree
            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    const successMsg = translations[currentLanguage]?.thank_you_msg || '✅ Thank you! Your message has been sent successfully. We\'ll respond within 24 hours.';
                    showFormMessage(successMsg, 'success');
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwnProperty.call(data, 'errors')) {
                            showFormMessage('❌ There was a problem submitting your form: ' + data["errors"].map(error => error["message"]).join(", "), 'error');
                        } else {
                            showFormMessage('❌ Oops! There was a problem submitting your form. Please try again.', 'error');
                        }
                    });
                }
            }).catch(error => {
                showFormMessage('❌ Network error. Please check your connection and try again.', 'error');
            }).finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });

        // Helper function to show form messages
        function showFormMessage(message, type) {
            const formStatus = document.getElementById('formStatus');
            formStatus.textContent = message;
            formStatus.className = `form-status ${type}`;
            formStatus.style.display = 'block';
            
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 8000);
        }

        // Mobile menu functionality - ensure DOM is loaded
        function initMobileMenu() {
            console.log('Initializing mobile menu...');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            const navLinks = document.querySelector('.nav-links');
            
            if (!mobileToggle) {
                console.error('Mobile menu toggle not found!');
                return;
            }
            
            if (!navLinks) {
                console.error('Nav links not found!');
                return;
            }
            
            console.log('Mobile menu elements found, adding event listeners');
            
            mobileToggle.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Mobile menu clicked!');
                
                navLinks.classList.toggle('active');
                mobileToggle.classList.toggle('active');
                
                console.log('Active class toggled. Nav links has active:', navLinks.classList.contains('active'));
            });

            // Close mobile menu when clicking on nav links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    console.log('Mobile menu closed');
                });
            });
        }

        // Initialize mobile menu after DOM loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMobileMenu);
        } else {
            initMobileMenu();
        }

        // Function to close mobile menu
        function closeMobileMenu() {
            const navLinks = document.querySelector('.nav-links');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (navLinks && mobileToggle) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                console.log('Mobile menu closed via close button');
            }
        }

        // Lightbox Functionality
        function openLightbox(imageSrc, title, description) {
            try {
                const modal = document.getElementById('lightboxModal');
                const image = document.getElementById('lightboxImage');
                const titleEl = document.getElementById('lightboxTitle');
                const descEl = document.getElementById('lightboxDescription');
                
                if (!modal || !image || !titleEl || !descEl) {
                    console.error('Lightbox elements not found');
                    return;
                }
                
                image.src = imageSrc;
                image.alt = title;
                titleEl.textContent = title;
                descEl.textContent = description;
                
                // Show the modal
                modal.classList.add('show');
                
                // Prevent body scroll when lightbox is open
                document.body.style.overflow = 'hidden';
            } catch (error) {
                console.error('Error opening lightbox:', error);
            }
        }

        function closeLightbox() {
            try {
                const modal = document.getElementById('lightboxModal');
                
                if (!modal) {
                    console.error('Lightbox modal not found');
                    return;
                }
                
                // Hide the modal
                modal.classList.remove('show');
                
                // Restore body scroll
                document.body.style.overflow = 'auto';
            } catch (error) {
                console.error('Error closing lightbox:', error);
            }
        }

        // Close lightbox with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Test map clickability after page load
        function testMapClickability() {
            console.log('Testing map clickability...');
            const mapContainer = document.querySelector('.map-container');
            const iframe = document.querySelector('.map-container iframe');
            
            if (mapContainer && iframe) {
                console.log('Map container found:', mapContainer);
                console.log('Map container styles:', window.getComputedStyle(mapContainer));
                console.log('Iframe found:', iframe);
                console.log('Iframe styles:', window.getComputedStyle(iframe));
                
                // Force all interactive styles
                mapContainer.style.pointerEvents = 'auto';
                mapContainer.style.position = 'relative';
                mapContainer.style.zIndex = '1000';
                
                iframe.style.pointerEvents = 'auto';
                iframe.style.position = 'relative';
                iframe.style.zIndex = '1001';
                iframe.style.touchAction = 'manipulation';
                
                console.log('Map interactivity forced');
            } else {
                console.error('Map elements not found');
            }
        }

        // Run map test after page loads
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(testMapClickability, 1000);
        });

        // Multi-language support system
        const translations = {
            en: {
                tel: 'Tel:',
                cel: 'Cell:',
                facebook: 'Facebook Page:',
                company: '🏢 COMPANY',
                philosophy: '💡 PHILOSOPHY', 
                products: '📦 PRODUCTS',
                machines: '⚙️ MACHINES',
                contact: '📞 CONTACT',
                hero_title: 'MANUFACTURING EXCELLENCE',
                hero_subtitle: 'PEZA registered manufacturer of rubber parts, molds parts, tubes and their components.',
                years_experience: 'Years Experience',
                iso_certified: '9001:2015 Certified',
                parts_monthly: 'Parts Monthly',
                section_about: 'COMPANY INFORMATION',
                section_philosophy: 'CORPORATE PHILOSOPHY',
                section_products: 'PRODUCT PORTFOLIO',
                section_machines: 'MANUFACTURING FACILITIES',
                section_contact: 'CONTACT INFORMATION',
                send_message: '📧 Send us a Message',
                location: '📍 Location',
                your_name: 'Your Name',
                email: 'Email',
                subject: 'Subject',
                your_message: 'Your Message',
                send_btn: 'Send Message',
                thank_you_msg: '✅ Thank you! Your message has been sent successfully. We\'ll respond within 24 hours.',
                manufacturing_facility: 'Manufacturing Facility:',
                production_ready: 'Production Ready',
                vision_title: 'VISION',
                mission_title: 'MISSION',
                quality_policy_title: 'QUALITY POLICY',
                vision_text: 'To be the No. 1 company that manufactures rubber parts, mold parts and tubes, while giving importance to the welfare and moral standards of the members of our organization. Our fundamental principle is "the members\' concerted efforts bring out the best."',
                mission_text: 'Our company will produce excellent products and the fulfillment of customers\' wishes and great satisfaction as our priority.',
                quality_heart: 'QUALITY IS THE HEART OF OUR BUSINESS.',
                quality_text1: 'Wakorepco is committed to provide rubber parts, mold parts and tubes that satisfy our customers and adhere to all other applicable requirements.',
                quality_text2: 'We shall endeavor to provide quality products and services by ensuring conformance to established Quality Management System.',
                quality_text3: 'We shall work as a team, support the organization\'s strategic direction through our Quality Objectives, assess performance, and strive towards continual improvement and learning.',
                our_journey_title: 'Our Journey',
                company_establishment: 'Company Establishment:',
                company_establishment_text: 'Wakorepco Manufacturing Philippines Corporation was established on April 1, 2004 and registered with the Philippine Economic Zone Authority on April 14, 2004.',
                major_stockholders: 'The company is a joint venture of <a href="https://www.wakoseisakusyo.jp/" target="_blank" rel="noopener noreferrer">Wako Manufacturing Co., Ltd.</a> of Japan and Ryonan Electric Philippines Corporation, a manufacturer of automotive wire harness located at the Laguna Technopark, Binan, Laguna.',
                initial_operations: 'Initial Operations:',
                initial_operations_text: 'Started business operation on July 1, 2004 with only one (1) Machine Operator/Inspector, acquiring a total leased area of 306 square meters at Ryonan Electric Philippines Corporation. In October, began exporting to our mother company in Japan, Wako Manufacturing Co., Ltd.',
                first_expansion: 'First Expansion:',
                first_expansion_text: 'In January, Wakorepco occupied an additional 385 square meters of Ryonan property for office and production operations as order volumes increased.',
                new_facility: 'New Facility:',
                new_facility_text: 'Groundbreaking ceremony for Wakorepco\'s dedicated building at Phase 6 was held on January 17. From July to October, successful transition and consolidation of operations from two previous sites while maintaining uninterrupted customer service.',
                current_operations: 'Current Operations:',
                current_operations_text: 'Today, Wakorepco operates with 117 direct employees, producing an average of 41,132 pieces of rubber and mold parts daily, plus 14,192 meters of tube (as of 1st half of 2025).',
                our_products_title: 'OUR PRODUCTS',
                thermoplastic_rubber: 'Thermoplastic Rubber',
                thermoplastic_rubber_desc: 'High-quality thermoplastic rubber components for automotive and industrial applications',
                cr_nbr_rubber: 'CR, NBR Rubber',
                cr_nbr_rubber_desc: 'Chloroprene and Nitrile rubber parts with excellent chemical resistance',
                silicone_rubber: 'Silicone Rubber',
                silicone_rubber_desc: 'Temperature-resistant silicone rubber components for demanding applications',
                epdm_rubber: 'EPDM Rubber',
                epdm_rubber_desc: 'Weather-resistant EPDM rubber parts for outdoor and automotive use',
                pvc_tubes: 'PVC Tubes',
                pvc_tubes_desc: 'Flexible PVC tubing in various colors and specifications',
                phenolic_resin: 'Phenolic Resin Parts',
                phenolic_resin_desc: 'High-temperature resistant phenolic resin components for industrial machinery',
                engineering_plastics: 'Engineering Plastics',
                engineering_plastics_desc: 'PPS, PBT, and Nylon components for automotive and electronic applications',
                nav_company: '🏢 COMPANY',
                nav_philosophy: '💡 PHILOSOPHY', 
                nav_products: '📦 PRODUCTS',
                nav_machines: '⚙️ MACHINES',
                nav_contact: '📞 CONTACT'
            },
            ja: {
                tel: '電話:',
                cel: '携帯:',
                facebook: 'Facebookページ:',
                company: '🏢 会社情報',
                philosophy: '💡 企業理念',
                products: '📦 製品情報',
                machines: '⚙️ 製造設備',
                contact: '📞 お問い合わせ',
                hero_title: '製造業の卓越性',
                hero_subtitle: 'PEZA登録のゴム部品、金型部品、チューブおよびその部品の製造業者',
                years_experience: '年の実績',
                iso_certified: '9001:2015認証取得',
                parts_monthly: '月間生産部品数',
                section_about: '会社情報',
                section_philosophy: '企業理念',
                section_products: '製品ポートフォリオ',
                section_machines: '製造施設',
                section_contact: 'お問い合わせ',
                send_message: '📧 メッセージを送る',
                location: '📍 所在地',
                your_name: 'お名前',
                email: 'メールアドレス',
                subject: '件名',
                your_message: 'メッセージ内容',
                send_btn: '送信',
                thank_you_msg: '✅ ありがとうございます！メッセージを正常に送信いたしました。24時間以内にご返答いたします。',
                manufacturing_facility: '製造施設:',
                production_ready: '生産準備完了',
                vision_title: 'ビジョン',
                mission_title: 'ミッション',
                quality_policy_title: '品質方針',
                vision_text: 'ゴム部品、金型部品、チューブの製造において第一位の企業となり、組織メンバーの福祉と道徳的水準を重視します。我々の基本原則は「メンバーの協力した努力が最高の成果をもたらす」です。',
                mission_text: '当社は優秀な製品を生産し、顧客の願いの実現と大きな満足を最優先とします。',
                quality_heart: '品質は我々のビジネスの心臓部です。',
                quality_text1: 'Wakorepcoは、お客様を満足させ、その他すべての適用要求事項を遵守するゴム部品、金型部品、チューブの提供をお約束します。',
                quality_text2: '確立された品質マネジメントシステムへの適合を確実にすることにより、品質の高い製品とサービスを提供するよう努めます。',
                quality_text3: 'チームとして働き、品質目標を通じて組織の戦略的方向性を支援し、パフォーマンスを評価し、継続的改善と学習に向けて努力します。',
                our_journey_title: '我々の歩み',
                company_establishment: '会社設立:',
                company_establishment_text: 'Wakorepco Manufacturing Philippines Corporationは2004年4月1日に設立され、2004年4月14日にフィリピン経済特区庁に登録されました。',
                major_stockholders: '当社は日本の<a href="https://www.wakoseisakusyo.jp/" target="_blank" rel="noopener noreferrer">Wako Manufacturing Co., Ltd.</a>とラグナ州ビニャンのラグナテクノパークに所在する自動車ワイヤーハーネスメーカーであるRyonan Electric Philippines Corporationの合弁会社です。',
                initial_operations: '初期事業:',
                initial_operations_text: '2004年7月1日、機械オペレーター/検査員1名のみで事業を開始し、Ryonan Electric Philippines Corporationで306平方メートルの賃貸面積を取得。10月には日本の母会社Wako Manufacturing Co., Ltd.への輸出を開始。',
                first_expansion: '第一次拡張:',
                first_expansion_text: '1月、受注量の増加により、ワコレプコはオフィスと生産業務のためにRyonan物件の追加385平方メートルを占有しました。',
                new_facility: '新施設:',
                new_facility_text: 'フェーズ6でのワコレプコ専用建物の起工式が1月17日に開催されました。7月から10月まで、中断のない顧客サービスを維持しながら、以前の2つのサイトからの業務の成功した移行と統合を実施。',
                current_operations: '現在の事業:',
                current_operations_text: '現在、ワコレプコは117名の直接従業員で運営し、日平均41,132個のゴム・金型部品と14,192メートルのチューブを生産しています（2025年上半期時点）。',
                our_products_title: '製品情報',
                thermoplastic_rubber: '熱可塑性ゴム',
                thermoplastic_rubber_desc: '自動車・産業用途向けの高品質熱可塑性ゴム部品',
                cr_nbr_rubber: 'CR・NBRゴム',
                cr_nbr_rubber_desc: '優れた耐薬品性を持つクロロプレン・ニトリルゴム部品',
                silicone_rubber: 'シリコンゴム',
                silicone_rubber_desc: '要求の厳しい用途向けの耐温度性シリコンゴム部品',
                epdm_rubber: 'EPDMゴム',
                epdm_rubber_desc: '屋外・自動車用途向けの耐候性EPDMゴム部品',
                pvc_tubes: 'PVCチューブ',
                pvc_tubes_desc: '様々な色と仕様の柔軟なPVCチューブ',
                phenolic_resin: 'フェノール樹脂部品',
                phenolic_resin_desc: '産業機械向けの高温耐性フェノール樹脂部品',
                engineering_plastics: 'エンジニアリングプラスチック',
                engineering_plastics_desc: '自動車・電子機器向けのPPS、PBT、ナイロン部品',
                nav_company: '🏢 会社情報',
                nav_philosophy: '💡 企業理念',
                nav_products: '📦 製品情報', 
                nav_machines: '⚙️ 製造設備',
                nav_contact: '📞 お問い合わせ'
            }
        };

        // Current language state
        let currentLanguage = 'en';

        // Function to switch language
        function switchLanguage(lang) {
            console.log('Switching to language:', lang);
            currentLanguage = lang;
            
            // Update active button
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-lang') === lang) {
                    btn.classList.add('active');
                }
            });
            
            // Update all translatable elements
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[lang] && translations[lang][key]) {
                    element.innerHTML = translations[lang][key];
                }
            });
            
            // Update form placeholders and labels
            updateFormTranslations(lang);
            
            // Store language preference
            localStorage.setItem('wakorepco_language', lang);
            
            console.log('Language switched to:', lang);
        }

        // Function to update form translations
        function updateFormTranslations(lang) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email'); 
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const submitBtn = document.querySelector('.submit-btn');
            
            if (lang === 'ja') {
                if (nameInput) nameInput.placeholder = 'お名前を入力してください';
                if (emailInput) emailInput.placeholder = 'メールアドレスを入力してください';
                if (subjectInput) subjectInput.placeholder = '件名を入力してください';
                if (messageInput) messageInput.placeholder = 'お問い合わせ内容、製品仕様のご要望、製造サービスに関するご質問などをご記入ください...';
                if (submitBtn) submitBtn.textContent = '送信';
            } else {
                if (nameInput) nameInput.placeholder = 'Enter your name';
                if (emailInput) emailInput.placeholder = 'Enter your email';
                if (subjectInput) subjectInput.placeholder = 'Enter subject';
                if (messageInput) messageInput.placeholder = 'Please describe your inquiry, product specifications needed, or any questions you have about our manufacturing services...';
                if (submitBtn) submitBtn.textContent = 'Send Message';
            }
        }

        // Initialize language system
        function initLanguageSystem() {
            // Load saved language preference
            const savedLang = localStorage.getItem('wakorepco_language') || 'en';
            switchLanguage(savedLang);
        }

        // Initialize language system after DOM loads
        document.addEventListener('DOMContentLoaded', function() {
            initLanguageSystem();
        });