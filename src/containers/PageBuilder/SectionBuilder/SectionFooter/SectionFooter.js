import React from 'react';
import { arrayOf, bool, func, node, number, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { LinkedLightLogo, NamedLink, ExternalLink } from '../../../../components';

import Field from '../../Field';
import BlockBuilder from '../../BlockBuilder';

import SectionContainer from '../SectionContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faTwitter,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import css from './SectionFooter.module.css';

// The number of columns (numberOfColumns) affects styling

const GRID_CONFIG = [
  { contentCss: css.contentCol1, gridCss: css.gridCol1 },
  { contentCss: css.contentCol2, gridCss: css.gridCol2 },
  { contentCss: css.contentCol3, gridCss: css.gridCol3 },
  { contentCss: css.contentCol4, gridCss: css.gridCol4 },
];

const getIndex = numberOfColumns => numberOfColumns - 1;

const getContentCss = numberOfColumns => {
  const contentConfig = GRID_CONFIG[getIndex(numberOfColumns)];
  return contentConfig ? contentConfig.contentCss : GRID_CONFIG[0].contentCss;
};

const getGridCss = numberOfColumns => {
  const contentConfig = GRID_CONFIG[getIndex(numberOfColumns)];
  return contentConfig ? contentConfig.gridCss : GRID_CONFIG[0].gridCss;
};

// Section component that's able to show blocks in multiple different columns (defined by "numberOfColumns" prop)
const SectionFooter = props => {
  const {
    sectionId,
    className,
    rootClassName,
    numberOfColumns,
    socialMediaLinks,
    slogan,
    appearance,
    copyright,
    blocks,
    options,
  } = props;

  // If external mapping has been included for fields
  // E.g. { h1: { component: MyAwesomeHeader } }
  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };
  const linksWithBlockId = socialMediaLinks?.map(sml => {
    return {
      ...sml,
      blockId: sml.link.platform,
    };
  });

  const showSocialMediaLinks = socialMediaLinks?.length > 0;

  // use block builder instead of mapping blocks manually

  return (
    <div className={css.sectionbody}>
      <div className={css.sectioncontent}>
        <div className={css.sectioncontent1}>
          <LinkedLightLogo />
          <div className={css.sectioncontent1main}>
            <div className={css.sectioncontent1menu}>
              <div className={css.sectioncontent1leftmenu}>
                <div className={css.sectioncontent1menuContainer}>
                  <div className={css.sectionmenuitem}>In-person</div>
                  <div className={css.sectionmenuitem}>Venues</div>
                </div>
              </div>
              <div className={css.sectioncontent1rightmenu}>
                <div className={css.sectioncontent1menuContainer}>
                  <NamedLink name="BookingPage" className={css.sectionmenuitem}>
                    About us
                  </NamedLink>
                  <NamedLink name="BecomeHostPage" className={css.sectionmenuitem}>
                    Become a host
                  </NamedLink>
                  <NamedLink name="BlogPage" className={css.sectionmenuitem}>
                    Blog
                  </NamedLink>
                  <NamedLink name="BlogPage" className={css.sectionmenuitem}>
                    Career
                  </NamedLink>
                  <NamedLink name="HelpCenterPage" className={css.sectionmenuitem}>
                    Help
                  </NamedLink>
                </div>
              </div>
            </div>
            <div className={css.sectioncontent1contactus}>
              <div className={css.sectioncontent1contactustitle}>
                <div className={css.sectioncontent1contactustitle1}>Join our community</div>
                <div className={css.sectioncontent1contactustitle2}>
                  Get exclusive perks + fresh experiences.
                </div>
              </div>
              <div className={css.emailcontainer}>
                <input type="text" placeholder="Your email" className={css.emailedit} />
                <div className={css.emailInput}>
                  <FontAwesomeIcon icon={faArrowRight} color='#1B242D'/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={css.sectioncontent2}>
          <div className={css.sectioncontent2text}>Copyright All Rights Reserved</div>
          <div className={css.sectionsocial}>
            <div className={css.sectionSocialItem}>
              <ExternalLink key={'instagram'} href={'https://www.instagram.com/bevyexperiences'}>
                <FontAwesomeIcon icon={faInstagram} size='xl'/>
              </ExternalLink>
            </div>
            <div className={css.sectionSocialItem}>
              <ExternalLink key={'facebook'} href={'https://www.facebook.com/bevyexperiences'}>
                <FontAwesomeIcon icon={faFacebook} size='xl'/>
              </ExternalLink>
            </div>
            <div className={css.sectionSocialItem}>
              <ExternalLink
                key={'linkedin'}
                href={'https://www.linkedin.com/company/bevyexperiences'}
              >
                <FontAwesomeIcon icon={faLinkedin} size='xl'/>
              </ExternalLink>
            </div>
            <div className={css.sectionSocialItem}>
              <ExternalLink key={'twitter'} href={'https://www.twitter.com/bevyexperiences'}>
                <FontAwesomeIcon icon={faTwitter} size='xl'/>
              </ExternalLink>
            </div>
            <div className={css.sectionSocialItem}>
              <ExternalLink key={'tiktok'} href={'https://www.tiktok.com/@bevyexperiences'}>
                <FontAwesomeIcon icon={faTiktok} size='xl' />
              </ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
});

SectionFooter.defaultProps = {
  className: null,
  rootClassName: null,
  textClassName: null,
  numberOfColumns: 1,
  socialMediaLinks: [],
  slogan: null,
  copyright: null,
  appearance: null,
  blocks: [],
  options: null,
};

SectionFooter.propTypes = {
  sectionId: string.isRequired,
  className: string,
  rootClassName: string,
  numberOfColumns: number,
  socialMediaLinks: arrayOf(object),
  slogan: object,
  copyright: object,
  appearance: object,
  blocks: arrayOf(object),
  options: propTypeOption,
};

export default SectionFooter;
