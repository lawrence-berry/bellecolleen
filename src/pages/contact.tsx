import Layout from '../components/Layout';

export default function Contact() {
  const encodeEmail = (email: string) => {
    return email.split('').map(char => `&#${char.charCodeAt(0)};`).join('');
  };

  const emailParams = {
    to: encodeEmail('sjcberry@gmail.com'),
    cc: encodeEmail('lawrence.berry@gmail.com'),
    subject: encodeEmail('Bellecolleen Website Contact')
  };

  const mailtoLink = `mailto:${emailParams.to}?cc=${emailParams.cc}&subject=${encodeURIComponent(emailParams.subject)}`;

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const decodedTo = 'sjcberry' + '@' + 'gmail.com';
    const decodedCc = 'lawrence.berry' + '@' + 'gmail.com';
    window.location.href = `mailto:${decodedTo}?cc=${decodedCc}&subject=Bellecolleen Website Contact`;
  };

  return (
    <Layout>
      <div className="container">
        <section className="contact">
          <h1 className="contact-title">Contact Us</h1>
          <div className="contact-content">
            <div className="contact-info">
              <h2>About the Website</h2>
              <p>
                The site was commissioned by Simon Berry and was developed by his son Lawrence Berry. 
                Its purpose is to provide a medium by which others can view Colleen's artwork and to 
                provide information about exhibitions in which her work, and that of other artists, 
                is featured.
              </p>

              <div className="contact-email">
                <h3>Get in Touch</h3>
                <a 
                  href={mailtoLink} 
                  className="email-link"
                  onClick={handleEmailClick}
                  dangerouslySetInnerHTML={{ 
                    __html: 'Send us an email' 
                  }}
                />
              </div>

              <div className="related-links">
                <h3>Related Links</h3>
                <ul>
                  <li>
                    <a href="http://www.inchmoregallery.co.uk" target="_blank" rel="noopener noreferrer">
                      Inchmore Gallery - venue of the Big See
                    </a>
                  </li>
                  <li>
                    <a href="http://www.maggiescentres.org" target="_blank" rel="noopener noreferrer">
                      Maggie's Centres - The Big See charity beneficiary
                    </a>
                  </li>
                  <li>
                    <a href="http://www.highlandartists.co.uk" target="_blank" rel="noopener noreferrer">
                      Highland Artists - Exhibition participants
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
