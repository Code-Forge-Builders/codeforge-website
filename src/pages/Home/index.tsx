import { Button, Form, FormGroup } from 'react-bootstrap'
import './Home.css'
import { phoneMask } from '../../utils/masks'
import { FaArrowRight } from 'react-icons/fa'

function Home() {
  return (
    <>
      <section className="hero-container" id="hero-container">
        <div className="hero-section" id="hero-content">
          <div className="hero-text">
            Criamos o seu
            <strong> sistema, site ou aplicativo</strong> com as melhores
            tecnologias disponíveis
          </div>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">
              Fale Conosco <FaArrowRight />
            </a>
          </div>
        </div>
        <div className="hero-section" id="hero-image">
          <img src="/assets/hero-image.png" alt="Hero Image" />
        </div>
      </section>
      <div id="about">
        <h1>Quem Somos</h1>
        <section>
          <p>
            Somos uma pequena startup criada por um desenvolvedor com alguns
            poucos anos de experiência e que está sempre buscando novos
            conhecimentos para construir novas soluções em software.
          </p>
          <p>
            Nosso time é extremamente enxuto e eficiente, buscando entregar as
            soluções no menor tempo possível dentro do escopo de conhecimento do
            time.
          </p>
        </section>
      </div>
      <div id="team"></div>
      <div className="contact-container" id="contact">
        <div className="contact-container-tittle">
          <h1>Fale conosco</h1>
        </div>
        <Form className="contact-container-form d-flex">
          <FormGroup className="d-flex justify-content-between first-form-line">
            <FormGroup>
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" required />
            </FormGroup>
            <FormGroup>
              <label htmlFor="phone">Telefone/Whatsapp</label>
              <input
                type="text"
                id="phone"
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
          <FormGroup className="d-flex justify-content-end">
            <Button type="submit">Enviar</Button>
          </FormGroup>
        </Form>
      </div>
    </>
  )
}

export default Home
