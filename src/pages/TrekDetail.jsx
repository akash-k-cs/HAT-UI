import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Clock, Mountain, MapPin, Star, Users, 
  ChevronRight, ChevronDown, ChevronUp, Check, Phone,
  Shield, Leaf, Award, Sun, CloudSnow, Thermometer,
  Camera, Utensils, Tent, Heart, ArrowLeft, Share2, Bookmark
} from 'lucide-react'
import { useEntryByField } from '../hooks/useContentstack'
import './TrekDetail.css'

// Default trek data for fallback
const defaultTreks = {
  'kedarkantha': {
    slug: 'kedarkantha',
    name: 'Kedarkantha',
    tagline: 'The Perfect Winter Trek for Everyone',
    hero_image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
    ],
    difficulty: 'Easy - Moderate',
    duration: '6 Days',
    altitude: '12,500 ft',
    price: 11850,
    original_price: 13500,
    rating: 4.9,
    reviews_count: 2450,
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    best_months: ['December', 'January', 'February', 'March', 'April'],
    trek_distance: '20 km',
    base_camp: 'Sankri',
    group_size: '15-25 trekkers',
    pickup_point: 'Dehradun Railway Station',
    
    short_description: 'Kedarkantha is one of the most popular winter treks in India, offering stunning views of snow-capped Himalayan peaks and pristine forests.',
    
    overview: `Kedarkantha is a quintessential Himalayan experience that combines moderate difficulty with extraordinary rewards. This trek takes you through dense pine and oak forests, charming mountain villages, and vast alpine meadows blanketed in snow during winter.

The summit climb on day 4 is the highlight, where you're rewarded with 360-degree views of some of the most spectacular peaks in the Garhwal Himalayas - Swargarohini, Bandarpoonch, Black Peak, and Kedarnath.

What makes this trek special is its accessibility. The trails are well-marked, the altitude is manageable, and the duration is perfect for a first Himalayan experience. Yet, the beauty rivals treks that are far more challenging.`,

    highlights: [
      'Summit climb with 360° views of Himalayan peaks',
      'Camp in snow-covered meadows at Kedarkantha Base',
      'Walk through ancient oak and pine forests',
      'Visit the pristine Juda Ka Talab (frozen lake)',
      'Experience authentic Garhwali village culture',
      'Perfect winter trek with stunning snow trails'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Dehradun to Sankri',
        altitude: '6,400 ft',
        distance: '210 km drive',
        time: '8-9 hours',
        description: 'Our team will pick you up from Dehradun Railway Station early morning. The scenic drive takes you through Mussoorie, Naugaon, Purola, and Mori before reaching Sankri. Enjoy the beautiful views of the Tons Valley along the way.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Guesthouse in Sankri'
      },
      {
        day: 2,
        title: 'Sankri to Juda Ka Talab',
        altitude: '9,100 ft',
        distance: '4 km',
        time: '4-5 hours',
        description: 'Begin your trek through a beautiful oak and pine forest. The trail gradually ascends, offering glimpses of snow-capped peaks. Juda Ka Talab is a serene clearing with a small lake that freezes in winter.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Juda Ka Talab'
      },
      {
        day: 3,
        title: 'Juda Ka Talab to Kedarkantha Base',
        altitude: '11,250 ft',
        distance: '4 km',
        time: '3-4 hours',
        description: 'A shorter day allows for acclimatization. The trail opens up to vast meadows (bugyal) offering panoramic views. Kedarkantha Base is a spectacular campsite with the summit visible in the distance.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Kedarkantha Base'
      },
      {
        day: 4,
        title: 'Summit Day & Descent to Hargaon',
        altitude: '12,500 ft (summit)',
        distance: '6 km',
        time: '7-8 hours',
        description: 'Wake up early for the summit push. The final ascent offers incredible views as the sun rises over the Himalayas. Reach the summit for 360° views of Swargarohini, Bandarpoonch, and Kedarnath. Descend to Hargaon for the night.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Hargaon'
      },
      {
        day: 5,
        title: 'Hargaon to Sankri',
        altitude: '6,400 ft',
        distance: '6 km',
        time: '4-5 hours',
        description: 'Descend through the forest back to Sankri. The downhill trail offers different perspectives of the mountains. Celebrate your successful summit with fellow trekkers in the evening.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Guesthouse in Sankri'
      },
      {
        day: 6,
        title: 'Sankri to Dehradun',
        altitude: '2,200 ft',
        distance: '210 km drive',
        time: '8-9 hours',
        description: 'After breakfast, begin your drive back to Dehradun. Expected arrival by evening. Carry memories and friendships that will last a lifetime.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'Accommodation (guesthouses and tents)',
      'All meals during the trek (veg)',
      'Experienced trek leaders and support staff',
      'First aid and medical kit',
      'Sleeping bags and mattresses',
      'Permits and forest entry fees',
      'Transport from Dehradun to Sankri and back',
      'Safety equipment (microspikes, gaiters)'
    ],

    exclusions: [
      'Personal expenses and tips',
      'Travel insurance',
      'Personal trekking gear (shoes, backpack, layers)',
      'Anything not mentioned in inclusions',
      'Buffer day accommodation',
      'Early morning pickup charges'
    ],

    things_to_carry: [
      'Trekking shoes with good grip',
      'Warm layers (down jacket, fleece)',
      'Rain jacket or poncho',
      'Gloves and woolen cap',
      'Sunglasses and sunscreen',
      'Personal water bottle (1L minimum)',
      'Head torch with extra batteries',
      'Personal medications',
      'Daypack (20-30L)'
    ],

    weather: {
      december: { high: '5°C', low: '-8°C', condition: 'Heavy Snow' },
      january: { high: '2°C', low: '-12°C', condition: 'Peak Winter' },
      february: { high: '4°C', low: '-10°C', condition: 'Heavy Snow' },
      march: { high: '10°C', low: '-5°C', condition: 'Snow Melting' },
      april: { high: '15°C', low: '2°C', condition: 'Clear Skies' }
    },

    upcoming_batches: [
      { date: 'Feb 15-20, 2026', slots: 8, price: 11850 },
      { date: 'Feb 22-27, 2026', slots: 12, price: 11850 },
      { date: 'Mar 1-6, 2026', slots: 15, price: 11850 },
      { date: 'Mar 8-13, 2026', slots: 10, price: 11850 },
      { date: 'Mar 15-20, 2026', slots: 18, price: 10850 },
      { date: 'Apr 5-10, 2026', slots: 20, price: 10850 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Rohit Sharma',
        location: 'Delhi',
        date: 'January 2026',
        rating: 5,
        title: 'Absolutely magical experience!',
        review: 'This was my first Himalayan trek and I couldn\'t have asked for a better experience. The trek leaders were incredibly supportive, the food was amazing, and the views were beyond anything I imagined.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
      },
      {
        id: 2,
        name: 'Meera Iyer',
        location: 'Bangalore',
        date: 'December 2025',
        rating: 5,
        title: 'Perfect winter wonderland',
        review: 'Walking through knee-deep snow to the summit was challenging but so rewarding. The sunrise from the top is something I\'ll never forget. Thank you HAT team!',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
      },
      {
        id: 3,
        name: 'Aditya Menon',
        location: 'Chennai',
        date: 'February 2026',
        rating: 5,
        title: 'Life-changing journey',
        review: 'The organization was flawless. From pickup to drop, everything was seamless. The campsite at Kedarkantha base was spectacular - waking up to those mountain views is unforgettable.',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'Is Kedarkantha suitable for beginners?',
        answer: 'Yes! Kedarkantha is one of the best treks for beginners. The trails are well-marked, the altitude is manageable, and the duration is perfect for a first Himalayan experience. However, basic fitness is required.'
      },
      {
        question: 'What is the best time to do this trek?',
        answer: 'December to April is the best time for Kedarkantha. December-February offers heavy snow and winter wonderland experience. March-April has milder weather with snow still present at higher altitudes.'
      },
      {
        question: 'How cold does it get?',
        answer: 'Temperatures can drop to -10°C to -15°C at night during peak winter (December-February). Good quality warm layers and a sleeping bag rated for -15°C are essential.'
      },
      {
        question: 'Is there network connectivity?',
        answer: 'You\'ll have BSNL network at Sankri. Beyond that, there\'s no mobile network during the trek. Use this as an opportunity to disconnect and immerse yourself in nature.'
      },
      {
        question: 'What if I cannot complete the trek?',
        answer: 'Safety is our priority. If you\'re unable to continue due to health reasons, our team will ensure you\'re safely escorted back. You can also avail our Trek Again policy.'
      }
    ],

    trek_leader: {
      name: 'Vikash Kumar',
      experience: '8 years',
      treks_led: 150,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      bio: 'Vikash has been leading Himalayan treks for over 8 years. Born in the Garhwal region, he has an intimate knowledge of these mountains and a passion for sharing their beauty with trekkers.'
    }
  },
  
  'kashmir-great-lakes': {
    slug: 'kashmir-great-lakes',
    name: 'Kashmir Great Lakes',
    tagline: 'A Journey Through Seven Alpine Lakes',
    hero_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80'
    ],
    difficulty: 'Moderate - Difficult',
    duration: '7 Days',
    altitude: '13,750 ft',
    price: 18950,
    original_price: 21500,
    rating: 4.9,
    reviews_count: 1820,
    region: 'Kashmir',
    state: 'Jammu & Kashmir',
    best_months: ['July', 'August', 'September'],
    trek_distance: '70 km',
    base_camp: 'Sonamarg',
    group_size: '15-20 trekkers',
    pickup_point: 'Srinagar Airport',
    
    short_description: 'Kashmir Great Lakes is arguably the most beautiful trek in India, taking you through seven stunning alpine lakes set amidst pristine meadows and towering peaks.',
    
    overview: `Kashmir Great Lakes (KGL) is often called the most beautiful trek in India, and for good reason. This 7-day expedition takes you through some of the most spectacular landscapes the Himalayas have to offer - crystal-clear alpine lakes, vast flower-filled meadows, and dramatic mountain passes.

The trek connects seven high-altitude lakes, each with its unique character and color. From the deep blue of Vishansar to the emerald green of Gadsar, each lake is a masterpiece of nature. The meadows around these lakes are carpeted with wildflowers during the monsoon season.

This is a moderately challenging trek that requires good fitness and prior trekking experience. The rewards, however, are beyond comparison - this is Kashmir at its untouched, pristine best.`,

    highlights: [
      'Camp beside 7 stunning alpine lakes',
      'Cross the dramatic Gadsar Pass (13,750 ft)',
      'Walk through flower-carpeted meadows',
      'Experience the legendary beauty of Kashmir',
      'Witness diverse landscapes daily',
      'See rare Himalayan wildlife'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Srinagar to Sonamarg to Nichnai',
        altitude: '11,500 ft',
        distance: '12 km',
        time: '6-7 hours',
        description: 'Drive from Srinagar to Sonamarg (3 hours) and begin your trek to Nichnai through beautiful alpine meadows and pine forests.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Tents at Nichnai'
      },
      {
        day: 2,
        title: 'Nichnai to Vishansar Lake',
        altitude: '12,000 ft',
        distance: '13 km',
        time: '7-8 hours',
        description: 'Cross the Nichnai Pass and descend to the stunning Vishansar Lake, one of the most beautiful sights on this trek.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Vishansar'
      },
      {
        day: 3,
        title: 'Vishansar to Gadsar Lake',
        altitude: '12,500 ft',
        distance: '14 km',
        time: '8-9 hours',
        description: 'A long but spectacular day crossing Gadsar Pass (13,750 ft), the highest point of the trek, before descending to emerald Gadsar Lake.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Gadsar'
      },
      {
        day: 4,
        title: 'Gadsar to Satsar Lakes',
        altitude: '12,000 ft',
        distance: '12 km',
        time: '6-7 hours',
        description: 'Trek to Satsar, a collection of seven small lakes. The meadows around are filled with wildflowers during the season.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Satsar'
      },
      {
        day: 5,
        title: 'Satsar to Gangabal Lake',
        altitude: '11,500 ft',
        distance: '11 km',
        time: '6-7 hours',
        description: 'Trek to the twin lakes of Gangabal and Nundkol, with stunning views of Mt. Harmukh reflected in the crystal-clear waters.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Gangabal'
      },
      {
        day: 6,
        title: 'Gangabal to Naranag',
        altitude: '7,450 ft',
        distance: '8 km',
        time: '5-6 hours',
        description: 'Descend through pine forests to Naranag, visiting ancient temple ruins along the way. Drive to Srinagar by evening.',
        meals: ['Breakfast', 'Lunch'],
        stay: 'Hotel in Srinagar'
      },
      {
        day: 7,
        title: 'Departure from Srinagar',
        altitude: '5,200 ft',
        distance: 'N/A',
        time: 'Flexible',
        description: 'Explore Srinagar or depart. Optional: Shikara ride on Dal Lake. Trek ends with lifelong memories.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Camping equipment and tents',
      'Expert trek leaders and local guides',
      'Transport from/to Srinagar',
      'Permits and entry fees',
      'Medical kit and safety equipment',
      'Porter charges for common luggage'
    ],

    exclusions: [
      'Personal porter/mule',
      'Travel insurance',
      'Personal trekking equipment',
      'Srinagar stay before/after trek',
      'Tips and gratuities'
    ],

    things_to_carry: [
      'Waterproof trekking shoes',
      'Rain gear (essential for monsoon)',
      'Warm layers for cold nights',
      'Trekking poles',
      'Water bottle and purification',
      'Camera (fully charged!)',
      'Personal medications'
    ],

    weather: {
      july: { high: '18°C', low: '5°C', condition: 'Monsoon' },
      august: { high: '17°C', low: '4°C', condition: 'Peak Flowers' },
      september: { high: '15°C', low: '2°C', condition: 'Clear Skies' }
    },

    upcoming_batches: [
      { date: 'Jul 5-11, 2026', slots: 6, price: 18950 },
      { date: 'Jul 15-21, 2026', slots: 10, price: 18950 },
      { date: 'Aug 1-7, 2026', slots: 15, price: 18950 },
      { date: 'Aug 15-21, 2026', slots: 12, price: 18950 },
      { date: 'Sep 1-7, 2026', slots: 18, price: 17950 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Priya Nair',
        location: 'Mumbai',
        date: 'August 2025',
        rating: 5,
        title: 'Paradise on Earth - literally!',
        review: 'No words can describe the beauty of these lakes. Every day brought a new spectacle. The organization was excellent and our trek leader Sameer was phenomenal.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      },
      {
        id: 2,
        name: 'Karthik Venkatesh',
        location: 'Hyderabad',
        date: 'September 2025',
        rating: 5,
        title: 'Best trek of my life',
        review: 'I\'ve done 15+ treks across the Himalayas, and KGL remains unmatched in terms of sheer beauty. The flower meadows in August are beyond imagination.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'Is prior trekking experience required?',
        answer: 'Yes, we recommend at least one high-altitude trek experience before attempting KGL. The trek involves long walking days and high passes.'
      },
      {
        question: 'Is it safe to trek in Kashmir?',
        answer: 'Absolutely. The areas we trek through are completely safe and have been frequented by trekkers for decades. We have local guides who know the region intimately.'
      }
    ],

    trek_leader: {
      name: 'Sameer Sheikh',
      experience: '10 years',
      treks_led: 200,
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
      bio: 'A Kashmir native, Sameer has been leading KGL expeditions for a decade. His knowledge of the terrain and local culture adds depth to every trek.'
    }
  },

  'rupin-pass': {
    slug: 'rupin-pass',
    name: 'Rupin Pass',
    tagline: 'The Ultimate Himalayan Challenge',
    hero_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80'
    ],
    difficulty: 'Difficult',
    duration: '8 Days',
    altitude: '15,250 ft',
    price: 16450,
    original_price: 18500,
    rating: 4.8,
    reviews_count: 1560,
    region: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    best_months: ['May', 'June', 'September', 'October'],
    trek_distance: '52 km',
    base_camp: 'Dhaula',
    group_size: '12-18 trekkers',
    pickup_point: 'Shimla',
    
    short_description: 'Rupin Pass is a challenging crossover trek from Uttarakhand to Himachal Pradesh, featuring stunning waterfalls, hanging villages, and the dramatic snow-covered pass.',
    
    overview: `Rupin Pass is considered one of the most dramatic treks in the Himalayas. This crossover trek takes you from Dhaula in Uttarakhand to Sangla in Himachal Pradesh, crossing the formidable Rupin Pass at 15,250 feet.

What sets this trek apart is the sheer variety of landscapes - you'll walk through thick forests, past spectacular waterfalls, across glacial moraines, and finally over the stunning snow-covered pass. The hanging village of Jakha and the terraced fields of the Sangla Valley add cultural richness to the natural beauty.

This is a challenging trek recommended for experienced trekkers. The high altitude, long walking days, and technical sections near the pass require good fitness and mental preparation.`,

    highlights: [
      'Cross the dramatic Rupin Pass at 15,250 ft',
      'Witness the spectacular Rupin waterfall',
      'Trek through the unique hanging village of Jakha',
      'Experience the crossover from Uttarakhand to Himachal',
      'Walk through diverse terrains and ecosystems',
      'Camp in pristine alpine meadows'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Shimla to Dhaula',
        altitude: '5,500 ft',
        distance: '240 km drive',
        time: '10-11 hours',
        description: 'Long but scenic drive from Shimla to Dhaula, the trek\'s starting point. Pass through beautiful Kinnaur landscapes.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Homestay in Dhaula'
      },
      {
        day: 2,
        title: 'Dhaula to Sewa',
        altitude: '6,500 ft',
        distance: '6 km',
        time: '4-5 hours',
        description: 'Begin trekking through forested trails and terraced fields. First views of the magnificent Rupin waterfall.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Sewa'
      },
      {
        day: 3,
        title: 'Sewa to Jhaka',
        altitude: '8,900 ft',
        distance: '10 km',
        time: '7-8 hours',
        description: 'Trek to the famous hanging village of Jhaka, perched on a cliff with stunning valley views.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Homestay in Jhaka'
      },
      {
        day: 4,
        title: 'Jhaka to Saruwas Thach',
        altitude: '11,300 ft',
        distance: '8 km',
        time: '6-7 hours',
        description: 'Gradual ascent through meadows and forests. Acclimatization day with beautiful campsite views.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Saruwas Thach'
      },
      {
        day: 5,
        title: 'Saruwas Thach to Dhanderas Thach',
        altitude: '12,800 ft',
        distance: '6 km',
        time: '5-6 hours',
        description: 'Trek to the base of the pass. Spectacular views of snow-covered peaks. Final acclimatization before the pass.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Dhanderas Thach'
      },
      {
        day: 6,
        title: 'Dhanderas to Rupin Pass to Ronti Gad',
        altitude: '15,250 ft (pass)',
        distance: '11 km',
        time: '10-12 hours',
        description: 'The big day! Early start for the challenging climb to Rupin Pass. Descend the snow-covered slopes to Ronti Gad.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Ronti Gad'
      },
      {
        day: 7,
        title: 'Ronti Gad to Sangla',
        altitude: '8,800 ft',
        distance: '11 km',
        time: '6-7 hours',
        description: 'Descend through pine forests to the picturesque Sangla Valley. Drive to Sangla town for celebration dinner.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Hotel in Sangla'
      },
      {
        day: 8,
        title: 'Sangla to Shimla',
        altitude: '7,200 ft',
        distance: '260 km drive',
        time: '10-11 hours',
        description: 'Drive back to Shimla through the beautiful Kinnaur Valley. Trek ends with incredible memories.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Camping equipment',
      'Expert trek leaders',
      'Transport from/to Shimla',
      'Technical equipment (ropes, etc.)',
      'Permits and entry fees'
    ],

    exclusions: [
      'Personal porter',
      'Travel insurance (mandatory)',
      'Personal trekking gear',
      'Tips and gratuities'
    ],

    things_to_carry: [
      'Technical trekking boots',
      'Gaiters',
      'Trekking poles',
      'Down jacket (-10°C rated)',
      'Sunglasses and sunscreen',
      'Personal first aid'
    ],

    weather: {
      may: { high: '10°C', low: '-2°C', condition: 'Snow at Pass' },
      june: { high: '12°C', low: '0°C', condition: 'Clear' },
      september: { high: '10°C', low: '-3°C', condition: 'Post Monsoon' },
      october: { high: '5°C', low: '-5°C', condition: 'Early Snow' }
    },

    upcoming_batches: [
      { date: 'May 10-17, 2026', slots: 8, price: 16450 },
      { date: 'May 20-27, 2026', slots: 10, price: 16450 },
      { date: 'Jun 1-8, 2026', slots: 12, price: 16450 },
      { date: 'Sep 15-22, 2026', slots: 10, price: 16450 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Arjun Singh',
        location: 'Chandigarh',
        date: 'May 2025',
        rating: 5,
        title: 'Challenging but worth every step!',
        review: 'The pass crossing was intense but our guides were excellent. The view from the top and the sense of achievement is unmatched.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'How difficult is Rupin Pass compared to other treks?',
        answer: 'Rupin Pass is rated as difficult. The pass crossing involves steep snow slopes and requires 10-12 hours of walking. Prior high-altitude experience is essential.'
      }
    ],

    trek_leader: {
      name: 'Deepak Thakur',
      experience: '12 years',
      treks_led: 180,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      bio: 'A certified mountaineer from NIM, Deepak specializes in challenging high-altitude treks. His expertise has helped hundreds safely summit Rupin Pass.'
    }
  },

  'valley-of-flowers': {
    slug: 'valley-of-flowers',
    name: 'Valley of Flowers',
    tagline: 'UNESCO World Heritage Trek',
    hero_image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80'
    ],
    difficulty: 'Moderate',
    duration: '6 Days',
    altitude: '14,100 ft',
    price: 14850,
    original_price: 16500,
    rating: 4.9,
    reviews_count: 2100,
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    best_months: ['July', 'August', 'September'],
    trek_distance: '38 km',
    base_camp: 'Govindghat',
    group_size: '15-25 trekkers',
    pickup_point: 'Haridwar/Rishikesh',
    
    short_description: 'Valley of Flowers is a UNESCO World Heritage Site, home to over 600 species of flowering plants. Combined with Hemkund Sahib, this trek offers natural beauty and spiritual experience.',
    
    overview: `The Valley of Flowers is a UNESCO World Heritage Site nestled in the Chamoli district of Uttarakhand. This 10 km stretch of pristine alpine meadows comes alive with over 600 species of wildflowers during the monsoon months.

This trek combines the floral paradise of the Valley with the pilgrimage to Hemkund Sahib, one of the highest Gurudwaras in the world at 14,100 feet. The combination of natural splendor and spiritual significance makes this trek unique.

The valley was unknown to the world until 1931 when British mountaineer Frank Smythe stumbled upon it while returning from an expedition. Today, it draws nature lovers, botanists, and photographers from around the world.`,

    highlights: [
      'Walk through 600+ species of wildflowers',
      'Visit UNESCO World Heritage Site',
      'Pilgrimage to Hemkund Sahib (14,100 ft)',
      'Spot rare Himalayan wildlife',
      'Explore diverse ecosystems',
      'Perfect monsoon trek'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Haridwar to Govindghat',
        altitude: '6,000 ft',
        distance: '290 km drive',
        time: '10-11 hours',
        description: 'Scenic drive along the Ganges through Rishikesh, Devprayag, and Joshimath to Govindghat.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Hotel in Govindghat'
      },
      {
        day: 2,
        title: 'Govindghat to Ghangaria',
        altitude: '10,000 ft',
        distance: '14 km',
        time: '6-7 hours',
        description: 'Trek along the Pushpawati River through scenic villages and waterfalls to Ghangaria base camp.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Guesthouse in Ghangaria'
      },
      {
        day: 3,
        title: 'Ghangaria to Valley of Flowers',
        altitude: '12,500 ft',
        distance: '8 km (round)',
        time: '5-6 hours',
        description: 'Enter the valley and spend the day amidst thousands of blooming flowers. Photography paradise!',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Guesthouse in Ghangaria'
      },
      {
        day: 4,
        title: 'Ghangaria to Hemkund Sahib',
        altitude: '14,100 ft',
        distance: '12 km (round)',
        time: '7-8 hours',
        description: 'Trek to the sacred Hemkund Sahib Gurudwara and pristine glacial lake surrounded by seven peaks.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Guesthouse in Ghangaria'
      },
      {
        day: 5,
        title: 'Ghangaria to Govindghat to Joshimath',
        altitude: '6,100 ft',
        distance: '14 km trek + 20 km drive',
        time: '6-7 hours',
        description: 'Descend to Govindghat and drive to Joshimath. Visit the famous Shankaracharya Math temple.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Hotel in Joshimath'
      },
      {
        day: 6,
        title: 'Joshimath to Haridwar',
        altitude: '1,100 ft',
        distance: '270 km drive',
        time: '10 hours',
        description: 'Return drive to Haridwar. Optional Ganga Aarti in Haridwar before departure.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Guesthouse accommodation',
      'Expert guide and support',
      'Transport from/to Haridwar',
      'Valley entry permits',
      'Porter for common luggage'
    ],

    exclusions: [
      'Personal porter/mule',
      'Travel insurance',
      'Personal expenses',
      'Haridwar stay before/after'
    ],

    things_to_carry: [
      'Rain jacket and poncho (essential)',
      'Waterproof trekking shoes',
      'Warm layers',
      'Camera with waterproof cover',
      'Personal medications'
    ],

    weather: {
      july: { high: '15°C', low: '8°C', condition: 'Peak Bloom' },
      august: { high: '14°C', low: '7°C', condition: 'Maximum Flowers' },
      september: { high: '12°C', low: '5°C', condition: 'Late Bloom' }
    },

    upcoming_batches: [
      { date: 'Jul 10-15, 2026', slots: 15, price: 14850 },
      { date: 'Jul 20-25, 2026', slots: 12, price: 14850 },
      { date: 'Aug 1-6, 2026', slots: 18, price: 14850 },
      { date: 'Aug 15-20, 2026', slots: 15, price: 14850 },
      { date: 'Sep 1-6, 2026', slots: 20, price: 13850 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Lakshmi Sundaram',
        location: 'Coimbatore',
        date: 'August 2025',
        rating: 5,
        title: 'Nature\'s canvas at its finest',
        review: 'The variety of flowers was mind-boggling. Our guide knew the names of so many species. Hemkund Sahib was spiritually uplifting. A complete experience!',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'When is the best time to see flowers?',
        answer: 'Late July to mid-August is peak bloom time. Different flowers bloom at different times, so each week offers a different experience.'
      }
    ],

    trek_leader: {
      name: 'Sunita Rawat',
      experience: '6 years',
      treks_led: 100,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      bio: 'Sunita is a trained botanist and passionate trekker. Her knowledge of flora and fauna adds an educational dimension to the Valley of Flowers experience.'
    }
  },

  'har-ki-dun': {
    slug: 'har-ki-dun',
    name: 'Har Ki Dun',
    tagline: 'The Valley of Gods',
    hero_image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80'
    ],
    difficulty: 'Moderate',
    duration: '7 Days',
    altitude: '11,700 ft',
    price: 13450,
    original_price: 15000,
    rating: 4.8,
    reviews_count: 1890,
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    best_months: ['March', 'April', 'May', 'September', 'October', 'November'],
    trek_distance: '47 km',
    base_camp: 'Taluka',
    group_size: '15-20 trekkers',
    pickup_point: 'Dehradun Railway Station',
    
    short_description: 'An ancient valley trek rich in mythology, culture, and stunning natural beauty in the Garhwal Himalayas.',
    
    overview: `Har Ki Dun, meaning "Valley of Gods," is a cradle-shaped valley nestled in the Garhwal Himalayas. This ancient valley is steeped in mythology - it is believed to be the path taken by the Pandavas during their ascent to heaven.

The trek takes you through dense forests of oak, pine, and deodar, past ancient villages where time seems to have stood still. The locals here still practice age-old traditions and live in beautifully carved wooden houses.

The valley offers spectacular views of Swargarohini peaks, and the surrounding meadows are carpeted with wildflowers during spring and autumn. This is a moderate trek perfect for those seeking cultural immersion along with natural beauty.`,

    highlights: [
      'Mythological significance - Path of the Pandavas',
      'Ancient villages with unique wooden architecture',
      'Views of Swargarohini peaks (6,252m)',
      'Rich biodiversity and birdwatching opportunities',
      'Lush green meadows and pristine streams',
      'Experience authentic Garhwali culture'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Dehradun to Sankri',
        altitude: '6,400 ft',
        distance: '220 km drive',
        time: '9-10 hours',
        description: 'Drive from Dehradun through Mussoorie and Purola to reach Sankri. Enjoy the scenic views of the Tons Valley. Evening briefing about the trek.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Guesthouse in Sankri'
      },
      {
        day: 2,
        title: 'Sankri to Taluka to Seema',
        altitude: '7,600 ft',
        distance: '12 km trek',
        time: '5-6 hours',
        description: 'Short drive to Taluka, then begin the trek. Walk through dense forests and cross the Supin River. Reach Seema, a picturesque village.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Seema'
      },
      {
        day: 3,
        title: 'Seema to Osla',
        altitude: '8,500 ft',
        distance: '10 km',
        time: '5-6 hours',
        description: 'Trek through beautiful oak forests. Visit the ancient Someshwar Temple in Osla village. Explore the unique wooden architecture.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents near Osla'
      },
      {
        day: 4,
        title: 'Osla to Har Ki Dun',
        altitude: '11,700 ft',
        distance: '10 km',
        time: '6-7 hours',
        description: 'The most scenic day! Walk through meadows with views of Swargarohini peaks. Reach the beautiful Har Ki Dun valley.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Har Ki Dun'
      },
      {
        day: 5,
        title: 'Har Ki Dun Exploration & Return to Osla',
        altitude: '8,500 ft',
        distance: '12 km',
        time: '6-7 hours',
        description: 'Morning exploration of the valley. Optional hike to Jaundhar Glacier viewpoint. Return to Osla for the night.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents near Osla'
      },
      {
        day: 6,
        title: 'Osla to Taluka',
        altitude: '5,500 ft',
        distance: '15 km',
        time: '6-7 hours',
        description: 'Descend through the forests back to Taluka. Enjoy the downhill trail and reflect on the journey.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Guesthouse in Taluka'
      },
      {
        day: 7,
        title: 'Taluka to Dehradun',
        altitude: '2,200 ft',
        distance: '200 km drive',
        time: '8-9 hours',
        description: 'Drive back to Dehradun. Expected arrival by evening. Trek ends with wonderful memories.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'Accommodation (guesthouses and tents)',
      'All meals during the trek (vegetarian)',
      'Experienced trek leaders and guides',
      'First aid and medical kit',
      'Sleeping bags and mattresses',
      'Permits and forest entry fees',
      'Transport from Dehradun to Sankri and back'
    ],

    exclusions: [
      'Personal expenses and tips',
      'Travel insurance',
      'Personal trekking gear',
      'Anything not mentioned in inclusions',
      'Porter charges for personal luggage'
    ],

    things_to_carry: [
      'Trekking shoes with good ankle support',
      'Warm layers (fleece, down jacket)',
      'Rain jacket or poncho',
      'Sunglasses and sunscreen',
      'Personal water bottle',
      'Daypack (20-30L)',
      'Camera for village photography',
      'Personal medications'
    ],

    weather: {
      march: { high: '12°C', low: '0°C', condition: 'Spring Bloom' },
      april: { high: '15°C', low: '3°C', condition: 'Pleasant' },
      may: { high: '18°C', low: '6°C', condition: 'Warm Days' },
      september: { high: '14°C', low: '4°C', condition: 'Post Monsoon' },
      october: { high: '12°C', low: '1°C', condition: 'Clear Skies' },
      november: { high: '8°C', low: '-3°C', condition: 'Early Winter' }
    },

    upcoming_batches: [
      { date: 'Mar 10-16, 2026', slots: 12, price: 13450 },
      { date: 'Mar 20-26, 2026', slots: 15, price: 13450 },
      { date: 'Apr 5-11, 2026', slots: 18, price: 13450 },
      { date: 'Oct 1-7, 2026', slots: 15, price: 13450 },
      { date: 'Oct 15-21, 2026', slots: 12, price: 13450 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Nikhil Jain',
        location: 'Jaipur',
        date: 'October 2025',
        rating: 5,
        title: 'Magical valley with rich culture',
        review: 'The valley is absolutely stunning. The ancient villages with their unique architecture and the warmth of locals made this trek special. The Swargarohini views are unforgettable.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
      },
      {
        id: 2,
        name: 'Anita Deshmukh',
        location: 'Nagpur',
        date: 'April 2025',
        rating: 5,
        title: 'Perfect blend of nature and culture',
        review: 'What makes Har Ki Dun special is the cultural experience. The villages, temples, and local stories add so much depth. The valley itself is a paradise.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'Is Har Ki Dun suitable for beginners?',
        answer: 'Yes, with moderate fitness levels it is achievable for beginners. The trails are well-defined and the altitude is manageable.'
      },
      {
        question: 'What makes Har Ki Dun unique?',
        answer: 'The combination of natural beauty, ancient villages with preserved traditions, and mythological significance makes this trek truly unique.'
      },
      {
        question: 'Can we visit the Someshwar Temple?',
        answer: 'Yes, the ancient Someshwar Temple in Osla is a highlight of the trek. It features unique wooden architecture and is dedicated to Lord Shiva.'
      }
    ],

    trek_leader: {
      name: 'Rajesh Bisht',
      experience: '9 years',
      treks_led: 120,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      bio: 'Born in the Garhwal region, Rajesh has deep knowledge of local culture, mythology, and traditions. He loves sharing stories of the Pandavas and local folklore.'
    }
  },

  'brahmatal': {
    slug: 'brahmatal',
    name: 'Brahmatal',
    tagline: 'Winter Wonderland with Frozen Lakes',
    hero_image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80'
    ],
    difficulty: 'Easy - Moderate',
    duration: '6 Days',
    altitude: '12,250 ft',
    price: 11850,
    original_price: 13500,
    rating: 4.9,
    reviews_count: 2100,
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    best_months: ['December', 'January', 'February', 'March'],
    trek_distance: '22 km',
    base_camp: 'Lohajung',
    group_size: '15-25 trekkers',
    pickup_point: 'Kathgodam Railway Station',
    
    short_description: 'A winter wonderland trek featuring frozen lakes, panoramic Himalayan views, and pristine snow trails.',
    
    overview: `Brahmatal is one of the best winter treks in India, offering a magical experience of walking through snow-covered forests and frozen lakes. The trek is named after Brahma, who is believed to have meditated here.

The highlight of this trek is camping beside the frozen Brahmatal Lake with stunning views of Mt. Trishul and Nanda Ghunti. The sunrise from the summit creates a golden glow on the snow-capped peaks - a sight that stays with you forever.

What makes Brahmatal special is its accessibility even in peak winter. The trails are well-marked, and the altitude is manageable, making it perfect for those seeking their first snow trek.`,

    highlights: [
      'Camp beside the frozen Brahmatal Lake',
      'Stunning views of Mt. Trishul (7,120m) and Nanda Ghunti',
      'Walk through pristine snow-covered trails',
      'Summit with 360-degree Himalayan panorama',
      'Perfect introduction to winter trekking',
      'Beautiful oak and rhododendron forests'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Kathgodam to Lohajung',
        altitude: '7,600 ft',
        distance: '210 km drive',
        time: '9-10 hours',
        description: 'Scenic drive through Almora and Dewal to reach Lohajung. The road offers beautiful views of the Kumaon Himalayas.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Guesthouse in Lohajung'
      },
      {
        day: 2,
        title: 'Lohajung to Bekaltal',
        altitude: '9,850 ft',
        distance: '6 km',
        time: '4-5 hours',
        description: 'Begin the trek through oak forests. Camp at the beautiful Bekaltal Lake, which may be frozen in winter.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Bekaltal'
      },
      {
        day: 3,
        title: 'Bekaltal to Brahmatal',
        altitude: '10,440 ft',
        distance: '5 km',
        time: '4-5 hours',
        description: 'Trek to the stunning Brahmatal Lake. As you gain altitude, the views of Mt. Trishul become increasingly spectacular.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Brahmatal'
      },
      {
        day: 4,
        title: 'Brahmatal Summit and Descent to Tilandi',
        altitude: '12,250 ft (summit)',
        distance: '7 km',
        time: '7-8 hours',
        description: 'Early morning summit push for sunrise. The 360-degree views from the top are breathtaking. Descend to Tilandi.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Tilandi'
      },
      {
        day: 5,
        title: 'Tilandi to Lohajung',
        altitude: '7,600 ft',
        distance: '4 km',
        time: '3-4 hours',
        description: 'Short descent back to Lohajung. Celebrate your successful summit with fellow trekkers.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Guesthouse in Lohajung'
      },
      {
        day: 6,
        title: 'Lohajung to Kathgodam',
        altitude: '1,300 ft',
        distance: '210 km drive',
        time: '9-10 hours',
        description: 'Drive back to Kathgodam. Expected arrival by evening to catch overnight trains to Delhi.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'Accommodation (guesthouses and tents)',
      'All meals during the trek',
      'Experienced trek leaders',
      'Sleeping bags rated for -15°C',
      'Microspikes for snow',
      'Transport from Kathgodam to Lohajung and back'
    ],

    exclusions: [
      'Personal expenses',
      'Travel insurance',
      'Personal winter gear',
      'Train/bus tickets to Kathgodam'
    ],

    things_to_carry: [
      'Insulated trekking boots',
      'Down jacket (-10°C rated)',
      'Thermal innerwear',
      'Balaclava and woolen cap',
      'Insulated gloves',
      'Sunglasses (essential for snow)',
      'Sunscreen SPF 50+',
      'Lip balm with SPF'
    ],

    weather: {
      december: { high: '2°C', low: '-8°C', condition: 'Heavy Snow' },
      january: { high: '0°C', low: '-12°C', condition: 'Peak Winter' },
      february: { high: '3°C', low: '-10°C', condition: 'Snow' },
      march: { high: '8°C', low: '-5°C', condition: 'Snow Melting' }
    },

    upcoming_batches: [
      { date: 'Dec 20-25, 2025', slots: 8, price: 11850 },
      { date: 'Jan 5-10, 2026', slots: 12, price: 11850 },
      { date: 'Jan 15-20, 2026', slots: 15, price: 11850 },
      { date: 'Feb 1-6, 2026', slots: 18, price: 11850 },
      { date: 'Feb 15-20, 2026', slots: 15, price: 11850 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Shreya Kapoor',
        location: 'Noida',
        date: 'January 2026',
        rating: 5,
        title: 'Magical winter experience!',
        review: 'The frozen Brahmatal lake was surreal! Waking up to see Mt. Trishul bathed in golden light is an image I will never forget. Perfect first snow trek.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      },
      {
        id: 2,
        name: 'Vikas Gupta',
        location: 'Lucknow',
        date: 'February 2025',
        rating: 5,
        title: 'Snow paradise',
        review: 'Knee-deep snow, frozen lakes, and stunning mountain views. Brahmatal exceeded all my expectations. The team was fantastic!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'How cold does it get at Brahmatal?',
        answer: 'Temperatures can drop to -10°C to -15°C at night during peak winter. Good quality winter gear is essential.'
      },
      {
        question: 'Is Brahmatal good for beginners?',
        answer: 'Yes! Brahmatal is one of the best winter treks for beginners. The trails are moderate and the altitude is manageable.'
      },
      {
        question: 'Will the lake be frozen?',
        answer: 'In December-February, the lake is usually frozen. The frozen lake is a major highlight of this trek.'
      }
    ],

    trek_leader: {
      name: 'Mohan Negi',
      experience: '7 years',
      treks_led: 90,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      bio: 'Expert in winter treks with extensive knowledge of snow conditions. Mohan ensures every trekker experiences the magic of Himalayan winters safely.'
    }
  },

  'roopkund': {
    slug: 'roopkund',
    name: 'Roopkund',
    tagline: 'The Mysterious Skeleton Lake',
    hero_image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80'
    ],
    difficulty: 'Difficult',
    duration: '8 Days',
    altitude: '15,750 ft',
    price: 15950,
    original_price: 18000,
    rating: 4.7,
    reviews_count: 1450,
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    best_months: ['May', 'June', 'September', 'October'],
    trek_distance: '53 km',
    base_camp: 'Lohajung',
    group_size: '12-18 trekkers',
    pickup_point: 'Kathgodam Railway Station',
    
    short_description: 'Trek to the mysterious glacial lake containing hundreds of ancient human skeletons.',
    
    overview: `Roopkund is one of the most intriguing treks in India. At 15,750 feet lies a glacial lake containing the skeletal remains of over 500 humans dating back to the 9th century. The mystery of how they got there has fascinated scientists and trekkers alike.

Beyond the mystery, Roopkund is a stunning trek. You pass through the vast meadows of Bedni Bugyal and Ali Bugyal - among the most beautiful high-altitude meadows in India. The views of Mt. Trishul and Nanda Ghunti are spectacular throughout.

This is a challenging trek that requires good fitness and prior trekking experience. The high altitude and steep sections near the lake demand physical preparation and mental resilience.`,

    highlights: [
      'Visit the mysterious skeleton lake',
      'Camp at beautiful Bedni Bugyal meadows',
      'Stunning views of Mt. Trishul and Nanda Ghunti',
      'Cross challenging high-altitude terrain',
      'Rich history and unsolved mystery',
      'Visit the ancient Bedni Kund temple'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Kathgodam to Lohajung',
        altitude: '7,600 ft',
        distance: '210 km drive',
        time: '9-10 hours',
        description: 'Drive through the beautiful Kumaon hills to Lohajung. Evening briefing and trek preparation.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Guesthouse in Lohajung'
      },
      {
        day: 2,
        title: 'Lohajung to Didna Village',
        altitude: '8,500 ft',
        distance: '8 km',
        time: '5-6 hours',
        description: 'Trek through beautiful villages and terraced fields. Didna is a charming Garhwali village.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Homestay/Tents at Didna'
      },
      {
        day: 3,
        title: 'Didna to Ali Bugyal',
        altitude: '11,000 ft',
        distance: '9 km',
        time: '6-7 hours',
        description: 'Steep climb through forests opens up to the stunning Ali Bugyal meadow. First views of the peaks.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Ali Bugyal'
      },
      {
        day: 4,
        title: 'Ali Bugyal to Bedni Bugyal',
        altitude: '11,500 ft',
        distance: '4 km',
        time: '3-4 hours',
        description: 'Short walk to the magnificent Bedni Bugyal. Acclimatization day. Visit Bedni Kund temple.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Bedni Bugyal'
      },
      {
        day: 5,
        title: 'Bedni Bugyal to Bhagwabasa',
        altitude: '14,100 ft',
        distance: '8 km',
        time: '6-7 hours',
        description: 'Climb to the base camp for the Roopkund summit. The trail gets steeper and more challenging.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Bhagwabasa'
      },
      {
        day: 6,
        title: 'Bhagwabasa to Roopkund to Bedni Bugyal',
        altitude: '15,750 ft',
        distance: '11 km',
        time: '10-12 hours',
        description: 'Early morning summit to the mysterious Roopkund Lake. See the ancient skeletons. Descend to Bedni.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Bedni Bugyal'
      },
      {
        day: 7,
        title: 'Bedni Bugyal to Lohajung',
        altitude: '7,600 ft',
        distance: '13 km',
        time: '7-8 hours',
        description: 'Long descent back to Lohajung via a different route. Celebrate your achievement.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Guesthouse in Lohajung'
      },
      {
        day: 8,
        title: 'Lohajung to Kathgodam',
        altitude: '1,300 ft',
        distance: '210 km drive',
        time: '9-10 hours',
        description: 'Drive back to Kathgodam with memories of the mysterious lake.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Camping equipment',
      'Expert trek leaders',
      'First aid and oxygen cylinder',
      'Transport from/to Kathgodam',
      'Permits and entry fees'
    ],

    exclusions: [
      'Personal trekking gear',
      'Travel insurance (mandatory)',
      'Personal porter',
      'Tips and gratuities'
    ],

    things_to_carry: [
      'Sturdy trekking boots',
      'Trekking poles',
      'Down jacket (-15°C rated)',
      'Woolen layers',
      'Sunglasses and sunscreen',
      'Personal medications',
      'Energy bars and dry fruits'
    ],

    weather: {
      may: { high: '8°C', low: '-5°C', condition: 'Clear' },
      june: { high: '10°C', low: '-2°C', condition: 'Pre-Monsoon' },
      september: { high: '8°C', low: '-4°C', condition: 'Post Monsoon' },
      october: { high: '5°C', low: '-8°C', condition: 'Early Winter' }
    },

    upcoming_batches: [
      { date: 'May 15-22, 2026', slots: 10, price: 15950 },
      { date: 'May 25-Jun 1, 2026', slots: 12, price: 15950 },
      { date: 'Sep 10-17, 2026', slots: 10, price: 15950 },
      { date: 'Sep 20-27, 2026', slots: 12, price: 15950 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Anand Kulkarni',
        location: 'Pune',
        date: 'September 2025',
        rating: 5,
        title: 'Challenging but rewarding',
        review: 'The mystery of the skeletons adds to the adventure. Standing at the lake and imagining what happened centuries ago gives you goosebumps. Tough trek but worth it!',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
      },
      {
        id: 2,
        name: 'Rekha Sinha',
        location: 'Kolkata',
        date: 'June 2025',
        rating: 5,
        title: 'Unforgettable experience',
        review: 'The Bugyal meadows are stunning, and the mystery of Roopkund is haunting. A trek that challenges you physically and fascinates you intellectually.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'Why is Roopkund famous?',
        answer: 'Roopkund is famous for the mysterious human skeletons found in the glacial lake, dating back to the 9th century. Scientists believe they died in a sudden hailstorm.'
      },
      {
        question: 'How difficult is Roopkund compared to other treks?',
        answer: 'Roopkund is rated as difficult due to high altitude (15,750 ft) and long walking days. Prior high-altitude trekking experience is recommended.'
      },
      {
        question: 'Can we see the skeletons?',
        answer: 'Yes, the skeletal remains are visible around the lake edge when the snow melts, typically in late summer months.'
      }
    ],

    trek_leader: {
      name: 'Amit Pandey',
      experience: '11 years',
      treks_led: 140,
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
      bio: 'A certified mountaineer specializing in challenging high-altitude treks. Amit has led over 50 Roopkund expeditions and knows every nuance of this mysterious trek.'
    }
  },

  'hampta-pass': {
    slug: 'hampta-pass',
    name: 'Hampta Pass',
    tagline: 'From Lush Valleys to Barren Landscapes',
    hero_image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80'
    ],
    difficulty: 'Moderate',
    duration: '5 Days',
    altitude: '14,100 ft',
    price: 12450,
    original_price: 14000,
    rating: 4.8,
    reviews_count: 1780,
    region: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    best_months: ['June', 'July', 'August', 'September'],
    trek_distance: '26 km',
    base_camp: 'Manali',
    group_size: '15-20 trekkers',
    pickup_point: 'Manali Bus Stand',
    
    short_description: 'A dramatic crossover trek from the green Kullu Valley to the barren beauty of Lahaul.',
    
    overview: `Hampta Pass is unique for its dramatic landscape transformation. In just a few days, you walk from the lush green forests of the Kullu Valley across to the stark, moon-like terrain of the Lahaul Valley.

The pass crossing itself is thrilling - you navigate through boulder fields, snow bridges, and river crossings. The contrast between the two valleys is so stark that it feels like you've traveled to a different planet.

The trek culminates with an optional visit to the stunning Chandratal Lake, a crescent-shaped high-altitude lake that changes colors through the day. At 5 days, this is a perfect short adventure for those with limited time.`,

    highlights: [
      'Dramatic landscape transformation',
      'Cross the Hampta Pass at 14,100 ft',
      'River crossings and snow bridges',
      'Optional visit to Chandratal Lake',
      'Perfect 5-day adventure',
      'Experience two contrasting valleys'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Manali to Jobra to Chika',
        altitude: '10,100 ft',
        distance: '4 km trek',
        time: '3-4 hours',
        description: 'Drive to Jobra and begin trek through apple orchards and dense forests. Camp at Chika beside a stream.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Tents at Chika'
      },
      {
        day: 2,
        title: 'Chika to Balu Ka Ghera',
        altitude: '11,900 ft',
        distance: '10 km',
        time: '6-7 hours',
        description: 'Trek through meadows and across streams. The valley opens up with stunning views of snow-capped peaks.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Balu Ka Ghera'
      },
      {
        day: 3,
        title: 'Balu Ka Ghera to Hampta Pass to Shea Goru',
        altitude: '14,100 ft (pass)',
        distance: '8 km',
        time: '7-8 hours',
        description: 'The big day! Cross Hampta Pass and witness the dramatic change in landscape. Descend to Shea Goru.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Shea Goru'
      },
      {
        day: 4,
        title: 'Shea Goru to Chatru to Chandratal',
        altitude: '14,100 ft',
        distance: '4 km trek + drive',
        time: '3 hours trek + 2 hours drive',
        description: 'Short trek to Chatru, then drive to the beautiful Chandratal Lake. Camp beside the lake.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Chandratal'
      },
      {
        day: 5,
        title: 'Chandratal to Manali',
        altitude: '6,700 ft',
        distance: '120 km drive',
        time: '5-6 hours',
        description: 'Morning at the lake for sunrise. Drive back to Manali via the Rohtang route.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Camping equipment',
      'Expert trek leaders',
      'Transport to/from trailhead',
      'Chandratal transfer',
      'River crossing ropes'
    ],

    exclusions: [
      'Travel to/from Manali',
      'Travel insurance',
      'Personal trekking gear',
      'Rohtang permit (if required)'
    ],

    things_to_carry: [
      'Waterproof trekking shoes',
      'Rain jacket and poncho',
      'Quick-dry trekking pants',
      'Warm layers for evenings',
      'Trekking poles',
      'Waterproof backpack cover'
    ],

    weather: {
      june: { high: '12°C', low: '3°C', condition: 'Pleasant' },
      july: { high: '10°C', low: '2°C', condition: 'Monsoon' },
      august: { high: '10°C', low: '2°C', condition: 'Rainy' },
      september: { high: '12°C', low: '0°C', condition: 'Clear' }
    },

    upcoming_batches: [
      { date: 'Jun 15-19, 2026', slots: 15, price: 12450 },
      { date: 'Jun 25-29, 2026', slots: 18, price: 12450 },
      { date: 'Jul 10-14, 2026', slots: 15, price: 12450 },
      { date: 'Sep 5-9, 2026', slots: 18, price: 12450 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Pooja Malhotra',
        location: 'Delhi',
        date: 'July 2025',
        rating: 5,
        title: 'Perfect short trek!',
        review: 'The contrast between the valleys is incredible - like walking into a different world. Chandratal is absolutely mesmerizing. Perfect for a quick Himalayan adventure.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      },
      {
        id: 2,
        name: 'Siddharth Rao',
        location: 'Bangalore',
        date: 'September 2025',
        rating: 5,
        title: 'Two worlds in one trek',
        review: 'Hampta Pass gives you the best of both worlds - green valleys and barren moonscapes. The river crossings add to the adventure!',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'Is the Chandratal visit included?',
        answer: 'Yes, the visit to Chandratal Lake is included on Day 4. We camp beside the lake for a magical experience.'
      },
      {
        question: 'How difficult are the river crossings?',
        answer: 'There are 2-3 river crossings which can be knee to waist-deep during monsoon. We use ropes for safety, and our guides are experienced in managing these crossings.'
      },
      {
        question: 'What makes Hampta Pass special?',
        answer: 'The dramatic transformation from the green Kullu Valley to the barren Lahaul Valley is unique. It feels like you have traveled from one world to another.'
      }
    ],

    trek_leader: {
      name: 'Kuldeep Singh',
      experience: '8 years',
      treks_led: 110,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      bio: 'A Himachali native, Kuldeep knows these mountains like the back of his hand. His expertise in river crossings and terrain navigation makes every trek safe and exciting.'
    }
  },

  'chadar-trek': {
    slug: 'chadar-trek',
    name: 'Chadar Trek',
    tagline: 'Walk on the Frozen Zanskar River',
    hero_image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80'
    ],
    difficulty: 'Difficult',
    duration: '9 Days',
    altitude: '11,000 ft',
    price: 24950,
    original_price: 28000,
    rating: 4.9,
    reviews_count: 980,
    region: 'Ladakh',
    state: 'Ladakh',
    best_months: ['January', 'February'],
    trek_distance: '62 km',
    base_camp: 'Leh',
    group_size: '10-15 trekkers',
    pickup_point: 'Leh Airport',
    
    short_description: 'Walk on the frozen Zanskar River through dramatic gorges in extreme winter conditions.',
    
    overview: `The Chadar Trek is one of the most extreme and unique treks in the world. "Chadar" means blanket - referring to the sheet of ice that forms over the Zanskar River in winter, creating a natural highway through otherwise inaccessible terrain.

You walk on the frozen river through dramatic gorges, with ice walls towering on both sides. The temperatures plunge to -30°C at night, making this one of the coldest treks on the planet. Caves along the river serve as shelters.

This is not just a trek - it's an extreme adventure that tests your limits. The experience of walking on a frozen river, surrounded by frozen waterfalls and towering cliffs, is unlike anything else on Earth.`,

    highlights: [
      'Walk on the frozen Zanskar River',
      'Experience temperatures down to -30°C',
      'Stay in caves along the route',
      'Witness frozen waterfalls',
      'Ultimate adventure challenge',
      'Unique Zanskari culture'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Arrive in Leh',
        altitude: '11,500 ft',
        distance: 'N/A',
        time: 'Rest day',
        description: 'Arrive in Leh and rest for acclimatization. This is crucial due to the high altitude. Evening briefing.',
        meals: ['Dinner'],
        stay: 'Hotel in Leh'
      },
      {
        day: 2,
        title: 'Acclimatization in Leh',
        altitude: '11,500 ft',
        distance: 'Local exploration',
        time: 'Relaxed day',
        description: 'Visit local monasteries and markets. Gear check and final preparations. Mandatory for acclimatization.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Hotel in Leh'
      },
      {
        day: 3,
        title: 'Leh to Chilling to Tilad Do',
        altitude: '10,500 ft',
        distance: '8 km on ice',
        time: '5-6 hours',
        description: 'Drive to Chilling (starting point). Begin walking on the Chadar. First experience of the frozen river.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Cave at Tilad Do'
      },
      {
        day: 4,
        title: 'Tilad Do to Shingra Koma',
        altitude: '10,800 ft',
        distance: '12 km on ice',
        time: '7-8 hours',
        description: 'Walk through narrow gorges with towering walls. The ice conditions vary throughout.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Cave at Shingra Koma'
      },
      {
        day: 5,
        title: 'Shingra Koma to Tibb Cave',
        altitude: '11,000 ft',
        distance: '12 km on ice',
        time: '7-8 hours',
        description: 'Continue deeper into the gorge. Witness spectacular frozen waterfalls along the way.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tibb Cave'
      },
      {
        day: 6,
        title: 'Tibb Cave to Nerak Falls',
        altitude: '11,100 ft',
        distance: '8 km on ice',
        time: '5-6 hours',
        description: 'Reach the magnificent frozen Nerak waterfall - the highlight of the trek. Explore the area.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Cave near Nerak'
      },
      {
        day: 7,
        title: 'Nerak to Tibb Cave',
        altitude: '11,000 ft',
        distance: '12 km on ice',
        time: '6-7 hours',
        description: 'Begin the return journey. The ice may have changed since your first crossing.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tibb Cave'
      },
      {
        day: 8,
        title: 'Tibb Cave to Chilling to Leh',
        altitude: '11,500 ft',
        distance: '16 km on ice + drive',
        time: '8-9 hours',
        description: 'Long day back to Chilling. Drive to Leh for a warm celebration.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Hotel in Leh'
      },
      {
        day: 9,
        title: 'Departure from Leh',
        altitude: '11,500 ft',
        distance: 'N/A',
        time: 'Flexible',
        description: 'Depart from Leh with memories of an extraordinary adventure.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Specialized extreme cold gear rental',
      'Expert Ladakhi guides',
      'Cave stays with sleeping arrangements',
      'All permits',
      'Transport from/to Leh',
      'Oxygen cylinder and first aid'
    ],

    exclusions: [
      'Flight to/from Leh',
      'Travel insurance (mandatory)',
      'Personal cold weather gear',
      'Hotel in Leh (can be arranged)',
      'Tips and gratuities'
    ],

    things_to_carry: [
      'Extreme cold gear (-40°C rated)',
      'Gumboots (essential for ice)',
      'Multiple thermal layers',
      'Balaclava and face cover',
      'Hand and toe warmers',
      'Down sleeping bag (-25°C rated)',
      'High-energy foods',
      'Personal medications'
    ],

    weather: {
      january: { high: '-5°C', low: '-30°C', condition: 'Extreme Cold' },
      february: { high: '-3°C', low: '-25°C', condition: 'Very Cold' }
    },

    upcoming_batches: [
      { date: 'Jan 15-23, 2026', slots: 8, price: 24950 },
      { date: 'Jan 25-Feb 2, 2026', slots: 10, price: 24950 },
      { date: 'Feb 5-13, 2026', slots: 10, price: 24950 },
      { date: 'Feb 15-23, 2026', slots: 8, price: 24950 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Varun Aggarwal',
        location: 'Gurgaon',
        date: 'February 2025',
        rating: 5,
        title: 'Once in a lifetime experience',
        review: 'Walking on the frozen river is absolutely surreal. Yes, it is extremely cold, but the experience is worth every shiver. The frozen waterfalls are magical.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
      },
      {
        id: 2,
        name: 'Nisha Thakur',
        location: 'Chandigarh',
        date: 'January 2025',
        rating: 5,
        title: 'Pushed my limits',
        review: 'The Chadar trek pushed me beyond what I thought was possible. Sleeping in caves at -25°C, walking on ice - it was extreme but transformative.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'How cold does it get on the Chadar trek?',
        answer: 'Temperatures can drop to -30°C at night. During the day, it ranges from -5°C to -15°C. Proper extreme cold gear is absolutely essential.'
      },
      {
        question: 'Is the Chadar trek safe?',
        answer: 'With proper preparation, experienced guides, and the right gear, it is safe. We constantly monitor ice conditions and have strict safety protocols.'
      },
      {
        question: 'Do I need prior trekking experience?',
        answer: 'Yes, prior high-altitude trekking experience is mandatory. Good fitness and mental preparation for extreme cold are essential.'
      }
    ],

    trek_leader: {
      name: 'Tashi Namgyal',
      experience: '15 years',
      treks_led: 200,
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
      bio: 'A Ladakhi native, Tashi has been leading Chadar expeditions for 15 years. His expertise in reading ice conditions and deep knowledge of the terrain makes him the most trusted guide for this extreme trek.'
    }
  },

  'goechala': {
    slug: 'goechala',
    name: 'Goechala',
    tagline: 'Face to Face with Kanchenjunga',
    hero_image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80'
    ],
    difficulty: 'Difficult',
    duration: '10 Days',
    altitude: '16,000 ft',
    price: 19950,
    original_price: 22500,
    rating: 4.8,
    reviews_count: 1120,
    region: 'Sikkim',
    state: 'Sikkim',
    best_months: ['March', 'April', 'May', 'October', 'November'],
    trek_distance: '90 km',
    base_camp: 'Yuksom',
    group_size: '10-15 trekkers',
    pickup_point: 'Bagdogra Airport',
    
    short_description: 'Get face-to-face views of the mighty Kanchenjunga, the third highest peak in the world.',
    
    overview: `Goechala offers the closest views of Kanchenjunga (8,586m), the third highest peak in the world and the guardian deity of Sikkim. The sunrise from Goechala, with the golden light hitting Kanchenjunga, is one of the most spectacular sights in the Himalayas.

The trek passes through the pristine Kanchenjunga National Park, a UNESCO World Heritage Site. You walk through rhododendron forests that bloom in spring, past the beautiful Samiti Lake, and through high-altitude meadows.

This is a challenging trek that demands good fitness and acclimatization. But for those who make it, the reward is unparalleled - standing at 16,000 feet with the mighty Kanchenjunga towering before you.`,

    highlights: [
      'Closest views of Kanchenjunga (8,586m)',
      'UNESCO World Heritage Site',
      'Beautiful Samiti Lake',
      'Rhododendron forests (spring)',
      'Pristine Sikkim wilderness',
      'Rich Buddhist culture'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Bagdogra to Yuksom',
        altitude: '5,700 ft',
        distance: '150 km drive',
        time: '6-7 hours',
        description: 'Drive through beautiful Sikkim to Yuksom, the historic first capital where the first Chogyal was crowned.',
        meals: ['Dinner'],
        stay: 'Guesthouse in Yuksom'
      },
      {
        day: 2,
        title: 'Yuksom to Sachen',
        altitude: '7,200 ft',
        distance: '8 km',
        time: '5-6 hours',
        description: 'Begin the trek through dense forests. Cross the Paha Khola and Prek Chu rivers.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Sachen'
      },
      {
        day: 3,
        title: 'Sachen to Tshoka',
        altitude: '9,700 ft',
        distance: '7 km',
        time: '5-6 hours',
        description: 'Climb through rhododendron forests. First views of the peaks. Tshoka is a beautiful yak herder\'s settlement.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Tshoka'
      },
      {
        day: 4,
        title: 'Tshoka to Dzongri',
        altitude: '12,980 ft',
        distance: '9 km',
        time: '6-7 hours',
        description: 'Steep climb to Dzongri. As you gain altitude, Kanchenjunga comes into view. Optional sunset point visit.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Dzongri'
      },
      {
        day: 5,
        title: 'Dzongri Acclimatization',
        altitude: '13,680 ft',
        distance: '4 km round trip',
        time: '3-4 hours',
        description: 'Morning hike to Dzongri Top for panoramic views. Rest and acclimatize for higher altitudes.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Dzongri'
      },
      {
        day: 6,
        title: 'Dzongri to Lamuney',
        altitude: '13,600 ft',
        distance: '9 km',
        time: '5-6 hours',
        description: 'Cross Dzongri La pass and descend to Lamuney through beautiful meadows.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Lamuney'
      },
      {
        day: 7,
        title: 'Lamuney to Goechala and back',
        altitude: '16,000 ft',
        distance: '10 km',
        time: '8-10 hours',
        description: 'Early start for sunrise at Goechala. The closest views of Kanchenjunga await. Return to Lamuney.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Lamuney'
      },
      {
        day: 8,
        title: 'Lamuney to Tshoka',
        altitude: '9,700 ft',
        distance: '16 km',
        time: '7-8 hours',
        description: 'Long descent via Samiti Lake. Take time to appreciate this sacred lake.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Tshoka'
      },
      {
        day: 9,
        title: 'Tshoka to Yuksom',
        altitude: '5,700 ft',
        distance: '16 km',
        time: '6-7 hours',
        description: 'Final descent back to Yuksom. Celebrate your successful expedition.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Guesthouse in Yuksom'
      },
      {
        day: 10,
        title: 'Yuksom to Bagdogra',
        altitude: '400 ft',
        distance: '150 km drive',
        time: '6-7 hours',
        description: 'Drive back to Bagdogra with incredible memories of Kanchenjunga.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Camping equipment',
      'Experienced guides and porters',
      'All permits (Kanchenjunga NP, etc.)',
      'Transport from/to Bagdogra',
      'First aid and oxygen'
    ],

    exclusions: [
      'Flights to Bagdogra',
      'Travel insurance (mandatory)',
      'Personal trekking gear',
      'Tips and gratuities'
    ],

    things_to_carry: [
      'Sturdy waterproof trekking boots',
      'Down jacket (-15°C rated)',
      'Rain gear (essential)',
      'Trekking poles',
      'Camera with extra batteries',
      'Personal medications',
      'Energy snacks'
    ],

    weather: {
      march: { high: '8°C', low: '-5°C', condition: 'Pre-spring' },
      april: { high: '12°C', low: '-2°C', condition: 'Rhododendrons bloom' },
      may: { high: '15°C', low: '2°C', condition: 'Clear' },
      october: { high: '10°C', low: '-3°C', condition: 'Post Monsoon' },
      november: { high: '5°C', low: '-8°C', condition: 'Clear & Cold' }
    },

    upcoming_batches: [
      { date: 'Apr 5-14, 2026', slots: 10, price: 19950 },
      { date: 'Apr 20-29, 2026', slots: 12, price: 19950 },
      { date: 'Oct 10-19, 2026', slots: 10, price: 19950 },
      { date: 'Nov 1-10, 2026', slots: 12, price: 19950 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Divya Nair',
        location: 'Kochi',
        date: 'October 2025',
        rating: 5,
        title: 'Kanchenjunga up close!',
        review: 'The sunrise view of Kanchenjunga from Goechala is worth every difficult step. Seeing the third highest peak bathed in golden light is a moment I will cherish forever.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
      },
      {
        id: 2,
        name: 'Arnab Roy',
        location: 'Kolkata',
        date: 'April 2025',
        rating: 5,
        title: 'Toughest and best trek',
        review: 'Goechala tested me like no other trek. But standing before Kanchenjunga, with Samiti Lake behind me, I knew it was all worth it. The rhododendrons in April are a bonus!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'How difficult is Goechala compared to other treks?',
        answer: 'Goechala is one of the more difficult treks in India due to high altitude (16,000 ft), long distances, and challenging terrain. Prior high-altitude experience is essential.'
      },
      {
        question: 'What is the best time for Goechala?',
        answer: 'April-May for rhododendrons blooming and October-November for clear views. Monsoon months (June-September) should be avoided.'
      },
      {
        question: 'Do I need permits?',
        answer: 'Yes, multiple permits are required for Kanchenjunga National Park and the restricted area. All permits are arranged by us.'
      }
    ],

    trek_leader: {
      name: 'Pemba Sherpa',
      experience: '14 years',
      treks_led: 160,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      bio: 'A Sikkim native with extensive mountaineering experience. Pemba\'s knowledge of the Kanchenjunga region and his calm demeanor make him the perfect guide for this challenging expedition.'
    }
  },

  'dayara-bugyal': {
    slug: 'dayara-bugyal',
    name: 'Dayara Bugyal',
    tagline: 'The Meadow of Dreams',
    hero_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80'
    ],
    difficulty: 'Easy',
    duration: '5 Days',
    altitude: '11,950 ft',
    price: 9850,
    original_price: 11000,
    rating: 4.9,
    reviews_count: 2350,
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    best_months: ['December', 'January', 'February', 'March', 'April', 'May'],
    trek_distance: '18 km',
    base_camp: 'Raithal',
    group_size: '20-30 trekkers',
    pickup_point: 'Dehradun Railway Station',
    
    short_description: 'Vast alpine meadows perfect for beginners and families, offering panoramic Himalayan views.',
    
    overview: `Dayara Bugyal is one of the most beautiful and accessible high-altitude meadows in India. "Bugyal" means meadow in the local language, and Dayara is one of the largest in the country, spanning over 28 square kilometers.

The trek is perfect for beginners and families. The trails are gentle, the altitude is manageable, and the rewards are spectacular - vast green meadows in summer and pristine snow fields in winter, all with a backdrop of stunning Himalayan peaks.

What makes Dayara Bugyal special is its accessibility combined with incredible beauty. You can be camping in one of the most beautiful alpine meadows in India within just a day's walk from the village.`,

    highlights: [
      'One of India\'s largest alpine meadows',
      'Perfect for beginners and families',
      'Panoramic views of Himalayan peaks',
      'Snow-covered meadows in winter',
      'Wildflowers in summer',
      'Experience village life in Raithal'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Dehradun to Raithal',
        altitude: '7,500 ft',
        distance: '180 km drive',
        time: '7-8 hours',
        description: 'Scenic drive through Chamba and Uttarkashi to the charming village of Raithal. Explore the traditional architecture.',
        meals: ['Dinner'],
        stay: 'Homestay in Raithal'
      },
      {
        day: 2,
        title: 'Raithal to Gui',
        altitude: '9,500 ft',
        distance: '5 km',
        time: '4-5 hours',
        description: 'Begin the trek through forests. The trail is well-marked and gradual. Gui is a small clearing in the forest.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Gui'
      },
      {
        day: 3,
        title: 'Gui to Dayara Bugyal',
        altitude: '11,950 ft',
        distance: '5 km',
        time: '4-5 hours',
        description: 'The forest opens up to reveal the magnificent Dayara Bugyal. Camp in the meadow with 360-degree mountain views.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Dayara Bugyal'
      },
      {
        day: 4,
        title: 'Dayara Bugyal Exploration & Return to Raithal',
        altitude: '7,500 ft',
        distance: '10 km',
        time: '6-7 hours',
        description: 'Morning exploration of the meadow. Visit the higher reaches for better views. Descend back to Raithal.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Homestay in Raithal'
      },
      {
        day: 5,
        title: 'Raithal to Dehradun',
        altitude: '2,200 ft',
        distance: '180 km drive',
        time: '7-8 hours',
        description: 'Drive back to Dehradun. Expected arrival by evening.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Tents and sleeping bags',
      'Experienced guides',
      'Homestay in Raithal',
      'Transport from/to Dehradun',
      'Permits'
    ],

    exclusions: [
      'Personal expenses',
      'Travel insurance',
      'Personal trekking gear'
    ],

    things_to_carry: [
      'Comfortable trekking shoes',
      'Warm layers (especially for winter)',
      'Rain jacket',
      'Sunscreen and sunglasses',
      'Camera',
      'Personal medications'
    ],

    weather: {
      december: { high: '5°C', low: '-5°C', condition: 'Snow' },
      january: { high: '3°C', low: '-8°C', condition: 'Heavy Snow' },
      february: { high: '5°C', low: '-6°C', condition: 'Snow' },
      march: { high: '10°C', low: '-2°C', condition: 'Snow Melting' },
      april: { high: '15°C', low: '3°C', condition: 'Spring' },
      may: { high: '18°C', low: '6°C', condition: 'Pleasant' }
    },

    upcoming_batches: [
      { date: 'Dec 25-29, 2025', slots: 20, price: 9850 },
      { date: 'Jan 10-14, 2026', slots: 25, price: 9850 },
      { date: 'Feb 5-9, 2026', slots: 25, price: 9850 },
      { date: 'Mar 15-19, 2026', slots: 25, price: 9850 },
      { date: 'Apr 10-14, 2026', slots: 25, price: 8850 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Sanjana Reddy',
        location: 'Hyderabad',
        date: 'March 2026',
        rating: 5,
        title: 'Perfect first trek!',
        review: 'The meadows are absolutely beautiful and the trek is very doable. Perfect for anyone starting their trekking journey. The homestay experience in Raithal was wonderful!',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      },
      {
        id: 2,
        name: 'Manish Khanna',
        location: 'Delhi',
        date: 'January 2026',
        rating: 5,
        title: 'Winter wonderland',
        review: 'The snow-covered meadows in winter are magical. We had a great time making snowmen and enjoying the views. Highly recommended for families.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'Is Dayara Bugyal suitable for children?',
        answer: 'Yes! This is one of the best treks for children above 8 years. The trails are gentle and the distance is short.'
      },
      {
        question: 'What makes Dayara Bugyal special?',
        answer: 'It\'s one of the largest and most accessible alpine meadows in India. The combination of easy trails, beautiful meadows, and stunning views makes it perfect for beginners.'
      },
      {
        question: 'Is the trek good in winter?',
        answer: 'Winter (December-March) is a fantastic time! The meadows are covered in snow, making it a winter wonderland experience.'
      }
    ],

    trek_leader: {
      name: 'Geeta Bhandari',
      experience: '5 years',
      treks_led: 70,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      bio: 'Geeta is passionate about introducing beginners and families to the joy of trekking. Her patient and encouraging style makes her perfect for first-time trekkers.'
    }
  },

  'kuari-pass': {
    slug: 'kuari-pass',
    name: 'Kuari Pass',
    tagline: "Lord Curzon's Trail",
    hero_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80'
    ],
    difficulty: 'Moderate',
    duration: '6 Days',
    altitude: '12,500 ft',
    price: 12950,
    original_price: 14500,
    rating: 4.8,
    reviews_count: 1650,
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    best_months: ['March', 'April', 'May', 'October', 'November', 'December'],
    trek_distance: '33 km',
    base_camp: 'Joshimath',
    group_size: '15-20 trekkers',
    pickup_point: 'Haridwar Railway Station',
    
    short_description: "Follow Lord Curzon's historic trail with panoramic views of Nanda Devi and other Himalayan giants.",
    
    overview: `Kuari Pass, also known as the Curzon Trail, was a favorite of Lord Curzon, the Viceroy of India in the early 1900s. He was so captivated by the views that he had a trail built for himself here.

The trek offers unparalleled views of some of the highest peaks in India - Nanda Devi (7,816m), Dronagiri, Kamet, and many more. The 360-degree panorama from Kuari Pass is one of the best in the Indian Himalayas.

The trail passes through beautiful oak and rhododendron forests, traditional villages, and high-altitude meadows. It's a perfect blend of cultural immersion and natural beauty, with moderate difficulty suitable for most trekkers.`,

    highlights: [
      'Historic Curzon Trail',
      '360° views of Nanda Devi, Kamet, Dronagiri',
      'Oak and rhododendron forests',
      'Traditional Garhwali villages',
      'Perfect moderate difficulty',
      'Spectacular sunrise from Kuari Pass'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Haridwar to Joshimath',
        altitude: '6,100 ft',
        distance: '280 km drive',
        time: '10-11 hours',
        description: 'Scenic drive along the Alaknanda River through Rishikesh, Devprayag, and Karnaprayag to Joshimath.',
        meals: ['Lunch', 'Dinner'],
        stay: 'Hotel in Joshimath'
      },
      {
        day: 2,
        title: 'Joshimath to Dhak to Gulling',
        altitude: '9,100 ft',
        distance: '6 km trek',
        time: '4-5 hours',
        description: 'Drive to Dhak village and begin trekking through terraced fields and forests to Gulling.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Gulling'
      },
      {
        day: 3,
        title: 'Gulling to Khullara',
        altitude: '11,000 ft',
        distance: '9 km',
        time: '6-7 hours',
        description: 'Trek through beautiful rhododendron forests. The peaks start appearing on the horizon. Camp at Khullara.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Khullara'
      },
      {
        day: 4,
        title: 'Khullara to Kuari Pass to Tali',
        altitude: '12,500 ft (pass)',
        distance: '8 km',
        time: '6-7 hours',
        description: 'Early morning push to Kuari Pass for sunrise. Witness the stunning 360° panorama. Descend to Tali.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Tents at Tali'
      },
      {
        day: 5,
        title: 'Tali to Auli to Joshimath',
        altitude: '6,100 ft',
        distance: '8 km trek + cable car',
        time: '4-5 hours',
        description: 'Trek to Auli and take the cable car down. Visit the famous ski slopes. Return to Joshimath.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        stay: 'Hotel in Joshimath'
      },
      {
        day: 6,
        title: 'Joshimath to Haridwar',
        altitude: '1,000 ft',
        distance: '280 km drive',
        time: '10-11 hours',
        description: 'Drive back to Haridwar. Optional Ganga Aarti in the evening.',
        meals: ['Breakfast'],
        stay: 'Own arrangement'
      }
    ],

    inclusions: [
      'All meals during the trek',
      'Camping equipment',
      'Expert trek leaders',
      'Transport from/to Haridwar',
      'Auli cable car',
      'Permits and entry fees'
    ],

    exclusions: [
      'Personal expenses',
      'Travel insurance',
      'Personal trekking gear'
    ],

    things_to_carry: [
      'Trekking boots',
      'Layered clothing',
      'Rain jacket',
      'Warm jacket for evenings',
      'Sunscreen and sunglasses',
      'Camera with extra batteries'
    ],

    weather: {
      march: { high: '10°C', low: '-2°C', condition: 'Spring' },
      april: { high: '15°C', low: '2°C', condition: 'Pleasant' },
      may: { high: '18°C', low: '5°C', condition: 'Warm' },
      october: { high: '12°C', low: '0°C', condition: 'Clear' },
      november: { high: '8°C', low: '-4°C', condition: 'Cold & Clear' },
      december: { high: '5°C', low: '-8°C', condition: 'Snow' }
    },

    upcoming_batches: [
      { date: 'Mar 10-15, 2026', slots: 15, price: 12950 },
      { date: 'Apr 5-10, 2026', slots: 18, price: 12950 },
      { date: 'Oct 15-20, 2026', slots: 15, price: 12950 },
      { date: 'Nov 5-10, 2026', slots: 18, price: 12950 },
      { date: 'Dec 20-25, 2025', slots: 15, price: 12950 }
    ],

    reviews: [
      {
        id: 1,
        name: 'Raghav Mehta',
        location: 'Ahmedabad',
        date: 'November 2025',
        rating: 5,
        title: 'Stunning 360° views!',
        review: 'The views from Kuari Pass are unforgettable. Seeing Nanda Devi bathed in golden sunrise light is an experience that stays with you. The historic significance adds to the charm.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
      },
      {
        id: 2,
        name: 'Kavitha Iyer',
        location: 'Bangalore',
        date: 'April 2025',
        rating: 5,
        title: 'Perfect moderate trek',
        review: 'Not too easy, not too hard - just right. The rhododendrons in April are a bonus. And the descent via Auli cable car is a unique experience!',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      }
    ],

    faqs: [
      {
        question: 'Why is it called the Curzon Trail?',
        answer: 'Lord Curzon, the Viceroy of India, was so captivated by the views that he had this trail developed in the early 1900s. It became known as the Curzon Trail.'
      },
      {
        question: 'What peaks can we see from Kuari Pass?',
        answer: 'You get 360° views of Nanda Devi (7,816m), Kamet (7,756m), Dronagiri, Hathi Parbat, Nilkanth, and many more peaks.'
      },
      {
        question: 'Is the Auli cable car included?',
        answer: 'Yes, the descent via the Asia\'s longest cable car from Auli to Joshimath is included in the trek.'
      }
    ],

    trek_leader: {
      name: 'Prakash Rawat',
      experience: '10 years',
      treks_led: 130,
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
      bio: 'A history enthusiast who loves sharing stories of Lord Curzon and the British era. Prakash\'s knowledge of local culture and the trail\'s history enriches every trek.'
    }
  }
}

