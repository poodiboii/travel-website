import "./Contact.css";

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-wrapper">
        <div className="contact-info">
          <h2>Get in Touch</h2>

          <p className="contact-intro">
            Planning your next holiday or have questions about our packages?
            We’re here to help you plan a stress-free trip.
          </p>

          <div className="contact-details">
            <p><strong>Email:</strong> info@desperatelyneedaholiday.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Location:</strong> India</p>
          </div>
        </div>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea rows="4" placeholder="Your Message"></textarea>
          <button className="btn primary">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;