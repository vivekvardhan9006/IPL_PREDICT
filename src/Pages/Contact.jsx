import React from "react";
import '../Styles/Contact.css';
import bgImage from '../Assets/contact-png.jpg';

const ContactPage = () => {
  return (
    <section className="contact-section">
      <div className="contact-bg">
        <h3>Get in Touch with Us</h3>
        <h2>Contact Us</h2>
        <div className="line">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="text">
          We'd love to hear from you! Whether you have questions, feedback, or just want to share your cricket enthusiasm, feel free to get in touch with us.
        </p>
      </div>

      <div className="contact-body">
        <div className="contact-info">
          <ContactInfo
            icon="fas fa-mobile-alt"
            label="Phone No."
            value="+91-9949332080"
          />
          <ContactInfo
            icon="fas fa-envelope-open"
            label="E-mail"
            value="NEXT WICKET-AI@gmail.com"
          />
          <ContactInfo
            icon="fas fa-map-marker-alt"
            label="Address"
            value="Kmit , Narayanguda, Hyderabad"
          />
          <ContactInfo
            icon="fas fa-clock"
            label="Opening Hours"
            value="Monday - Friday (9:00 AM to 5:00 PM)"
          />
        </div>

        <div className="contact-form">
          <Form />
          <div>
          <img src={bgImage} alt="contact-us" />
          </div>
        </div>
      </div>

      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.304848757357!2d78.48765947493496!3d17.39715188349161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c44533324f%3A0x8aa5456a7d836bb5!2sKeshav%20Memorial%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1733751467182!5m2!1sen!2sin"
          width="1000"
          height="600"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="contact-footer">
        <h3>Follow Us</h3>
        <div className="social-links">
          <SocialLink icon="fab fa-facebook-f" />
          <SocialLink icon="fab fa-twitter" />
          <SocialLink icon="fab fa-instagram" />
          <SocialLink icon="fab fa-linkedin" />
          <SocialLink icon="fab fa-youtube" />
        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ icon, label, value }) => (
  <div>
    <span>
      <i className={icon}></i>
    </span>
    <span>{label}</span>
    <span className="text">{value}</span>
  </div>
);

const Form = () => (
  <form>
    <div>
      <input type="text" className="form-control" placeholder="First Name" />
      <input type="text" className="form-control" placeholder="Last Name" />
    </div>
    <div>
      <input type="email" className="form-control" placeholder="E-mail" />
      <input type="text" className="form-control" placeholder="Phone" />
    </div>
    <textarea rows="5" placeholder="Message" className="form-control"></textarea>
    <input type="submit" className="send-btn" value="Send Message" />
  </form>
);

const SocialLink = ({ icon }) => (
  <a href="#" className={icon}></a>
);

export default ContactPage;