// Helper function to parse JSON fields from CMS
function parseJsonField(value, fallback = null) {
  if (!value) return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

// Transform CMS data to match the expected format
function transformCmsData(data) {
  if (!data) return null
  return {
    ...data,
    gallery: parseJsonField(data.gallery, []),
    best_months: parseJsonField(data.best_months, []),
    highlights: parseJsonField(data.highlights, []),
    itinerary: parseJsonField(data.itinerary, []),
    inclusions: parseJsonField(data.inclusions, []),
    exclusions: parseJsonField(data.exclusions, []),
    things_to_carry: parseJsonField(data.things_to_carry, []),
    weather: parseJsonField(data.weather, {}),
    upcoming_batches: parseJsonField(data.upcoming_batches, []),
    reviews: parseJsonField(data.reviews, []),
    faqs: parseJsonField(data.faqs, []),
    trek_leader: parseJsonField(data.trek_leader, null)
  }
}

function TrekDetail() {
  const { slug } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedDay, setExpandedDay] = useState(1)
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)
  
  // Try to fetch from CMS first
  const { data: cmsData, loading } = useEntryByField('trek_detail', 'slug', slug, null)
  
  // Get trek data from CMS (transformed) or fallback
  const transformedCmsData = transformCmsData(cmsData)
  const trek = transformedCmsData || defaultTreks[slug] || defaultTreks['kedarkantha']

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="trek-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading trek details...</p>
      </div>
    )
  }

  if (!trek) {
    return (
      <div className="trek-detail-error">
        <h2>Trek Not Found</h2>
        <p>The trek you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faqs', label: 'FAQs' }
  ]

  return (
    <div className="trek-detail">
      {/* Hero Section */}
      <section className="trek-hero" style={{ backgroundImage: `url(${trek.hero_image})` }}>
        <div className="trek-hero__overlay"></div>
        <div className="trek-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="trek-hero__back">
              <ArrowLeft size={20} />
              <span>Back to All Treks</span>
            </Link>
            
            <div className="trek-hero__badge">{trek.region}</div>
            <h1 className="trek-hero__title">{trek.name}</h1>
            <p className="trek-hero__tagline">{trek.tagline}</p>
            
            <div className="trek-hero__meta">
              <span className="trek-hero__meta-item">
                <Mountain size={18} />
                {trek.altitude}
              </span>
              <span className="trek-hero__meta-item">
                <Clock size={18} />
                {trek.duration}
              </span>
              <span className="trek-hero__meta-item">
                <MapPin size={18} />
                {trek.trek_distance}
              </span>
              <span className="trek-hero__meta-item difficulty">
                {trek.difficulty}
              </span>
            </div>

            <div className="trek-hero__rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(trek.rating) ? '#facc15' : 'none'} color="#facc15" />
                ))}
              </div>
              <span className="rating-value">{trek.rating}</span>
              <span className="reviews-count">({trek.reviews_count} reviews)</span>
            </div>
          </motion.div>
        </div>

        <div className="trek-hero__actions">
          <button className="trek-hero__action-btn">
            <Share2 size={20} />
          </button>
          <button className="trek-hero__action-btn">
            <Bookmark size={20} />
          </button>
        </div>
      </section>

      <div className="trek-detail__container">
        {/* Quick Info Bar */}
        <motion.div 
          className="trek-quick-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="trek-quick-info__item">
            <Calendar size={20} />
            <div>
              <span className="label">Best Time</span>
              <span className="value">{trek.best_months?.join(', ')}</span>
            </div>
          </div>
          <div className="trek-quick-info__item">
            <MapPin size={20} />
            <div>
              <span className="label">Base Camp</span>
              <span className="value">{trek.base_camp}</span>
            </div>
          </div>
          <div className="trek-quick-info__item">
            <Users size={20} />
            <div>
              <span className="label">Group Size</span>
              <span className="value">{trek.group_size}</span>
            </div>
          </div>
          <div className="trek-quick-info__item">
            <MapPin size={20} />
            <div>
              <span className="label">Pickup Point</span>
              <span className="value">{trek.pickup_point}</span>
            </div>
          </div>
        </motion.div>

        <div className="trek-detail__main">
          {/* Content Section */}
          <div className="trek-detail__content">
            {/* Navigation Tabs */}
            <div className="trek-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`trek-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="trek-tab-content"
              >
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="trek-overview">
                    <div className="trek-overview__description">
                      <h3>About This Trek</h3>
                      <p className="short-desc">{trek.short_description}</p>
                      <div className="full-desc">
                        {trek.overview?.split('\n\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>

                    <div className="trek-highlights">
                      <h3>Trek Highlights</h3>
                      <ul>
                        {trek.highlights?.map((highlight, i) => (
                          <li key={i}>
                            <Check size={18} />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gallery */}
                    <div className="trek-gallery">
                      <h3>Photo Gallery</h3>
                      <div className="trek-gallery__grid">
                        {trek.gallery?.map((img, i) => (
                          <div key={i} className="trek-gallery__item">
                            <img src={img} alt={`${trek.name} - Image ${i + 1}`} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weather */}
                    {trek.weather && (
                      <div className="trek-weather">
                        <h3>Weather Conditions</h3>
                        <div className="trek-weather__grid">
                          {Object.entries(trek.weather).map(([month, data]) => (
                            <div key={month} className="weather-card">
                              <span className="month">{month.charAt(0).toUpperCase() + month.slice(1)}</span>
                              <div className="temps">
                                <span className="high"><Thermometer size={14} /> {data.high}</span>
                                <span className="low">{data.low}</span>
                              </div>
                              <span className="condition">{data.condition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trek Leader */}
                    {trek.trek_leader && (
                      <div className="trek-leader">
                        <h3>Your Trek Leader</h3>
                        <div className="trek-leader__card">
                          <img src={trek.trek_leader.image} alt={trek.trek_leader.name} />
                          <div className="trek-leader__info">
                            <h4>{trek.trek_leader.name}</h4>
                            <div className="trek-leader__stats">
                              <span><Award size={16} /> {trek.trek_leader.experience} experience</span>
                              <span><Mountain size={16} /> {trek.trek_leader.treks_led}+ treks led</span>
                            </div>
                            <p>{trek.trek_leader.bio}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                  <div className="trek-itinerary">
                    <h3>Day-by-Day Itinerary</h3>
                    <div className="itinerary-list">
                      {trek.itinerary?.map((day) => (
                        <div 
                          key={day.day} 
                          className={`itinerary-day ${expandedDay === day.day ? 'expanded' : ''}`}
                        >
                          <div 
                            className="itinerary-day__header"
                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                          >
                            <div className="itinerary-day__number">Day {day.day}</div>
                            <div className="itinerary-day__title">
                              <h4>{day.title}</h4>
                              <div className="itinerary-day__meta">
                                <span><Mountain size={14} /> {day.altitude}</span>
                                <span><MapPin size={14} /> {day.distance}</span>
                                <span><Clock size={14} /> {day.time}</span>
                              </div>
                            </div>
                            {expandedDay === day.day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                          
                          <AnimatePresence>
                            {expandedDay === day.day && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="itinerary-day__content"
                              >
                                <p>{day.description}</p>
                                <div className="itinerary-day__details">
                                  <div className="detail">
                                    <Utensils size={16} />
                                    <span>{day.meals?.join(', ')}</span>
                                  </div>
                                  <div className="detail">
                                    <Tent size={16} />
                                    <span>{day.stay}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inclusions Tab */}
                {activeTab === 'inclusions' && (
                  <div className="trek-inclusions">
                    <div className="inclusions-section">
                      <h3><Check size={20} /> What's Included</h3>
                      <ul className="inclusions-list included">
                        {trek.inclusions?.map((item, i) => (
                          <li key={i}>
                            <Check size={16} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="inclusions-section">
                      <h3>What's Not Included</h3>
                      <ul className="inclusions-list excluded">
                        {trek.exclusions?.map((item, i) => (
                          <li key={i}>
                            <span className="x-mark">×</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="inclusions-section">
                      <h3>Things to Carry</h3>
                      <ul className="things-to-carry">
                        {trek.things_to_carry?.map((item, i) => (
                          <li key={i}>
                            <ChevronRight size={16} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="trek-reviews">
                    <div className="reviews-header">
                      <div className="reviews-summary">
                        <span className="rating-big">{trek.rating}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} fill={i < Math.floor(trek.rating) ? '#facc15' : 'none'} color="#facc15" />
                          ))}
                        </div>
                        <span className="reviews-count">Based on {trek.reviews_count} reviews</span>
                      </div>
                    </div>

                    <div className="reviews-list">
                      {trek.reviews?.map((review) => (
                        <div key={review.id} className="review-card">
                          <div className="review-card__header">
                            <img src={review.avatar} alt={review.name} />
                            <div className="review-card__info">
                              <h4>{review.name}</h4>
                              <span>{review.location} • {review.date}</span>
                            </div>
                            <div className="review-card__rating">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="#facc15" color="#facc15" />
                              ))}
                            </div>
                          </div>
                          <h5 className="review-card__title">{review.title}</h5>
                          <p className="review-card__text">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs Tab */}
                {activeTab === 'faqs' && (
                  <div className="trek-faqs">
                    <h3>Frequently Asked Questions</h3>
                    <div className="faq-list">
                      {trek.faqs?.map((faq, i) => (
                        <div 
                          key={i} 
                          className={`faq-item ${expandedFaq === i ? 'expanded' : ''}`}
                        >
                          <div 
                            className="faq-item__question"
                            onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          >
                            <span>{faq.question}</span>
                            {expandedFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                          <AnimatePresence>
                            {expandedFaq === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="faq-item__answer"
                              >
                                <p>{faq.answer}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar - Booking Card */}
          <aside className="trek-detail__sidebar">
            <div className="booking-card">
              <div className="booking-card__price">
                <span className="original">₹{trek.original_price?.toLocaleString()}</span>
                <span className="current">₹{trek.price?.toLocaleString()}</span>
                <span className="per-person">per person</span>
              </div>

              <div className="booking-card__dates">
                <h4>Upcoming Batches</h4>
                <div className="dates-list">
                  {trek.upcoming_batches?.slice(0, 5).map((batch, i) => (
                    <label 
                      key={i} 
                      className={`date-option ${selectedBatch === i ? 'selected' : ''}`}
                    >
                      <input 
                        type="radio" 
                        name="batch" 
                        checked={selectedBatch === i}
                        onChange={() => setSelectedBatch(i)}
                      />
                      <div className="date-info">
                        <span className="date">{batch.date}</span>
                        <span className="slots">{batch.slots} slots left</span>
                      </div>
                      <span className="batch-price">₹{batch.price?.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-block">
                Book Now
              </button>

              <div className="booking-card__contact">
                <p>Need help deciding?</p>
                <a href="tel:+919876543210" className="contact-link">
                  <Phone size={16} />
                  <span>+91 98765 43210</span>
                </a>
              </div>

              <div className="booking-card__features">
                <div className="feature">
                  <Shield size={18} />
                  <span>100% Safety Guarantee</span>
                </div>
                <div className="feature">
                  <Leaf size={18} />
                  <span>Eco-Friendly Practices</span>
                </div>
                <div className="feature">
                  <Heart size={18} />
                  <span>Trek Again Policy</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default TrekDetail

