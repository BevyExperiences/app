import React, { useState } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Field, Form as FinalForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

// Import util modules
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';
import { EXTENDED_DATA_SCHEMA_TYPES, propTypes } from '../../../../util/types';
import { maxLength, nonEmptyArray, required, composeValidators, numberAtMax } from '../../../../util/validators';

// Import shared components
import { Form, Button, FieldSelect, FieldTextInput, Heading, FieldCheckboxGroup, IconDelete, IconAdd, FieldBoolean } from '../../../../components';
// Import modules from this directory
import CustomExtendedDataField from '../CustomExtendedDataField';
import css from './EditListingDetailsForm.module.css';

const TITLE_MAX_LENGTH = 60;

// Show various error messages
const ErrorMessage = props => {
  const { fetchErrors } = props;
  const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
  const errorMessage = updateListingError ? (
    <FormattedMessage id="EditListingDetailsForm.updateFailed" />
  ) : createListingDraftError ? (
    <FormattedMessage id="EditListingDetailsForm.createListingDraftError" />
  ) : showListingsError ? (
    <FormattedMessage id="EditListingDetailsForm.showListingFailed" />
  ) : null;

  if (errorMessage) {
    return <p className={css.error}>{errorMessage}</p>;
  }
  return null;
};

// Hidden input field
const FieldHidden = props => {
  const { name } = props;
  return (
    <Field id={name} name={name} type="hidden" className={css.unitTypeHidden}>
      {fieldRenderProps => <input {...fieldRenderProps?.input} />}
    </Field>
  );
};

// Field component that either allows selecting listing type (if multiple types are available)
// or just renders hidden fields:
// - listingType              Set of predefined configurations for each listing type
// - transactionProcessAlias  Initiate correct transaction against Marketplace API
// - unitType                 Main use case: pricing unit
const FieldSelectListingType = props => {
  const { name, listingTypes, hasExistingListingType, onListingTypeChange, formApi, intl } = props;
  const hasMultipleListingTypes = listingTypes?.length > 1;

  const handleOnChange = value => {
    const selectedListingType = listingTypes.find(config => config.listingType === value);
    formApi.change('transactionProcessAlias', selectedListingType.transactionProcessAlias);
    formApi.change('unitType', selectedListingType.unitType);

    if (onListingTypeChange) {
      onListingTypeChange(selectedListingType);
    }
  };
  const getListingTypeLabel = listingType => {
    const listingTypeConfig = listingTypes.find(config => config.listingType === listingType);
    return listingTypeConfig ? listingTypeConfig.label : listingType;
  };

  return hasMultipleListingTypes && !hasExistingListingType ? (
    <>
      <FieldSelect
        id={name}
        name={name}
        className={css.listingTypeSelect}
        label={intl.formatMessage({ id: 'EditListingDetailsForm.listingTypeLabel' })}
        validate={required(
          intl.formatMessage({ id: 'EditListingDetailsForm.listingTypeRequired' })
        )}
        onChange={handleOnChange}
      >
        <option disabled value="">
          {intl.formatMessage({ id: 'EditListingDetailsForm.listingTypePlaceholder' })}
        </option>
        {listingTypes.map(config => {
          const type = config.listingType;
          return (
            <option key={type} value={type}>
              {config.label}
            </option>
          );
        })}
      </FieldSelect>
      <FieldHidden name="transactionProcessAlias" />
      <FieldHidden name="unitType" />
    </>
  ) : hasMultipleListingTypes && hasExistingListingType ? (
    <div className={css.listingTypeSelect}>
      <Heading as="h5" rootClassName={css.selectedLabel}>
        {intl.formatMessage({ id: 'EditListingDetailsForm.listingTypeLabel' })}
      </Heading>
      <p className={css.selectedValue}>{getListingTypeLabel(formApi.getFieldState(name)?.value)}</p>
      <FieldHidden name={name} />
      <FieldHidden name="transactionProcessAlias" />
      <FieldHidden name="unitType" />
    </div>
  ) : (
    <>
      <FieldHidden name={name} />
      <FieldHidden name="transactionProcessAlias" />
      <FieldHidden name="unitType" />
    </>
  );
};

