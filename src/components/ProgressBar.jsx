import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress }) => {
    return (
        <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
        />
    );
};

ProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
};

export default ProgressBar;
