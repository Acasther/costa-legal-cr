import home960 from './hero-home-960.webp';
import home1920 from './hero-home-1920.webp';
import immigration960 from './hero-immigration-960.webp';
import immigration1600 from './hero-immigration-1600.webp';
import realEstate1020 from './hero-real-estate-1020.webp';
import business960 from './hero-business-960.webp';
import business1920 from './hero-business-1920.webp';
import insurance960 from './hero-insurance-960.webp';
import insurance1920 from './hero-insurance-1920.webp';
import contact960 from './hero-contact-960.webp';
import contact1920 from './hero-contact-1920.webp';

const photo = (sources, width, height) => ({
  src: sources[sources.length - 1][0],
  srcSet: sources.map(([url, w]) => `${url} ${w}w`).join(', '),
  width,
  height,
});

const photos = {
  home: photo([[home960, 960], [home1920, 1920]], 1920, 1080),
  immigration: photo([[immigration960, 960], [immigration1600, 1600]], 1600, 900),
  realEstate: photo([[realEstate1020, 1020]], 1020, 574),
  business: photo([[business960, 960], [business1920, 1920]], 1920, 1080),
  insurance: photo([[insurance960, 960], [insurance1920, 1920]], 1920, 1080),
  contact: photo([[contact960, 960], [contact1920, 1920]], 1920, 1080),
};

export default photos;