// Add collect data for listing fields (both publicData and privateData) based on configuration
const AddListingFields = props => {
  const { listingType, listingFieldsConfig, intl } = props;
  const fields = listingFieldsConfig.reduce((pickedFields, fieldConfig) => {
    const { key, includeForListingTypes, schemaType, scope } = fieldConfig || {};
    const namespacedKey = scope === 'public' ? `pub_${key}` : `priv_${key}`;

    const isKnownSchemaType = EXTENDED_DATA_SCHEMA_TYPES.includes(schemaType);
    const isTargetListingType =
      includeForListingTypes == null || includeForListingTypes.includes(listingType);
    const isProviderScope = ['public', 'private'].includes(scope);

    return isKnownSchemaType && isTargetListingType && isProviderScope
      ? [
        ...pickedFields,
        <CustomExtendedDataField
          key={namespacedKey}
          name={namespacedKey}
          fieldConfig={fieldConfig}
          defaultRequiredMessage={intl.formatMessage({
            id: 'EditListingDetailsForm.defaultRequiredMessage',
          })}
        />,
      ]
      : pickedFields;
  }, []);

  return <>{fields}</>;
};

// Form that asks title, description, transaction process and unit type for pricing
// In addition, it asks about custom fields according to marketplace-custom-config.js
const EditListingDetailsFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        autoFocus,
        className,
        disabled,
        ready,
        formId,
        form: formApi,
        handleSubmit,
        onListingTypeChange,
        intl,
        invalid,
        pristine,
        selectableListingTypes,
        hasExistingListingType,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        values,
      } = formRenderProps;

      const { listingType } = values;

      const titleRequiredMessage = intl.formatMessage({
        id: 'EditListingDetailsForm.titleRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingDetailsForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );
      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);

      // Show title and description only after listing type is selected
      const showTitle = listingType;
      const showDescription = listingType;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      const subCateogryOptions = [
        {
          key: 'art-culture',
          label: 'Art & Culture',
        },
        {
          key: 'beach-boating',
          label: 'Beach & Boating',
        },
        {
          key: 'food-drink',
          label: 'Food & Drink',
        },
        {
          key: 'relax-meditation',
          label: 'Relax & Meditation',
        },
        {
          key: 'fun-sports',
          label: 'Fun & Sports',
        },
        {
          key: 'sightseeing',
          label: 'Sightseeing',
        },
        {
          key: 'team-building',
          label: 'Team-Building',
        },
      ]

      const spaceOptions = [
        {
          key: 'meeting-training-space',
          label: 'Meeting/Training Space',
        },
        {
          key: 'flex-space',
          label: 'Flex Space',
        },
        {
          key: 'classroom',
          label: 'Classroom',
        },
        {
          key: 'house',
          label: 'House',
        },
        {
          key: 'photo-studio',
          label: 'Photo studio',
        },
        {
          key: 'art-gallery',
          label: 'Art Gallery',
        },
        {
          key: 'lounge',
          label: 'Lounge',
        },
        {
          key: 'ballroom',
          label: 'Ballroom',
        },
        {
          key: 'outdoor-space',
          label: 'Outdoor space',
        },
      ]

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <ErrorMessage fetchErrors={fetchErrors} />

          <FieldSelectListingType
            name="listingType"
            listingTypes={selectableListingTypes}
            hasExistingListingType={hasExistingListingType}
            onListingTypeChange={onListingTypeChange}
            formApi={formApi}
            intl={intl}
          />

          {showTitle ? (
            <FieldTextInput
              id={`${formId}title`}
              name="title"
              className={css.title}
              type="text"
              label={intl.formatMessage({ id: 'EditListingDetailsForm.title' })}
              placeholder={intl.formatMessage({ id: 'EditListingDetailsForm.titlePlaceholder' })}
              maxLength={TITLE_MAX_LENGTH}
              validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
              autoFocus={autoFocus}
            />
          ) : null}

          {
            listingType && listingType === "in-person" && (<>
              <FieldCheckboxGroup
                id={`${formId}subcategory`}
                name="subcategory"
                className={css.subcategory}
                label={intl.formatMessage({ id: 'EditListingDetailsForm.subcategory' })}
                options={subCateogryOptions}
                validate={required(
                  intl.formatMessage({
                    id: 'EditListingDetailsForm.subcategoryRequired',
                  })
                )}
              />
              <label
                htmlFor="durationContainer"
                className={css.durationConatinerLabel}
              >
                {intl.formatMessage({ id: 'EditListingDetailsForm.durationContainer' })}
              </label>
              <div
                id={`${formId}durationcontainer`}
                name={`durationContainer`}
                className={css.durationContainer}
              >
                <FieldTextInput
                  id={`${formId}duration-hour`}
                  name="duration_hour"
                  className={css.durationHoursTextInput}
                  type="number"
                  validate={numberAtMax(intl.formatMessage({
                    id: 'EditListingDetailsForm.durationHourMaxValue',
                  }), 24)}
                />
                <span className={css.durationHours}>hours</span>
                <FieldTextInput
                  id={`${formId}duration-minute`}
                  name="duration_minute"
                  className={css.durationMinutesTextInput}
                  type="number"
                  validate={numberAtMax(intl.formatMessage({
                    id: 'EditListingDetailsForm.durationMinuteMaxValue',
                  }), 60)}
                />
                <span className={css.durationMinutes}>mins</span>
              </div>

              {showDescription ? (
                <FieldTextInput
                  id={`${formId}description`}
                  name="description"
                  className={css.description}
                  type="textarea"
                  label={intl.formatMessage({ id: 'EditListingDetailsForm.experienceDescription' })}
                  placeholder={intl.formatMessage({
                    id: 'EditListingDetailsForm.descriptionPlaceholder',
                  })}
                  validate={required(
                    intl.formatMessage({
                      id: 'EditListingDetailsForm.descriptionRequired',
                    })
                  )}
                />
              ) : null}

              <label
                htmlFor="bring_items_container"
                className={css.bringItemsContainerLabel}
              >
                {intl.formatMessage({ id: 'EditListingDetailsForm.bringItems' })}
              </label>
              <FieldArray
                name="bring_items"
                validate={composeValidators(
                  nonEmptyArray(
                    intl.formatMessage({
                      id: 'EditListingDetailsForm.bringItemsRequired',
                    })
                  )
                )}
                className={css.bringItemsFieldArray}
              >
                {({ fields }) => {
                  const [addItem, setAddItem] = useState("");
                  const handleInputChange = (e) => {
                    setAddItem(e.target.value);
                  }
                  const handleAddItem = (e) => {
                    e.preventDefault();
                    fields.push(addItem);
                    setAddItem("");
                  }
                  return (<div className={css.itemsFieldArray}>
                    {
                      fields.value && fields.value.length > 0 && fields.value.map((name, index) => (
                        <div
                          key={`${name + index}`}
                          name={name}
                          intl={intl}
                          className={css.item}
                        >
                          {name}
                          <div onClick={() => fields.remove(index)}>
                            <IconDelete className={css.itemDeleteIcon} />
                          </div>
                        </div>
                      ))
                    }
                    <input
                      id="addItem"
                      name="addItem"
                      value={addItem}
                      className={css.item}
                      onChange={handleInputChange}
                      type="text"
                    />
                    <button
                      className={css.addItemButton}
                      onClick={handleAddItem}
                    >
                      <IconAdd />
                    </button>
                  </div>)
                }
                }
              </FieldArray>

              <FieldTextInput
                id={`${formId}physical-items`}
                name="physical_items"
                className={css.physicalItems}
                type="textarea"
                label={intl.formatMessage({ id: 'EditListingDetailsForm.physicalItems' })}
                placeholder={intl.formatMessage({
                  id: 'EditListingDetailsForm.physicalItemsPlaceholder',
                })}
                validate={required(
                  intl.formatMessage({
                    id: 'EditListingDetailsForm.physicalItemsRequired',
                  })
                )}
              />

              <FieldTextInput
                id={`${formId}how-it-works`}
                name="how_it_works"
                className={css.howItWorks}
                type="textarea"
                label={intl.formatMessage({ id: 'EditListingDetailsForm.howItWorks' })}
                placeholder={intl.formatMessage({
                  id: 'EditListingDetailsForm.howItWorksPlaceholder',
                })}
                validate={required(
                  intl.formatMessage({
                    id: 'EditListingDetailsForm.howItWorksRequired',
                  })
                )}
              />
            </>)
          }

          {
            listingType && listingType === "venue" && (<>
              <FieldCheckboxGroup
                id={`${formId}space`}
                name="space"
                className={css.space}
                label={intl.formatMessage({ id: 'EditListingDetailsForm.space' })}
                options={spaceOptions}
                validate={required(
                  intl.formatMessage({
                    id: 'EditListingDetailsForm.spaceRequired',
                  })
                )}
              />
              <label
                htmlFor="capacityContainer"
                className={css.capacityContainerLabel}
              >
                {intl.formatMessage({ id: 'EditListingDetailsForm.capacityContainer' })}
              </label>
              <div
                id={`${formId}capacitycontainer`}
                name={`capacityContainer`}
                className={css.capacityContainer}
              >
                <FieldTextInput
                  id={`${formId}capacity`}
                  name="capacity"
                  className={css.capacity}
                  type="text"
                />
              </div>

              {showDescription ? (
                <FieldTextInput
                  id={`${formId}description`}
                  name="description"
                  className={css.description}
                  type="textarea"
                  label={intl.formatMessage({ id: 'EditListingDetailsForm.venueDescription' })}
                  placeholder={intl.formatMessage({
                    id: 'EditListingDetailsForm.descriptionPlaceholder',
                  })}
                  validate={required(
                    intl.formatMessage({
                      id: 'EditListingDetailsForm.descriptionRequired',
                    })
                  )}
                />
              ) : null}

              <label
                htmlFor="amendity_items_container"
                className={css.amendityItemsContainerLabel}
              >
                {intl.formatMessage({ id: 'EditListingDetailsForm.amendityItems' })}
              </label>
              <div
                id={`${formId}amendityitems-container`}
                name="amendity_items_container"
                className={css.amendityItemsContainer}
              >
                <FieldTextInput
                  id={`${formId}amendityitems`}
                  name="amendity_items"
                  className={css.amendityItems}
                  type="text"
                />
              </div>

              <label
                htmlFor="not_allowed_items_container"
                className={css.notAllowedItemsContainerLabel}
              >
                {intl.formatMessage({ id: 'EditListingDetailsForm.notAllowedItems' })}
              </label>
              <div
                id={`${formId}notalloweditems-container`}
                name="not_allowed_items_container"
                className={css.notAllowedItemsContainer}
              >
                <FieldTextInput
                  id={`${formId}notalloweditems`}
                  name="not_allowed_items"
                  className={css.notAllowedItems}
                  type="text"
                />
              </div>

              <label
                htmlFor="addon_items_container"
                className={css.addonItemsContainerLabel}
              >
                {intl.formatMessage({ id: 'EditListingDetailsForm.addonItems' })}
              </label>
              <div
                id={`${formId}addonitems-container`}
                name="addon_items_container"
                className={css.addonItemsContainer}
              >
                <FieldTextInput
                  id={`${formId}addonitems`}
                  name="addon_items"
                  className={css.addonItems}
                  type="text"
                />
              </div>
            </>)
          }

          {listingType && (<>
            <label
              htmlFor="meet_hosts_container"
              className={css.meetHostsContainerLabel}
            >
              {intl.formatMessage({ id: 'EditListingDetailsForm.meetHosts' })}
            </label>
            <div
              id={`${formId}meet-hosts-container`}
              name="meet_hosts_container"
              className={css.meetHostsContainer}
            >
              <FieldTextInput
                id={`${formId}meet-hosts`}
                name="meet_hosts"
                className={css.meetHosts}
                type="text"
              />
            </div>
          </>)}

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

EditListingDetailsFormComponent.defaultProps = {
  className: null,
  formId: 'EditListingDetailsForm',
  fetchErrors: null,
  hasExistingListingType: false,
  listingFieldsConfig: [],
};

EditListingDetailsFormComponent.propTypes = {
  className: string,
  formId: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  onListingTypeChange: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  selectableListingTypes: arrayOf(
    shape({
      listingType: string.isRequired,
      transactionProcessAlias: string.isRequired,
      unitType: string.isRequired,
    })
  ).isRequired,
  hasExistingListingType: bool,
  listingFieldsConfig: propTypes.listingFieldsConfig,
};

export default compose(injectIntl)(EditListingDetailsFormComponent);
