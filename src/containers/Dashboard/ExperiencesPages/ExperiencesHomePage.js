import React, { useState } from 'react';

import {
  Page,
  LayoutSingleColumn,
  DashboardMenu,
  SecondaryButton,
  PrimaryDarkButton
} from '../../../components';
import TopbarContainer from '../../TopbarContainer/TopbarContainer';
import FooterContainer from '../../FooterContainer/FooterContainer';

import css from './ExperiencesHomePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { pathByRouteName } from '../../../util/routes';
import routeConfiguration from '../../../routing/routeConfiguration';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

export const ExperiencesHomePage = props => {
  const [category, setCategory] = useState('all');

  const exploreExperiences = () => {
    const { history } = props;
    if (history) {
      history.push(pathByRouteName('ExperiencesExplorePage', routeConfiguration()));
    } else {
      alert('history is undefined')
    }
  };

  return (
    <Page title={'Experiences'} className={css.page} scrollingDisabled={false}>
      <LayoutSingleColumn topbar={<TopbarContainer />} footer={<FooterContainer />}>
        <div className={css.root}>
          <DashboardMenu active={1} />
          <div className={css.container}>
            <div className={css.header}>
              <div className={css.headermenu}>
                <div
                  className={category == 'all' ? css.headermenuitemactive : css.headermenuitem}
                  onClick={() => setCategory('all')}
                >
                  View All
                </div>
                <div
                  className={category == 'upcoming' ? css.headermenuitemactive : css.headermenuitem}
                  onClick={() => setCategory('upcoming')}
                >
                  Upcoming experiences
                </div>
                <div
                  className={category == 'past' ? css.headermenuitemactive : css.headermenuitem}
                  onClick={() => setCategory('past')}
                >
                  Past experiences
                </div>
              </div>
              <div className={css.headeraction}>
                <PrimaryDarkButton className={css.iconButton}>
                  <FontAwesomeIcon icon={faPlus} color="#06c167" size="lg" />
                  <div>Create event</div>
                </PrimaryDarkButton>
              </div>
            </div>
            <div className={css.content}>
              <div className={css.dashboardcontent}>
                <div className={css.contenttext}>
                  Time for your next adventure?
                  <div className={css.contentsubtext}>
                    Book unique + extraordinary experiences from a highly curated selection of
                    creators, brands, and venues.
                  </div>
                </div>
                <SecondaryButton onClick={exploreExperiences}>Explore Experiences</SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};

export default compose(withRouter)(ExperiencesHomePage);
