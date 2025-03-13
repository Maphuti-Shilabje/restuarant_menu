document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu accordion functionality
    const categories = document.querySelectorAll('.menu-category');
    
    if (window.innerWidth <= 768) {
        categories.forEach(category => {
            const title = category.querySelector('.category-title');
            const items = category.querySelector('.menu-items');
            
            // Initially hide menu items on mobile
            items.style.display = 'none';
            
            title.addEventListener('click', () => {
                const isExpanded = items.style.display === 'grid';
                
                // Close all other categories
                categories.forEach(cat => {
                    const catItems = cat.querySelector('.menu-items');
                    catItems.style.display = 'none';
                    cat.querySelector('.category-title').classList.remove('active');
                });
                
                // Toggle current category
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
});
