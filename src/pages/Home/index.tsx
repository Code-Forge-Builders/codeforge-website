import { Button, Form, FormGroup } from 'react-bootstrap'
import './Home.css'
import { phoneMask } from '../../utils/masks'

function Home() {
  return (
    <>
      <div id="team"></div>
      <div className="contact-container" id="#contact">
        <div className="contact-container-tittle">
          <h1>Fale conosco</h1>
        </div>
        <Form className="contact-container-form d-flex">
          <FormGroup className="d-flex justify-content-between first-form-line">
            <FormGroup>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" required />
            </FormGroup>
            <FormGroup>
              <label htmlFor="name">Telefone/Whatsapp</label>
              <input
                type="text"
                id="name"
                onChange={(event) => {
                  event.target.value = phoneMask(event.target.value)
                }}
                required
                maxLength={15}
              />
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </FormGroup>
          <FormGroup>
            <label htmlFor="message">Messagem</label>
            <textarea id="message" required></textarea>
          </FormGroup>
          <Button className="w-100" type="submit">
            Enviar
          </Button>
        </Form>
      </div>
    </>
  )
}

export default Home
