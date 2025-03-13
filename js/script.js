document.addEventListener('DOMContentLoaded', () => {
    // Menu items data with nutritional information
    const menuItems = {
        'Classic Bruschetta': {
            price: 12,
            dietary: ['vegetarian'],
            nutrition: {
                calories: 320,
                protein: '8g',
                carbs: '42g',
                fat: '14g',
                allergens: ['gluten']
            }
        },
        'Crispy Calamari': {
            price: 16,
            dietary: [],
            nutrition: {
                calories: 450,
                protein: '22g',
                carbs: '38g',
                fat: '24g',
                allergens: ['seafood']
            }
        },
        'Filet Mignon': {
            price: 42,
            dietary: ['gluten-free'],
            nutrition: {
                calories: 680,
                protein: '48g',
                carbs: '2g',
                fat: '52g',
                allergens: []
            }
        },
        'Grilled Salmon': {
            price: 34,
            dietary: ['gluten-free'],
            nutrition: {
                calories: 520,
                protein: '46g',
                carbs: '0g',
                fat: '34g',
                allergens: ['seafood']
            }
        },
        'Classic Tiramisu': {
            price: 12,
            dietary: ['vegetarian'],
            nutrition: {
                calories: 420,
                protein: '6g',
                carbs: '46g',
                fat: '24g',
                allergens: ['dairy', 'eggs', 'gluten']
            }
        },
        'Molten Chocolate Cake': {
            price: 14,
            dietary: ['vegetarian'],
            nutrition: {
                calories: 580,
                protein: '8g',
                carbs: '68g',
                fat: '32g',
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
    function addToCart(itemName, price) {
        cart.push({ name: itemName, price: price });
        updateCart();
        cartPopup.classList.add('active');
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <div>
                    <span>$${item.price}</span>
                    <button onclick="removeFromCart(${index})" class="remove-item">×</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
            total += item.price;
        });

        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Remove item from cart
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCart();
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

        const nutrition = itemData.nutrition;
        nutritionContent.innerHTML = `
            <h4>${itemName}</h4>
            <div class="nutrition-details">
                <p><strong>Calories:</strong> ${nutrition.calories}</p>
                <p><strong>Protein:</strong> ${nutrition.protein}</p>
                <p><strong>Carbohydrates:</strong> ${nutrition.carbs}</p>
                <p><strong>Fat:</strong> ${nutrition.fat}</p>
                <p><strong>Allergens:</strong> ${nutrition.allergens.length ? nutrition.allergens.join(', ') : 'None'}</p>
            </div>
        `;
        nutritionModal.classList.add('active');
    }

    closeModal.addEventListener('click', () => {
        nutritionModal.classList.remove('active');
    });

    // Add buttons to menu items
    menuItemElements.forEach(item => {
        const itemName = item.querySelector('.item-title').textContent;
        const itemData = menuItems[itemName];
        const itemContent = item.querySelector('.item-content');
        
        if (itemData) {
            const buttonContainer = document.createElement('div');
            buttonContainer.innerHTML = `
                <button class="add-to-cart-btn" onclick="addToCart('${itemName}', ${itemData.price})">
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
            price: "$24.99"
        },
        {
            name: "Catch of the Day",
            description: "Fresh local fish with Mediterranean herbs",
            price: "$29.99"
        },
        {
            name: "Special Risotto",
            description: "Creamy risotto with wild mushrooms",
            price: "$22.99"
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

    // Make showNutritionInfo available globally
    window.showNutritionInfo = showNutritionInfo;
});
