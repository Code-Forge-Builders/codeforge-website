import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Form,
  FormGroup,
} from 'react-bootstrap'
import './Home.css'
import { phoneMask } from '../../utils/masks'
import { FaArrowRight } from 'react-icons/fa'
import TeamList from '@/components/TeamList'

function Home() {
  return (
    <>
      <section className="hero-container" id="hero-container">
        <section className="container">
          <div className="responsive-wrap d-flex justify-content-between">
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
              <img width={200} src="/assets/hero-image.png" alt="Hero Image" />
            </div>
          </div>
        </section>
      </section>
      <section id="about">
        <section className="container">
          <h1>Quem Somos</h1>
          <section>
            <p>
              A CodeForge Builders é uma empresa baiana de software fundada por
              um programador apaixonado por desafios e com vários anos de
              experiência no desenvolvimento de soluções tecnológicas. Nascemos
              com o desejo de transformar ideias em realidade, unindo
              criatividade e expertise técnica para entregar o melhor em cada
              projeto.
            </p>
            <p>
              Especializados em desenvolvimento de software, nossa equipe é
              dedicada a criar experiências excepcionais em três áreas
              principais: aplicações web, desenvolvimento mobile e soluções
              personalizadas.
            </p>
            <div className="cards d-flex gap-3 mb-3 flex-wrap justify-content-center">
              <Card>
                <CardBody>
                  <CardTitle>Desenvolvimento Web</CardTitle>
                  <CardText>
                    Seja para criar um blog envolvente, uma plataforma robusta
                    ou um site corporativo, nossa equipe é especialista em
                    desenvolver aplicações web completas. Trabalhamos tanto no
                    front-end quanto no back-end, garantindo que cada projeto
                    não apenas funcione perfeitamente, mas também ofereça uma
                    experiência de usuário intuitiva e atraente. Nossos serviços
                    incluem o desenvolvimento de sistemas personalizados,
                    integração com APIs e a implementação das melhores práticas
                    em design responsivo.
                  </CardText>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <CardTitle>Desenvolvimento Mobile</CardTitle>
                  <CardText>
                    Em um mundo cada vez mais móvel, entendemos a importância de
                    estar presente em todas as plataformas. Desenvolvemos
                    aplicativos móveis para iOS e Android, focados em desempenho
                    e usabilidade. Se você precisa de um aplicativo para engajar
                    seus usuários em movimento ou para otimizar processos
                    internos, temos a expertise necessária para entregar
                    soluções eficazes e inovadoras.
                  </CardText>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <CardTitle>Soluções Personalizadas</CardTitle>
                  <CardText>
                    Além de criar sites atraentes e funcionais, também
                    oferecemos soluções personalizadas que atendem às
                    necessidades específicas do seu negócio. Seja para blogs
                    dinâmicos, plataformas interativas ou sites corporativos,
                    garantimos que cada solução seja alinhada com seus objetivos
                    e proporcione uma presença online marcante.
                  </CardText>
                </CardBody>
              </Card>
            </div>
            <p>
              Nosso time é extremamente enxuto e eficiente, buscando entregar as
              soluções no menor tempo possível dentro do escopo de conhecimento
              do time.
            </p>
            <p>
              Na Codeforge, nosso compromisso é com a excelência e a satisfação
              do cliente. Trabalhamos em estreita colaboração com você para
              entender suas necessidades e entregar produtos que superem suas
              expectativas. Vamos juntos transformar sua visão digital em
              realidade!
            </p>
          </section>
        </section>
      </section>
      <section id="team">
        <section className="container">
          <h1>Nosso Time</h1>
          <TeamList />
        </section>
      </section>
      <section className="contact-container" id="contact">
        <section className="container">
          <div className="contact-container-title">
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
        </section>
      </section>
    </>
  )
}

export default Home
