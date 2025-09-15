import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import type { FormData, FormMessage, ModalFormProps } from '../../../types/form';
import './ModalForm.css';

const ModalForm: React.FC<ModalFormProps> = ({ 
  isOpen: initialIsOpen = false, 
  onClose: onCloseProp, 
  onSubmissionSuccess 
}) => {
  const [isOpen, setIsOpen] = React.useState(initialIsOpen);

  const onClose = () => {
    setIsOpen(false);
    setMessage(null); // Reset message state when closing
    if (onCloseProp) onCloseProp();
  };
  const [formData, setFormData] = useState<FormData>({
    name: '',
    organization: '',
    email: '',
    location: '',
    excitement: '',
    consent: false,
    newsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  // Listen for button clicks to open modal
  useEffect(() => {
    const handleButtonClick = () => {
      setIsOpen(true);
      setMessage(null); // Reset message state when opening
    };

    const signupButton = document.getElementById('signup-button');
    if (signupButton) {
      signupButton.addEventListener('click', handleButtonClick);
    }

    // Make modal open function globally available
    (window as any).openModal = () => {
      setIsOpen(true);
      setMessage(null); // Reset message state when opening
    };

    return () => {
      if (signupButton) {
        signupButton.removeEventListener('click', handleButtonClick);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
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
      // Submit to our API route which forwards to Zapier
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Submission failed');
      }
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Thank you for joining the movement! Your support has been recorded.'
      });
      
      // Reset form
      setFormData({
        name: '',
        organization: '',
        email: '',
        location: '',
        excitement: '',
        consent: false,
        newsletter: false
      });
      
      // Call success callback if provided
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }

      // Close modal after a longer delay
      setTimeout(() => {
        onClose();
      }, 3500);

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isFormValid = formData.name && formData.email;

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        
        {message ? (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="organization">Organization</label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State/Country"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="excitement">What excites you most about Be The People?</label>
            <textarea
              id="excitement"
              name="excitement"
              value={formData.excitement}
              onChange={handleInputChange}
              placeholder="Share what inspires you about this movement..."
              rows={4}
            />
          </div>
          
          <div className="checkbox-container">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                I consent to having my name and organization displayed publicly on this page.
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
                Subscribe to updates about the movement.
              </label>
            </div>
          </div>
          
          <Button 
            type="submit"
            variant="primary"
            size="medium"
            disabled={!isFormValid || isSubmitting}
            text={isSubmitting ? 'Submitting...' : 'Join Us'}
          />
        </form>
        )}
      </div>
    </div>
  );
};

export default ModalForm;