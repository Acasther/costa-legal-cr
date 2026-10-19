import React from 'react';
import "./Info.css";
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import { Stack, Typography, Link } from "@mui/material";
import Email from '@mui/icons-material/Email';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Place from '@mui/icons-material/Place';
import { EMAIL_ADDRESS, PHONE_NUMBER, OFFICE_LOCATION_LONG, PERSONAL_PHONE_NUMBER } from "../../utils/constants";
import { whatsappLink } from '../../utils/commonFuncs';
import ContactForm from '../ContactForm/ContactForm';

const Info = () => {
  const { t } = useTranslation("global");

  return (
    <>
    <div className="info-container" id="contact-form">
      <Grid className='info-grid' container columns={{ xs: 1, lg: 12 }} spacing={{ xs: 6, lg: 8 }}>
        <Grid size={{ xs: 1, lg: 6 }}>
          <ContactForm />
        </Grid>
        <Grid size={{ xs: 1, lg: 6 }} className='info-page-form'>
          <Typography variant='h2'>{t("links.contactUs")}</Typography>
          <span className='article-divider'></span>
          <Stack spacing={1} className="info-stack">
            <Link underline='none' className="info-row" sx={{ color: '#000000'}} href={whatsappLink(PHONE_NUMBER)} target="_blank" rel="noopener noreferrer">
              <WhatsApp></WhatsApp>
              <Typography variant='body1'>{PHONE_NUMBER}</Typography>
            </Link>
            <Link underline='none' className="info-row" sx={{ color: '#000000'}} href={whatsappLink(PERSONAL_PHONE_NUMBER)} target="_blank" rel="noopener noreferrer">
              <WhatsApp></WhatsApp>
              <Typography variant='body1'>{PERSONAL_PHONE_NUMBER}</Typography>
            </Link>
            <Link underline='none' className="info-row" sx={{ color: '#000000'}} href={`mailto:${EMAIL_ADDRESS}`}>
              <Email></Email>
              <Typography variant='body1'>{EMAIL_ADDRESS}</Typography>
            </Link>
            <Link underline='none' className="info-row" sx={{ color: '#000000'}}
              href={`https://maps.app.goo.gl/9pdFkSiwyFAcNJq39`} target="_blank" rel="noopener">
              <Place></Place>
              <Typography variant='body1'>{OFFICE_LOCATION_LONG}</Typography>
            </Link>
          </Stack>
          <div className='location-map'>
            <Typography variant="h3">{t("home.location.title")}</Typography>
            <div className='frame-wrapper'>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d491.2476583364029!2d-84.1330552236084!3d9.935516400548698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fd2eb06f74ad%3A0x37de80cc38ee1a24!2sCosta%20Legal!5e0!3m2!1sen!2scr!4v1707262689628!5m2!1sen!2scr" width="600" height="450" title="map" style={{border: 0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
    </>
  )
}

export default Info;
