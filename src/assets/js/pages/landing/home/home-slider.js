document.addEventListener('DOMContentLoaded', function() {
    new Splide('#products-slider', {
        type: 'loop',
        perPage: 5,
        perMove: 1,
        gap: '2rem',
        padding: '2rem',
        arrows: true,
        pagination: false,
        breakpoints: {
            1400: {
                perPage: 5,
                gap: '1.5rem',
            },
            1200: {
                perPage: 4,
                gap: '1.5rem',
            },
            992: {
                perPage: 3,
                gap: '1rem',
            },
            768: {
                perPage: 2,
                gap: '1rem',
                padding: '1rem',
            },
            390: {
                perPage: 1,
                gap: '1rem',
                padding: '1rem',
            }
            
            

        }
    }).mount();
});