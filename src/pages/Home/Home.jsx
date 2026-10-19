import './Home.css';
import homeBackground from '../../assets/images/playa_lagosta.jpg';
import homeData from '../../assets/data/home';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Info from '../../components/Info/Info';

const Home = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();

  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
    <header className="banner" style={{ backgroundImage:`url(${homeBackground})` }}>
      <div className='welcome'>
        <Typography variant='h1'>{t("home.welcome")}</Typography>
        <div className='banner-btn'>
          <Button size='large' sx={{ textTransform: 'none'}} onClick={scrollToContact}>{t("home.welcomeBtn")}</Button>
        </div>
      </div>
    </header>


    <section className='about-us'>
      <Typography variant='h2' sx={{ paddingBottom: 1 }}>{t("home.aboutUs.title")}</Typography>
      <span className='divider'></span>
      <Typography variant='body1'>{t("home.aboutUs.description")}</Typography>
    </section>


    <section className='services'>
      <Typography variant='h2' sx={{ textAlign: 'center', paddingBottom: 1 }}>{t("common.services")}</Typography>
      <span className='divider' style={{ marginBottom: 45 }}></span>

      {homeData && homeData.map((service, idx) => (
        <div key={idx} className='service-background' style={{ backgroundImage: `url(${service.background})` }}>
          <Typography variant='h2' >{t(service.title)}</Typography>

          <Typography variant='body1' sx={{ paddingTop: 3, paddingRight: 30, paddingBottom: 5}}>{t(service.desc)}</Typography>

          <div className='banner-btn'>
            <Button sx={{ textTransform: 'none'}} onClick={() => navigate(service.link)}>{t("common.readMore")}</Button>
          </div>
        </div>
      ))}
      
    </section>


    <section className='location'>
      <Info></Info>
    </section>
    </>
  )
}

export default Home;