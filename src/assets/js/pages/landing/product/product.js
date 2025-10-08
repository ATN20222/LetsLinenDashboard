document.addEventListener('DOMContentLoaded', function() {

    (function initProductThumbnails(){
        const container = document.querySelector('.product-details-section');
        if(!container) return;

        const mainImage = container.querySelector('.product-details-image img');
        const thumbnails = Array.from(container.querySelectorAll('.product-details-images-slider-item'));
        if(!mainImage || thumbnails.length === 0) return;

        thumbnails.forEach((thumb) => {
            thumb.setAttribute('tabindex', '0');
        });

        function setActive(elt){
            thumbnails.forEach(t => t.classList.remove('is-active'));
            elt.classList.add('is-active');
        }

        function swapTo(thumb){
            const img = thumb.querySelector('img');
            if(!img) return;

            const newSrc = img.getAttribute('src');
            const newAlt = img.getAttribute('alt') || 'Product Image';

            if(!newSrc) return;

            mainImage.style.opacity = '0.3';
            
            const temp = new Image();
            temp.onload = function(){
                mainImage.setAttribute('src', newSrc);
                mainImage.setAttribute('alt', newAlt);
                requestAnimationFrame(() => {
                    mainImage.style.opacity = '1';
                });
            };
            temp.src = newSrc;
            setActive(thumb);
        }


        const initial = thumbnails.find(t => {
            const img = t.querySelector('img');
            return img && img.getAttribute('src') === mainImage.getAttribute('src');
        }) || thumbnails[0];
        setActive(initial);

        thumbnails.forEach((thumb) => {
            thumb.addEventListener('click', () => swapTo(thumb));
            thumb.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    swapTo(thumb);
                }
            });
        });
    })();

    (function initProductOptionSelection(){
        const root = document.querySelector('.product-details-section');
        if(!root) return;

        // Sizes
        const sizeContainer = root.querySelector('.product-details-size-items');
        if(sizeContainer){
            // Make items focusable
            sizeContainer.querySelectorAll('.product-details-size-item').forEach((el) => el.setAttribute('tabindex','0'));

            function activateSize(item){
                sizeContainer.querySelectorAll('.product-details-size-item.is-active').forEach((el) => el.classList.remove('is-active'));
                item.classList.add('is-active');
            }

            sizeContainer.addEventListener('click', (e) => {
                const item = e.target.closest('.product-details-size-item');
                if(!item || !sizeContainer.contains(item)) return;
                activateSize(item);
            });

            sizeContainer.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' || e.key === ' '){
                    const item = e.target.closest('.product-details-size-item');
                    if(!item || !sizeContainer.contains(item)) return;
                    e.preventDefault();
                    activateSize(item);
                }
            });
        }

        // Colors
        const colorContainer = root.querySelector('.product-details-color-items');
        if(colorContainer){
            // Make items focusable
            colorContainer.querySelectorAll('.product-details-color-item').forEach((el) => el.setAttribute('tabindex','0'));

            function activateColor(item){
                colorContainer.querySelectorAll('.product-details-color-item.is-active').forEach((el) => el.classList.remove('is-active'));
                item.classList.add('is-active');
            }

            colorContainer.addEventListener('click', (e) => {
                const item = e.target.closest('.product-details-color-item');
                if(!item || !colorContainer.contains(item)) return;
                activateColor(item);
            });

            colorContainer.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' || e.key === ' '){
                    const item = e.target.closest('.product-details-color-item');
                    if(!item || !colorContainer.contains(item)) return;
                    e.preventDefault();
                    activateColor(item);
                }
            });
        }

        // Tabs
        const tabsContainer = root.querySelector('.product-details-tabs-container');
        const panels = Array.from(root.querySelectorAll('.product-details-tab-content'));
        if(tabsContainer && panels.length){
            const tabs = Array.from(tabsContainer.querySelectorAll('.product-details-tabs-item'));
            tabs.forEach((t) => t.setAttribute('tabindex','0'));

            function activateTabAt(index){
                tabs.forEach((t) => t.classList.remove('is-active'));
                panels.forEach((p) => p.classList.remove('is-active'));
                if(tabs[index]) tabs[index].classList.add('is-active');
                if(panels[index]) panels[index].classList.add('is-active');
            }

            tabsContainer.addEventListener('click', (e) => {
                const tab = e.target.closest('.product-details-tabs-item');
                if(!tab) return;
                const index = tabs.indexOf(tab);
                if(index >= 0) activateTabAt(index);
            });

            tabsContainer.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' || e.key === ' '){
                    const tab = e.target.closest('.product-details-tabs-item');
                    if(!tab) return;
                    const index = tabs.indexOf(tab);
                    if(index >= 0){
                        e.preventDefault();
                        activateTabAt(index);
                    }
                }
            });
        }
    })();

});
