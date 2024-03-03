import React, { useState } from 'react';
import css from './SectionCustomExperience.module.css';
import { SecondaryButton } from '../Button/Button';

const SectionCustomExperience = () => {
  return (
    <div className={css.sectionbody}>
      <div className={css.sectioncontent}>
        <div className={css.sectiondescription}>
          <div className={css.sectiondescriptioncontent}>
            <div className={css.sectiondescriptiontitle}>Build A Custom Experience with Bevy</div>
            <div className={css.sectiondescriptiontext}>
              Share your vision and goals with us and we'll create a customized event plan to your
              specifications, from accommodations and transportation to activities that align with
              what you're going for.
            </div>
          </div>
          <SecondaryButton>Build My Event</SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default SectionCustomExperience;
