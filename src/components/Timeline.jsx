import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Timeline = ({ sessions, timeOffset }) => {
    const [nowMinutes, setNowMinutes] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date(Date.now() + timeOffset);
            setNowMinutes(now.getHours() * 60 + now.getMinutes());
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [timeOffset]);

    return (
        <div className="timeline" data-testid="timeline">
            {sessions.map((session, index) => {
                const sessionStart = session.startH * 60 + session.startM;
                const sessionEnd = sessionStart + session.duration;

                let className = `session-pill ${session.type}`;

                if (nowMinutes >= sessionEnd) {
                    className += ' past';
                } else if (nowMinutes >= sessionStart && nowMinutes < sessionEnd) {
                    className += ' active';
                }

                // Tooltip data
                const endM = session.startM + session.duration;
                const endH = session.startH + Math.floor(endM / 60);
                const displayEndM = endM % 60;
                const timeStr = `${session.startH}:${session.startM.toString().padStart(2, '0')} - ${endH}:${displayEndM.toString().padStart(2, '0')}`;
                const dataInfo = `${session.label} (${timeStr})`;

                return (
                    <div
                        key={index}
                        className={className}
                        data-info={dataInfo}
                        data-testid={`session-${index}`}
                    />
                );
            })}
        </div>
    );
};

Timeline.propTypes = {
    sessions: PropTypes.arrayOf(PropTypes.shape({
        startH: PropTypes.number,
        startM: PropTypes.number,
        duration: PropTypes.number,
        type: PropTypes.string,
        label: PropTypes.string
    })).isRequired,
    timeOffset: PropTypes.number.isRequired
};

export default Timeline;
