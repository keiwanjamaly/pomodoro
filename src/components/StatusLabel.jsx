import React from 'react';
import PropTypes from 'prop-types';

const StatusLabel = ({ label }) => {
    return (
        <div className="status-label" data-testid="status-label">
            {label}
        </div>
    );
};

StatusLabel.propTypes = {
    label: PropTypes.string.isRequired,
};

export default StatusLabel;
