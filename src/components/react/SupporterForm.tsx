import React, { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  consent: boolean;
  newsletter: boolean;
}

interface FormMessage {
  type: 'success' | 'error';
  text: string;
}

interface SupporterFormProps {
  className?: string;
  onSubmissionSuccess?: () => void;
}

const SupporterForm: React.FC<SupporterFormProps> = ({ 
  className = '', 
  onSubmissionSuccess 
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    organization: '',
    email: '',
    consent: false,
    newsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Here you would typically send to your Zapier webhook or Google Form
      // For demonstration, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Thank you for joining the movement! Your support has been recorded.'
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        organization: '',
        email: '',
        consent: false,
        newsletter: false
      });
      
      // Call success callback if provided
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({
        type: 'error',
        text: 'There was an error submitting your information. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.consent;

  return (
    <div className={`form-container ${className}`}>
      <div className="form-wrapper">
        <h2>Join the Movement</h2>
        <p className="form-description">Sign up to show your support and be part of the change.</p>
        
        <form onSubmit={handleSubmit} className="supporter-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="organization">Organization (Optional)</label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder="Your company, school, or group"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                required
              />
              <span className="checkmark"></span>
              I consent to having my name and organization displayed publicly on this page
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Subscribe to updates about the movement
            </label>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing up...
              </>
            ) : (
              'Join the Movement'
            )}
          </button>
        </form>
        
        {message && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupporterForm;
