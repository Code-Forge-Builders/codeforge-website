import React from 'react'
import { Button, Form } from 'react-bootstrap'
import './Contact.css'

const Contact: React.FC = () => {
  return (
    <div className="contact-container">
      <div className="contact-container-tittle">
        <h1>Contact Us</h1>
      </div>
      <div className="contact-container-form">
        <Form>
          <div className="contact-form-field">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" required />
          </div>
          <div className="contact-form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className="contact-form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" required></textarea>
          </div>
          <Button type="submit">Enviar</Button>
        </Form>
      </div>
    </div>
  )
}

export default Contact
