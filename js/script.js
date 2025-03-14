document.addEventListener('DOMContentLoaded', () => {
    // Menu items data with nutritional information
    const menuItems = {
        'Classic Bruschetta': {
            price: 85,
            dietary: ['vegetarian'],
            nutrition: {
                calories: 320,
                protein: 8,
                carbs: 42,
                fat: 14,
                allergens: ['gluten']
            }
        },
        'Crispy Calamari': {
            price: 120,
            dietary: [],
            nutrition: {
                calories: 450,
                protein: 24,
                carbs: 38,
                fat: 22,
                allergens: ['seafood']
            }
        },
        'Filet Mignon': {
            price: 420,
            dietary: ['gluten-free'],
            nutrition: {
                calories: 680,
                protein: 48,
                carbs: 2,
                fat: 52,
                allergens: []
            }
        },
        'Grilled Salmon': {
            price: 340,
            dietary: ['gluten-free'],
            nutrition: {
                calories: 520,
                protein: 46,
                carbs: 0,
                fat: 34,
                allergens: ['seafood']
            }
        },
        'Classic Tiramisu': {
            price: 95,
            dietary: ['vegetarian'],
            nutrition: {
                calories: 420,
                protein: 6,
                carbs: 46,
                fat: 24,
                allergens: ['dairy', 'eggs', 'gluten']
            }
        },
        'Molten Chocolate Cake': {
            price: 140,
            dietary: ['vegetarian'],
            nutrition: {
                calories: 580,
                protein: 8,
                carbs: 68,
                fat: 32,
                allergens: ['dairy', 'eggs', 'nuts', 'gluten']
            }
        }
    };

    // Shopping cart functionality
    let cart = [];
    const cartPopup = document.getElementById('cart-popup');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-amount');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Add to cart functionality
    window.addToCart = function(itemName, price, button) {
        cart.push({ name: itemName, price: price });
        updateCart();
        cartPopup.classList.add('active');

        // Add visual confirmation
        button.classList.add('added');
        button.textContent = 'Added!';
        setTimeout(() => {
            button.classList.remove('added');
            button.textContent = 'Add to Cart';
        }, 1500);
    };

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <span>${item.name}</span>
                    <div class="cart-item-actions">
                        <span class="item-price">R${item.price}</span>
                        <button onclick="removeFromCart(${index})" class="remove-item" title="Remove item">×</button>
                    </div>
                `;
                cartItems.appendChild(itemElement);
                total += item.price;
            });
        }

        cartTotal.textContent = `R${total.toFixed(2)}`;
    }

    // Remove item from cart
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCart();
        
        // Hide cart if empty
        if (cart.length === 0) {
            setTimeout(() => {
                cartPopup.classList.remove('active');
            }, 300);
        }
    };

    // Close cart popup
    closeCartBtn.addEventListener('click', () => {
        cartPopup.classList.remove('active');
    });

    // Checkout functionality
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your order! Redirecting to payment...');
            cart = [];
            updateCart();
            cartPopup.classList.remove('active');
        }
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartPopup.contains(e.target) && 
            !e.target.classList.contains('add-to-cart-btn') && 
            cartPopup.classList.contains('active')) {
            cartPopup.classList.remove('active');
        }
    });

    // Initialize cart
    updateCart();

    // Search and filter functionality
    const menuSearch = document.getElementById('menuSearch');
    const searchBtn = document.getElementById('searchBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const menuItemElements = document.querySelectorAll('.menu-item');

    function filterMenuItems() {
        const searchTerm = menuSearch.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const maxPrice = parseInt(priceRange.value);

        menuItemElements.forEach(item => {
            const itemName = item.querySelector('.item-title').textContent;
            const itemData = menuItems[itemName];
            
            const matchesSearch = itemName.toLowerCase().includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || (itemData && itemData.dietary.includes(activeFilter));
            const matchesPrice = itemData && itemData.price <= maxPrice;

            item.style.display = matchesSearch && matchesFilter && matchesPrice ? 'block' : 'none';
        });
    }

    searchBtn.addEventListener('click', filterMenuItems);
    menuSearch.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterMenuItems();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMenuItems();
        });
    });

    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
        filterMenuItems();
    });

    // Nutrition information modal
    const nutritionModal = document.getElementById('nutrition-modal');
    const nutritionContent = document.getElementById('nutrition-content');
    const closeModal = document.querySelector('.close-modal');

    function showNutritionInfo(itemName) {
        const itemData = menuItems[itemName];
        if (!itemData) return;

        const nutritionInfo = itemData.nutrition;
        const modal = document.getElementById('nutrition-modal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <span class="close-modal">&times;</span>
            <h3>Nutrition Information</h3>
            <div class="nutrition-details">
                <div class="nutrition-item">
                    <span class="label">Calories:</span>
                    <span class="value">${nutritionInfo.calories}</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Protein:</span>
                    <span class="value">${nutritionInfo.protein}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Carbs:</span>
                    <span class="value">${nutritionInfo.carbs}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Fat:</span>
                    <span class="value">${nutritionInfo.fat}g</span>
                </div>
                ${nutritionInfo.allergens ? `
                <div class="nutrition-item allergens">
                    <span class="label">Allergens:</span>
                    <span class="value">${nutritionInfo.allergens.join(', ')}</span>
                </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.add('active');
        
        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Add buttons to menu items
    menuItemElements.forEach(item => {
        const itemName = item.querySelector('.item-title').textContent;
        const itemData = menuItems[itemName];
        const itemContent = item.querySelector('.item-content');
        
        if (itemData) {
            const buttonContainer = document.createElement('div');
            buttonContainer.innerHTML = `
                <button class="add-to-cart-btn" onclick="addToCart('${itemName}', ${itemData.price}, this)">
                    Add to Cart
                </button>
                <button class="nutrition-info-btn" onclick="showNutritionInfo('${itemName}')">
                    Nutrition Info
                </button>
            `;
            itemContent.appendChild(buttonContainer);
        }
    });

    // Mobile menu accordion functionality
    const categories = document.querySelectorAll('.menu-category');
    
    if (window.innerWidth <= 768) {
        categories.forEach(category => {
            const title = category.querySelector('.category-title');
            const items = category.querySelector('.menu-items');
            
            items.style.display = 'none';
            
            title.addEventListener('click', () => {
                const isExpanded = items.style.display === 'grid';
                
                categories.forEach(cat => {
                    const catItems = cat.querySelector('.menu-items');
                    catItems.style.display = 'none';
                    cat.querySelector('.category-title').classList.remove('active');
                });
                
                items.style.display = isExpanded ? 'none' : 'grid';
                title.classList.toggle('active', !isExpanded);
            });
        });
    }

    // Daily specials rotation
    const specialsContainer = document.querySelector('.daily-specials-content');
    const specials = [
        {
            name: "Chef's Special Pasta",
            description: "Fresh homemade pasta with seasonal ingredients",
            price: "R24.99"
        },
        {
            name: "Catch of the Day",
            description: "Fresh local fish with Mediterranean herbs",
            price: "R29.99"
        },
        {
            name: "Special Risotto",
            description: "Creamy risotto with wild mushrooms",
            price: "R22.99"
        }
    ];

    let currentSpecialIndex = 0;

    function updateSpecial() {
        const special = specials[currentSpecialIndex];
        specialsContainer.innerHTML = `
            <h3>${special.name}</h3>
            <p>${special.description}</p>
            <span class="item-price">${special.price}</span>
        `;
        currentSpecialIndex = (currentSpecialIndex + 1) % specials.length;
    }

    // Update special every 5 seconds
    updateSpecial();
    setInterval(updateSpecial, 5000);

    // Image lazy loading
    const images = document.querySelectorAll('.item-image');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 50px 0px"
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Make functions available globally
    window.showNutritionInfo = showNutritionInfo;

    // Reservation System
    const reservationModal = document.getElementById('reservation-modal');
    const reservationForm = document.getElementById('reservation-form');

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(reservationForm);
        const reservation = {
            name: formData.get('name'),
            guests: formData.get('guests'),
            date: formData.get('date'),
            time: formData.get('time'),
            specialRequests: formData.get('special-requests')
        };
        
        // In a real app, this would be sent to a server
        console.log('Reservation details:', reservation);
        alert('Reservation confirmed! We look forward to seeing you.');
        reservationModal.classList.remove('active');
        reservationForm.reset();
    });

    // Reservation button functionality
    const reserveTableBtn = document.getElementById('reserve-table-btn');
    reserveTableBtn.addEventListener('click', () => {
        reservationModal.classList.add('active');
    });

    // Reviews System
    const reviewModal = document.getElementById('review-modal');
    const reviewForm = document.getElementById('review-form');
    const writeReviewBtn = document.getElementById('write-review-btn');
    const reviewsGrid = document.getElementById('reviews-grid');
    const loadMoreBtn = document.getElementById('load-more-reviews');
    const ratingStars = document.querySelectorAll('.rating-input .star');

    let currentRating = 0;

    // Sample reviews data (in a real app, this would come from a server)
    const sampleReviews = [
        {
            name: 'John D.',
            date: '2025-03-10',
            rating: 5,
            title: 'Amazing experience!',
            text: 'The food was absolutely delicious and the service was impeccable.'
        },
        {
            name: 'Sarah M.',
            date: '2025-03-08',
            rating: 4,
            title: 'Great atmosphere',
            text: 'Lovely ambiance and excellent menu selection. Will definitely return.'
        }
    ];

    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
            <h4 class="review-title">${review.title}</h4>
            <p class="review-text">${review.text}</p>
        `;
        return card;
    }

    // Initialize reviews
    sampleReviews.forEach(review => {
        reviewsGrid.appendChild(createReviewCard(review));
    });

    writeReviewBtn.addEventListener('click', () => {
        reviewModal.classList.add('active');
    });

    // Star rating functionality
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(rating);
        });

        star.addEventListener('mouseout', () => {
            highlightStars(currentRating);
        });

        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.rating);
            highlightStars(currentRating);
        });
    });

    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.toggle('active', starRating <= rating);
        });
    }

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentRating) {
            alert('Please select a rating');
            return;
        }

        const newReview = {
            name: document.getElementById('reviewer-name').value,
            date: new Date().toISOString().split('T')[0],
            rating: currentRating,
            title: document.getElementById('review-title').value,
            text: document.getElementById('review-text').value
        };

        // In a real app, this would be sent to a server
        reviewsGrid.insertBefore(createReviewCard(newReview), reviewsGrid.firstChild);
        reviewModal.classList.remove('active');
        reviewForm.reset();
        currentRating = 0;
        highlightStars(0);
    });

    // Social Share functionality
    function shareMenu(platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Check out this amazing restaurant menu!');
        let shareUrl;

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${text}%20${url}`;
                break;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    // Make function available globally
    window.shareMenu = shareMenu;

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === reservationModal || e.target === reviewModal) {
            e.target.classList.remove('active');
        }
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
        (prefersDarkScheme.matches ? 'dark' : 'light');

    // Apply saved theme on load
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }

    // Toggle theme
    darkModeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    // Photo Gallery
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    let currentImageIndex = 0;

    // Sample gallery images (in a real app, this would come from a server)
    const galleryImages = [
        { src: 'images/gallery1.jpg', alt: 'Signature Pasta' },
        { src: 'images/gallery2.jpg', alt: 'Fresh Seafood' },
        { src: 'images/gallery3.jpg', alt: 'Grilled Steak' },
        { src: 'images/gallery4.jpg', alt: 'Dessert Platter' },
        { src: 'images/gallery5.jpg', alt: 'Wine Selection' },
        { src: 'images/gallery6.jpg', alt: 'Chef Special' }
    ];

    // Create gallery items
    galleryImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
        item.addEventListener('click', () => openGalleryModal(index));
        galleryGrid.appendChild(item);
    });

    function openGalleryModal(index) {
        currentImageIndex = index;
        updateModalImage();
        galleryModal.classList.add('active');
    }

    function updateModalImage() {
        const image = galleryImages[currentImageIndex];
        modalImg.src = image.src;
        modalImg.alt = image.alt;
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModalImage();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateModalImage();
    });

    // Close gallery modal when clicking outside
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.classList.remove('active');
        }
    });

    // Keyboard navigation for gallery
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                prevBtn.click();
                break;
            case 'ArrowRight':
                nextBtn.click();
                break;
            case 'Escape':
                galleryModal.classList.remove('active');
                break;
        }
    });

    // Make functions available globally
    window.shareMenu = shareMenu;
});
