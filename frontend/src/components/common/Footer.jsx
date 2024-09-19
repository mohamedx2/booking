import { PhoneOutlined, MailOutlined, EnvironmentOutlined, FacebookOutlined, InstagramOutlined, LinkedinOutlined, XOutlined } from '@ant-design/icons';

function Footer() {
  return (
    <footer className="footer" style={{ backgroundColor: '#333', color: '#fff', padding: '50px 0', margin: '0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div className="col-lg-3 col-md-6" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '20px' }} className='text-primary'>Contact Us</h4>
            <ul style={{ listStyleType: 'none', padding: 0, lineHeight: '2' }}>
              <li><PhoneOutlined /> +1 (123) 456-7890</li>
              <li><MailOutlined /> info@examplehotel.com</li>
              <li><EnvironmentOutlined /> 1234 Example St, City, Country</li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '20px' }} className='text-primary'>About Us</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac dapibus velit, eget fermentum purus. Duis condimentum, elit ac volutpat maximus, odio eros mollis elit.</p>
          </div>
          <div className="col-lg-3 col-md-6" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '20px' }} className='text-primary'>Explore </h4>
            <ul style={{ listStyleType: 'none', padding: 0, lineHeight: '2' }}>
              <li><a href="/" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.3s' }}>Home</a></li>
              <li><a href="/rooms" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.3s' }}>Rooms</a></li>
              <li><a href="/amenities" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.3s' }}>Amenities</a></li>
              <li><a href="/gallery" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.3s' }}>Gallery</a></li>
              <li><a href="/contact" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.3s' }}>Contact</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '20px' }} className='text-primary'>Connect with Us</h4>
            <div className="social-links" style={{ display: 'flex', gap: '10px' }}>
              <a href='https://www.facebook.com' style={{ color: '#fff', fontSize: '20px' }}><FacebookOutlined /></a>
              <a href='https://www.instagram.com' style={{ color: '#fff', fontSize: '20px' }}><InstagramOutlined /></a>
              <a href='https://www.twitter.com' style={{ color: '#fff', fontSize: '20px' }}><XOutlined /></a>
              <a href='https://www.linkedin.com' style={{ color: '#fff', fontSize: '20px' }}><LinkedinOutlined /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ maxWidth: '1200px', margin: '20px auto 0', textAlign: 'center' }}>
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          © 2024 Example Hotel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
