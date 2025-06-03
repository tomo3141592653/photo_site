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
            const data = await response.json();
            this.artworks = data.artworks;
        } catch (error) {
            console.error('Failed to load artworks:', error);
            // フォールバックデータ
            this.artworks = [
                {
                    id: "20240115_001",
                    title: "なかむら観魚店",
                    date: "2015-05-01",
                    year: 2015,
                    original: "https://picsum.photos/800/600?random=1",
                    thumbnail: "https://picsum.photos/300/200?random=1"
                },
                {
                    id: "20240115_002", 
                    title: "夕暮れの街角",
                    date: "2024-01-15",
                    year: 2024,
                    original: "https://picsum.photos/800/600?random=2",
                    thumbnail: "https://picsum.photos/300/200?random=2"
                },
                {
                    id: "20240115_003",
                    title: "雨の駅",
                    date: "2024-01-10",
                    year: 2024,
                    original: "https://picsum.photos/800/600?random=3",
                    thumbnail: "https://picsum.photos/300/200?random=3"
                },
                {
                    id: "20240115_004",
                    title: "桜並木",
                    date: "2023-04-01",
                    year: 2023,
                    original: "https://picsum.photos/800/600?random=4",
                    thumbnail: "https://picsum.photos/300/200?random=4"
                },
                {
                    id: "20240115_005",
                    title: "ネオン街",
                    date: "2023-07-15",
                    year: 2023,
                    original: "https://picsum.photos/800/600?random=5",
                    thumbnail: "https://picsum.photos/300/200?random=5"
                },
                {
                    id: "20240115_006",
                    title: "森の小径",
                    date: "2022-08-20",
                    year: 2022,
                    original: "https://picsum.photos/800/600?random=6",
                    thumbnail: "https://picsum.photos/300/200?random=6"
                }
            ];
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
        if (this.artworks.length === 0) return;
        
        const artwork = this.artworks[this.currentRandomIndex];
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
            randomTitle.textContent = artwork.title;
            randomMeta.textContent = this.formatDate(artwork.date);
            
            loadingOverlay.style.display = 'none';
            nextBtn.disabled = false;
        };
        img.onerror = () => {
            // Fallback if image fails to load
            randomImage.src = artwork.thumbnail;
            randomTitle.textContent = artwork.title;
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
        const artworksByYear = {};
        
        // Group by year
        this.artworks.forEach(artwork => {
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
                html += `
                    <div class="thumbnail-card ${this.isCompactView ? 'compact' : ''}" onclick="gallery.openModal('${artwork.id}')">
                        <img class="thumbnail-image ${this.isCompactView ? 'compact' : ''}" src="${artwork.thumbnail}" loading="lazy" onerror="this.src='${artwork.original}'">
                        <div class="thumbnail-title ${this.isCompactView ? 'compact' : ''}">${artwork.title}</div>
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
        const date = new Date(dateString);
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    }
}

// Initialize gallery
let gallery;
document.addEventListener('DOMContentLoaded', () => {
    gallery = new PixelGallery();
});