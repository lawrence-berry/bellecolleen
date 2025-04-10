const fs = require('fs');
const path = require('path');

const artworksDir = path.join(process.cwd(), 'public', 'images', 'artworks');
const outputFile = path.join(process.cwd(), 'src', 'data', 'collection.json');

// Complete map of artworks to their descriptions and mediums
const artworkDetails = {
  'Anima': {
    medium: 'Acrylic with metallic and ink',
    description: 'Representing the feminine aspect of the psyche in Jungian psychology.'
  },
  'Bollingen': {
    medium: 'Acrylic with metallic and ink',
    description: 'Inspired by Carl Jung\'s retreat at Bollingen Tower.'
  },
  'Burghölzli': {
    medium: 'Acrylic with metallic and ink',
    description: 'Named after the psychiatric hospital where Jung worked.',
    notes: 'Acrylic & wax on reverse'
  },
  'Chiwantopel': {
    medium: 'Acrylic with metallic and ink',
    description: 'Based on Jung\'s vision of an American Indian chief.',
    notes: 'Watercolour on reverse'
  },
  'Dalada-Maligawa': {
    medium: 'Acrylic with metallic and ink',
    description: 'Inspired by the Temple of the Sacred Tooth Relic in Kandy, Sri Lanka.'
  },
  'Emma': {
    medium: 'Acrylic with metallic and ink',
    description: 'Named after Emma Jung, Carl Jung\'s wife and fellow analyst.'
  },
  'Flüeli': {
    medium: 'Acrylic with metallic and ink',
    description: 'Reference to Flüeli-Ranft, home of Swiss saint Nicholas of Flüe.'
  },
  'Fomalhaut': {
    medium: 'Acrylic with metallic and ink',
    description: 'Named after one of the brightest stars in the night sky.'
  },
  'Heart of the Mystic Rose': {
    medium: 'Acrylic with metallic and ink',
    description: 'A profound exploration of mystical symbolism and inner transformation.'
  },
  'Konarak': {
    medium: 'Acrylic with metallic and ink',
    description: 'Inspired by the Sun Temple at Konark, India.'
  },
  'Laufen': {
    medium: 'Acrylic with metallic and ink',
    description: 'A dynamic exploration of movement and flow.'
  },
  'Mary': {
    medium: 'Pastel',
    description: 'A representation of divine feminine energy.',
    notes: 'Silver foil mount'
  },
  'Pardes Rimmonim': {
    medium: 'Acrylic with metallic and ink',
    description: 'Reference to the mystical Jewish text \'Garden of Pomegranates\'.'
  },
  'Philemon': {
    medium: 'Pastel',
    description: 'Named after Jung\'s spiritual guide in his visionary experiences.'
  },
  'Sälig Lüt': {
    medium: 'Pastel',
    description: 'Swiss German for \'Blessed People\'.',
    notes: 'Acrylic on reverse'
  },
  'Secret of the Golden Flower': {
    medium: 'Acrylic with metallic and ink',
    description: 'Based on the Taoist text of spiritual awakening.'
  },
  'Sophia': {
    medium: 'Pastel',
    description: 'Embodying divine wisdom and spiritual enlightenment.'
  },
  'The Diver': {
    medium: 'Acrylic with metallic and ink',
    description: 'Symbolizing the journey into the depths of consciousness.'
  },
  'Tozeur': {
    medium: 'Acrylic with metallic and ink',
    description: 'Inspired by the desert oasis in Tunisia.',
    notes: 'Watercolour on reverse'
  }
};

try {
  // Read the artworks directory
  const files = fs.readdirSync(artworksDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file));

  // Generate collection items
  const items = files.map((file, index) => {
    const title = path.parse(file).name;
    const details = artworkDetails[title] || {
      medium: 'Unknown',
      description: 'Description pending.'
    };

    return {
      id: index + 1,
      title: title,
      image: `/images/artworks/${file}`,
      medium: details.medium,
      description: details.description,
      ...(details.notes && { notes: details.notes })
    };
  });

  // Create the collection JSON
  const collection = {
    items: items
  };

  // Write to file
  fs.writeFileSync(outputFile, JSON.stringify(collection, null, 2));
  console.log(`Generated collection.json with ${items.length} artworks`);

} catch (error) {
  console.error('Error generating collection:', error);
}
