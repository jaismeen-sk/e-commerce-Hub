document.addEventListener("DOMContentLoaded", () => {
    // 1. DOM targets
    const loadStoreBtn = document.getElementById("load-store-btn");
    const productGrid = document.getElementById("product-grid");
    const wishlistContainer = document.getElementById("wishlist-container");

    // 2. State Management: Check browser local memory first, or create a clean array
    let favoriteItems = JSON.parse(localStorage.getItem("userWishlist")) || [];

    // 3. Persistent Core Engine: Renders item list and writes to disk on change
    const updateWishlistUI = () => {
        // Step A: Save current state to local storage vault
        localStorage.setItem("userWishlist", JSON.stringify(favoriteItems));

        // Step B: Re-render the visual list sidebar
        if (favoriteItems.length === 0) {
            wishlistContainer.innerHTML = "<p style='color: #666;'>No items saved yet.</p>";
            return;
        }

        wishlistContainer.innerHTML = "";
        favoriteItems.forEach(item => {
            wishlistContainer.innerHTML += `
                <div class="wishlist-item">
                    <span style="font-size: 13px; font-weight: bold;">${item.title.substring(0, 20)}...</span>
                    <button class="remove-btn" data-id="${item.id}">❌</button>
                </div>
            `;
        });
    };

    // 4. API Exploration & Data Pipeline Engine
    const fetchAndDisplayProducts = async () => {
        try {
            productGrid.innerHTML = "<p>Contacting server database...</p>";
            
            // Reaching out directly to the explored API endpoint
            const response = await fetch("https://fakestoreapi.com");
            const products = await response.json();
            
            productGrid.innerHTML = ""; // Wipe the server status string

            // Loop through live items array and construct UI grid elements
            products.forEach(product => {
                productGrid.innerHTML += `
                    <div class="card">
                        <img src="${product.image}" alt="${product.title}">
                        <h4 style="font-size: 14px; margin: 10px 0;">${product.title.substring(0, 30)}...</h4>
                        <p style="color: green; font-weight: bold;">$${product.price}</p>
                        <button class="fav-btn" data-id="${product.id}" data-title="${product.title.replace(/"/g, '&quot;')}">⭐ Favorite</button>
                    </div>
                `;
            });
        } catch (error) {
            console.error("Endpoint data fetch collapsed:", error);
            productGrid.innerHTML = "<p style='color: red;'>Failed to parse target API database.</p>";
        }
    };

    // 5. Global Event Listeners & Event Delegation Logic
    loadStoreBtn.addEventListener("click", fetchAndDisplayProducts);

    // Event Delegation: Detect button presses inside dynamic grid items
    document.body.addEventListener("click", (e) => {
        // Check if user clicked an orange favorite button
        if (e.target.classList.contains("fav-btn")) {
            const id = e.target.getAttribute("data-id");
            const title = e.target.getAttribute("data-title");

            // Prevent duplicating items already in the wishlist array
            if (!favoriteItems.some(item => item.id === id)) {
                favoriteItems.push({ id, title });
                updateWishlistUI();
            }
        }

        // Check if user clicked a red remove button in the wishlist sidebar
        if (e.target.classList.contains("remove-btn")) {
            const targetId = e.target.getAttribute("data-id");
            // Mutate state by filtering out deleted target element
            favoriteItems = favoriteItems.filter(item => item.id !== targetId);
            updateWishlistUI();
        }
    });

    // 6. Running instantly upon entry to ensure returning users see their memory arrays
    updateWishlistUI();
});