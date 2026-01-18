// ===== FishFinder Pro - Main Application =====
// Focused on Kedah, Malaysia fishing spots

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered!', reg.scope))
            .catch(err => console.error('SW Failed:', err));
    });
}

// ===== Malaysian Fish Database =====
const FISH_DATABASE = {
    // Freshwater - Common
    'toman': { name: 'Toman (Giant Snakehead)', rarity: 'rare', habitat: 'Tasik, sungai dalam', avgWeight: 5.0, bestBait: 'Umpan katak, spoon, crankbait' },
    'haruan': { name: 'Haruan (Striped Snakehead)', rarity: 'common', habitat: 'Sawah padi, kolam, sungai', avgWeight: 1.5, bestBait: 'Umpan katak, cacing, ikan kecil' },
    'sebarau': { name: 'Sebarau (Hampala Barb)', rarity: 'uncommon', habitat: 'Sungai berair jernih', avgWeight: 2.0, bestBait: 'Spinner, minnow, jig' },
    'keli': { name: 'Keli (African Catfish)', rarity: 'common', habitat: 'Kolam, sungai berlumpur', avgWeight: 3.0, bestBait: 'Hati ayam, cacing, pelet' },
    'patin': { name: 'Patin (Pangasius)', rarity: 'uncommon', habitat: 'Tasik, sungai lebar', avgWeight: 4.0, bestBait: 'Pelet, roti, buah kelapa sawit' },
    'jelawat': { name: 'Jelawat (Sultan Fish)', rarity: 'rare', habitat: 'Sungai berarus, empangan', avgWeight: 3.5, bestBait: 'Buah, roti, pelet khas' },
    'lampam_jawa': { name: 'Lampam Jawa', rarity: 'common', habitat: 'Kolam, tasik', avgWeight: 1.0, bestBait: 'Roti, pelet, dedak' },
    'kelah': { name: 'Kelah (Malaysian Mahseer)', rarity: 'legendary', habitat: 'Sungai pergunungan', avgWeight: 8.0, bestBait: 'Buah, serangga, spinner' },
    'belida': { name: 'Belida (Clown Knifefish)', rarity: 'epic', habitat: 'Sungai dalam', avgWeight: 5.0, bestBait: 'Ikan kecil, udang' },
    'tilapia': { name: 'Tilapia Merah', rarity: 'common', habitat: 'Kolam ternakan, tasik', avgWeight: 0.8, bestBait: 'Pelet, roti, cacing' },
    'baung': { name: 'Baung', rarity: 'uncommon', habitat: 'Sungai, tasik', avgWeight: 2.5, bestBait: 'Udang, ikan kecil' },
    'rohu': { name: 'Rohu', rarity: 'common', habitat: 'Tasik, empangan', avgWeight: 3.0, bestBait: 'Pelet, dedak, roti' },
    'puyu': { name: 'Puyu (Climbing Perch)', rarity: 'common', habitat: 'Sawah padi, paya', avgWeight: 0.3, bestBait: 'Cacing, umpan kecil' },

    // Saltwater - Kedah coastal
    'siakap': { name: 'Siakap (Barramundi)', rarity: 'rare', habitat: 'Muara sungai, laut cetek', avgWeight: 6.0, bestBait: 'Umpan hidup, soft plastic' },
    'kerapu': { name: 'Kerapu (Grouper)', rarity: 'rare', habitat: 'Terumbu karang, jeti', avgWeight: 5.0, bestBait: 'Sotong, ikan hidup' },
    'jenahak': { name: 'Jenahak (Snapper)', rarity: 'uncommon', habitat: 'Laut dalam, terumbu', avgWeight: 3.0, bestBait: 'Sotong, udang' },
    'tenggiri': { name: 'Tenggiri (Spanish Mackerel)', rarity: 'uncommon', habitat: 'Laut terbuka', avgWeight: 4.0, bestBait: 'Umpan perak, trolling' },
    'gelama': { name: 'Gelama (Croaker)', rarity: 'common', habitat: 'Pantai, muara', avgWeight: 1.0, bestBait: 'Udang, cacing laut' },
    'sembilang': { name: 'Sembilang (Catfish Eel)', rarity: 'common', habitat: 'Pantai berlumpur', avgWeight: 1.5, bestBait: 'Udang, ikan kecil' },
    'gerut': { name: 'Gerut-gerut', rarity: 'common', habitat: 'Muara, bakau', avgWeight: 0.5, bestBait: 'Udang, cacing' },
    'bawal_emas': { name: 'Bawal Emas (Golden Pomfret)', rarity: 'epic', habitat: 'Laut dalam', avgWeight: 2.0, bestBait: 'Sotong, udang' },
    'yu_pari': { name: 'Pari (Stingray)', rarity: 'uncommon', habitat: 'Dasar laut berpasir', avgWeight: 10.0, bestBait: 'Ikan, sotong' }
};

// ===== Rarity Points =====
const RARITY_POINTS = {
    'common': 5,
    'uncommon': 15,
    'rare': 25,
    'epic': 40,
    'legendary': 60
};

