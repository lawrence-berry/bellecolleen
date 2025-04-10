import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <div className="container">
        <section className="about">
          <h1 className="about-title">About BelleColleen</h1>
          <div className="about-content">
            <h2 className="about-subtitle">Authenticated paintings by Colleen Godley (1951-2011)</h2>

            <div className="artwork-section">
              <h3 className="medium-title">Acrylic (sometimes with metallic and ink)</h3>
              <ul className="artwork-list">
                <li>Laufen</li>
                <li>Bollingen</li>
                <li>Secret of the Golden Flower</li>
                <li>Burghölzli (acrylic & wax on reverse)</li>
                <li>Tozeur (watercolour on reverse)</li>
                <li>Pardes Rimmonim</li>
                <li>The Diver</li>
                <li>The Heart of the Mystic Rose</li>
                <li>Anima</li>
                <li>Fomalhaut</li>
                <li>Chiwantopel (watercolour on reverse)</li>
              </ul>
            </div>

            <div className="artwork-section">
              <h3 className="medium-title">Pastel</h3>
              <ul className="artwork-list">
                <li>Sophia</li>
                <li>Mary (silver foil mount)</li>
                <li>Sälig Lüt (acrylic on reverse)</li>
                <li>Philemon</li>
              </ul>
            </div>

            <div className="artwork-section">
              <h3 className="medium-title">Ink (sometimes with watercolour)</h3>
              <ul className="artwork-list">
                <li>Vitznau</li>
                <li>Flüeli</li>
              </ul>
            </div>

            <div className="artwork-section">
              <h3 className="medium-title">Watercolour</h3>
              <ul className="artwork-list">
                <li>Konarak (acrylic on reverse)</li>
                <li>Sanchi</li>
                <li>Dalada-Maligawa</li>
                <li>Sousse</li>
                <li>Emma</li>
              </ul>
            </div>

            <div className="artwork-section">
              <h3 className="medium-title">Oil</h3>
              <ul className="artwork-list">
                <li>Taos (watercolour on reverse)</li>
                <li>Rejaf</li>
                <li>Unus Mundus (on canvas)</li>
              </ul>
            </div>

            <div className="note">
              <p>For further information on titles (which have been randomly selected) please go to the index of C.G. Jung's <i>Memories Dreams Reflections</i> (1963, reprinted 1995).</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
