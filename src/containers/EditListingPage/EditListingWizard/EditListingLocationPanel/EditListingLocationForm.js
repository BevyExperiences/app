import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

// Import configs and util modules
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
import {
  autocompleteSearchRequired,
  autocompletePlaceSelected,
  composeValidators,
  required,
} from '../../../../util/validators';

// Import shared components
import {
  Form,
  FieldLocationAutocompleteInput,
  Button,
  FieldBoolean,
  FieldCheckboxGroup,
  FieldTextInput,
} from '../../../../components';

// Import modules from this directory
import css from './EditListingLocationForm.module.css';

const identity = v => v;

export const EditListingLocationFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        formId,
        autoFocus,
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        values,
      } = formRenderProps;

      const addressRequiredMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressRequired',
      });
      const addressNotRecognizedMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressNotRecognized',
      });

      const optionalText = intl.formatMessage({
        id: 'EditListingLocationForm.optionalText',
      });

      const types = [
        {
          key: 'indoor',
          label: 'Indoor'
        },
        {
          key: 'outdoor',
          label: 'Outdoor'
        },
      ];

      const { updateListingError, showListingsError } = fetchErrors || {};

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingLocationForm.updateFailed" />
            </p>
          ) : null}

          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingLocationForm.showListingFailed" />
            </p>
          ) : null}

          <FieldLocationAutocompleteInput
            rootClassName={css.locationAddress}
            inputClassName={css.locationAutocompleteInput}
            iconClassName={css.locationAutocompleteInputIcon}
            predictionsClassName={css.predictionsRoot}
            validClassName={css.validLocation}
            autoFocus={autoFocus}
            name="location"
            label={intl.formatMessage({ id: 'EditListingLocationForm.address' })}
            placeholder={intl.formatMessage({
              id: 'EditListingLocationForm.addressPlaceholder',
            })}
            useDefaultPredictions={false}
            format={identity}
            valueFromForm={values.location}
            validate={composeValidators(
              autocompleteSearchRequired(addressRequiredMessage),
              autocompletePlaceSelected(addressNotRecognizedMessage)
            )}
          />

          <FieldTextInput
            className={css.groupSize}
            type="text"
            name="group_size"
            id={`${formId}group-size`}
            label={intl.formatMessage({ id: 'EditListingLocationForm.groupSize' }, { optionalText })}
            placeholder={intl.formatMessage({
              id: 'EditListingLocationForm.groupSizePlaceholder',
            })}
          />

          <FieldTextInput
            className={css.pricePerPerson}
            type="text"
            name="price_per_person"
            id={`${formId}price-per-person`}
            label={intl.formatMessage({ id: 'EditListingLocationForm.pricePerPerson' }, { optionalText })}
            placeholder={intl.formatMessage({
              id: 'EditListingLocationForm.pricePerPersonPlaceholder',
            })}
          />

          <FieldCheckboxGroup
            id={`${formId}experience-type`}
            name="experience_type"
            className={css.experienceType}
            label={intl.formatMessage({ id: 'EditListingLocationForm.experienceType' })}
            options={types}
            validate={required(
              intl.formatMessage({
                id: 'EditListingLocationForm.experienceTypeRequired',
              })
            )}
          />

          <FieldBoolean
            id={`${formId}instabook`}
            name="instabook"
            className={css.instaBook}
            label="Allow Insta-Book?"
            placeholder="Choose yes/no"
            validate={required(
              intl.formatMessage({
                id: 'EditListingLocationForm.allowInstaBookRequired',
              })
            )}
          />

          <FieldTextInput
            className={css.generalRules}
            type="textarea"
            name="general_rules"
            id={`${formId}general-rules`}
            label={intl.formatMessage({ id: 'EditListingLocationForm.generalRules' }, { optionalText })}
            placeholder={intl.formatMessage({
              id: 'EditListingLocationForm.generalRulesPlaceholder',
            })}
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingLocationFormComponent.defaultProps = {
  selectedPlace: null,
  fetchErrors: null,
  formId: 'EditListingLocationForm',
};

EditListingLocationFormComponent.propTypes = {
  formId: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  selectedPlace: propTypes.place,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingLocationFormComponent);
