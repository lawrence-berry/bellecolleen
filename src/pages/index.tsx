import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Splash from '../components/Splash';
import Image from 'next/image';
import Link from 'next/link';
import featuredData from '../data/featured.json';
import collectionData from '../data/collection.json';
import { getImagePath } from '../utils/imagePath';
import { seededShuffle } from '../utils/hash';

export default function Home() {
  const { hero, items: fallbackFeaturedItems } = featuredData;

  // Picks a hero image plus 3 featured works that are "random" but stable
  // for the whole calendar day, and never repeat each other (one shuffle,
  // hero takes the first card, featured takes the next 3).
  //
  // This is a fully static export (built once, not per-request), so the
  // date can only be read client-side after mount: computing it during
  // render would bake in whatever day the site was last built on, which
  // silently mismatches the client's real "today" on any later day and
  // triggers a hydration error - not just a one-off risk, but guaranteed
  // to happen the first time a day passes without a redeploy.
  const [heroImage, setHeroImage] = useState(hero.image);
  const [featuredItems, setFeaturedItems] = useState(fallbackFeaturedItems);
  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86_400_000); // days since epoch
    const shuffled = seededShuffle(collectionData.items, dayIndex);
    setHeroImage(shuffled[0].image);
    setFeaturedItems(shuffled.slice(1, 4));
  }, []);

  return (
    <Layout>
      <Splash />
      <div>
        <div className="hero">
          <Image
            src={getImagePath(heroImage)}
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="hero-image"
          />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">{hero.title}</h1>
              <p className="hero-subtitle">{hero.subtitle}</p>
              <Link href="/collection" className="button button-white">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>

        <section className="featured">
          <div className="container">
            <h2 className="featured-title">Featured Works</h2>
            <div className="featured-grid">
              {featuredItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/collection?artwork=${encodeURIComponent(item.title)}`}
                  className="card"
                >
                  <div className="card-image-container">
                    <Image
                      src={getImagePath(item.image)}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