// ===== Kedah Fishing Spots with Reviews =====
const SAMPLE_SPOTS = [
    {
        id: 'spot1', name: 'Tasik Beris, Sik', lat: 5.9569, lng: 100.7736, type: 'lake', rating: 4.7,
        description: 'Empangan besar dengan Toman dan Sebarau. Air jernih, suasana tenang. Popular untuk memancing lure.',
        reviews: [
            { user: 'TomanHunter', stars: 5, text: 'Dapat Toman 6kg! Guna frog lure pagi-pagi.', date: '2026-01-15T06:00:00Z' },
            { user: 'KedahAngler', stars: 5, text: 'Spot terbaik di Kedah. Sebarau banyak!', date: '2026-01-10T07:30:00Z' },
            { user: 'PancingMaster', stars: 4, text: 'View cantik, ikan aktif waktu subuh.', date: '2026-01-05T05:15:00Z' }
        ]
    },
    {
        id: 'spot2', name: 'Sungai Kedah, Alor Setar', lat: 6.1168, lng: 100.3685, type: 'river', rating: 4.4,
        description: 'Lubuk Toman terkenal di bandar. Banyak spot dari Kuala Tok Pasai hingga Alor Melaka.',
        reviews: [
            { user: 'RiverKing', stars: 4, text: 'Toman mama besar! Kena sabar tunggu.', date: '2026-01-12T17:45:00Z' },
            { user: 'LocalAngler', stars: 5, text: 'Sungai ni memang lubuk rahsia. Haruan juga banyak.', date: '2026-01-08T06:00:00Z' }
        ]
    },
    {
        id: 'spot3', name: 'Kuala Kedah', lat: 6.1000, lng: 100.3000, type: 'ocean', rating: 4.6,
        description: 'Jeti nelayan popular. Siakap, Kerapu dan Jenahak. Boleh sewa bot untuk laut dalam.',
        reviews: [
            { user: 'SaltWaterPro', stars: 5, text: 'Dapat Siakap 8kg! Guna umpan hidup.', date: '2026-01-14T05:30:00Z' },
            { user: 'JetiMaster', stars: 4, text: 'Tempat best untuk bottom fishing.', date: '2026-01-11T04:00:00Z' },
            { user: 'KedahAngler', stars: 5, text: 'Sunrise cantik + ikan banyak = perfect!', date: '2026-01-07T05:00:00Z' }
        ]
    },
    {
        id: 'spot4', name: 'Tasik Pedu, Padang Terap', lat: 6.2500, lng: 100.7833, type: 'lake', rating: 4.8,
        description: 'Tasik terbesar di Kedah. Jelawat, Belida, Toman, Patin. Resort & chalet tersedia.',
        reviews: [
            { user: 'TomanHunter', stars: 5, text: 'Jelawat 4kg! Tasik ni memang syurga.', date: '2026-01-16T06:30:00Z' },
            { user: 'PeduLover', stars: 5, text: 'Weekend getaway terbaik. Ikan dan view both best!', date: '2026-01-13T07:00:00Z' }
        ]
    },
    {
        id: 'spot5', name: 'Sungai Merbok, Semeling', lat: 5.6333, lng: 100.4167, type: 'river', rating: 4.2,
        description: 'Jeti Sungai Merbok - popular untuk riadah dan memancing. Siakap dan Keli banyak.',
        reviews: [
            { user: 'MerbokFisher', stars: 4, text: 'Spot santai, sesuai untuk family.', date: '2026-01-09T08:00:00Z' },
            { user: 'LocalAngler', stars: 4, text: 'Keli monster ada kalau malam.', date: '2026-01-06T20:00:00Z' }
        ]
    },
    {
        id: 'spot6', name: 'Terusan Wan Mat Saman', lat: 6.0833, lng: 100.4000, type: 'river', rating: 4.3,
        description: 'Terusan bersejarah. Haruan dan Keli popular. Air tenang, sesuai untuk kayak fishing.',
        reviews: [
            { user: 'KayakAngler', stars: 4, text: 'Best untuk kayak! Haruan banyak bawah pokok.', date: '2026-01-14T07:30:00Z' },
            { user: 'PancingMaster', stars: 5, text: 'Lubuk rahsia saya. Shhh!', date: '2026-01-08T06:00:00Z' }
        ]
    },
    {
        id: 'spot7', name: 'Pantai Merdeka, Kuala Muda', lat: 5.5833, lng: 100.3833, type: 'ocean', rating: 4.0,
        description: 'Pantai nelayan. Berdekatan Tanjung Dawai & Pulau Sayak. Gelama dan Gerut-gerut.',
        reviews: [
            { user: 'BeachFisher', stars: 4, text: 'Surf casting best! Gelama banyak.', date: '2026-01-15T17:00:00Z' }
        ]
    },
    {
        id: 'spot8', name: 'Kolam Pancing Siakap, Cendol', lat: 5.5500, lng: 100.4500, type: 'pond', rating: 4.5,
        description: 'Kolam pancing berbayar. Siakap putih & merah segar. Sesuai untuk latihan strike.',
        reviews: [
            { user: 'SiakApLover', stars: 5, text: 'Siakap confirm strike! Best untuk newbie.', date: '2026-01-17T10:00:00Z' },
            { user: 'KedahAngler', stars: 4, text: 'RM20 unlimited. Berbaloi!', date: '2026-01-12T14:30:00Z' }
        ]
    },
    {
        id: 'spot9', name: 'Jeti Penarak, Langkawi', lat: 6.4300, lng: 99.7200, type: 'ocean', rating: 4.9,
        description: 'Jeti popular Langkawi. Air jernih, pelbagai ikan. Dekat dengan Kuah Town.',
        reviews: [
            { user: 'LangkawiPro', stars: 5, text: 'Kerapu monster! Langkawi memang best.', date: '2026-01-16T05:00:00Z' },
            { user: 'IslandAngler', stars: 5, text: 'Clear water, dapat nampak ikan!', date: '2026-01-13T06:00:00Z' },
            { user: 'TouristFisher', stars: 5, text: 'Holiday + fishing = perfect combo!', date: '2026-01-10T08:00:00Z' }
        ]
    },
    {
        id: 'spot10', name: 'Sungai Muda', lat: 5.4667, lng: 100.4333, type: 'river', rating: 4.4,
        description: 'Sempadan Kedah-Penang. Toman dan Haruan besar. Air sungai lebar dan dalam.',
        reviews: [
            { user: 'BorderAngler', stars: 5, text: 'Toman gergasi 7kg! Sungai legend!', date: '2026-01-15T06:00:00Z' },
            { user: 'RiverKing', stars: 4, text: 'Current kuat, guna tackle heavy.', date: '2026-01-11T07:00:00Z' }
        ]
    },
    {
        id: 'spot11', name: 'Empangan Tanjung Chali', lat: 5.7500, lng: 100.6000, type: 'lake', rating: 4.1,
        description: 'Empangan kecil tapi lubuk best. Patin dan Lampam Jawa. Suasana kampung.',
        reviews: [
            { user: 'DamFisher', stars: 4, text: 'Patin besar ada! Guna pelet.', date: '2026-01-08T09:00:00Z' }
        ]
    },
    {
        id: 'spot12', name: 'Tasik Darulaman Perdana, SP', lat: 5.6500, lng: 100.5000, type: 'lake', rating: 3.9,
        description: 'Tasik rekreasi Sungai Petani. Keli Afrika dan Tilapia. Sesuai family outing.',
        reviews: [
            { user: 'SPLocal', stars: 4, text: 'Santai je pancing sini. Keli besar!', date: '2026-01-14T16:00:00Z' },
            { user: 'FamilyFisher', stars: 4, text: 'Anak-anak suka! Banyak ikan kecil.', date: '2026-01-11T10:00:00Z' }
        ]
    },
    {
        id: 'spot13', name: 'Kelong Teluk Bayu, SP', lat: 5.6200, lng: 100.3700, type: 'ocean', rating: 4.6,
        description: 'Kelong/Rumah Rakit. Bayaran berpatutan, tiada had masa. Malam best untuk Siakap.',
        reviews: [
            { user: 'KelongMaster', stars: 5, text: 'Overnight fishing terbaik! Siakap malam.', date: '2026-01-16T22:00:00Z' },
            { user: 'SaltWaterPro', stars: 4, text: 'Pengalaman unik. Boleh tidur atas kelong.', date: '2026-01-12T19:00:00Z' }
        ]
    },
    {
        id: 'spot14', name: 'Sungai Kura, Sik', lat: 5.8000, lng: 100.7500, type: 'stream', rating: 4.3,
        description: 'Sungai kecil berair jernih. Sebarau dan Kelah. Fly fishing recommended.',
        reviews: [
            { user: 'FlyFisher', stars: 5, text: 'Kelah kecil tapi banyak! Water crystal clear.', date: '2026-01-13T07:00:00Z' }
        ]
    },
    {
        id: 'spot15', name: 'Pulau Sayak', lat: 5.5700, lng: 100.3500, type: 'ocean', rating: 4.2,
        description: 'Pantai Pulau Sayak. Gelama, Gerut-gerut, udang lipan. Beach fishing paradise.',
        reviews: [
            { user: 'BeachFisher', stars: 4, text: 'Sunset fishing + BBQ ikan fresh!', date: '2026-01-10T17:30:00Z' },
            { user: 'IslandAngler', stars: 4, text: 'Pulau cantik, ikan pun okay.', date: '2026-01-07T16:00:00Z' }
        ]
    },
    {
        id: 'spot16', name: 'Tasik Gubir, Sik', lat: 6.0500, lng: 100.8000, type: 'lake', rating: 4.7,
        description: 'VIRAL! Tasik dalam hutan simpan sejak 1932. Toman Black & Green Arowana rare. High strike rate!',
        reviews: [
            { user: 'TomanBlackHunter', stars: 5, text: 'Lubuk toman black terbaik! Dapat 3 ekor dalam 2 jam.', date: '2026-01-17T06:00:00Z' },
            { user: 'ViralAngler', stars: 5, text: 'Spot viral TikTok! Memang confirm strike.', date: '2026-01-14T05:30:00Z' },
            { user: 'KedahAngler', stars: 4, text: 'Suasana aura tersendiri. Alam semulajadi cantik!', date: '2026-01-11T07:00:00Z' }
        ]
    },
    {
        id: 'spot17', name: 'Jeti Tanjung Dawai', lat: 5.4500, lng: 100.3200, type: 'ocean', rating: 4.5,
        description: 'Perkampungan nelayan terkenal. Surfcasting Challenge venue. Sunset view terbaik!',
        reviews: [
            { user: 'SurfcasterPro', stars: 5, text: 'Kedah Surfcasting Challenge 2025! Hadiah ribu-ribu.', date: '2026-01-16T17:00:00Z' },
            { user: 'JetiMaster', stars: 4, text: 'Seafood fresh tepi jeti. Gerut, gelama banyak.', date: '2026-01-13T18:00:00Z' }
        ]
    },
    {
        id: 'spot18', name: 'Klau, Baling', lat: 5.7000, lng: 100.9000, type: 'river', rating: 4.4,
        description: 'Sungai dalam kawasan Baling. Toman gergasi! Pemancing Thailand pun datang sini.',
        reviews: [
            { user: 'BalingBoy', stars: 5, text: 'Toman 8kg personal best! Cast bawah jambatan.', date: '2026-01-15T06:30:00Z' },
            { user: 'ThaiAngler', stars: 4, text: 'From Thailand, worth the trip! Big fish.', date: '2026-01-10T08:00:00Z' }
        ]
    },
    {
        id: 'spot19', name: 'Bukit Wang, Jitra', lat: 6.2700, lng: 100.4200, type: 'stream', rating: 4.3,
        description: 'Air terjun & sungai. Sebarau besar! Popular untuk video fishing content.',
        reviews: [
            { user: 'ContentCreator', stars: 5, text: 'View cantik untuk content! Sebarau aktif.', date: '2026-01-14T09:00:00Z' },
            { user: 'FlyFisher', stars: 4, text: 'Crystal clear water. Nampak ikan dari atas.', date: '2026-01-09T07:30:00Z' }
        ]
    },
    {
        id: 'spot20', name: 'Kuala Yan', lat: 5.8000, lng: 100.3600, type: 'ocean', rating: 4.1,
        description: 'Kampung nelayan Yan. Bottom fishing best. Kerapu, Jenahak, Siakap malam.',
        reviews: [
            { user: 'NightFisher', stars: 4, text: 'Malam dapat Siakap besar! Umpan udang hidup.', date: '2026-01-12T22:00:00Z' },
            { user: 'LocalFisher', stars: 4, text: 'Ikan fresh terus dari laut. Best!', date: '2026-01-08T06:00:00Z' }
        ]
    }
];

