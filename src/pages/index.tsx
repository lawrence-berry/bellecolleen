import Layout from '../components/Layout';
import Splash from '../components/Splash';
import Image from 'next/image';
import Link from 'next/link';
import featuredData from '../data/featured.json';

export default function Home() {
  const { hero, items: featuredItems } = featuredData;

  return (
    <Layout>
      <Splash />
      <div>
        <div className="hero">
          <Image
            src={hero.image}
            alt={hero.alt}
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
                <div key={item.id} className="card">
                  <div className="card-image-container">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.description}</p>
                    <Link href={`/collection/${item.id}`} className="card-link">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
