import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page animate-fade-in" style={{ padding: '4rem 0' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4rem' }}>
          <h2>Get in Touch</h2>
          <p>Have questions about partnerships, compliance, or technical support? Drop us a line and our volunteers will respond shortly.</p>
        </div>

        <div className="contact-grid">
          {/* Contact Details Column */}
          <div className="contact-info-cards">
            <div className="contact-card">
              <div className="contact-card-icon">📍</div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Our Headquarters</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>456 Eco Avenue, Sustainable City, SC 90210</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">✉️</div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email Us</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>info@foodshare.org (General inquiries)</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>partners@foodshare.org (For Restaurants & NGOs)</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">📞</div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Call Us</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+1 (555) 123-4567 (Mon - Fri, 9 AM - 6 PM)</p>
              </div>
            </div>

            {/* Embed Placeholder map */}
            <div 
              style={{
                backgroundColor: 'var(--neutral-200)',
                height: '200px',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--neutral-600)',
                fontSize: '0.9rem',
                border: '1px solid var(--border-color)'
              }}
            >
              🗺️ [Interactive Map Placeholder]
            </div>
          </div>

          {/* Form Column */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              padding: '2.5rem', 
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {submitted ? (
              <div className="text-center" style={{ padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  Thank you for reaching out. We have received your query and one of our organizers will email you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="btn btn-primary mt-4 btn-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Send Us a Message</h3>
                
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Type your message here..."
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full mt-4">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
