import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import css from './Sidebar.module.css';
import NamedLink from '../NamedLink/NamedLink';
import { PrimaryDarkButton } from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns, faUser, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { pathByRouteName } from '../../util/routes';
import routeConfiguration from '../../routing/routeConfiguration';

const Sidebar = props => {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(location.pathname);
  const { isAuthenticated, onClickMenu, onLogout, history } = props;

  const onDashboard = e => {
    if (history) {
      history.push(pathByRouteName('ExperiencesHomePage', routeConfiguration()));
    } else {
      alert('history is undefined');
    }
  };

  const onLogin = e => {
    if (history) {
      history.push(pathByRouteName('LoginPage', routeConfiguration()));
    } else {
      alert('history is undefined');
    }
  };

  return (
    <>
      <div className={css.sectionbody} onClick={onClickMenu}></div>
      <div className={css.sectionsidebar}>
        <FontAwesomeIcon
          size="2x"
          className={css.closeIcon}
          icon={faXmarkCircle}
          color="#000"
          onClick={onClickMenu}
          style={{ position: 'absolute', top: '25px', right: '20px' }}
        />
        {currentLocation.includes('dashboard') ? (
          <>
            <div className={css.sectioncategory}>
              <div onClick={onClickMenu}>
                <NamedLink className={css.categoryItem} name="ExperiencesHomePage">
                  Experiences
                </NamedLink>
              </div>
              <div onClick={onClickMenu}>
                <NamedLink className={css.categoryItem} name="DashboardFavoriteDetailPage">
                  Favorites
                </NamedLink>
              </div>
              <div onClick={onClickMenu}>
                <NamedLink className={css.categoryItem} name="DashboardPollsDetailPage">
                  Polls
                </NamedLink>
              </div>
              <div onClick={onClickMenu}>
                <NamedLink className={css.categoryItem} name="DashboardUsersPage">
                  Users
                </NamedLink>
              </div>
              <div onClick={onClickMenu}>
                <NamedLink className={css.categoryItem} name="BillingPage">
                  Billing
                </NamedLink>
              </div>
              <div onClick={onClickMenu}>
                <NamedLink className={css.categoryItem} name="DashboardProfilePage">
                  Profile
                </NamedLink>
              </div>
            </div>
            <div className={css.sectionpages}>
              <div onClick={onClickMenu}>
                <NamedLink className={css.pageItem} name="HelpCenterPage">
                  Help Center
                </NamedLink>
              </div>
              <div className={css.pageItem} onClick={onLogout}>
                Logout
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={css.sectioncategory}>
              <div className={css.categoryItem}>In-person</div>
              <div className={css.categoryItem}>Venues</div>
            </div>
            <div className={css.sectionpages}>
              <div onClick={onClickMenu}>
                <NamedLink className={css.pageItem} name="BecomeHostPage">
                  Become a Host
                </NamedLink>
              </div>
              <div onClick={onClickMenu}>
                <NamedLink className={css.pageItem} name="BookingPage">
                  About Us
                </NamedLink>
              </div>
              <div onClick={onClickMenu}>
                <NamedLink className={css.pageItem} name="PolicyPage">
                  Resources
                </NamedLink>
              </div>
              <div onClick={onClickMenu}>
                <NamedLink className={css.pageItem} name="HelpCenterPage">
                  Help Center
                </NamedLink>
              </div>
              {isAuthenticated && (
                <div className={css.pageItem} onClick={onLogout}>
                  Logout
                </div>
              )}
            </div>
            <div className={css.menubtn} onClick={onClickMenu}>
              {isAuthenticated ? (
                <PrimaryDarkButton onClick={onDashboard} className={css.iconBtnClass}>
                  <FontAwesomeIcon icon={faColumns} color="#06c167" />
                  Dashboard
                </PrimaryDarkButton>
              ) : (
                <PrimaryDarkButton onClick={onLogin} className={css.iconBtnClass}>
                  <FontAwesomeIcon icon={faUser} color="#06c167" />
                  Sign in
                </PrimaryDarkButton>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