// ===== Sample Catches (Malaysian Fish) =====
const SAMPLE_CATCHES = [
    { id: 'c1', species: 'Toman (Giant Snakehead)', weight: 6.2, length: 75, spotId: 'spot1', notes: 'Frog lure pagi subuh. Fight 10 minit!', score: 87, date: '2026-01-17T05:30:00Z' },
    { id: 'c2', species: 'Sebarau (Hampala Barb)', weight: 2.1, length: 45, spotId: 'spot1', notes: 'Spinner dekat struktur kayu', score: 46, date: '2026-01-16T06:15:00Z' },
    { id: 'c3', species: 'Haruan (Striped Snakehead)', weight: 1.8, length: 42, spotId: 'spot6', notes: 'Umpan katak bawah pokok', score: 33, date: '2026-01-15T07:00:00Z' },
    { id: 'c4', species: 'Siakap (Barramundi)', weight: 8.5, length: 85, spotId: 'spot3', notes: 'Live bait malam. Monster!', score: 110, date: '2026-01-14T22:30:00Z' },
    { id: 'c5', species: 'Keli (African Catfish)', weight: 4.2, length: 60, spotId: 'spot12', notes: 'Hati ayam malam. Kena banyak!', score: 57, date: '2026-01-13T21:00:00Z' },
    { id: 'c6', species: 'Jelawat (Sultan Fish)', weight: 3.8, length: 55, spotId: 'spot4', notes: 'Roti + pelet. Ikan sultan!', score: 78, date: '2026-01-12T08:30:00Z' },
    { id: 'c7', species: 'Kerapu (Grouper)', weight: 5.5, length: 65, spotId: 'spot9', notes: 'Sotong hidup. Langkawi best!', score: 95, date: '2026-01-11T06:00:00Z' },
    { id: 'c8', species: 'Tilapia Merah', weight: 0.9, length: 28, spotId: 'spot8', notes: 'Pelet kat kolam. Easy catch.', score: 19, date: '2026-01-10T14:00:00Z' },
    { id: 'c9', species: 'Patin (Pangasius)', weight: 4.5, length: 62, spotId: 'spot11', notes: 'Pelet khas empangan', score: 60, date: '2026-01-09T09:30:00Z' },
    { id: 'c10', species: 'Jenahak (Snapper)', weight: 3.2, length: 48, spotId: 'spot3', notes: 'Bottom fishing Kuala Kedah', score: 52, date: '2026-01-08T07:00:00Z' },
    { id: 'c11', species: 'Gelama (Croaker)', weight: 1.2, length: 35, spotId: 'spot7', notes: 'Surf casting pantai. Dapat 5 ekor!', score: 22, date: '2026-01-07T17:30:00Z' },
    { id: 'c12', species: 'Baung', weight: 2.8, length: 50, spotId: 'spot2', notes: 'Udang malam Sungai Kedah', score: 48, date: '2026-01-06T20:15:00Z' },
    { id: 'c13', species: 'Lampam Jawa', weight: 1.1, length: 30, spotId: 'spot4', notes: 'Roti Tasik Pedu. Family trip!', score: 21, date: '2026-01-05T10:00:00Z' },
    { id: 'c14', species: 'Tenggiri (Spanish Mackerel)', weight: 4.8, length: 70, spotId: 'spot13', notes: 'Trolling dari kelong', score: 68, date: '2026-01-04T06:00:00Z' },
    { id: 'c15', species: 'Rohu', weight: 3.5, length: 52, spotId: 'spot4', notes: 'Dedak + pelet. Rohu besar!', score: 45, date: '2026-01-03T08:00:00Z' }
];

// ===== Sample User Data =====
const SAMPLE_USER = {
    name: 'KedahAngler',
    totalPoints: 931,
    streak: 7,
    lastFishingDate: new Date().toDateString(),
    badges: ['first_catch', 'night_owl', 'on_fire'],
    caughtSpecies: ['toman', 'sebarau', 'haruan', 'siakap', 'keli', 'jelawat', 'kerapu',
        'tilapia', 'patin', 'jenahak', 'gelama', 'baung', 'lampam jawa', 'tenggiri', 'rohu']
};

// ===== Sample Community Data =====
const SAMPLE_COMMUNITY = {
    messages: [
        { id: 'm1', user: 'TomanHunter', avatar: '🎣', text: 'Assalamualaikum! Ada sesiapa nak join trip ke Tasik Beris esok?', time: '10:30 AM', likes: 5 },
        { id: 'm2', user: 'SiakApLover', avatar: '🐟', text: 'Pagi tadi dapat Siakap 5kg kat Kuala Kedah! Guna umpan hidup.', time: '09:45 AM', likes: 12 },
        { id: 'm3', user: 'LocalAngler', avatar: '🌊', text: 'Cuaca hari ni okay untuk pancing. Angin tak kuat sangat.', time: '08:20 AM', likes: 3 },
        { id: 'm4', user: 'PancingMaster', avatar: '🏆', text: 'Tips: Waktu subuh memang best untuk Toman. Guna frog lure!', time: '07:15 AM', likes: 18 },
        { id: 'm5', user: 'RiverKing', avatar: '👑', text: 'Sungai Kedah air jernih hari ni. Perfect untuk casting!', time: 'Yesterday', likes: 8 },
        { id: 'm6', user: 'KelongMaster', avatar: '🚤', text: 'Malam ni ada slot kosong kat kelong Teluk Bayu. DM kalau nak join!', time: 'Yesterday', likes: 15 },
        { id: 'm7', user: 'FlyFisher', avatar: '🪰', text: 'Ada yang pernah try fly fishing kat Bukit Wang? How was it?', time: 'Yesterday', likes: 4 },
        { id: 'm8', user: 'BeachFisher', avatar: '🏖️', text: 'Sunset fishing kat Pantai Merdeka tadi memang best! 🌅', time: '2 days ago', likes: 22 }
    ],
    reports: [
        { id: 'r1', user: 'TomanHunter', avatar: '🎣', species: 'Toman', weight: 6.2, spot: 'Tasik Beris', photo: '🐟', time: '2 hours ago', likes: 25, comments: 8 },
        { id: 'r2', user: 'SiakApLover', avatar: '🐟', species: 'Siakap', weight: 5.0, spot: 'Kuala Kedah', photo: '🐟', time: '4 hours ago', likes: 32, comments: 12 },
        { id: 'r3', user: 'KedahAngler', avatar: '🏆', species: 'Sebarau', weight: 2.1, spot: 'Tasik Beris', photo: '🐟', time: '6 hours ago', likes: 18, comments: 5 },
        { id: 'r4', user: 'LangkawiPro', avatar: '🏝️', species: 'Kerapu', weight: 4.5, spot: 'Jeti Penarak', photo: '🐟', time: 'Yesterday', likes: 45, comments: 15 },
        { id: 'r5', user: 'NightFisher', avatar: '🌙', species: 'Keli', weight: 3.8, spot: 'Tasik Darulaman', photo: '🐟', time: 'Yesterday', likes: 14, comments: 3 }
    ],
    activeUsers: [
        { name: 'TomanHunter', status: 'Fishing at Tasik Beris', avatar: '🎣' },
        { name: 'SiakApLover', status: 'Online', avatar: '🐟' },
        { name: 'RiverKing', status: 'Fishing at Sungai Kedah', avatar: '👑' },
        { name: 'KelongMaster', status: 'At Kelong Teluk Bayu', avatar: '🚤' }
    ]
};


// ===== App State =====
let state = {
    map: null,
    markers: [],
    spots: [],
    catches: [],
    user: {
        name: 'Angler',
        totalPoints: 0,
        streak: 0,
        lastFishingDate: null,
        badges: [],
        caughtSpecies: []
    },
    currentView: 'map',
    selectedSpot: null,
    solunarMode: false,
    solunarMarker: null
};

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initMap();
    initEventListeners();
    updateUI();
});

// ===== Local Storage =====
function loadData() {
    const savedSpots = localStorage.getItem('fishfinder_spots');
    const savedCatches = localStorage.getItem('fishfinder_catches');
    const savedUser = localStorage.getItem('fishfinder_user');

    // Load spots - use sample if none saved
    state.spots = savedSpots ? JSON.parse(savedSpots) : [...SAMPLE_SPOTS];

    // Load catches - use sample if none saved
    state.catches = savedCatches ? JSON.parse(savedCatches) : [...SAMPLE_CATCHES];

    // Load user - use sample if none saved
    state.user = savedUser ? JSON.parse(savedUser) : { ...SAMPLE_USER };

    // Check streak
    checkStreak();
}

