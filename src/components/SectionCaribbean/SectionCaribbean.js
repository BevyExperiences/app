import React from 'react';
import css from './SectionCaribbean.module.css';

import landingImg from '../../assets/images/home/landing.svg';
import { PrimaryButton } from '../../components';
import { pathByRouteName } from '../../util/routes';
import routeConfiguration from '../../routing/routeConfiguration';

const SectionCaribbean = (props) => {
  const { history } = props;

  const onSubmit = (e) => {
    history.push(pathByRouteName('ExperiencesPage', routeConfiguration()));
  }

  return (
    <div className={css.sectionbody}>
      <div className={css.sectiondescription}>
        <div className={css.sectiondescriptioncontent}>
          <div className={css.sectiondescriptiontitle}>
            Thoughtfully Curated Caribbean Experiences for your Bevy
          </div>
          <div className={css.sectiondesctiptiontitle2}>
            Whether you're thinking of hosting an offsite for the company, need unique
            culture-building activities for your remote team, or to let loose with your squad,
            Bevy Experiences has something for you.
          </div>
          <div className={css.sectiondescriptiontitle3}>
            1 bevy; a group people with something in common
          </div>
        </div>
        <PrimaryButton className={css.sectiondescriptionaction} onClick={onSubmit}>
          Explore Experiences
        </PrimaryButton>
      </div>
      <div className={css.sectionimage}>
        <img src={landingImg} className={css.sectionimageitem} alt="landing" />
      </div>
    </div>
  );
};

export default SectionCaribbean;
