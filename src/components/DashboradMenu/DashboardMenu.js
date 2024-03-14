import React from 'react';
import NamedLink from '../NamedLink/NamedLink';
import css from './DashboardMenu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCreditCard,
  faHeart,
  faIdCard,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import { faChartColumn, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../ducks/auth.duck';
import { pathByRouteName } from '../../util/routes';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';

const DashboardMenu = props => {
  const { active } = props;

  const handleLogout = () => {
    const routeConfiguration = useRouteConfiguration();
    logout().then(() => {
      const path = pathByRouteName('LandingPage', routeConfiguration);
      // In production we ensure that data is really lost,
      // but in development mode we use stored values for debugging
      if (appSettings.dev) {
        history.push(path);
      } else if (typeof window !== 'undefined') {
        window.location = path;
      }

      console.log('logged out'); // eslint-disable-line
    });
  };
  return (
    <div className={css.menuContainer}>
      <NamedLink name="ExperiencesHomePage" style={{ width: '100%' }}>
        <div className={active == 1 ? css.menuitemactive : css.menuitem}>
          <FontAwesomeIcon icon={faCalendarCheck} color="#227667" size="lg" />
          <div>Experiences</div>
        </div>
      </NamedLink>
      <NamedLink name="DashboardFavoriteDetailPage" style={{ width: '100%' }}>
        <div className={active == 2 ? css.menuitemactive : css.menuitem}>
          <FontAwesomeIcon icon={faHeart} color="#227667" size="lg" />
          <div>Favorites</div>
        </div>
      </NamedLink>
      <NamedLink name="DashboardPollsDetailPage" style={{ width: '100%' }}>
        <div className={active == 3 ? css.menuitemactive : css.menuitem}>
          <FontAwesomeIcon icon={faChartColumn} color="#227667" size="lg" />
          <div>Polls</div>
        </div>
      </NamedLink>
      <NamedLink name="DashboardUsersPage" style={{ width: '100%' }}>
        <div className={active == 4 ? css.menuitemactive : css.menuitem}>
          <FontAwesomeIcon icon={faUser} color="#227667" size="lg" />
          <div>Users</div>
        </div>
      </NamedLink>
      <NamedLink name="BillingPage" style={{ width: '100%' }}>
        <div className={active == 5 ? css.menuitemactive : css.menuitem}>
          <FontAwesomeIcon icon={faCreditCard} color="#227667" size="lg" />
          <div>Billing</div>
        </div>
      </NamedLink>
      <NamedLink name="DashboardProfilePage" style={{ width: '100%' }}>
        <div className={active == 6 ? css.menuitemactive : css.menuitem}>
          <FontAwesomeIcon icon={faIdCard} color="#227667" size="lg" />
          <div>Profile</div>
        </div>
      </NamedLink>
      <div className={css.menuitem} onClick={handleLogout}>
        <FontAwesomeIcon icon={faRightFromBracket} color="#227667" size="lg" />
        <div>Logout</div>
      </div>
    </div>
  );
};

export default DashboardMenu;
