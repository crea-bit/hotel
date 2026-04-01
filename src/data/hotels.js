const hotelImages = [
  "1455587734955-081b22074882", // Grand Exterior (Confirmed Working)
  "1522708323590-d24dbb6b0267", // Loft (Confirmed Working)
  "1535827841776-24afc1e255ac", // City View (Confirmed Working)
  "1598928506311-c55dd1b7db71", // Resort Night (Confirmed Working)
  "1566073771259-6a8506099945"  // Pool (Confirmed Working)
];

const locations = [
  "Banjara Hills",
  "Jubilee Hills",
  "Hitech City",
  "Gachibowli",
  "Ameerpet",
  "Kukatpally",
  "Begumpet",
  "Madhapur",
  "Kondapur",
  "Secunderabad"
];

const prefixes = ["Taj", "Trident", "Novotel", "ITC", "Radisson", "Hyatt", "Westin", "Marriott", "Avasa", "Lemon Tree"];

const possibleAmenities = ["Free WiFi", "Swimming Pool", "Gym", "Spa", "Breakfast Included", "Bar/Lounge", "Conference Room", "Free Parking", "Airport Shuttle"];

const hotels = [
  ...Array.from({ length: 30 }, (_, i) => {
    const loc = locations[i % locations.length];
    const prefix = prefixes[i % prefixes.length];
    const imgId = hotelImages[i % hotelImages.length];
    
    // Seeded randomness for persistence
    const seed = (i * 13) % possibleAmenities.length;
    const amenities = possibleAmenities.slice(seed, seed + 4 + (i % 3)); // 4 to 6 amenities per hotel
    
    return {
      id: i + 1,
      name: `${prefix} ${loc}`,
      location: `${loc}, Hyderabad`,
      description: `Experience uncompromising luxury at the prestigious ${prefix} ${loc}. Perfectly situated in the heart of Hyderabad, this world-class property is designed for both upscale business travelers and leisure seekers. Enjoy elite access to our signature ${amenities[0].toLowerCase()} and relax in state-of-the-art soundproof suites featuring breathtaking city skyline views. Whether you're dining at our award-winning multi-cuisine restaurant or unwinding the evening away with our exclusive ${amenities[1] ? amenities[1].toLowerCase() : 'room service'}, every moment here is crafted for perfection.`,
      amenities: amenities,
      price: 1500 + (i * 250) + (i % 2 === 0 ? 500 : 0), // Varying realistic prices
      type: i % 3 === 0 ? "Non-AC" : "AC", // More AC than Non-AC usually in premium lists
      rating: (3.5 + (i * 0.1) % 1.5).toFixed(1), // Pseudo-random rating between 3.5 and 5.0
      image: `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=600&h=400`
    };
  })
];

export default hotels;