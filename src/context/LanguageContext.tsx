import { createContext, useContext, useState, type ReactNode } from 'react';
import { MenuCategoryId } from '../types/menu';

export type AppLanguage = 'en' | 'hi';

interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (next: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<AppLanguage>('en');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const CATEGORY_TRANSLATIONS: Record<
  MenuCategoryId,
  { hiLabel: string; hiShort: string; hiDesc: string }
> = {
  refreshments: {
    hiLabel: 'रिफ्रेशमेंट्स और साइड्स',
    hiShort: 'साइड्स व ड्रिंक्स',
    hiDesc: 'ठंडी लस्सी, मसाला पापड़, ताज़ा ग्रीन सलाद और रायता।',
  },
  soups: {
    hiLabel: 'सूप',
    hiShort: 'सूप',
    hiDesc: 'गरमा-गरम मनचाऊ, हॉट एंड सॉर और क्लियर सूप।',
  },
  tandoor: {
    hiLabel: 'तंदूर और इंडियन स्टार्टर्स',
    hiShort: 'तंदूर',
    hiDesc: 'कोयले पर भुने पनीर टिक्का, स्मोकी कबाब और चिकन तंदूरी।',
  },
  chinese: {
    hiLabel: 'चाइनीज़ फूड',
    hiShort: 'चाइनीज़',
    hiDesc: 'वोक-टॉस्ड स्टार्टर्स, क्रिस्पी लॉलीपॉप, फ्राइड राइस और हक्का नूडल्स।',
  },
  'indian-main': {
    hiLabel: 'इंडियन मेन कोर्स',
    hiShort: 'मेन कोर्स',
    hiDesc: 'घर जैसा स्वाद वाली दाल, पनीर ग्रेवी, कोल्हापुरी-मालवणी करी और हांडी।',
  },
  'rice-biryani': {
    hiLabel: 'राइस, खिचड़ी और बिरयानी',
    hiShort: 'राइस व बिरयानी',
    hiDesc: 'खुशबूदार बासमती बिरयानी, पुलाव और आरामदायक दाल खिचड़ी।',
  },
  'roti-naan': {
    hiLabel: 'रोटी और नान',
    hiShort: 'रोटी व नान',
    hiDesc: 'ताज़ी तंदूरी रोटी, भाकरी, लच्छा पराठा और बटर गार्लिक नान।',
  },
  'extras-sweets': {
    hiLabel: 'एक्स्ट्रा और मिठाई',
    hiShort: 'मिठाई व अन्य',
    hiDesc: 'स्पेशल शेज़वान चटनी, रायता और गरम गुलाब जामुन।',
  },
};

export const UI_COPY = {
  en: {
    nav: {
      about: 'About',
      menu: 'Menu',
      party: 'Party Orders',
      gallery: 'Gallery',
      contact: 'Contact',
      orderCart: 'Order Cart',
    },
    hero: {
      headline: 'Good Food. Great Flavours. Crafted with Love.',
      subtext:
        "Explore delicious Chinese, Indian and Tandoor favourites at Dolly's Kitchen, Lonavala.",
      exploreMenu: 'Explore Our Menu',
      orderWhatsApp: 'Order on WhatsApp',
      pauseVideo: 'Pause Video',
      playVideo: 'Play Video',
      locationLabel: 'Location',
      servicesLabel: 'Services',
      servicesValue: 'Takeaway & Home Delivery',
      hoursLabel: 'Opening Hours',
      statusOpen: 'Open Now · Cooking fresh until 11:30 PM',
      statusClosed: 'Opens at 4:30 PM · Pre-order on WhatsApp',
    },
    about: {
      kicker: "About Dolly's Kitchen · डॉलीज़ किचन",
      headline: 'Homestyle Flavors, Crafted with Love.',
      story:
        "Serving Lonavala every evening from 4:30 PM – 11:30 PM, Dolly's Kitchen (डॉलीज़ किचन) brings together three beloved culinary traditions under one roof: wok-fired Indo-Chinese favourites, rich homestyle Indian curries and biryanis, and smoky charcoal-grilled Tandoor starters.",
      callout: 'We Accept Orders For All Types Of Meals, As Well As Online Orders.',
      pillars: [
        {
          title: 'Freshly Prepared',
          desc: 'Every dish is cooked fresh to order over high-flame woks and glowing tandoors.',
        },
        {
          title: 'Homestyle Spices',
          desc: 'Balanced spice blends for comforting dals, handis, biryanis, and Gavran curries.',
        },
        {
          title: 'Hygienic Packing',
          desc: 'Carefully packed for quick Lonavala takeaway and warm home delivery.',
        },
      ],
      dietNote: 'Vegetarian & Non-Vegetarian dishes cooked to order.',
    },
    favorites: {
      kicker: 'House Bestsellers',
      title: 'Lonavala Evening Favorites',
      subtitle:
        'Skip straight to our fastest-moving Tandoor, Chinese, and North Indian classics—ready for one-tap cart checkout.',
      addCombo: 'Add Combo',
      addDish: 'Add to Cart',
    },
    menu: {
      kicker: 'Complete Takeaway & Delivery Menu',
      title: 'Explore Our Food Menu',
      subtitle:
        "Select dishes, portions, and quantities below, then review your order in the cart to send it directly to Dolly's Kitchen on WhatsApp.",
      partyCta: 'Looking for Per-Kg Party Orders?',
      searchPlaceholder: 'Search dishes (e.g. Paneer Tikka, Hakka Noodles, Biryani)...',
      allItems: 'All Items',
      veg: 'Veg',
      nonVeg: 'Non-Veg',
      allCategories: 'All Categories',
      addToCart: 'Add to Cart',
      resetFilters: 'Reset all filters',
    },
    party: {
      kicker: 'Party & Bulk Orders · Per Kg Menu',
      title: 'Planning a Gathering? Let Us Handle the Food!',
      subtitle:
        'Ideal for family gatherings, weekend villa parties in Lonavala, group meals, and bulk catering enquiries. Order our signature biryanis, pulaos, and Gavran curries by the kilo.',
      note: "Note: Bulk-order rates and advance booking details must be confirmed directly with Dolly's Kitchen.",
      plannerTitle: 'Villa & Party Quantity Estimator',
      plannerSubtitle:
        'Select your group size or adjust kilo quantities below (1 kg typically serves 6–7 guests) to pre-fill your WhatsApp quote.',
      recommendedLabel: 'Recommended Total',
      sendEstimate: 'Send Party Estimate on WhatsApp',
    },
    gallery: {
      kicker: 'Culinary Showcase · Hudco Colony, Lonavala',
      title: 'Night-Kitchen & Food Gallery',
      subtitle:
        'Real snapshots from our Hudco Colony kitchen counter alongside highlights across our Chinese wok, charcoal Tandoor, curries, and biryanis.',
      stripTitle: 'Evening Kitchen in Hudco Colony',
      stripSubtitle:
        'Open-flame wok tossing, steaming serving bowls, and hygienic foil takeaway containers packed hot every evening.',
    },
    contact: {
      kicker: 'Visit or Reach Out',
      title: "Contact Dolly's Kitchen",
      subtitle: 'Available daily in Lonavala for freshly prepared Takeaway and Home Delivery.',
      locationLabel: 'Location',
      hoursLabel: 'Opening Hours',
      phoneLabel: 'Phone & Orders',
      emailLabel: 'Email',
      chatWhatsApp: 'Chat on WhatsApp',
      emailUs: 'Email Us',
    },
  },
  hi: {
    nav: {
      about: 'हमारे बारे में',
      menu: 'मेनू',
      party: 'पार्टी ऑर्डर',
      gallery: 'गैलरी',
      contact: 'संपर्क',
      orderCart: 'कार्ट',
    },
    hero: {
      headline: 'लाजवाब स्वाद. ताज़ा खाना. प्यार से परोसा हुआ।',
      subtext:
        'लोनावाला के डॉलीज़ किचन में स्वादिष्ट चाइनीज़, इंडियन और तंदूर व्यंजनों का आनंद लें।',
      exploreMenu: 'मेनू देखें',
      orderWhatsApp: 'WhatsApp पर ऑर्डर करें',
      pauseVideo: 'वीडियो रोकें',
      playVideo: 'वीडियो चलाएं',
      locationLabel: 'पता',
      servicesLabel: 'सेवाएं',
      servicesValue: 'टेकअवे और होम डिलीवरी',
      hoursLabel: 'खुलने का समय',
      statusOpen: 'अभी खुला है · रात 11:30 बजे तक ताज़ा भोजन',
      statusClosed: 'शाम 4:30 बजे खुलता है · WhatsApp पर प्री-ऑर्डर करें',
    },
    about: {
      kicker: "डॉलीज़ किचन के बारे में · Dolly's Kitchen",
      headline: 'घर जैसा स्वाद, हर शाम ताज़ा तैयार।',
      story:
        'लोनावाला में हर शाम 4:30 PM – 11:30 PM तक सेवा देते हुए, डॉलीज़ किचन तीन लोकप्रिय स्वादों को एक साथ लाता है: तेज़ आंच पर बने इंडो-चाइनीज़ व्यंजन, घर जैसी स्वादिष्ट इंडियन करी व बिरयानी, और कोयले की आंच पर भुने तंदूर स्टार्टर्स।',
      callout: 'हम सभी प्रकार के भोजन और ऑनलाइन ऑर्डर स्वीकार करते हैं।',
      pillars: [
        {
          title: 'ताज़ा तैयार',
          desc: 'हर ऑर्डर तेज़ आंच वाले वोक और गरम तंदूर में तुरंत ताज़ा बनाया जाता है।',
        },
        {
          title: 'घरेलू मसाले',
          desc: 'दाल, हांडी, बिरयानी और गावरान करी के लिए संतुलित और शुद्ध मसाले।',
        },
        {
          title: 'हाइजीनिक पैकिंग',
          desc: 'लोनावाला में टेकअवे और होम डिलीवरी के लिए साफ-सुथरी और गरम पैकिंग।',
        },
      ],
      dietNote: 'शाकाहारी और मांसाहारी दोनों व्यंजन ताज़ा बनाए जाते हैं।',
    },
    favorites: {
      kicker: 'ग्राहकों की पहली पसंद',
      title: 'लोनावाला के पसंदीदा कॉम्बो और व्यंजन',
      subtitle:
        'हमारे सबसे लोकप्रिय तंदूर, चाइनीज़ और इंडियन व्यंजन सीधे एक क्लिक में कार्ट में जोड़ें।',
      addCombo: 'कॉम्बो जोड़ें',
      addDish: 'कार्ट में जोड़ें',
    },
    menu: {
      kicker: 'संपूर्ण टेकअवे और डिलीवरी मेनू',
      title: 'हमारा फूड मेनू देखें',
      subtitle:
        'नीचे से अपनी पसंद के व्यंजन और मात्रा चुनें, और कार्ट से सीधे डॉलीज़ किचन को WhatsApp पर ऑर्डर भेजें।',
      partyCta: 'किलो के हिसाब से पार्टी ऑर्डर चाहिए?',
      searchPlaceholder: 'व्यंजन खोजें (जैसे Paneer Tikka, Hakka Noodles, Biryani)...',
      allItems: 'सभी व्यंजन',
      veg: 'शाकाहारी',
      nonVeg: 'मांसाहारी',
      allCategories: 'सभी श्रेणियां',
      addToCart: 'कार्ट में जोड़ें',
      resetFilters: 'फ़िल्टर रीसेट करें',
    },
    party: {
      kicker: 'पार्टी और बल्क ऑर्डर · प्रति किलो मेनू',
      title: 'पार्टी या गेट-टुगेदर की प्लानिंग है? खाना हम पर छोड़ दें!',
      subtitle:
        'पारिवारिक समारोह, लोनावाला विला पार्टी और ग्रुप मील के लिए बिरयानी, पुलाव और गावरान करी प्रति किलो ऑर्डर करें।',
      note: 'नोट: प्रति किलो रेट और एडवांस बुकिंग की पुष्टि डॉलीज़ किचन से सीधे WhatsApp पर करें।',
      plannerTitle: 'विला और पार्टी क्वांटिटी अनुमानक',
      plannerSubtitle:
        'मेहमानों की संख्या चुनें या किलो मात्रा सेट करें (1 किलो लगभग 6–7 लोगों के लिए पर्याप्त है) और सीधे WhatsApp कोट भेजें।',
      recommendedLabel: 'सुझावित कुल मात्रा',
      sendEstimate: 'WhatsApp पर पार्टी अनुमान भेजें',
    },
    gallery: {
      kicker: 'किचन और फूड झलक · हुडको कॉलोनी, लोनावाला',
      title: 'नाइट-किचन और फूड गैलरी',
      subtitle:
        'हुडको कॉलोनी स्थित हमारे किचन काउंटर की असली तस्वीरें और हमारे चाइनीज़, तंदूर, करी व बिरयानी की झलक।',
      stripTitle: 'हुडको कॉलोनी का शाम का किचन',
      stripSubtitle:
        'तेज़ आंच पर वोक कुकिंग, गरमा-गरम परोसे जाने वाले बाउल और साफ-सुथरी फॉइल टेकअवे पैकिंग।',
    },
    contact: {
      kicker: 'संपर्क करें या पधारें',
      title: 'डॉलीज़ किचन से संपर्क करें',
      subtitle: 'लोनावाला में टेकअवे और होम डिलीवरी के लिए प्रतिदिन उपलब्ध।',
      locationLabel: 'पता',
      hoursLabel: 'खुलने का समय',
      phoneLabel: 'फोन और ऑर्डर',
      emailLabel: 'ईमेल',
      chatWhatsApp: 'WhatsApp पर बात करें',
      emailUs: 'ईमेल भेजें',
    },
  },
} as const;