// Reset to demo data (useful for testing)
function resetToDemo() {
    localStorage.removeItem('fishfinder_spots');
    localStorage.removeItem('fishfinder_catches');
    localStorage.removeItem('fishfinder_user');
    state.spots = [...SAMPLE_SPOTS];
    state.catches = [...SAMPLE_CATCHES];
    state.user = { ...SAMPLE_USER };
    saveData();
    renderSpots();
    showToast('🔄', 'Reset to demo data!');
}

function saveData() {
    localStorage.setItem('fishfinder_spots', JSON.stringify(state.spots));
    localStorage.setItem('fishfinder_catches', JSON.stringify(state.catches));
    localStorage.setItem('fishfinder_user', JSON.stringify(state.user));
}

function checkStreak() {
    const today = new Date().toDateString();
    const lastDate = state.user.lastFishingDate;

    if (lastDate) {
        const lastDateObj = new Date(lastDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDateObj.toDateString() !== yesterday.toDateString() && lastDate !== today) {
            state.user.streak = 0;
        }
    }
}

// ===== Map Initialization =====
function initMap() {
    // Default center (Kedah, Malaysia - Alor Setar area)
    const defaultCenter = [6.1168, 100.3685];

    state.map = L.map('map', {
        zoomControl: false
    }).setView(defaultCenter, 11);

    // Define multiple tile layers
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri',
        maxZoom: 19
    });

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
    });

    const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap',
        maxZoom: 17
    });

    // Add default layer
    darkLayer.addTo(state.map);

    // Layer control
    const baseLayers = {
        '🌙 Dark': darkLayer,
        '🛰️ Satellite': satelliteLayer,
        '🗺️ Street': streetLayer,
        '⛰️ Terrain': terrainLayer
    };

    L.control.layers(baseLayers, null, { position: 'topright' }).addTo(state.map);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(state.map);

    // Request geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                state.map.setView([pos.coords.latitude, pos.coords.longitude], 12);
            },
            () => { },
            { enableHighAccuracy: true }
        );
    }

    // Add click listener - supports both adding spots and solunar pinpoint
    state.map.on('click', (e) => {
        if (state.solunarMode) {
            // Solunar pinpoint mode
            showPinpointSolunar(e.latlng.lat, e.latlng.lng);
        } else if (state.currentView === 'map') {
            openAddSpotModal(e.latlng.lat, e.latlng.lng);
        }
    });

    // Render existing spots
    renderSpots();
}

