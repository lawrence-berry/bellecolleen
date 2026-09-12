import Layout from '../components/Layout';
import PageHead from '../components/PageHead';
import Image from 'next/image';
import Link from 'next/link';
import { getImagePath } from '../utils/imagePath';

export default function Exhibitions() {
  return (
    <Layout>
      <PageHead title="Exhibitions | BelleColleen" path="/exhibitions" />
      <div className="container">
        <section className="exhibitions">
          <h1 className="exhibitions-title">Exhibitions</h1>
          
          <article className="exhibition-feature">
            <h2 className="exhibition-heading">THE BIG SEE: Highland Artists affected by Cancer</h2>
            <h3 className="exhibition-subheading">Inchmore Gallery, Beauly • 16 June – 7 July 2012</h3>
            
            <div className="exhibition-content">
              <div className="exhibition-image">
                <Image
                  src={getImagePath("/images/big_see_flyer.jpg")}
                  alt="The Big See Exhibition Flyer"
                  width={320}
                  height={220}
                  style={{ maxWidth: '100%', height: 'auto' }}
                  priority
                />
              </div>
              
              <div className="exhibition-text">
                <p>Too often contemporary art is auctioned off at bargain basement prices to raise money for charity. Seeking a new way of using art to support a cause, a group of artists in the Highlands have come together raise money for Maggie's Centre at Raigmore Hospital by showing the effect cancer has had on their lives and their loved ones.</p>
                
                <p>A new formula has been devised for The Big See which opens in June for three weeks at the Inchmore Gallery. New owner Jane Owen Inglis has agreed to make a donation for every piece of artwork sold to allow everyone to share the benefits of the show. This means that each of the 15 artists will be showing two works, one a straight donation (where the charity gets most of the money) and one on a 'Business As Usual' basis which means a smaller but still significant donation goes to the charity. In addition there will be prints available, produced and mounted/framed at a discount by local business Alder Arts. All profits, after deducting costs, will go to Maggie's.</p>
                
                <p>One artist taking part is Alex Dunn, who runs a harp manufacturing business near Strathpeffer. Both he and his wife Zan have had surgery to remove tumours. He will be donating a drawing which will be priced at around £400. "Although it's an abstract work I believe someone will buy it if it's competitively priced. At a charity show it is important to sell as much as possible." Alex has already created a link between art and illness by persuading his local surgery to make available a wall for new painting by local artists which he refreshes every few months.</p>
                
                <p>A catalogue is being produced to celebrate the first show and it will contain statements by each of the artists about his/her link to cancer. They are: Clare Blois, Kirstie Cohen, Alex Dunn, Eva Faber, Michael Forbes, Colleen Godley, James Hawkins, Jennifer Houliston, Gerald Laing, Allan MacDonald, Rosie Newman, Ingeborg Smith, Erlend Tait, Pamela Tait, Eugenie Vronskaya. The original idea came from Simon Berry whose wife Colleen Godley died from thymic cancer last summer, leaving around twenty-five untitled paintings which she had never shown. "I know Colleen would have been overwhelmed to have her first exhibition in the company of these artists, many of whom she admired very much," he said. "During her lifetime, though, she never believed anyone would have been interested in what she painted."</p>
                
                <div className="exhibition-links">
                  <Link href="http://www.inchmoregallery.co.uk">www.inchmoregallery.co.uk</Link>
                  <Link href="http://www.maggiescentres.org">www.maggiescentres.org</Link>
                </div>
              </div>
            </div>
          </article>
        </section>
      </div>
    </Layout>
  );
}
