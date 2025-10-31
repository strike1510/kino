export default {
    name: 'AboutView',
    data() {
        return {
            features: [
                'View movie data',
                'Manage directors and actors', 
                'Read and write reviews',
                'Edit the database'
            ]
        }
    },
    mounted() {
        console.log('AboutView component mounted');
        this.animateElements();
    },
    methods: {
        animateElements() {
            const elements = this.$el.querySelectorAll('h1, p, li');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `all 0.5s ease ${index * 0.1}s`;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100);
            });
        },
        
        addFeature(feature) {
            this.features.push(feature);
        },
        
        formatText(text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
    },
    computed: {
        pageTitle() {
            return 'About our Cinema Application';
        }
    },
    watch: {
        features: {
            handler(newFeatures) {
                console.log('Features updated:', newFeatures);
            },
            deep: true
        }
    }
}