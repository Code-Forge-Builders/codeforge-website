import styles from './Hero.module.css'

export default function Hero() {
  return <section className={`${styles.heroSection} w-screen h-screen flex justify-center`}>
    <div className="flex justify-start items-center w-11/12"></div>
  </section>
}