function renderSpots() {
    // Clear existing markers
    state.markers.forEach(marker => marker.remove());
    state.markers = [];

    // Determine hot spots (rating >= 4.5)
    const hotSpotThreshold = 4.5;

    // Add markers for each spot
    state.spots.forEach(spot => {
        const isHotSpot = spot.rating >= hotSpotThreshold;
        const hotClass = isHotSpot ? 'hot-spot' : '';

        const icon = L.divIcon({
            className: 'custom-marker-wrapper',
            html: `
                <div class="custom-marker ${spot.type} ${hotClass}">
                    ${getSpotIcon(spot.type)}
                    ${isHotSpot ? '<div class="hot-pulse"></div>' : ''}
                </div>
                ${isHotSpot ? `<div class="hot-badge">🔥</div>` : ''}
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const marker = L.marker([spot.lat, spot.lng], { icon })
            .addTo(state.map)
            .on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                openSpotDetails(spot);
            });

        state.markers.push(marker);
    });
}

function getSpotIcon(type) {
    const icons = {
        lake: '🏞️',
        river: '🌊',
        ocean: '🌅',
        pond: '💧',
        stream: '🏔️'
    };
    return icons[type] || '📍';
}

// ===== Event Listeners =====
function initEventListeners() {
    // Bottom navigation
    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveView(btn.dataset.view);
        });
    });

    // Add catch button
    document.getElementById('addCatchBtn').addEventListener('click', () => {
        openModal('logCatchModal');
        populateSpotSelect();
    });

    // Header buttons
    document.getElementById('forecastBtn').addEventListener('click', () => {
        openModal('forecastModal');
        renderForecast();
    });

    document.getElementById('leaderboardBtn').addEventListener('click', () => {
        openModal('leaderboardModal');
        renderLeaderboard();
    });

    document.getElementById('profileBtn').addEventListener('click', () => {
        openSidebar('profile');
    });

    // Sidebar close
    document.getElementById('closeSidebar').addEventListener('click', closeSidebar);

    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', closeAllModals);
    });

    // Add spot form
    document.getElementById('addSpotForm').addEventListener('submit', handleAddSpot);

    // Log catch form
    document.getElementById('logCatchForm').addEventListener('submit', handleLogCatch);

    // Photo previews
    setupPhotoPreview('catchPhoto', 'photoPreview');
    setupPhotoPreview('identifyPhoto', 'identifyPreview');

    // Fish identifier
    document.getElementById('identifyPhoto').addEventListener('change', handleIdentifyPhoto);
    document.getElementById('identifyFromPhoto').addEventListener('click', identifyFromCatchPhoto);
}

function setActiveView(view) {
    state.currentView = view;

    // Update nav buttons
    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Handle view-specific actions
    switch (view) {
        case 'spots':
            openSidebar('spots');
            break;
        case 'log':
            openSidebar('log');
            break;
        case 'community':
            openSidebar('community');
            break;
        case 'identify':
            openModal('identifyModal');
            break;
        default:
            closeSidebar();
    }
}

// ===== Modal Functions =====
function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
}

function openAddSpotModal(lat, lng) {
    document.getElementById('spotLat').value = lat;
    document.getElementById('spotLng').value = lng;
    document.getElementById('addSpotForm').reset();
    openModal('addSpotModal');
}

// ===== Sidebar Functions =====
function openSidebar(type) {
    const sidebar = document.getElementById('sidebar');
    const title = document.getElementById('sidebarTitle');
    const content = document.getElementById('sidebarContent');

    sidebar.classList.add('open');

    switch (type) {
        case 'spots':
            title.textContent = '📍 Fishing Spots';
            content.innerHTML = renderSpotsList();
            break;
        case 'log':
            title.textContent = '📖 My Catch Log';
            content.innerHTML = renderCatchLog();
            break;
        case 'community':
            title.textContent = '💬 Community';
            content.innerHTML = renderCommunity();
            break;
        case 'profile':
            title.textContent = '👤 My Profile';
            content.innerHTML = renderProfile();
            break;
    }
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
}

// ===== Add Spot =====
function handleAddSpot(e) {
    e.preventDefault();

    const spot = {
        id: 'spot_' + Date.now(),
        name: document.getElementById('spotName').value,
        type: document.getElementById('spotType').value,
        description: document.getElementById('spotDescription').value,
        lat: parseFloat(document.getElementById('spotLat').value),
        lng: parseFloat(document.getElementById('spotLng').value),
        rating: 0,
        reviews: [],
        createdAt: new Date().toISOString()
    };

    state.spots.push(spot);
    saveData();
    renderSpots();
    closeAllModals();
    showToast('📍', `Added "${spot.name}" to the map!`);
}

// ===== Log Catch =====
function handleLogCatch(e) {
    e.preventDefault();

    const species = document.getElementById('catchSpecies').value;
    const weight = parseFloat(document.getElementById('catchWeight').value) || 0;
    const length = parseFloat(document.getElementById('catchLength').value) || 0;
    const spotId = document.getElementById('catchSpot').value;
    const notes = document.getElementById('catchNotes').value;
    const photoInput = document.getElementById('catchPhoto');

    // Calculate score
    const scoreBreakdown = calculateCatchScore(species, weight);

    const catchEntry = {
        id: 'catch_' + Date.now(),
        species,
        weight,
        length,
        spotId,
        notes,
        photo: photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) : null,
        score: scoreBreakdown.total,
        date: new Date().toISOString()
    };

    state.catches.unshift(catchEntry);

    // Update user stats
    state.user.totalPoints += scoreBreakdown.total;

    // Check for first of species
    if (!state.user.caughtSpecies.includes(species.toLowerCase())) {
        state.user.caughtSpecies.push(species.toLowerCase());
        scoreBreakdown.breakdown.push('First catch of species: +25');
        scoreBreakdown.total += 25;
        state.user.totalPoints += 25;
    }

    // Update streak
    const today = new Date().toDateString();
    if (state.user.lastFishingDate !== today) {
        if (state.user.lastFishingDate) {
            const lastDate = new Date(state.user.lastFishingDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate.toDateString() === yesterday.toDateString()) {
                state.user.streak++;
            } else {
                state.user.streak = 1;
            }
        } else {
            state.user.streak = 1;
        }
        state.user.lastFishingDate = today;
    }

    // Check badges
    checkBadges(catchEntry);

    saveData();
    closeAllModals();

    // Show score popup
    showScorePopup(scoreBreakdown);

    // Reset form
    document.getElementById('logCatchForm').reset();
    document.getElementById('photoPreview').innerHTML = `
        <span class="upload-icon">📷</span>
        <span>Tap to add photo</span>
    `;
}

function calculateCatchScore(species, weight) {
    let total = 0;
    const breakdown = [];

    // Base points for catch
    total += 10;
    breakdown.push('Base catch: +10');

    // Weight bonus
    if (weight > 0) {
        const weightPoints = Math.round(weight * 10);
        total += weightPoints;
        breakdown.push(`Weight (${weight}kg): +${weightPoints}`);
    }

    // Rarity bonus
    const fishKey = species.toLowerCase().replace(/\s+/g, '_');
    const fishData = FISH_DATABASE[fishKey];
    if (fishData) {
        const rarityPoints = RARITY_POINTS[fishData.rarity] || 5;
        total += rarityPoints;
        breakdown.push(`Rarity (${fishData.rarity}): +${rarityPoints}`);
    }

    // Streak bonus
    if (state.user.streak > 1) {
        const streakBonus = Math.round(total * (state.user.streak * 0.1));
        total += streakBonus;
        breakdown.push(`Streak x${state.user.streak}: +${streakBonus}`);
    }

    return { total, breakdown };
}

function showScorePopup(scoreData) {
    const popup = document.getElementById('scorePopup');
    popup.querySelector('.score-points').textContent = `+${scoreData.total}`;
    popup.querySelector('.score-breakdown').innerHTML = scoreData.breakdown.join('<br>');

    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// ===== Fish Identifier =====
function handleIdentifyPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    const preview = document.getElementById('identifyPreview');
    preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Fish photo">`;

    // Simulate AI identification
    setTimeout(() => {
        const result = simulateFishIdentification();
        renderIdentificationResult(result);
    }, 1500);
}

function identifyFromCatchPhoto() {
    const photoInput = document.getElementById('catchPhoto');
    if (!photoInput.files[0]) {
        showToast('⚠️', 'Please add a photo first');
        return;
    }

    // Simulate identification and fill species field
    const result = simulateFishIdentification();
    document.getElementById('catchSpecies').value = result.name;
    document.getElementById('speciesSuggestion').textContent =
        `🤖 AI identified: ${result.name} (${Math.round(result.confidence * 100)}% confident)`;
}

function simulateFishIdentification() {
    // Randomly select a fish for demo purposes
    const fishKeys = Object.keys(FISH_DATABASE);
    const randomKey = fishKeys[Math.floor(Math.random() * fishKeys.length)];
    const fish = FISH_DATABASE[randomKey];

    return {
        ...fish,
        confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
        identified: true
    };
}

function renderIdentificationResult(result) {
    const container = document.getElementById('identifyResult');

    container.innerHTML = `
        <div class="fish-card">
            <div class="fish-card-header">
                <div class="fish-card-icon">🐟</div>
                <div class="fish-card-info">
                    <h4>${result.name} <span class="rarity-badge rarity-${result.rarity}">${result.rarity}</span></h4>
                    <span>${result.habitat}</span>
                </div>
            </div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${result.confidence * 100}%"></div>
            </div>
            <p style="margin-top: 8px; font-size: 0.85rem; color: var(--text-secondary);">
                Confidence: ${Math.round(result.confidence * 100)}%
            </p>
            <div class="fish-stats">
                <div class="fish-stat">
                    <div class="fish-stat-value">${result.avgWeight}kg</div>
                    <div class="fish-stat-label">Avg Weight</div>
                </div>
                <div class="fish-stat">
                    <div class="fish-stat-value">${RARITY_POINTS[result.rarity]}</div>
                    <div class="fish-stat-label">Points</div>
                </div>
                <div class="fish-stat">
                    <div class="fish-stat-value">🎣</div>
                    <div class="fish-stat-label">${result.bestBait.split(',')[0]}</div>
                </div>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
            </div>
        </div>
    `;
}

// ===== Community/Social Features =====
function renderCommunity() {
    return `
        <div class="community-container">
            <!-- Community Tabs -->
            <div class="community-tabs">
                <button class="community-tab active" onclick="switchCommunityTab('chat')">💬 Chat</button>
                <button class="community-tab" onclick="switchCommunityTab('reports')">📸 Reports</button>
                <button class="community-tab" onclick="switchCommunityTab('active')">👥 Active</button>
            </div>
            
            <!-- Chat Section -->
            <div class="community-section" id="chatSection">
                <div class="chat-messages" id="chatMessages">
                    ${SAMPLE_COMMUNITY.messages.map(msg => `
                        <div class="chat-message">
                            <div class="chat-avatar">${msg.avatar}</div>
                            <div class="chat-content">
                                <div class="chat-header">
                                    <span class="chat-user">${msg.user}</span>
                                    <span class="chat-time">${msg.time}</span>
                                </div>
                                <div class="chat-text">${msg.text}</div>
                                <div class="chat-actions">
                                    <button class="chat-like-btn" onclick="likeChatMessage('${msg.id}')">❤️ ${msg.likes}</button>
                                    <button class="chat-reply-btn">↩️ Reply</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="chat-input-container">
                    <input type="text" id="chatInput" placeholder="Share fishing tips or ask questions..." class="chat-input">
                    <button class="chat-send-btn" onclick="sendChatMessage()">📤</button>
                </div>
            </div>
            
            <!-- Reports Section -->
            <div class="community-section hidden" id="reportsSection">
                <div class="fishing-reports">
                    ${SAMPLE_COMMUNITY.reports.map(report => `
                        <div class="fishing-report">
                            <div class="report-header">
                                <span class="report-avatar">${report.avatar}</span>
                                <span class="report-user">${report.user}</span>
                                <span class="report-time">${report.time}</span>
                            </div>
                            <div class="report-catch">
                                <div class="report-fish-icon">🐟</div>
                                <div class="report-details">
                                    <div class="report-species">${report.species}</div>
                                    <div class="report-meta">${report.weight}kg • ${report.spot}</div>
                                </div>
                            </div>
                            <div class="report-actions">
                                <button class="report-btn" onclick="likeReport('${report.id}')">❤️ ${report.likes}</button>
                                <button class="report-btn">💬 ${report.comments}</button>
                                <button class="report-btn">📍 View Spot</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Active Users Section -->
            <div class="community-section hidden" id="activeSection">
                <div class="active-users-header">
                    <span class="online-dot"></span> ${SAMPLE_COMMUNITY.activeUsers.length} anglers active now
                </div>
                <div class="active-users-list">
                    ${SAMPLE_COMMUNITY.activeUsers.map(user => `
                        <div class="active-user">
                            <div class="active-avatar">${user.avatar}</div>
                            <div class="active-info">
                                <div class="active-name">${user.name}</div>
                                <div class="active-status">${user.status}</div>
                            </div>
                            <button class="wave-btn" onclick="waveToUser('${user.name}')">👋</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function switchCommunityTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.community-tab').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(tab));
    });

    // Show/hide sections
    document.getElementById('chatSection').classList.toggle('hidden', tab !== 'chat');
    document.getElementById('reportsSection').classList.toggle('hidden', tab !== 'reports');
    document.getElementById('activeSection').classList.toggle('hidden', tab !== 'active');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add message to UI
    const chatMessages = document.getElementById('chatMessages');
    const newMsg = document.createElement('div');
    newMsg.className = 'chat-message my-message';
    newMsg.innerHTML = `
        <div class="chat-avatar">🏆</div>
        <div class="chat-content">
            <div class="chat-header">
                <span class="chat-user">${state.user.name}</span>
                <span class="chat-time">Just now</span>
            </div>
            <div class="chat-text">${message}</div>
            <div class="chat-actions">
                <button class="chat-like-btn">❤️ 0</button>
                <button class="chat-reply-btn">↩️ Reply</button>
            </div>
        </div>
    `;

    chatMessages.insertBefore(newMsg, chatMessages.firstChild);
    input.value = '';

    showToast('💬', 'Message sent!');

    // Simulate reply after 2 seconds
    setTimeout(() => {
        const replies = [
            { user: 'TomanHunter', avatar: '🎣', text: 'Best of luck bro! 💪' },
            { user: 'SiakApLover', avatar: '🐟', text: 'Semoga dapat banyak ikan!' },
            { user: 'LocalAngler', avatar: '🌊', text: 'Nice! Jom share tips?' }
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg = document.createElement('div');
        replyMsg.className = 'chat-message';
        replyMsg.innerHTML = `
            <div class="chat-avatar">${reply.avatar}</div>
            <div class="chat-content">
                <div class="chat-header">
                    <span class="chat-user">${reply.user}</span>
                    <span class="chat-time">Just now</span>
                </div>
                <div class="chat-text">${reply.text}</div>
                <div class="chat-actions">
                    <button class="chat-like-btn">❤️ 1</button>
                    <button class="chat-reply-btn">↩️ Reply</button>
                </div>
            </div>
        `;

        const chatMsgs = document.getElementById('chatMessages');
        if (chatMsgs) {
            chatMsgs.insertBefore(replyMsg, chatMsgs.firstChild);
        }
    }, 2000);
}

function likeChatMessage(id) {
    showToast('❤️', 'Liked!');
}

function likeReport(id) {
    showToast('❤️', 'Liked fishing report!');
}

function waveToUser(name) {
    showToast('👋', `Waved at ${name}!`);
}

// ===== Fish Activity Forecast =====
function renderForecast() {
    const forecast = calculateFishForecast();
    const container = document.getElementById('forecastContent');

    container.innerHTML = `
        <div class="forecast-header">
            <div class="forecast-score">
                <div class="forecast-score-value">${forecast.score}</div>
                <div class="forecast-score-label">Activity Score</div>
            </div>
            <div class="forecast-rating ${forecast.ratingClass}">${forecast.ratingText}</div>
        </div>
        
        <div class="forecast-factors">
            ${forecast.factors.map(f => `
                <div class="forecast-factor">
                    <div class="factor-icon">${f.icon}</div>
                    <div class="factor-info">
                        <div class="factor-name">${f.name}</div>
                        <div class="factor-value">${f.value}</div>
                    </div>
                    <div class="factor-score">${f.score > 0 ? '+' : ''}${f.score}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="forecast-times">
            <h4>Best Times to Fish Today</h4>
            <div class="time-slots">
                ${forecast.bestTimes.map(t => `
                    <div class="time-slot ${t.type}">${t.time}</div>
                `).join('')}
            </div>
        </div>
    `;
}

function calculateFishForecast() {
    const now = new Date();
    const hour = now.getHours();

    // Moon phase calculation (simplified)
    const moonDay = Math.floor((now.getTime() / 86400000) % 29.5);
    let moonPhase, moonScore;
    if (moonDay < 3 || moonDay > 26) {
        moonPhase = '🌑 New Moon';
        moonScore = 20;
    } else if (moonDay >= 12 && moonDay <= 17) {
        moonPhase = '🌕 Full Moon';
        moonScore = 18;
    } else if (moonDay >= 5 && moonDay <= 10) {
        moonPhase = '🌓 First Quarter';
        moonScore = 10;
    } else {
        moonPhase = '🌗 Last Quarter';
        moonScore = 10;
    }

    // Time of day
    let timeOfDay, timeScore;
    if (hour >= 5 && hour <= 8) {
        timeOfDay = 'Dawn - Prime feeding time';
        timeScore = 25;
    } else if (hour >= 17 && hour <= 20) {
        timeOfDay = 'Dusk - Excellent activity';
        timeScore = 25;
    } else if (hour >= 9 && hour <= 11) {
        timeOfDay = 'Late morning - Good activity';
        timeScore = 15;
    } else if (hour >= 21 || hour <= 4) {
        timeOfDay = 'Night - Moderate for nocturnal species';
        timeScore = 10;
    } else {
        timeOfDay = 'Midday - Lower activity';
        timeScore = 5;
    }

    // Simulated weather (in a real app, would use API)
    const weatherConditions = ['Overcast', 'Partly cloudy', 'Clear', 'Light rain'];
    const weatherScores = [20, 15, 10, 18];
    const weatherIdx = Math.floor(Math.random() * weatherConditions.length);
    const weather = weatherConditions[weatherIdx];
    const weatherScore = weatherScores[weatherIdx];

    // Pressure (simulated)
    const pressure = 1013 + Math.floor(Math.random() * 20 - 10);
    const pressureScore = pressure > 1015 ? 15 : pressure > 1010 ? 10 : 5;

    const totalScore = moonScore + timeScore + weatherScore + pressureScore;

    let ratingText, ratingClass;
    if (totalScore >= 65) {
        ratingText = '🔥 Excellent';
        ratingClass = 'rating-excellent';
    } else if (totalScore >= 50) {
        ratingText = '👍 Good';
        ratingClass = 'rating-good';
    } else if (totalScore >= 35) {
        ratingText = '😐 Fair';
        ratingClass = 'rating-fair';
    } else {
        ratingText = '👎 Poor';
        ratingClass = 'rating-poor';
    }

    // Best times
    const bestTimes = [
        { time: '5:30 - 7:00 AM', type: 'major' },
        { time: '11:00 - 12:00 PM', type: '' },
        { time: '5:00 - 7:30 PM', type: 'major' },
        { time: '10:30 - 11:30 PM', type: '' }
    ];

    return {
        score: totalScore,
        ratingText,
        ratingClass,
        factors: [
            { icon: '🌙', name: 'Moon Phase', value: moonPhase, score: moonScore },
            { icon: '🕐', name: 'Time of Day', value: timeOfDay, score: timeScore },
            { icon: '☁️', name: 'Weather', value: weather, score: weatherScore },
            { icon: '📊', name: 'Barometric Pressure', value: `${pressure} hPa`, score: pressureScore }
        ],
        bestTimes
    };
}

// ===== Leaderboard =====
function renderLeaderboard() {
    const container = document.getElementById('leaderboardContent');

    // Generate sample leaderboard data
    const leaderboardData = generateLeaderboardData();

    container.innerHTML = `
        <div class="leaderboard-tabs">
            <button class="leaderboard-tab active" data-type="points">🏆 All-Time</button>
            <button class="leaderboard-tab" data-type="weekly">📅 This Week</button>
            <button class="leaderboard-tab" data-type="biggest">🐟 Biggest Catch</button>
        </div>
        <div class="leaderboard-list" id="leaderboardList">
            ${renderLeaderboardItems(leaderboardData.points)}
        </div>
    `;

    // Tab switching
    container.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            container.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('leaderboardList').innerHTML =
                renderLeaderboardItems(leaderboardData[tab.dataset.type]);
        });
    });
}

function generateLeaderboardData() {
    const names = ['FishMaster99', 'LakeKing', 'TroutWhisperer', 'BassPro', 'ReelDeal',
        'CatchKing', 'AnglerX', 'DeepSeaDan'];

    // Add current user
    const allUsers = [...names.map((name, i) => ({
        name,
        points: Math.floor(Math.random() * 5000) + 1000,
        catches: Math.floor(Math.random() * 50) + 10,
        biggestCatch: (Math.random() * 10 + 1).toFixed(1),
        isCurrentUser: false
    })), {
        name: state.user.name,
        points: state.user.totalPoints,
        catches: state.catches.length,
        biggestCatch: state.catches.length > 0 ?
            Math.max(...state.catches.map(c => c.weight || 0)).toFixed(1) : '0.0',
        isCurrentUser: true
    }];

    return {
        points: [...allUsers].sort((a, b) => b.points - a.points),
        weekly: [...allUsers].sort((a, b) => b.catches - a.catches),
        biggest: [...allUsers].sort((a, b) => parseFloat(b.biggestCatch) - parseFloat(a.biggestCatch))
    };
}

function renderLeaderboardItems(data) {
    return data.slice(0, 10).map((user, i) => `
        <div class="leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}">
            <div class="rank ${i < 3 ? 'rank-' + (i + 1) : ''}">${i + 1}</div>
            <div class="leaderboard-user">
                <div class="leaderboard-name">${user.name} ${user.isCurrentUser ? '(You)' : ''}</div>
                <div class="leaderboard-catches">${user.catches} catches</div>
            </div>
            <div class="leaderboard-score">${user.points.toLocaleString()}</div>
        </div>
    `).join('');
}

// ===== Render Functions =====
function renderSpotsList() {
    if (state.spots.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🗺️</div>
                <h3>No spots yet</h3>
                <p>Tap on the map to add your first fishing spot!</p>
            </div>
        `;
    }

    return state.spots.map(spot => `
        <div class="spot-card" onclick="openSpotDetails(${JSON.stringify(spot).replace(/"/g, '&quot;')})">
            <div class="spot-card-header">
                <div class="spot-type-icon ${spot.type}">${getSpotIcon(spot.type)}</div>
                <div>
                    <div class="spot-name">${spot.name}</div>
                    <div class="spot-rating">
                        ${'⭐'.repeat(Math.floor(spot.rating || 0))}
                        ${spot.rating ? spot.rating.toFixed(1) : 'No ratings'}
                    </div>
                </div>
            </div>
            <div class="spot-description">${spot.description || 'No description'}</div>
            <div class="spot-meta">
                <span>📝 ${spot.reviews?.length || 0} reviews</span>
            </div>
        </div>
    `).join('');
}

function renderCatchLog() {
    if (state.catches.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🎣</div>
                <h3>No catches yet</h3>
                <p>Log your first catch to start earning points!</p>
            </div>
        `;
    }

    return state.catches.map(c => {
        const date = new Date(c.date);
        return `
            <div class="catch-card">
                ${c.photo ? `<img src="${c.photo}" alt="${c.species}" class="catch-photo">` :
                '<div class="catch-photo" style="display:flex;align-items:center;justify-content:center;font-size:2rem;">🐟</div>'}
                <div class="catch-info">
                    <div class="catch-species">${c.species}</div>
                    <div class="catch-details">
                        ${c.weight ? c.weight + 'kg' : ''} 
                        ${c.length ? ' • ' + c.length + 'cm' : ''}
                        ${c.notes ? '<br>' + c.notes : ''}
                    </div>
                </div>
                <div class="catch-score">
                    <div class="catch-points">+${c.score}</div>
                    <div class="catch-date">${date.toLocaleDateString()}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderProfile() {
    const badges = [
        { id: 'first_catch', icon: '🎣', name: 'First Catch', earned: state.catches.length > 0 },
        { id: 'on_fire', icon: '🔥', name: 'On Fire', earned: state.user.streak >= 7 },
        { id: 'century', icon: '🏅', name: 'Century Club', earned: state.catches.length >= 100 },
        { id: 'species_master', icon: '🐟', name: 'Species Master', earned: state.user.caughtSpecies.length >= 10 },
        { id: 'night_owl', icon: '🌙', name: 'Night Owl', earned: state.user.badges.includes('night_owl') }
    ];

    return `
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 4rem; margin-bottom: 8px;">🎣</div>
            <h3 style="font-size: 1.5rem;">${state.user.name}</h3>
            <p style="color: var(--text-secondary);">Total Points: <strong style="color: var(--accent-primary);">${state.user.totalPoints.toLocaleString()}</strong></p>
        </div>
        
        <div class="weather-widget" style="justify-content: space-around;">
            <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-primary);">${state.catches.length}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Catches</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-primary);">${state.user.streak}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Day Streak</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-primary);">${state.user.caughtSpecies.length}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Species</div>
            </div>
        </div>
        
        <h4 style="margin: 24px 0 16px; font-size: 0.9rem; text-transform: uppercase; color: var(--text-secondary);">Badges</h4>
        <div class="badges-grid">
            ${badges.map(b => `
                <div class="badge-item ${b.earned ? 'earned' : ''}">
                    <div class="badge-icon">${b.icon}</div>
                    <div class="badge-name">${b.name}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ===== Spot Details =====
function openSpotDetails(spot) {
    state.selectedSpot = spot;

    const modal = document.getElementById('spotDetailsModal');
    document.getElementById('spotDetailsTitle').textContent = spot.name;

    const catches = state.catches.filter(c => c.spotId === spot.id);

    document.getElementById('spotDetailsContent').innerHTML = `
        <div class="weather-widget">
            <div class="spot-type-icon ${spot.type}" style="width: 60px; height: 60px; font-size: 1.8rem;">${getSpotIcon(spot.type)}</div>
            <div class="weather-info">
                <h4>${spot.name}</h4>
                <p>${spot.type.charAt(0).toUpperCase() + spot.type.slice(1)} • ${spot.rating || 'No'} rating</p>
            </div>
        </div>
        
        <p style="margin-bottom: 16px; color: var(--text-secondary);">${spot.description || 'No description available.'}</p>
        
        <div class="weather-details">
            <div class="weather-detail">📍 ${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)}</div>
            <div class="weather-detail">🎣 ${catches.length} catches here</div>
        </div>
        
        <div class="review-section">
            <h4 style="margin-bottom: 16px;">Leave a Review</h4>
            <div class="star-rating" id="starRating">
                ${[1, 2, 3, 4, 5].map(i => `<button type="button" data-rating="${i}">⭐</button>`).join('')}
            </div>
            <textarea id="reviewText" rows="2" placeholder="Share your experience..." style="width: 100%; margin-bottom: 12px;"></textarea>
            <button class="btn btn-primary" onclick="submitReview()" style="width: 100%;">Submit Review</button>
        </div>
        
        ${spot.reviews?.length > 0 ? `
            <div class="review-list">
                ${spot.reviews.map(r => `
                    <div class="review-item">
                        <div class="review-header">
                            <span class="review-author">${r.user}</span>
                            <span class="review-date">${new Date(r.date).toLocaleDateString()}</span>
                        </div>
                        <div class="review-stars">${'⭐'.repeat(r.stars)}</div>
                        <div class="review-text">${r.text}</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;

    // Star rating interaction
    const starRating = document.getElementById('starRating');
    let selectedRating = 0;
    starRating.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedRating = parseInt(btn.dataset.rating);
            starRating.querySelectorAll('button').forEach((b, i) => {
                b.classList.toggle('active', i < selectedRating);
            });
        });
    });

    window.submitReview = () => {
        const text = document.getElementById('reviewText').value;
        if (!selectedRating) {
            showToast('⚠️', 'Please select a star rating');
            return;
        }

        const review = {
            user: state.user.name,
            stars: selectedRating,
            text,
            date: new Date().toISOString()
        };

        const spotIndex = state.spots.findIndex(s => s.id === spot.id);
        if (!state.spots[spotIndex].reviews) {
            state.spots[spotIndex].reviews = [];
        }
        state.spots[spotIndex].reviews.push(review);

        // Update rating
        const reviews = state.spots[spotIndex].reviews;
        state.spots[spotIndex].rating = reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;

        saveData();
        closeAllModals();
        showToast('⭐', 'Review submitted!');
    };

    openModal('spotDetailsModal');
}

// ===== Badges =====
function checkBadges(catchEntry) {
    const now = new Date(catchEntry.date);
    const hour = now.getHours();

    // Night Owl badge
    if (hour >= 0 && hour <= 4 && !state.user.badges.includes('night_owl')) {
        state.user.badges.push('night_owl');
        showToast('🏆', 'Badge unlocked: Night Owl!');
    }
}

// ===== Utilities =====
function populateSpotSelect() {
    const select = document.getElementById('catchSpot');
    select.innerHTML = '<option value="">Select a spot...</option>' +
        state.spots.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

function setupPhotoPreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Photo preview">`;
        }
    });
}

function showToast(icon, message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ===== Solunar Pinpoint Mode =====
function toggleSolunarMode() {
    state.solunarMode = !state.solunarMode;
    const btn = document.getElementById('solunarPinBtn');

    if (state.solunarMode) {
        btn.classList.add('active');
        showToast('📍', 'Tap anywhere on map for location forecast!');
        document.getElementById('map').style.cursor = 'crosshair';
    } else {
        btn.classList.remove('active');
        document.getElementById('map').style.cursor = '';
        if (state.solunarMarker) {
            state.solunarMarker.remove();
            state.solunarMarker = null;
        }
    }
}

async function showPinpointSolunar(lat, lng) {
    // Clear previous marker
    if (state.solunarMarker) {
        state.solunarMarker.remove();
    }

    // Add new marker
    const icon = L.divIcon({
        className: 'solunar-marker',
        html: '<div class="solunar-pin">📍</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });

    state.solunarMarker = L.marker([lat, lng], { icon }).addTo(state.map);

    // Show loading popup first
    const loadingPopup = L.popup({
        className: 'solunar-popup',
        maxWidth: 300
    })
        .setLatLng([lat, lng])
        .setContent(`
        <div class="solunar-content" style="text-align: center; padding: 30px;">
            <div style="font-size: 2rem; animation: pulse 1s infinite;">🌊</div>
            <div style="margin-top: 10px;">Fetching real-time weather data...</div>
        </div>
    `)
        .openOn(state.map);

    // Fetch real weather data (async)
    const forecast = await calculateLocationSolunar(lat, lng);

    // Show popup with forecast
    const popup = L.popup({
        className: 'solunar-popup',
        maxWidth: 320
    })
        .setLatLng([lat, lng])
        .setContent(`
        <div class="solunar-content">
            <h4>📍 Solunar Forecast ${forecast.isRealData ? '<span style="font-size:0.7em;background:#00e676;color:#0a1628;padding:2px 6px;border-radius:4px;">LIVE</span>' : ''}</h4>
            <div class="solunar-coords">${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</div>
            
            <div class="solunar-score-circle ${forecast.ratingClass}">
                <span class="score-value">${forecast.score}</span>
                <span class="score-label">/ 100</span>
            </div>
            <div class="solunar-rating">${forecast.ratingText}</div>
            
            <div class="solunar-factors">
                ${forecast.factors.map(f => `
                    <div class="mini-factor">
                        <span>${f.icon}</span>
                        <span>${f.name}: ${f.value}</span>
                        <span class="factor-pts">${f.score > 0 ? '+' : ''}${f.score}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="solunar-times">
                <strong>🎯 Best Times Today:</strong><br>
                ${forecast.bestTimes.map(t => `
                    <span class="time-chip ${t.type}">${t.time}</span>
                `).join('')}
            </div>
            
            <button onclick="closeSolunarPopup()" class="btn-close-popup">Close</button>
        </div>
    `)
        .openOn(state.map);
}

function closeSolunarPopup() {
    state.map.closePopup();
}

function calculateLocationSolunar(lat, lng) {
    // Return a promise that fetches real weather data
    return fetchRealWeatherData(lat, lng);
}

// Fetch real weather data from Open-Meteo API (free, no key needed)
async function fetchRealWeatherData(lat, lng) {
    const now = new Date();
    const hour = now.getHours();

    // Moon phase calculation (mathematical - accurate)
    const moonDay = Math.floor((now.getTime() / 86400000) % 29.5);
    let moonPhase, moonScore, moonEmoji;
    if (moonDay < 2 || moonDay > 27) {
        moonPhase = 'New Moon';
        moonEmoji = '🌑';
        moonScore = 22; // Best for fishing
    } else if (moonDay >= 13 && moonDay <= 16) {
        moonPhase = 'Full Moon';
        moonEmoji = '🌕';
        moonScore = 20;
    } else if (moonDay >= 6 && moonDay <= 8) {
        moonPhase = 'First Quarter';
        moonEmoji = '🌓';
        moonScore = 15;
    } else if (moonDay >= 21 && moonDay <= 23) {
        moonPhase = 'Last Quarter';
        moonEmoji = '🌗';
        moonScore = 15;
    } else if (moonDay > 2 && moonDay < 6) {
        moonPhase = 'Waxing Crescent';
        moonEmoji = '🌒';
        moonScore = 18;
    } else if (moonDay > 8 && moonDay < 13) {
        moonPhase = 'Waxing Gibbous';
        moonEmoji = '🌔';
        moonScore = 12;
    } else if (moonDay > 16 && moonDay < 21) {
        moonPhase = 'Waning Gibbous';
        moonEmoji = '🌖';
        moonScore = 12;
    } else {
        moonPhase = 'Waning Crescent';
        moonEmoji = '🌘';
        moonScore = 18;
    }

    // Time of day scoring (always accurate)
    let timeOfDay, timeScore;
    if (hour >= 5 && hour <= 7) {
        timeOfDay = 'Golden Hour 🌅';
        timeScore = 28;
    } else if (hour >= 17 && hour <= 19) {
        timeOfDay = 'Sunset Prime 🌇';
        timeScore = 28;
    } else if (hour >= 8 && hour <= 10) {
        timeOfDay = 'Morning Active';
        timeScore = 18;
    } else if (hour >= 20 && hour <= 22) {
        timeOfDay = 'Night Bite 🌙';
        timeScore = 15;
    } else if (hour >= 11 && hour <= 14) {
        timeOfDay = 'Midday Slow';
        timeScore = 8;
    } else {
        timeOfDay = 'Moderate';
        timeScore = 12;
    }

    // Default values (used if API fails)
    let weatherData = {
        pressure: 1013,
        temperature: 28,
        windSpeed: 10,
        cloudCover: 50,
        humidity: 70,
        isRaining: false,
        sunrise: '06:30',
        sunset: '19:00'
    };
    let isRealData = false;

    try {
        // Fetch real weather from Open-Meteo API
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,surface_pressure,wind_speed_10m,cloud_cover&daily=sunrise,sunset&timezone=Asia%2FKuala_Lumpur`
        );

        if (response.ok) {
            const data = await response.json();
            weatherData = {
                pressure: Math.round(data.current.surface_pressure),
                temperature: Math.round(data.current.temperature_2m),
                windSpeed: Math.round(data.current.wind_speed_10m),
                cloudCover: data.current.cloud_cover,
                humidity: data.current.relative_humidity_2m,
                isRaining: data.current.rain > 0,
                sunrise: data.daily.sunrise[0].split('T')[1].substring(0, 5),
                sunset: data.daily.sunset[0].split('T')[1].substring(0, 5)
            };
            isRealData = true;
        }
    } catch (e) {
        console.log('Weather API failed, using estimates:', e);
    }

    // Calculate scores based on real weather
    let pressureScore, pressureStatus;
    if (weatherData.pressure >= 1020) {
        pressureStatus = 'High Stable ✓';
        pressureScore = 18;
    } else if (weatherData.pressure >= 1013) {
        pressureStatus = 'Normal';
        pressureScore = 15;
    } else if (weatherData.pressure >= 1005) {
        pressureStatus = 'Falling ⚠️';
        pressureScore = 10; // Fish often feed before storms
    } else {
        pressureStatus = 'Low/Storm';
        pressureScore = 5;
    }

    // Wind scoring (affects fishing conditions)
    let windScore, windStatus;
    if (weatherData.windSpeed <= 5) {
        windStatus = 'Calm 😊';
        windScore = 12;
    } else if (weatherData.windSpeed <= 15) {
        windStatus = 'Light Breeze';
        windScore = 15; // Some wind is good
    } else if (weatherData.windSpeed <= 25) {
        windStatus = 'Moderate 💨';
        windScore = 8;
    } else {
        windStatus = 'Strong ⚠️';
        windScore = 3;
    }

    // Cloud cover scoring
    let cloudScore;
    if (weatherData.cloudCover >= 60 && weatherData.cloudCover <= 80) {
        cloudScore = 5; // Overcast is good
    } else if (weatherData.cloudCover >= 30) {
        cloudScore = 3; // Partly cloudy
    } else {
        cloudScore = 2; // Clear or heavy overcast
    }

    // Rain penalty
    if (weatherData.isRaining) {
        pressureScore -= 5;
    }

    // Tide estimation based on moon phase and time
    const tidalHour = (hour + moonDay) % 12;
    let tideStatus, tideScore;
    if (tidalHour >= 0 && tidalHour < 3) {
        tideStatus = 'Rising Tide ⬆️';
        tideScore = 18;
    } else if (tidalHour >= 3 && tidalHour < 6) {
        tideStatus = 'High Tide 🌊';
        tideScore = 12;
    } else if (tidalHour >= 6 && tidalHour < 9) {
        tideStatus = 'Falling Tide ⬇️';
        tideScore = 18;
    } else {
        tideStatus = 'Low Tide';
        tideScore = 10;
    }

    const totalScore = moonScore + timeScore + tideScore + pressureScore + windScore + cloudScore;
    const maxScore = 22 + 28 + 18 + 18 + 15 + 5; // 106
    const normalizedScore = Math.round((totalScore / maxScore) * 100);

    let ratingText, ratingClass;
    if (normalizedScore >= 75) {
        ratingText = '🔥 EXCELLENT';
        ratingClass = 'rating-excellent';
    } else if (normalizedScore >= 55) {
        ratingText = '👍 GOOD';
        ratingClass = 'rating-good';
    } else if (normalizedScore >= 40) {
        ratingText = '😐 FAIR';
        ratingClass = 'rating-fair';
    } else {
        ratingText = '👎 POOR';
        ratingClass = 'rating-poor';
    }

    // Calculate best times based on sunrise/sunset
    const bestTimes = [
        { time: `${weatherData.sunrise} - 08:00`, type: 'major' },
        { time: '11:00 - 12:30', type: '' },
        { time: `17:00 - ${weatherData.sunset}`, type: 'major' },
        { time: '21:00 - 23:00', type: '' }
    ];

    return {
        score: normalizedScore,
        ratingText,
        ratingClass,
        isRealData,
        weatherData,
        factors: [
            { icon: moonEmoji, name: 'Moon', value: `${moonPhase}`, score: moonScore },
            { icon: '🕐', name: 'Time', value: timeOfDay, score: timeScore },
            { icon: '🌊', name: 'Tide', value: tideStatus, score: tideScore },
            { icon: '📊', name: 'Pressure', value: `${weatherData.pressure} hPa (${pressureStatus})`, score: pressureScore },
            { icon: '💨', name: 'Wind', value: `${weatherData.windSpeed} km/h (${windStatus})`, score: windScore },
            { icon: '🌡️', name: 'Weather', value: `${weatherData.temperature}°C, ${weatherData.cloudCover}% clouds`, score: cloudScore }
        ],
        bestTimes
    };
}

function updateUI() {
    // Update any dynamic UI elements
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed:', err));
}
