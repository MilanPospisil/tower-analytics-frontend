import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    ToolbarFilter,
    Select,
    SelectOption as PFSelectOption,
    TextInput,
    InputGroup,
    ToolbarItem,
    Button
} from '@patternfly/react-core';

import {
    SearchIcon
} from '@patternfly/react-icons';

import {
    handleCheckboxChips,
    handleSingleChips
} from '../helpers';
import { optionsForCategories } from '../constants';
import styled from 'styled-components';

const SelectOption = styled(PFSelectOption)`
    display: block;
    overflow-x: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
`;

const renderValues = values =>
    values && values.map(({ key, value, description }) => (
        <SelectOption key={ key } value={ key } description={ description }>
            <span style={{ marginLeft: 5 }}>{ value } </span>
        </SelectOption>
    ));

const ToolbarFilterItem = ({
    categoryKey,
    filter = null,
    values = [],
    isVisible = true,
    hasChips = true,
    setFilter
}) => {
    const [ expanded, setExpanded ] = useState(false);
    const [ searchVal, setSearchVal ] = useState('');
    const options = optionsForCategories[categoryKey];

    const onDelete = (name, valueToDelete) => {
        const single = optionsForCategories[categoryKey].isSingle;

        if (single) {
            setFilter(null);
        } else {
            const keyToDelete = values.find(({ value }) => value === valueToDelete)
            .key;
            const filteredArr = filter.filter(value => value !== keyToDelete);
            setFilter(filteredArr);
        }
    };

    const handleChips = () => {
        if (options.isSingle) {
            return handleSingleChips(filter, values);
        } else {
            return handleCheckboxChips(filter, values);
        }
    };

    const onSelect = (event, selection) => {
        if (options.isSingle) {
            setFilter(selection);
            setExpanded(false);
        } else {
            setFilter(!filter.includes(selection)
                ? [ ...filter, selection ]
                : filter.filter(value => value !== selection)
            );
        }
    };

    const handleOnClick = () => {
        setFilter(searchVal);
        setSearchVal(searchVal);
    };

    const handleInputChange = e => {
        setSearchVal(e);
    };

    const renderSearch = () => {
        return (
            <ToolbarItem>
                <InputGroup>
                    <TextInput name="textInput1" id="textInput1" type="search" aria-label="search input example" onChange={handleInputChange} />
                    <Button variant='control' aria-label="search button for search input">
                        <SearchIcon onClick={handleOnClick} />
                    </Button>
                </InputGroup>
            </ToolbarItem>
        );
    };

    if (categoryKey === 'name') {
        return (
            <ToolbarFilter
                data-cy={categoryKey}
                key={categoryKey}
                showToolbarItem={isVisible}
                chips={[]}
                categoryName={options.name}
                deleteChip={null}
            >
                { renderSearch() }
            </ToolbarFilter>
        );
    } else {
        return (
            <ToolbarFilter
                data-cy={categoryKey}
                key={categoryKey}
                showToolbarItem={isVisible}
                chips={hasChips ? handleChips() : []}
                categoryName={options.name}
                deleteChip={hasChips ? onDelete : null}
            >
                <Select
                    variant={options.isSingle ? 'single' : 'checkbox'}
                    aria-label={categoryKey}
                    onToggle={() => setExpanded(!expanded)}
                    onSelect={onSelect}
                    selections={filter}
                    isOpen={expanded}
                    hasInlineFilter
                    placeholderText={options.placeholder}
                    maxHeight={'1000%'}
                >
                    { renderValues(values)}
                </Select>
            </ToolbarFilter>
        );
    }
};

ToolbarFilterItem.propTypes = {
    categoryKey: PropTypes.string.isRequired,
    filter: PropTypes.any,
    values: PropTypes.array,
    isVisible: PropTypes.bool,
    hasChips: PropTypes.bool,
    setFilter: PropTypes.func.isRequired
};

export default ToolbarFilterItem;
