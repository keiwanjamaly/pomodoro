import React from 'react';
import PropTypes from 'prop-types';

const TimerDisplay = ({ time }) => {
    return (
        <div className="time-display" data-testid="time-display">
            {time}
        </div>
    );
};

TimerDisplay.propTypes = {
    time: PropTypes.string.isRequired,
};

export default TimerDisplay;
