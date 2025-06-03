// Pixel Art Gallery JavaScript
class PixelGallery {
    constructor() {
        this.artworks = [];
        this.currentView = 'random';
        this.currentRandomIndex = 0;
        this.currentModalIndex = 0;
        this.modalArtworks = [];
        this.isCompactView = false;
        
        this.init();
    }

    async init() {
        await this.loadArtworks();
        this.setupEventListeners();
        this.showRandomArtwork();
    }

    async loadArtworks() {
        try {
            const response = await fetch('data/artworks.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.artworks = data.artworks;
        } catch (error) {
            console.error('Failed to load artworks:', error);
            this.artworks = [];
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView(link.dataset.view);
            });
        });

        // Random controls
        document.getElementById('nextRandomBtn').addEventListener('click', () => {
            this.nextRandom();
        });

        // Gallery controls
        document.getElementById('normalView').addEventListener('click', () => {
            this.toggleView(false);
        });
        
        document.getElementById('compactView').addEventListener('click', () => {
            this.toggleView(true);
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('modalPrev').addEventListener('click', () => {
            this.prevModalArtwork();
        });
        
        document.getElementById('modalNext').addEventListener('click', () => {
            this.nextModalArtwork();
        });

        // Modal outside click
        document.getElementById('artModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('artModal')) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('artModal').style.display === 'flex') {
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowLeft') this.prevModalArtwork();
                if (e.key === 'ArrowRight') this.nextModalArtwork();
            } else if (this.currentView === 'random') {
                if (e.key === ' ' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextRandom();
                }
            }
        });
    }

    // Random display functions
    showRandomArtwork() {
        if (this.artworks.length === 0) {
            console.error('No artworks available');
            return;
        }
        
        const artwork = this.artworks[this.currentRandomIndex];
        if (!artwork || !artwork.original) {
            console.error('Invalid artwork data:', artwork);
            return;
        }

        const loadingOverlay = document.getElementById('loadingOverlay');
        const nextBtn = document.getElementById('nextRandomBtn');
        const randomImage = document.getElementById('randomImage');
        const randomTitle = document.getElementById('randomTitle');
        const randomMeta = document.getElementById('randomMeta');
        
        loadingOverlay.style.display = 'flex';
        nextBtn.disabled = true;
        
        // Preload image
        const img = new Image();
        img.onload = () => {
            randomImage.src = artwork.original;
            randomTitle.textContent = artwork.title || '無題';
            randomMeta.textContent = this.formatDate(artwork.date);
            
            loadingOverlay.style.display = 'none';
            nextBtn.disabled = false;
        };
        img.onerror = () => {
            console.error('Failed to load image:', artwork.original);
            // Fallback if image fails to load
            randomImage.src = artwork.thumbnail || artwork.original;
            randomTitle.textContent = artwork.title || '無題';
            randomMeta.textContent = this.formatDate(artwork.date);
            
            loadingOverlay.style.display = 'none';
            nextBtn.disabled = false;
        };
        img.src = artwork.original;
    }

    nextRandom() {
        this.currentRandomIndex = Math.floor(Math.random() * this.artworks.length);
        this.showRandomArtwork();
    }

    // Gallery functions
    showGallery() {
        if (this.artworks.length === 0) {
            document.getElementById('galleryContent').innerHTML = '<p>作品が見つかりませんでした。</p>';
            return;
        }

        const artworksByYear = {};
        
        // Group by year
        this.artworks.forEach(artwork => {
            if (!artwork || !artwork.year) return;
            if (!artworksByYear[artwork.year]) {
                artworksByYear[artwork.year] = [];
            }
            artworksByYear[artwork.year].push(artwork);
        });

        // Sort years in descending order
        const years = Object.keys(artworksByYear).sort((a, b) => b - a);
        
        let html = '';
        years.forEach(year => {
            const artworks = artworksByYear[year].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            
            html += `
                <div class="year-section">
                    <h2 class="year-title">${year}</h2>
                    <div class="thumbnails-grid ${this.isCompactView ? 'compact' : ''}">
            `;
            
            artworks.forEach(artwork => {
                if (!artwork || !artwork.id) return;
                const thumbnailUrl = artwork.thumbnail || artwork.original;
                const originalUrl = artwork.original;
                
                html += `
                    <div class="thumbnail-card ${this.isCompactView ? 'compact' : ''}" onclick="gallery.openModal('${artwork.id}')">
                        <img class="thumbnail-image ${this.isCompactView ? 'compact' : ''}" 
                             src="${thumbnailUrl}" 
                             loading="lazy" 
                             onerror="this.src='${originalUrl}'"
                             alt="${artwork.title || '無題'}">
                        <div class="thumbnail-title ${this.isCompactView ? 'compact' : ''}">${artwork.title || '無題'}</div>
                        <div class="thumbnail-meta ${this.isCompactView ? 'compact' : ''}">
                            <span>${this.formatDate(artwork.date)}</span>
                            <span class="thumbnail-date ${this.isCompactView ? 'compact' : ''}">${artwork.year}</span>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        document.getElementById('galleryContent').innerHTML = html;
    }

    // View switching
    switchView(view) {
        this.currentView = view;
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === view) {
                link.classList.add('active');
            }
        });
        
        // Show/hide sections
        if (view === 'random') {
            document.getElementById('randomSection').classList.remove('hidden');
            document.getElementById('gallerySection').classList.remove('active');
        } else {
            document.getElementById('randomSection').classList.add('hidden');
            document.getElementById('gallerySection').classList.add('active');
            this.showGallery();
        }
    }

    toggleView(compact) {
        this.isCompactView = compact;
        
        // Update buttons
        const normalBtn = document.getElementById('normalView');
        const compactBtn = document.getElementById('compactView');
        
        if (compact) {
            normalBtn.classList.remove('active');
            compactBtn.classList.add('active');
        } else {
            normalBtn.classList.add('active');
            compactBtn.classList.remove('active');
        }
        
        // Refresh gallery if currently viewing
        if (this.currentView === 'gallery') {
            this.showGallery();
        }
    }

    // Modal functions
    openModal(artworkId) {
        const artwork = this.artworks.find(art => art.id === artworkId);
        if (!artwork) return;

        this.modalArtworks = [...this.artworks].sort((a, b) => new Date(b.date) - new Date(a.date));
        this.currentModalIndex = this.modalArtworks.findIndex(art => art.id === artworkId);

        this.showModalArtwork();
        document.getElementById('artModal').style.display = 'flex';
    }

    showModalArtwork() {
        const artwork = this.modalArtworks[this.currentModalIndex];
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalMeta = document.getElementById('modalMeta');
        
        modalImage.src = artwork.original;
        modalImage.onerror = () => {
            modalImage.src = artwork.thumbnail;
        };
        modalTitle.textContent = artwork.title;
        modalMeta.textContent = this.formatDate(artwork.date);
    }

    closeModal() {
        document.getElementById('artModal').style.display = 'none';
    }

    prevModalArtwork() {
        this.currentModalIndex = this.currentModalIndex > 0 ? 
            this.currentModalIndex - 1 : 
            this.modalArtworks.length - 1;
        this.showModalArtwork();
    }

    nextModalArtwork() {
        this.currentModalIndex = this.currentModalIndex < this.modalArtworks.length - 1 ? 
            this.currentModalIndex + 1 : 
            0;
        this.showModalArtwork();
    }

    // Utility functions
    formatDate(dateString) {
        if (!dateString) return '日付不明';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Invalid date format:', dateString);
            return '日付不明';
        }
    }
}

// Initialize gallery
const gallery = new PixelGallery();