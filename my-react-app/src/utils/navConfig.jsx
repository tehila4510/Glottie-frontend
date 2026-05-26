import home from "../../public/home.png";
import progress from "../../public/progress.png";
import errors from "../../public/errors.png";
import chat from "../../public/chat.png";
import profile from "../../public/profile.png";
import settings from "../../public/settings.png";

const renderIcon = (src, alt) => <span><img src={src} alt={alt} width="30px" /></span>;

export const NAV_CONFIG = [
  { id: 'home', path: '/', label: 'Home', icon: renderIcon(home, 'home') },
  { id: 'progress', path: '/progress', label: 'My Progress', icon: renderIcon(progress, 'progress') },
  { id: 'errors', path: '/errors', label: 'My Mistakes', icon: renderIcon(errors, 'errors'), badge: true },
  { id: 'chat', path: '/chat', label: 'Glottie Teacher', icon: renderIcon(chat, 'chat') },
  { id: 'profile', path: '/profile', label: 'Profile', icon: renderIcon(profile, 'profile') },
  { id: 'settings', path: '/settings', label: 'Settings', icon: renderIcon(settings, 'settings') },
];