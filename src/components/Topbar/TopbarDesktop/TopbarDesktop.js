import React, { useState, useEffect } from 'react';
import { bool, func, object, number, string } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage, intlShape } from '../../../util/reactIntl';
import { ACCOUNT_SETTINGS_PAGES } from '../../../routing/routeConfiguration';
import { propTypes } from '../../../util/types';
import {
  Avatar,
  InlineTextButton,
  LinkedLogo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
} from '../../../components';

import TopbarSearchForm from '../TopbarSearchForm/TopbarSearchForm';
import Sidebar from '../../Sidebar/Sidebar';
import css from './TopbarDesktop.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const TopbarDesktop = props => {
  const [activeMenu, setActiveMenu] = useState('');
  const {
    className,
    appConfig,
    currentPage,
    rootClassName,
    currentUserHasListings,
    notificationCount,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues,
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const marketplaceName = appConfig.marketplaceName;
  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;
  const classes = classNames(rootClassName || css.root, className);

  const [isSidebarOpened, setSidebarOpened] = useState(false);

  const handleSidebar = () => {
    if (!isSidebarOpened) document.body.style.overflowY = 'hidden';
    else document.body.style.overflowY = 'auto';
    setSidebarOpened(!isSidebarOpened);
  };

  return (
    <>
      <nav className={classes}>
        <LinkedLogo />
        <div className={css.headermenu}>
          <div
            className={activeMenu == 'in-person' ? css.headermenuitemactive : css.headermenuitem}
            onClick={() => {
              setActiveMenu('in-person');
            }}
          >
            In-person
          </div>
          <div
            className={activeMenu == 'venues' ? css.headermenuitemactive : css.headermenuitem}
            onClick={() => {
              setActiveMenu('venues');
            }}
          >
            Venues
          </div>
        </div>
        <div className={css.headerdashboardcontent}>
          <NamedLink className={css.headerdashboard} name="ExperiencesHomePage">
            Dashboard
          </NamedLink>
          <div className={css.headeraction}>
            <FontAwesomeIcon icon={faMagnifyingGlass} color="black" className={css.topMenuIcon} />
            <div className={css.headeractionbar}></div>
            <FontAwesomeIcon
              icon={faBars}
              color="black"
              onClick={handleSidebar}
              className={css.topMenuIcon}
            />
          </div>
        </div>
      </nav>
      {isSidebarOpened && (
        <Sidebar
          isAuthenticated={isAuthenticated}
          onClickMenu={handleSidebar}
          onLogout={() => {
            onLogout();
            handleSidebar();
          }}
          history={props.history}
        />
      )}
    </>
  );
};

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  notificationCount: 0,
  initialSearchFormValues: {},
  appConfig: null,
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  currentUserHasListings: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  notificationCount: number,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
  appConfig: object,
};

export default TopbarDesktop;
