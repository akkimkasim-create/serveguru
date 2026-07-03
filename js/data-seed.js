/* ============================================
   data-seed.js — Initial Data Seeding
   ============================================ */
(function seedData() {
    if (localStorage.getItem('btc_data_seeded') === 'true') return;

    // ── Products ──
    const products = [
        {
            id: 'prod_001', name: 'Singer M3505', brand: 'Singer', category: 'Domestic',
            price: 15999, originalPrice: 18999,
            description: 'The Singer M3505 is a versatile electric sewing machine designed for both beginners and experienced sewists. With 32 built-in stitches and an automatic needle threader, it makes sewing effortless.',
            features: ['32 built-in stitches', 'Automatic needle threader', 'Adjustable stitch length & width', 'LED sewing light', 'Free arm for cuffs & sleeves'],
            specifications: { Type: 'Electric', 'Stitch Patterns': '32', Speed: '750 SPM', Weight: '7.5 kg', Motor: 'AC Motor', Warranty: '2 Years' },
            featured: true, inStock: true, isNew: false
        },
        {
            id: 'prod_002', name: 'Singer Promise 1412', brand: 'Singer', category: 'Domestic',
            price: 12499, originalPrice: 0,
            description: 'Reliable and easy to use, the Singer Promise 1412 is perfect for everyday sewing needs. Features 12 built-in stitches and a 4-step buttonhole.',
            features: ['12 built-in stitches', '4-step buttonhole', 'Easy stitch selection', 'Metal frame construction', 'Snap-on presser feet'],
            specifications: { Type: 'Electric', 'Stitch Patterns': '12', Speed: '650 SPM', Weight: '6.2 kg', Motor: 'AC Motor', Warranty: '2 Years' },
            featured: true, inStock: true, isNew: false
        },
        {
            id: 'prod_003', name: 'Usha Allure DLX', brand: 'Usha', category: 'Domestic',
            price: 9999, originalPrice: 11999,
            description: 'India\'s most loved sewing machine brand brings you the Allure DLX — durable, reliable, and packed with features for home tailoring.',
            features: ['14 stitch patterns', 'Built-in buttonhole', 'Free arm capability', 'Dust cover included', 'Easy bobbin winding'],
            specifications: { Type: 'Electric', 'Stitch Patterns': '14', Speed: '700 SPM', Weight: '6 kg', Motor: 'Copper Motor', Warranty: '2 Years' },
            featured: true, inStock: true, isNew: false
        },
        {
            id: 'prod_004', name: 'Usha Dream Stitch', brand: 'Usha', category: 'Domestic',
            price: 8499, originalPrice: 0,
            description: 'Compact and lightweight, the Usha Dream Stitch is the perfect companion for quick alterations and creative sewing projects at home.',
            features: ['7 stitch patterns', 'Portable design', 'LED light', 'Reverse stitching', 'Accessory storage'],
            specifications: { Type: 'Electric', 'Stitch Patterns': '7', Speed: '600 SPM', Weight: '5.5 kg', Motor: 'AC Motor', Warranty: '2 Years' },
            featured: false, inStock: true, isNew: false
        },
        {
            id: 'prod_005', name: 'Usha Janome Wonder Stitch Plus', brand: 'Usha', category: 'Domestic',
            price: 18999, originalPrice: 22999,
            description: 'The Wonder Stitch Plus by Usha Janome combines Japanese technology with Indian reliability. 21 stitch patterns, automatic buttonhole, and computerized precision.',
            features: ['21 stitch patterns', 'Automatic 1-step buttonhole', 'LCD display', 'Speed control slider', 'Drop feed for free-motion'],
            specifications: { Type: 'Computerized', 'Stitch Patterns': '21', Speed: '820 SPM', Weight: '8 kg', Motor: 'DC Motor', Warranty: '3 Years' },
            featured: true, inStock: true, isNew: true
        },
        {
            id: 'prod_006', name: 'Jack F5', brand: 'Jack', category: 'Industrial',
            price: 24999, originalPrice: 28999,
            description: 'Industry-leading direct drive lockstitch machine. The Jack F5 offers unmatched speed, precision, and energy efficiency for professional garment manufacturing.',
            features: ['Direct drive motor', 'Auto thread trimmer', 'Energy efficient', 'Low noise operation', 'Oil-sealed mechanism'],
            specifications: { Type: 'Industrial Lockstitch', 'Max Speed': '5000 SPM', 'Stitch Length': '5mm', Weight: '28 kg', Motor: 'Servo Motor (550W)', Warranty: '1 Year' },
            featured: true, inStock: true, isNew: false
        },
        {
            id: 'prod_007', name: 'Jack A2B', brand: 'Jack', category: 'Industrial',
            price: 19999, originalPrice: 0,
            description: 'The Jack A2B is a high-performance single needle lockstitch machine ideal for small to medium garment workshops. Robust build with consistent stitch quality.',
            features: ['High speed operation', 'Auto lubrication', 'Quiet operation', 'Strong feed mechanism', 'Easy maintenance'],
            specifications: { Type: 'Industrial Lockstitch', 'Max Speed': '4500 SPM', 'Stitch Length': '5mm', Weight: '26 kg', Motor: 'Clutch Motor', Warranty: '1 Year' },
            featured: false, inStock: true, isNew: false
        },
        {
            id: 'prod_008', name: 'Juki DDL-8100E', brand: 'Juki', category: 'Industrial',
            price: 32999, originalPrice: 38999,
            description: 'World-renowned Juki quality. The DDL-8100E is the gold standard for industrial lockstitch sewing with exceptional stitch consistency and durability.',
            features: ['Auto thread trimmer', 'Condensation stitching', 'Quiet servo motor', 'Dry-head technology', 'Programmable functions'],
            specifications: { Type: 'Industrial Lockstitch', 'Max Speed': '5500 SPM', 'Stitch Length': '5mm', Weight: '32 kg', Motor: 'Servo Motor (750W)', Warranty: '2 Years' },
            featured: true, inStock: true, isNew: false
        },
        {
            id: 'prod_009', name: 'Juki MO-6814S', brand: 'Juki', category: 'Industrial',
            price: 45999, originalPrice: 0,
            description: 'Professional 4-thread overlock machine from Juki. Perfect for seaming and overlocking on a wide range of fabrics with clean, professional finish.',
            features: ['4-thread overlock', 'Differential feed', 'Micro-lift mechanism', 'Easy threading', 'Stitch consistency system'],
            specifications: { Type: 'Industrial Overlock', 'Max Speed': '7000 SPM', Threads: '4', Weight: '35 kg', Motor: 'Servo Motor', Warranty: '2 Years' },
            featured: false, inStock: true, isNew: false
        },
        {
            id: 'prod_010', name: 'Brother GS2700', brand: 'Brother', category: 'Domestic',
            price: 13999, originalPrice: 0,
            description: 'The Brother GS2700 offers 27 built-in stitches and 1-step auto-size buttonhole. Lightweight, reliable, and perfect for home sewing enthusiasts.',
            features: ['27 built-in stitches', '1-step auto buttonhole', 'Bright LED light', 'Free arm sewing', 'Top drop-in bobbin'],
            specifications: { Type: 'Electric', 'Stitch Patterns': '27', Speed: '780 SPM', Weight: '7 kg', Motor: 'AC Motor', Warranty: '2 Years' },
            featured: false, inStock: true, isNew: true
        },
        {
            id: 'prod_011', name: 'Siruba C007KD', brand: 'Siruba', category: 'Industrial',
            price: 52999, originalPrice: 0,
            description: 'High-performance coverstitch machine from Siruba. Ideal for hemming, binding, and decorative stitching on knit fabrics. Industrial-grade precision.',
            features: ['3-needle coverstitch', 'Differential feed', 'Adjustable stitch length', 'Built-in puller', 'Heavy duty construction'],
            specifications: { Type: 'Industrial Coverstitch', 'Max Speed': '6000 SPM', Needles: '3', Weight: '38 kg', Motor: 'Servo Motor', Warranty: '1 Year' },
            featured: false, inStock: true, isNew: false
        },
        {
            id: 'prod_012', name: 'Jack E4', brand: 'Jack', category: 'Industrial',
            price: 27999, originalPrice: 0,
            description: 'The Jack E4 is a 4-thread direct drive overlock machine. Energy-efficient and high-speed, perfect for production environments needing clean edge finishing.',
            features: ['4-thread overlock', 'Direct drive motor', 'Auto thread tension', 'LED light', 'Compact design'],
            specifications: { Type: 'Industrial Overlock', 'Max Speed': '6500 SPM', Threads: '4', Weight: '30 kg', Motor: 'Servo Motor (400W)', Warranty: '1 Year' },
            featured: false, inStock: true, isNew: false
        }
    ];

    // ── Services ──
    const services = [
        { id: 'svc_001', name: 'Sewing Machine Repair', icon: '🔧', description: 'Expert repair service for all brands of domestic and industrial sewing machines. Our skilled technicians diagnose and fix any issue quickly.', price: 'Starting from ₹500', features: ['All brands supported', 'Genuine spare parts', '90-day service warranty', 'Doorstep service available'] },
        { id: 'svc_002', name: 'Annual Maintenance Contract', icon: '🛡️', description: 'Keep your machines running at peak performance with our AMC plans. Regular servicing, priority support, and discounted repairs included.', price: 'Starting from ₹2,000/year', features: ['Quarterly servicing', 'Priority support', 'Discounted repairs', 'Performance optimization'] },
        { id: 'svc_003', name: 'Machine Installation', icon: '🔌', description: 'Professional installation and setup of your new sewing machine. We ensure proper calibration and teach you the basics.', price: 'Free with purchase', features: ['Professional setup', 'Calibration included', 'Basic training', 'Test run verification'] },
        { id: 'svc_004', name: 'Training & Demo', icon: '🎓', description: 'Learn to use your sewing machine like a pro. Free demo sessions for new purchases and paid workshops for advanced techniques.', price: 'Free', features: ['Hands-on training', 'All skill levels', 'Machine-specific tips', 'Maintenance basics'] },
        { id: 'svc_005', name: 'Genuine Spare Parts', icon: '🔩', description: 'We stock genuine spare parts for all major brands. Needles, bobbins, presser feet, motors, belts — everything you need.', price: 'Varies by part', features: ['100% authentic parts', 'All major brands', 'Quick availability', 'Warranty covered'] },
        { id: 'svc_006', name: 'Wholesale Supply', icon: '📦', description: 'Bulk orders for tailoring shops, garment factories, and institutions. Competitive wholesale pricing with dedicated support.', price: 'Contact for pricing', features: ['Bulk discounts', 'Dedicated support', 'Flexible payment', 'Delivery available'] }
    ];

    // ── Page Content ──
    const pageContent = {
        hero: {
            title: 'BHARAT TRADING CORPORATION',
            subtitle: 'Your Trusted Sewing Machine Partner',
            description: 'Premium sewing machines for home & industry. Sales, expert service & genuine spare parts — all under one roof in Coimbatore.',
            ctaPrimary: 'Shop Now',
            ctaSecondary: 'Book Service'
        },
        about: {
            title: 'About Us',
            story: 'Bharat Trading Corporation has been serving Coimbatore and surrounding regions as a trusted sewing machine dealer and service provider. Located in the heart of Singanallur, we have built our reputation on quality products, honest pricing, and exceptional after-sales service. From domestic sewing machines for home use to heavy-duty industrial machines for garment factories, we have the perfect machine for every need.',
            mission: 'To provide the highest quality sewing machines and unparalleled service, making sewing accessible and enjoyable for everyone — from home tailors to industrial manufacturers.',
            vision: 'To be the most trusted and preferred sewing machine partner in South India, known for our product range, technical expertise, and customer commitment.'
        },
        stats: { years: 15, customers: 5000, brands: 9, services: 10000 },
        testimonials: [
            { name: 'Lakshmi S.', text: 'Excellent service and genuine products! I bought my Usha machine from BTC 3 years ago and it still runs perfectly. Their repair team is also very prompt.', rating: 5 },
            { name: 'Rajan K.', text: 'Best place for industrial sewing machines in Coimbatore. The Jack F5 I purchased has transformed my workshop. Great after-sales support.', rating: 5 },
            { name: 'Priya M.', text: 'Quick repair service — my Singer machine had tension issues and they fixed it within a day. Genuine parts and reasonable pricing. Highly recommend!', rating: 4 },
            { name: 'Suresh V.', text: 'Bought 10 Juki machines for my garment unit. BTC offered the best wholesale price and excellent installation support. Very professional team.', rating: 5 },
            { name: 'Meena R.', text: 'I learned sewing on a machine from BTC. They gave me a free demo and were so patient. The Usha Dream Stitch is perfect for beginners!', rating: 5 }
        ]
    };

    saveToStorage('btc_products', products);
    saveToStorage('btc_services', services);
    saveToStorage('btc_appointments', []);
    saveToStorage('btc_page_content', pageContent);
    localStorage.setItem('btc_data_seeded', 'true');

    function saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
})();