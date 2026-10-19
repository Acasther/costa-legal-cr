import icons from './icons';

const Icon = ({ name, size = 24, className = '', title }) => {
  const paths = icons[name];
  if (!paths) return null;

  return (
    <svg className={`icon ${className}`.trim()} width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
      aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} focusable="false">
      {title && <title>{title}</title>}
      {paths.map((d, idx) => <path key={idx} d={d} />)}
    </svg>
  );
};

export default Icon;
