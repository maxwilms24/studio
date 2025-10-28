import { Swords, Bike, TrendingUp, Flame } from 'lucide-react';

interface SportIconProps extends React.SVGProps<SVGSVGElement> {
  sport: string;
}

const BasketballIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M7 21a9 9 0 0010 0" />
    <path d="M17 3a9 9 0 00-10 0" />
    <path d="M3 10a9 9 0 000 4" />
    <path d="M21 10a9 9 0 000 4" />
  </svg>
);

const VolleyballIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 12a10 10 0 00-4.47 8.3" />
      <path d="M12 12a10 10 0 014.47 8.3" />
      <path d="M12 12a10 10 0 00-8.3-4.47" />
      <path d="M12 12a10 10 0 018.3-4.47" />
    </svg>
  );

const TennisIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M22 12c-3 4-7 7-10 7s-7-3-10-7c3-4 7-7 10-7s7 3 10 7Z" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );

const SoccerBallIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2L8.5 6.5" />
    <path d="M12 2L15.5 6.5" />
    <path d="M12 22L8.5 17.5" />
    <path d="M12 22L15.5 17.5" />
    <path d="M2 12L6.5 8.5" />
    <path d="M2 12L6.5 15.5" />
    <path d="M22 12L17.5 8.5" />
    <path d="M22 12L17.5 15.5" />
    <path d="M8.5 6.5L6.5 8.5" />
    <path d="M15.5 6.5L17.5 8.5" />
    <path d="M8.5 17.5L6.5 15.5" />
    <path d="M15.5 17.5L17.5 15.5" />
  </svg>
);

const PadelIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 12a10 10 0 00-4.47 8.3" />
      <path d="M12 12a10 10 0 014.47 8.3" />
      <path d="M12 12a10 10 0 00-8.3-4.47" />
      <path d="M12 12a10 10 0 018.3-4.47" />
    </svg>
  );

const HockeyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="m11 22 2-2" />
        <path d="m13 20 7-7" />
        <path d="M18 11l-4.5 4.5" />
        <path d="M13.5 15.5 12 17" />
        <path d="M20 13 13 6" />
        <path d="M6 13 13 6" />
        <path d="M4 15l4-4" />
        <path d="M15 4l-4 4" />
    </svg>
);


export function SportIcon({ sport, className, ...props }: SportIconProps) {
  const sportName = sport.toLowerCase();
  const iconProps = { className: className || 'w-4 h-4', ...props };

  switch (sportName) {
    case 'basketbal':
      return <BasketballIcon {...iconProps} />;
    case 'voetbal':
      return <SoccerBallIcon {...iconProps} />;
    case 'volleybal':
      return <VolleyballIcon {...iconProps} />;
    case 'tennis':
        return <TennisIcon {...iconProps} />;
    case 'schermen':
      return <Swords {...iconProps} />;
    case 'wielrennen':
        return <Bike {...iconProps} />;
    case 'hardlopen':
      return <TrendingUp {...iconProps} />;
    case 'padel':
      return <PadelIcon {...iconProps} />;
    case 'hockey':
        return <HockeyIcon {...iconProps} />;
    default:
      return <Flame {...iconProps} />;
  }
}
